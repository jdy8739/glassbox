# Glassbox Backend - Implementation Guide

## Overview

Simple backend implementation focusing on essentials only.

**Architecture:** Browser → Next.js (OAuth) → Nest.js (API + JWT) → Python (Calculations)

**What We Build:**
1. Next.js - Google OAuth (NextAuth.js)
2. Nest.js - JWT validation + API
3. Yahoo Finance - Market data
4. Python Worker - Heavy calculations
5. User management
6. Portfolio CRUD

---

## 1. Authentication Flow

### Google OAuth Setup (Get Credentials)

**Step 1: Go to Google Cloud Console**
1. Visit https://console.cloud.google.com/
2. Create a new project (or select existing)
3. Name it "Glassbox" → Create

**Step 2: Enable Google+ API**
1. Go to "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click "Enable"

**Step 3: Configure OAuth Consent Screen**
1. Go to "APIs & Services" → "OAuth consent screen"
2. Select "External" → Create
3. Fill in:
   - App name: `Glassbox`
   - User support email: `your-email@gmail.com`
   - Developer contact: `your-email@gmail.com`
4. Click "Save and Continue"
5. Skip "Scopes" → Save and Continue
6. Skip "Test users" → Save and Continue

**Step 4: Create OAuth Credentials**
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Application type: `Web application`
4. Name: `Glassbox Web Client`
5. Authorized JavaScript origins:
   - `http://localhost:3000`
   - `https://your-domain.com` (production)
6. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://your-domain.com/api/auth/callback/google` (production)
7. Click "Create"
8. **Copy Client ID and Client Secret** → Save them!

**Step 5: Save Credentials**
```bash
# apps/frontend/.env.local
GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret-here
```

---

### Next.js (Frontend OAuth)

**Install:**
```bash
cd apps/frontend
pnpm add next-auth
```

**File:** `app/api/auth/[...nextauth]/route.ts`
```typescript
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.email = user.email;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

**Environment:**
```bash
# apps/frontend/.env.local
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
NEXT_PUBLIC_API_URL=http://localhost:4000
```

**User Registration Flow:**

When a user logs in with Google for the first time:
1. NextAuth.js receives user data from Google (email, name, image)
2. You need to call your Nest.js backend to create the user
3. Backend creates user in database if not exists

**Add to NextAuth callbacks:**
```typescript
// app/api/auth/[...nextauth]/route.ts
export const authOptions = {
  providers: [GoogleProvider(...)],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Call your backend to create/update user
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/sync`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user.email,
            name: user.name,
            image: user.image,
          }),
        });
        return true;
      } catch (error) {
        console.error('Failed to sync user:', error);
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.userId as string;
      return session;
    },
  },
};
```

**Add user sync endpoint in Nest.js:**
```typescript
// src/users/users.controller.ts
@Controller('users')
export class UsersController {
  @Post('sync')
  @Public() // No auth needed for initial user creation
  async syncUser(@Body() data: { email: string; name?: string; image?: string }) {
    const existingUser = await this.usersService.findByEmail(data.email);
    if (existingUser) {
      return existingUser;
    }
    return this.usersService.createUser(data);
  }
}
```

### Nest.js (Backend JWT Validation)

**Install:**
```bash
cd apps/backend
pnpm add @nestjs/passport @nestjs/jwt passport passport-jwt
pnpm add @prisma/client class-validator class-transformer yahoo-finance2
pnpm add -D @types/passport-jwt prisma
```

**File:** `src/auth/jwt.strategy.ts`
```typescript
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET, // Must match NEXTAUTH_SECRET
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}
```

**File:** `src/auth/jwt-auth.guard.ts`
```typescript
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

**File:** `src/main.ts`
```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for Next.js
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  await app.listen(4000);
  console.log('🚀 Server running on http://localhost:4000');
}
bootstrap();
```

**Environment:**
```bash
# apps/backend/.env
JWT_SECRET=your-secret-key  # Must match NEXTAUTH_SECRET
DATABASE_URL=postgresql://user:pass@localhost:5432/glassbox
FRONTEND_URL=http://localhost:3000
PORT=4000
```

---

### Using Auth in Next.js Components

**Server Component (recommended):**
```typescript
// app/dashboard/page.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/');
  }

  // Fetch user's portfolios
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/portfolios`, {
    headers: {
      'Authorization': `Bearer ${session.accessToken}`,
    },
  });

  const portfolios = await response.json();

  return (
    <div>
      <h1>Welcome, {session.user.name}</h1>
      {/* Render portfolios */}
    </div>
  );
}
```

