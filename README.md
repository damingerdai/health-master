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
- Node.js 24 for the release helper tests.

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
node --test scripts/test-release.mjs
```

The legacy hooks in `.go-husky/` reference frontend script names that are no
longer present. Use the commands above until those hooks are updated.

## CI and container images

[CI](.github/workflows/ci.yaml) runs on pushes and pull requests to `dev` and `main`.
It checks and builds the frontend and backend, then builds their container images.

The [release workflow](.github/workflows/release.yaml) creates a version commit,
Git tag, and GitHub Release from `dev`. After the release succeeds, a separate
job checks out that exact tag and builds the Go API using `github.Dockerfile`
for `linux/amd64` and `linux/arm64`.
Choose GHCR, Docker Hub, or both with the `registry` input (default: both).
Images are published to `ghcr.io/damingerdai/health-master` and/or
`docker.io/damingerdai/health-master`.

| Release | Image tags |
| --- | --- |
| Stable (for example, `v0.0.2`) | Version with `v` prefix, full commit SHA, seven-character SHA, `latest` |
| Prerelease (for example, `v0.0.3-beta.0`) | Version with `v` prefix, full commit SHA, seven-character SHA |

Prereleases do not update `latest`. Pushing a Git tag alone does not publish
images. If image publishing fails after the release succeeds, rerun only the
failed job to retry publishing the same release without creating a new version.
The workflow requires `RELEASE_PAT` for release creation and
`DOCKERHUB_USERNAME` / `DOCKERHUB_TOKEN` when publishing to Docker Hub;
GHCR publishing uses `GITHUB_TOKEN` with package write permission.
The release workflow currently publishes only the Go backend.
Frontend image definitions are available in `web/Dockerfile` and `web/Containerfile`.

Deployment manifests are in `deployments/`; see the
[Helm deployment guide](deployments/helm/README.md) for chart configuration.
Image publishing does not update a running Kubernetes deployment.

## Releases

### Create a release

1. Open **Actions → Release from dev → Run workflow** on GitHub.
2. Select the `dev` branch. Releases can only run from `dev`.
3. Select a version increment and, for prereleases, an identifier (`alpha`,
   `beta`, or `rc`).

No manual tag input is required. The workflow calculates the next version from
existing release tags. Patch/minor/major increments use the latest stable tag
(or `0.0.0` before the first release). `prerelease` continues the highest pending
prerelease core version; changing the identifier starts its own counter at zero. `patch`,
`minor`, and `major` create stable releases; `prepatch`, `preminor`, `premajor`,
and `prerelease` create prereleases. Both release types are created on `dev`. Stable and prerelease versions are
synchronized across the Go version, Swagger annotations and generated
documents, and `web/package.json`. Duplicate tags and versions that are not
newer than the latest stable release are rejected.

The [release workflow](.github/workflows/release.yaml) validates the version and
synchronizes those files. It uses [git-cliff](https://git-cliff.org/docs/) and `cliff.toml` to generate
release notes and rebuild `CHANGELOG.md` from the branch history. The same
release notes are saved as an artifact and published as the GitHub Release body.
Non-conventional commits are included; release bookkeeping commits are excluded.

It commits these changes as `chore(release): vX.Y.Z`, creates an annotated tag on
that commit, and atomically pushes without force:

- Prereleases update only `dev` and the tag.
- Stable releases update `dev`, `main`, and the tag to the same commit.

`dev` is the default development branch; `main` tracks production releases.
Stable promotion requires `main` to be an ancestor of `dev`. If the branches
have diverged, merge `main` into `dev` before retrying. A rejected branch or
tag update rejects the entire atomic push.

The workflow then creates a GitHub Release using the generated notes and
publishes images from that exact tag. Prereleases publish version and SHA tags;
only stable releases update `latest`.

### Permissions and recovery

Save a personal access token as the repository Actions secret `RELEASE_PAT`.
The workflow uses this token for checkout, pushing branches and tags, and
creating the GitHub Release.

Repository rules must permit the token owner to push directly to `dev` and
`main` and create `v*` tags. Configure any required ruleset bypass for the
token owner; a PAT does not bypass branch protection by itself.

Image publishing uses its own `GITHUB_TOKEN` for GHCR and requires the
`DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN` repository secrets for Docker Hub.

If image publishing fails after release creation succeeds, rerun only the failed
`publish-image` job to publish the same tag. If GitHub Release creation fails
after the push, use the saved release-notes artifact to create the Release for
the existing tag, then rerun the image job. Do not rerun the version-producing
job for that increment: it will calculate the next tag.
