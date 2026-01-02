# 多环境部署架构差异文档

## 文档信息
- 文档类型：架构类
- 所属阶段：YYC3-XY-部署发布
- 遵循规范：五高五标五化要求
- 版本号：V1.0
- 创建日期：2025-12-28
- 最后更新：2025-12-28

## 核心内容

---

## 一、多环境部署概述

### 1.1 环境分类

YYC³-XY系统采用标准的多环境部署策略，确保开发、测试、生产环境的严格隔离和差异化配置：

| 环境名称 | 环境标识 | 用途 | 访问权限 |
|----------|----------|------|----------|
| 开发环境 | development | 本地开发和单元测试 | 开发人员 |
| 测试环境 | staging | 集成测试和UAT | 测试团队、产品团队 |
| 生产环境 | production | 线上服务运行 | 运维团队、监控系统 |

### 1.2 环境隔离策略

```yaml
# 环境隔离架构
environments:
  development:
    isolation_level: local
    network: isolated
    data: local_mock
    resources: minimal
    
  staging:
    isolation_level: shared_cluster
    network: vpc_isolated
    data: staging_db
    resources: moderate
    
  production:
    isolation_level: dedicated_cluster
    network: vpc_private
    data: production_db
    resources: maximum
```

### 1.3 环境流转策略

```
开发环境 (development)
    ↓ [代码提交]
测试环境 (staging)
    ↓ [测试通过]
生产环境 (production)
    ↓ [线上问题]
热修复分支 (hotfix)
```

---

## 二、基础设施差异

### 2.1 硬件资源配置

| 资源类型 | 开发环境 | 测试环境 | 生产环境 |
|----------|----------|----------|----------|
| **CPU** | 4核 | 8核 | 16核+ (可扩展) |
| **内存** | 8GB | 16GB | 32GB+ (可扩展) |
| **磁盘** | 100GB SSD | 200GB SSD | 500GB+ NVMe SSD |
| **网络带宽** | 100Mbps | 1Gbps | 10Gbps |
| **节点数量** | 1 | 2-3 | 3+ (高可用) |

### 2.2 容器资源配置

#### 2.2.1 前端服务配置

| 环境 | CPU限制 | 内存限制 | 副本数 |
|------|---------|----------|--------|
| 开发 | 0.5核 | 512MB | 1 |
| 测试 | 1核 | 1GB | 2 |
| 生产 | 2核 | 2GB | 3+ |

#### 2.2.2 API网关配置

| 环境 | CPU限制 | 内存限制 | 副本数 |
|------|---------|----------|--------|
| 开发 | 0.5核 | 512MB | 1 |
| 测试 | 1核 | 1GB | 2 |
| 生产 | 2核 | 2GB | 3+ |

#### 2.2.3 微服务配置

| 环境 | CPU限制 | 内存限制 | 副本数 |
|------|---------|----------|--------|
| 开发 | 0.25核 | 256MB | 1 |
| 测试 | 0.5核 | 512MB | 2 |
| 生产 | 1核 | 1GB | 3+ |

### 2.3 网络配置差异

#### 2.3.1 端口配置

| 服务 | 开发环境 | 测试环境 | 生产环境 |
|------|----------|----------|----------|
| 前端服务 | 1228 | 1228 | 1228 |
| API网关 | 1229 | 1229 | 1229 |
| PostgreSQL | 5432 | 5432 | 5432 |
| Redis | 6379 | 6379 | 6379 |
| Qdrant | 6333 | 6333 | 6333 |

#### 2.3.2 网络隔离

```yaml
# 开发环境网络配置
development_network:
  type: bridge
  isolation: none
  external_access: true
  internal_dns: enabled

# 测试环境网络配置
staging_network:
  type: bridge
  isolation: vpc_level
  external_access: restricted
  internal_dns: enabled
  firewall_rules:
    - allow: [api, db, cache]
    - deny: [direct_db_access]

# 生产环境网络配置
production_network:
  type: overlay
  isolation: strict
  external_access: load_balancer_only
  internal_dns: enabled
  firewall_rules:
    - allow: [load_balancer, api, db, cache]
    - deny: [direct_db_access, direct_cache_access]
    - enable: [ddos_protection, waf]
```

---

## 三、数据存储差异

### 3.1 数据库配置

#### 3.1.1 PostgreSQL配置