**Client Component:**
```typescript
'use client';

import { useSession, signIn, signOut } from 'next-auth/react';

export function LoginButton() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (session) {
    return (
      <>
        <p>Signed in as {session.user.email}</p>
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }

  return <button onClick={() => signIn('google')}>Sign in with Google</button>;
}
```

**API Client Helper:**
```typescript
// lib/api-client.ts
import { getSession } from 'next-auth/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiClient(endpoint: string, options: RequestInit = {}) {
  const session = await getSession();

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(session && { 'Authorization': `Bearer ${session.accessToken}` }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}

// Usage:
// const portfolios = await apiClient('/portfolios');
// const analysis = await apiClient('/analysis/analyze', {
//   method: 'POST',
//   body: JSON.stringify({ tickers: ['AAPL'], quantities: [10] }),
// });
```

---

## 2. Project Structure

```
apps/backend/
├── src/
│   ├── main.ts              # Entry point (CORS, validation)
│   ├── app.module.ts        # Root module
│   │
│   ├── auth/                # JWT validation
│   │   ├── jwt.strategy.ts
│   │   └── jwt-auth.guard.ts
│   │
│   ├── prisma/              # Database service
│   │   └── prisma.service.ts
│   │
│   ├── users/               # User management
│   │   ├── users.service.ts
│   │   └── users.controller.ts
│   │
│   ├── portfolios/          # Portfolio CRUD
│   │   ├── portfolios.service.ts
│   │   ├── portfolios.controller.ts
│   │   └── dto/
│   │
│   ├── data/                # Yahoo Finance
│   │   ├── yahoo.service.ts
│   │   └── data.controller.ts
│   │
│   └── analysis/            # Python worker integration
│       ├── analysis.service.ts
│       ├── analysis.controller.ts
│       └── python-worker.service.ts
│
├── prisma/
│   └── schema.prisma        # Database schema
│
└── python/                  # Python calculation worker
    ├── worker.py            # Main worker
    └── requirements.txt     # PyPortfolioOpt, numpy, pandas
```

---

## 3. Database Schema

### Setup

```bash
cd apps/backend
npx prisma init
```

### Database Tables

#### User Table
Stores authenticated users from Google OAuth.

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `email` | String (unique) | User's email from Google |
| `name` | String? | User's name from Google |
| `image` | String? | Profile picture URL from Google |
| `createdAt` | DateTime | Account creation timestamp |
| `updatedAt` | DateTime | Last update timestamp |

**Relationships:**
- One user → Many portfolios

---

#### Portfolio Table
Stores user's portfolio holdings and analysis snapshots.

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `userId` | UUID | Foreign key → User.id |
| `name` | String | Portfolio name (e.g., "Tech Growth") |
| `tickers` | String[] | Asset symbols (e.g., ['AAPL', 'MSFT', 'NVDA']) |
| `quantities` | Float[] | Share quantities (e.g., [10, 20, 15]) |
| `analysisSnapshot` | JSON | Python calculation results (see below) |
| `createdAt` | DateTime | Portfolio creation timestamp |
| `updatedAt` | DateTime | Last analysis update timestamp |

