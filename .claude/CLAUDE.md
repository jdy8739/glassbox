# Glassbox - Portfolio Optimization Tool

## Project Overview

Glassbox is a JavaScript-based portfolio optimization and beta hedging tool that provides transparent, pure financial analysis through a modern Glass UI interface. The project embodies values of clarity, honesty, and openness in portfolio management.

## Core Functionality

**Inputs:**
- Stock tickers (e.g., AAPL, MSFT, NVDA)
- SGOV (iShares 0-3 Month Treasury Bond ETF) - always included

**Outputs:**
1. **Long-only Efficient Frontier Analysis**
   - Efficient Frontier visualization
   - Global Minimum Variance (GMV) portfolio weights
   - Maximum Sharpe Ratio (Tangency) portfolio weights
   - Target return portfolio weights

2. **Portfolio Beta Analysis & Hedging**
   - Portfolio beta calculation (against S&P 500)
   - Required short position sizing to achieve target beta
   - Support for both SPY (ETF) and ES (futures) hedging methods

## Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| Runtime | Node.js 18+ | JavaScript execution environment |
| Market Data | `yahoo-finance2` | Historical price data (Adjusted Close) |
| Numerical Computing | `mathjs` or `ml-matrix` | Matrix operations for portfolio optimization |
| Optimization | Sampling/QP library | Efficient frontier calculation |
| UI | CLI + JSON (MVP) | Command-line interface, expandable to Next.js/React |
| Design System | Glass UI / Glassmorphism | Modern, transparent interface reflecting brand values |

## Project Structure

```
glassbox/
├── .claude/                    # Claude Code configuration
│   ├── CLAUDE.md              # This file - project memory
│   ├── rules/                 # Documentation modules
│   │   └── design.md         # Glass UI design system
│   ├── agents/               # Custom AI agents
│   │   └── senior-UIUX-designer.md
│   ├── settings.json         # Team settings (to be created)
│   └── settings.local.json   # Personal settings
├── CLAUDE/                    # Legacy docs (to be migrated)
│   ├── concepts/prd.md       # Product requirements document
│   └── architecture/modules.md
├── src/                       # Source code (to be created)
│   ├── data/                 # Price fetching and alignment
│   ├── analytics/            # Returns, covariance, statistics
│   ├── optimizer/            # Efficient frontier algorithms
│   ├── hedge/                # Beta calculation and hedging
│   └── app/                  # CLI interface
└── package.json              # Dependencies (to be created)
```

## Module Architecture

### 1. data/
- `fetchPrices(tickers, start, end, interval)` - Yahoo Finance integration
- `alignSeries(pricesByTicker)` - Date alignment across tickers

### 2. analytics/
- `returns(prices, method="log")` - Log/simple returns calculation
- `meanCov(returns, annualize=true)` - Mean vector & covariance matrix
- `portfolioStats(w, mu, cov, rf)` - Expected return, volatility, Sharpe ratio
- `betaRegression(assetReturns, marketReturns)` - OLS regression for beta

### 3. optimizer/
- `randomFrontier(mu, cov, nSamples, constraints)` - Sampling approach (MVP)
- `qpEfficientFrontier(mu, cov, constraints)` - QP solver (Phase 2)

### 4. hedge/
- `portfolioBeta(weights, betas)` - Weighted average beta
- `betaFromPortfolioReturns(portfolioReturns, marketReturns)` - Direct regression
- `hedgeNotional(betaP, targetBeta, portfolioValue)` - Hedge dollar amount
- `spySharesToShort(hedgeNotional, spyPrice)` - SPY shares to short
- `futuresContractsToShort(hedgeNotional, contractNotional)` - Futures contracts

### 5. app/
- CLI interface with command-line arguments
- JSON output with console visualization

## Key Commands

```bash
# Install dependencies
npm install yahoo-finance2 mathjs

# Run portfolio optimization (future)
node index.js --tickers AAPL,MSFT,NVDA --start 2021-01-01 --samples 50000 --targetBeta 0
```

## Implementation Approach

**MVP Strategy:** Sampling-based approach (Approach B)
- Generate 10,000-100,000 random portfolios using Dirichlet distribution
- Calculate statistics for each portfolio
- Extract Pareto frontier as efficient frontier approximation
- Fast to market, good for initial validation

