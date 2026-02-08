# Health Master Helm Chart

这是 health-master 应用程序的 Helm chart，支持 Kubernetes 部署。

## 功能特性

- 支持自定义数据库配置（host、port、用户、密码等）
- 支持自定义 JWT 配置（secret、issuer、过期时间）
- 支持自定义 Redis 配置（host、port、密码、db）
- 支持自定义日志级别
- 支持自定义镜像版本和拉取策略
- 支持对应用资源限制和请求的配置
- 支持命名空间自动创建

## 前置条件

- Kubernetes 1.16+
- Helm 3.0+

## 快速开始

### 基础部署

使用默认值部署：

```bash
helm install health-master ./health-master
```

### 自定义部署

使用自定义 values 文件：

```bash
helm install health-master ./health-master -f values-prod.yaml
```

## 配置选项

### 镜像配置

```yaml
image:
  repository: health-master        # 镜像仓库
  tag: latest                      # 镜像标签版本
  pullPolicy: IfNotPresent         # 拉取策略
```

### 服务器配置

```yaml
server:
  runMode: release                 # 运行模式：debug/release
  httpPort: 8000                   # HTTP 端口
  readTimeout: 60s                 # 读超时
  writeTimeout: 60s                # 写超时
```

### 数据库配置

```yaml
database:
  host: postgres                   # 数据库主机
  port: 5432                       # 数据库端口
  user: postgres                   # 数据库用户名
  password: "123456"               # 数据库密码
  db: postgres                     # 数据库名称
  ssl: false                       # 是否启用 SSL
```

### JWT 配置

```yaml
jwt:
  secret: damingerdai              # JWT 密钥
  issuer: health-master            # JWT 签发者
  expire: 7200s                    # JWT 过期时间
```

### Redis 配置

```yaml
redis:
  host: redis                      # Redis 主机
  port: 6379                       # Redis 端口
  password: "12345"                # Redis 密码
  db: 0                            # Redis 数据库编号
```

### 日志配置

```yaml
logger:
  level: info                      # 日志级别：debug/info/warn/error
```

## 常用命令

### 安装

```bash
# 基础安装
helm install health-master ./health-master -n health-master-namespace --create-namespace

# 使用自定义 values
helm install health-master ./health-master -f custom-values.yaml
```

### 升级

#### 1. 升级镜像版本（最常见）

```bash
# 方式一：使用 helm upgrade + --set
helm upgrade health-master ./health-master \
  --set image.tag=v1.1.0 \
  -n health-master-namespace

# 方式二：修改 values 文件后升级
helm upgrade health-master ./health-master \
  -f values-prod.yaml \
  -n health-master-namespace
```

#### 2. 升级配置（数据库、Redis、JWT等）

```bash
# 升级数据库密码
helm upgrade health-master ./health-master \
  --set database.password=new_secure_password \
  -n health-master-namespace

# 升级多个配置
helm upgrade health-master ./health-master \
  --set image.tag=v1.1.0 \
  --set redis.password=new_redis_password \
  --set jwt.secret=new_secret_key \
  -n health-master-namespace
```

#### 3. 升级副本数、资源限制等

```bash
# 增加副本数
helm upgrade health-master ./health-master \
  --set replicas=5 \
  -n health-master-namespace

# 调整资源限制
helm upgrade health-master ./health-master \
  --set resources.limits.memory=8192Mi \
  --set resources.requests.memory=4096Mi \
  -n health-master-namespace
```

#### 4. 预览升级（干运行）

```bash
# 查看升级会生成什么 YAML，不实际执行
helm upgrade health-master ./health-master \
  --dry-run \
  --debug \
  -f values-prod.yaml \
  -n health-master-namespace
```

#### 5. 灰度升级

```bash
# 升级时增加等待时间，让 Pod 逐步更新
helm upgrade health-master ./health-master \
  --set image.tag=v1.1.0 \
  --wait \
  --timeout=5m \
  -n health-master-namespace

# 监看升级进度
kubectl rollout status deployment/health-master-api -n health-master-namespace

# 如果有问题立即回滚
helm rollback health-master -n health-master-namespace
```

### 升级历史和回滚

#### 查看升级历史

```bash
# 查看所有版本
helm history health-master -n health-master-namespace

# 输出示例：
# REVISION  UPDATED                 STATUS      CHART              APP VERSION DESCRIPTION
# 1         Sat Feb 8 10:00:00 2026 superseded  health-master-1.0.0 1.0         Install complete
# 2         Sat Feb 8 10:15:00 2026 deployed    health-master-1.0.0 1.0         Upgrade complete
```

#### 回滚到上一个版本

```bash
# 立即回滚到上一个版本
helm rollback health-master -n health-master-namespace

# 回滚到指定版本（如版本1）
helm rollback health-master 1 -n health-master-namespace
```

### 删除

```bash
helm uninstall health-master -n health-master-namespace
```

### 验证

```bash
# 查看生成的 YAML
helm template health-master ./health-master

# 查看安装的 release
helm list

# 查看 release 状态
helm status health-master
```

## 示例

### 生产环境配置

创建 `values-prod.yaml`：

```yaml
replicas: 3

image:
  repository: health-master
  tag: v1.0.0
  pullPolicy: Always

database:
  host: postgres.prod.svc.cluster.local
  port: 5432
  user: prod_user
  password: "secure_password"
  db: health_master_prod
  ssl: true

jwt:
  secret: "production_secret_key"
  expire: 3600s

redis:
  host: redis.prod.svc.cluster.local
  port: 6379
  password: "redis_secure_password"

logger:
  level: warn

resources:
  limits:
    cpu: 2000m
    memory: 4096Mi
  requests:
    cpu: 1000m
    memory: 2048Mi

service:
  type: LoadBalancer
  port: 80
```

然后部署：

```bash
helm install health-master ./health-master -f values-prod.yaml -n health-master-namespace --create-namespace
```

## 故障排除

### 检查配置是否正确

```bash
helm template health-master ./health-master -f values-prod.yaml
```

### 查看 Pod 日志

```bash
kubectl logs -n health-master-namespace deployment/health-master-api
```

### 查看 ConfigMap

```bash
kubectl get configmap -n health-master-namespace
kubectl describe configmap health-master-config -n health-master-namespace
```

## 许可证

MIT