| 配置项 | 开发环境 | 测试环境 | 生产环境 |
|--------|----------|----------|----------|
| 数据库实例 | 单实例 | 主从复制 | 主从复制 + 读写分离 |
| 连接池大小 | 10 | 50 | 100+ |
| 查询超时 | 30秒 | 30秒 | 10秒 |
| 慢查询阈值 | 1秒 | 1秒 | 500ms |
| 备份策略 | 手动 | 每日自动 | 每小时自动 + 实时归档 |
| 数据保留 | 无限制 | 30天 | 90天+ (归档) |

#### 3.1.2 数据库连接字符串

```bash
# 开发环境
DATABASE_URL="postgresql://yyc3:dev_pass@localhost:5432/yyc3_xy_dev"

# 测试环境
DATABASE_URL="postgresql://yyc3:staging_pass@db-staging:5432/yyc3_xy_staging"

# 生产环境
DATABASE_URL="postgresql://yyc3:prod_pass@db-primary:5432/yyc3_xy_prod?sslmode=require"
DATABASE_READ_URL="postgresql://yyc3:prod_pass@db-replica:5432/yyc3_xy_prod?sslmode=require"
```

### 3.2 缓存配置

#### 3.2.1 Redis配置

| 配置项 | 开发环境 | 测试环境 | 生产环境 |
|--------|----------|----------|----------|
| 实例类型 | 单实例 | 主从复制 | 哨兵模式 + 集群 |
| 内存限制 | 256MB | 1GB | 4GB+ |
| 过期策略 | volatile-lru | allkeys-lru | allkeys-lru |
| 持久化 | 无 | RDB | AOF + RDB |
| 最大连接数 | 100 | 500 | 1000+ |

#### 3.2.2 缓存连接字符串

```bash
# 开发环境
REDIS_URL="redis://localhost:6379/0"

# 测试环境
REDIS_URL="redis://:staging_pass@redis-staging:6379/0"

# 生产环境
REDIS_URL="redis://:prod_pass@redis-sentinel:26379/0?sentinelMasterId=mymaster"
```

### 3.3 向量数据库配置

#### 3.3.1 Qdrant配置

| 配置项 | 开发环境 | 测试环境 | 生产环境 |
|--------|----------|----------|----------|
| 实例类型 | 单实例 | 单实例 | 集群模式 |
| 内存限制 | 1GB | 4GB | 16GB+ |
| 磁盘限制 | 10GB | 50GB | 200GB+ |
| HNSW参数 | M=16, ef=128 | M=32, ef=256 | M=64, ef=512 |
| 备份策略 | 手动 | 每日自动 | 每日自动 + 增量备份 |

#### 3.3.2 Qdrant连接字符串

```bash
# 开发环境
QDRANT_URL="http://localhost:6333"

# 测试环境
QDRANT_URL="http://qdrant-staging:6333"

# 生产环境
QDRANT_URL="http://qdrant-cluster:6333"
QDRANT_API_KEY="prod_api_key"
```

### 3.4 数据初始化策略

```yaml
# 数据初始化配置
data_initialization:
  development:
    strategy: seed_data
    source: ./seeds/development
    reset_on_start: true
    
  staging:
    strategy: anonymized_production
    source: ./backups/anonymized
    reset_on_start: false
    refresh_frequency: weekly
    
  production:
    strategy: none
    source: null
    reset_on_start: false
    migration_only: true
```

---

## 四、应用配置差异

### 4.1 环境变量配置

#### 4.1.1 通用环境变量

| 变量名 | 开发环境 | 测试环境 | 生产环境 |
|--------|----------|----------|----------|
| NODE_ENV | development | staging | production |
| LOG_LEVEL | debug | info | warn |
| API_TIMEOUT | 30000 | 30000 | 10000 |
| MAX_CONCURRENT_REQUESTS | 10 | 50 | 100 |

#### 4.1.2 前端配置