**analysisSnapshot JSON Structure:**
```json
{
  "efficientFrontier": [
    { "return": 0.12, "volatility": 0.15, "sharpeRatio": 0.8 },
    ...
  ],
  "gmv": {
    "weights": { "AAPL": 0.2, "MSFT": 0.3, "NVDA": 0.25, "SGOV": 0.25 },
    "stats": { "return": 0.10, "volatility": 0.12, "sharpe": 0.75 }
  },
  "maxSharpe": {
    "weights": { "AAPL": 0.25, "MSFT": 0.35, "NVDA": 0.3, "SGOV": 0.1 },
    "stats": { "return": 0.15, "volatility": 0.18, "sharpe": 0.85 }
  },
  "myPortfolio": {
    "weights": { "AAPL": 0.2, "MSFT": 0.4, "NVDA": 0.3, "SGOV": 0.1 },
    "stats": { "return": 0.13, "volatility": 0.16, "sharpe": 0.78 }
  },
  "portfolioBeta": 1.25,
  "hedging": {
    "spyShares": 42,
    "spyNotional": 18500,
    "spyPrice": 440.50,
    "esContracts": 7,
    "esNotional": 17850,
    "targetBeta": 0
  },
  "metadata": {
    "startDate": "2021-01-01",
    "endDate": "2023-12-31",
    "riskFreeRate": 0.045
  }
}
```

**Relationships:**
- One portfolio → One user (cascade delete)

---

### Prisma Schema

**File:** `prisma/schema.prisma`
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// User table - stores authenticated users
model User {
  id         String      @id @default(uuid())
  email      String      @unique
  name       String?
  image      String?     // Google profile picture URL

  // Relations
  portfolios Portfolio[]

  // Timestamps
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt

  @@map("users")
}

// Portfolio table - stores user portfolios and analysis results
model Portfolio {
  id               String   @id @default(uuid())
  userId           String
  name             String

  // Portfolio holdings
  tickers          String[] // ['AAPL', 'MSFT', 'NVDA', 'SGOV']
  quantities       Float[]  // [10, 20, 15, 50]

  // Analysis snapshot from Python worker
  analysisSnapshot Json?    // Efficient frontier, GMV, Max Sharpe, beta, hedging

  // Relations
  user             User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Timestamps
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  @@map("portfolios")
  @@index([userId])  // Index for faster queries by user
}
```

---

### Database Migration

**Run migration:**
```bash
npx prisma migrate dev --name init
npx prisma generate
```

**Check database:**
```bash
npx prisma studio
```
This opens a GUI at http://localhost:5555 to view your data.

---

### Example Data

**User:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "john@example.com",
  "name": "John Doe",
  "image": "https://lh3.googleusercontent.com/a/...",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Portfolio:**
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440000",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "name": "My Tech Portfolio",
  "tickers": ["AAPL", "MSFT", "NVDA"],
  "quantities": [10, 20, 15],
  "analysisSnapshot": {
    "gmv": { "weights": {...}, "stats": {...} },
    "maxSharpe": { "weights": {...}, "stats": {...} },
    "portfolioBeta": 1.25,
    "hedging": {...}
  },
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-20T14:20:00.000Z"
}
```

---

## 4. Core Modules

### Users Module

**File:** `src/users/users.service.ts`
```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async createUser(data: { email: string; name?: string }) {
    return this.prisma.user.create({ data });
  }
}
```

### Portfolios Module

**File:** `src/portfolios/portfolios.service.ts`
```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PortfoliosService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.portfolio.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    return this.prisma.portfolio.findFirst({
      where: { id, userId },
    });
  }

  async create(userId: string, data: any) {
    return this.prisma.portfolio.create({
      data: {
        userId,
        name: data.name,
        tickers: data.tickers,
        quantities: data.quantities,
        analysisSnapshot: data.analysisSnapshot,
      },
    });
  }

  async update(id: string, userId: string, data: any) {
    return this.prisma.portfolio.update({
      where: { id },
      data: {
        name: data.name,
        tickers: data.tickers,
        quantities: data.quantities,
        analysisSnapshot: data.analysisSnapshot,
      },
    });
  }

  async remove(id: string, userId: string) {
    return this.prisma.portfolio.delete({ where: { id } });
  }
}
```

