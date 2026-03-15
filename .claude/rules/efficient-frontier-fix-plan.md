# efficient_frontier.py — Fix Plan

## Overview

Financial review identified **5 critical/major bugs** and **4 minor issues** in `apps/backend/python/efficient_frontier.py`. Fixes are ordered by severity.

---

## 🔴 Fix 0 — Use arithmetic mean for expected returns (CRITICAL)

**File:** `apps/backend/python/efficient_frontier.py`
**Function:** `calculate_efficient_frontier()`

### Problem
`mean_historical_return(prices)` uses `compounding=True` by default in PyPortfolioOpt, which computes a **geometric mean (CAGR)**. Mean-Variance Optimization requires **arithmetic mean** expected returns because portfolio return is linear in weights:

```
E[Rp] = Σ wᵢ × E[Rᵢ]   ← only holds for arithmetic means
```

The gap between the two is the variance drag (`σ²/2`), which is material for high-volatility assets:

| Asset | Typical σ | Variance Drag (σ²/2) | Impact |
|-------|-----------|----------------------|--------|
| SGOV  | ~0.5%     | ~0.001%              | Negligible |
| AAPL  | ~25%      | ~3.1%                | Meaningful |
| NVDA  | ~50%      | ~12.5%               | Significant |

Using geometric mean systematically **underestimates** high-volatility assets' expected return, biasing the optimizer away from them and producing a distorted frontier. This affects every downstream output: GMV, Max Sharpe, frontier points, and beta.

There is also a compounding inconsistency: `calculate_annualized_risk_free_rate()` uses arithmetic annualization (`mean * 252`) while the optimizer uses geometric mean. These must be consistent.

### Fix
```python
# BEFORE (geometric — wrong for MVO)
mu = expected_returns.mean_historical_return(prices)

# AFTER (arithmetic — correct for MVO)
mu = expected_returns.mean_historical_return(prices, compounding=False)
```

---

## 🔴 Fix 1 — Use `quantities` to compute user's actual portfolio (CRITICAL)

**File:** `apps/backend/python/efficient_frontier.py`
**Functions affected:** `main()`, new helper `calculate_actual_portfolio_weights()`

### Problem
`quantities` is received from the frontend but never used. Beta and hedge sizing are computed against the **Max Sharpe portfolio**, not the user's real holdings. `portfolioValue` defaults to a hardcoded `$100,000`.

### Fix
1. Add a helper `calculate_actual_portfolio_weights(prices, tickers, quantities)` that:
   - Gets the latest price for each ticker from `prices`
   - Computes `weight_i = qty_i × price_i / Σ(qty_j × price_j)`
   - Returns `{ticker: weight}` dict and the computed `portfolio_value`
2. In `main()`, replace:
   ```python
   # BEFORE (wrong)
   max_sharpe_weights = frontier_result['maxSharpe']['weights']
   portfolio_beta = calculate_portfolio_beta(prices, max_sharpe_weights)
   ```
   with:
   ```python
   # AFTER (correct)
   actual_weights, computed_portfolio_value = calculate_actual_portfolio_weights(prices, tickers, quantities)
   portfolio_beta = calculate_portfolio_beta(prices, actual_weights)
   portfolio_value = computed_portfolio_value  # override the input default
   ```
3. Also add `myPortfolio` to the result output:
   ```python
   result['myPortfolio'] = {
       'weights': actual_weights,
       'stats': calculate_portfolio_metrics(
           np.array(list(actual_weights.values())), mu, S, risk_free_rate
       )
   }
   ```
   This allows the frontend to plot the "My Portfolio" dot on the efficient frontier chart.

---

## 🟠 Fix 2 — Correct beta denominator mismatch (MAJOR)

**File:** `apps/backend/python/efficient_frontier.py`
**Function:** `calculate_portfolio_beta()`

### Problem
`np.cov()` uses sample variance (÷ N−1) but `np.var()` uses population variance (÷ N). Beta is systematically inflated by `N/(N−1)`.

```python
# BEFORE (inconsistent)
covariance = np.cov(portfolio_return_series, benchmark_returns)[0][1]
benchmark_variance = np.var(benchmark_returns)
```

### Fix
Use consistent denominators via the covariance matrix:
```python
# AFTER (correct)
cov_matrix = np.cov(portfolio_return_series, benchmark_returns)
beta = cov_matrix[0][1] / cov_matrix[1][1]
```
Both `[0][1]` (covariance) and `[1][1]` (benchmark variance) divide by N−1, so they cancel correctly.

---

## 🟠 Fix 3 — Extend efficient frontier to the true upper bound (MAJOR)

**File:** `apps/backend/python/efficient_frontier.py`
**Function:** `calculate_efficient_frontier()`

### Problem
The frontier range ends at `sharpe_performance[0] * 1.2`, but the Max Sharpe portfolio is in the **middle** of the frontier — not the top. The upper half of the curve is missing.

