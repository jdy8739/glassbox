#!/usr/bin/env python3
"""
Efficient Frontier Calculation Script
Calculates portfolio optimization metrics using PyPortfolioOpt
"""

import sys
import json
import time
import yfinance as yf
import numpy as np
import pandas as pd
from datetime import datetime
from pypfopt import EfficientFrontier, risk_models, expected_returns

# Constants
MIN_DATA_POINTS = 30
TRADING_DAYS_PER_YEAR = 252
DEFAULT_RISK_FREE_RATE = 0.05
ES_MULTIPLIER = 50
MAX_RETRIES = 3


# ==================== Pure Helper Functions ====================

def parse_date(date_input):
    """
    Convert string date to datetime object

    Args:
        date_input: String (YYYY-MM-DD), datetime, or None

    Returns:
        datetime object or None
    """
    if date_input is None:
        return None
    if isinstance(date_input, str):
        return datetime.strptime(date_input, '%Y-%m-%d')
    return date_input


def validate_data_sufficiency(data, min_points=MIN_DATA_POINTS, data_type="price"):
    """
    Validate that we have sufficient data points

    Args:
        data: DataFrame or Series to validate
        min_points: Minimum required data points
        data_type: Description of data for error message

    Raises:
        ValueError if insufficient data
    """
    if data.empty or len(data) < min_points:
        raise ValueError(
            f"Insufficient {data_type} data. Need at least {min_points} points, got {len(data)}"
        )


def validate_input(tickers, quantities):
    """
    Validate tickers and quantities input

    Raises:
        ValueError if input is invalid
    """
    if not tickers:
        raise ValueError("No tickers provided")

    if len(tickers) != len(quantities):
        raise ValueError(
            f"Tickers and quantities must have same length. "
            f"Got {len(tickers)} tickers and {len(quantities)} quantities"
        )

    if len(tickers) != len(set(tickers)):
        duplicates = [t for t in tickers if tickers.count(t) > 1]
        raise ValueError(f"Duplicate tickers detected: {', '.join(set(duplicates))}")

    if any(q < 0 for q in quantities):
        raise ValueError("Quantities must be non-negative")

    if all(q == 0 for q in quantities):
        raise ValueError("At least one asset must have positive quantity")


def calculate_annualized_risk_free_rate(prices, ticker='SGOV'):
    """
    Calculate annualized risk-free rate from treasury ETF

    Args:
        prices: DataFrame with price data
        ticker: Treasury ETF ticker (default: SGOV)

    Returns:
        Annualized risk-free rate (float)
    """
    if ticker in prices.columns:
        returns = prices[ticker].pct_change().dropna()
        return returns.mean() * TRADING_DAYS_PER_YEAR
    return DEFAULT_RISK_FREE_RATE


def calculate_sharpe_ratio(portfolio_return, portfolio_std, risk_free_rate):
    """
    Calculate Sharpe ratio with zero-volatility handling

    Args:
        portfolio_return: Expected portfolio return
        portfolio_std: Portfolio standard deviation
        risk_free_rate: Risk-free rate

    Returns:
        Sharpe ratio (float)
    """
    if portfolio_std > 0:
        return (portfolio_return - risk_free_rate) / portfolio_std
    return 0.0


def calculate_portfolio_metrics(weights, mu, cov_matrix, risk_free_rate):
    """
    Calculate portfolio return, volatility, and Sharpe ratio

    Args:
        weights: Portfolio weights (numpy array)
        mu: Expected returns vector
        cov_matrix: Covariance matrix
        risk_free_rate: Risk-free rate

    Returns:
        dict with return, volatility, and sharpeRatio
    """
    portfolio_return = np.dot(weights, mu)
    portfolio_std = np.sqrt(np.dot(weights.T, np.dot(cov_matrix, weights)))
    sharpe = calculate_sharpe_ratio(portfolio_return, portfolio_std, risk_free_rate)

    return {
        'return': float(portfolio_return),
        'volatility': float(portfolio_std),
        'sharpeRatio': float(sharpe)
    }


def calculate_user_portfolio(tickers, quantities, latest_prices):
    """
    Convert user's share quantities into portfolio value and weights

    Args:
        tickers: List of ticker symbols (user's assets only, no SGOV)
        quantities: List of share counts per ticker
        latest_prices: Series of latest prices indexed by ticker

    Returns:
        dict with 'value' (float) and 'weights' (dict of ticker -> weight)
    """
    dollar_values = [quantities[i] * latest_prices[tickers[i]] for i in range(len(tickers))]
    total_value = sum(dollar_values)

    weights = {
        tickers[i]: dollar_values[i] / total_value
        for i in range(len(tickers))
    }

    return {
        'value': float(total_value),
        'weights': weights
    }


