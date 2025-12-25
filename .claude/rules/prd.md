# Portfolio Optimization & Beta Hedging Tool - Product Requirements Document

## Project Overview & Scope

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

## Feature 1: Efficient Frontier for Optimal Asset Allocation

### User Requirements

**What Users Need:**
- Ability to input multiple stock tickers
- Automatic inclusion of SGOV as risk-free asset
- Visual representation of risk-return tradeoff (Efficient Frontier chart)
- Identification of optimal portfolios

**Key Portfolios Delivered:**
1. **GMV (Global Minimum Variance)** portfolio
   - Portfolio with lowest possible volatility
   - Ideal for risk-averse investors

2. **Max Sharpe (Tangency)** portfolio
   - Best risk-adjusted returns
   - Risk-free rate: annualized average return of SGOV
   - Optimal for most investors seeking efficiency

3. **Target volatility/return** portfolio
   - User-specified risk or return target
   - Customizable to individual preferences

**Visualizations:**
- Efficient frontier chart (return vs. volatility)
- Portfolio weights table
- Clear display of each asset's allocation percentage

---

## Feature 2: S&P 500 Beta Hedging Sizing

### User Requirements

**What Users Need:**
- Understanding of portfolio's market exposure (beta)
- Recommendation for hedge position sizing
- Flexibility to target different beta levels (market-neutral, partially hedged, etc.)

**Hedging Methods Supported:**

#### Method 1: SPY ETF Hedging
- **User-Friendly:** Simple to understand and execute
- **Output:** Exact number of SPY shares to short
- **Dollar Amount:** Total hedge value in dollars
- **Accessibility:** Available in most brokerage accounts

#### Method 2: Futures Hedging (ES/NQ)
- **Capital Efficiency:** Leverage for larger portfolios
- **Output:** Number of futures contracts to short
- **Advanced:** For sophisticated investors
- **Requirements:** Futures trading account

**Key Metrics Provided:**
- Current portfolio beta (S&P 500 exposure)
- Target beta (user-specified, default = 0 for market-neutral)
- Required short position size
- Expected post-hedge beta

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

## User Interface & Experience

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

---

## Success Criteria

### MVP Success Metrics

**Must Have:**
- ✅ Successfully fetch and process price data for user tickers + SGOV
- ✅ Generate efficient frontier with identifiable GMV and Max Sharpe portfolios
- ✅ Calculate portfolio beta against S&P 500
- ✅ Output required SPY short position for target beta

**User Validation:**
- Users can input 3-10 tickers and receive optimal portfolios
- Portfolio recommendations are mathematically sound
- Hedge sizing is accurate and actionable
- Output is clear and understandable

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

## Target Users

### Primary Users
1. **Individual Investors**
   - Seeking to optimize personal portfolios
   - Want to understand risk-return tradeoffs
   - Need simple hedging recommendations

2. **Financial Advisors**
   - Managing client portfolios
   - Demonstrating optimal allocations
   - Implementing hedging strategies

3. **Quantitative Analysts**
   - Researching portfolio strategies
   - Testing optimization approaches
   - Backtesting performance

### User Needs
- **Transparency:** Clear methodology and calculations
- **Simplicity:** Easy to use, even without deep financial background
- **Accuracy:** Mathematically sound portfolio recommendations
- **Actionability:** Specific, implementable hedge positions

---

## Product Constraints & Assumptions

### Data Constraints
- Historical data availability (2-5 years recommended)
- Daily frequency (not intraday)
- Yahoo Finance as data source

### Portfolio Constraints
- Long-only positions (no shorting in portfolio, only for hedging)
- Fully invested (weights sum to 100%)
- Optional: Maximum position size limits

### User Assumptions
- Users understand basic portfolio concepts (risk, return, diversification)
- Users have access to brokerage accounts for trading
- Users can interpret portfolio weights and follow recommendations

---

## Next Steps

**Ready to start implementation:**

Choose your preferred approach:
1. **Quick MVP (Recommended):** Sampling-based approach for fastest time-to-market
2. **Production Quality:** QP-based approach for mathematical accuracy

**Development Path:**
- Start with CLI for core functionality validation
- Gather user feedback on output format and usability
- Expand to web UI with Glass design aesthetic
- Add advanced features (backtesting, futures, etc.)

**Key Questions for Users:**
- What tickers are you most interested in analyzing?
- Do you prefer SPY or futures hedging?
- What target beta level makes sense for your strategy?
- What visualization format is most useful?