```bash
# 开发环境
NEXT_PUBLIC_API_BASE_URL="http://localhost:1229"
NEXT_PUBLIC_WS_BASE_URL="ws://localhost:1229"
NEXT_PUBLIC_ENABLE_DEBUG_TOOLS="true"
NEXT_PUBLIC_ENABLE_MOCK_DATA="true"

# 测试环境
NEXT_PUBLIC_API_BASE_URL="https://staging-api.yyc3.com"
NEXT_PUBLIC_WS_BASE_URL="wss://staging-api.yyc3.com"
NEXT_PUBLIC_ENABLE_DEBUG_TOOLS="true"
NEXT_PUBLIC_ENABLE_MOCK_DATA="false"

# 生产环境
NEXT_PUBLIC_API_BASE_URL="https://api.yyc3.com"
NEXT_PUBLIC_WS_BASE_URL="wss://api.yyc3.com"
NEXT_PUBLIC_ENABLE_DEBUG_TOOLS="false"
NEXT_PUBLIC_ENABLE_MOCK_DATA="false"
```

#### 4.1.3 后端配置

```bash
# 开发环境
API_PORT=1229
CORS_ORIGIN="http://localhost:1228,http://localhost:3000"
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=60000
ENABLE_SWAGGER=true
ENABLE_METRICS=true

# 测试环境
API_PORT=1229
CORS_ORIGIN="https://staging.yyc3.com"
RATE_LIMIT_MAX=500
RATE_LIMIT_WINDOW=60000
ENABLE_SWAGGER=true
ENABLE_METRICS=true

# 生产环境
API_PORT=1229
CORS_ORIGIN="https://yyc3.com"
RATE_LIMIT_MAX=1000
RATE_LIMIT_WINDOW=60000
ENABLE_SWAGGER=false
ENABLE_METRICS=true
```

### 4.2 功能开关配置

| 功能开关 | 开发环境 | 测试环境 | 生产环境 |
|----------|----------|----------|----------|
| DEBUG_MODE | true | true | false |
| NEW_FEATURE_ALPHA | true | true | false |
| NEW_FEATURE_BETA | true | true | true |
| EXPERIMENTAL_FEATURES | true | false | false |
| MAINTENANCE_MODE | false | false | false |

### 4.3 第三方服务配置

#### 4.3.1 AI服务配置

```bash
# 开发环境
AI_SERVICE_PROVIDER="mock"
AI_MODEL="gpt-4-mock"
AI_API_KEY="mock_key"
AI_MAX_TOKENS=4000
AI_TEMPERATURE=0.7

# 测试环境
AI_SERVICE_PROVIDER="openai"
AI_MODEL="gpt-4"
AI_API_KEY="${STAGING_OPENAI_API_KEY}"
AI_MAX_TOKENS=4000
AI_TEMPERATURE=0.7

# 生产环境
AI_SERVICE_PROVIDER="openai"
AI_MODEL="gpt-4-turbo"
AI_API_KEY="${PROD_OPENAI_API_KEY}"
AI_MAX_TOKENS=8000
AI_TEMPERATURE=0.5
```

#### 4.3.2 对象存储配置

```bash
# 开发环境
STORAGE_TYPE="local"
STORAGE_PATH="./storage"
STORAGE_MAX_SIZE="10GB"

# 测试环境
STORAGE_TYPE="s3"
STORAGE_ENDPOINT="s3-staging.amazonaws.com"
STORAGE_BUCKET="yyc3-staging"
STORAGE_ACCESS_KEY="${STAGING_S3_ACCESS_KEY}"
STORAGE_SECRET_KEY="${STAGING_S3_SECRET_KEY}"

# 生产环境
STORAGE_TYPE="s3"
STORAGE_ENDPOINT="s3.amazonaws.com"
STORAGE_BUCKET="yyc3-production"
STORAGE_ACCESS_KEY="${PROD_S3_ACCESS_KEY}"
STORAGE_SECRET_KEY="${PROD_S3_SECRET_KEY}"
STORAGE_CDN_URL="https://cdn.yyc3.com"
```

---

## 五、安全策略差异

### 5.1 认证与授权

| 安全措施 | 开发环境 | 测试环境 | 生产环境 |
|----------|----------|----------|----------|
| HTTPS | 可选 | 强制 | 强制 |
| JWT过期时间 | 24小时 | 8小时 | 1小时 |
| 密码复杂度 | 弱 | 中 | 强 |
| 双因素认证 | 可选 | 可选 | 强制 |
| API密钥轮换 | 手动 | 每周 | 每日 |

### 5.2 网络安全

