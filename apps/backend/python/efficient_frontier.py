#!/usr/bin/env python3
"""
Efficient Frontier Calculation Script
Calculates portfolio optimization metrics using PyPortfolioOpt.
Optimized for memory-constrained environments (AWS Lightsail) and weekend data gaps.
"""

import sys
import json
import gc
import time
import requests
import yfinance as yf
import numpy as np
import pandas as pd
from datetime import datetime
from pypfopt import EfficientFrontier, risk_models, expected_returns

# Setup session with User-Agent to avoid Yahoo Finance blocking (403/Empty Response)
session = requests.Session()
session.headers.update({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
})

# Constants
MIN_DATA_POINTS = 60
TRADING_DAYS_PER_YEAR = 252
DEFAULT_RISK_FREE_RATE = 0.05
ES_MULTIPLIER = 50
MAX_RETRIES = 3
FRONTIER_POINTS = 20     # Balanced for resolution and memory
RANDOM_PORTFOLIOS = 500  # Halved memory footprint for visualization
SYSTEM_TICKERS = ('SGOV', 'SPY')  # Core infrastructure tickers


# ==================== Helper Functions ====================

def log(message):
    """Log to stderr for visibility in NestJS logs."""
    sys.stderr.write(f"[Python] {message}\n")
    sys.stderr.flush()


def parse_date(date_input):
    """Convert string date to datetime object."""
    if date_input is None:
        return None
    if isinstance(date_input, str):
        return datetime.strptime(date_input, '%Y-%m-%d')
    return date_input


def validate_data_sufficiency(data, min_points=MIN_DATA_POINTS, data_type="price"):
    """Validate sufficient data points."""
    if data.empty or len(data) < min_points:
        raise ValueError(
            f"Insufficient {data_type} data. Need at least {min_points} points, got {len(data)}"
        )


