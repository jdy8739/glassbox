#!/usr/bin/env python3
"""
Mock version of efficient frontier for testing when Yahoo Finance is rate-limited
Generates realistic-looking mock data for testing purposes
"""

import sys
import json
import warnings

# Suppress all warnings
warnings.filterwarnings('ignore')

import numpy as np
from datetime import datetime, timedelta


def main():
    try:
        # Read input from stdin
        input_data = json.loads(sys.stdin.read())

        tickers = input_data.get('tickers', [])
        quantities = input_data.get('quantities', [])
        portfolio_value = input_data.get('portfolioValue', 100000)
        target_beta = input_data.get('targetBeta', 0)

        if not tickers:
            raise ValueError("No tickers provided")

        # Generate mock portfolio weights
        n = len(tickers) + 1  # +1 for SGOV
        all_tickers = tickers + ['SGOV']

        # GMV weights (more conservative, higher SGOV allocation)
        gmv_weights_array = np.random.dirichlet(np.ones(n) * 2)
        gmv_weights_array[-1] = gmv_weights_array[-1] * 2  # Increase SGOV weight
        gmv_weights_array = gmv_weights_array / gmv_weights_array.sum()  # Normalize

        # Max Sharpe weights (more aggressive, lower SGOV)
        sharpe_weights_array = np.random.dirichlet(np.ones(n) * 3)
        sharpe_weights_array[-1] = sharpe_weights_array[-1] * 0.5  # Decrease SGOV weight
        sharpe_weights_array = sharpe_weights_array / sharpe_weights_array.sum()

        # Convert to dictionaries
        gmv_weights = {ticker: float(weight) for ticker, weight in zip(all_tickers, gmv_weights_array)}
        sharpe_weights = {ticker: float(weight) for ticker, weight in zip(all_tickers, sharpe_weights_array)}

        # Generate mock stats
        gmv_stats = {
            'return': 0.08 + np.random.uniform(-0.02, 0.02),  # ~8% annual return
            'volatility': 0.10 + np.random.uniform(-0.02, 0.02),  # ~10% volatility
            'sharpe': 0.6 + np.random.uniform(-0.1, 0.2)  # ~0.6 Sharpe ratio
        }

        sharpe_stats = {
            'return': 0.15 + np.random.uniform(-0.03, 0.03),  # ~15% annual return
            'volatility': 0.18 + np.random.uniform(-0.03, 0.03),  # ~18% volatility
            'sharpe': 0.8 + np.random.uniform(-0.1, 0.2)  # ~0.8 Sharpe ratio
        }

        # Generate efficient frontier points
        frontier_points = []
        for i in range(50):
            ret = 0.05 + (i / 50) * 0.20  # 5% to 25% return
            vol = 0.08 + (i / 50) * 0.15  # 8% to 23% volatility
            sharpe = (ret - 0.04) / vol  # Assume 4% risk-free rate

            frontier_points.append({
                'return': float(ret),
                'volatility': float(vol),
                'sharpeRatio': float(sharpe)
            })

        # Generate random portfolios for visualization
        random_portfolios = []
        for _ in range(1000):
            ret = np.random.uniform(0.03, 0.25)
            vol = np.random.uniform(0.08, 0.30)
            sharpe = (ret - 0.04) / vol

            random_portfolios.append({
                'return': float(ret),
                'volatility': float(vol),
                'sharpeRatio': float(sharpe)
            })

        # Mock portfolio beta (random between 0.8 and 1.5)
        portfolio_beta = 0.8 + np.random.uniform(0, 0.7)

        # Mock SPY price
        spy_price = 450.0 + np.random.uniform(-10, 10)

        # Calculate hedge sizing
        hedge_notional = (portfolio_beta - target_beta) * portfolio_value
        spy_shares = int(hedge_notional / spy_price)
        spy_notional = spy_shares * spy_price

        # ES futures
        es_multiplier = 50
        es_price = spy_price * 10
        es_contract_value = es_price * es_multiplier
        es_contracts = int(hedge_notional / es_contract_value)
        es_notional = es_contracts * es_contract_value

        # Prepare result
        result = {
            'gmv': {
                'weights': gmv_weights,
                'stats': gmv_stats
            },
            'maxSharpe': {
                'weights': sharpe_weights,
                'stats': sharpe_stats
            },
            'efficientFrontier': frontier_points,
            'randomPortfolios': random_portfolios,
            'portfolioBeta': float(portfolio_beta),
            'hedging': {
                'spyShares': spy_shares,
                'spyNotional': float(spy_notional),
                'esContracts': es_contracts,
                'esNotional': float(es_notional)
            },
            'riskFreeRate': 0.04
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