| 安全措施 | 开发环境 | 测试环境 | 生产环境 |
|----------|----------|----------|----------|
| 防火墙 | 基础 | 中等 | 严格 |
| DDoS防护 | 无 | 基础 | 高级 |
| WAF | 无 | 基础 | 高级 |
| IP白名单 | 无 | 部分 | 严格 |
| 端口扫描防护 | 无 | 基础 | 高级 |

### 5.3 数据安全

| 安全措施 | 开发环境 | 测试环境 | 生产环境 |
|----------|----------|----------|----------|
| 数据加密 | 传输层 | 传输层 | 传输+存储 |
| 敏感数据脱敏 | 可选 | 部分 | 全部 |
| 数据审计日志 | 基础 | 详细 | 完整 |
| 数据备份加密 | 无 | 是 | 是 |
| 数据保留策略 | 无限制 | 30天 | 90天+ |

### 5.4 密钥管理

```yaml
# 密钥管理策略
secret_management:
  development:
    storage: .env files
    encryption: none
    rotation: manual
    access: all_developers
    
  staging:
    storage: environment_variables
    encryption: at_rest
    rotation: weekly
    access: authorized_team
    
  production:
    storage: vault_or_kms
    encryption: at_rest_and_in_transit
    rotation: daily
    access: minimum_required
    audit: all_access
```

---

## 六、监控与日志差异

### 6.1 日志级别

| 环境 | 应用日志 | 访问日志 | 错误日志 | 性能日志 |
|------|----------|----------|----------|----------|
| 开发 | DEBUG | INFO | ERROR | DEBUG |
| 测试 | INFO | INFO | ERROR | INFO |
| 生产 | WARN | INFO | ERROR | INFO |

### 6.2 日志保留策略

| 环境 | 应用日志 | 访问日志 | 错误日志 | 审计日志 |
|------|----------|----------|----------|----------|
| 开发 | 7天 | 7天 | 30天 | 不保留 |
| 测试 | 30天 | 30天 | 90天 | 90天 |
| 生产 | 90天 | 30天 | 180天 | 365天+ |

### 6.3 监控指标

| 指标类型 | 开发环境 | 测试环境 | 生产环境 |
|----------|----------|----------|----------|
| 系统指标 | 基础 | 基础 | 完整 |
| 应用指标 | 基础 | 基础 | 完整 |
| 业务指标 | 无 | 部分 | 完整 |
| 告警阈值 | 宽松 | 适中 | 严格 |
| 告警通知 | 邮件 | 邮件+Slack | 邮件+Slack+电话 |

### 6.4 性能监控

```yaml
# 性能监控配置
performance_monitoring:
  development:
    apm: enabled
    profiling: enabled
    tracing: sampled_10_percent
    alerts: disabled
    
  staging:
    apm: enabled
    profiling: enabled
    tracing: sampled_50_percent
    alerts: enabled
    thresholds:
      response_time_p95: 2000ms
      error_rate: 5%
      
  production:
    apm: enabled
    profiling: on_demand
    tracing: sampled_100_percent
    alerts: enabled
    thresholds:
      response_time_p95: 500ms
      error_rate: 1%
    escalation:
      level_1: slack_5min
      level_2: pagerduty_15min
      level_3: phone_30min
```

---

## 七、部署流程差异

### 7.1 部署频率

| 环境 | 部署频率 | 部署窗口 | 审批要求 |
|------|----------|----------|----------|
| 开发 | 按需 | 任意时间 | 无 |
| 测试 | 每日 | 工作时间 | 开发负责人 |
| 生产 | 每周 | 维护窗口 | 技术负责人+产品负责人 |

### 7.2 部署策略

| 环境 | 部署方式 | 回滚策略 | 停机时间 |
|------|----------|----------|----------|
| 开发 | 直接部署 | 手动回滚 | 允许 |
| 测试 | 蓝绿部署 | 自动回滚 | 零停机 |
| 生产 | 灰度发布 | 自动回滚 | 零停机 |

### 7.3 部署前检查

```yaml
# 部署前检查清单
pre_deployment_checks:
  development:
    - code_compiles
    - unit_tests_pass
    - lint_checks_pass
    
  staging:
    - code_compiles
    - unit_tests_pass
    - integration_tests_pass
    - lint_checks_pass
    - security_scan_pass
    - code_review_approved
    
  production:
    - code_compiles
    - unit_tests_pass
    - integration_tests_pass
    - e2e_tests_pass
    - lint_checks_pass
    - security_scan_pass
    - performance_tests_pass
    - code_review_approved
    - staging_tests_passed
    - deployment_plan_approved
    - rollback_plan_ready
```

