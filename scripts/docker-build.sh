#!/bin/bash
#
# Glassbox Docker Build Script
# Builds Docker images with clear progress output (--progress=plain)
#
# Usage:
#   ./scripts/docker-build.sh [service]
#
#   Examples:
#     ./scripts/docker-build.sh                # Build all services
#     ./scripts/docker-build.sh frontend       # Build only frontend
#     ./scripts/docker-build.sh backend        # Build only backend

set -e

export DOCKER_BUILDKIT=1
export BUILDKIT_PROGRESS=plain

SERVICE="${1:-}"

case $SERVICE in
  "")
    echo "Building all services..."
    docker-compose build --progress=plain
    ;;
  "frontend")
    echo "Building frontend..."
    docker build --progress=plain --file apps/web/Dockerfile \
      --build-arg NEXT_PUBLIC_API_URL="${NEXT_PUBLIC_API_URL:-http://localhost:4000}" \
      --tag glassbox-frontend:latest .
    ;;
  "backend")
    echo "Building backend..."
    docker build --progress=plain --file apps/backend/Dockerfile \
      --tag glassbox-backend:latest .
    ;;
  *)
    echo "Unknown service: $SERVICE"
    echo "Available: frontend, backend"
    exit 1
    ;;
esac

echo "Done!"
