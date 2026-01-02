/**
 * @file YYC3-XY快速入门指南
 * @description YYC3-XY小语AI智能成长守护系统的快速入门指南，帮助新用户快速上手项目
 * @module YYC3-XY
 * @author YYC³
 * @version 1.0.0
 * @created 2025-12-29
 * @updated 2025-12-29
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

---

# YYC3-XY 快速入门指南

> ***YanYuCloudCube***
> **标语**：言启象限 | 语枢未来
> ***Words Initiate Quadrants, Language Serves as Core for the Future***
> **标语**：万象归元于云枢 | 深栈智启新纪元
> ***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***

---

## 文档信息

- **文件名称**: YYC3-XY-快速入门.md
- **文档类型**: 通用类
- **创建日期**: 2025-12-29
- **版本号**: V1.0
- **文档状态**: 已发布

---


## 文档概述

本文档遵循 YYC³-XY 项目"五高五标五化"架构原则，提供通用类相关的详细说明和指导。

### 五高五标五化原则体现

**五高原则：**
- **高可用性** - 确保系统稳定可靠运行
- **高性能** - 优化系统响应速度和吞吐量
- **高安全** - 保障数据和系统安全
- **高扩展** - 支持系统水平扩展
- **高可维护** - 提高代码和系统可维护性

**五标体系：**
- **数据标准化** - 统一数据格式和接口标准
- **流程标准化** - 建立标准化工作流程
- **文档标准化** - 遵循统一的文档规范
- **测试标准化** - 实施标准化测试流程
- **部署标准化** - 采用标准化部署方案

**五化架构：**
- **流程化** - 将工作转化为可执行流程
- **文档化** - 完整记录技术方案和实施细节
- **工具化** - 提供自动化工具支持
- **数字化** - 基于数据进行决策
- **生态化** - 构建完整的技术生态


## 目录


## 📋 目录

- [前言](#前言)
- [环境准备](#环境准备)
- [项目安装](#项目安装)
- [快速启动](#快速启动)
- [核心功能体验](#核心功能体验)
- [开发指南](#开发指南)
- [常见问题](#常见问题)
- [进阶学习](#进阶学习)
- [相关资源](#相关资源)

---

## 前言

欢迎来到YYC3-XY（小语AI）项目！本指南将帮助您在15分钟内快速搭建开发环境并运行项目。

### 本指南适合

- ✅ 新加入项目的开发者
- ✅ 想要快速了解项目的技术人员
- ✅ 需要本地部署测试的开发者
- ✅ 想要贡献代码的社区开发者

### 预计时间

- 环境准备：5分钟
- 项目安装：3分钟
- 快速启动：2分钟
- 功能体验：5分钟

---

## 环境准备

### 必需软件

| 软件 | 版本要求 | 下载地址 | 用途 |
|------|---------|---------|------|
| Node.js | >= 20.x | https://nodejs.org/ | JavaScript运行时 |
| npm | >= 9.x | 随Node.js安装 | 包管理器 |
| Git | >= 2.x | https://git-scm.com/ | 版本控制 |
| Docker | >= 24.x | https://www.docker.com/ | 容器化部署 |
| PostgreSQL | >= 15.x | https://www.postgresql.org/ | 主数据库 |
| Redis | >= 7.x | https://redis.io/ | 缓存服务 |

### 可选软件

| 软件 | 版本要求 | 下载地址 | 用途 |
|------|---------|---------|------|
| VS Code | latest | https://code.visualstudio.com/ | 代码编辑器 |
| Postman | latest | https://www.postman.com/ | API测试 |
| pgAdmin | latest | https://www.pgadmin.org/ | 数据库管理 |
| RedisInsight | latest | https://redis.com/redis-enterprise/redis-insight/ | Redis管理 |

### 环境检查

运行以下命令检查环境是否就绪：

```bash
# 检查Node.js版本
node --version

# 检查npm版本
npm --version

# 检查Git版本
git --version

# 检查Docker版本
docker --version

# 检查PostgreSQL版本
psql --version

# 检查Redis版本
redis-cli --version
```

### 推荐VS Code插件

安装以下VS Code插件以提升开发体验：

- **ESLint** - JavaScript/TypeScript代码检查
- **Prettier** - 代码格式化
- **TypeScript Importer** - 自动导入TypeScript类型
- **Tailwind CSS IntelliSense** - Tailwind CSS智能提示
- **Prisma** - Prisma ORM支持
- **GitLens** - Git增强功能
- **Thunder Client** - API测试工具

---

## 项目安装

### 1. 克隆项目

```bash
# 克隆项目仓库
git clone https://github.com/YY-Nexus/yyc3-xy-02.git

# 进入项目目录
cd yyc3-xy-02
```

### 2. 安装依赖

```bash
# 安装项目依赖
npm install

# 验证依赖安装
npm list --depth=0
```

### 3. 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑环境变量文件
# 使用你喜欢的编辑器打开.env文件
```

**必需的环境变量配置**：

```bash
# 应用配置
NODE_ENV=development
PORT=1229
APP_NAME=YYC3-XY

# 数据库配置
DATABASE_URL=postgresql://user:password@localhost:5432/yyc3_xy
REDIS_URL=redis://localhost:6379

# AI服务配置
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key

# 认证配置
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# 前端配置
NEXT_PUBLIC_API_URL=http://localhost:1229
```

### 4. 初始化数据库

```bash
# 使用Docker启动PostgreSQL和Redis
docker-compose up -d postgres redis

# 等待数据库启动（约10秒）
sleep 10

# 运行数据库迁移
npm run db:migrate

# 填充初始数据
npm run db:seed
```

### 5. 验证安装

```bash
# 运行类型检查
npm run typecheck

# 运行代码检查
npm run lint

# 运行测试
npm run test
```

---

## 快速启动

### 启动开发服务器

```bash
# 启动所有服务（前端+后端+数据库）
npm run dev

# 或者分别启动
npm run dev:frontend  # 仅启动前端
npm run dev:backend   # 仅启动后端
npm run dev:db        # 仅启动数据库
```

### 访问应用

启动成功后，可以通过以下地址访问：

| 服务 | 地址 | 说明 |
|------|------|------|
| 前端应用 | http://localhost:3000 | Next.js前端应用 |
| 后端API | http://localhost:1229 | 后端API服务 |
| API文档 | http://localhost:1229/api/docs | Swagger API文档 |
| 数据库 | localhost:5432 | PostgreSQL数据库 |
| Redis | localhost:6379 | Redis缓存服务 |

### 停止服务

```bash
# 停止所有服务
npm run stop

# 停止数据库服务
docker-compose down
```

---

## 核心功能体验

### 1. 用户注册与登录

#### 注册新用户

```bash
# 使用curl注册新用户
curl -X POST http://localhost:1229/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "测试用户"
  }'
```

#### 用户登录

```bash
# 使用curl登录
curl -X POST http://localhost:1229/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 2. AI智能对话

#### 发起对话

```bash
# 使用JWT Token发起AI对话
curl -X POST http://localhost:1229/api/ai/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "message": "我的宝宝8个月大，应该怎么添加辅食？",
    "model": "gpt-4"
  }'
```

### 3. 成长记录

#### 创建成长记录

```bash
# 创建新的成长记录
curl -X POST http://localhost:1229/api/growth/records \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "childId": "child-uuid",
    "type": "milestone",
    "category": "motor",
    "description": "宝宝第一次独立坐立",
    "date": "2025-12-29",
    "attachments": []
  }'
```

#### 查询成长记录

```bash
# 查询成长记录列表
curl -X GET http://localhost:1229/api/growth/records?childId=child-uuid \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 4. 语音交互

#### 语音识别

```javascript
// 在前端使用Web Speech API进行语音识别
const recognition = new webkitSpeechRecognition();
recognition.lang = 'zh-CN';
recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  console.log('识别结果:', transcript);
};
recognition.start();
```

#### 语音合成

```javascript
// 使用Web Speech API进行语音合成
const synthesis = window.speechSynthesis;
const utterance = new SpeechSynthesisUtterance('你好，我是小语AI助手');
utterance.lang = 'zh-CN';
synthesis.speak(utterance);
```

---

## 开发指南

### 项目结构

```
yyc3-xiaoyu-ai/
├── src/
│   ├── frontend/          # 前端代码（Next.js 14）
│   │   ├── app/           # App Router页面
│   │   ├── components/    # React组件
│   │   ├── lib/           # 工具库
│   │   ├── hooks/         # 自定义Hooks
│   │   └── store/         # 状态管理（Zustand）
│   ├── backend/           # 后端代码（Hono/Express）
│   │   ├── api/           # API路由
│   │   ├── services/      # 业务服务
│   │   ├── models/        # 数据模型
│   │   └── middleware/    # 中间件
│   └── shared/            # 共享代码
│       ├── types/         # TypeScript类型
│       └── constants/     # 常量定义
├── tests/                 # 测试代码
├── docs/                  # 项目文档
└── config/                # 配置文件
```

### 常用命令

```bash
# 开发
npm run dev              # 启动开发服务器
npm run dev:frontend     # 仅启动前端
npm run dev:backend      # 仅启动后端

# 构建
npm run build            # 构建生产版本
npm run build:frontend   # 仅构建前端
npm run build:backend    # 仅构建后端

# 测试
npm run test             # 运行所有测试
npm run test:unit        # 运行单元测试
npm run test:integration # 运行集成测试
npm run test:e2e         # 运行端到端测试

# 代码质量
npm run lint             # 运行ESLint检查
npm run lint:fix         # 自动修复ESLint问题
npm run format           # 运行Prettier格式化
npm run typecheck        # 运行TypeScript类型检查

# 数据库
npm run db:migrate       # 运行数据库迁移
npm run db:rollback      # 回滚数据库迁移
npm run db:seed          # 填充测试数据
npm run db:reset         # 重置数据库

# Docker
npm run docker:up        # 启动Docker容器
npm run docker:down      # 停止Docker容器
npm run docker:logs      # 查看Docker日志
```

### 代码规范

#### 命名规范

```typescript
// 文件命名
// 组件文件: PascalCase.tsx
UserProfile.tsx
AIChatWidget.tsx

// 工具文件: camelCase.ts
userService.ts
apiClient.ts

// 常量文件: UPPER_CASE.ts
API_CONSTANTS.ts
ERROR_MESSAGES.ts

// 类型文件: types.ts 或 *.types.ts
userTypes.ts
api.types.ts

// 变量命名
// 变量和函数: camelCase
const userName = 'John';
function getUserData() {}

// 类和接口: PascalCase
class UserService {}
interface UserProfile {}

// 常量: UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3;
const API_BASE_URL = 'https://api.example.com';

// 私有属性: _camelCase
class MyClass {
  private _internalValue: string;
}
```

#### 组件规范

```typescript
/**
 * @file 用户资料组件
 * @description 展示用户基本信息和操作按钮
 * @component UserProfile
 * @author YYC³
 * @version 1.0.0
 */

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface UserProfileProps {
  userId: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  userId,
  onEdit,
  onDelete,
}) => {
  const [user, setUser] = useState<User | null>(null);

  const handleEdit = useCallback(() => {
    onEdit?.();
  }, [onEdit]);

  const handleDelete = useCallback(() => {
    onDelete?.();
  }, [onDelete]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{user.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Email: {user.email}</p>
        <div className="flex gap-2">
          <Button onClick={handleEdit}>编辑</Button>
          <Button variant="destructive" onClick={handleDelete}>
            删除
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
```

#### API规范

```typescript
/**
 * @file 用户API路由
 * @description 处理用户相关的API请求
 * @module api/users
 * @author YYC³
 * @version 1.0.0
 */

import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { authMiddleware } from '@/middleware/auth';
import { userService } from '@/services/user';

const app = new Hono();

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
});

/**
 * 创建新用户
 * @route POST /api/users
 * @access 私有
 * @returns {Promise<Response>} 用户创建结果
 */
app.post('/', zValidator('json', createUserSchema), async (c) => {
  try {
    const { email, password, name } = c.req.valid('json');
    const user = await userService.createUser({ email, password, name });
    return c.json({ success: true, data: user }, 201);
  } catch (error) {
    return c.json({ success: false, error: error.message }, 400);
  }
});

export default app;
```

### Git工作流

#### 分支策略

```
main (生产环境)
├── develop (开发环境)
│   ├── feature/user-auth (功能分支)
│   ├── feature/ai-chat (功能分支)
│   └── feature/data-analysis (功能分支)
├── release/v1.0.0 (发布分支)
└── hotfix/critical-bug (热修复分支)
```

#### 提交规范

```bash
# 提交格式
<类型>[可选 范围]: <描述>

# 提交类型
feat: 新功能
fix: Bug修复
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
perf: 性能优化
test: 测试相关
chore: 构建或辅助工具变动

# 提交示例
feat(auth): 添加用户登录功能

实现基于JWT的用户认证系统，包括登录、注册和密码重置功能。

- 添加用户模型和服务
- 实现JWT令牌生成和验证
- 创建登录和注册API端点
- 添加密码加密和验证

Closes #123
```

---

## 常见问题

### 安装问题

**Q: npm install失败，提示权限错误**

A: 尝试使用以下命令：
```bash
# 清除npm缓存
npm cache clean --force

# 使用sudo安装（不推荐）
sudo npm install

# 或者使用nvm管理Node.js版本
nvm install 20
nvm use 20
```

**Q: Docker容器启动失败**

A: 检查Docker服务是否正常运行：
```bash
# 检查Docker服务状态
docker ps

# 查看Docker日志
docker-compose logs

# 重启Docker服务
docker-compose restart
```

### 运行问题

**Q: 数据库连接失败**

A: 检查数据库配置和连接：
```bash
# 检查PostgreSQL是否运行
docker ps | grep postgres

# 测试数据库连接
psql -U postgres -d yyc3_xy

# 检查环境变量配置
cat .env | grep DATABASE_URL
```

**Q: Redis连接失败**

A: 检查Redis服务状态：
```bash
# 检查Redis是否运行
docker ps | grep redis

# 测试Redis连接
redis-cli ping

# 检查Redis日志
docker-compose logs redis
```

### 开发问题

**Q: 如何添加新的API端点？**

A: 按照以下步骤添加新的API端点：
1. 在 `src/backend/api/` 目录下创建新的路由文件
2. 定义API端点和请求/响应模型
3. 实现业务逻辑
4. 添加测试用例
5. 更新API文档

**Q: 如何添加新的前端页面？**

A: 按照以下步骤添加新的前端页面：
1. 在 `src/frontend/app/` 目录下创建新的页面文件
2. 实现页面组件
3. 添加路由配置（如果需要）
4. 添加样式和交互逻辑
5. 测试页面功能

**Q: 如何调试TypeScript类型错误？**

A: 使用以下方法调试类型错误：
```bash
# 运行类型检查
npm run typecheck

# 使用VS Code的类型检查功能
# 将鼠标悬停在错误类型上查看详细信息

# 使用tsc命令进行详细检查
npx tsc --noEmit
```

---

## 进阶学习

### 推荐学习路径

#### 初级开发者

1. **熟悉项目结构** - 了解项目的目录结构和组织方式
2. **阅读核心文档** - 阅读总体架构设计文档和前端架构设计文档
3. **完成Hello World** - 创建一个简单的页面或API端点
4. **运行测试** - 运行现有的测试用例，了解测试框架
5. **提交代码** - 完成第一次代码提交，熟悉Git工作流

#### 中级开发者

1. **深入理解架构** - 学习微服务架构和API设计
2. **掌握技术栈** - 深入学习Next.js、Hono、Prisma等技术
3. **参与功能开发** - 参与实际的功能开发任务
4. **编写测试** - 为新功能编写完整的测试用例
5. **代码审查** - 参与代码审查，学习最佳实践

#### 高级开发者

1. **架构设计** - 参与系统架构设计和优化
2. **性能优化** - 进行性能分析和优化
3. **技术选型** - 参与技术选型和评估
4. **团队指导** - 指导初级开发者，分享经验
5. **开源贡献** - 向开源社区贡献代码和文档

### 推荐阅读

#### 架构文档

- [总体架构设计文档](./架构类/01-YYC3-XY-架构类-总体架构设计文档.md)
- [微服务架构设计文档](./架构类/02-YYC3-XY-架构类-微服务架构设计文档.md)
- [AI服务集成架构文档](./架构类/03-YYC3-XY-架构类-AI服务集成架构文档.md)

#### 技巧文档

- [架构设计绘图规范与工具指南](./技巧类/01-YYC3-XY-技巧类-架构设计绘图规范与工具指南.md)
- [微服务拆分避坑指南](./技巧类/02-YYC3-XY-技巧类-微服务拆分避坑指南.md)
- [AI架构集成性能优化技巧](./技巧类/03-YYC3-XY-技巧类-AI架构集成性能优化技巧.md)

#### 规范文档

- [YYC³团队标准规范文档](./YYC3-XY-文档规范/YYC3智能编程文档管理标准要求规范.md)
- [YYC3-XY-架构类文档内容模板](./YYC3-XY-文档规范/YYC3-XY-架构类文档内容模板.md)

### 推荐工具

#### 开发工具

- **VS Code** - 推荐的代码编辑器
- **Postman** - API测试工具
- **pgAdmin** - PostgreSQL管理工具
- **RedisInsight** - Redis管理工具
- **Docker Desktop** - Docker桌面客户端

#### 调试工具

- **Chrome DevTools** - 浏览器开发者工具
- **React DevTools** - React调试工具
- **Redux DevTools** - 状态管理调试工具
- **Prisma Studio** - Prisma数据库管理工具

#### 性能工具

- **Lighthouse** - Web性能分析工具
- **WebPageTest** - 网站性能测试工具
- **New Relic** - 应用性能监控
- **Datadog** - 基础设施监控

---

## 相关资源

### 官方资源

- **项目仓库**：https://github.com/YY-Nexus/yyc3-xy-02
- **官方网站**：https://yyc3-xy.com
- **文档中心**：https://docs.yyc3-xy.com
- **API文档**：https://api.yyc3-xy.com/docs

### 技术社区

- **GitHub Issues**：https://github.com/YY-Nexus/yyc3-xy-02/issues
- **GitHub Discussions**：https://github.com/YY-Nexus/yyc3-xy-02/discussions
- **Discord社区**：https://discord.gg/yyc3-xy
- **微信公众号**：YYC³小语AI

### 学习资源

- **Next.js文档**：https://nextjs.org/docs
- **React文档**：https://react.dev
- **TypeScript文档**：https://www.typescriptlang.org/docs
- **Prisma文档**：https://www.prisma.io/docs
- **shadcn/ui文档**：https://ui.shadcn.com

### 联系方式

- **技术支持**：support@yyc3-xy.com
- **商务合作**：business@yyc3-xy.com
- **招聘信息**：hr@yyc3-xy.com
- **反馈建议**：feedback@yyc3-xy.com

---

<div align="center">

> 「***YanYuCloudCube***」
> 「***<admin@0379.email>***」
> 「***Words Initiate Quadrants, Language Serves as Core for the Future***」
> 「***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***」

</div>
