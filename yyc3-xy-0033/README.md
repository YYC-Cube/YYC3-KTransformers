<div align="center">

# YYC³ 智能插拔式移动AI系统

![YYC³ Banner](public/git_1800_400-5.png)

**Intelligent Pluggable Mobile AI System - 0-3岁儿童智能成长守护体系**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/YY-Nexus/yyc3-xy-03)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)](https://nodejs.org/)
[![Bun](https://img.shields.io/badge/Bun-1.1.38-black.svg)](https://bun.sh/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2.35-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)

**言启象限 | 语枢未来**
**Words Initiate Quadrants, Language Serves as Core for the Future**

</div>

---

## 📋 目录

- [项目概述](#-项目概述)
- [核心特性](#-核心特性)
- [技术架构](#-技术架构)
- [快速开始](#-快速开始)
- [文档索引](#-文档索引)
- [开发指南](#-开发指南)
- [部署指南](#-部署指南)
- [贡献指南](#-贡献指南)
- [许可证](#-许可证)
- [联系我们](#-联系我们)

---

## 🎯 项目概述

YYC³ (YanYuCloudCube) 智能插拔式移动AI系统是一个专为0-3岁儿童设计的全方位智能成长守护体系。本项目基于**「五高五标五化」**核心理念构建，融合医学、心理学、教育学多领域知识，为每个孩子提供个性化、智能化的成长陪伴方案。

### 核心理念

**五高 (Five Highs)**:

- 高前瞻性 - 预判发展阶段，提前规划成长路径
- 高整合性 - 融合医学/心理学/教育学多领域知识
- 高个性化 - 适配每个孩子的独特发展节奏
- 高情感价值 - 关注亲子情感联结，记录温暖瞬间
- 高实操性 - 提供具体可执行的育儿指导方案

**五标 (Five Standards)**:

- 数据标准化 - 参考WHO等权威机构发展标准
- 发展标准化 - 基于发展心理学权威理论体系
- 安全标准化 - 遵循儿科安全规范与隐私保护
- 记录标准化 - 采用统一格式的成长记录模板
- 评估标准化 - 使用科学的评估工具与指标体系

**五化 (Five Transformations)**:

- 阶段化 - 按0-22岁划分为多个发展阶段
- 模块化 - 将成长体系分解为可复用功能模块
- 场景化 - 针对具体育儿场景提供解决方案
- 工具化 - 提供实用的记录工具与评估量表
- 故事化 - 将成长记录转化为温暖的故事叙述

---

## ✨ 核心特性

### 🤖 AI智能陪伴

- **多模态交互**: 支持语音、图像、文本多模态AI交互
- **智能对话**: 基于GPT-4等大语言模型的智能对话系统
- **情感识别**: 实时识别儿童情绪状态，提供针对性陪伴
- **个性化推荐**: 基于儿童发展数据智能推荐活动内容

### 📊 成长记录与分析

- **智能相册**: AI自动分类和标记成长照片
- **发展曲线**: 可视化展示儿童各项能力发展轨迹
- **里程碑追踪**: 自动检测和提醒重要发展里程碑
- **数据可视化**: 多维度图表展示成长数据

### 🎓 教育与课程

- **AI课程推荐**: 根据儿童发展阶段智能推荐课程
- **作业辅助**: AI智能作业辅导和答疑
- **阅读陪伴**: 智能绘本阅读和互动
- **活动建议**: 适龄活动推荐和指导

### 🎨 主题与个性化

- **角色系统**: 多个可爱的AI角色陪伴成长
- **生日主题**: 个性化生日庆祝和祝福系统
- **主题定制**: 可自定义界面主题和角色风格
- **Q版角色**: 可爱的Q版角色设计

### 🔒 安全与隐私

- **COPPA合规**: 符合儿童在线隐私保护法
- **家长控制**: 完善的家长权限管理
- **数据加密**: 敏感数据端到端加密
- **安全监控**: 实时安全监控和告警

### 📱 移动端优化

- **PWA支持**: 渐进式Web应用，支持离线使用
- **响应式设计**: 完美适配各种设备尺寸
- **性能优化**: 极致的加载和交互性能
- **无障碍访问**: 符合WCAG无障碍标准

---

## 🏗️ 技术架构

### 前端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| **Next.js** | 14.2.35 | React框架，SSR/SSG支持 |
| **React** | 19.2.3 | UI框架 |
| **TypeScript** | 5.0 | 类型安全 |
| **Tailwind CSS** | 4.1.9 | 样式框架 |
| **Radix UI** | Latest | UI组件库 |
| **Framer Motion** | 12.23.25 | 动画库 |
| **Redux Toolkit** | 2.11.2 | 状态管理 |
| **TanStack Query** | 5.56.2 | 数据获取和缓存 |
| **next-intl** | 4.6.1 | 国际化 |

### 后端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| **Hono** | 4.6.3 | 高性能Web框架 |
| **Node.js** | >=18.0.0 | 运行时环境 |
| **Bun** | 1.1.38 | 高性能JavaScript运行时 |
| **PostgreSQL** | Latest | 关系型数据库 |
| **Redis** | Latest | 缓存和会话管理 |
| **Socket.IO** | 4.8.0 | 实时通信 |

### AI技术栈

| 技术 | 用途 |
|------|------|
| **OpenAI GPT-4** | 大语言模型 |
| **AI SDK** | AI集成框架 |
| **TensorFlow.js** | 机器学习模型 |
| **Universal Sentence Encoder** | 文本嵌入 |

### DevOps工具

| 工具 | 用途 |
|------|------|
| **Docker** | 容器化部署 |
| **Docker Compose** | 多容器编排 |
| **GitHub Actions** | CI/CD流水线 |
| **ESLint** | 代码质量检查 |
| **Prettier** | 代码格式化 |
| **TypeScript** | 类型检查 |

---

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- Bun >= 1.0.0
- PostgreSQL >= 14
- Redis >= 6

### 安装步骤

1. **克隆仓库**

```bash
git clone https://github.com/YY-Nexus/yyc3-xy-03.git
cd yyc3-xy-03
```

1. **安装依赖**

```bash
bun install
```

1. **配置环境变量**

复制 `.env.example` 到 `.env` 并配置相关变量：

```bash
cp .env.example .env
```

1. **初始化数据库**

```bash
bun run backend/src/config/migrator.ts
```

1. **启动开发服务器**

```bash
bun run dev:next
```

应用将在 <http://localhost:1228> 启动

### 可用脚本

| 命令 | 说明 |
|------|------|
| `bun run dev:next` | 启动Next.js开发服务器 |
| `bun run build:next` | 构建生产版本 |
| `bun run start:next` | 启动生产服务器 |
| `bun run test` | 运行测试 |
| `bun run lint` | 代码质量检查 |
| `bun run type-check` | TypeScript类型检查 |

---

## 📚 文档索引

### 📖 核心文档

- [项目总览](docs/00-PROJECT_OVERVIEW.md) - 项目整体介绍
- [技术栈说明](docs/01-TECH_STACK.md) - 技术选型详解
- [API文档](docs/02-API_REFERENCE.md) - API接口文档
- [核心模块](docs/03-CORE_MODULES.md) - 核心功能模块说明
- [部署指南](docs/03-DEPLOYMENT.md) - 部署和运维指南

### 🏗️ 架构文档

- [总体架构设计](docs/YYC3-XY-架构类/01-YYC3-XY-架构类-总体架构设计文档.md)
- [微服务架构](docs/YYC3-XY-架构类/02-YYC3-XY-架构类-微服务架构设计文档.md)
- [AI服务集成](docs/YYC3-XY-架构类/03-YYC3-XY-架构类-AI服务集成架构文档.md)
- [前端架构](docs/YYC3-XY-架构类/04-YYC3-XY-架构类-前端架构设计文档.md)
- [接口架构](docs/YYC3-XY-架构类/05-YYC3-XY-架构类-接口架构设计文档.md)
- [数据架构](docs/YYC3-XY-架构类/06-YYC3-XY-架构类-数据架构详细设计文档.md)
- [安全架构](docs/YYC3-XY-架构类/07-YYC3-XY-架构类-安全架构设计文档.md)
- [智能架构](docs/YYC3-XY-架构类/08-YYC3-XY-架构类-智能架构设计文档.md)
- [部署架构](docs/YYC3-XY-架构类/09-YYC3-XY-架构类-部署架构设计文档.md)
- [监控架构](docs/YYC3-XY-架构类/10-YYC3-XY-架构类-监控架构设计文档.md)
- [UI/UX设计](docs/YYC3-XY-架构类/11-YYC3-XY-架构类-小语AI应用UI-UX全量设计规划文档.md)

### 🔒 安全文档

- [安全架构](docs/SECURITY/01-SECURITY_ARCHITECTURE.md)
- [儿童安全保护](docs/SECURITY/02-CHILD_SAFETY_PROTECTION.md)
- [数据隐私政策](docs/SECURITY/03-DATA_PRIVACY_POLICY.md)
- [安全监控](docs/SECURITY/06-SECURITY_MONITORING.md)
- [COPPA合规](docs/COMPLIANCE/04-COPPA_COMPLIANCE.md)

### 🧪 测试文档

- [测试策略](docs/TESTING/01-TESTING_STRATEGY.md)
- [儿童安全测试](docs/TESTING/07-CHILD_SAFETY_TESTING.md)

### 👥 用户指南

- [家长控制](docs/USER_GUIDES/PARENTAL_CONTROLS.md)

### 📋 开发文档

- [开发环境搭建](docs/DEVELOPMENT/01-SETUP_GUIDE.md)
- [代码规范](docs/DEVELOPMENT/02-CODE_STANDARDS.md)
- [生产部署](docs/DEPLOYMENT/01-PRODUCTION_GUIDE.md)

---

## 👨‍💻 开发指南

### 代码规范

本项目遵循YYC³团队标准化规范：

- **命名规范**: 文件使用kebab-case，组件使用PascalCase，函数使用camelCase
- **注释规范**: 所有文件必须包含标准文件头注释
- **提交规范**: 遵循Conventional Commits规范
- **代码风格**: 使用ESLint和Prettier统一代码风格

### 分支策略

```
main (生产)
├── develop (开发)
│   ├── feature/xxx (功能分支)
│   ├── bugfix/xxx (Bug修复)
│   └── hotfix/xxx (紧急修复)
└── release/vx.x.x (发布分支)
```

### 提交规范

```
<type>[optional scope]: <description>

[optional body]

[optional footer]
```

类型：

- `feat`: 新功能
- `fix`: Bug修复
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具变动

### 测试

```bash
# 运行所有测试
bun run test

# 运行特定测试文件
bun test --pattern userService.test.ts

# 运行测试并生成覆盖率报告
bun test --coverage
```

---

## 🚢 部署指南

### Docker部署

1. **构建镜像**

```bash
docker build -t yyc3-xy-ai:latest .
```

1. **使用Docker Compose启动**

```bash
docker-compose up -d
```

1. **查看日志**

```bash
docker-compose logs -f
```

### 生产环境部署

详细部署指南请参考：[生产部署指南](docs/DEPLOYMENT/01-PRODUCTION_GUIDE.md)

### 环境变量

| 变量名 | 说明 | 必填 |
|--------|------|------|
| `DATABASE_URL` | PostgreSQL数据库连接字符串 | 是 |
| `REDIS_URL` | Redis连接字符串 | 是 |
| `OPENAI_API_KEY` | OpenAI API密钥 | 是 |
| `NEXTAUTH_SECRET` | NextAuth密钥 | 是 |
| `NEXTAUTH_URL` | 应用URL | 是 |

---

## 🤝 贡献指南

我们欢迎所有形式的贡献！请阅读 [贡献指南](docs/04-CONTRIBUTING.md) 了解详情。

### 贡献流程

1. Fork本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启Pull Request

### 代码审查

所有Pull Request都需要经过代码审查，确保符合项目规范和质量标准。

---

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

---

## 📞 联系我们

**YYC³ Team**

- **Email**: [admin@0379.email](mailto:admin@0379.email)
- **GitHub**: [https://github.com/YY-Nexus/yyc3-xy-03](https://github.com/YY-Nexus/yyc3-xy-03)
- **Issues**: [GitHub Issues](https://github.com/YY-Nexus/yyc3-xy-03/issues)

---

<div align="center">

## 「YanYuCloudCube」

### 万象归元于云枢 | 深栈智启新纪元

### All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence

Made with ❤️ by YYC³ Team

</div>
