# Portfolio Optimization & Beta Hedging Tool - PRD

## 0) Project Overview & Scope

### Objectives
Build a JavaScript-based portfolio optimization tool that provides:

**Input:**
- Stock tickers of interest (e.g., AAPL, MSFT, NVDA, ...)
- **SGOV** ([iShares 0-3 Month Treasury Bond ETF](https://finance.yahoo.com/quote/SGOV/history/))

**Output:**
1. **Long-only Efficient Frontier Analysis**
   - Efficient Frontier visualization
   - Global Minimum Variance (GMV) portfolio weights
   - Maximum Sharpe Ratio (Tangency) portfolio weights
   - Target return portfolio weights

2. **Portfolio Beta Analysis & Hedging**
   - Portfolio beta calculation (against S&P 500)
   - Required short position sizing to achieve target beta (0 or custom)
   - Support for both SPY (ETF) and ES (futures) hedging methods

---

## 1) Technology Stack (JavaScript)

| Component | Technology | Notes |
|-----------|------------|-------|
| **Runtime** | Node.js (18+) | |
| **Market Data** | `yahoo-finance2` | For price history (Adj Close) - [npm package](https://www.npmjs.com/package/yahoo-finance2) |
| **Numerical Computing** | `mathjs` or `ml-matrix` | For matrix operations |
| **Optimization** | QP library or sampling | See optimization approaches below |
| **UI** | CLI + JSON (MVP) | Extensible to Next.js/React for frontier charts |

### Optimization Approaches

**Recommended for MVP:** Constraint-aware sampling (faster implementation)
- Long-only + sum=1 + optional bounds constraints
- QP (Quadratic Programming) for production accuracy
- JS QP libraries available (quadprog family)
- Grid/sampling approach viable for simplified constraints

---

## 2) Data Pipeline Design

### 2-1. Price Data Requirements

**Assets:**
- User-provided tickers
- `SGOV` (always included)

**Benchmark:**
- `^GSPC` (S&P 500 index) or `SPY` for beta calculation

**Frequency:** Daily

**Period:** 2-5 years historical (configurable based on stability requirements)

### 2-2. Returns Calculation

**Price Type:** Use **Adjusted Close** prices (critical for SGOV dividends/distributions)

**Return Method:** Log returns (recommended)
```
r_t = ln(P_t / P_{t-1})
```

**Annualization:**
- Daily mean return → Annual: `μ_annual = μ_daily × 252`
- Daily covariance → Annual: `Σ_annual = Σ_daily × 252`

> **Important:** SGOV has significant dividend/interest characteristics, so **Adjusted Close** is essential for accurate distribution reflection.

---

## 3) Requirement 1: Efficient Frontier for Optimal Asset Allocation

### 3-1. Problem Definition (Long-only Base Case)

**Decision Variables:** Weights `w ∈ ℝ^N`

**Constraints:**
- Sum to one: `Σ w_i = 1`
- Long-only: `w_i ≥ 0`
- (Optional) Individual upper bounds: `w_i ≤ w_max` (concentration risk control)

### 3-2. Frontier Calculation Methods

#### Approach A: Canonical QP (Production Quality)

For each target return `R`:
```
minimize    w^T Σ w
subject to  w^T μ = R
            Σ w_i = 1
            w_i ≥ 0
```

**Pros:** True efficient frontier
**Cons:** Requires QP solver implementation

#### Approach B: Random Sampling (MVP Recommended)

1. Generate 10,000-100,000 portfolios using Dirichlet distribution (ensures sum=1, positive)
2. Calculate (volatility, expected return, Sharpe ratio) for each sample
3. Extract Pareto frontier as efficient frontier approximation

**Pros:** Simple implementation, fast to market
**Cons:** Approximation only

> **Recommendation:** Start with Approach B for MVP, implement Approach A in Phase 2 for accuracy.

### 3-3. Output Deliverables

**Key Portfolios:**
1. **GMV (Global Minimum Variance)** portfolio
2. **Max Sharpe (Tangency)** portfolio
   - Risk-free rate: Use annualized average return of SGOV
3. **Target volatility/return** portfolio (user-specified)

**Visualizations:**
- Efficient frontier chart (return vs. volatility)
- Portfolio weights table

---

## 4) Requirement 2: S&P 500 Beta Hedging Sizing

### 4-1. Portfolio Beta Calculation

**Method:** Direct regression (most transparent)

For each asset:
```
r_asset = α + β × r_market + ε
```

**Portfolio Beta:**
- Option 1: `β_portfolio = Σ w_i × β_i` (weighted average of individual betas)
- Option 2: Regress portfolio return time series vs. market returns directly

### 4-2. Hedge Sizing ("How Much to Short?")

**Given:**
- Portfolio value: `V_A`
- Current portfolio beta: `β_p`
- Target beta: `β*` (typically 0 for market-neutral)

#### Method 1: Index Futures (e.g., ES)

Number of contracts required:
```
N = (β_p - β*) × V_A / V_F
```

Where `V_F` = dollar exposure per contract (e.g., ES = index × multiplier)

Reference: [Using Futures for Hedging](https://analystprep.com/study-notes/frm/part-1/financial-markets-and-products/hedging-strategies-using-futures/)

#### Method 2: SPY ETF (Simplified)

Short dollar amount:
```
Short $ = (β_p - β*) × V_A
```

Shares to short:
```
Shares = Short $ / SPY_price
```

> **Implementation Tip:** MVP should output SPY-based "short dollars/shares". Add futures contract calculation (ES/NQ with multiplier specs) as configuration option for Phase 2.

---

## 5) Architecture & Module Design

### 1. data/

**fetchPrices(tickers, start, end, interval)**
- Uses `yahoo-finance2` to fetch historical prices
- Returns Adjusted Close prices
- [yahoo-finance2 documentation](https://www.npmjs.com/package/yahoo-finance2)

**alignSeries(pricesByTicker)**
- Aligns dates across all tickers (intersection)
- Handles missing data

### 2. analytics/

**returns(prices, method="log")**
- Calculates log or simple returns

**meanCov(returns, annualize=true)**
- Computes mean vector and covariance matrix
- Annualizes if requested (×252 for daily data)

**portfolioStats(w, mu, cov, rf)**
- Returns: expected return, volatility, Sharpe ratio
- Input: weights, mean returns, covariance, risk-free rate

**betaRegression(assetReturns, marketReturns)**
- OLS regression for beta calculation

### 3. optimizer/

**randomFrontier(mu, cov, nSamples, constraints)**
- Generates random portfolios using Dirichlet distribution
- Returns efficient frontier approximation

**qpEfficientFrontier(mu, cov, constraints)** (Phase 2)
- True efficient frontier using QP solver

### 4. hedge/

**portfolioBeta(weights, betas)**
- Calculates weighted average beta

**betaFromPortfolioReturns(portfolioReturns, marketReturns)**
- Direct regression approach

**hedgeNotional(betaP, targetBeta, portfolioValue)**
- Calculates required hedge dollar amount

**spySharesToShort(hedgeNotional, spyPrice)**
- Converts hedge notional to SPY shares

**futuresContractsToShort(hedgeNotional, contractNotional)** (Optional)
- Converts to futures contracts

### 5. app/

**CLI Interface:**
```bash
node index.js \
  --tickers AAPL,MSFT,NVDA \
  --start 2021-01-01 \
  --samples 50000 \
  --targetBeta 0
```

**Output:**
- JSON file with results
- Console table visualization

---

## 6) MVP Implementation Roadmap

### Phase 1: Core Data Pipeline
- [ ] Price collection from Yahoo Finance
- [ ] Data alignment and cleaning
- [ ] Returns calculation (log returns)
- [ ] Mean and covariance computation

### Phase 2: Efficient Frontier (Sampling Approach)
- [ ] Random portfolio generation (Dirichlet distribution)
- [ ] Portfolio statistics calculation
- [ ] Identify GMV and Max Sharpe portfolios
- [ ] Basic visualization/output

### Phase 3: Beta Calculation & Hedging
- [ ] Implement OLS regression for beta
- [ ] Calculate portfolio beta from selected weights
- [ ] Compute SPY short position sizing
- [ ] Output hedge recommendations

### Phase 4: Enhancement
- [ ] (Optional) QP-based true efficient frontier
- [ ] (Optional) Futures contract sizing (ES/NQ)
- [ ] Web UI with charts (Next.js/React)
- [ ] Backtesting capability

---

## 7) Quick Start Package References

**Yahoo Finance Data:**
- Package: [`yahoo-finance2`](https://www.npmjs.com/package/yahoo-finance2)
- SGOV Ticker: `"SGOV"` ([Yahoo Finance](https://finance.yahoo.com/quote/SGOV/history/))

**Installation:**
```bash
npm install yahoo-finance2 mathjs
```

---

## 8) Technical Considerations

### Risk-Free Rate
Use SGOV's annualized average return as risk-free rate proxy for Sharpe ratio calculations.

### Data Quality
- Always use **Adjusted Close** prices to account for dividends/splits
- Handle missing data appropriately (intersection of available dates)
- Validate data alignment across all tickers

### Constraints
- Long-only constraint is default (`w_i ≥ 0`)
- Optional: Add maximum weight constraints (`w_i ≤ 0.3` for 30% max)
- Sum-to-one constraint always enforced (`Σ w_i = 1`)

### Beta Calculation Stability
- Use sufficient historical data (2+ years recommended)
- Consider rolling beta for robustness checks
- Validate beta values against market expectations

### Hedging Considerations
- SPY approach: Simpler, more accessible
- Futures approach: More capital efficient, requires futures account
- Transaction costs not included in MVP (add in Phase 2)

---

## 9) Success Criteria

**MVP Success:**
- ✅ Successfully fetch and process price data for user tickers + SGOV
- ✅ Generate efficient frontier with identifiable GMV and Max Sharpe portfolios
- ✅ Calculate portfolio beta against S&P 500
- ✅ Output required SPY short position for target beta

**Production Ready:**
- ✅ QP-based true efficient frontier
- ✅ Futures contract sizing support
- ✅ Web-based UI with interactive charts
- ✅ Backtesting and performance attribution
- ✅ Transaction cost modeling

---

## 10) Next Steps

**Ready to start implementation:**

Choose your preferred approach:
1. **Quick MVP (Recommended):** Sampling-based approach (Approach B) for fastest time-to-market
2. **Production Quality:** QP-based approach (Approach A) for mathematical accuracy

I can generate:
- Project folder structure
- `package.json` with dependencies
- Core JavaScript module skeletons
- Sample CLI implementation

Let me know which approach you prefer and I'll scaffold the project!
