# Glassbox Backend

Nest.js 10+ REST API for portfolio optimization and beta hedging.

## Features

- Portfolio CRUD operations
- Efficient frontier calculation
- Beta calculation and hedging recommendations
- Market data fetching from Yahoo Finance
- Google OAuth authentication with JWT
- API documentation with Swagger/OpenAPI
- PostgreSQL database with Prisma ORM

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 12+
- pnpm

### Installation

```bash
cd apps/backend
pnpm install
```

### Environment Setup

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Update with your configuration (database URL, JWT secret, OAuth credentials).

### Database Setup

```bash
# Generate Prisma client
pnpm prisma generate

# Run migrations
pnpm prisma migrate dev

# Seed database (optional)
pnpm prisma db seed
```

### Development

```bash
pnpm dev
```

Server runs on `http://localhost:3001`

API documentation available at `http://localhost:3001/api`

## Project Structure

```
src/
├── main.ts                 # Application entry point
├── app.module.ts          # Root module
├── app.controller.ts      # Root controller
├── app.service.ts         # Root service
├── data/                  # Data module (Yahoo Finance)
├── analytics/             # Analytics module
├── optimizer/             # Optimizer module
├── hedge/                 # Hedge module
├── portfolios/            # Portfolio CRUD module
└── auth/                  # Authentication module
```

## API Endpoints

### Health
- `GET /` - API info
- `GET /health` - Health check

### Portfolios (TODO)
- `POST /portfolios` - Create portfolio
- `GET /portfolios` - List portfolios
- `GET /portfolios/:id` - Get portfolio
- `PUT /portfolios/:id` - Update portfolio
- `DELETE /portfolios/:id` - Delete portfolio

### Analysis (TODO)
- `POST /analyze` - Analyze portfolio

### Tickers (TODO)
- `GET /tickers/search?q=...` - Search tickers

## Build

```bash
pnpm build
pnpm start
```

## Linting & Testing

```bash
pnpm lint
pnpm type-check
pnpm test
pnpm test:cov
```

## Technologies

- Nest.js 10+
- TypeScript
- PostgreSQL
- Prisma ORM
- Passport.js (Authentication)
- Swagger/OpenAPI
- Jest (Testing)