### 7.4 部署后验证

```yaml
# 部署后验证清单
post_deployment_checks:
  development:
    - services_started
    - health_checks_pass
    - basic_functionality_test
    
  staging:
    - services_started
    - health_checks_pass
    - smoke_tests_pass
    - integration_tests_pass
    - performance_baseline_check
    
  production:
    - services_started
    - health_checks_pass
    - smoke_tests_pass
    - monitoring_metrics_normal
    - error_rate_within_threshold
    - user_feedback_positive
    - rollback_ready_if_needed
```

---

## 八、备份与恢复差异

### 8.1 备份策略

| 备份类型 | 开发环境 | 测试环境 | 生产环境 |
|----------|----------|----------|----------|
| 数据库备份 | 手动 | 每日全量 | 每小时增量 + 每日全量 |
| 配置备份 | 手动 | 每日 | 每次 |
| 代码备份 | Git | Git | Git + 镜像 |
| 日志备份 | 无 | 每周 | 每日 |

### 8.2 备份保留

| 备份类型 | 开发环境 | 测试环境 | 生产环境 |
|----------|----------|----------|----------|
| 数据库备份 | 7天 | 30天 | 90天 |
| 增量备份 | 无 | 7天 | 30天 |
| 配置备份 | 30天 | 90天 | 365天 |
| 日志备份 | 7天 | 30天 | 90天 |

### 8.3 恢复策略

| 恢复场景 | 开发环境 | 测试环境 | 生产环境 |
|----------|----------|----------|----------|
| 数据恢复 | 手动 | 手动 | 自动化 |
| 恢复时间目标(RTO) | 4小时 | 2小时 | 30分钟 |
| 恢复点目标(RPO) | 24小时 | 4小时 | 15分钟 |
| 恢复演练 | 无 | 每季度 | 每月 |

---

## 九、成本管理差异

### 9.1 资源成本

| 资源类型 | 开发环境 | 测试环境 | 生产环境 |
|----------|----------|----------|----------|
| 计算成本 | $50/月 | $200/月 | $1000+/月 |
| 存储成本 | $10/月 | $50/月 | $200+/月 |
| 网络成本 | $5/月 | $20/月 | $100+/月 |
| 第三方服务 | $0 | $100/月 | $500+/月 |

### 9.2 成本优化策略

```yaml
# 成本优化配置
cost_optimization:
  development:
    auto_scaling: disabled
    spot_instances: enabled
    resource_limits: strict
    cleanup_policy: aggressive
    
  staging:
    auto_scaling: limited
    spot_instances: partial
    resource_limits: moderate
    cleanup_policy: standard
    
  production:
    auto_scaling: full
    spot_instances: none
    resource_limits: performance_first
    cleanup_policy: conservative
    reserved_instances: yes
```

---

## 十、环境切换与同步

### 10.1 环境切换流程

```bash
# 环境切换脚本示例
#!/bin/bash

ENV=$1

case $ENV in
  development)
    export NODE_ENV=development
    export DATABASE_URL="postgresql://yyc3:dev_pass@localhost:5432/yyc3_xy_dev"
    export REDIS_URL="redis://localhost:6379/0"
    docker-compose -f docker-compose.dev.yml up -d
    ;;
    
  staging)
    export NODE_ENV=staging
    export DATABASE_URL="postgresql://yyc3:staging_pass@db-staging:5432/yyc3_xy_staging"
    export REDIS_URL="redis://:staging_pass@redis-staging:6379/0"
    docker-compose -f docker-compose.staging.yml up -d
    ;;
    
  production)
    export NODE_ENV=production
    export DATABASE_URL="postgresql://yyc3:prod_pass@db-primary:5432/yyc3_xy_prod?sslmode=require"
    export REDIS_URL="redis://:prod_pass@redis-sentinel:26379/0?sentinelMasterId=mymaster"
    docker-compose -f docker-compose.prod.yml up -d
    ;;
    
  *)
    echo "Unknown environment: $ENV"
    exit 1
    ;;
esac
```

### 10.2 数据同步策略

