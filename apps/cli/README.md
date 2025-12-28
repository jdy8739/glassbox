# Glassbox CLI

Command-line interface for portfolio optimization and beta hedging analysis.

## Overview

The Glassbox CLI is the MVP tool for testing portfolio optimization algorithms before building the full web application.

## Installation

```bash
cd apps/cli
pnpm install
```

## Usage

### Basic Analysis

```bash
# Analyze a portfolio with 3 assets
pnpm dev analyze -t AAPL MSFT NVDA

# With custom historical period and samples
pnpm dev analyze -t AAPL MSFT --start 2020-01-01 --samples 10000

# Save results to file
pnpm dev analyze -t TSLA NVDA -o results.json

# Target specific beta (market-neutral portfolio)
pnpm dev analyze -t AAPL MSFT NVDA --target-beta 0
```

### Options

- `-t, --tickers <tickers...>` - Stock tickers to analyze (required)
- `--start <date>` - Start date for historical data (YYYY-MM-DD, default: 2021-01-01)
- `--end <date>` - End date for historical data (YYYY-MM-DD, default: today)
- `-s, --samples <number>` - Number of portfolios to sample (default: 50000)
- `--target-beta <number>` - Target portfolio beta for hedging (default: 0)
- `-o, --output <path>` - Save results to JSON file

## Project Structure

```
src/
├── index.ts           # CLI entry point
└── commands/
    └── analyze.ts    # Analyze command handler
```

## Development

```bash
# Run CLI with ts-node
pnpm dev analyze -t AAPL MSFT

# Build
pnpm build

# Run compiled version
pnpm start analyze -t AAPL MSFT

# Linting
pnpm lint
pnpm type-check
```

## Output

The CLI outputs portfolio analysis results in JSON format:

```json
{
  "status": "success",
  "portfolio": {
    "items": [
      { "symbol": "AAPL", "quantity": 1 },
      { "symbol": "MSFT", "quantity": 1 }
    ]
  },
  "efficientFrontier": {
    "portfolios": [...],
    "gmv": {...},
    "maxSharpe": {...}
  },
  "hedging": {
    "currentBeta": 1.2,
    "targetBeta": 0,
    "spy": {
      "sharesToShort": 50,
      "notionalAmount": 15000
    }
  }
}
```

## Technologies

- Commander.js - CLI framework
- Chalk - Colored console output
- TypeScript - Type safety
- yahoo-finance2 - Market data
- mathjs - Portfolio calculations

## Roadmap

- [ ] Implement efficient frontier calculation (sampling)
- [ ] Add Yahoo Finance data fetching
- [ ] Calculate portfolio statistics
- [ ] Implement beta hedging recommendations
- [ ] Add progress indicators
- [ ] Support multiple output formats (CSV, PDF)
