# Glassbox Frontend Dockerfile
# Multi-stage build for Next.js application

# =============================================================================
# Stage 1: Dependencies
# =============================================================================
FROM node:22-alpine AS deps

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.2.0 --activate

# Copy workspace configuration files
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./

# Copy package.json files for all workspaces
COPY apps/web/package.json ./apps/web/
COPY packages/types/package.json ./packages/types/
COPY packages/design-tokens/package.json ./packages/design-tokens/

# Install dependencies
RUN pnpm install --frozen-lockfile

# =============================================================================
# Stage 2: Builder
# =============================================================================
FROM node:22-alpine AS builder

WORKDIR /app

# Enable command echoing for debugging
RUN set -x

# Install pnpm
RUN echo "📦 Installing pnpm..." && \
    corepack enable && corepack prepare pnpm@9.2.0 --activate && \
    echo "✓ pnpm installed"

# Copy dependencies from deps stage
RUN echo "📋 Copying dependencies from deps stage..."
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules
RUN echo "✓ Dependencies copied"

# Copy source code
RUN echo "📄 Copying source code..."
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./
COPY apps/web ./apps/web
COPY packages ./packages
RUN echo "✓ Source code copied" && ls -la /app/packages

# Set environment variables for build
ARG NEXT_PUBLIC_API_URL=http://localhost:4000
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_TELEMETRY_DISABLED=1
RUN echo "🌍 NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}"

# Build shared packages first (if they have build scripts)
WORKDIR /app/packages/types
RUN pnpm build 2>&1 || true

WORKDIR /app/packages/design-tokens
RUN pnpm build 2>&1 || true

# Build Next.js application
WORKDIR /app/apps/web
RUN pnpm build

# =============================================================================
# Stage 3: Production Runner
# =============================================================================
FROM node:22-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
# Note: Next.js standalone output copies only necessary files
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Set hostname to listen on all interfaces
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Start the application
CMD ["node", "apps/web/server.js"]