def weights_dict_to_array(weights_dict, columns):
    """
    Convert a weights dict to an array aligned with DataFrame columns

    Args:
        weights_dict: Dict of ticker -> weight
        columns: DataFrame columns (Index) defining the order

    Returns:
        numpy array of weights
    """
    return np.array([weights_dict.get(col, 0.0) for col in columns])


def calculate_hedge_sizing(portfolio_beta, target_beta, portfolio_value, spy_price):
    """
    Calculate hedge sizing for SPY and ES futures

    Args:
        portfolio_beta: Current portfolio beta
        target_beta: Target beta (e.g., 0 for market-neutral)
        portfolio_value: Total portfolio value in dollars
        spy_price: Current SPY price

    Returns:
        dict with SPY and ES hedge sizing plus target beta
    """
    if spy_price <= 0:
        raise ValueError(
            f"Invalid SPY price: {spy_price}. Cannot calculate hedge sizing with zero or negative price."
        )

    # Required hedge notional: (current - target) × portfolio value
    hedge_notional = (portfolio_beta - target_beta) * portfolio_value

    # SPY shares to short
    spy_shares = int(hedge_notional / spy_price)
    spy_notional = spy_shares * spy_price

    # ES futures ($50 multiplier, ES price ≈ SPY × 10)
    es_price = spy_price * 10
    es_contract_value = es_price * ES_MULTIPLIER
    es_contracts = int(hedge_notional / es_contract_value)
    es_notional = es_contracts * es_contract_value

    return {
        'spyShares': spy_shares,
        'spyNotional': float(spy_notional),
        'esContracts': es_contracts,
        'esNotional': float(es_notional),
        'targetBeta': float(target_beta)
    }


# ==================== Data Fetching ====================

def fetch_single_ticker(ticker_symbol, start_date, end_date):
    """
    Fetch historical price data for a single ticker with retry logic

    Args:
        ticker_symbol: Ticker symbol to fetch
        start_date: Start date (datetime)
        end_date: End date (datetime)

    Returns:
        pandas Series of adjusted close prices

    Raises:
        ValueError if fetch fails after retries
    """
    for attempt in range(MAX_RETRIES):
        try:
            ticker = yf.Ticker(ticker_symbol)
            hist = ticker.history(start=start_date, end=end_date, auto_adjust=True)

            if hist.empty:
                if attempt < MAX_RETRIES - 1:
                    print(f"[WARN] {ticker_symbol}: no data (attempt {attempt + 1}/{MAX_RETRIES}), retrying...", file=sys.stderr)
                    time.sleep(2)
                    continue
                raise ValueError(f"No data for {ticker_symbol} (Yahoo Finance may be rate-limited)")

            return hist['Close']

        except ValueError:
            raise
        except Exception as e:
            print(f"[ERROR] {ticker_symbol}: {str(e)} (attempt {attempt + 1}/{MAX_RETRIES})", file=sys.stderr)
            if attempt == MAX_RETRIES - 1:
                raise ValueError(f"Failed to fetch {ticker_symbol}: {str(e)}")
            time.sleep(2)

    raise ValueError(f"Failed to fetch {ticker_symbol} after {MAX_RETRIES} attempts")


def fetch_price_data(tickers, start_date=None, end_date=None):
    """
    Fetch historical adjusted close prices for given tickers

    Args:
        tickers: List of ticker symbols
        start_date: Start date (string YYYY-MM-DD or datetime)
        end_date: End date (string YYYY-MM-DD or datetime)

    Returns:
        DataFrame with adjusted close prices
    """
    end_date = parse_date(end_date)
    start_date = parse_date(start_date)

    if start_date >= end_date:
        raise ValueError(
            f"Start date ({start_date.date()}) must be before end date ({end_date.date()})"
        )

    now = datetime.now()
    today = now.date()

    if end_date > now:
        raise ValueError(f"End date ({end_date.date()}) cannot be in the future")

    if start_date > now:
        raise ValueError(f"Start date ({start_date.date()}) cannot be in the future")

    if end_date.date() == today:
        import warnings
        warnings.warn(
            f"End date is today ({today}). Market data may be incomplete if "
            f"markets are still open or haven't fully updated. "
            f"Consider using yesterday's date for complete data.",
            UserWarning
        )

    # Always include SGOV as risk-free asset
    if 'SGOV' not in tickers:
        tickers = tickers + ['SGOV']

    all_prices = {}
    for ticker_symbol in tickers:
        all_prices[ticker_symbol] = fetch_single_ticker(ticker_symbol, start_date, end_date)

    # Combine and align dates (intersection)
    prices = pd.DataFrame(all_prices).dropna()

    validate_data_sufficiency(prices, MIN_DATA_POINTS, "price")

    return prices


