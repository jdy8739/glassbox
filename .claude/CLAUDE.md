# Glassbox - Portfolio Optimization Tool

## What is Glassbox?

Glassbox is a JavaScript-based portfolio optimization and beta hedging tool with a modern Glass UI design. The project embodies values of **purity, transparency, trust, and innovation** in portfolio management.

**Core Features:**
- Long-only Efficient Frontier Analysis (GMV, Max Sharpe, Target portfolios)
- Portfolio Beta Calculation & Hedging (SPY/Futures)
- Glass UI design reflecting transparency values

---

## Documentation Structure

All project documentation is organized in `.claude/` directory:

### 📋 Product & Features
**File:** `.claude/rules/prd.md`

**Contains:**
- Product requirements and objectives
- Feature specifications (Efficient Frontier, Beta Hedging)
- User requirements and target users
- MVP roadmap and success criteria
- UI/UX specifications

**Read this for:** What we're building, who it's for, and why

---

### 🏗️ Code & Architecture
**File:** `.claude/rules/architecture.md`

**Contains:**
- Technology stack (Node.js, yahoo-finance2, mathjs)
- Module structure (data, analytics, optimizer, hedge, app)
- Algorithm implementations (QP vs Sampling)
- Technical specifications and formulas
- Package references and installation

**Read this for:** How to build it, technical implementation details

---

### 🎨 Design System
**File:** `.claude/rules/design.md`

**Contains:**
- Glass UI/Glassmorphism design specifications
- Color palette, typography, components
- Visual effects (frosted glass, backdrop blur)
- Accessibility and performance considerations
- Brand values reflected in design

**Read this for:** Visual design, UI components, styling guidelines

---

### 📄 Page Structure & Features
**File:** `.claude/rules/pages.md`

**Contains:**
- Web application page structure (7 pages)
- Features and services for each page
- Navigation structure (primary, contextual, footer)
- User actions and page purposes
- Service requirements per page

**Read this for:** What pages to build, features per page, navigation flow

---

### 🤖 Custom Agents
**File:** `.claude/agents/senior-UIUX-designer.md`

**Purpose:** Senior UI/UX designer agent for Glass UI design work

---

### ⚙️ Settings
**File:** `.claude/settings.json`

**Contains:**
- Team-wide permissions (full CRUD, WebSearch enabled)
- Custom agent configurations
- Shared development settings

---

## Quick Reference

### Current Status
- ✅ PRD documented → `.claude/rules/prd.md`
- ✅ Architecture defined → `.claude/rules/architecture.md`
- ✅ Glass UI design system → `.claude/rules/design.md`
- ✅ Page structure & features → `.claude/rules/pages.md`
- ⏳ Implementation pending

### Key Technologies
- **Runtime:** Node.js 18+ with TypeScript
- **Frontend:** Next.js 14+ with App Router, Glass UI (Tailwind CSS)
- **Backend:** Nest.js 10+ with modular architecture
- **Data:** yahoo-finance2
- **Computation:** mathjs or ml-matrix
- **UI:** CLI (MVP) → Next.js Web App (Production)

### Quick Start (Future)

**CLI (MVP):**
```bash
npm install
node cli/index.js --tickers AAPL,MSFT,NVDA --start 2021-01-01 --samples 50000 --targetBeta 0
```

**Web App (Production):**
```bash
# Install dependencies
npm install

# Start backend (Nest.js)
npm run dev:backend

# Start frontend (Next.js)
npm run dev:frontend
```

---

## Notes for AI Assistants

- **Always use Adjusted Close prices** (critical for SGOV dividends)
- **Prefer sampling approach for MVP**, QP for production
- **Glass UI reflects transparency values** in every component
- **Follow modular architecture** in `src/` directory
- **Read specific files above** for detailed information on each concern
