# efficient_frontier.py — Theoretical Fix Plan (Phase 2)

## Overview

Following the implementation of the initial bug fixes, a deeper financial and quantitative review of `apps/backend/python/efficient_frontier.py` has identified **four structural theoretical flaws** in the mathematical approach. These issues affect the accuracy of the optimization, beta calculation, and visualization, especially for portfolios with many assets or varying asset histories.

---

## 🔴 Flaw 1 — The "Short-History Penalty" via `.dropna()` (CRITICAL)

**File:** `apps/backend/python/efficient_frontier.py`
**Function:** `fetch_price_data()`

### Problem
When constructing the price dataframe, the code uses `prices = pd.DataFrame(all_prices).dropna()`.
If a user inputs a portfolio of 5 stocks, and one of them IPO'd 6 months ago, `.dropna()` will silently delete decades of historical data for the other 4 stocks. 
The covariance matrix ($S$) and expected returns ($\mu$) for giants like AAPL and MSFT will be generated using only the last 6 months of market regime, heavily distorting the Efficient Frontier.

### Theoretical Fix
Instead of globally dropping rows with missing data, we should utilize PyPortfolioOpt's risk models that handle missing data natively (e.g., using pairwise covariance where the covariance of each pair is calculated using their maximum overlapping history) or fill missing values appropriately (e.g. backfilling/forward-filling if the gap is small, or restricting the start date individually).

---

## 🟠 Flaw 2 — The "Curse of Dimensionality" in Dirichlet Sampling (MAJOR)

**File:** `apps/backend/python/efficient_frontier.py`
**Function:** `calculate_efficient_frontier()`

### Problem
The previous fix replaced random uniform sampling with Dirichlet sampling: `np.random.dirichlet(np.ones(n_assets))`.
While mathematically elegant, a Dirichlet distribution with an alpha vector of `[1, 1, ... 1]` tightly concentrates around the equal-weight portfolio ($1/N$) as the number of assets ($N$) grows. If a user inputs 15+ stocks, the random scatter plot will look like a tiny, tight blob in the middle of the frontier, completely failing to sample the edges (highly concentrated portfolios).

### Theoretical Fix
Use an alpha value `< 1` to push the probability mass toward the edges of the simplex, ensuring a proper visual spread across the feasible region regardless of asset count.

```python
# BEFORE
weights = np.random.dirichlet(np.ones(n_assets))

# AFTER
weights = np.random.dirichlet(np.full(n_assets, 0.2))
```

---

## 🟠 Flaw 3 — Ex-Ante vs Ex-Post Beta Drag (MAJOR)

**File:** `apps/backend/python/efficient_frontier.py`
**Function:** `calculate_weighted_returns()`

### Problem
The script computes historical portfolio returns by taking a dot product of the *current* target weights against the *historical* daily returns matrix.
This mathematically simulates a portfolio that is **rebalanced daily** to maintain exact target weights. A daily-rebalanced portfolio suffers from rebalancing drag (volatility decay). Real-world user portfolios are "Buy and Hold" (drifting weights). 
The Beta calculated here is the *ex-ante* risk of the strategy, not the *ex-post* historical beta of the user's un-rebalanced shares.

### Theoretical Fix
To accurately reflect the beta of the user's actual portfolio, we need to model a buy-and-hold return series (drifting weights) or compute the beta of individual assets first and aggregate them using the current weights:
```
Beta_portfolio = Σ w_i * Beta_i
```

---

## 🟡 Flaw 4 — SGOV Variance Skew (MINOR)

**File:** `apps/backend/python/efficient_frontier.py`
**Function:** `calculate_efficient_frontier()`

### Problem
The code injects `SGOV` into the dataset as a proxy for the risk-free rate. 
While SGOV yields a nearly risk-free return, it is a tradable ETF with non-zero variance and covariance to equities due to interest rate fluctuations. When the PyPortfolioOpt optimizer attempts to find the Global Minimum Variance (GMV) portfolio, it treats SGOV as a risky asset with tiny variance, rather than a true mathematically risk-free asset (which has strictly $0.0$ variance and $0.0$ covariance to all other assets). This introduces a slight skew in the covariance matrix and the Capital Allocation Line (CAL).

### Theoretical Fix
Exclude SGOV from the mean-variance optimization matrix. Calculate the risk-free rate from SGOV, then pass that scalar value directly into PyPortfolioOpt's parameters (`risk_free_rate=risk_free_rate`) without including the SGOV time series in `mu` and `S`.
