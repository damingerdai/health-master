# Health Master Helm Chart

This is the Helm chart for the **health-master** application, supporting Kubernetes deployment.

## Features

- **Database Configuration:** Supports custom host, port, user, password, etc.
- **JWT Configuration:** Supports custom secrets, issuers, and expiration times.
- **Redis Configuration:** Supports custom host, port, password, and DB index.
- **Logging:** Customizable log levels (debug/info/warn/error).
- **Image Management:** Flexible image repository, tags, and pull policies.
- **Resource Management:** Configuration for CPU/Memory requests and limits.
- **Namespace:** Supports automatic namespace creation.

## Prerequisites

- Kubernetes 1.16+
- Helm 3.0+

## Quick Start

### Basic Deployment
Deploy with default values:
```bash
helm install health-master ./health-master

```

### Custom Deployment

Deploy using a custom values file:

```bash
helm install health-master ./health-master -f values-prod.yaml

```

## Configuration Options

### Image Configuration

```yaml
image:
  repository: health-master        # Image repository
  tag: latest                      # Image version tag
  pullPolicy: IfNotPresent         # Pull policy

```

### Frontend Configuration

```yaml
web:
  enabled: false                   # Set to true to deploy the frontend
  image:
    repository: health-master-web # Frontend image repository
    tag: latest                    # Frontend image version tag
    pullPolicy: IfNotPresent       # Frontend image pull policy
  service:
    type: ClusterIP                # Frontend service type
    port: 3000                     # Frontend service port
    targetPort: 3000               # Frontend container port
  resources:                       # Frontend resource limits and requests
    limits:
      cpu: 512m
      memory: 1024Mi
    requests:
      cpu: 256m
      memory: 512Mi

```

### Server Configuration

```yaml
server:
  runMode: release                 # Run mode: debug/release
  httpPort: 8000                   # HTTP port
  readTimeout: 60s                 # Read timeout
  writeTimeout: 60s                # Write timeout

```

### Database Configuration

```yaml
database:
  host: postgres                   # DB host
  port: 5432                       # DB port
  user: postgres                   # DB username
  password: "123456"               # DB password
  db: postgres                     # DB name
  ssl: false                       # Enable SSL

```

### JWT Configuration

```yaml
jwt:
  secret: damingerdai              # JWT secret key
  issuer: health-master            # JWT issuer
  expire: 7200s                    # JWT expiration time

```

### Redis Configuration

```yaml
redis:
  host: redis                      # Redis host
  port: 6379                       # Redis port
  password: "12345"                # Redis password
  db: 0                            # Redis database index

```

### Logging Configuration

```yaml
logger:
  level: info                      # logger level：debug/info/warn/error
```

### SMTP Configuration

```yaml
smtp:
  host: smtp.gmail.com             # SMTP server host
  port: 587                        # SMTP server port
  address: health-master@gmail.com # Sender email address
  password: health-master-password # Sender email password

```

## Common Commands

### Installation

```bash
# Basic installation
helm install health-master ./health-master -n health-master-namespace --create-namespace

# Installation with custom values
helm install health-master ./health-master -f custom-values.yaml

```

### Upgrade Strategies

#### 1. Upgrade Image Version

```bash
# Option A: Using --set
helm upgrade health-master ./health-master --set image.tag=v1.1.0 -n health-master-namespace

# Option B: Using values file
helm upgrade health-master ./health-master -f values-prod.yaml -n health-master-namespace

```

#### 2. Scaling & Resources

```bash
# Increase replicas
helm upgrade health-master ./health-master --set replicas=5 -n health-master-namespace

```

#### 3. Dry Run (Preview)

```bash
helm upgrade health-master ./health-master --dry-run --debug -f values-prod.yaml -n health-master-namespace

```

### Rollback & History

```bash
# View upgrade history
helm history health-master -n health-master-namespace

# Rollback to previous version
helm rollback health-master -n health-master-namespace

```

## Troubleshooting

* **Validate Template:**
`helm template health-master ./health-master -f values-prod.yaml`
* **Check Logs:**
`kubectl logs -n health-master-namespace deployment/health-master-api`
* **Inspect ConfigMap:**
`kubectl describe configmap health-master-config -n health-master-namespace`


## License

MIT
