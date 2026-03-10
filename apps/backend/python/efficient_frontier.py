#!/usr/bin/env python3
"""
Efficient Frontier Calculation Script
Calculates portfolio optimization metrics using PyPortfolioOpt
"""

import sys
import json
import gc
import time
import yfinance as yf
import numpy as np
import pandas as pd
from datetime import datetime
from pypfopt import EfficientFrontier, risk_models, expected_returns

# Constants
MIN_DATA_POINTS = 60
TRADING_DAYS_PER_YEAR = 252
DEFAULT_RISK_FREE_RATE = 0.05
ES_MULTIPLIER = 50
MAX_RETRIES = 3
FRONTIER_POINTS = 30     # Reduced from 50 — cuts EfficientFrontier instances by 40%
RANDOM_PORTFOLIOS = 500  # Reduced from 1000 — halves random portfolio memory
SYSTEM_TICKERS = ('SGOV', 'SPY')  # Always added to downloads; excluded from user-facing errors


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


def fetch_all_tickers_batch(tickers, start_date, end_date):
    """
    Batch-download historical Close prices for all tickers in one HTTP session.

    Using yf.download() instead of per-ticker yf.Ticker().history() avoids
    creating N separate HTTP sessions and N full OHLCV DataFrames in memory.

    Args:
        tickers: List of ticker symbols
        start_date: Start date (datetime)
        end_date: End date (datetime)

    Returns:
        DataFrame of adjusted Close prices (columns = tickers)

    Raises:
        ValueError if download fails or any ticker returns no data
    """
    for attempt in range(MAX_RETRIES):
        try:
            raw_data = yf.download(
                tickers, start=start_date, end=end_date,
                auto_adjust=True, progress=False
            )
            if not raw_data.empty:
                break
            if attempt < MAX_RETRIES - 1:
                time.sleep(1)
                continue
            raise ValueError("yf.download() returned empty data")
        except Exception as e:
            if attempt == MAX_RETRIES - 1:
                raise ValueError(f"Failed to fetch price data: {str(e)}")
            time.sleep(1)

    # Extract only Close prices — drop Open/High/Low/Volume immediately
    if isinstance(raw_data.columns, pd.MultiIndex):
        prices = raw_data['Close'].copy()
    else:
        # Single-ticker edge case: flat columns
        prices = raw_data[['Close']].copy()
        prices.columns = tickers

    del raw_data  # free full OHLCV DataFrame immediately
    gc.collect()

    # Validate each ticker has non-empty data
    missing = [t for t in tickers if t not in prices.columns or prices[t].isna().all()]
    if missing:
        raise ValueError(f"No data returned for: {', '.join(missing)}")

    return prices


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
        return (1 + returns.mean()) ** TRADING_DAYS_PER_YEAR - 1
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


def calculate_actual_portfolio_weights(prices, tickers, quantities):
    """
    Compute value-weighted portfolio weights from user quantities and latest prices.

    Args:
        prices: DataFrame with historical prices (all columns including SGOV)
        tickers: List of user-provided ticker symbols
        quantities: List of share quantities matching tickers order

    Returns:
        Tuple of (weights dict keyed by all price columns, total portfolio value)
    """
    latest_prices = prices.iloc[-1]

    values = {}
    for ticker, qty in zip(tickers, quantities):
        if ticker in latest_prices.index and qty > 0:
            values[ticker] = qty * float(latest_prices[ticker])

    total_value = sum(values.values())
    if total_value == 0:
        raise ValueError("Portfolio has zero total value — check quantities and tickers")

    # Build weights for all columns in prices (non-user tickers get weight 0)
    weights = {col: values.get(col, 0.0) / total_value for col in prices.columns}

    return weights, total_value


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
        # Note: US markets close at 4 PM EST (9 PM UTC)
        # Data may be incomplete if analysis runs before market close
        import warnings
        warnings.warn(
            f"End date is today ({today}). Market data may be incomplete if "
            f"markets are still open or haven't fully updated. "
            f"Consider using yesterday's date for complete data.",
            UserWarning
        )

    # Always include SGOV (risk-free) and SPY (benchmark) in the batch download.
    download_tickers = list(tickers)
    for system_ticker in SYSTEM_TICKERS:
        if system_ticker not in download_tickers:
            download_tickers.append(system_ticker)

    # Batch download — one HTTP session, one OHLCV DataFrame, extract Close only
    raw = fetch_all_tickers_batch(download_tickers, start_date, end_date)

    # Flaw 1: Detect short-history penalty before silently dropping rows.
    # If one ticker has a shorter history, .dropna() truncates ALL others.
    full_rows = len(raw)
    culprits = [t for t in raw.columns if raw[t].isna().any()]
    prices = raw.dropna()
    del raw  # free intermediate; prices is the final cleaned form
    gc.collect()

    dropped = full_rows - len(prices)
    if dropped > 0:
        pct = dropped / full_rows * 100
        if pct > 30:
            # Only show user-provided tickers in the error — system tickers can't be removed.
            user_culprits = [t for t in culprits if t not in SYSTEM_TICKERS] or culprits
            raise ValueError(
                f"Data truncation too severe: {dropped}/{full_rows} rows dropped ({pct:.0f}%) "
                f"due to limited history for: {', '.join(user_culprits)}. "
                f"Shorten your date range or remove these tickers."
            )

    validate_data_sufficiency(prices, MIN_DATA_POINTS, "price")

    return prices


