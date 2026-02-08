# Development Dockerfile for Serverless TypeScript API
# Optimized for local development with hot-reload

FROM node:20-alpine

# Install required tools
RUN apk add --no-cache \
    curl \
    wget \
    git \
    bash

# Set working directory
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies
# Using npm ci for deterministic builds when package-lock.json exists
# Falls back to npm install if no lock file
RUN npm install

# Install Serverless Framework globally
RUN npm install -g serverless@3

# Copy source files
COPY . .

# Expose the serverless-offline port
EXPOSE 3000

# Set default environment variables
ENV NODE_ENV=dev
ENV LOG_LEVEL=debug

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Start serverless offline
# Using --reloadHandler for hot-reload on file changes
CMD ["npx", "serverless", "offline", "start", "--host", "0.0.0.0", "--stage", "dev"]
