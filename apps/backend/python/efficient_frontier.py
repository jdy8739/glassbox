#!/usr/bin/env python3
"""
Efficient Frontier Calculation Script
Calculates portfolio optimization metrics using PyPortfolioOpt
"""

import sys
import json
import yfinance as yf
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from pypfopt import EfficientFrontier, risk_models, expected_returns
from pypfopt.discrete_allocation import DiscreteAllocation, get_latest_prices


def fetch_price_data(tickers, start_date=None, end_date=None):
    """
    Fetch historical adjusted close prices for given tickers

    Args:
        tickers: List of ticker symbols
        start_date: Start date for historical data (default: 3 years ago)
        end_date: End date for historical data (default: today)

    Returns:
        DataFrame with adjusted close prices
    """
    import time

    if end_date is None:
        end_date = datetime.now()
    if start_date is None:
        start_date = end_date - timedelta(days=3*365)  # 3 years

    # Always include SGOV as risk-free asset
    if 'SGOV' not in tickers:
        tickers = tickers + ['SGOV']

    # Fetch data for each ticker individually (more reliable)
    all_prices = {}

    for ticker_symbol in tickers:
        max_retries = 3
        for attempt in range(max_retries):
            try:
                ticker = yf.Ticker(ticker_symbol)
                hist = ticker.history(
                    start=start_date,
                    end=end_date,
                    auto_adjust=True  # Use adjusted prices
                )

                if hist.empty:
                    if attempt < max_retries - 1:
                        time.sleep(1)  # Wait before retry
                        continue
                    raise ValueError(f"No data for {ticker_symbol}")

                # Extract close prices (already adjusted with auto_adjust=True)
                all_prices[ticker_symbol] = hist['Close']
                break

            except Exception as e:
                if attempt == max_retries - 1:
                    raise ValueError(f"Failed to fetch {ticker_symbol}: {str(e)}")
                time.sleep(1)  # Wait before retry
                continue

    # Combine all prices into a single DataFrame
    prices = pd.DataFrame(all_prices)

    # Align dates (intersection)
    prices = prices.dropna()

    if prices.empty or len(prices) < 30:
        raise ValueError("Insufficient price data after cleaning. Need at least 30 days of data.")

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

    # Calculate risk-free rate from SGOV
    sgov_returns = prices['SGOV'].pct_change().dropna()
    risk_free_rate = sgov_returns.mean() * 252  # Annualized

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
        # Generate random weights
        weights = np.random.random(n_assets)
        weights /= np.sum(weights)

        # Calculate portfolio metrics
        portfolio_return = np.dot(weights, mu)
        portfolio_std = np.sqrt(np.dot(weights.T, np.dot(S, weights)))
        sharpe_ratio = (portfolio_return - risk_free_rate) / portfolio_std

        random_portfolios.append({
            'return': float(portfolio_return),
            'volatility': float(portfolio_std),
            'sharpeRatio': float(sharpe_ratio)
        })

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


def calculate_portfolio_beta(prices, portfolio_weights, benchmark_ticker='SPY'):
    """
    Calculate portfolio beta against a benchmark (default: SPY)

    Args:
        prices: DataFrame with historical prices
        portfolio_weights: Dict of ticker -> weight
        benchmark_ticker: Benchmark ticker (default: SPY)

    Returns:
        float: Portfolio beta
    """
    # Fetch benchmark data if not in prices
    if benchmark_ticker not in prices.columns:
        end_date = prices.index[-1]
        start_date = prices.index[0]
        benchmark_data = yf.download(benchmark_ticker, start=start_date, end=end_date, progress=False)
        benchmark_prices = benchmark_data['Adj Close']
    else:
        benchmark_prices = prices[benchmark_ticker]

    # Calculate returns
    portfolio_tickers = [t for t in portfolio_weights.keys() if portfolio_weights[t] > 0]
    portfolio_returns = prices[portfolio_tickers].pct_change().dropna()

    # Calculate weighted portfolio returns
    weights_array = np.array([portfolio_weights[t] for t in portfolio_tickers])
    portfolio_return_series = portfolio_returns.dot(weights_array)

    # Calculate benchmark returns
    benchmark_returns = benchmark_prices.pct_change().dropna()

    # Align dates
    common_dates = portfolio_return_series.index.intersection(benchmark_returns.index)
    portfolio_return_series = portfolio_return_series[common_dates]
    benchmark_returns = benchmark_returns[common_dates]

    # Calculate beta using covariance
    covariance = np.cov(portfolio_return_series, benchmark_returns)[0][1]
    benchmark_variance = np.var(benchmark_returns)
    beta = covariance / benchmark_variance

    return float(beta)


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

    # SPY shares to short
    spy_shares = int(hedge_notional / spy_price)
    spy_notional = spy_shares * spy_price

    # ES futures (assuming $50 multiplier and current ES price ~= SPY * 10)
    es_multiplier = 50
    es_price = spy_price * 10  # Approximate ES price
    es_contract_value = es_price * es_multiplier
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

        if not tickers:
            raise ValueError("No tickers provided")

        # Fetch price data
        prices = fetch_price_data(tickers)

        # Calculate efficient frontier
        frontier_result = calculate_efficient_frontier(prices)

        # Calculate portfolio beta for Max Sharpe portfolio
        max_sharpe_weights = frontier_result['maxSharpe']['weights']
        portfolio_beta = calculate_portfolio_beta(prices, max_sharpe_weights)

        # Get latest SPY price for hedge calculation
        spy_data = yf.download('SPY', period='1d', progress=False)
        spy_price = float(spy_data['Adj Close'].iloc[-1])

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