def calculate_efficient_frontier(prices, num_portfolios=RANDOM_PORTFOLIOS, actual_weights=None):
    """
    Calculate efficient frontier using PyPortfolioOpt

    Args:
        prices: DataFrame with historical prices
        num_portfolios: Number of random portfolios to generate for visualization
        actual_weights: Optional dict of ticker -> weight for the user's real portfolio

    Returns:
        dict with GMV, Max Sharpe, efficient frontier points, and optionally myPortfolio
    """
    # Flaw 4: Exclude system tickers from the optimization universe.
    # SGOV has non-zero variance which skews the covariance matrix.
    # SPY is a benchmark — exclude it unless the user explicitly holds it.
    risk_free_rate = calculate_annualized_risk_free_rate(prices)
    exclude = ['SGOV']
    if actual_weights is None or actual_weights.get('SPY', 0.0) == 0.0:
        exclude.append('SPY')
    opt_prices = prices.drop(columns=exclude, errors='ignore')

    mu = expected_returns.mean_historical_return(opt_prices, compounding=False)
    S = risk_models.sample_cov(opt_prices)

    # === Global Minimum Variance (GMV) Portfolio ===
    ef_gmv = EfficientFrontier(mu, S)
    ef_gmv.min_volatility()
    gmv_weights = ef_gmv.clean_weights()
    gmv_performance = ef_gmv.portfolio_performance(verbose=False, risk_free_rate=risk_free_rate)
    del ef_gmv

    # === Maximum Sharpe Ratio Portfolio ===
    ef_sharpe = EfficientFrontier(mu, S)
    ef_sharpe.max_sharpe(risk_free_rate=risk_free_rate)
    sharpe_weights = ef_sharpe.clean_weights()
    sharpe_performance = ef_sharpe.portfolio_performance(verbose=False, risk_free_rate=risk_free_rate)
    del ef_sharpe

    # === Generate Efficient Frontier Points ===
    frontier_points = []

    # Fix 3: Use mu.max() as the upper bound — Max Sharpe sits in the middle of
    # the frontier, not at the top. Capping at maxSharpe * 1.2 truncates the curve.
    min_return = gmv_performance[0]
    max_return = float(mu.max())
    target_returns = np.linspace(min_return, max_return, FRONTIER_POINTS)

    for target_return in target_returns:
        ef_temp = None
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
            pass
        finally:
            del ef_temp  # release CVXPY solver object immediately each iteration

    gc.collect()  # sweep any lingering solver internals after the loop

    # === Generate Random Portfolios for Visualization ===
    random_portfolios = []
    n_assets = len(opt_prices.columns)

    for _ in range(num_portfolios):
        # alpha=0.5 balances between equal-weight concentration (alpha=1)
        # and corner-spiking (alpha=0.2), giving a natural spread across the simplex.
        weights = np.random.dirichlet(np.full(n_assets, 0.5))

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

    if actual_weights is not None:
        actual_weights_array = np.array([actual_weights.get(col, 0.0) for col in opt_prices.columns])
        cash_weight = actual_weights.get('SGOV', 0.0)
        
        # Calculate risk/volatility using only the risky assets
        portfolio_std = np.sqrt(np.dot(actual_weights_array.T, np.dot(S, actual_weights_array)))
        
        # Expected return = (risky assets return) + (cash return)
        portfolio_return = np.dot(actual_weights_array, mu) + (cash_weight * risk_free_rate)
        
        # Calculate true Sharpe Ratio
        sharpe = calculate_sharpe_ratio(portfolio_return, portfolio_std, risk_free_rate)

        result['myPortfolio'] = {
            'weights': {k: v for k, v in actual_weights.items() if v > 0},
            'stats': {
                'return': float(portfolio_return),
                'volatility': float(portfolio_std),
                'sharpeRatio': float(sharpe)
            }
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



def calculate_asset_beta(asset_returns, benchmark_returns):
    """
    Calculate beta for a single asset using consistent sample covariance.

    Returns float beta, or 0.0 on edge cases.
    """
    common = asset_returns.index.intersection(benchmark_returns.index)
    if len(common) < MIN_DATA_POINTS:
        return 0.0

    a = asset_returns[common]
    b = benchmark_returns[common]
    cov_matrix = np.cov(a, b)
    cov = cov_matrix[0][1]
    var = cov_matrix[1][1]

    if np.isnan(cov) or np.isnan(var) or var == 0:
        return 0.0

    return float(cov / var)


def calculate_portfolio_beta(prices, portfolio_weights, benchmark_ticker='SPY'):
    """
    Calculate portfolio beta as weighted sum of individual asset betas.

    Flaw 3 fix: dot-product of current weights × historical returns simulates
    daily rebalancing (rebalancing drag). Real portfolios drift (buy-and-hold).
    β_portfolio = Σ w_i × β_i correctly reflects the current snapshot beta
    without assuming any rebalancing strategy.
    """
    benchmark_prices = fetch_benchmark_prices(prices, benchmark_ticker)
    benchmark_returns = benchmark_prices.pct_change().dropna()

    portfolio_beta = 0.0
    for ticker, weight in portfolio_weights.items():
        if weight <= 0 or ticker not in prices.columns:
            continue
        asset_returns = prices[ticker].pct_change().dropna()
        beta_i = calculate_asset_beta(asset_returns, benchmark_returns)
        portfolio_beta += weight * beta_i

    return portfolio_beta


def calculate_hedge_sizing(portfolio_beta, target_beta, portfolio_value, spy_price, es_index_price=None):
    """
    Calculate hedge sizing for SPY and ES futures

    Args:
        portfolio_beta: Current portfolio beta
        target_beta: Target beta (e.g., 0 for market-neutral)
        portfolio_value: Total portfolio value in dollars
        spy_price: Current SPY price
        es_index_price: Current S&P 500 index level (^GSPC); falls back to spy_price * 10

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

    # SPY shares to short
    spy_shares = int(hedge_notional / spy_price)
    spy_notional = spy_shares * spy_price

    # ES futures: use pre-fetched index level to avoid a hidden network call here
    es_price = es_index_price if es_index_price else spy_price * 10
    es_contract_value = es_price * ES_MULTIPLIER

    # Calculate ES contracts (spy_price validated above, so es_contract_value > 0)
    es_contracts = int(hedge_notional / es_contract_value)
    es_notional = es_contracts * es_contract_value

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
        "targetBeta": 0,
        "startDate": "2023-01-01",
        "endDate": "2024-12-31"
    }
    """
    try:
        # Read input from stdin
        input_data = json.loads(sys.stdin.read())

        tickers = input_data.get('tickers', [])
        quantities = input_data.get('quantities', [])
        portfolio_value = input_data.get('portfolioValue', 100000)
        target_beta = input_data.get('targetBeta', 0)
        start_date = input_data['startDate']  # Required
        end_date = input_data['endDate']  # Required

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

        # Fix 1: Compute user's actual portfolio weights from quantities and latest prices
        actual_weights, computed_portfolio_value = calculate_actual_portfolio_weights(
            prices, tickers, quantities
        )
        portfolio_value = computed_portfolio_value  # override the input default

        # Calculate efficient frontier, passing actual weights to include myPortfolio
        frontier_result = calculate_efficient_frontier(prices, actual_weights=actual_weights)

        # Fix 1: Calculate beta for the user's actual portfolio, not Max Sharpe
        # SPY is already in prices (fetched in the initial batch download)
        portfolio_beta = calculate_portfolio_beta(prices, actual_weights)

        # Fetch current SPY and ^GSPC prices for hedge sizing — must be today's price,
        # not the historical end_date price from the analysis period.
        current = yf.download(['SPY', '^GSPC'], period='1d', auto_adjust=True, progress=False)
        if current.empty or 'SPY' not in current['Close'].columns:
            raise ValueError("Failed to fetch current SPY price for hedge calculation.")
        close = current['Close']
        del current
        spy_price = float(close['SPY'].iloc[-1])
        es_index_price = float(close['^GSPC'].iloc[-1]) if '^GSPC' in close.columns else None

        # Calculate hedge sizing
        hedging = calculate_hedge_sizing(portfolio_beta, target_beta, portfolio_value, spy_price, es_index_price)

        # Combine all results
        result = {
            **frontier_result,
            'portfolioBeta': portfolio_beta,
            'hedging': hedging
        }

        # Output JSON result to stdout (compact — indent=2 doubles string size)
        print(json.dumps(result))
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
