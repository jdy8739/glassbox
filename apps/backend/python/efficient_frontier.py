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
from datetime import datetime, timedelta
from pypfopt import EfficientFrontier, risk_models, expected_returns
from pypfopt.discrete_allocation import DiscreteAllocation, get_latest_prices

# Constants
MIN_DATA_POINTS = 30
TRADING_DAYS_PER_YEAR = 252
DEFAULT_RISK_FREE_RATE = 0.05
ES_MULTIPLIER = 50
MAX_RETRIES = 3


# ==================== Helper Functions ====================

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
                    time.sleep(1)
                    continue
                raise ValueError(f"No data for {ticker_symbol}")

            return hist['Close']

        except Exception as e:
            if attempt == MAX_RETRIES - 1:
                raise ValueError(f"Failed to fetch {ticker_symbol}: {str(e)}")
            time.sleep(1)

    raise ValueError(f"Failed to fetch {ticker_symbol} after {MAX_RETRIES} attempts")


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


# ==================== Main Functions ====================

def fetch_price_data(tickers, start_date=None, end_date=None):
    """
    Fetch historical adjusted close prices for given tickers

    Args:
        tickers: List of ticker symbols
        start_date: Start date (string YYYY-MM-DD or datetime, default: 3 years ago)
        end_date: End date (string YYYY-MM-DD or datetime, default: today)

    Returns:
        DataFrame with adjusted close prices
    """
    # Parse dates
    end_date = parse_date(end_date) or datetime.now()
    start_date = parse_date(start_date) or (end_date - timedelta(days=3*365))

    # Validate date range
    if start_date >= end_date:
        raise ValueError(
            f"Start date ({start_date.date()}) must be before end date ({end_date.date()})"
        )

    # Check for future dates
    now = datetime.now()
    if end_date > now:
        raise ValueError(f"End date ({end_date.date()}) cannot be in the future")

    if start_date > now:
        raise ValueError(f"Start date ({start_date.date()}) cannot be in the future")

    # Always include SGOV as risk-free asset
    if 'SGOV' not in tickers:
        tickers = tickers + ['SGOV']

    # Fetch data for each ticker
    all_prices = {}
    for ticker_symbol in tickers:
        all_prices[ticker_symbol] = fetch_single_ticker(ticker_symbol, start_date, end_date)

    # Combine and align dates (intersection)
    prices = pd.DataFrame(all_prices).dropna()

    # Validate sufficient data
    validate_data_sufficiency(prices, MIN_DATA_POINTS, "price")

    return prices


