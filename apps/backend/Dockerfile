# Glassbox Backend Dockerfile
# Multi-stage build for Nest.js application with Python worker support

# =============================================================================
# Stage 1: Dependencies
# =============================================================================
FROM node:20-alpine AS deps

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.2.0 --activate

# Copy workspace configuration files
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./

# Copy package.json files for all workspaces
COPY apps/backend/package.json ./apps/backend/
COPY packages/types/package.json ./packages/types/
COPY packages/utils/package.json ./packages/utils/
COPY packages/config/package.json ./packages/config/

# Install dependencies
RUN pnpm install --frozen-lockfile

# =============================================================================
# Stage 2: Builder
# =============================================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.2.0 --activate

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/backend/node_modules ./apps/backend/node_modules
COPY --from=deps /app/packages ./packages

# Copy source code
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./
COPY apps/backend ./apps/backend
COPY packages ./packages

# Generate Prisma client
RUN cd apps/backend && npx prisma generate

# Build all packages using pnpm filter (builds dependencies in correct order)
RUN pnpm --filter @glassbox/backend build

# =============================================================================
# Stage 3: Production Runner
# =============================================================================
FROM node:20-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Install system dependencies for Python
RUN apk add --no-cache \
    python3 \
    py3-pip \
    py3-numpy \
    py3-pandas \
    py3-scipy \
    build-base \
    python3-dev \
    gfortran \
    openblas-dev \
    libffi-dev

# Create non-root user for security
RUN addgroup --system --gid 1001 nestjs
RUN adduser --system --uid 1001 nestjs

# Create directories
RUN mkdir -p /app/python /app/dist /app/prisma /app/node_modules

# Copy Python requirements and install Python packages
COPY apps/backend/python/requirements.txt /tmp/requirements.txt
RUN pip3 install --no-cache-dir --break-system-packages -r /tmp/requirements.txt && \
    rm /tmp/requirements.txt

# Copy built application from builder
COPY --from=builder --chown=nestjs:nestjs /app/apps/backend/dist ./dist
COPY --from=builder --chown=nestjs:nestjs /app/apps/backend/python ./python
COPY --from=builder --chown=nestjs:nestjs /app/apps/backend/prisma ./prisma

# Copy node_modules (including Prisma client)
COPY --from=builder /app/apps/backend/node_modules ./node_modules
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Set ownership
RUN chown -R nestjs:nestjs /app

# Switch to non-root user
USER nestjs

# Expose port
EXPOSE 4000

# Set environment variables
ENV PORT=4000
ENV HOSTNAME="0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4000/health || exit 1

# Start the application
CMD ["node", "dist/main.js"]
