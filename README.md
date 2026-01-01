# Glassbox - Portfolio Optimization Tool

A monorepo containing a portfolio optimization and beta hedging tool with Glass UI design. This project includes a Next.js frontend, Nest.js backend, and CLI tool for MVP testing.

## 🏗️ Project Structure

```
glassbox/
├── apps/
│   ├── frontend/          # Next.js 14+ web application
│   ├── backend/           # Nest.js 10+ REST API
│   └── cli/               # CLI tool for MVP testing
├── packages/
│   ├── types/             # Shared TypeScript types
│   ├── utils/             # Shared utility functions
│   └── config/            # Shared ESLint/TS configs
├── package.json           # Root workspace config
├── pnpm-workspace.yaml    # pnpm workspaces definition
├── turbo.json             # Turborepo build orchestration
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+**
- **pnpm 9+** (recommended for monorepo management)
- **PostgreSQL 12+** (for backend database)

### Installation

```bash
# Install all dependencies
pnpm install

# Build all packages
pnpm build

# Start development servers
pnpm dev
```

This will start:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:4000
- **CLI**: Available via `pnpm dev` in `apps/cli`

## 📦 Packages

### Frontend (`apps/frontend`)

Next.js 14+ web application with Glass UI design.

```bash
cd apps/frontend
pnpm dev      # Start development server
pnpm build    # Build for production
```

**Features:**
- Landing page with marketing content
- Portfolio builder (ticker search, quantity input)
- Analysis results with efficient frontier visualization
- Portfolio library for saved portfolios

**Technology Stack:**
- Next.js 14+
- React 18+
- TypeScript
- Tailwind CSS
- Glass UI design

See [apps/frontend/README.md](./apps/frontend/README.md) for details.

### Backend (`apps/backend`)

Nest.js 10+ REST API for portfolio optimization.

```bash
cd apps/backend
pnpm dev      # Start development server
pnpm build    # Build for production
```

**Features:**
- Portfolio CRUD operations
- Efficient frontier calculation
- Beta calculation and hedging recommendations
- Market data fetching from Yahoo Finance
- Google OAuth authentication
- API documentation (Swagger)

**Technology Stack:**
- Nest.js 10+
- TypeScript
- PostgreSQL
- Prisma ORM
- Passport.js (Auth)
- Swagger/OpenAPI

See [apps/backend/README.md](./apps/backend/README.md) for details.

### CLI (`apps/cli`)

Command-line tool for portfolio analysis (MVP).

```bash
cd apps/cli
pnpm dev analyze -t AAPL MSFT NVDA    # Run analysis
pnpm build                             # Build CLI
```

**Features:**
- Ticker input and validation
- Portfolio analysis via CLI
- Efficient frontier calculation
- Beta hedging recommendations
- JSON output support

**Technology Stack:**
- Node.js CLI
- TypeScript
- Commander.js
- Chalk (colored output)

See [apps/cli/README.md](./apps/cli/README.md) for details.

## 🎨 Shared Packages

### `packages/types`

Shared TypeScript interfaces and types used across all applications.

**Includes:**
- `PortfolioInput` - Portfolio builder input
- `AnalysisResult` - Analysis results structure
- `PortfolioStats` - Portfolio statistics
- `EfficientPortfolio` - Efficient frontier portfolio
- API response types

### `packages/utils`

Shared utility functions for calculations and formatting.

**Includes:**
- Portfolio validation
- Currency/percentage formatting
- Sharpe ratio calculation
- Portfolio weight normalization
- Ticker validation

### `packages/config`

Shared development configurations.

**Includes:**
- ESLint rules
- TypeScript base configs
- Prettier formatting rules

## 📋 Available Scripts

### Root Level

```bash
# Development
pnpm dev                # Start all development servers (turbo)
pnpm run fe             # Start only frontend
pnpm run be             # Start only backend (runs on port 4000)

# Building
pnpm build              # Build all packages (turbo)
pnpm build:frontend     # Build only frontend
pnpm build:backend      # Build only backend

# Quality
pnpm lint               # Lint all packages
pnpm type-check         # Type check all packages
pnpm format             # Format code with Prettier

# Maintenance
pnpm clean              # Clean all build outputs
```

### Individual Apps

Each app has its own scripts. See individual README files for details.

## 🔧 Configuration Files

- **`package.json`** - Root workspace configuration
- **`pnpm-workspace.yaml`** - Defines workspace packages
- **`turbo.json`** - Build pipeline and caching configuration
- **`tsconfig.json`** - Base TypeScript configuration
- **`.prettierrc`** - Prettier code formatting rules
- **`.gitignore`** - Git ignore patterns

## 🗄️ Database Setup (Backend)

```bash
cd apps/backend

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your database URL

# Generate Prisma client
pnpm prisma generate

# Run migrations
pnpm prisma migrate dev

# View database (optional)
pnpm prisma studio
```

## 🌐 API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:4000/api
- **Health Check**: http://localhost:4000/health

## 📖 Documentation

Project documentation is organized in `.claude/`:

- **`.claude/rules/prd.md`** - Product requirements document
- **`.claude/rules/architecture.md`** - Technical architecture
- **`.claude/rules/design.md`** - Glass UI design specifications
- **`.claude/rules/pages.md`** - Web application page structure

## 🧪 Testing

```bash
# Run tests
pnpm test

# Run tests with coverage
pnpm test:cov

# Watch mode
pnpm test:watch
```

## 🚀 Deployment

### Frontend (Next.js)

```bash
cd apps/frontend
pnpm build
pnpm start
```

Deploy to Vercel, Netlify, or your preferred hosting.

### Backend (Nest.js)

```bash
cd apps/backend
pnpm build
pnpm start
```

Deploy to AWS, Heroku, Railway, or your preferred Node.js hosting.

### Docker Support (TODO)

Docker configurations for containerized deployment.

## 📚 Technology Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| **Package Manager** | pnpm | 9+ |
| **Build Tool** | Turborepo | 2.3+ |
| **Frontend Framework** | Next.js | 14+ |
| **Backend Framework** | Nest.js | 10+ |
| **Language** | TypeScript | 5.6+ |
| **Database** | PostgreSQL | 12+ |
| **ORM** | Prisma | 5+ |
| **UI Framework** | React | 18+ |
| **Styling** | Tailwind CSS | 3.4+ |
| **Testing** | Jest | 29+ |

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run `pnpm lint` and `pnpm type-check`
4. Create a pull request

## 📝 License

MIT

## 📞 Support

For issues or questions, refer to the project documentation in `.claude/` or the individual app README files.
