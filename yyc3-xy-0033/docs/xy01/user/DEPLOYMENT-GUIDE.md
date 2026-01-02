# YYC³ AI小语智能成长守护系统 - 完整部署指南

## 📋 部署概述

YYC³ AI小语智能成长守护系统采用现代化的容器化部署方案，支持多种部署环境：

- 🚀 **Vercel** (推荐用于生产环境)
- 🐳 **Docker Compose** (用于本地开发和私有部署)
- ☁️ **云服务器** (阿里云ECS、腾讯云等)
- 📦 **静态导出** (用于CDN部署)

## 🏗️ 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                        用户层                                │
├─────────────────────────────────────────────────────────────┤
│                    CDN / Nginx                              │
├─────────────────────────────────────────────────────────────┤
│                  Next.js 应用                                │
├─────────────────────────────────────────────────────────────┤
│  Redis 缓存  │  PostgreSQL 数据库  │  AI API 服务         │
├─────────────────────────────────────────────────────────────┤
│                   监控 & 日志                                │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 环境变量配置

### 生产环境必需变量

```bash
# 应用配置
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_API_URL=https://api.yyc3.ai
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_BUILD_TIME=2024-01-01T00:00:00Z

# 第三方服务
OPENAI_API_KEY=sk-xxx
AZURE_SPEECH_KEY=xxx
AZURE_SPEECH_REGION=xxx
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# 监控和分析
VERCEL_ANALYTICS_ID=your_analytics_id
SENTRY_DSN=your_sentry_dsn

# 数据库配置
DATABASE_URL=postgresql://user:password@host:port/database
REDIS_URL=redis://host:port
```

## 🚀 Vercel 部署 (推荐)

### 快速部署

1. **连接 Vercel 账户**
   ```bash
   npx vercel login
   ```

2. **部署项目**
   ```bash
   npx vercel --prod
   ```

3. **环境变量配置**
   在 Vercel 控制台中设置以下环境变量：
   ```
   NEXT_PUBLIC_ENVIRONMENT=production
   NEXT_PUBLIC_API_URL=https://api.yyc3.ai
   ANALYTICS_ID=your_analytics_id
   ```

### 自动部署

项目已配置 GitHub Actions，推送到 `main` 分支会自动触发部署。

## 🐳 Docker Compose 部署

### 环境要求

- Docker 20.10+
- Docker Compose 3.8+
- 至少 4GB 内存
- 至少 10GB 磁盘空间

### 快速启动

1. **克隆项目**
   ```bash
   git clone https://github.com/YY-Nexus/yyc3-xy-03.git
   cd yyc3-xy-03
   ```

2. **配置环境变量**
   ```bash
   cp .env.example .env.local
   # 编辑 .env.local 文件
   ```

3. **启动服务**
   ```bash
   docker-compose up -d
   ```

4. **访问应用**
   - 主应用: http://localhost:3000
   - 监控面板: http://localhost:3001 (Grafana)
   - 日志分析: http://localhost:5601 (Kibana)

### 服务管理

```bash
# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f app

# 重启服务
docker-compose restart app

# 停止所有服务
docker-compose down

# 更新服务
docker-compose pull
docker-compose up -d
```

## ☁️ 云服务器部署

### 阿里云 ECS 部署

1. **服务器要求**
   - CPU: 2核心以上
   - 内存: 4GB以上
   - 磁盘: 40GB以上 SSD
   - 系统: Ubuntu 20.04 LTS

2. **安装依赖**
   ```bash
   # 更新系统
   sudo apt update && sudo apt upgrade -y

   # 安装 Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh

   # 安装 Docker Compose
   sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose

   # 安装 Bun
   curl -fsSL https://bun.sh/install | bash
   ```

