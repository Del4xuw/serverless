# Serverless TypeScript API

A production-ready REST API built with Node.js, TypeScript, and Serverless Framework v4. Designed for **100% local development** using Docker and serverless-offline — no AWS credentials or charges needed during development.

## Features

- **Node.js 20 + TypeScript** with strict mode
- **Serverless Framework v4** with esbuild bundling
- **Local development** via Docker or direct npm
- **In-memory data store** for development/testing
- **Comprehensive test suite** with Jest (80%+ coverage)
- **ESLint + Prettier** for code quality
- **CORS enabled** on all endpoints
- **Hot reload** for rapid development

## Prerequisites

- **Node.js 20+** (for running without Docker)
- **Docker & Docker Compose** (for containerized development)
- **npm** or **yarn**

## Quick Start

### Option 1: Run Locally (No Docker)

```bash
# Install dependencies
npm install

# Start the API locally
npm run dev
```

### Option 2: Run with Docker

```bash
# Start with Docker Compose
docker-compose up --build
```

The API will be available at: **http://localhost:3000**

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check with status and timestamp |
| GET | `/api/users` | Get all users |
| GET | `/api/users/{id}` | Get user by ID |
| POST | `/api/users` | Create new user |
| DELETE | `/api/users/{id}` | Delete user by ID |

## API Examples

### Health Check

```bash
curl http://localhost:3000/health
```

Response:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "service": "serverless-typescript-api",
    "version": "1.0.0",
    "environment": "dev",
    "uptime": 120
  }
}
```

### Get All Users

```bash
curl http://localhost:3000/api/users
```

Response:
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "email": "john.doe@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "count": 3
  }
}
```

### Get User by ID

```bash
curl http://localhost:3000/api/users/550e8400-e29b-41d4-a716-446655440001
```

### Create User

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email": "new@example.com", "firstName": "New", "lastName": "User"}'
```

Response:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "generated-uuid",
      "email": "new@example.com",
      "firstName": "New",
      "lastName": "User",
      "createdAt": "2024-01-15T12:00:00.000Z",
      "updatedAt": "2024-01-15T12:00:00.000Z"
    }
  },
  "message": "User created successfully"
}
```

### Delete User

```bash
curl -X DELETE http://localhost:3000/api/users/550e8400-e29b-41d4-a716-446655440001
```

Returns `204 No Content` on success.

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Run serverless offline locally |
| `npm run dev:docker` | Run with Docker Compose |
| `npm test` | Run tests with coverage |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Run ESLint with auto-fix |
| `npm run format` | Format code with Prettier |
| `npm run build` | Compile TypeScript |
| `npm run typecheck` | Type check without emitting |
| `npm run deploy:dev` | Deploy to AWS (dev stage) |
| `npm run deploy:prod` | Deploy to AWS (prod stage) |

## Project Structure

```
├── src/
│   ├── handlers/         # Lambda function handlers
│   │   ├── health.ts
│   │   ├── getUsers.ts
│   │   ├── getUser.ts
│   │   ├── createUser.ts
│   │   └── deleteUser.ts
│   ├── services/         # Business logic
│   │   └── userService.ts
│   ├── models/           # TypeScript interfaces
│   │   └── user.ts
│   └── utils/            # Utility functions
│       ├── response.ts
│       └── validation.ts
├── tests/                # Test files
│   └── handlers/
├── docker/               # Docker configuration
│   └── Dockerfile
├── docker-compose.yml
├── serverless.yml        # Serverless Framework config
├── package.json
├── tsconfig.json
├── jest.config.js
├── .eslintrc.js
└── .prettierrc
```

## Testing

```bash
# Run all tests with coverage
npm test

# Run tests in watch mode
npm run test:watch

# Run a specific test file
npx jest tests/handlers/health.test.ts
```

Coverage reports are generated in the `coverage/` directory.

## Docker Commands

```bash
# Start containers
docker-compose up

# Start in background
docker-compose up -d

# Rebuild and start
docker-compose up --build

# Stop containers
docker-compose down

# View logs
docker-compose logs -f

# Stop and remove volumes
docker-compose down -v
```

## Environment Variables

Copy `.env.example` to `.env` for local configuration:

```bash
cp .env.example .env
```

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment name | `dev` |
| `LOG_LEVEL` | Logging level | `debug` |
| `SERVICE_NAME` | Service identifier | `serverless-typescript-api` |

## Deployment to AWS

> **Note:** No AWS credentials are needed for local development. Only configure AWS when you're ready to deploy.

### Prerequisites for Deployment

1. AWS CLI configured with credentials
2. Serverless Framework logged in (`serverless login`)

### Deploy

```bash
# Deploy to dev stage
npm run deploy:dev

# Deploy to production
npm run deploy:prod

# Remove deployment
npm run remove:dev
```

## Troubleshooting

### Port 3000 already in use

```bash
# Find process using port 3000
# On Windows:
netstat -ano | findstr :3000

# Kill the process or use a different port
# Edit serverless.yml -> custom.serverless-offline.httpPort
```

### Docker container won't start

```bash
# Remove all containers and volumes
docker-compose down -v

# Rebuild from scratch
docker-compose up --build
```

### Tests failing

```bash
# Clear Jest cache
npx jest --clearCache

# Run with verbose output
npm test -- --verbose
```

### TypeScript errors

```bash
# Check for type errors
npm run typecheck

# Rebuild node_modules
rm -rf node_modules
npm install
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests: `npm test`
4. Run linting: `npm run lint`
5. Format code: `npm run format`
6. Submit a pull request

## License

MIT
