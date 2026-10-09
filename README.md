# Health Master

A personal health tracking application with a Go REST API and a Next.js frontend.
Track blood pressure, weight, height, and body temperature, view summary statistics,
and export blood pressure records.

The backend uses Gin, PostgreSQL, and Redis. The frontend uses Next.js, React,
TypeScript, and shadcn/ui. Authentication includes JWT tokens, optional TOTP
verification, and email-based password resets.

## Project layout

```text
main.go                 Backend entry point
internal/api/           HTTP handlers
internal/service/       Business logic
internal/repository/    PostgreSQL data access
internal/middleware/    Authentication, rate limiting, and request logging
pkg/                    Shared packages, migration commands, and app version
configs/                Application and migration configuration
cmd/migrate.go          Database migration entry point
db/migrations/          SQL migrations
docs/                   Generated Swagger documentation
web/                    Next.js application
scripts/                Build, deployment, and release helpers
deployments/            Kubernetes, Kustomize, and Helm manifests
.github/workflows/      CI, image publishing, and releases
```

Backend requests flow through `router → handler → service → repository → PostgreSQL`.
API routes live under `/api/v1`.

## Local development

### Prerequisites

- Go matching [go.mod](go.mod), currently `1.27.0`.
- Bun matching [web/package.json](web/package.json), currently `1.4.2`.
- Docker with Docker Compose.
- Python 3 for the release helper tests.

Run the following commands from the repository root unless stated otherwise.

### 1. Start infrastructure

Create the external volumes once per machine, then start the services:

```bash
docker volume create daming-health-master-volume
docker volume create daming-health-master-redis-volume
docker volume create daming-health-master-kuma-volume
docker volume create daming-health-master-mailpit-volume
docker compose up -d
```

Compose creates the application network. It runs infrastructure only; start the
Go API and Next.js application separately.

| Service | Local address | Purpose |
| --- | --- | --- |
| PostgreSQL through PgBouncer | `127.0.0.1:16543` | Application database |
| Redis | `127.0.0.1:6379` | Cache |
| Mailpit SMTP | `127.0.0.1:11025` | Development email delivery |
| Mailpit UI | `http://localhost:18025` | Inspect captured email |
| Uptime Kuma | `http://localhost:3001` | Service monitoring |
| Jaeger UI | `http://localhost:16686` | Trace viewer |
| Jaeger OTLP | `localhost:4317` / `localhost:4318` | gRPC / HTTP trace ingestion |

Compose also runs a PostgreSQL backup service with output in `./backups`.
The bundled local credentials are `postgres` / `123456` for PostgreSQL,
`123456` for Redis, and `admin` / `12345` for Mailpit.

### 2. Configure the backend

```bash
cp .env.example .env
```

The API reads [configs/config.yaml](configs/config.yaml), loads `.env` at startup,
and accepts environment overrides using uppercase keys with underscores, such as
`SERVER_HTTPPORT` and `REDIS_PASSWORD`.

Update `.env` with these values to use the Compose services:

```dotenv
DATABASE_URL=postgres://postgres:123456@127.0.0.1:16543/postgres?sslmode=disable
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=123456
SMTP_HOST=127.0.0.1
SMTP_PORT=11025
SMTP_USERNAME=admin
SMTP_PASSWORD=12345
SMTP_FROM=health-master@example.com
SERVER_FRONTENDURL=http://localhost:3000
```

`DATABASE_URL` takes precedence over the separate database host, port, and name
settings. Use `SMTP_USERNAME` and `SMTP_FROM` for mail configuration; the
`SMTP_ADDRESS` entry in the example file is not a supported setting.
The API requires a nonempty `SMTP_HOST` to start.

Set `JWT_SECRET` to your own signing secret and `TOTP_SECRETKEY` to a 32-character
ASCII encryption key. Keep the TOTP key stable once users enable two-factor
authentication. Replace the bundled development credentials for deployed environments.

Tracing is disabled by default. To send traces to the local Jaeger instance, set
`JAEGER_ENABLED=true`, `JAEGER_ENDPOINT=localhost:4318`, and `JAEGER_INSECURE=true`.

### 3. Apply database migrations

The migration CLI reads [configs/db.yaml](configs/db.yaml). Unlike the API, it does
not load `.env`; export `DATABASE_URL` explicitly or update the migration config.
The Compose database is named `postgres`, while the checked-in migration config
uses `hm` on port `5432`.

```bash
go build -o migrate ./cmd/migrate.go
export DATABASE_URL='postgres://postgres:123456@127.0.0.1:16543/postgres?sslmode=disable'
export MIGRATE_PATH='file://./db/migrations'
./migrate up
```

Other migration commands:

```bash
./migrate up 1                 # Apply one pending migration
./migrate down 1               # Roll back one migration
./migrate create add_example   # Create a migration pair
```

`./migrate down` without a step count rolls back all migrations.

### 4. Start the API

```bash
make run
```

The API listens on `http://localhost:8000` by default.

- Health check: `http://localhost:8000/ping`
- Swagger UI: `http://localhost:8000/swagger/index.html`
- Metrics: `http://localhost:8000/metrics`