def fetch_benchmark_prices(prices, benchmark_ticker='SPY'):
    """
    Fetch or extract benchmark prices

    Args:
        prices: DataFrame with portfolio price data
        benchmark_ticker: Benchmark ticker symbol

    Returns:
        pandas Series of benchmark prices
    """
    if benchmark_ticker in prices.columns:
        return prices[benchmark_ticker]

    start_date = prices.index[0]
    end_date = prices.index[-1]
    benchmark = yf.Ticker(benchmark_ticker)
    benchmark_data = benchmark.history(start=start_date, end=end_date, auto_adjust=True)

    if benchmark_data.empty:
        raise ValueError(f"Failed to fetch benchmark data for {benchmark_ticker}")

    return benchmark_data['Close']


def fetch_latest_spy_price():
    """
    Fetch latest SPY price for hedge calculation

    Returns:
        float: Latest SPY price

    Raises:
        ValueError if fetch fails
    """
    spy_ticker = yf.Ticker('SPY')
    spy_data = spy_ticker.history(period='1d', auto_adjust=True)

    if spy_data.empty:
        raise ValueError(
            "Failed to fetch current SPY price for hedge calculation. "
            "This is required to calculate hedge sizing. Please try again later."
        )

    return float(spy_data['Close'].iloc[-1])


# ==================== Main Calculations ====================

def optimize_portfolio(mu, S, objective, risk_free_rate):
    """
    Run a single portfolio optimization and return weights + stats

    Args:
        mu: Expected returns vector
        S: Covariance matrix
        objective: 'min_volatility' or 'max_sharpe'
        risk_free_rate: Risk-free rate

    Returns:
        dict with 'weights' (dict) and 'stats' (dict with return, volatility, sharpe)
    """
    ef = EfficientFrontier(mu, S)

    if objective == 'min_volatility':
        ef.min_volatility()
    elif objective == 'max_sharpe':
        ef.max_sharpe(risk_free_rate=risk_free_rate)

    weights = ef.clean_weights()
    perf = ef.portfolio_performance(verbose=False, risk_free_rate=risk_free_rate)

    return {
        'weights': {k: float(v) for k, v in weights.items()},
        'stats': {
            'return': float(perf[0]),
            'volatility': float(perf[1]),
            'sharpe': float(perf[2])
        }
    }


def calculate_efficient_frontier(prices, num_portfolios=10000):
    """
    Calculate efficient frontier using PyPortfolioOpt

    Args:
        prices: DataFrame with historical prices
        num_portfolios: Number of random portfolios to generate

    Returns:
        dict with GMV, Max Sharpe, frontier points, random portfolios, mu, S, riskFreeRate
    """
    mu = expected_returns.mean_historical_return(prices)
    S = risk_models.sample_cov(prices)
    risk_free_rate = calculate_annualized_risk_free_rate(prices)

    # Optimal portfolios
    gmv = optimize_portfolio(mu, S, 'min_volatility', risk_free_rate)
    max_sharpe = optimize_portfolio(mu, S, 'max_sharpe', risk_free_rate)

    # Efficient Frontier Points
    frontier_points = []
    target_returns = np.linspace(gmv['stats']['return'], max_sharpe['stats']['return'] * 1.2, 50)

    for target_return in target_returns:
        try:
            ef_temp = EfficientFrontier(mu, S)
            ef_temp.efficient_return(target_return)
            perf = ef_temp.portfolio_performance(verbose=False, risk_free_rate=risk_free_rate)

            frontier_points.append({
                'return': float(perf[0]),
                'volatility': float(perf[1]),
                'sharpeRatio': float(perf[2])
            })
        except Exception:
            continue

    # Random Portfolios for Visualization
    random_portfolios = []
    n_assets = len(prices.columns)

    for _ in range(num_portfolios):
        weights = np.random.random(n_assets)
        weights /= np.sum(weights)
        random_portfolios.append(calculate_portfolio_metrics(weights, mu, S, risk_free_rate))

    return {
        'gmv': gmv,
        'maxSharpe': max_sharpe,
        'efficientFrontier': frontier_points,
        'randomPortfolios': random_portfolios,
        'riskFreeRate': float(risk_free_rate),
        'mu': mu,
        'S': S
    }


