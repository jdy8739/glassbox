# Glassbox Frontend

Next.js 14+ application for Glassbox portfolio optimization tool.

## Features

- Landing page with marketing content
- Portfolio builder (ticker search, quantity input)
- Analysis results with efficient frontier visualization
- Portfolio library for saved portfolios
- Glass UI design with Tailwind CSS

## Getting Started

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Landing page
│   ├── portfolio/new/     # Portfolio builder
│   ├── analysis/result/   # Analysis results
│   ├── portfolios/        # Portfolio library
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
└── components/            # Reusable React components (TODO)
```

## Technologies

- Next.js 14+
- React 18+
- TypeScript
- Tailwind CSS
- Glass UI design

## Build

```bash
pnpm build
pnpm start
```

## Linting

```bash
pnpm lint
pnpm type-check
```
