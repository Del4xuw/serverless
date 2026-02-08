# Makefile for Serverless TypeScript API
# ======================================

.PHONY: help install dev dev-docker docker-up docker-down docker-build \
        test test-watch lint format clean deploy-dev deploy-prod logs

# Default target
help:
	@echo "Available commands:"
	@echo ""
	@echo "  Development:"
	@echo "    make install       - Install dependencies"
	@echo "    make dev           - Run serverless offline (local, no Docker)"
	@echo "    make dev-docker    - Run with Docker Compose"
	@echo "    make docker-up     - Start Docker containers"
	@echo "    make docker-down   - Stop Docker containers"
	@echo "    make docker-build  - Rebuild Docker containers"
	@echo ""
	@echo "  Testing & Quality:"
	@echo "    make test          - Run tests with coverage"
	@echo "    make test-watch    - Run tests in watch mode"
	@echo "    make lint          - Run ESLint"
	@echo "    make lint-fix      - Run ESLint with auto-fix"
	@echo "    make format        - Format code with Prettier"
	@echo "    make typecheck     - Run TypeScript type checking"
	@echo ""
	@echo "  Deployment:"
	@echo "    make deploy-dev    - Deploy to AWS (dev stage)"
	@echo "    make deploy-prod   - Deploy to AWS (prod stage)"
	@echo "    make logs          - Tail Lambda logs"
	@echo ""
	@echo "  Maintenance:"
	@echo "    make clean         - Clean build artifacts"

# Install dependencies
install:
	npm install

# Run serverless offline locally (without Docker)
dev:
	npm run dev

# Run with Docker Compose
dev-docker:
	docker-compose up

# Start Docker containers (detached)
docker-up:
	docker-compose up -d

# Stop Docker containers
docker-down:
	docker-compose down

# Rebuild Docker containers
docker-build:
	docker-compose up --build

# Run tests
test:
	npm test

# Run tests in watch mode
test-watch:
	npm run test:watch

# Run linter
lint:
	npm run lint

# Run linter with auto-fix
lint-fix:
	npm run lint:fix

# Format code
format:
	npm run format

# TypeScript type checking
typecheck:
	npm run typecheck

# Clean build artifacts
clean:
	npm run clean
	docker-compose down -v --remove-orphans 2>/dev/null || true

# Deploy to dev stage
deploy-dev:
	npm run deploy:dev

# Deploy to prod stage
deploy-prod:
	npm run deploy:prod

# Tail Lambda logs
logs:
	npm run logs
