# Glassbox - Web Application Pages (MVP)

## Overview

Four-page MVP application for portfolio optimization and analysis.

| Route | Purpose |
|-------|---------|
| `/` | Marketing landing page |
| `/portfolio/new` | Portfolio builder and input |
| `/analysis/result` | Optimization results & hedging recommendations |
| `/portfolios` | Saved portfolios library |

---

## Page 1: Landing (`/`)

### UI Components
- **Hero Section** - Value proposition with "Start Analysis" CTA button (links to Page 2)
- **Feature Cards** - 3 cards highlighting Efficient Frontier, Beta Hedging, Glass UI design

### Key Features
- Static marketing content
- Navigation to application

### Tech Stack
- Frontend: Next.js only

---

## Page 2: Portfolio Builder (`/portfolio/new`)

### UI Components
- **Search Bar** - Ticker search with autocomplete
- **Quick-add Chips** - Preset tags (#Safe(TLT), #Bitcoin, #Gold) auto-fill on click
- **Asset List** - Rows with Ticker | Quantity Input | Delete button
- **Action Bar** - Floating or fixed "Analyze" button

### Key Features
- Ticker validation via search
- Quantity input for accurate weighting (not average price)
- Client-side state management for asset list

### Tech Stack
- **API:** `GET /tickers/search?q=...` (NestJS proxying Yahoo Finance)
- **State:** React useState → `[{ symbol: 'AAPL', qty: 10 }, ...]`

---

## Page 3: Analysis Results (`/analysis/result`)

### UI Components

**Tab 1: Efficient Frontier**
- Scatter plot (Risk X-axis, Return Y-axis) with "My Portfolio" marker
- Metric cards showing GMV (Min Risk) & Max Sharpe (Max Efficiency)
- Weights table with optimal asset allocation percentages

**Tab 2: Beta Hedging**
- Beta display showing current portfolio beta (e.g., 1.5)
- Actionable insight (e.g., "Short 23 shares of SPY to hedge market risk")
- "Save Portfolio" floating action button

### Key Features
- Visualize complex financial data
- **Snapshot Pattern**: Displays either:
  - **Fresh Analysis**: New portfolio analysis (not yet saved)
  - **Saved Snapshot**: Historical analysis snapshot from database
- Save or update analysis results to database
- Re-analyze: Users can refresh analysis with current market data and save new version

### Page States

#### State 1: Fresh Analysis (No Query Params)
- User clicked "Analyze" from `/portfolio/new`
- Displays real-time analysis results
- "Save Portfolio" button saves snapshot to DB as new portfolio

#### State 2: Saved Portfolio Snapshot (With `portfolioId` Query Param)
- User clicked portfolio from `/portfolios`
- Displays snapshot from database (historical analysis)
- "Re-analyze" button re-runs analysis with same tickers/quantities
- "Save" button after re-analysis updates the saved snapshot (overwrites previous)

### Tech Stack
- **API:** `POST /analyze` (NestJS ↔ Python Worker ↔ PyPortfolioOpt)
- **API:** `POST /portfolios` (saves ticker/qty/snapshot - new portfolio)
- **API:** `PUT /portfolios/:id` (updates ticker/qty/snapshot - existing portfolio)
- **API:** `GET /portfolios/:id` (retrieves saved portfolio snapshot)
- **Query Param:** `?portfolioId=<id>` (loads saved analysis snapshot)
- **Visualization:** Recharts or Chart.js
- **DB:** Stores analysis snapshot (weights, efficient frontier, beta, hedging data)

---

## Page 4: Portfolio Library (`/portfolios`)

### UI Components
- **Card Grid** - Portfolio Name, Date, Key Asset Badges
- **"View Analysis" Button** - Navigates to `/analysis/result?portfolioId=<id>` (shows saved snapshot)
- **"Re-analyze" Button** - Refreshes analysis with current market data, displays on same page
- **"Save" Button** (after re-analyze) - Updates portfolio with new snapshot (overwrites previous)
- **Delete Action** - Trash icon on each card

### Key Features
- **List retrieval** - Fetch all saved portfolios (CRUD operations)
- **View Snapshot** - Click card to see historical analysis (displays saved snapshot)
- **Re-analyze Pattern**:
  1. User views saved portfolio
  2. Clicks "Re-analyze" to refresh with current market data
  3. Sees updated analysis results
  4. Clicks "Save" to update portfolio (overwrites snapshot, updates `updatedAt`)
- No version history - only latest snapshot is stored

### Tech Stack
- **API:** `GET /portfolios` (NestJS + Prisma - list all portfolios)
- **API:** `GET /portfolios/:id` (NestJS + Prisma - retrieve single portfolio with snapshot)
- **API:** `DELETE /portfolios/:id` (NestJS + Prisma - delete portfolio)
- **Navigation:** Click portfolio card → `/analysis/result?portfolioId=<id>`

---

## System & Infrastructure

### Navigation
- Top bar with Logo, Analyze, Library, Login/Logout

### Authentication
- Google OAuth (Passport.js + JWT strategy)

### Database
- **Engine:** PostgreSQL
- **Tables:** User, Portfolio, PortfolioItem, PortfolioAnalysisSnapshot

**Portfolio Table Schema:**
```
Portfolio {
  id: UUID (primary key)
  userId: UUID (foreign key → User)
  name: String
  tickers: String[] (e.g., ['AAPL', 'MSFT', 'NVDA'])
  quantities: Float[] (e.g., [10, 20, 15])
  analysisSnapshot: JSON (latest analysis results)
    {
      efficientFrontier: [{return, volatility, sharpeRatio}, ...]
      gmv: {weights: {}, stats: {return, volatility, sharpe}}
      maxSharpe: {weights: {}, stats: {return, volatility, sharpe}}
      portfolioBeta: 1.25
      hedging: {
        spyShares: 42,
        spyNotional: 18500,
        esContracts: 7,
        esNotional: 17850
      }
    }
  createdAt: Timestamp
  updatedAt: Timestamp (refreshed when snapshot is saved/updated)
}
```

**Update Pattern:**
- **New Portfolio**: `POST /portfolios` → Creates Portfolio with analysisSnapshot, sets createdAt
- **Update Snapshot**: `PUT /portfolios/:id` → Updates tickers, quantities, analysisSnapshot, and updatedAt
- **Retrieve**: `GET /portfolios/:id` → Returns full Portfolio including analysisSnapshot
- **No Version History**: analysisSnapshot is overwritten on each save (no previous versions kept)

### Architecture
- REST API (NestJS) + Python Worker (data processing)