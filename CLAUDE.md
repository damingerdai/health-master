# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Backend (Go)

```bash
# Build
go build -o main main.go

# Run (builds first)
make run

# Format check
bash scripts/gofmtcheck.sh

# Format code
gofmt -w .

# Run a specific test
go test ./pkg/serializer/... -run TestGobRedisSerializer

# Run all tests
go test ./...

# Generate Swagger docs (requires swag CLI)
swag init -g main.go
```

### Database Migrations

The migration binary is at `cmd/migrate.go` and reads config from `configs/db.yaml`.

```bash
# Build migrate binary
go build -o migrate ./cmd/migrate.go

# Run all pending migrations
./migrate up

# Step up N migrations
./migrate up <N>

# Rollback
./migrate down

# Create new migration
./migrate create <name>
```

### Frontend (Next.js — in `web/`)

```bash
cd web
npm install
npm run dev      # dev server at http://localhost:3000
npm run build
npm run lint
npm run prettier
npm run prettier:fix
```

### Local Infrastructure

```bash
# One-time volume/network setup (do once per machine)
docker volume create daming-health-master-volume
docker volume create daming-health-master-redis-volume
docker volume create daming-health-master-kuma-volume

# Start PostgreSQL (via pgbouncer on port 16543), Redis, and Uptime Kuma
docker-compose up -d
```

## Architecture

This is a personal health tracking app with a Go REST API backend and a Next.js frontend.

### Backend structure

```
main.go                  # Entry point: wires settings, DB, Redis, logger, mailer, then starts HTTP server
global/                  # Package-level singletons: DBEngine, Logger, RedisClient, all settings
configs/
  config.yaml            # App config (server, database, JWT, Redis, SMTP, TOTP)
  db.yaml                # Migration-only config
internal/
  routers/router.go      # Gin router; all routes defined here under /api/v1
  api/                   # HTTP handler layer — one file per resource
  service/               # Business logic; service.New() is the single constructor
  repository/            # Data access (pgx/v5 connection pool)
  db/                    # Connection abstraction + transaction support
  middleware/            # JWT auth, rate limiting, access logging
  model/                 # Domain structs
  logger/                # Zap logger setup
  mail/                  # SMTP mailer
pkg/
  setting/               # Viper-based config parsing
  migrate/               # Cobra CLI for golang-migrate
  cryptox/               # AES helpers (used for TOTP secret encryption)
  errcode/               # Typed error codes
  server/                # Graceful HTTP server wrapper
  limiter/               # Token-bucket rate limiter (juju/ratelimit)
  serializer/            # Gob serializer (used for Redis caching)
  util/                  # Misc helpers
db/migrations/           # SQL migration files (golang-migrate, timestamp-prefixed)
docs/                    # Auto-generated Swagger (swaggo/swag)
```

**Request path:** `gin router → api handler → service → repository → pgx pool`

Transactions are created at the handler level via `getTxServices(conn)`, which passes a transaction-scoped connection down through service and repository layers.

### Configuration

Settings are loaded from `configs/config.yaml` and can be overridden by environment variables (via `godotenv` reading a `.env` file at startup). Environment variable names match the Viper key paths. The `DATABASE_URL` env var is also read directly for the database connection string.

### Authentication

- JWT tokens issued on login via `POST /api/v1/auth/login`
- Optional TOTP-based 2FA: enabled per-user, requires a second step at `POST /api/v1/auth/login/2fa`
- JWT middleware (`internal/middleware/jwt.go`) protects all `/api/v1` routes except auth and password-reset endpoints
- Rate limiting (10 req/s) applies to the `/auth` group

### Frontend

The Next.js app lives in `web/`. It uses shadcn/ui components (`components.json`). The dev proxy (`web/proxy.ts`) forwards API calls to the backend at `http://localhost:8000`.

### Docker

- `Dockerfile` / `github.Dockerfile` — multi-stage builds for the Go backend
- `web/Dockerfile` / `web/Containerfile` — builds the Next.js frontend
- `docker-compose.yml` — local dev infrastructure only (Postgres 18, pgbouncer, Redis 8, Uptime Kuma); the app itself is not in compose
