# Glassbox Backend Dockerfile
# Multi-stage build for Nest.js application with Python worker support

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
COPY apps/backend/package.json ./apps/backend/
COPY packages/types/package.json ./packages/types/

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
COPY --from=deps /app/apps/backend/node_modules ./apps/backend/node_modules
RUN echo "✓ Dependencies copied"

# Copy source code
RUN echo "📄 Copying source code..."
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./
COPY apps/backend ./apps/backend
COPY packages ./packages
RUN echo "✓ Source code copied" && ls -la /app/packages

# Build shared packages first (if they have build scripts)
WORKDIR /app/packages/types
RUN pnpm build 2>&1 || true

# Generate Prisma client
WORKDIR /app/apps/backend
RUN npx prisma generate

# Build Nest.js application
RUN echo "Building Nest.js application..." && \
    pnpm build 2>&1

# =============================================================================
# Stage 3: Production Runner
# =============================================================================
FROM node:22-alpine AS runner

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
    gcc \
    g++ \
    python3-dev \
    gfortran \
    openblas-dev \
    libffi-dev \
    cmake \
    git \
    wget

# Create non-root user for security
RUN addgroup --system --gid 1001 nestjs
RUN adduser --system --uid 1001 nestjs

# Create directories
RUN mkdir -p /app/python /app/dist /app/prisma /app/node_modules

# Copy Python requirements and install Python packages
COPY apps/backend/python/requirements.txt /tmp/requirements.txt
RUN pip3 install --no-cache-dir --break-system-packages --prefer-binary -r /tmp/requirements.txt && \
    rm /tmp/requirements.txt

# Copy built application from builder (maintain workspace structure)
COPY --from=builder --chown=nestjs:nestjs /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder --chown=nestjs:nestjs /app/apps/backend/python ./apps/backend/python
COPY --from=builder --chown=nestjs:nestjs /app/apps/backend/prisma ./apps/backend/prisma

# Copy node_modules (including Prisma client)
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/backend/node_modules ./apps/backend/node_modules

# Set ownership
RUN chown -R nestjs:nestjs /app

# Switch to non-root user
USER nestjs

# Expose port
EXPOSE 4000

# Set environment variables
ENV PORT=4000
ENV HOSTNAME="0.0.0.0"
ENV NODE_PATH=/app/node_modules:/app/apps/backend/node_modules

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4000/health || exit 1

# Start the application from correct directory
CMD ["node", "apps/backend/dist/main.js"]