**File:** `src/portfolios/portfolios.controller.ts`
```typescript
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PortfoliosService } from './portfolios.service';

@Controller('portfolios')
@UseGuards(JwtAuthGuard)
export class PortfoliosController {
  constructor(private portfoliosService: PortfoliosService) {}

  @Get()
  async findAll(@Request() req) {
    return this.portfoliosService.findAll(req.user.userId);
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    return this.portfoliosService.findOne(id, req.user.userId);
  }

  @Post()
  async create(@Request() req, @Body() data: any) {
    return this.portfoliosService.create(req.user.userId, data);
  }

  @Put(':id')
  async update(@Request() req, @Param('id') id: string, @Body() data: any) {
    return this.portfoliosService.update(id, req.user.userId, data);
  }

  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    return this.portfoliosService.remove(id, req.user.userId);
  }
}
```

### Yahoo Finance Module

**File:** `src/data/yahoo.service.ts`
```typescript
import { Injectable, Logger } from '@nestjs/common';
import yahooFinance from 'yahoo-finance2';

@Injectable()
export class YahooFinanceService {
  private readonly logger = new Logger(YahooFinanceService.name);

  async searchTickers(query: string) {
    try {
      const results = await yahooFinance.search(query);
      return results.quotes?.slice(0, 10) || [];
    } catch (error) {
      this.logger.error(`Search failed: ${error.message}`);
      return [];
    }
  }

  async fetchPrices(tickers: string[], startDate: string, endDate: string) {
    const priceMap = new Map();

    for (const ticker of tickers) {
      try {
        const result = await yahooFinance.historical(ticker, {
          period1: startDate,
          period2: endDate,
          interval: '1d',
        });
        priceMap.set(ticker, result);
      } catch (error) {
        this.logger.error(`Failed to fetch ${ticker}: ${error.message}`);
      }
    }

    return priceMap;
  }
}
```

**File:** `src/data/data.controller.ts`
```typescript
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { YahooFinanceService } from './yahoo.service';

@Controller('data')
@UseGuards(JwtAuthGuard)
export class DataController {
  constructor(private yahooService: YahooFinanceService) {}

  @Get('tickers/search')
  async searchTickers(@Query('q') query: string) {
    return this.yahooService.searchTickers(query);
  }
}
```

---

## 5. Python Integration

### Python Worker Setup

**Install Python dependencies:**
```bash
cd apps/backend/python
pip install PyPortfolioOpt numpy pandas yfinance
```

**File:** `python/worker.py`
```python
import sys
import json
import numpy as np
import pandas as pd
from pypfopt import EfficientFrontier, risk_models, expected_returns
from pypfopt.discrete_allocation import DiscreteAllocation

def analyze_portfolio(tickers, quantities, start_date, end_date):
    """
    Run portfolio optimization and beta calculation
    Returns: efficient frontier, GMV, Max Sharpe, beta, hedging
    """
    # Fetch price data using yfinance
    import yfinance as yf

    all_tickers = tickers + ['SGOV', 'SPY']
    data = yf.download(all_tickers, start=start_date, end=end_date)['Adj Close']

    # Calculate returns
    returns = data.pct_change().dropna()

    # Calculate expected returns and covariance
    mu = expected_returns.mean_historical_return(data)
    S = risk_models.sample_cov(data)

    # Efficient Frontier
    ef = EfficientFrontier(mu, S)

    # Max Sharpe portfolio
    weights_max_sharpe = ef.max_sharpe()

    # GMV portfolio
    ef_gmv = EfficientFrontier(mu, S)
    weights_gmv = ef_gmv.min_volatility()

    # Calculate portfolio beta
    market_returns = returns['SPY']
    portfolio_returns = returns[tickers].dot(quantities) / sum(quantities)
    beta = np.cov(portfolio_returns, market_returns)[0, 1] / np.var(market_returns)

    # Hedge calculation
    portfolio_value = sum(quantities)  # Simplified
    spy_price = data['SPY'].iloc[-1]
    hedge_notional = beta * portfolio_value
    spy_shares = int(hedge_notional / spy_price)

    return {
        'gmv': {'weights': weights_gmv, 'stats': ef_gmv.portfolio_performance()},
        'maxSharpe': {'weights': weights_max_sharpe, 'stats': ef.portfolio_performance()},
        'portfolioBeta': beta,
        'hedging': {
            'spyShares': spy_shares,
            'spyNotional': spy_shares * spy_price,
            'spyPrice': spy_price,
        }
    }

if __name__ == '__main__':
    input_data = json.loads(sys.argv[1])
    result = analyze_portfolio(
        input_data['tickers'],
        input_data['quantities'],
        input_data['startDate'],
        input_data['endDate']
    )
    print(json.dumps(result))
```

