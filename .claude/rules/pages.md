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
- Save analysis results to database

### Tech Stack
- **API:** `POST /analyze` (NestJS ↔ Python Worker ↔ PyPortfolioOpt)
- **Visualization:** Recharts or Chart.js
- **DB:** `POST /portfolios` (saves ticker/qty data)

---

## Page 4: Portfolio Library (`/portfolios`)

### UI Components
- **Card Grid** - Portfolio Name, Date, Key Asset Badges
- **Delete Action** - Trash icon on each card

### Key Features
- List retrieval (CRUD operations)
- Re-analysis: Clicking card triggers fresh analysis (Page 3) with saved tickers

### Tech Stack
- **API:** `GET /portfolios` (NestJS + Prisma)
- **API:** `DELETE /portfolios/:id`

---

## System & Infrastructure

### Navigation
- Top bar with Logo, Analyze, Library, Login/Logout

### Authentication
- Google OAuth (Passport.js + JWT strategy)

### Database
- **Engine:** PostgreSQL
- **Tables:** User, Portfolio, PortfolioItem

### Architecture
- REST API (NestJS) + Python Worker (data processing)