**Production Strategy:** QP-based approach (Approach A)
- True efficient frontier using Quadratic Programming solver
- Higher accuracy for production use
- Implement after MVP validation

## Data Requirements

**Assets:**
- User-provided tickers + SGOV (always included)
- Benchmark: ^GSPC (S&P 500) or SPY for beta calculation

**Data Specifications:**
- Price type: **Adjusted Close** (critical for SGOV dividends)
- Frequency: Daily
- Period: 2-5 years historical (configurable)
- Return method: Log returns `r_t = ln(P_t / P_{t-1})`
- Annualization: Daily × 252 for annual metrics

## Design Philosophy

**Brand Values:**
- **Purity:** Clean, minimal interface with no clutter
- **Transparency:** Glass UI with visible data layers, no hidden information
- **Trust:** Professional, modern aesthetic with reliable interactions
- **Innovation:** Cutting-edge glassmorphism design

**Visual Style:**
- Frosted glass effects with backdrop blur
- Semi-transparent backgrounds (rgba 0.1-0.3 alpha)
- Soft gradients and generous whitespace
- Real-time data transparency through glass panels

See `.claude/rules/design.md` for complete Glass UI design system.

## Development Phases

### Phase 1: Core Data Pipeline ⏳
- [ ] Price collection from Yahoo Finance
- [ ] Data alignment and cleaning
- [ ] Returns calculation (log returns)
- [ ] Mean and covariance computation

### Phase 2: Efficient Frontier 📊
- [ ] Random portfolio generation (Dirichlet distribution)
- [ ] Portfolio statistics calculation
- [ ] Identify GMV and Max Sharpe portfolios
- [ ] Basic visualization/output

### Phase 3: Beta Calculation & Hedging 🛡️
- [ ] Implement OLS regression for beta
- [ ] Calculate portfolio beta from selected weights
- [ ] Compute SPY short position sizing
- [ ] Output hedge recommendations

### Phase 4: Enhancement 🚀
- [ ] QP-based true efficient frontier
- [ ] Futures contract sizing (ES/NQ)
- [ ] Web UI with Glass design (Next.js/React)
- [ ] Backtesting capability

## Important Technical Notes

### Risk-Free Rate
Use SGOV's annualized average return as risk-free rate proxy for Sharpe ratio calculations.

### Constraints
- Long-only: `w_i ≥ 0` (all weights positive)
- Sum to one: `Σ w_i = 1` (fully invested)
- Optional: Individual max weights `w_i ≤ 0.3` (concentration risk control)

### Beta Calculation
- Use 2+ years of historical data for stability
- Consider rolling beta for robustness checks
- Validate against market expectations

### Hedging Methods
- **SPY ETF:** Simpler, more accessible (MVP)
- **Futures (ES/NQ):** More capital efficient, requires futures account (Phase 2)

## Success Criteria

**MVP Success:**
- ✅ Fetch and process price data for user tickers + SGOV
- ✅ Generate efficient frontier with GMV and Max Sharpe portfolios
- ✅ Calculate portfolio beta against S&P 500
- ✅ Output required SPY short position for target beta

**Production Ready:**
- ✅ QP-based true efficient frontier
- ✅ Futures contract sizing support
- ✅ Web-based Glass UI with interactive charts
- ✅ Backtesting and performance attribution
- ✅ Transaction cost modeling

## Additional Resources

- Product Requirements: `CLAUDE/concepts/prd.md`
- Module Architecture: `CLAUDE/architecture/modules.md`
- Glass UI Design System: `.claude/rules/design.md`
- Yahoo Finance API: https://www.npmjs.com/package/yahoo-finance2
- SGOV Data: https://finance.yahoo.com/quote/SGOV/history/

## Current Status

**Project State:** Planning & Design
- ✅ PRD documented
- ✅ Glass UI design system defined
- ⏳ Project structure being organized
- ⏳ Implementation pending

## Notes for AI Assistants

- Always use **Adjusted Close** prices for calculations
- SGOV has significant dividend characteristics - adjusted prices are essential
- Prefer sampling approach for MVP, QP for production
- Glass UI should reflect transparency values in every component
- Follow modular architecture in `src/` directory structure