```yaml
# 数据同步配置
data_sync:
  development_to_staging:
    enabled: false
    method: manual_export_import
    anonymization: required
    
  staging_to_production:
    enabled: false
    method: none
    reason: security
    
  production_to_staging:
    enabled: true
    method: anonymized_snapshot
    schedule: weekly
    anonymization: strict
    data_retention: 30_days
```

---

## 十一、故障处理差异

### 11.1 故障响应级别

| 响应级别 | 开发环境 | 测试环境 | 生产环境 |
|----------|----------|----------|----------|
| P0 (严重) | 2小时 | 1小时 | 15分钟 |
| P1 (高) | 4小时 | 2小时 | 1小时 |
| P2 (中) | 1天 | 8小时 | 4小时 |
| P3 (低) | 3天 | 2天 | 1天 |

### 11.2 故障处理流程

```yaml
# 故障处理流程
incident_management:
  development:
    notification: email
    escalation: none
    postmortem: optional
    
  staging:
    notification: email+slack
    escalation: team_lead
    postmortem: recommended
    
  production:
    notification: pagerduty+slack+phone
    escalation: executive
    postmortem: required
    public_communication: if_severe
```

---

## 十二、环境配置文件示例

### 12.1 开发环境配置

```yaml
# .env.development
NODE_ENV=development
LOG_LEVEL=debug

# 服务端口
FRONTEND_PORT=1228
API_PORT=1229

# 数据库
DATABASE_URL="postgresql://yyc3:dev_pass@localhost:5432/yyc3_xy_dev"

# Redis
REDIS_URL="redis://localhost:6379/0"

# Qdrant
QDRANT_URL="http://localhost:6333"

# AI服务
AI_SERVICE_PROVIDER=mock
AI_MODEL=gpt-4-mock
AI_API_KEY=mock_key

# 前端配置
NEXT_PUBLIC_API_BASE_URL="http://localhost:1229"
NEXT_PUBLIC_WS_BASE_URL="ws://localhost:1229"
NEXT_PUBLIC_ENABLE_DEBUG_TOOLS=true
NEXT_PUBLIC_ENABLE_MOCK_DATA=true

# CORS
CORS_ORIGIN="http://localhost:1228,http://localhost:3000"

# 限流
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=60000

# 功能开关
DEBUG_MODE=true
NEW_FEATURE_ALPHA=true
NEW_FEATURE_BETA=true
EXPERIMENTAL_FEATURES=true

# 存储
STORAGE_TYPE=local
STORAGE_PATH=./storage
STORAGE_MAX_SIZE=10GB
```

### 12.2 测试环境配置

```yaml
# .env.staging
NODE_ENV=staging
LOG_LEVEL=info

# 服务端口
FRONTEND_PORT=1228
API_PORT=1229

# 数据库
DATABASE_URL="postgresql://yyc3:staging_pass@db-staging:5432/yyc3_xy_staging"

# Redis
REDIS_URL="redis://:staging_pass@redis-staging:6379/0"

# Qdrant
QDRANT_URL="http://qdrant-staging:6333"

# AI服务
AI_SERVICE_PROVIDER=openai
AI_MODEL=gpt-4
AI_API_KEY=${STAGING_OPENAI_API_KEY}

# 前端配置
NEXT_PUBLIC_API_BASE_URL="https://staging-api.yyc3.com"
NEXT_PUBLIC_WS_BASE_URL="wss://staging-api.yyc3.com"
NEXT_PUBLIC_ENABLE_DEBUG_TOOLS=true
NEXT_PUBLIC_ENABLE_MOCK_DATA=false

# CORS
CORS_ORIGIN="https://staging.yyc3.com"

# 限流
RATE_LIMIT_MAX=500
RATE_LIMIT_WINDOW=60000

# 功能开关
DEBUG_MODE=true
NEW_FEATURE_ALPHA=true
NEW_FEATURE_BETA=true
EXPERIMENTAL_FEATURES=false

# 存储
STORAGE_TYPE=s3
STORAGE_ENDPOINT=s3-staging.amazonaws.com
STORAGE_BUCKET=yyc3-staging
STORAGE_ACCESS_KEY=${STAGING_S3_ACCESS_KEY}
STORAGE_SECRET_KEY=${STAGING_S3_SECRET_KEY}
```

### 12.3 生产环境配置

