# Portfolio Optimization & Beta Hedging Tool - Architecture

## Technology Stack

| Component | Technology | Notes |
|-----------|------------|-------|
| **Runtime** | Node.js (18+) | JavaScript/TypeScript execution environment |
| **Frontend** | Next.js 14+ | React framework with App Router, SSR/SSG support |
| **Backend** | Nest.js 10+ | TypeScript-first Node.js framework with modular architecture |
| **Market Data** | `yahoo-finance2` | For price history (Adj Close) - [npm package](https://www.npmjs.com/package/yahoo-finance2) |
| **Numerical Computing** | `mathjs` or `ml-matrix` | For matrix operations |
| **Optimization** | QP library or sampling | See optimization approaches below |
| **UI (MVP)** | CLI + JSON | Command-line interface for initial development |
| **UI (Production)** | Next.js + Glass UI | Modern glassmorphism design with interactive charts |

### Frontend Stack (Next.js)
- **Framework:** Next.js 14+ with App Router
- **Language:** TypeScript
- **Architecture Pattern:** FSD (Feature-Sliced Design) - *conceptual approach*
- **Styling:** Tailwind CSS with custom glass utilities
- **State Management:** React Context / Zustand
- **Charts:** Chart.js or Recharts with transparent themes
- **UI Components:** Radix UI with glass styling
- **Animations:** Framer Motion

### Backend Stack (Nest.js)
- **Framework:** Nest.js 10+ with TypeScript
- **Architecture Pattern:** DDD (Domain-Driven Design) - *conceptual approach*
- **Architecture:** Modular (modules for data, analytics, optimizer, hedge)
- **API:** RESTful API (future: GraphQL option)
- **Validation:** class-validator, class-transformer
- **Documentation:** Swagger/OpenAPI
- **Testing:** Jest for unit tests, Supertest for integration tests

---

## MVP Implementation Roadmap

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
- [ ] Next.js frontend with Glass UI design
- [ ] Nest.js backend API with Swagger documentation
- [ ] Backtesting capability

---

## Architectural Patterns (Conceptual)

### Frontend: FSD (Feature-Sliced Design)

**Concept:** Organize code by features and layers for better scalability and maintainability.

**Proposed Structure:**
```
apps/frontend/
├── app/                    # Next.js App Router
├── src/
│   ├── app/               # Application layer (providers, initialization)
│   ├── processes/         # Complex inter-feature scenarios
│   ├── pages/             # Page components
│   ├── widgets/           # Large composite blocks
│   ├── features/          # User interactions
│   │   ├── portfolio-builder/
│   │   ├── efficient-frontier/
│   │   └── hedge-calculator/
│   ├── entities/          # Business entities
│   │   ├── portfolio/
│   │   ├── ticker/
│   │   └── hedge/
│   └── shared/            # Shared UI, utils, API
│       ├── ui/            # Glass UI components
│       ├── lib/
│       └── api/
```

**Note:** *This is a conceptual approach. Adapt as needed based on project complexity.*

### Backend: DDD (Domain-Driven Design)

**Concept:** Organize code around business domains with clear boundaries.

**Proposed Structure:**
```
apps/backend/src/
├── domain/                # Domain layer (business logic)
│   ├── portfolio/
│   │   ├── entities/
│   │   ├── value-objects/
│   │   └── repositories/
│   ├── market-data/
│   └── hedging/
├── application/           # Application layer (use cases)
│   ├── portfolio/
│   │   ├── optimize-portfolio.use-case.ts
│   │   └── calculate-efficient-frontier.use-case.ts
│   └── hedging/
│       └── calculate-hedge.use-case.ts
├── infrastructure/        # Infrastructure layer (external services)
│   ├── yahoo-finance/
│   ├── database/
│   └── cache/
└── presentation/          # Presentation layer (API)
    ├── controllers/
    ├── dtos/
    └── mappers/
```

**Note:** *This is a conceptual approach. Nest.js modules may map to DDD bounded contexts.*

### Optimization Implementation Approaches

**Recommended for MVP:** Constraint-aware sampling (faster implementation)
- Long-only + sum=1 + optional bounds constraints
- QP (Quadratic Programming) for production accuracy
- JS QP libraries available (quadprog family)
- Grid/sampling approach viable for simplified constraints

---

## Data Pipeline Design

### Price Data Requirements

**Assets:**
- User-provided tickers
- `SGOV` (always included)

**Benchmark:**
- `^GSPC` (S&P 500 index) or `SPY` for beta calculation

**Frequency:** Daily

**Period:** 2-5 years historical (configurable based on stability requirements)

### Returns Calculation

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

## Efficient Frontier Calculation Methods

### Problem Definition (Long-only Base Case)

**Decision Variables:** Weights `w ∈ ℝ^N`

**Constraints:**
- Sum to one: `Σ w_i = 1`
- Long-only: `w_i ≥ 0`
- (Optional) Individual upper bounds: `w_i ≤ w_max` (concentration risk control)

### Approach A: Canonical QP (Production Quality)

For each target return `R`:
```
minimize    w^T Σ w
subject to  w^T μ = R
            Σ w_i = 1
            w_i ≥ 0
```

**Pros:** True efficient frontier
**Cons:** Requires QP solver implementation

### Approach B: Random Sampling (MVP Recommended)

1. Generate 10,000-100,000 portfolios using Dirichlet distribution (ensures sum=1, positive)
2. Calculate (volatility, expected return, Sharpe ratio) for each sample
3. Extract Pareto frontier as efficient frontier approximation

**Pros:** Simple implementation, fast to market
**Cons:** Approximation only

> **Recommendation:** Start with Approach B for MVP, implement Approach A in Phase 2 for accuracy.

---

## Portfolio Beta Calculation Methods

### Method: Direct Regression

For each asset:
```
r_asset = α + β × r_market + ε
```

**Portfolio Beta:**
- Option 1: `β_portfolio = Σ w_i × β_i` (weighted average of individual betas)
- Option 2: Regress portfolio return time series vs. market returns directly

---

## Hedge Sizing Calculations

**Given:**
- Portfolio value: `V_A`
- Current portfolio beta: `β_p`
- Target beta: `β*` (typically 0 for market-neutral)

### Method 1: Index Futures (e.g., ES)

Number of contracts required:
```
N = (β_p - β*) × V_A / V_F
```

Where `V_F` = dollar exposure per contract (e.g., ES = index × multiplier)

Reference: [Using Futures for Hedging](https://analystprep.com/study-notes/frm/part-1/financial-markets-and-products/hedging-strategies-using-futures/)

### Method 2: SPY ETF (Simplified)

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

## Module Structure & Design

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

## Interface Specifications

### CLI Interface (MVP - Phase 1)

**Technology:** Node.js CLI tool

**Command Format:**
```bash
node cli/index.js \
  --tickers AAPL,MSFT,NVDA \
  --start 2021-01-01 \
  --samples 50000 \
  --targetBeta 0
```

**Output Format:**
- JSON file with all results
- Console table with key metrics
- Easy to read portfolio weights

### Web Application (Production - Phase 2+)

**Technology Stack:**
- **Frontend:** Next.js 14+ with App Router
- **Backend:** Nest.js 10+ with RESTful API
- **Design:** Glass UI (glassmorphism) with Tailwind CSS
- **Charts:** Chart.js or Recharts with transparent themes
- **State:** React Context or Zustand

**Planned Features:**

**Interactive Portfolio Builder:**
- Drag-and-drop ticker input
- Real-time portfolio weight adjustments
- Live efficient frontier visualization with glass effects
- Hover tooltips with portfolio details

**Glass UI Design:**
- Frosted glass panels with backdrop blur
- Semi-transparent backgrounds
- Smooth animations with Framer Motion
- Professional, modern aesthetic

**User Features:**
- Save and manage multiple portfolios
- Export results to PDF/CSV
- Historical performance comparison
- Mobile-responsive design
- Dark/Light mode with glass effects

**API Features (Nest.js):**
- RESTful endpoints for all calculations
- Swagger/OpenAPI documentation
- Request validation with DTOs
- Error handling and logging
- Rate limiting for public access

### Production Ready Criteria

**Enhanced Features:**
- ✅ QP-based true efficient frontier (higher accuracy)
- ✅ Futures contract sizing support (ES/NQ)
- ✅ Next.js web application with Glass UI design
- ✅ Nest.js backend API with Swagger documentation
- ✅ Backtesting and performance attribution
- ✅ Transaction cost modeling

**Technical Stack:**
- ✅ Next.js 14+ frontend with TypeScript
- ✅ Nest.js 10+ backend with modular architecture
- ✅ Monorepo structure with shared packages
- ✅ RESTful API with validation and error handling

**User Experience:**
- Sub-5 second response time for portfolio calculation
- Professional-grade visualizations with interactive charts
- Mobile-responsive Glass UI design
- Export functionality for all reports (PDF/CSV)
- Dark/Light mode support

---

## Quick Start Package References

**Yahoo Finance Data:**
- Package: [`yahoo-finance2`](https://www.npmjs.com/package/yahoo-finance2)
- SGOV Ticker: `"SGOV"` ([Yahoo Finance](https://finance.yahoo.com/quote/SGOV/history/))

**Installation:**
```bash
npm install yahoo-finance2 mathjs
```

---

## Technical Considerations

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

## Project Structure

### Monorepo Architecture

```
glassbox/
├── apps/
│   ├── frontend/          # Next.js application
│   │   ├── app/          # App Router pages
│   │   ├── components/   # React components with Glass UI
│   │   ├── lib/          # Frontend utilities
│   │   ├── styles/       # Tailwind CSS + Glass utilities
│   │   └── package.json
│   │
│   ├── backend/           # Nest.js application
│   │   ├── src/
│   │   │   ├── data/     # Data module (price fetching, alignment)
│   │   │   ├── analytics/ # Analytics module (returns, covariance, stats)
│   │   │   ├── optimizer/ # Optimizer module (efficient frontier)
│   │   │   ├── hedge/    # Hedge module (beta calculation, hedging)
│   │   │   ├── api/      # API controllers and DTOs
│   │   │   └── main.ts   # Application entry point
│   │   └── package.json
│   │
│   └── cli/               # CLI tool (MVP)
│       ├── src/
│       │   └── index.ts  # CLI implementation
│       └── package.json
│
├── packages/              # Shared packages
│   ├── types/            # Shared TypeScript types
│   ├── utils/            # Shared utilities
│   └── config/           # Shared configuration
│
├── .claude/              # Claude Code configuration
├── package.json          # Root package.json (workspace)
├── turbo.json            # Turborepo configuration (optional)
└── tsconfig.json         # Root TypeScript configuration
```

### Module Organization (Nest.js Backend)

**Data Module (`apps/backend/src/data/`)**
- `data.service.ts` - Price fetching and alignment logic
- `data.controller.ts` - API endpoints for data operations
- `yahoo-finance.provider.ts` - Yahoo Finance integration

**Analytics Module (`apps/backend/src/analytics/`)**
- `analytics.service.ts` - Returns calculation, covariance, statistics
- `analytics.controller.ts` - API endpoints for analytics
- `portfolio-stats.service.ts` - Portfolio metrics calculation

**Optimizer Module (`apps/backend/src/optimizer/`)**
- `optimizer.service.ts` - Efficient frontier calculation
- `optimizer.controller.ts` - API endpoints for optimization
- `sampling.strategy.ts` - Random sampling approach
- `qp.strategy.ts` - Quadratic programming approach (Phase 2)

**Hedge Module (`apps/backend/src/hedge/`)**
- `hedge.service.ts` - Beta calculation and hedge sizing
- `hedge.controller.ts` - API endpoints for hedging
- `beta.calculator.ts` - Portfolio beta calculation
- `hedge.calculator.ts` - SPY/Futures hedge sizing