def calculate_efficient_frontier(prices, num_portfolios=10000):
    """
    Calculate efficient frontier using PyPortfolioOpt

    Args:
        prices: DataFrame with historical prices
        num_portfolios: Number of random portfolios to generate

    Returns:
        dict with GMV, Max Sharpe, and efficient frontier points
    """
    # Calculate expected returns and covariance matrix
    mu = expected_returns.mean_historical_return(prices)
    S = risk_models.sample_cov(prices)

    # Calculate risk-free rate
    risk_free_rate = calculate_annualized_risk_free_rate(prices)

    # === Global Minimum Variance (GMV) Portfolio ===
    ef_gmv = EfficientFrontier(mu, S)
    ef_gmv.min_volatility()
    gmv_weights = ef_gmv.clean_weights()
    gmv_performance = ef_gmv.portfolio_performance(verbose=False, risk_free_rate=risk_free_rate)

    # === Maximum Sharpe Ratio Portfolio ===
    ef_sharpe = EfficientFrontier(mu, S)
    ef_sharpe.max_sharpe(risk_free_rate=risk_free_rate)
    sharpe_weights = ef_sharpe.clean_weights()
    sharpe_performance = ef_sharpe.portfolio_performance(verbose=False, risk_free_rate=risk_free_rate)

    # === Generate Efficient Frontier Points ===
    frontier_points = []

    # Generate target returns from GMV return to Max return
    min_return = gmv_performance[0]
    max_return = sharpe_performance[0]
    target_returns = np.linspace(min_return, max_return * 1.2, 50)

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
            # Skip if optimization fails for this target return
            continue

    # === Generate Random Portfolios for Visualization ===
    random_portfolios = []
    n_assets = len(prices.columns)

    for _ in range(num_portfolios):
        # Generate random weights that sum to 1
        weights = np.random.random(n_assets)
        weights /= np.sum(weights)

        # Calculate metrics using helper function
        metrics = calculate_portfolio_metrics(weights, mu, S, risk_free_rate)
        random_portfolios.append(metrics)

    # Prepare result
    result = {
        'gmv': {
            'weights': {k: float(v) for k, v in gmv_weights.items()},
            'stats': {
                'return': float(gmv_performance[0]),
                'volatility': float(gmv_performance[1]),
                'sharpe': float(gmv_performance[2])
            }
        },
        'maxSharpe': {
            'weights': {k: float(v) for k, v in sharpe_weights.items()},
            'stats': {
                'return': float(sharpe_performance[0]),
                'volatility': float(sharpe_performance[1]),
                'sharpe': float(sharpe_performance[2])
            }
        },
        'efficientFrontier': frontier_points,
        'randomPortfolios': random_portfolios,
        'riskFreeRate': float(risk_free_rate)
    }

    return result


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

    # Fetch benchmark data
    start_date = prices.index[0]
    end_date = prices.index[-1]
    benchmark = yf.Ticker(benchmark_ticker)
    benchmark_data = benchmark.history(start=start_date, end=end_date, auto_adjust=True)

    if benchmark_data.empty:
        raise ValueError(f"Failed to fetch benchmark data for {benchmark_ticker}")

    return benchmark_data['Close']


def calculate_weighted_returns(prices, portfolio_weights):
    """
    Calculate weighted portfolio return series

    Args:
        prices: DataFrame with historical prices
        portfolio_weights: Dict of ticker -> weight

    Returns:
        pandas Series of portfolio returns
    """
    # Get tickers with positive weights
    portfolio_tickers = [t for t in portfolio_weights.keys() if portfolio_weights[t] > 0]

    if not portfolio_tickers:
        return pd.Series(dtype=float)

    # Calculate returns for each asset
    portfolio_returns = prices[portfolio_tickers].pct_change().dropna()

    # Apply weights
    weights_array = np.array([portfolio_weights[t] for t in portfolio_tickers])
    return portfolio_returns.dot(weights_array)


def calculate_portfolio_beta(prices, portfolio_weights, benchmark_ticker='SPY'):
    """
    Calculate portfolio beta against a benchmark using OLS regression

    Args:
        prices: DataFrame with historical prices
        portfolio_weights: Dict of ticker -> weight
        benchmark_ticker: Benchmark ticker (default: SPY)

    Returns:
        float: Portfolio beta
    """
    # Get benchmark prices
    benchmark_prices = fetch_benchmark_prices(prices, benchmark_ticker)

    # Calculate weighted portfolio returns
    portfolio_return_series = calculate_weighted_returns(prices, portfolio_weights)

    # Check if portfolio is empty
    if portfolio_return_series.empty:
        return 0.0

    # Calculate benchmark returns
    benchmark_returns = benchmark_prices.pct_change().dropna()

    # Align dates
    common_dates = portfolio_return_series.index.intersection(benchmark_returns.index)

    # Validate sufficient overlapping data
    validate_data_sufficiency(
        pd.Series(common_dates),
        MIN_DATA_POINTS,
        "overlapping data for beta calculation"
    )

    portfolio_return_series = portfolio_return_series[common_dates]
    benchmark_returns = benchmark_returns[common_dates]

    # Calculate beta using covariance method: β = Cov(R_p, R_m) / Var(R_m)
    covariance = np.cov(portfolio_return_series, benchmark_returns)[0][1]
    benchmark_variance = np.var(benchmark_returns)

    # Handle edge cases
    if np.isnan(covariance) or np.isnan(benchmark_variance) or benchmark_variance == 0:
        return 0.0

    return float(covariance / benchmark_variance)