### 5. Start the frontend

In a separate terminal:

```bash
cd web
cp .env.example .env.local
```

Set the following values in `web/.env.local`:

```dotenv
BACKEND_HOST=http://localhost:8000
AUTH_SECRET=replace-with-a-random-secret
NEXTAUTH_URL=http://localhost:3000
```

Then install dependencies and start the development server:

```bash
bun install --frozen-lockfile
bun run dev
```

Open `http://localhost:3000`. Server-side API requests use `BACKEND_HOST`;
`web/proxy.ts` handles authentication and two-factor redirects.

## Development commands

### Backend

```bash
go build -o main main.go
bash scripts/gofmtcheck.sh
go test ./...
go test ./pkg/serializer/... -run TestGobRedisSerializer
```

Regenerate API documentation after changing Swagger annotations
(requires the `swag` CLI):

```bash
swag init -g main.go
```

### Frontend

Run from `web/`:

```bash
bun run lint
bun run prettier
bun run prettier:fix
bun run build
bun run start
```

`bun run start` serves the production build created by `bun run build`.

### Release helpers

```bash
python3 -m unittest discover -s scripts -p 'test_release.py'
```

The legacy hooks in `.go-husky/` reference frontend script names that are no
longer present. Use the commands above until those hooks are updated.

## CI and container images

[CI](.github/workflows/ci.yaml) runs on pushes and pull requests to `main`.
It checks and builds the frontend and backend, then builds their container images.

The [image publishing workflow](.github/workflows/deploy.yaml) builds the Go API
using `github.Dockerfile` for `linux/amd64` and `linux/arm64`.
It publishes to `ghcr.io/damingerdai/health-master` and/or
`docker.io/damingerdai/health-master`.

| Trigger | Registries | Image tags |
| --- | --- | --- |
| Manual workflow run | Choose GHCR, Docker Hub, or both | Full commit SHA, seven-character SHA, version when run on a tag, optional `latest` |
| Push a `vx.y.z` Git tag | Both | Version tag, full SHA, short SHA, `latest` |

Manual image publishing does not create a Git tag. Running it on an existing
version tag also publishes that version image tag. Pushing a version tag triggers
image publishing automatically. The image publishing workflow does not update
source versions or create a GitHub Release.
The image publishing workflow currently publishes only the Go backend.
Frontend image definitions are available in `web/Dockerfile` and `web/Containerfile`.

Deployment manifests are in `deployments/`; see the
[Helm deployment guide](deployments/helm/README.md) for chart configuration.
Image publishing does not update a running Kubernetes deployment.

## Releases

### Create a release

1. Open **Actions → Create release → Run workflow** on GitHub.
2. Select the `main` branch.
3. Enter a version such as `1.2.3` or `v1.2.3` and run the workflow.

A missing `v` prefix is added automatically. Versions must use the stable
`x.y.z` format, with no leading zeros, prerelease suffix, or build metadata.
The version must be greater than every existing stable release tag.
Existing tags are rejected.

The [release workflow](.github/workflows/release.yaml) validates the version and
synchronizes the Go version, Swagger annotations and generated documents, and
`web/package.json`. It generates Conventional Commits release notes, prepends them
to `CHANGELOG.md`, and saves the notes as an artifact. The changelog ends with a
single newline, including on the first release.

It commits these changes as `chore(release): vX.Y.Z`, creates an annotated tag on
that commit, and atomically pushes both `main` and the tag. It then creates a
GitHub Release using the generated notes. The tag push independently triggers
[deploy.yaml](.github/workflows/deploy.yaml); release does not wait for images.

```text
release.yaml → update versions and CHANGELOG → commit and push main + tag
                                            ├─ create GitHub Release
                                            └─ tag push → deploy.yaml → publish images
```

### Permissions and recovery

Tag pushes use a personal access token (PAT): pushes made with the default
`GITHUB_TOKEN` do not trigger the downstream push workflow.

1. Create a fine-grained PAT under personal **Settings → Developer settings →
   Personal access tokens**, selecting this repository and granting repository
   **Contents: Read and write** permission. Set an expiration date.
2. Save the token as `RELEASE_PAT` under repository **Settings → Secrets and
   variables → Actions → New repository secret**.

The workflow uses this PAT for checkout, pushing the release commit and tag, and
creating the GitHub Release. Keep the PR and required-check rules on `main`, but
grant the PAT owner an applicable ruleset bypass with **Always allow** (not
**For pull requests only**). A PAT does not bypass repository rules by itself;
without that exception, pushing the release commit will fail with GH013. If tag
rules restrict creating `v*` tags, the owner must also be permitted to create them.
Renew the secret when the token expires.

Image publishing uses its own `GITHUB_TOKEN` for GHCR and requires the
`DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN` repository secrets for Docker Hub.

If image publishing fails, retry the failed **Build and publish health-master**
run. The tag remains available; do not rerun **Create release** with the same tag.
A successful release workflow means the commit, tag, and GitHub Release were
created; check the separate deploy run for image publishing results. If GitHub
Release creation fails after the push, use the saved release-notes artifact to
create the Release for the existing tag; rerunning preparation rejects that tag.