def fetch_all_tickers_batch(tickers, start_date, end_date):
    """
    Batch-download historical Close prices in one session.
    Avoids N separate HTTP connections and reduces memory overhead.
    """
    log(f"Fetching {len(tickers)} tickers from {start_date.date()} to {end_date.date()}")
    
    for attempt in range(MAX_RETRIES):
        try:
            raw_data = yf.download(
                tickers, start=start_date, end=end_date,
                auto_adjust=True, progress=False, session=session
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

    # Extract Close prices; handle MultiIndex if >1 ticker, or flat Series if 1 ticker.
    if isinstance(raw_data.columns, pd.MultiIndex):
        prices = raw_data['Close'].copy()
    else:
        prices = raw_data[['Close']].copy()
        prices.columns = tickers

    del raw_data
    gc.collect()

    # Verify each ticker has data
    missing = [t for t in tickers if t not in prices.columns or prices[t].isna().all()]
    if missing:
        raise ValueError(f"No data returned for: {', '.join(missing)}")

    return prices


def calculate_annualized_risk_free_rate(prices, ticker='SGOV'):
    """
    Calculate annualized risk-free rate from treasury ETF.
    Uses arithmetic annualization for consistency with pypfopt.
    """
    if ticker in prices.columns:
        returns = prices[ticker].pct_change().dropna()
        return float(returns.mean() * TRADING_DAYS_PER_YEAR)
    return DEFAULT_RISK_FREE_RATE


def calculate_sharpe_ratio(portfolio_return, portfolio_std, risk_free_rate):
    """Sharpe ratio with safety guard for zero volatility."""
    if portfolio_std > 1e-6:
        return (portfolio_return - risk_free_rate) / portfolio_std
    return 0.0


def calculate_actual_portfolio_weights(prices, tickers, quantities):
    """Compute value-weighted portfolio weights from user quantities."""
    latest_prices = prices.iloc[-1]
    values = {}
    for ticker, qty in zip(tickers, quantities):
        if ticker in latest_prices.index and qty > 0:
            values[ticker] = qty * float(latest_prices[ticker])

    total_value = sum(values.values())
    if total_value == 0:
        raise ValueError("Portfolio has zero total value — check quantities and tickers")

    weights = {col: values.get(col, 0.0) / total_value for col in prices.columns}
    return weights, total_value


# ==================== Main Functions ====================

def fetch_price_data(tickers, start_date=None, end_date=None):
    """Fetch and clean historical price data."""
    end_date = parse_date(end_date)
    start_date = parse_date(start_date)

    log(f"Date range for fetch: {start_date.date()} to {end_date.date()}")

    if start_date >= end_date:
        raise ValueError(f"Start date ({start_date.date()}) must be before end date ({end_date.date()})")

    now = datetime.now()
    if end_date > now:
        raise ValueError(f"End date ({end_date.date()}) cannot be in the future")

    # Add system tickers for benchmarking and risk-free rate
    download_tickers = list(tickers)
    for t in SYSTEM_TICKERS:
        if t not in download_tickers:
            download_tickers.append(t)

    raw = fetch_all_tickers_batch(download_tickers, start_date, end_date)
    
    # Clean data: drop rows where ANY ticker is missing (ensures synchronized returns)
    full_rows = len(raw)
    culprits = [t for t in raw.columns if raw[t].isna().any()]
    prices = raw.dropna()
    del raw
    gc.collect()

    dropped = full_rows - len(prices)
    if dropped > 0:
        pct = dropped / full_rows * 100
        if pct > 30:
            # Mask system tickers in error to focus user on their input
            user_culprits = [t for t in culprits if t not in SYSTEM_TICKERS] or culprits
            raise ValueError(
                f"Data truncation too severe: {dropped}/{full_rows} rows dropped ({pct:.0f}%) "
                f"due to limited history for: {', '.join(user_culprits)}."
            )

    validate_data_sufficiency(prices, MIN_DATA_POINTS, "price")
    return prices


def calculate_efficient_frontier(prices, num_portfolios=RANDOM_PORTFOLIOS, actual_weights=None):
    """Calculate optimization results and random portfolios."""
    risk_free_rate = calculate_annualized_risk_free_rate(prices)
    
    # Isolate risky universe for optimization
    exclude = ['SGOV']
    if actual_weights is None or actual_weights.get('SPY', 0.0) == 0.0:
        exclude.append('SPY')
    opt_prices = prices.drop(columns=exclude, errors='ignore')

    mu = expected_returns.mean_historical_return(opt_prices, compounding=False)
    S = risk_models.sample_cov(opt_prices)

    log("Calculating GMV and Max Sharpe portfolios...")
    # GMV
    ef = EfficientFrontier(mu, S)
    ef.min_volatility()
    gmv_weights = ef.clean_weights()
    gmv_perf = ef.portfolio_performance(verbose=False, risk_free_rate=risk_free_rate)
    del ef
    gc.collect()

    # Max Sharpe
    ef = EfficientFrontier(mu, S)
    ef.max_sharpe(risk_free_rate=risk_free_rate)
    sharpe_weights = ef.clean_weights()
    sharpe_perf = ef.portfolio_performance(verbose=False, risk_free_rate=risk_free_rate)
    del ef
    gc.collect()

    # Frontier points
    log("Calculating efficient frontier points...")
    min_ret, max_ret = gmv_perf[0], float(mu.max())
    target_returns = np.linspace(min_ret, max_ret, FRONTIER_POINTS)
    frontier_points = []
    
    for tr in target_returns:
        try:
            ef_temp = EfficientFrontier(mu, S)
            ef_temp.efficient_return(tr)
            p = ef_temp.portfolio_performance(verbose=False, risk_free_rate=risk_free_rate)
            frontier_points.append({'return': float(p[0]), 'volatility': float(p[1]), 'sharpeRatio': float(p[2])})
        except Exception:
            continue
        finally:
            del ef_temp
            gc.collect()

    # Vectorized Random Portfolios
    n_assets = len(opt_prices.columns)
    mu_arr, S_arr = np.asarray(mu), np.asarray(S)
    w_matrix = np.random.dirichlet(np.full(n_assets, 0.5), size=num_portfolios)
    
    rp_returns = w_matrix @ mu_arr
    rp_vars = np.einsum('ij,jk,ik->i', w_matrix, S_arr, w_matrix)
    rp_stds = np.sqrt(np.maximum(rp_vars, 0.0))
    rp_sharpes = np.where(rp_stds > 1e-6, (rp_returns - risk_free_rate) / rp_stds, 0.0)

    random_portfolios = [
        {'return': float(r), 'volatility': float(s), 'sharpeRatio': float(sh)}
        for r, s, sh in zip(rp_returns, rp_stds, rp_sharpes)
    ]

    result = {
        'gmv': {'weights': {k: float(v) for k, v in gmv_weights.items()},
                'stats': {'return': float(gmv_perf[0]), 'volatility': float(gmv_perf[1]), 'sharpe': float(gmv_perf[2])}},
        'maxSharpe': {'weights': {k: float(v) for k, v in sharpe_weights.items()},
                      'stats': {'return': float(sharpe_perf[0]), 'volatility': float(sharpe_perf[1]), 'sharpe': float(sharpe_perf[2])}},
        'efficientFrontier': frontier_points,
        'randomPortfolios': random_portfolios,
        'riskFreeRate': float(risk_free_rate)
    }

    if actual_weights:
        w_arr = np.array([actual_weights.get(col, 0.0) for col in opt_prices.columns])
        cash_w = actual_weights.get('SGOV', 0.0)
        p_std = np.sqrt(np.dot(w_arr.T, np.dot(S, w_arr)))
        p_ret = np.dot(w_arr, mu) + (cash_w * risk_free_rate)
        
        result['myPortfolio'] = {
            'weights': {k: v for k, v in actual_weights.items() if v > 0},
            'stats': {'return': float(p_ret), 'volatility': float(p_std), 'sharpeRatio': float(calculate_sharpe_ratio(p_ret, p_std, risk_free_rate))}
        }

    return result


def calculate_portfolio_beta(prices, portfolio_weights, benchmark_ticker='SPY'):
    """Vectorized portfolio beta calculation."""
    if benchmark_ticker not in prices.columns:
        return 0.0

    returns_df = prices.pct_change().dropna()
    # Exclude benchmark from covariance matrix; we'll add its contribution manually
    asset_cols = [c for c in returns_df.columns if c != benchmark_ticker and portfolio_weights.get(c, 0.0) > 0]
    
    if not asset_cols:
        return float(portfolio_weights.get(benchmark_ticker, 0.0) * 1.0)

    weights = np.array([portfolio_weights[c] for c in asset_cols])
    all_rets = np.column_stack([returns_df[asset_cols].values, returns_df[benchmark_ticker].values])
    
    cov = np.cov(all_rets.T)
    benchmark_var = cov[-1, -1]
    
    if benchmark_var < 1e-9:
        return 0.0

    betas = cov[:-1, -1] / benchmark_var
    asset_beta = np.dot(weights, betas)
    benchmark_beta = portfolio_weights.get(benchmark_ticker, 0.0) * 1.0
    
    return float(asset_beta + benchmark_beta)


def calculate_hedge_sizing(portfolio_beta, target_beta, portfolio_value, spy_price, es_index_price=None):
    """Calculate required SPY and ES hedge sizes."""
    if spy_price <= 0:
        raise ValueError("Invalid SPY price for hedging.")

    hedge_notional = (portfolio_beta - target_beta) * portfolio_value
    spy_shares = int(hedge_notional / spy_price)
    
    es_price = es_index_price if es_index_price else spy_price * 10
    es_contract_val = es_price * ES_MULTIPLIER
    es_contracts = int(hedge_notional / es_contract_val)

    return {
        'spyShares': spy_shares,
        'spyNotional': float(spy_shares * spy_price),
        'esContracts': es_contracts,
        'esNotional': float(es_contracts * es_contract_val)
    }


def main():
    """Main execution entry point."""
    try:
        input_data = json.loads(sys.stdin.read())
        tickers, quantities = input_data.get('tickers', []), input_data.get('quantities', [])
        target_beta = input_data.get('targetBeta', 0)
        start_date, end_date = input_data['startDate'], input_data['endDate']

        if not tickers or len(tickers) != len(quantities):
            raise ValueError("Invalid tickers or quantities input.")

        prices = fetch_price_data(tickers, start_date=start_date, end_date=end_date)
        actual_weights, portfolio_value = calculate_actual_portfolio_weights(prices, tickers, quantities)
        
        frontier_result = calculate_efficient_frontier(prices, actual_weights=actual_weights)
        portfolio_beta = calculate_portfolio_beta(prices, actual_weights)

        # Robust current price fetching (handles weekends/holidays)
        log("Fetching current market prices for hedging...")
        try:
            # Use 5-day window to ensure we catch the last close even on Sundays/holidays
            current = yf.download(['SPY', '^GSPC'], period='5d', auto_adjust=True, progress=False, session=session)
            if not current.empty and 'SPY' in current['Close'].columns:
                close = current['Close'].ffill().iloc[-1]
                spy_price = float(close['SPY'])
                es_index_price = float(close['^GSPC']) if '^GSPC' in close.index else spy_price * 10
            else:
                # Fallback to last known historical price
                spy_price = float(prices['SPY'].iloc[-1])
                es_index_price = spy_price * 10
        except Exception:
            spy_price = float(prices['SPY'].iloc[-1])
            es_index_price = spy_price * 10

        hedging = calculate_hedge_sizing(portfolio_beta, target_beta, portfolio_value, spy_price, es_index_price)

        result = {**frontier_result, 'portfolioBeta': portfolio_beta, 'hedging': hedging}
        print(json.dumps(result))
        sys.exit(0)

    except Exception as e:
        print(json.dumps({'error': str(e), 'type': type(e).__name__}, indent=2))
        sys.exit(1)


if __name__ == '__main__':
    main()