```yaml
# .env.production
NODE_ENV=production
LOG_LEVEL=warn

# 服务端口
FRONTEND_PORT=1228
API_PORT=1229

# 数据库
DATABASE_URL="postgresql://yyc3:prod_pass@db-primary:5432/yyc3_xy_prod?sslmode=require"
DATABASE_READ_URL="postgresql://yyc3:prod_pass@db-replica:5432/yyc3_xy_prod?sslmode=require"

# Redis
REDIS_URL="redis://:prod_pass@redis-sentinel:26379/0?sentinelMasterId=mymaster"

# Qdrant
QDRANT_URL="http://qdrant-cluster:6333"
QDRANT_API_KEY=${PROD_QDRANT_API_KEY}

# AI服务
AI_SERVICE_PROVIDER=openai
AI_MODEL=gpt-4-turbo
AI_API_KEY=${PROD_OPENAI_API_KEY}

# 前端配置
NEXT_PUBLIC_API_BASE_URL="https://api.yyc3.com"
NEXT_PUBLIC_WS_BASE_URL="wss://api.yyc3.com"
NEXT_PUBLIC_ENABLE_DEBUG_TOOLS=false
NEXT_PUBLIC_ENABLE_MOCK_DATA=false

# CORS
CORS_ORIGIN="https://yyc3.com"

# 限流
RATE_LIMIT_MAX=1000
RATE_LIMIT_WINDOW=60000

# 功能开关
DEBUG_MODE=false
NEW_FEATURE_ALPHA=false
NEW_FEATURE_BETA=true
EXPERIMENTAL_FEATURES=false

# 存储
STORAGE_TYPE=s3
STORAGE_ENDPOINT=s3.amazonaws.com
STORAGE_BUCKET=yyc3-production
STORAGE_ACCESS_KEY=${PROD_S3_ACCESS_KEY}
STORAGE_SECRET_KEY=${PROD_S3_SECRET_KEY}
STORAGE_CDN_URL=https://cdn.yyc3.com

# 安全
ENABLE_HTTPS=true
JWT_EXPIRY=3600
ENABLE_2FA=true
```

---

## 十三、最佳实践

### 13.1 环境配置管理

1. **配置外部化**：所有配置通过环境变量注入，不硬编码
2. **配置验证**：启动时验证所有必需的环境变量
3. **配置文档化**：每个环境变量都有清晰的文档说明
4. **配置版本化**：配置变更纳入版本控制
5. **配置审计**：记录所有配置变更历史

### 13.2 环境一致性

1. **使用Docker**：确保所有环境使用相同的容器镜像
2. **配置即代码**：使用配置管理工具管理环境差异
3. **自动化部署**：使用CI/CD确保部署流程一致
4. **基础设施即代码**：使用Terraform等工具管理基础设施
5. **定期同步**：定期同步测试环境与生产环境的配置

### 13.3 安全最佳实践

1. **最小权限原则**：每个环境只授予必要的权限
2. **密钥轮换**：定期轮换所有密钥和凭据
3. **网络隔离**：严格限制环境间的网络访问
4. **数据脱敏**：测试环境使用脱敏的生产数据
5. **安全审计**：定期进行安全审计和渗透测试

---

## 十四、相关文档

- [部署架构实施文档](./01-YYC3-XY-架构类-部署架构实施文档.md)
- [CI_CD流水线架构文档](./02-YYC3-XY-架构类-CI_CD流水线架构文档.md)
- [灰度发布架构设计文档](./04-YYC3-XY-架构类-灰度发布架构设计文档.md)
- [微服务架构设计文档](../YYC3-XY-架构设计/架构类/01-YYC3-XY-架构类-微服务架构设计文档.md)
- [API网关设计文档](../YYC3-XY-架构设计/架构类/02-YYC3-XY-架构类-API网关设计文档.md)
- [数据架构需求规划文档](../../YYC3-XY-需求规划/架构类/03-YYC3-XY-架构类-数据架构需求规划文档.md)
- [需求阶段架构可行性分析报告](../../YYC3-XY-需求规划/架构类/02-YYC3-XY-架构类-需求阶段架构可行性分析报告.md)

---

<div align="center">

> 「***YanYuCloudCube***」
> 「***<admin@0379.email>***」
> 「***Words Initiate Quadrants, Language Serves as Core for the Future***」
> 「***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***」

</div>