def calculate_hedge_sizing(portfolio_beta, target_beta, portfolio_value, spy_price):
    """
    Calculate hedge sizing for SPY and ES futures

    Args:
        portfolio_beta: Current portfolio beta
        target_beta: Target beta (e.g., 0 for market-neutral)
        portfolio_value: Total portfolio value in dollars
        spy_price: Current SPY price

    Returns:
        dict with SPY and ES hedge sizing
    """
    # Calculate required hedge notional
    hedge_notional = (portfolio_beta - target_beta) * portfolio_value

    # SPY shares to short (avoid division by zero)
    if spy_price > 0:
        spy_shares = int(hedge_notional / spy_price)
        spy_notional = spy_shares * spy_price
    else:
        spy_shares = 0
        spy_notional = 0.0

    # ES futures (assuming $50 multiplier and current ES price ~= SPY * 10)
    es_multiplier = 50
    es_price = spy_price * 10  # Approximate ES price
    es_contract_value = es_price * es_multiplier

    # Avoid division by zero
    if es_contract_value > 0:
        es_contracts = int(hedge_notional / es_contract_value)
        es_notional = es_contracts * es_contract_value
    else:
        es_contracts = 0
        es_notional = 0.0

    return {
        'spyShares': spy_shares,
        'spyNotional': float(spy_notional),
        'esContracts': es_contracts,
        'esNotional': float(es_notional)
    }


def main():
    """
    Main function - expects JSON input from stdin
    Expected input format:
    {
        "tickers": ["AAPL", "MSFT", "NVDA"],
        "quantities": [10, 20, 15],
        "portfolioValue": 100000,
        "targetBeta": 0
    }
    """
    try:
        # Read input from stdin
        input_data = json.loads(sys.stdin.read())

        tickers = input_data.get('tickers', [])
        quantities = input_data.get('quantities', [])
        portfolio_value = input_data.get('portfolioValue', 100000)
        target_beta = input_data.get('targetBeta', 0)
        start_date = input_data.get('startDate')
        end_date = input_data.get('endDate')

        # Validate input
        if not tickers:
            raise ValueError("No tickers provided")

        if len(tickers) != len(quantities):
            raise ValueError(
                f"Tickers and quantities must have same length. "
                f"Got {len(tickers)} tickers and {len(quantities)} quantities"
            )

        # Check for duplicate tickers
        if len(tickers) != len(set(tickers)):
            duplicates = [t for t in tickers if tickers.count(t) > 1]
            raise ValueError(f"Duplicate tickers detected: {', '.join(set(duplicates))}")

        # Validate quantities
        if any(q < 0 for q in quantities):
            raise ValueError("Quantities must be non-negative")

        if all(q == 0 for q in quantities):
            raise ValueError("At least one asset must have positive quantity")

        # Fetch price data
        prices = fetch_price_data(tickers, start_date=start_date, end_date=end_date)

        # Calculate efficient frontier
        frontier_result = calculate_efficient_frontier(prices)

        # Calculate portfolio beta for Max Sharpe portfolio
        max_sharpe_weights = frontier_result['maxSharpe']['weights']
        portfolio_beta = calculate_portfolio_beta(prices, max_sharpe_weights)

        # Get latest SPY price for hedge calculation
        spy_ticker = yf.Ticker('SPY')
        spy_data = spy_ticker.history(period='1d', auto_adjust=True)
        spy_price = float(spy_data['Close'].iloc[-1]) if not spy_data.empty else 0.0

        # Calculate hedge sizing
        hedging = calculate_hedge_sizing(portfolio_beta, target_beta, portfolio_value, spy_price)

        # Combine all results
        result = {
            **frontier_result,
            'portfolioBeta': portfolio_beta,
            'hedging': hedging
        }

        # Output JSON result to stdout
        print(json.dumps(result, indent=2))
        sys.exit(0)

    except Exception as e:
        # Output error as JSON
        error_result = {
            'error': str(e),
            'type': type(e).__name__
        }
        print(json.dumps(error_result, indent=2))
        sys.exit(1)


if __name__ == '__main__':
    main()