3. **部署应用**
   ```bash
   # 克隆项目
   git clone https://github.com/YY-Nexus/yyc3-xy-03.git
   cd yyc3-xy-03

   # 配置 Nginx
   sudo apt install nginx -y
   sudo cp nginx/nginx.conf /etc/nginx/sites-available/yyc3
   sudo ln -s /etc/nginx/sites-available/yyc3 /etc/nginx/sites-enabled/
   sudo nginx -t && sudo systemctl reload nginx

   # 启动 Docker 服务
   docker-compose up -d
   ```

### 腾讯云部署

类似阿里云 ECS 部署步骤，使用 TencentCloud 镜像源加速。

## 📦 静态导出部署

### 生成静态文件

```bash
# 配置 next.config.js
output: 'export'

# 构建静态文件
bun run build
bun run export
```

### 部署到 CDN

1. **阿里云 OSS**
   ```bash
   # 上传到 OSS
   ossutil cp -r ./out oss://your-bucket/
   ```

2. **腾讯云 COS**
   ```bash
   # 使用 COSCLI 上传
   coscli sync ./out cos://your-bucket/
   ```

## 🔍 监控和日志

### 应用监控

- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3001 (admin/admin123)
- **应用健康检查**: http://localhost:3000/api/health

### 日志管理

- **Elasticsearch**: http://localhost:9200
- **Kibana**: http://localhost:5601
- **Logstash**: 接收应用日志端口 5044

### 性能监控

```bash
# 查看容器资源使用
docker stats

# 查看磁盘使用
df -h

# 查看内存使用
free -h
```

## 🔒 安全配置

### SSL/TLS 证书

1. **Let's Encrypt 自动证书**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yyc3.app
   ```

2. **手动上传证书**
   ```bash
   # 将证书文件放入 nginx/ssl/ 目录
   chmod 600 nginx/ssl/*.key
   chmod 644 nginx/ssl/*.crt
   ```

### 防火墙配置

```bash
# 配置 UFW 防火墙
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## 🔄 更新和维护

### 应用更新

```bash
# 拉取最新代码
git pull origin main

# 重新构建和部署
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### 数据备份

```bash
# 数据库备份
docker-compose exec postgres pg_dump -U postgres yyc3_ai > backup_$(date +%Y%m%d).sql

# Redis 备份
docker-compose exec redis redis-cli BGSAVE
```

### 日志清理

```bash
# 清理 Docker 日志
sudo docker system prune -f

# 清理应用日志
find ./logs -name "*.log" -mtime +7 -delete
```

## 🚨 故障排除

### 常见问题

1. **端口冲突**
   ```bash
   # 检查端口占用
   sudo netstat -tulpn | grep :3000
   ```

2. **内存不足**
   ```bash
   # 增加 swap 空间
   sudo fallocate -l 2G /swapfile
   sudo chmod 600 /swapfile
   sudo mkswap /swapfile
   sudo swapon /swapfile
   ```

3. **磁盘空间不足**
   ```bash
   # 清理 Docker 镜像
   docker system prune -a
   ```

### 调试命令

```bash
# 查看详细日志
docker-compose logs --tail=100 app

# 进入容器调试
docker-compose exec app sh

# 检查服务健康状态
curl http://localhost:3000/api/health
```

## 📞 技术支持

如遇到部署问题，请：

1. 查看本文档的故障排除部分
2. 检查 GitHub Issues
3. 联系技术团队：support@yyc3.ai

## 🎯 上线检查清单

- [ ] 所有环境变量已配置
- [ ] 数据库Schema已初始化
- [ ] 本地构建测试通过
- [ ] API接口功能正常
- [ ] AI对话功能可用
- [ ] 语音功能测试通过
- [ ] 移动端适配良好
- [ ] 性能指标达标
- [ ] 错误边界正常工作
- [ ] 404/500页面正常
- [ ] SSL证书已配置
- [ ] 域名解析正常
- [ ] 监控系统已启用
- [ ] 备份策略已设置
- [ ] 可访问性测试通过
- [ ] PWA功能正常
- [ ] 国际化切换正常

---

**🎉 恭喜！YYC³ AI小语智能成长守护系统已成功部署！**