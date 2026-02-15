# Glassbox — Portfolio Optimization with Transparency

**Make smarter investment decisions with complete clarity.**

Stop guessing about your portfolio. Glassbox gives you the insights and recommendations you need to optimize your investments, reduce risk, and understand exactly what you own.

---

## 💡 The Problem

Most investors face three challenges:

1. **Portfolio Confusion** — Should I own 20% AAPL or 10%? How much is too much?
2. **Hidden Risk** — Is my portfolio exposed to market crashes? By how much?
3. **No Roadmap** — If I want to reduce market risk, what exactly should I do?

Glassbox solves all three.

---

## 🎯 What Glassbox Delivers

### 1. **Optimal Portfolio Weights**
Discover the exact allocation that balances risk and return for your goals.
- See what "optimal" actually looks like for your stocks
- Compare lowest-risk vs. highest-return strategies instantly
- Make confident rebalancing decisions with data, not emotion

### 2. **Complete Risk Visibility**
Understand your portfolio's market exposure—down to the number.
- Know exactly how your portfolio moves with market crashes
- Identify concentration risks before they hurt you
- Compare your portfolio to the market itself

### 3. **Actionable Hedging Strategies**
Get specific, executable recommendations to protect your wealth.
- "Short 23 shares of SPY" — actionable instructions
- Protect your portfolio while keeping your alpha
- Choose hedging methods that fit your account size and style

---

## 📊 Why Glassbox?

**No Black Boxes** — See exactly how every number is calculated. No proprietary secrets.

**Instant Results** — Analysis in 10-30 seconds, not hours or days.

**Built for Everyone** — Whether you manage $50k or $5M, Glassbox works for you.

**Transparent Methodology** — Based on Modern Portfolio Theory, not marketing claims.

**Free to Explore** — No signup required to play with your portfolio ideas.

**Save & Compare** — Track multiple strategies over time and see how they perform.

---

## 🚀 How It Works

**Step 1: Enter Your Portfolio**
- Type in stock tickers you own or want to own
- Add quantities (the actual number of shares you hold)
- Glassbox automatically includes treasury bonds for stability

**Step 2: Get Your Analysis**
- Historical data fetched automatically
- Efficient frontier calculated in seconds
- Results shown in clear, visual form

**Step 3: Understand Your Options**
- See the lowest-risk portfolio for your stocks
- See the highest return-per-risk portfolio
- See your current portfolio plotted on the risk/return spectrum

**Step 4: Get Hedging Guidance**
- Learn your portfolio's beta (market sensitivity)
- Get specific recommendations for reducing market exposure
- Choose between simple (SPY) or advanced (futures) hedging

**Step 5: Make Better Decisions**
- Save your analysis for future reference
- Compare multiple portfolio strategies
- Rebalance with confidence

---

## ✨ Real Value You Get

✅ **Confidence** — Know your portfolio is optimized, not random

✅ **Risk Control** — See and manage your market exposure explicitly

✅ **Time Savings** — Get analysis in seconds instead of research hours

✅ **Better Returns** — Optimize risk-adjusted returns mathematically

✅ **Protection** — Know how to hedge when you need to

✅ **Transparency** — Understand every calculation

---

## 🎨 Designed for Trust

Glassbox uses transparent glass UI design reflecting our core values:
- **Transparency** — See through every recommendation
- **Clarity** — Complex ideas explained simply
- **Trust** — No hidden costs, no proprietary algorithms

Every interaction is designed to build confidence in your investment decisions.

---

## ⚠️ Important: This Is Not Financial Advice

Glassbox is an educational and analytical tool. It provides analysis based on historical data, but historical performance does not guarantee future results. Market conditions change. Past correlations may break down.

**Always consult a qualified financial advisor before making investment decisions.**

[Read full disclaimers →](./apps/web/public/glassbox-introduction-en.pdf)

---

## 🏃 Ready to Optimize Your Portfolio?

1. Visit [glassbox.space](https://glassbox.space)
2. Enter your stock tickers
3. Click "Analyze"
4. Get insights in seconds
5. Save your strategy

**No signup required to explore. Sign up to save and track.**

---

## 🏗️ For Developers & Contributors

Interested in how Glassbox works under the hood?

### Technology
- **Frontend**: Next.js 14+ with modern Glass UI
- **Backend**: Nest.js 10+ REST API with Python optimization engine
- **Database**: PostgreSQL
- **Market Data**: Yahoo Finance real-time data
- **Optimization**: Modern Portfolio Theory with Monte Carlo sampling

### Get Started Locally

```bash
# Install everything
pnpm install
cd apps/backend/python && pip3 install -r requirements.txt && cd ../../..

# Start dev servers
pnpm dev
```

Runs at:
- Frontend: http://localhost:3000
- Backend: http://localhost:4000

### Project Structure

```
glassbox/
├── apps/web/           # Next.js frontend (Glass UI)
├── apps/backend/       # Nest.js API + Python worker
├── apps/cli/           # Command-line tool (MVP)
└── packages/           # Shared types, utils, configs
```

### Common Commands

```bash
pnpm dev              # Start all services
pnpm run fe           # Frontend only
pnpm run be           # Backend only
pnpm build            # Build everything
pnpm lint             # Check code quality
pnpm format           # Auto-format code
```

---

## 📖 Learn More

- **[Introduction Guide](./apps/web/public/glassbox-introduction-en.pdf)** — Full user guide with disclaimers
- **[.claude/ Documentation](./CLAUDE.md)** — Complete technical specs
- **[Frontend README](./apps/web/README.md)** — Next.js setup
- **[Backend README](./apps/backend/README.md)** — Nest.js setup

---

## 🚀 Deploy Glassbox

### Frontend
Vercel, Netlify, or any Node.js host

### Backend
AWS, Heroku, Railway, or any Node.js host

### Database
PostgreSQL 12+ required

---

## 🤝 Contributing

Help us make Glassbox better:

1. Fork the repo
2. Create a feature branch
3. Make your changes (`pnpm lint`, `pnpm type-check`)
4. Submit a pull request

---

## 📝 License

MIT — Use freely, commercially and personally.

---

## 💬 Have Questions?

- 📚 Read the [Introduction Guide](./apps/web/public/glassbox-introduction-en.pdf)
- 🛠️ Check [.claude/ docs](./CLAUDE.md) for technical details
- 📖 See individual app READMEs for setup help

---

**Glassbox — Make smarter investment decisions with complete clarity.**
