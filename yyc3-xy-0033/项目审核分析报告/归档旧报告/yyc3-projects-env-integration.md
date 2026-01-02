# YYC³ 项目环境配置整合文档

> **整合日期**: 2026-01-02
> **项目范围**: yyc3-xy-01, yyc3-xy-02, yyc3-xy-03, yyc3-xy-05
> **用途**: 统一管理所有项目的环境配置，便于对比和维护

---

## 📋 目录

- [共享配置](#共享配置)
- [项目特定配置](#项目特定配置)
- [数据库配置对比](#数据库配置对比)
- [API配置对比](#api配置对比)
- [部署配置对比](#部署配置对比)

---

## 🔑 共享配置

### BigModel API配置 (智谱AI)
所有项目共享相同的API密钥：

```bash
NEXT_PUBLIC_BIGMODEL_API_KEY=752c70aef25c45e095fbb40bad0c0b39.HBG8pCXJlk4pmWwd
```

**用途**: 作业批改和语音服务

---

## 📁 项目特定配置

### yyc3-xy-01

#### 本地开发配置 (.env.local)
```bash
# BigModel API配置 (智谱AI) - 用于作业批改和语音服务
NEXT_PUBLIC_BIGMODEL_API_KEY=752c70aef25c45e095fbb40bad0c0b39.HBG8pCXJlk4pmWwd

# PostgreSQL 数据库配置
DB_HOST=192.168.3.45
DB_PORT=5432
DB_USER=yyc3
DB_PASS=yyc3_my
DB_NAME=yyc3_my
DATABASE_URL=postgresql://yyc3:yyc3_my@192.168.3.45:5432/yyc3_my
```

#### Docker部署配置 (.env.docker)
```bash
# 数据库配置
POSTGRES_DB=yyc3_ai
POSTGRES_USER=yyc3
POSTGRES_PASSWORD=your_secure_postgres_password
POSTGRES_PORT=5432
DATABASE_URL=postgresql://yyc3:your_secure_postgres_password@postgres:5432/yyc3_ai

# Redis缓存配置
REDIS_PORT=6379
REDIS_PASSWORD=your_secure_redis_password
REDIS_URL=redis://:your_secure_redis_password@redis:6379

# AI服务配置
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
GOOGLE_AI_API_KEY=your_google_ai_api_key
```

---

### yyc3-xy-02

#### 本地开发配置 (.env.local)
```bash
# BigModel API配置 (智谱AI) - 用于作业批改和语音服务
NEXT_PUBLIC_BIGMODEL_API_KEY=752c70aef25c45e095fbb40bad0c0b39.HBG8pCXJlk4pmWwd

# PostgreSQL 数据库配置
DB_HOST=192.168.3.45
DB_PORT=5432
DB_USER=yyc3
DB_PASS=yyc3_my
DB_NAME=yyc3_my
DATABASE_URL=postgresql://yyc3:yyc3_my@192.168.3.45:5432/yyc3_my
```

#### Docker部署配置 (.env.docker)
```bash
# 数据库配置
POSTGRES_DB=yyc3_ai
POSTGRES_USER=yyc3
POSTGRES_PASSWORD=your_secure_postgres_password
POSTGRES_PORT=5432
DATABASE_URL=postgresql://yyc3:your_secure_postgres_password@postgres:5432/yyc3_ai

# Redis缓存配置
REDIS_PORT=6379
REDIS_PASSWORD=your_secure_redis_password
REDIS_URL=redis://:your_secure_redis_password@redis:6379

# AI服务配置
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
GOOGLE_AI_API_KEY=your_google_ai_api_key
```

---

### yyc3-xy-03

#### 本地开发配置 (.env.local)
```bash
# SQLite数据库文件路径
DATABASE_URL="./yyc3_database.db"
# 数据库连接池配置
DATABASE_POOL_SIZE=10
DATABASE_CONNECTION_TIMEOUT=30000

# BigModel API配置 (智谱AI)
NEXT_PUBLIC_BIGMODEL_API_KEY=752c70aef25c45e095fbb40bad0c0b39.HBG8pCXJlk4pmWwd
```

#### Docker部署配置 (.env.docker)
```bash
# 数据库配置
POSTGRES_DB=yyc3_ai
POSTGRES_USER=yyc3
POSTGRES_PASSWORD=your_secure_postgres_password
POSTGRES_PORT=5432
DATABASE_URL=postgresql://yyc3:your_secure_postgres_password@postgres:5432/yyc3_ai

# Redis缓存配置
REDIS_PORT=6379
REDIS_PASSWORD=your_secure_redis_password
REDIS_URL=redis://:your_secure_redis_password@redis:6379

# AI服务配置
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
GOOGLE_AI_API_KEY=your_google_ai_api_key
```

---

### yyc3-xy-05

#### 本地开发配置 (.env.local)
```bash
# 其他AI服务配置
NEXT_PUBLIC_AI_API_URL=https://api.0379.love/v1

# BigModel API配置 (智谱AI)
NEXT_PUBLIC_BIGMODEL_API_KEY=752c70aef25c45e095fbb40bad0c0b39.HBG8pCXJlk4pmWwd
```

#### Docker部署配置 (.env.docker)
```bash
# 数据库配置
POSTGRES_DB=yyc3_ai
POSTGRES_USER=yyc3
POSTGRES_PASSWORD=your_secure_postgres_password
POSTGRES_PORT=5432
DATABASE_URL=postgresql://yyc3:your_secure_postgres_password@postgres:5432/yyc3_ai

# Redis缓存配置
REDIS_PORT=6379
REDIS_PASSWORD=your_secure_redis_password
REDIS_URL=redis://:your_secure_redis_password@redis:6379

# AI服务配置
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
GOOGLE_AI_API_KEY=your_google_ai_api_key
```

---

## 🗄️ 数据库配置对比

| 项目 | 本地数据库 | Docker数据库 | 数据库类型 |
|------|-----------|-------------|-----------|
| yyc3-xy-01 | PostgreSQL (192.168.3.45) | PostgreSQL (postgres) | PostgreSQL |
| yyc3-xy-02 | PostgreSQL (192.168.3.45) | PostgreSQL (postgres) | PostgreSQL |
| yyc3-xy-03 | SQLite (本地文件) | PostgreSQL (postgres) | SQLite/PostgreSQL |
| yyc3-xy-05 | 未配置 | PostgreSQL (postgres) | PostgreSQL |

### 数据库连接详情

#### yyc3-xy-01 & yyc3-xy-02 (本地)
```bash
DB_HOST=192.168.3.45
DB_PORT=5432
DB_USER=yyc3
DB_PASS=yyc3_my
DB_NAME=yyc3_my
DATABASE_URL=postgresql://yyc3:yyc3_my@192.168.3.45:5432/yyc3_my
```

#### yyc3-xy-03 (本地)
```bash
DATABASE_URL="./yyc3_database.db"
DATABASE_POOL_SIZE=10
DATABASE_CONNECTION_TIMEOUT=30000
```

#### 所有项目 (Docker)
```bash
POSTGRES_DB=yyc3_ai
POSTGRES_USER=yyc3
POSTGRES_PASSWORD=your_secure_postgres_password
POSTGRES_PORT=5432
DATABASE_URL=postgresql://yyc3:your_secure_postgres_password@postgres:5432/yyc3_ai
```

---

## 🔌 API配置对比

### 共享API配置
所有项目共享以下API密钥：
- **BigModel API**: 752c70aef25c45e095fbb40bad0c0b39.HBG8pCXJlk4pmWwd

### 项目特定API配置

#### yyc3-xy-05
```bash
NEXT_PUBLIC_AI_API_URL=https://api.0379.love/v1
```

### AI服务配置模板 (所有项目)
```bash
# OpenAI配置
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-3.5-turbo
OPENAI_MAX_TOKENS=2048
OPENAI_TEMPERATURE=0.7

# Anthropic配置
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Google AI配置
GOOGLE_AI_API_KEY=your_google_ai_api_key_here

# 百度AI配置
BAIDU_AI_API_KEY=your_baidu_ai_api_key_here
BAIDU_AI_SECRET_KEY=your_baidu_ai_secret_key_here

# AI功能开关
AI_ENABLED=true
AI_CHAT_ENABLED=true
AI_IMAGE_GENERATION_ENABLED=false
AI_VOICE_RECOGNITION_ENABLED=false
```

---

## 🚀 部署配置对比

### Redis配置 (所有项目Docker)
```bash
REDIS_PORT=6379
REDIS_PASSWORD=your_secure_redis_password
REDIS_URL=redis://:your_secure_redis_password@redis:6379
```

### 后端服务配置 (所有项目)
```bash
# Server Configuration
NODE_ENV=development
PORT=3000
HOST=localhost

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
```

---

## 📊 配置差异总结

### 🔴 关键差异
1. **数据库类型**: yyc3-xy-03使用SQLite本地文件，其他项目使用PostgreSQL
2. **API端点**: yyc3-xy-05配置了额外的AI API URL (https://api.0379.love/v1)
3. **本地数据库连接**: yyc3-xy-01和yyc3-xy-02使用相同的PostgreSQL服务器(192.168.3.45)

### ✅ 共同配置
1. **BigModel API密钥**: 所有项目使用相同的API密钥
2. **Docker部署**: 所有项目使用相同的Docker配置模板
3. **Redis配置**: 所有项目使用相同的Redis配置
4. **AI服务**: 所有项目支持相同的AI服务提供商

---

## 🔧 配置优化建议

### 1. 统一数据库配置
建议所有项目统一使用PostgreSQL数据库，便于维护和数据迁移。

### 2. 环境变量管理
建议使用环境变量管理工具（如dotenv-cli）统一管理不同环境的配置。

### 3. API密钥安全
建议将API密钥存储在密钥管理服务中，避免硬编码在配置文件中。

### 4. 配置验证
建议添加配置验证机制，确保所有必需的环境变量都已正确配置。

---

## 📝 配置文件清单

### yyc3-xy-01
- `.env.local` - 本地开发配置
- `.env.example` - 环境变量模板
- `.env.docker` - Docker部署配置
- `backend/.env.example` - 后端环境模板

### yyc3-xy-02
- `.env.local` - 本地开发配置
- `.env.example` - 环境变量模板
- `.env.docker` - Docker部署配置
- `backend/.env.example` - 后端环境模板

### yyc3-xy-03
- `.env.local` - 本地开发配置
- `.env.example` - 环境变量模板
- `.env.docker` - Docker部署配置
- `backend/.env.example` - 后端环境模板

### yyc3-xy-05
- `.env.local` - 本地开发配置
- `.env.example` - 环境变量模板
- `.env.docker` - Docker部署配置
- `backend/.env.example` - 后端环境模板

---

<div align="center">

> **YYC³ Team**
> **YanYuCloudCube**
> **言启象限 | 语枢未来**

</div>