```python
# BEFORE (truncated)
max_return = sharpe_performance[0]
target_returns = np.linspace(min_return, max_return * 1.2, 50)
```

### Fix
Use `mu.max()` (highest expected return among all assets) as the upper bound:
```python
# AFTER (correct)
min_return = gmv_performance[0]
max_return = float(mu.max())
target_returns = np.linspace(min_return, max_return, 50)
```

---

## 🟠 Fix 4 — Replace biased sampling with Dirichlet distribution (MAJOR)

**File:** `apps/backend/python/efficient_frontier.py`
**Function:** `calculate_efficient_frontier()`

### Problem
`np.random.random` + normalize creates a strong center-bias and undersamples portfolio extremes, distorting the scatter plot visualization of the feasible region.

```python
# BEFORE (biased)
weights = np.random.random(n_assets)
weights /= np.sum(weights)
```

### Fix
```python
# AFTER (uniform simplex sampling)
weights = np.random.dirichlet(np.ones(n_assets))
```

Also increase `num_portfolios` from `500` → `3000` for a visually meaningful scatter cloud.

---

## 🟡 Fix 5 — Remove hardcoded ES price approximation (MINOR)

**File:** `apps/backend/python/efficient_frontier.py`
**Function:** `calculate_hedge_sizing()`

### Problem
`es_price = spy_price * 10` is a rough approximation that will silently drift over time as the SPY/S&P ratio changes.

### Fix
Fetch the actual S&P 500 index price (`^GSPC`) and pass it into `calculate_hedge_sizing()`:
```python
# In main():
gspc_ticker = yf.Ticker('^GSPC')
gspc_data = gspc_ticker.history(period='1d', auto_adjust=True)
es_price = float(gspc_data['Close'].iloc[-1]) if not gspc_data.empty else spy_price * 10

# In calculate_hedge_sizing(), replace es_price = spy_price * 10 with parameter:
def calculate_hedge_sizing(portfolio_beta, target_beta, portfolio_value, spy_price, es_index_price=None):
    es_price = es_index_price if es_index_price else spy_price * 10
    ...
```

---

## 🟡 Fix 6 — Geometric annualization for risk-free rate (MINOR)

**File:** `apps/backend/python/efficient_frontier.py`
**Function:** `calculate_annualized_risk_free_rate()`

### Problem
Arithmetic annualization (`mean * 252`) compounds the approximation error slightly.

```python
# BEFORE
return returns.mean() * TRADING_DAYS_PER_YEAR
```

### Fix
```python
# AFTER
return (1 + returns.mean()) ** TRADING_DAYS_PER_YEAR - 1
```

Impact is ~0.1% at current SGOV rates (~5% annual), but correct is correct.

---

## 🟡 Fix 7 — Raise `MIN_DATA_POINTS` minimum (MINOR)

**File:** `apps/backend/python/efficient_frontier.py`

### Problem
`MIN_DATA_POINTS = 30` is too low. A covariance matrix with N assets requires at minimum N observations to be non-singular, and 252+ for stable estimates.

### Fix
```python
# BEFORE
MIN_DATA_POINTS = 30

# AFTER
MIN_DATA_POINTS = 252  # At least 1 year of trading days
```

---

## 🟡 Fix 8 — Remove unused imports (MINOR)

**File:** `apps/backend/python/efficient_frontier.py`

### Problem
```python
from datetime import datetime, timedelta          # timedelta never used
from pypfopt.discrete_allocation import DiscreteAllocation, get_latest_prices  # both never used
```

### Fix
```python
from datetime import datetime
# Remove DiscreteAllocation and get_latest_prices entirely
```

---

## Implementation Order

| Order | Fix | Severity | Impact |
|-------|-----|----------|--------|
| 0 | `compounding=False` → arithmetic mean for MVO | 🔴 Critical | All outputs distorted — affects every downstream calc |
| 1 | Use quantities → compute actual portfolio weights & beta | 🔴 Critical | Hedge output is currently for the wrong portfolio |
| 2 | Beta denominator consistency (`cov/cov` not `cov/var`) | 🟠 Major | Beta systematically inflated |
| 3 | Frontier upper bound → `mu.max()` | 🟠 Major | Frontier curve is visually cut short |
| 4 | Dirichlet sampling + increase num_portfolios to 3000 | 🟠 Major | Scatter plot is biased toward center |
| 5 | Fetch `^GSPC` for ES price | 🟡 Minor | ES contracts count more accurate |
| 6 | Geometric rf rate annualization | 🟡 Minor | ~0.1% accuracy improvement |
| 7 | `MIN_DATA_POINTS = 252` | 🟡 Minor | Prevent degenerate covariance matrices |
| 8 | Remove unused imports | 🟡 Minor | Code hygiene |