### Nest.js Python Integration

**File:** `src/analysis/python-worker.service.ts`
```typescript
import { Injectable, Logger } from '@nestjs/common';
import { spawn } from 'child_process';

@Injectable()
export class PythonWorkerService {
  private readonly logger = new Logger(PythonWorkerService.name);

  async runAnalysis(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const python = spawn('python3', [
        'python/worker.py',
        JSON.stringify(data),
      ]);

      let result = '';
      let error = '';

      python.stdout.on('data', (data) => {
        result += data.toString();
      });

      python.stderr.on('data', (data) => {
        error += data.toString();
      });

      python.on('close', (code) => {
        if (code !== 0) {
          this.logger.error(`Python worker failed: ${error}`);
          reject(new Error(error));
        } else {
          resolve(JSON.parse(result));
        }
      });
    });
  }
}
```

**File:** `src/analysis/analysis.service.ts`
```typescript
import { Injectable, Logger } from '@nestjs/common';
import { YahooFinanceService } from '../data/yahoo.service';
import { PythonWorkerService } from './python-worker.service';

@Injectable()
export class AnalysisService {
  private readonly logger = new Logger(AnalysisService.name);

  constructor(
    private yahooService: YahooFinanceService,
    private pythonWorker: PythonWorkerService,
  ) {}

  async analyzePortfolio(dto: any) {
    const { tickers, quantities, startDate, endDate } = dto;

    this.logger.log(`Analyzing: ${tickers.join(', ')}`);

    // Run Python worker
    const result = await this.pythonWorker.runAnalysis({
      tickers,
      quantities,
      startDate: startDate || this.getDefaultStartDate(),
      endDate: endDate || this.getDefaultEndDate(),
    });

    return result;
  }

  private getDefaultStartDate(): string {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 2);
    return date.toISOString().split('T')[0];
  }

  private getDefaultEndDate(): string {
    return new Date().toISOString().split('T')[0];
  }
}
```

**File:** `src/analysis/analysis.controller.ts`
```typescript
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AnalysisService } from './analysis.service';

@Controller('analysis')
@UseGuards(JwtAuthGuard)
export class AnalysisController {
  constructor(private analysisService: AnalysisService) {}

  @Post('analyze')
  async analyze(@Body() dto: any) {
    return this.analysisService.analyzePortfolio(dto);
  }
}
```

---

## 6. API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/data/tickers/search?q=AAPL` | Search tickers | ✅ |
| POST | `/analysis/analyze` | Run portfolio analysis | ✅ |
| GET | `/portfolios` | List all portfolios | ✅ |
| GET | `/portfolios/:id` | Get portfolio | ✅ |
| POST | `/portfolios` | Create portfolio | ✅ |
| PUT | `/portfolios/:id` | Update portfolio | ✅ |
| DELETE | `/portfolios/:id` | Delete portfolio | ✅ |

---

## Implementation Steps

### Week 1: Setup
1. Initialize Nest.js project
2. Setup Prisma + PostgreSQL
3. Configure JWT authentication
4. Setup CORS

### Week 2: Core Modules
5. Users module
6. Portfolios CRUD
7. Yahoo Finance integration

### Week 3: Python Integration
8. Python worker setup
9. Analysis service integration
10. Test end-to-end flow

### Week 4: Frontend Integration
11. NextAuth.js setup
12. API client in Next.js
13. Test authentication flow
14. Deploy

---

## Quick Start

```bash
# Backend setup
cd apps/backend
pnpm install
npx prisma migrate dev
pnpm run start:dev

# Python setup
cd python
pip install -r requirements.txt

# Frontend setup
cd apps/frontend
pnpm install
pnpm run dev
```

**That's it!** Simple, focused implementation. 🚀
