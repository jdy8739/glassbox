# efficient_frontier.py — Memory Optimization Guide

## Context

The script crashes on AWS Lightsail servers (low RAM) but runs fine locally.
Root cause: Python + NumPy + Pandas + PyPortfolioOpt (CVXPY) + yfinance consume **~200-300MB at import time**. Lightsail's smallest instances have 512MB RAM total — leaving little headroom for computation.

---

## Confirm the Crash Cause First

Before optimizing, verify it's actually an OOM kill on the server:

```bash
# Check available RAM
free -m

# Check if OOM killer fired
dmesg | grep -i "killed process"
journalctl -k | grep -i oom
```

If `dmesg` shows `Out of memory: Kill process`, RAM is confirmed as the cause.

---

## Memory Hotspots (Ranked by Impact)

### 1. 50x `EfficientFrontier` solver instances — CRITICAL

**Location:** `calculate_efficient_frontier()` lines 304-317

**Problem:**
Each `EfficientFrontier(mu, S)` call in the frontier loop instantiates a full CVXPY problem with scipy sparse matrix structures and a solver (ECOS/Mosek). Python's GC does not immediately collect these — 50 solver objects can accumulate and spike **20-50MB each**.

```python
# Current (leaks solver objects)
for target_return in target_returns:
    ef_temp = EfficientFrontier(mu, S)
    ef_temp.efficient_return(target_return)
    ...
```

**Fix:**
```python
import gc

for target_return in target_returns:
    try:
        ef_temp = EfficientFrontier(mu, S)
        ef_temp.efficient_return(target_return)
        perf = ef_temp.portfolio_performance(...)
        frontier_points.append({...})
    except Exception:
        continue
    finally:
        del ef_temp  # explicitly release solver
gc.collect()          # force GC after loop
```

---

### 2. Per-ticker yfinance loop — HIGH

**Location:** `fetch_price_data()` lines 234-237 via `fetch_single_ticker()`

**Problem:**
Each `yf.Ticker(symbol).history()` call creates:
- A full OHLCV DataFrame (6 columns)
- A separate HTTP session object
- Internal yfinance cache entry

With N user tickers + SGOV + SPY + `^GSPC` = **N+3 separate DataFrames in memory simultaneously**, only `Close` is ever used.

```python
# Current (N+3 separate HTTP sessions and DataFrames)
for ticker_symbol in tickers:
    all_prices[ticker_symbol] = fetch_single_ticker(ticker_symbol, ...)
```

**Fix — batch download:**
```python
import yfinance as yf

raw_data = yf.download(
    tickers, start=start_date, end=end_date,
    auto_adjust=True, progress=False
)
# Extract only Close — one DataFrame, one HTTP session
if isinstance(raw_data.columns, pd.MultiIndex):
    prices_raw = raw_data['Close']
else:
    prices_raw = raw_data[['Close']]
```

---

### 3. Triple-copy price DataFrame — MEDIUM

**Location:** `fetch_price_data()` lines 241-244

**Problem:**
Three copies of the price data coexist simultaneously:

```python
all_prices = {...}           # copy 1: dict of Series
raw = pd.DataFrame(all_prices)  # copy 2: full DataFrame
prices = raw.dropna()           # copy 3: filtered DataFrame
```

**Fix:**
```python
raw = pd.DataFrame(all_prices)
del all_prices   # free the dict immediately
gc.collect()
prices = raw.dropna()
del raw          # free raw; prices is the final form
```

---

### 4. Frontier points count and random portfolios — MEDIUM

**Location:** `calculate_efficient_frontier()` lines 302, 323

**Problem:**
- 50 frontier points = 50 CVXPY solver instantiations
- 1000 random portfolios = 1000 matrix multiplication loops with no GC hints

**Fix — reduce counts:**

| Parameter | Current | Suggested | Memory Reduction |
|-----------|---------|-----------|-----------------|
| `np.linspace(..., 50)` | 50 | 30 | -40% solver instances |
| `num_portfolios` | 1000 | 500 | -50% random portfolio loop |

Visually indistinguishable in the scatter chart at these scales.

```python
# In constants section
FRONTIER_POINTS = 30
RANDOM_PORTFOLIOS = 500
```

---

### 5. Redundant SPY and `^GSPC` fetches — LOW-MEDIUM

**Location:** `main()` line 560, `calculate_hedge_sizing()` line 480

**Problem:**
SPY is fetched twice — once in `fetch_benchmark_prices()` during beta calc and once in `main()` for current price. `^GSPC` is a hidden third fetch inside `calculate_hedge_sizing()`.

**Fix — include SPY in the initial batch download:**
```python
# In fetch_price_data(), add SPY to the ticker list
if 'SPY' not in tickers:
    tickers = tickers + ['SPY']

# Then in main(), extract spy_price directly:
spy_price = float(prices['SPY'].iloc[-1])
# No separate yf.Ticker('SPY').history() call needed
```

---

## Implementation Order

| Priority | Fix | Expected RAM Saved |
|----------|-----|--------------------|
| 1 | `del ef_temp` + `gc.collect()` in frontier loop | 50-200MB peak |
| 2 | Replace per-ticker loop with `yf.download()` | 20-80MB |
| 3 | Delete `all_prices` and `raw` after use | 10-30MB |
| 4 | Reduce frontier points (50→30) and portfolios (1000→500) | 10-20MB |
| 5 | Batch SPY/GSPC fetch | 5-15MB |

Fixes 1-3 alone should be sufficient for a 512MB Lightsail instance with a typical 3-10 ticker portfolio.

---

## Additional Server-Side Tips

```bash
# Add swap space as a safety net (Lightsail-specific)
sudo fallocate -l 1G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Check memory usage while the script runs
watch -n 1 free -m
```

Swap won't fix a true OOM but prevents hard crashes while degrading gracefully to disk.
