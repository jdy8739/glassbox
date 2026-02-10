# Glassbox Deployment Plan for AWS Lightsail

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Project Analysis](#project-analysis)
3. [Resource Requirements](#resource-requirements)
4. [Architecture](#architecture)
5. [Implementation Guide](#implementation-guide)
6. [GitHub Actions CI/CD](#github-actions-cicd)
7. [Cost Analysis](#cost-analysis)
8. [Monitoring and Maintenance](#monitoring-and-maintenance)

---

## Executive Summary

Glassbox is a monorepo-based portfolio optimization application with the following components:
- **Frontend**: Next.js 15 application (React 19)
- **Backend**: Nest.js 11 API server with JWT authentication
- **Python Worker**: PyPortfolioOpt-based calculations (embedded in backend)
- **Database**: PostgreSQL with Prisma ORM

**Architecture**: Single server deployment with a $20/month Lightsail instance. All services (Nginx, Next.js, Nest.js, Python, PostgreSQL) run in Docker containers on one server. This provides the best balance of simplicity, cost-effectiveness, and adequate performance for a portfolio optimization tool.

---

## Project Analysis

### Technology Stack Summary

| Component | Technology | Version | Notes |
|-----------|------------|---------|-------|
| **Frontend** | Next.js | 15.1.3 | App Router, React 19, SSR support |
| **Backend** | Nest.js | 11.x | TypeScript, JWT auth, Swagger |
| **Database** | PostgreSQL | 14+ | Prisma ORM |
| **Python** | Python | 3.8+ | PyPortfolioOpt, yfinance, numpy |
| **Package Manager** | pnpm | 9.2.0 | Workspace-based monorepo |
| **Build Tool** | Turborepo | 2.3.3 | Build orchestration |

### Project Structure

```
glassbox/
├── apps/
│   ├── web/              # Next.js frontend (port 3000)
│   │   ├── src/app/      # App Router pages
│   │   └── package.json  # Frontend dependencies
│   │
│   └── backend/          # Nest.js backend (port 4000)
│       ├── src/          # API modules
│       ├── prisma/       # Database schema
│       └── python/       # Portfolio optimization scripts
│
├── packages/             # Shared packages
│   ├── types/           # TypeScript types
│   ├── utils/           # Shared utilities
│   ├── config/          # Shared configuration
│   └── design-tokens/   # Design system tokens
│
├── package.json          # Root workspace config
└── turbo.json           # Turborepo config
```

### Key Dependencies

**Frontend (apps/web)**:
- next-auth 5.0.0-beta.30 (Google OAuth)
- @tanstack/react-query (data fetching)
- recharts (charts)
- tailwindcss (styling)

**Backend (apps/backend)**:
- @nestjs/passport, passport-jwt (authentication)
- @prisma/client (database)
- yahoo-finance2 (market data)
- python-shell (Python integration)
- helmet (security)

**Python Worker**:
- PyPortfolioOpt 1.5.5
- yfinance 0.2.50
- numpy, pandas, scipy
- scikit-learn

### Environment Variables Required

**Backend (.env)**:
```bash
# Server
PORT=4000
NODE_ENV=production

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/glassbox

# Authentication
JWT_SECRET=<secure-random-32-char-string>
NEXTAUTH_SECRET=<same-as-jwt-secret>
JWT_EXPIRATION=604800

# Frontend CORS
FRONTEND_URL=https://your-domain.com
```

**Frontend (.env.local)**:
```bash
# Backend API
NEXT_PUBLIC_API_URL=https://api.your-domain.com

# NextAuth
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=<same-as-backend-jwt-secret>

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

---

## Resource Requirements

### Frontend (Next.js)

| Resource | Minimum | Recommended | Notes |
|----------|---------|-------------|-------|
| CPU | 0.5 vCPU | 1 vCPU | SSR requires CPU for rendering |
| Memory | 512 MB | 1 GB | Build requires ~800MB |
| Storage | 1 GB | 2 GB | For .next cache and dependencies |
| Port | 3000 | 3000 | HTTP server |

**Build Time Requirements**:
- Peak memory during build: ~1.2 GB
- Build time: 1-3 minutes
- Output size: ~50-100 MB

### Backend (Nest.js)

| Resource | Minimum | Recommended | Notes |
|----------|---------|-------------|-------|
| CPU | 0.5 vCPU | 1 vCPU | API processing |
| Memory | 512 MB | 1 GB | Depends on concurrent requests |
| Storage | 500 MB | 1 GB | For node_modules |
| Port | 4000 | 4000 | HTTP server |

### Python Worker

| Resource | Minimum | Recommended | Notes |
|----------|---------|-------------|-------|
| CPU | 1 vCPU | 2 vCPU | NumPy/SciPy calculations are CPU-intensive |
| Memory | 1 GB | 2 GB | Large DataFrames, optimization algorithms |
| Storage | 500 MB | 1 GB | Python packages (~400 MB) |

**Note**: Python runs embedded within the backend process via python-shell. Each portfolio analysis spawns a Python subprocess.

### PostgreSQL Database

| Resource | Minimum | Recommended | Notes |
|----------|---------|-------------|-------|
| CPU | 0.25 vCPU | 0.5 vCPU | Lightweight queries |
| Memory | 256 MB | 512 MB | Connection pooling |
| Storage | 1 GB | 5 GB | Depends on user/portfolio count |

---

## Architecture

### Single Server Deployment

All services run on one AWS Lightsail instance with Docker Compose.

```
+--------------------------------------------------+
|                 AWS Lightsail                     |
|              Instance: $20/month                  |
|           (2 vCPU, 4 GB RAM, 80 GB SSD)          |
|                                                   |
|  +--------------------------------------------+  |
|  |           Docker Compose Stack             |  |
|  |                                            |  |
|  |  +-----------+  +-----------+  +--------+  |  |
|  |  |  Nginx    |  | Next.js   |  |Postgres|  |  |
|  |  |  Reverse  |->| Frontend  |  |Database|  |  |
|  |  |  Proxy    |  | :3000     |  | :5432  |  |  |
|  |  | :80/:443  |  +-----------+  +--------+  |  |
|  |  +-----------+         |            ^      |  |
|  |       |               API          |      |  |
|  |       v                v           |      |  |
|  |  +-----------+  +-----------+      |      |  |
|  |  | Backend   |<-| Python    |------+      |  |
|  |  | Nest.js   |  | Worker    |             |  |
|  |  | :4000     |  | (embedded)|             |  |
|  |  +-----------+  +-----------+             |  |
|  +--------------------------------------------+  |
+--------------------------------------------------+
```

### Why Single Server?

| Benefit | Description |
|---------|-------------|
| **Simple** | Single Docker Compose file, one server to manage |
| **Cost-effective** | $20/month for everything |
| **Fast** | No network latency between services |
| **Easy debugging** | All logs in one place |
| **Dev parity** | Same setup works locally |

### Instance Specification

- **Size**: $20/month (2 vCPU, 4 GB RAM, 80 GB SSD)
- **Capacity**: 100-500 daily active users
- **Concurrent analyses**: 10-20 portfolio calculations
- **Upgrade path**: $40/month (4 vCPU, 8 GB RAM) when needed

---

## Implementation Guide

### Prerequisites

1. AWS Lightsail account
2. Domain name configured
3. Google OAuth credentials
4. SSH key pair

### Step 1: Create Lightsail Instance

```bash
# Via AWS Console or CLI
aws lightsail create-instances \
  --instance-names glassbox-prod \
  --availability-zone us-east-1a \
  --blueprint-id ubuntu_22_04 \
  --bundle-id medium_3_0  # 2 vCPU, 4 GB RAM, $20/month
```

### Step 2: Configure Instance

SSH into the instance and run:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

### Step 3: Create Docker Configuration Files

Create the following files in your project root:

**Dockerfile.frontend** (apps/web/Dockerfile):
```dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.2.0 --activate

# Copy workspace files
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./
COPY apps/web/package.json ./apps/web/
COPY packages/ ./packages/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY apps/web/ ./apps/web/

# Build shared packages first
RUN pnpm --filter @glassbox/types build
RUN pnpm --filter @glassbox/utils build
RUN pnpm --filter @glassbox/design-tokens build

# Build Next.js app
RUN pnpm --filter @glassbox/web build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy built application
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public

EXPOSE 3000

CMD ["node", "apps/web/server.js"]
```

**Dockerfile.backend** (apps/backend/Dockerfile):
```dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.2.0 --activate

# Copy workspace files
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/ ./packages/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY apps/backend/ ./apps/backend/

# Build shared packages
RUN pnpm --filter @glassbox/types build
RUN pnpm --filter @glassbox/utils build

# Build backend
RUN pnpm --filter @glassbox/backend build

# Generate Prisma client
RUN cd apps/backend && npx prisma generate

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Install Python and dependencies
RUN apk add --no-cache python3 py3-pip py3-numpy py3-pandas py3-scipy

# Copy Python requirements and install
COPY apps/backend/python/requirements.txt /tmp/requirements.txt
RUN pip3 install --no-cache-dir --break-system-packages -r /tmp/requirements.txt

# Copy built application
COPY --from=builder /app/apps/backend/dist ./dist
COPY --from=builder /app/apps/backend/python ./python
COPY --from=builder /app/apps/backend/node_modules ./node_modules
COPY --from=builder /app/apps/backend/prisma ./prisma

EXPOSE 4000

CMD ["node", "dist/main.js"]
```

**docker-compose.yml** (project root):
```yaml
version: '3.8'

services:
  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./certs:/etc/nginx/certs:ro
      - ./certbot/www:/var/www/certbot:ro
    depends_on:
      - frontend
      - backend
    restart: unless-stopped

  # Next.js Frontend
  frontend:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
    environment:
      - NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
      - GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
    depends_on:
      - backend
    restart: unless-stopped

  # Nest.js Backend
  backend:
    build:
      context: .
      dockerfile: apps/backend/Dockerfile
    environment:
      - NODE_ENV=production
      - PORT=4000
      - DATABASE_URL=postgresql://glassbox:${DB_PASSWORD}@postgres:5432/glassbox
      - JWT_SECRET=${JWT_SECRET}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - FRONTEND_URL=${FRONTEND_URL}
    depends_on:
      postgres:
        condition: service_healthy
    restart: unless-stopped

  # PostgreSQL Database
  postgres:
    image: postgres:16-alpine
    environment:
      - POSTGRES_USER=glassbox
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=glassbox
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U glassbox"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

volumes:
  postgres_data:
```

**nginx.conf**:
```nginx
events {
    worker_connections 1024;
}

http {
    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;

    # Frontend server block
    server {
        listen 80;
        server_name your-domain.com www.your-domain.com;

        # Redirect to HTTPS
        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }

        location / {
            return 301 https://$host$request_uri;
        }
    }

    server {
        listen 443 ssl http2;
        server_name your-domain.com www.your-domain.com;

        ssl_certificate /etc/nginx/certs/fullchain.pem;
        ssl_certificate_key /etc/nginx/certs/privkey.pem;
        ssl_protocols TLSv1.2 TLSv1.3;

        # Frontend
        location / {
            proxy_pass http://frontend:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }

    # API server block
    server {
        listen 80;
        server_name api.your-domain.com;

        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }

        location / {
            return 301 https://$host$request_uri;
        }
    }

    server {
        listen 443 ssl http2;
        server_name api.your-domain.com;

        ssl_certificate /etc/nginx/certs/fullchain.pem;
        ssl_certificate_key /etc/nginx/certs/privkey.pem;
        ssl_protocols TLSv1.2 TLSv1.3;

        # Rate limiting for API
        limit_req zone=api burst=20 nodelay;

        location / {
            proxy_pass http://backend:4000;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            # Timeout for long-running portfolio calculations
            proxy_read_timeout 120s;
            proxy_connect_timeout 60s;
        }
    }
}
```

**.env.production** (create on server):
```bash
# Database
DB_PASSWORD=your-secure-database-password

# JWT (must match between frontend and backend)
JWT_SECRET=your-64-character-random-secret-key-here
NEXTAUTH_SECRET=your-64-character-random-secret-key-here

# URLs
FRONTEND_URL=https://your-domain.com
NEXTAUTH_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://api.your-domain.com

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

### Step 4: Update Next.js Config for Standalone Output

Update `apps/web/next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@glassbox/types', '@glassbox/utils', '@glassbox/design-tokens'],
  output: 'standalone',  // Required for Docker deployment
};

module.exports = nextConfig;
```

### Step 5: Deploy

```bash
# Clone repository to server
git clone https://github.com/your-repo/glassbox.git
cd glassbox

# Copy environment file
cp .env.production .env

# Build and start containers
docker-compose up -d --build

# Run database migrations
docker-compose exec backend npx prisma migrate deploy

# View logs
docker-compose logs -f
```

### Step 6: SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot

# Stop nginx temporarily
docker-compose stop nginx

# Get certificates
sudo certbot certonly --standalone \
  -d your-domain.com \
  -d www.your-domain.com \
  -d api.your-domain.com

# Copy certificates
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ./certs/
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem ./certs/
sudo chown $USER:$USER ./certs/*

# Restart nginx
docker-compose up -d nginx

# Setup auto-renewal (add to crontab)
echo "0 0 * * * certbot renew --quiet && docker-compose restart nginx" | sudo tee -a /etc/crontab
```

---

## GitHub Actions CI/CD

This section covers the automated CI/CD pipeline that builds Docker images, pushes them to GitHub Container Registry (ghcr.io), and deploys to AWS Lightsail.

### Pipeline Overview

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Push to   │───>│  Run Tests  │───>│ Build Docker│───>│  Deploy to  │
│   main      │    │  & Lint     │    │   Images    │    │  Lightsail  │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                          │                  │                  │
                          v                  v                  v
                    ┌───────────┐      ┌───────────┐      ┌───────────┐
                    │ Type Check│      │  Push to  │      │   Health  │
                    │  Linting  │      │  ghcr.io  │      │   Check   │
                    └───────────┘      └───────────┘      └───────────┘
```

### Workflow Files

The CI/CD pipeline is defined in `.github/workflows/deploy.yml` and includes:

1. **Test Job**: Runs type checking and linting
2. **Build Job**: Builds and pushes Docker images to ghcr.io
3. **Deploy Job**: SSHs into Lightsail and deploys new images
4. **Health Check Job**: Verifies deployment success

### Required GitHub Secrets

Configure these secrets in your GitHub repository settings (Settings > Secrets and variables > Actions):

| Secret Name | Description | How to Get |
|-------------|-------------|------------|
| `LIGHTSAIL_SSH_KEY` | Private SSH key for Lightsail instance | Generate with `ssh-keygen -t ed25519` |
| `LIGHTSAIL_HOST` | IP address or hostname of Lightsail instance | AWS Lightsail console |
| `LIGHTSAIL_USER` | SSH username | Usually `ubuntu` for Ubuntu instances |

### Required GitHub Variables (Optional)

Configure these variables for customization (Settings > Secrets and variables > Actions > Variables):

| Variable Name | Description | Default |
|---------------|-------------|---------|
| `DEPLOY_PATH` | Path on server where app is deployed | `/opt/glassbox` |
| `APP_URL` | Frontend application URL | `https://example.com` |
| `NEXT_PUBLIC_API_URL` | Backend API URL | `https://api.example.com` |

### Setup Instructions

#### Step 1: Generate SSH Key Pair

```bash
# Generate a new SSH key pair for deployments
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_deploy_key -N ""

# Display the private key (copy this to GitHub Secrets as LIGHTSAIL_SSH_KEY)
cat ~/.ssh/github_deploy_key

# Display the public key (add this to Lightsail instance)
cat ~/.ssh/github_deploy_key.pub
```

#### Step 2: Add Public Key to Lightsail Instance

```bash
# SSH into your Lightsail instance
ssh ubuntu@your-lightsail-ip

# Add the public key to authorized_keys
echo "your-public-key-here" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

#### Step 3: Configure GitHub Secrets

1. Go to your GitHub repository
2. Navigate to Settings > Secrets and variables > Actions
3. Click "New repository secret"
4. Add each required secret:

```
LIGHTSAIL_SSH_KEY = (paste your private key, including -----BEGIN and -----END lines)
LIGHTSAIL_HOST = 123.45.67.89
LIGHTSAIL_USER = ubuntu
```

#### Step 4: Configure GitHub Container Registry Permissions

The workflow automatically uses `GITHUB_TOKEN` for ghcr.io authentication. Ensure your repository settings allow:

1. Go to Settings > Actions > General
2. Under "Workflow permissions", select "Read and write permissions"
3. Check "Allow GitHub Actions to create and approve pull requests"

#### Step 5: Prepare Lightsail Server

```bash
# SSH into Lightsail
ssh ubuntu@your-lightsail-ip

# Create deployment directory
sudo mkdir -p /opt/glassbox/backups
sudo chown -R ubuntu:ubuntu /opt/glassbox
cd /opt/glassbox

# Copy required files (or clone repository)
git clone https://github.com/your-org/glassbox.git .

# Create environment file
cat > .env << 'EOF'
# Database
DB_PASSWORD=your-secure-database-password

# JWT (must match between frontend and backend)
JWT_SECRET=your-64-character-random-secret-key-here
NEXTAUTH_SECRET=your-64-character-random-secret-key-here

# URLs
FRONTEND_URL=https://your-domain.com
NEXTAUTH_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://api.your-domain.com

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# Image Registry (set by CI/CD)
FRONTEND_IMAGE=ghcr.io/your-org/glassbox/frontend
BACKEND_IMAGE=ghcr.io/your-org/glassbox/backend
VERSION=latest
EOF

# Start initial deployment
docker-compose -f docker-compose.prod.yml up -d
```

### Manual Deployment Trigger

You can manually trigger a deployment from the GitHub Actions UI:

1. Go to Actions tab in your repository
2. Select "Build and Deploy" workflow
3. Click "Run workflow"
4. Click "Run workflow" to start

### Deployment Workflow Details

#### Automatic Triggers

The workflow runs automatically on:
- Push to `main` or `master` branch

#### Build Process

1. **Test & Lint**: Runs type checking and ESLint
2. **Build Images**:
   - Builds frontend and backend Docker images
   - Tags with commit SHA and `latest`
   - Pushes to `ghcr.io/{owner}/{repo}/frontend` and `ghcr.io/{owner}/{repo}/backend`
   - Uses GitHub Actions cache for faster builds

#### Deployment Process

1. **SSH Connection**: Connects to Lightsail using stored credentials
2. **Pull Images**: Pulls new images from ghcr.io
3. **Database Backup**: Creates backup before deployment
4. **Rolling Update**: Updates backend first, then frontend
5. **Migrations**: Runs Prisma database migrations
6. **Health Check**: Verifies services are responding
7. **Cleanup**: Removes old Docker images

#### Rollback Procedure

If deployment fails, you can rollback manually:

```bash
# SSH into Lightsail
ssh ubuntu@your-lightsail-ip
cd /opt/glassbox

# List available image versions
docker images | grep ghcr.io

# Rollback to previous version
export VERSION=previous-sha
docker-compose -f docker-compose.prod.yml up -d

# Or restore from database backup
gunzip -c backups/backup_YYYYMMDD_HHMMSS.sql.gz | docker-compose exec -T postgres psql -U glassbox glassbox
```

### Monitoring Deployments

#### GitHub Actions Dashboard

View deployment status at: `https://github.com/{owner}/{repo}/actions`

Each run shows:
- Build logs and timing
- Image tags created
- Deployment output
- Health check results

### Troubleshooting

#### Common Issues

**SSH Connection Failed**
```
Error: ssh: connect to host X.X.X.X port 22: Connection refused
```
- Verify LIGHTSAIL_HOST is correct
- Check Lightsail firewall allows port 22
- Verify SSH key format (should include BEGIN/END lines)

**Docker Login Failed**
```
Error: unauthorized: authentication required
```
- Ensure repository has package write permissions
- Check GITHUB_TOKEN has correct scopes

**Image Pull Failed**
```
Error: manifest for ghcr.io/.../frontend:abc123 not found
```
- Wait for build job to complete
- Check image was pushed successfully in build logs

**Health Check Failed**
```
ERROR: Backend health check failed after 30 attempts
```
- Check backend logs: `docker-compose logs backend`
- Verify DATABASE_URL is correct
- Check Prisma migrations ran successfully

#### Debug Commands

```bash
# SSH into Lightsail and run these commands:

# Check container status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Check specific service
docker-compose -f docker-compose.prod.yml logs backend

# Restart services
docker-compose -f docker-compose.prod.yml restart

# Full redeploy
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d
```

### Best Practices

1. **Fix Failing Tests**: Ensure tests pass before merging to main
2. **Review Before Merge**: All changes to main should be reviewed
3. **Monitor After Deploy**: Watch logs for 5 minutes after deployment
4. **Keep Backups**: Ensure backup script runs before each deployment
5. **Test Locally First**: Test changes locally before pushing to main

---

## Cost Analysis

### Monthly Costs

| Component | Cost | Notes |
|-----------|------|-------|
| Lightsail Instance (Medium) | $20 | 2 vCPU, 4 GB RAM, 80 GB SSD |
| Static IP | $0 | Free with instance |
| Data Transfer | $0-5 | 4 TB included, excess at $0.09/GB |
| DNS (Route 53) | $0.50 | Per hosted zone |
| **Total** | **~$21/month** | **~$252/year** |

### Scaling Costs

| Instance Size | Monthly | Capacity |
|---------------|---------|----------|
| Medium (current) | $20 | 100-500 daily users |
| Large | $40 | 500-1000 daily users |
| XLarge | $80 | 1000+ daily users |

---

## Monitoring and Maintenance

### Health Checks

Add health check endpoints:

**Backend** (`/health`):
```typescript
@Get('health')
@Public()
async healthCheck() {
  const pythonOk = await this.pythonExecutor.checkPythonEnvironment();
  const dbOk = await this.prisma.$queryRaw`SELECT 1`;

  return {
    status: pythonOk && dbOk ? 'healthy' : 'degraded',
    python: pythonOk,
    database: !!dbOk,
    timestamp: new Date().toISOString(),
  };
}
```

### Log Aggregation

Docker logs are stored automatically. To persist and rotate:

```yaml
# Add to docker-compose.yml services
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

### Backup Strategy

**Database Backup Script** (`/opt/scripts/backup.sh`):
```bash
#!/bin/bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR=/opt/backups

# Create backup
docker-compose exec -T postgres pg_dump -U glassbox glassbox > $BACKUP_DIR/glassbox_$TIMESTAMP.sql

# Compress
gzip $BACKUP_DIR/glassbox_$TIMESTAMP.sql

# Keep only last 7 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete

# Optional: Upload to S3
# aws s3 cp $BACKUP_DIR/glassbox_$TIMESTAMP.sql.gz s3://your-bucket/backups/
```

Add to crontab:
```bash
0 3 * * * /opt/scripts/backup.sh
```

### Update Procedure

```bash
# Pull latest code
git pull origin main

# Rebuild and deploy with zero downtime
docker-compose build
docker-compose up -d --no-deps --build frontend backend

# Run migrations if needed
docker-compose exec backend npx prisma migrate deploy

# Clean up old images
docker image prune -f
```

### Monitoring Recommendations

1. **AWS Lightsail Metrics**: CPU, memory, disk usage (built-in)
2. **UptimeRobot** or **Better Uptime**: Free external monitoring
3. **Application logs**: `docker-compose logs -f --tail=100`

---

## Scaling Path

When traffic grows:

1. **Immediate**: Upgrade to $40/month instance (4 vCPU, 8 GB RAM)
2. **Medium-term**: Upgrade to $80/month instance (8 vCPU, 16 GB RAM)
3. **Long-term**: Consider AWS ECS or Kubernetes for auto-scaling

### Traffic Capacity Estimates

| Instance | Concurrent Users | Daily Analyses | Response Time |
|----------|-----------------|----------------|---------------|
| $20 (Medium) | 20-50 | 500-1000 | <2s API, <30s analysis |
| $40 (Large) | 50-100 | 1000-2500 | <1.5s API, <25s analysis |
| $80 (XLarge) | 100-200 | 2500-5000 | <1s API, <20s analysis |

---

## Security Checklist

- [ ] Generate cryptographically secure JWT_SECRET (64+ characters)
- [ ] Use HTTPS everywhere (SSL certificates configured)
- [ ] Enable Lightsail firewall (allow only ports 80, 443, 22)
- [ ] Set up SSH key authentication (disable password auth)
- [ ] Configure Google OAuth with production redirect URIs
- [ ] Enable rate limiting in Nginx and Nest.js
- [ ] Regular security updates (`apt update && apt upgrade`)
- [ ] Database password is strong and unique
- [ ] Environment files are not committed to git
- [ ] Enable Lightsail automatic snapshots

---

## Quick Reference Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Restart specific service
docker-compose restart backend

# Run database migrations
docker-compose exec backend npx prisma migrate deploy

# Open database shell
docker-compose exec postgres psql -U glassbox

# Check resource usage
docker stats

# Backup database
docker-compose exec -T postgres pg_dump -U glassbox glassbox > backup.sql

# Update and redeploy
git pull && docker-compose up -d --build
```

---

## Conclusion

The **Single Server** approach provides the best balance of cost (~$21/month), simplicity, and performance for Glassbox. The Lightsail instance can comfortably handle hundreds of daily users while keeping operational complexity low.

When the application grows, simply upgrade the instance size. For massive scale, migration to AWS ECS or Kubernetes is straightforward since the application is fully containerized.

**Next Steps**:
1. Create AWS Lightsail account
2. Register domain name
3. Set up Google OAuth credentials
4. Configure GitHub Secrets for CI/CD
5. Push to main branch to trigger deployment
6. Configure SSL with Let's Encrypt
7. Set up monitoring and backups
