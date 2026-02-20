# Health Master Helm Deployment Guide

## 项目结构

```
deployments/helm/
├── health-master/                  # Helm chart 主目录
│   ├── Chart.yaml                 # Chart 元数据
│   ├── values.yaml                # 默认值
│   ├── README.md                  # Chart 文档
│   ├── .helmignore               # Helm 忽略文件
│   └── templates/                # Kubernetes 资源模板
│       ├── _helpers.tpl          # 模板辅助函数
│       ├── NOTES.txt             # 部署后信息
│       ├── namespace.yaml        # 命名空间
│       ├── configmap.yaml        # 配置映射
│       ├── deployment.yaml       # 应用部署
│       └── service.yaml          # 服务
├── values-dev.yaml               # 开发环境配置 (remove)
└── values-prod.yaml              # 生产环境配置 (remove)
```

## 快速开始

### 1. 安装 Helm

```bash
# macOS
brew install helm

# 验证安装
helm version
```

### 2. 部署到开发环境

```bash
cd deployments/helm

# 创建命名空间
kubectl create namespace health-master-namespace

# 部署（使用开发配置）
helm install health-master ./health-master -f values-dev.yaml -n health-master-namespace

# 检查部署状态
helm status health-master -n health-master-namespace
kubectl get all -n health-master-namespace
```

### 3. 部署到生产环境

```bash
cd deployments/helm

# 创建命名空间
kubectl create namespace health-master-namespace

# 部署（使用生产配置）
helm install health-master ./health-master -f values-prod.yaml -n health-master-namespace
```

## 自定义配置

### 镜像版本信息

在 `values.yaml` 中配置：

```yaml
image:
  repository: health-master
  tag: v1.0.0              # 修改为你的镜像版本
  pullPolicy: IfNotPresent
```

或者在部署时覆盖：

```bash
helm install health-master ./health-master \
  --set image.tag=v1.0.0 \
  -n health-master-namespace
```

### 数据库配置

在 `values.yaml` 或环境特定的 `values-*.yaml` 中配置：

```yaml
database:
  host: postgres
  port: 5432
  user: postgres
  password: "123456"
  db: postgres
  ssl: false
```

或者在部署时覆盖：

```bash
helm install health-master ./health-master \
  --set database.host=postgres.example.com \
  --set database.password=secure_password \
  -n health-master-namespace
```

### JWT 配置

```yaml
jwt:
  secret: damingerdai          # 修改为强密钥
  issuer: health-master
  expire: 7200s               # JWT 过期时间
```

### Redis 配置

```yaml
redis:
  host: redis
  port: 6379
  password: "12345"
  db: 0
```

### 日志配置

```yaml
logger:
  level: info                 # debug, info, warn, error
```

## 常用操作

### 查看会生成的 YAML

```bash
helm template health-master ./health-master -f values-dev.yaml
```

### 升级部署

```bash
helm upgrade health-master ./health-master -f values-dev.yaml -n health-master-namespace
```

### 回滚部署

```bash
# 查看历史版本
helm history health-master -n health-master-namespace

# 回滚到上一个版本
helm rollback health-master -n health-master-namespace

# 回滚到特定版本
helm rollback health-master 2 -n health-master-namespace
```

### 卸载部署

```bash
helm uninstall health-master -n health-master-namespace
```

### 查看 ConfigMap

```bash
kubectl get configmap -n health-master-namespace
kubectl describe configmap health-master-config -n health-master-namespace
```

### 查看 Pod 日志

```bash
kubectl logs -n health-master-namespace deployment/health-master-api -f
```

## 高级用法

### 使用多个 values 文件

```bash
helm install health-master ./health-master \
  -f values.yaml \
  -f values-prod.yaml \
  -f values-secret.yaml \
  -n health-master-namespace
```

### 使用 --values 和 --set 组合

```bash
helm install health-master ./health-master \
  -f values-prod.yaml \
  --set image.tag=v1.0.1 \
  --set database.password=new_password \
  -n health-master-namespace
```

### 打包 Chart

```bash
helm package ./health-master
# 生成 health-master-1.0.0.tgz
```

### 验证 Chart

```bash
helm lint ./health-master
```

## 使用 Helm 外部依赖（可选）

如果需要添加数据库、Redis 等依赖，可以在 `Chart.yaml` 中定义：

```yaml
dependencies:
  - name: postgresql
    version: "11.x.x"
    repository: "https://charts.bitnami.com/bitnami"
    condition: postgresql.enabled
  - name: redis
    version: "17.x.x"
    repository: "https://charts.bitnami.com/bitnami"
    condition: redis.enabled
```

然后运行：

```bash
helm dependency update ./health-master
helm install health-master ./health-master -n health-master-namespace
```

## 测试

### 在本地测试部署（不实际安装）

```bash
helm install health-master ./health-master --dry-run --debug -n health-master-namespace
```

### 验证模板输出

```bash
helm template health-master ./health-master -f values-prod.yaml | kubectl apply --dry-run=client -f -
```

## 故障排除

### 检查 Chart 有效性

```bash
helm lint ./health-master
```

### 查看生成的资源

```bash
helm get manifest health-master -n health-master-namespace
```

### 查看 values

```bash
helm get values health-master -n health-master-namespace
```

### 完整的 Chart 状态

```bash
helm get all health-master -n health-master-namespace
```

## CI/CD 集成示例

### GitHub Actions

```yaml
name: Deploy with Helm

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Set up Helm
        uses: azure/setup-helm@v2
        
      - name: Deploy
        run: |
          helm install health-master ./deployments/helm/health-master \
            -f deployments/helm/values-prod.yaml \
            -n health-master-namespace \
            --create-namespace
```

## 参考资源

- [Helm 官方文档](https://helm.sh/docs/)
- [Kubernetes 官方文档](https://kubernetes.io/docs/)
- [Health Master 项目](https://github.com/damingerdai/health-master)

## 进一步定制

如果需要添加更多功能（如 Ingress、HPA、PDB 等），可以创建更多模板文件：

- `templates/ingress.yaml` - 用于外部访问
- `templates/hpa.yaml` - 用于自动扩展
- `templates/pdb.yaml` - 用于 Pod 干扰预算
- `templates/serviceaccount.yaml` - 用于 RBAC

在 `values.yaml` 中添加对应的开关和配置参数。
