# Glassbox Database Schema

## Overview

This project uses **PostgreSQL** with **Prisma ORM** for database management.

**Schema Type:** Option 1 - Simplified Schema (MVP)

---

## Models

### User

Stores user authentication data from Google OAuth.

```prisma
model User {
  id         String      @id @default(uuid())
  email      String      @unique
  name       String?
  picture    String?     // Google profile picture URL
  googleId   String?     @unique
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt
  portfolios Portfolio[]
}
```

### Portfolio

Stores user portfolios with asset holdings and analysis snapshots.

```prisma
model Portfolio {
  id               String   @id @default(uuid())
  userId           String
  name             String
  tickers          String[] // ['AAPL', 'MSFT', 'NVDA']
  quantities       Float[]  // [10, 20, 15]
  analysisSnapshot Json?    // Full analysis results
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  user User @relation(...)
}
```

**Important Notes:**
- `tickers` and `quantities` arrays must have matching lengths
- `analysisSnapshot` is nullable until first analysis is run
- `updatedAt` timestamp refreshes when snapshot is saved/updated

---

## Analysis Snapshot Structure

The `analysisSnapshot` field stores portfolio optimization results as JSON:

```typescript
{
  efficientFrontier: [
    {
      return: 0.12,        // Annual return (12%)
      volatility: 0.15,    // Annual volatility (15%)
      sharpeRatio: 0.8     // Risk-adjusted return
    },
    // ... more frontier points
  ],
  gmv: {
    weights: {
      AAPL: 0.3,
      MSFT: 0.4,
      NVDA: 0.3
    },
    stats: {
      return: 0.10,
      volatility: 0.12,
      sharpe: 0.83
    }
  },
  maxSharpe: {
    weights: {
      AAPL: 0.25,
      MSFT: 0.35,
      NVDA: 0.40
    },
    stats: {
      return: 0.15,
      volatility: 0.18,
      sharpe: 0.95
    }
  },
  portfolioBeta: 1.25,
  hedging: {
    spyShares: 42,
    spyNotional: 18500,
    esContracts: 7,
    esNotional: 17850
  }
}
```

---

## Setup Instructions

### 1. Install PostgreSQL

**macOS (Homebrew):**
```bash
brew install postgresql@16
brew services start postgresql@16
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
Download from [postgresql.org](https://www.postgresql.org/download/windows/)

### 2. Create Database

```bash
# Connect to PostgreSQL
psql postgres

# Create database and user
CREATE DATABASE glassbox;
CREATE USER glassbox_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE glassbox TO glassbox_user;

# Exit psql
\q
```

### 3. Configure Environment Variables

```bash
cd apps/backend
cp .env.example .env.local
```

Edit `.env.local`:
```bash
DATABASE_URL=postgresql://glassbox_user:your_password@localhost:5432/glassbox
```

### 4. Run Prisma Migrations

```bash
# Generate Prisma Client
pnpm prisma generate

# Create and apply migration
pnpm prisma migrate dev --name init

# (Optional) Seed database with sample data
pnpm prisma db seed
```

### 5. View Database (Optional)

```bash
# Open Prisma Studio (GUI for database)
pnpm prisma studio
```

---

## Common Commands

```bash
# Generate Prisma Client (after schema changes)
pnpm prisma generate

# Create a new migration
pnpm prisma migrate dev --name your_migration_name

# Apply migrations in production
pnpm prisma migrate deploy

# Reset database (WARNING: deletes all data)
pnpm prisma migrate reset

# View database with GUI
pnpm prisma studio

# Format schema file
pnpm prisma format
```

---

## Example Queries

### Create Portfolio

```typescript
const portfolio = await prisma.portfolio.create({
  data: {
    userId: user.id,
    name: 'Tech Growth Portfolio',
    tickers: ['AAPL', 'MSFT', 'NVDA'],
    quantities: [10, 20, 15],
    analysisSnapshot: null, // No analysis yet
  },
});
```

### Update Portfolio with Analysis

```typescript
const updated = await prisma.portfolio.update({
  where: { id: portfolioId },
  data: {
    analysisSnapshot: {
      efficientFrontier: [...],
      gmv: {...},
      maxSharpe: {...},
      portfolioBeta: 1.25,
      hedging: {...},
    },
  },
});
```

### Get User Portfolios

```typescript
const portfolios = await prisma.portfolio.findMany({
  where: { userId: user.id },
  orderBy: { updatedAt: 'desc' },
});
```

### Delete Portfolio

```typescript
await prisma.portfolio.delete({
  where: { id: portfolioId },
});
```

---

## Migration Path

### Current: Option 1 (Simplified)
- Arrays for tickers/quantities
- JSON for analysis snapshot

### Future: Option 3 (Hybrid)
If you need better asset querying:
1. Create `PortfolioAsset` table
2. Migrate data from arrays to relational table
3. Keep `analysisSnapshot` as JSON

### Future: Option 2 (Normalized)
If you need version history:
1. Create `AnalysisSnapshot` table with `portfolioId`
2. Allow multiple snapshots per portfolio
3. Add `isLatest` flag or use `createdAt` sorting

---

## Data Validation

**Backend validation required:**
- ✅ `tickers.length === quantities.length`
- ✅ All quantities must be positive numbers
- ✅ Tickers must be valid stock symbols
- ✅ User can only access their own portfolios

**Implement in NestJS DTOs:**
```typescript
import { IsArray, ArrayMinSize, ArrayNotEmpty, Min } from 'class-validator';

export class CreatePortfolioDto {
  @IsString()
  name: string;

  @IsArray()
  @ArrayNotEmpty()
  tickers: string[];

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  quantities: number[];

  @Validate(TickersQuantitiesMatch) // Custom validator
  tickersQuantitiesMatch?: boolean;
}
```

---

## Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