def calculate_weighted_returns(prices, portfolio_weights):
    """
    Calculate weighted portfolio return series

    Args:
        prices: DataFrame with historical prices
        portfolio_weights: Dict of ticker -> weight

    Returns:
        pandas Series of portfolio returns
    """
    portfolio_tickers = [t for t in portfolio_weights.keys() if portfolio_weights[t] > 0]

    if not portfolio_tickers:
        return pd.Series(dtype=float)

    portfolio_returns = prices[portfolio_tickers].pct_change().dropna()
    weights_array = np.array([portfolio_weights[t] for t in portfolio_tickers])
    return portfolio_returns.dot(weights_array)


def calculate_portfolio_beta(prices, portfolio_weights, benchmark_ticker='SPY'):
    """
    Calculate portfolio beta against a benchmark using covariance method

    β = Cov(R_portfolio, R_benchmark) / Var(R_benchmark)

    Args:
        prices: DataFrame with historical prices
        portfolio_weights: Dict of ticker -> weight
        benchmark_ticker: Benchmark ticker (default: SPY)

    Returns:
        float: Portfolio beta
    """
    benchmark_prices = fetch_benchmark_prices(prices, benchmark_ticker)
    portfolio_return_series = calculate_weighted_returns(prices, portfolio_weights)

    if portfolio_return_series.empty:
        return 0.0

    benchmark_returns = benchmark_prices.pct_change().dropna()

    # Align dates
    common_dates = portfolio_return_series.index.intersection(benchmark_returns.index)

    validate_data_sufficiency(
        pd.Series(common_dates),
        MIN_DATA_POINTS,
        "overlapping data for beta calculation"
    )

    portfolio_return_series = portfolio_return_series[common_dates]
    benchmark_returns = benchmark_returns[common_dates]

    # β = Cov(R_p, R_m) / Var(R_m), both using sample statistics (ddof=1)
    covariance = np.cov(portfolio_return_series, benchmark_returns)[0][1]
    benchmark_variance = np.var(benchmark_returns, ddof=1)

    if np.isnan(covariance) or np.isnan(benchmark_variance) or benchmark_variance == 0:
        return 0.0

    return float(covariance / benchmark_variance)


# ==================== Entry Point ====================

def main():
    """
    Main entry point - reads JSON from stdin, runs full analysis pipeline

    Input: { tickers, quantities, targetBeta, startDate, endDate }
    Output: { gmv, maxSharpe, efficientFrontier, myPortfolio, portfolioBeta, hedging }
    """
    try:
        input_data = json.loads(sys.stdin.read())

        tickers = input_data.get('tickers', [])
        quantities = input_data.get('quantities', [])
        target_beta = input_data.get('targetBeta', 0)
        start_date = input_data['startDate']
        end_date = input_data['endDate']

        # 1. Validate
        validate_input(tickers, quantities)

        # 2. Fetch prices
        prices = fetch_price_data(tickers, start_date=start_date, end_date=end_date)

        # 3. Efficient frontier (theoretical optimal portfolios)
        frontier_result = calculate_efficient_frontier(prices)
        mu = frontier_result.pop('mu')
        S = frontier_result.pop('S')

        # 4. User's actual portfolio (from quantities × latest prices)
        user_portfolio = calculate_user_portfolio(tickers, quantities, prices.iloc[-1])

        # 5. User's portfolio metrics (position on frontier chart)
        user_weights_array = weights_dict_to_array(user_portfolio['weights'], prices.columns)
        user_metrics = calculate_portfolio_metrics(user_weights_array, mu, S, frontier_result['riskFreeRate'])

        # 6. Beta for user's actual portfolio
        portfolio_beta = calculate_portfolio_beta(prices, user_portfolio['weights'])

        # 7. Hedge sizing (using real portfolio value and real beta)
        spy_price = fetch_latest_spy_price()
        hedging = calculate_hedge_sizing(portfolio_beta, target_beta, user_portfolio['value'], spy_price)

        # 8. Combine
        result = {
            **frontier_result,
            'myPortfolio': {
                'weights': user_portfolio['weights'],
                'stats': user_metrics,
                'value': user_portfolio['value']
            },
            'portfolioBeta': portfolio_beta,
            'hedging': hedging
        }

        print(json.dumps(result, indent=2))
        sys.exit(0)

    except Exception as e:
        error_result = {
            'error': str(e),
            'type': type(e).__name__
        }
        print(json.dumps(error_result, indent=2))
        sys.exit(1)


if __name__ == '__main__':
    main()
