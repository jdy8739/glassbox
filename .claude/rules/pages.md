# Glassbox - Web Application Pages (MVP)

## Page 1: Landing (`/`)

**What it serves:** Marketing and product introduction

**Features:**
- Hero section with value proposition
- "Start Analysis" button → Portfolio Builder
- 3 feature cards (Efficient Frontier, Beta Hedging, Glass UI)

---

## Page 2: Portfolio Builder (`/portfolio/new`)

**What it serves:** Input tickers and configure analysis

**Features:**
- Ticker input with add/remove (SGOV auto-included)
- Date range picker (start/end dates)
- "Analyze" button

**Services:** Ticker validation, Portfolio save

---

## Page 3: Analysis Results (`/analysis/[id]`)

**What it serves:** Show efficient frontier and hedge calculations

**Features:**
- **Tab 1: Efficient Frontier**
  - Scatter plot chart (risk vs return)
  - 2 portfolio cards: GMV and Max Sharpe
  - Weights table for each portfolio

- **Tab 2: Beta Hedging**
  - Portfolio beta display
  - SPY short position calculator
  - Hedge recommendation (shares to short)

**Services:** Optimization engine, Beta calculation, Chart generation

---

## Page 4: Portfolio Library (`/portfolios`)

**What it serves:** List of saved portfolio analyses

**Features:**
- Portfolio cards grid (name, date, tickers)
- Click card → view analysis
- Delete button per card

**Services:** Portfolio list retrieval

---

## Navigation

**Top Bar:**
- Logo → Home
- New Analysis
- My Portfolios

**Footer:**
- About | Help | Privacy
