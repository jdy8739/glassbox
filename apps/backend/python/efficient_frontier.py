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
MIN_DATA_POINTS = 252
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
        # Use arithmetic annualization to match MPT framework and consistent expected returns
        return float(returns.mean() * TRADING_DAYS_PER_YEAR)
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
    Fetch historical adjusted close prices for given tickers using batch download

    Args:
        tickers: List of ticker symbols
        start_date: Start date (string YYYY-MM-DD or datetime)
        end_date: End date (string YYYY-MM-DD or datetime)

    Returns:
        DataFrame with adjusted close prices
    """
    # Parse dates (always provided from frontend)
    end_date = parse_date(end_date)
    start_date = parse_date(start_date)

    # Validate date range
    if start_date >= end_date:
        raise ValueError(
            f"Start date ({start_date.date()}) must be before end date ({end_date.date()})"
        )

    # Check for future dates
    now = datetime.now()
    today = now.date()

    if end_date > now:
        raise ValueError(f"End date ({end_date.date()}) cannot be in the future")

    if start_date > now:
        raise ValueError(f"Start date ({start_date.date()}) cannot be in the future")

    # Warn if end date is today (market may not be closed yet)
    if end_date.date() == today:
        import warnings
        warnings.warn(
            f"End date is today ({today}). Market data may be incomplete.",
            UserWarning
        )

    # Always include SGOV (risk-free) and SPY (benchmark) for calculations
    fetch_list = list(set(tickers + ['SGOV', 'SPY']))

    try:
        # Fetch all tickers in a single batch request (more efficient)
        data = yf.download(fetch_list, start=start_date, end=end_date, auto_adjust=True, progress=False)

        if data.empty:
            raise ValueError(f"No data found for tickers: {', '.join(fetch_list)}")

        # Extract Close prices. yf.download returns a MultiIndex if multiple tickers
        if isinstance(data.columns, pd.MultiIndex):
            prices = data['Close']
        else:
            # Single ticker case (though we always have at least 3: user + SGOV + SPY)
            prices = data[['Close']]
            prices.columns = fetch_list

        # Align dates across all tickers
        prices = prices.dropna()

    except Exception as e:
        raise ValueError(f"Failed to fetch market data: {str(e)}")

    # Validate sufficient data
    validate_data_sufficiency(prices, MIN_DATA_POINTS, "price")

    return prices


def calculate_efficient_frontier(prices, num_portfolios=10000, user_weights=None):
    """
    Calculate efficient frontier using PyPortfolioOpt

    Args:
        prices: DataFrame with historical prices
        num_portfolios: Number of random portfolios to generate
        user_weights: Optional dict of ticker -> weight for user's actual portfolio

    Returns:
        dict with GMV, Max Sharpe, efficient frontier points, and myPortfolio if user_weights provided
    """
    # Calculate expected returns (arithmetic for MPT consistency) and covariance matrix
    mu = expected_returns.mean_historical_return(prices, compounding=False)
    S = risk_models.sample_cov(prices)

    # Calculate risk-free rate
    risk_free_rate = calculate_annualized_risk_free_rate(prices)

    # Note: SGOV is included as an investable asset, not separated as a pure risk-free asset.
    # This reflects real portfolio usage of T-bill ETFs, though it deviates from classical CML theory.

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

    # Generate target returns from GMV return to above Max Sharpe return
    min_return = gmv_performance[0]
    max_return = sharpe_performance[0]
    range_size = abs(max_return - min_return)
    upper_target = max_return + 1.0 * range_size
    target_returns = np.linspace(min_return, upper_target, 50)

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

    # Warning for sparse frontier (Fix 3)
    frontier_warning = None
    if len(frontier_points) < 10:
        frontier_warning = f"Only {len(frontier_points)} frontier points computed. Chart may appear sparse."

    # === Generate Random Portfolios for Visualization ===
    random_portfolios = []
    n_assets = len(prices.columns)

    for _ in range(num_portfolios):
        # Generate random weights that sum to 1
        weights = np.random.dirichlet(np.ones(n_assets))

        # Calculate metrics using helper function
        metrics = calculate_portfolio_metrics(weights, mu, S, risk_free_rate)
        random_portfolios.append(metrics)

    # === User Portfolio Stats (myPortfolio) ===
    my_portfolio = None
    if user_weights is not None:
        # Build weights array aligned to prices column order
        weights_array = np.array([user_weights.get(t, 0.0) for t in prices.columns])
        total = weights_array.sum()
        if total > 0:
            weights_array /= total
        my_portfolio_metrics = calculate_portfolio_metrics(weights_array, mu, S, risk_free_rate)
        my_portfolio = {
            # Filter zero weights to match clean_weights() behavior (Fix 6)
            'weights': {t: float(user_weights.get(t, 0.0)) for t in prices.columns
                        if user_weights.get(t, 0.0) > 0.0001},
            'stats': my_portfolio_metrics
        }

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
        'frontierWarning': frontier_warning,
        'randomPortfolios': random_portfolios,
        'riskFreeRate': float(risk_free_rate),
        'myPortfolio': my_portfolio
    }

    return result


def calculate_weighted_returns(prices, portfolio_weights):
    """
    Calculate weighted portfolio return series.

    Note: Applies fixed weights across entire history, equivalent to assuming
    daily rebalancing. For buy-and-hold portfolios, this understates beta
    when high-beta assets have appreciated significantly.

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
        prices: DataFrame with historical prices (must include benchmark_ticker)
        portfolio_weights: Dict of ticker -> weight
        benchmark_ticker: Benchmark ticker (default: SPY)

    Returns:
        float: Portfolio beta
    """
    # Get benchmark prices from already-fetched data
    if benchmark_ticker not in prices.columns:
        raise ValueError(f"Benchmark {benchmark_ticker} missing from price data")

    benchmark_prices = prices[benchmark_ticker]

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
    # Both np.cov and np.var use ddof=1 (sample estimators) for consistency
    covariance = np.cov(portfolio_return_series, benchmark_returns)[0][1]
    benchmark_variance = np.var(benchmark_returns, ddof=1)

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
    # Validate SPY price
    if spy_price <= 0:
        raise ValueError(
            f"Invalid SPY price: {spy_price}. Cannot calculate hedge sizing with zero or negative price."
        )

    # Calculate required hedge notional
    hedge_notional = (portfolio_beta - target_beta) * portfolio_value

    # Determine hedge direction before taking absolute value
    if hedge_notional > 0:
        hedge_direction = 'SHORT'   # Sell to reduce beta
    elif hedge_notional < 0:
        hedge_direction = 'BUY'     # Buy to increase beta toward target
    else:
        hedge_direction = 'NONE'

    abs_notional = abs(hedge_notional)

    # SPY shares (always positive; direction conveyed by hedgeDirection)
    spy_shares = int(abs_notional / spy_price)
    spy_notional = spy_shares * spy_price

    # ES futures (assuming $50 multiplier and current ES price ~= SPY * 10)
    es_price = spy_price * 10  # Approximate ES price
    es_contract_value = es_price * ES_MULTIPLIER

    # Calculate ES contracts (spy_price validated above, so es_contract_value > 0)
    es_contracts = int(abs_notional / es_contract_value)
    es_notional = es_contracts * es_contract_value

    return {
        'spyShares': spy_shares,
        'spyNotional': float(spy_notional),
        'esContracts': es_contracts,
        'esNotional': float(es_notional),
        'hedgeDirection': hedge_direction
    }


def main():
    """
    Main function - expects JSON input from stdin
    """
    try:
        # Read input from stdin
        input_data = json.loads(sys.stdin.read())

        tickers = input_data.get('tickers', [])
        quantities = input_data.get('quantities', [])
        target_beta = input_data.get('targetBeta', 0)
        start_date = input_data['startDate']  # Required
        end_date = input_data['endDate']  # Required

        # Validate input
        if not tickers:
            raise ValueError("No tickers provided")

        if len(tickers) != len(quantities):
            raise ValueError("Tickers and quantities must have same length.")

        # Check for duplicate tickers
        if len(tickers) != len(set(tickers)):
            duplicates = [t for t in tickers if tickers.count(t) > 1]
            raise ValueError(f"Duplicate tickers detected: {', '.join(set(duplicates))}")

        # Validate quantities
        if any(q < 0 for q in quantities):
            raise ValueError("Quantities must be non-negative")

        if all(q == 0 for q in quantities):
            raise ValueError("At least one asset must have positive quantity")

        # Fetch price data using batch download
        prices = fetch_price_data(tickers, start_date=start_date, end_date=end_date)

        # Calculate user portfolio weights from latest prices in dataset
        latest_prices = {t: float(prices[t].iloc[-1]) for t in tickers}
        user_values = {tickers[i]: quantities[i] * latest_prices[tickers[i]] for i in range(len(tickers))}
        total_user_value = sum(user_values.values())

        if total_user_value <= 0:
            raise ValueError("Total portfolio value is zero. Check that quantities and prices are valid.")

        user_weights = {t: v / total_user_value for t, v in user_values.items()}

        # Calculate efficient frontier
        frontier_result = calculate_efficient_frontier(prices, user_weights=user_weights)

        # Calculate portfolio beta from user's actual portfolio (not Max Sharpe)
        portfolio_beta = calculate_portfolio_beta(prices, user_weights)

        # Current SPY price for hedging (from latest price in our fetched dataset)
        spy_price = float(prices['SPY'].iloc[-1])

        # Calculate hedge sizing based on total_user_value (live market value)
        hedging = calculate_hedge_sizing(portfolio_beta, target_beta, total_user_value, spy_price)

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
