---
**创建日期**：2025-12-29
**作者**：YYC³ Team
**版本**：1.0.0
**更新日期**：2025-12-29

---

# CI_CD流水线架构文档

## 文档信息
- 文档类型：架构类
- 所属阶段：YYC3-XY-部署发布
- 遵循规范：五高五标五化要求
- 版本号：V1.0

## 核心内容

---

## 1. CI_CD流水线概述

### 1.1 流水线目标

YYC³-XY AI应用的CI/CD流水线旨在实现以下目标：

- **高自动化**：实现从代码提交到生产部署的全自动化流程
- **高可靠性**：确保每次部署的质量和稳定性
- **高效率**：缩短交付周期，提高开发效率
- **高安全性**：确保代码和部署过程的安全性
- **高可追溯性**：完整记录每次变更和部署历史

### 1.2 流水线原则

遵循YYC³"五高五标五化"原则：

**五高原则**：
- 高可用性：流水线服务高可用，支持多区域部署
- 高性能：快速构建和部署，优化资源利用
- 高安全性：代码扫描、密钥管理、访问控制
- 高扩展性：支持多项目、多环境并行构建
- 高可维护性：清晰的流水线配置和日志

**五标体系**：
- 标准化：统一的流水线模板和流程
- 规范化：遵循代码规范和部署规范
- 自动化：自动化测试、构建、部署
- 智能化：智能测试选择、智能回滚
- 可视化：流水线状态可视化、部署进度可视化

**五化架构**：
- 流程化：标准化的CI/CD流程
- 文档化：完整的流水线文档
- 工具化：使用成熟的CI/CD工具
- 数字化：数字化指标和报告
- 生态化：集成开发、测试、运维工具链

### 1.3 流水线架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                        CI_CD流水线架构                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │  代码提交    │───▶│  触发构建    │───▶│  代码检查    │      │
│  │  (Git Push)  │    │  (Webhook)   │    │  (Lint/Type) │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
│                                                │               │
│                                                ▼               │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │  单元测试    │◀───│  安全扫描    │◀───│  依赖分析    │      │
│  │  (Vitest)    │    │  (SAST/DAST) │    │  (Depcheck)  │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
│         │                                                  │     │
│         ▼                                                  ▼     │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │  集成测试    │───▶│  E2E测试     │───▶│  性能测试    │      │
│  │  (Playwright)│   │  (Playwright)│   │  (Lighthouse) │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
│                                                │               │
│                                                ▼               │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │  构建镜像    │───▶│  推送镜像    │───▶│  部署测试    │      │
│  │  (Docker)    │    │  (Registry)  │    │  (Dev/Stg)   │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
│                                                │               │
│                                                ▼               │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │  部署预发    │───▶│  灰度发布    │───▶│  全量发布    │      │
│  │  (Staging)   │    │  (Canary)    │    │  (Production)│      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
│                                                │               │
│                                                ▼               │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │  健康检查    │───▶│  监控告警    │───▶│  通知报告    │      │
│  │  (Health)    │    │  (Prometheus)│   │  (Slack/Email)│      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. 流水线架构设计

### 2.1 技术栈选择

#### 2.1.1 CI/CD平台

选择GitHub Actions作为主要CI/CD平台，原因如下：

- 与GitHub深度集成，触发机制灵活
- 支持自托管Runner，满足安全要求
- 丰富的Actions生态系统
- 免费额度充足，成本可控
- 支持矩阵构建和并行执行

#### 2.1.2 构建工具

| 工具 | 用途 | 版本 |
|------|------|------|
| Node.js | 运行时环境 | 20.x LTS |
| pnpm | 包管理器 | 8.x |
| Docker | 容器构建 | 24.x |
| Docker Compose | 多容器编排 | 2.x |
| TypeScript | 类型检查 | 5.x |

#### 2.1.3 测试工具

| 工具 | 用途 | 版本 |
|------|------|------|
| Vitest | 单元测试 | 1.x |
| Playwright | E2E测试 | 1.x |
| Lighthouse | 性能测试 | 11.x |
| Artillery | 压力测试 | 2.x |

#### 2.1.4 质量检查工具

| 工具 | 用途 | 版本 |
|------|------|------|
| ESLint | 代码规范检查 | 8.x |
| Prettier | 代码格式化 | 3.x |
| TypeScript | 类型检查 | 5.x |
| SonarQube | 代码质量分析 | 10.x |
| Snyk | 安全漏洞扫描 | 1.x |

### 2.2 流水线配置结构

```
.github/
├── workflows/
│   ├── ci.yml                    # 主CI流水线
│   ├── cd.yml                    # CD流水线
│   ├── security-scan.yml         # 安全扫描流水线
│   ├── performance-test.yml      # 性能测试流水线
│   └── release.yml               # 发布流水线
├── actions/
│   ├── setup-node/               # Node环境设置
│   ├── build-docker/             # Docker构建
│   └── deploy/                   # 部署脚本
└── scripts/
    ├── notify.sh                 # 通知脚本
    └── rollback.sh               # 回滚脚本
```

### 2.3 环境配置

#### 2.3.1 GitHub Secrets

| Secret名称 | 描述 | 示例 |
|-----------|------|------|
| DOCKER_REGISTRY | Docker镜像仓库地址 | ghcr.io |
| DOCKER_USERNAME | Docker用户名 | ${{ github.actor }} |
| DOCKER_PASSWORD | Docker密码 | ${{ secrets.GITHUB_TOKEN }} |
| DEPLOY_HOST | 部署服务器地址 | deploy.example.com |
| DEPLOY_SSH_KEY | SSH私钥 | -----BEGIN RSA PRIVATE KEY----- |
| SLACK_WEBHOOK | Slack通知Webhook | https://hooks.slack.com/... |
| DATABASE_URL | 数据库连接URL | postgresql://... |
| REDIS_URL | Redis连接URL | redis://... |
| OPENAI_API_KEY | OpenAI API密钥 | sk-... |
| QDRANT_URL | Qdrant服务地址 | http://qdrant:6333 |

#### 2.3.2 环境变量

| 变量名称 | 开发环境 | 测试环境 | 生产环境 |
|---------|---------|---------|---------|
| NODE_ENV | development | staging | production |
| API_PORT | 1229 | 1229 | 1229 |
| WEB_PORT | 1228 | 1228 | 1228 |
| LOG_LEVEL | debug | info | warn |
| CACHE_TTL | 3600 | 1800 | 7200 |
| MAX_CONCURRENT | 10 | 50 | 100 |

---

## 3. 代码质量检查

### 3.1 Lint检查

#### 3.1.1 ESLint配置

```javascript
// .eslintrc.js
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },
  ignorePatterns: ['dist', 'build', 'node_modules', '.next'],
};
```

#### 3.1.2 Lint检查步骤

```yaml
# .github/workflows/ci.yml
lint:
  runs-on: ubuntu-latest
  steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'pnpm'

    - name: Install dependencies
      run: pnpm install --frozen-lockfile

    - name: Run ESLint
      run: pnpm lint

    - name: Upload lint results
      if: failure()
      uses: actions/upload-artifact@v4
      with:
        name: lint-results
        path: eslint-report.json
```

### 3.2 类型检查

#### 3.2.1 TypeScript配置

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowJs": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/services/*": ["./src/services/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "build"]
}
```

#### 3.2.2 类型检查步骤

```yaml
type-check:
  runs-on: ubuntu-latest
  steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'pnpm'

    - name: Install dependencies
      run: pnpm install --frozen-lockfile

    - name: Run TypeScript type check
      run: pnpm type-check

    - name: Upload type check results
      if: failure()
      uses: actions/upload-artifact@v4
      with:
        name: type-check-results
        path: tsconfig.json
```

### 3.3 代码格式化

#### 3.3.1 Prettier配置

```javascript
// .prettierrc.js
module.exports = {
  semi: true,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  arrowParens: 'always',
  endOfLine: 'lf',
  plugins: ['prettier-plugin-organize-imports'],
};
```

#### 3.3.2 格式化检查

```yaml
format-check:
  runs-on: ubuntu-latest
  steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'pnpm'

    - name: Install dependencies
      run: pnpm install --frozen-lockfile

    - name: Run Prettier check
      run: pnpm format:check

    - name: Auto-format code
      if: failure()
      run: pnpm format

    - name: Commit formatted code
      if: failure()
      uses: stefanzweifel/git-auto-commit-action@v5
      with:
        commit_message: 'style: auto-format code with prettier'
```

---

## 4. 自动化测试

### 4.1 单元测试

#### 4.1.1 Vitest配置

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

#### 4.1.2 单元测试步骤

```yaml
unit-test:
  runs-on: ubuntu-latest
  steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'pnpm'

    - name: Install dependencies
      run: pnpm install --frozen-lockfile

    - name: Run unit tests
      run: pnpm test:unit --coverage

    - name: Upload coverage reports
      uses: codecov/codecov-action@v4
      with:
        files: ./coverage/coverage-final.json
        flags: unittests
        name: codecov-umbrella

    - name: Upload test results
      if: always()
      uses: actions/upload-artifact@v4
      with:
        name: unit-test-results
        path: coverage/
```

### 4.2 集成测试

#### 4.2.1 测试配置

```typescript
// src/test/integration/setup.ts
import { beforeAll, afterAll } from 'vitest';
import { createServer } from 'http';
import { handler } from '@/api/handler';

let server: any;

beforeAll(async () => {
  server = createServer(handler);
  await new Promise<void>((resolve) => {
    server.listen(3001, () => {
      console.log('Integration test server started on port 3001');
      resolve();
    });
  });
});

afterAll(async () => {
  await new Promise<void>((resolve) => {
    server.close(() => {
      console.log('Integration test server stopped');
      resolve();
    });
  });
});
```

#### 4.2.2 集成测试步骤

```yaml
integration-test:
  runs-on: ubuntu-latest
  services:
    postgres:
      image: postgres:15
      env:
        POSTGRES_DB: test_db
        POSTGRES_USER: test_user
        POSTGRES_PASSWORD: test_pass
      ports:
        - 5432:5432
      options: >-
        --health-cmd pg_isready
        --health-interval 10s
        --health-timeout 5s
        --health-retries 5

    redis:
      image: redis:7-alpine
      ports:
        - 6379:6379
      options: >-
        --health-cmd "redis-cli ping"
        --health-interval 10s
        --health-timeout 5s
        --health-retries 5

  steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'pnpm'

    - name: Install dependencies
      run: pnpm install --frozen-lockfile

    - name: Run database migrations
      env:
        DATABASE_URL: postgresql://test_user:test_pass@localhost:5432/test_db
      run: pnpm prisma migrate deploy

    - name: Run integration tests
      env:
        DATABASE_URL: postgresql://test_user:test_pass@localhost:5432/test_db
        REDIS_URL: redis://localhost:6379
      run: pnpm test:integration

    - name: Upload test results
      if: always()
      uses: actions/upload-artifact@v4
      with:
        name: integration-test-results
        path: test-results/
```

### 4.3 E2E测试

#### 4.3.1 Playwright配置

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'playwright-report/results.json' }],
  ],
  use: {
    baseURL: 'http://localhost:1228',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:1228',
    reuseExistingServer: !process.env.CI,
  },
});
```

#### 4.3.2 E2E测试步骤

```yaml
e2e-test:
  runs-on: ubuntu-latest
  steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'pnpm'

    - name: Install dependencies
      run: pnpm install --frozen-lockfile

    - name: Install Playwright browsers
      run: pnpm exec playwright install --with-deps

    - name: Run E2E tests
      run: pnpm test:e2e

    - name: Upload test results
      if: always()
      uses: actions/upload-artifact@v4
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30

    - name: Upload screenshots
      if: failure()
      uses: actions/upload-artifact@v4
      with:
        name: playwright-screenshots
        path: test-results/
```

### 4.4 性能测试

#### 4.4.1 Lighthouse配置

```javascript
// lighthouse.config.js
module.exports = {
  extends: 'lighthouse:default',
  settings: {
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    throttling: {
      rttMs: 40,
      throughputKbps: 10240,
      cpuSlowdownMultiplier: 1,
      requestLatencyMs: 0,
      downloadThroughputKbps: 0,
      uploadThroughputKbps: 0,
    },
    emulatedFormFactor: 'desktop',
    screenEmulation: {
      mobile: false,
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
      disabled: false,
    },
  },
};
```

#### 4.4.2 性能测试步骤

```yaml
performance-test:
  runs-on: ubuntu-latest
  steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'pnpm'

    - name: Install dependencies
      run: pnpm install --frozen-lockfile

    - name: Build application
      run: pnpm build

    - name: Start application
      run: pnpm start &

    - name: Wait for application to start
      run: sleep 10

    - name: Run Lighthouse CI
      uses: treosh/lighthouse-ci-action@v10
      with:
        urls: |
          http://localhost:1228
          http://localhost:1228/dashboard
          http://localhost:1228/chat
        uploadArtifacts: true
        temporaryPublicStorage: true
        budgetPath: ./.github/lighthouse-budget.json

    - name: Upload performance results
      if: always()
      uses: actions/upload-artifact@v4
      with:
        name: lighthouse-results
        path: .lighthouseci/
```

---

## 5. 构建流程

### 5.1 前端构建

#### 5.1.1 Next.js构建配置

```javascript
// next.config.js
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  compress: true,
  productionBrowserSourceMaps: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  images: {
    domains: ['cdn.example.com'],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizeCss: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version,
  },
};

module.exports = nextConfig;
```

#### 5.1.2 前端构建步骤

```yaml
build-frontend:
  runs-on: ubuntu-latest
  steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'pnpm'

    - name: Install dependencies
      run: pnpm install --frozen-lockfile

    - name: Build frontend
      env:
        NEXT_PUBLIC_API_URL: ${{ secrets.API_URL }}
      run: pnpm build

    - name: Analyze bundle size
      run: pnpm analyze

    - name: Upload build artifacts
      uses: actions/upload-artifact@v4
      with:
        name: frontend-build
        path: |
          .next/
          public/
        retention-days: 7
```

### 5.2 后端构建

#### 5.2.1 TypeScript构建配置

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "removeComments": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "**/*.test.ts"]
}
```

#### 5.2.2 后端构建步骤

```yaml
build-backend:
  runs-on: ubuntu-latest
  steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'pnpm'

    - name: Install dependencies
      run: pnpm install --frozen-lockfile

    - name: Build backend
      run: pnpm build:backend

    - name: Generate Prisma client
      run: pnpm prisma generate

    - name: Upload build artifacts
      uses: actions/upload-artifact@v4
      with:
        name: backend-build
        path: |
          dist/
          prisma/
        retention-days: 7
```

### 5.3 Docker镜像构建

#### 5.3.1 前端Dockerfile

```dockerfile
# Dockerfile.frontend
FROM node:20-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN corepack enable pnpm && pnpm build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 1228

ENV PORT=1228
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

#### 5.3.2 后端Dockerfile

```dockerfile
# Dockerfile.backend
FROM node:20-alpine AS base

WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile --prod

FROM base AS builder
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build:backend

FROM base AS runner
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY package.json ./

USER nodejs

EXPOSE 1229

ENV NODE_ENV=production
ENV PORT=1229

CMD ["node", "dist/index.js"]
```

#### 5.3.3 Docker镜像构建步骤

```yaml
build-docker-images:
  runs-on: ubuntu-latest
  needs: [build-frontend, build-backend]
  steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v3

    - name: Log in to Container Registry
      uses: docker/login-action@v3
      with:
        registry: ${{ secrets.DOCKER_REGISTRY }}
        username: ${{ secrets.DOCKER_USERNAME }}
        password: ${{ secrets.DOCKER_PASSWORD }}

    - name: Download frontend build artifacts
      uses: actions/download-artifact@v4
      with:
        name: frontend-build
        path: ./

    - name: Download backend build artifacts
      uses: actions/download-artifact@v4
      with:
        name: backend-build
        path: ./

    - name: Extract metadata for frontend
      id: meta-frontend
      uses: docker/metadata-action@v5
      with:
        images: ${{ secrets.DOCKER_REGISTRY }}/yyc3-xy-frontend
        tags: |
          type=ref,event=branch
          type=ref,event=pr
          type=semver,pattern={{version}}
          type=semver,pattern={{major}}.{{minor}}
          type=sha,prefix={{branch}}-

    - name: Build and push frontend image
      uses: docker/build-push-action@v5
      with:
        context: .
        file: ./Dockerfile.frontend
        push: true
        tags: ${{ steps.meta-frontend.outputs.tags }}
        labels: ${{ steps.meta-frontend.outputs.labels }}
        cache-from: type=gha
        cache-to: type=gha,mode=max

    - name: Extract metadata for backend
      id: meta-backend
      uses: docker/metadata-action@v5
      with:
        images: ${{ secrets.DOCKER_REGISTRY }}/yyc3-xy-backend
        tags: |
          type=ref,event=branch
          type=ref,event=pr
          type=semver,pattern={{version}}
          type=semver,pattern={{major}}.{{minor}}
          type=sha,prefix={{branch}}-

    - name: Build and push backend image
      uses: docker/build-push-action@v5
      with:
        context: .
        file: ./Dockerfile.backend
        push: true
        tags: ${{ steps.meta-backend.outputs.tags }}
        labels: ${{ steps.meta-backend.outputs.labels }}
        cache-from: type=gha
        cache-to: type=gha,mode=max
```

---

## 6. 部署策略

### 6.1 环境部署

#### 6.1.1 开发环境部署

```yaml
deploy-dev:
  runs-on: ubuntu-latest
  needs: [build-docker-images]
  if: github.ref == 'refs/heads/develop'
  environment:
    name: development
    url: https://dev.yyc3-xy.example.com
  steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Deploy to development
      uses: appleboy/ssh-action@v1.0.3
      with:
        host: ${{ secrets.DEV_DEPLOY_HOST }}
        username: ${{ secrets.DEPLOY_USER }}
        key: ${{ secrets.DEPLOY_SSH_KEY }}
        script: |
          cd /opt/yyc3-xy
          docker-compose -f docker-compose.dev.yml pull
          docker-compose -f docker-compose.dev.yml up -d
          docker system prune -f

    - name: Health check
      run: |
        sleep 30
        curl -f https://dev.yyc3-xy.example.com/health || exit 1

    - name: Notify deployment
      uses: 8398a7/action-slack@v3
      with:
        status: ${{ job.status }}
        text: 'Development deployment completed'
        webhook_url: ${{ secrets.SLACK_WEBHOOK }}
      if: always()
```

#### 6.1.2 测试环境部署

```yaml
deploy-staging:
  runs-on: ubuntu-latest
  needs: [build-docker-images, e2e-test]
  if: github.ref == 'refs/heads/main'
  environment:
    name: staging
    url: https://staging.yyc3-xy.example.com
  steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Deploy to staging
      uses: appleboy/ssh-action@v1.0.3
      with:
        host: ${{ secrets.STAGING_DEPLOY_HOST }}
        username: ${{ secrets.DEPLOY_USER }}
        key: ${{ secrets.DEPLOY_SSH_KEY }}
        script: |
          cd /opt/yyc3-xy
          docker-compose -f docker-compose.staging.yml pull
          docker-compose -f docker-compose.staging.yml up -d
          docker system prune -f

    - name: Run smoke tests
      run: |
        sleep 30
        curl -f https://staging.yyc3-xy.example.com/health || exit 1
        pnpm test:smoke

    - name: Notify deployment
      uses: 8398a7/action-slack@v3
      with:
        status: ${{ job.status }}
        text: 'Staging deployment completed'
        webhook_url: ${{ secrets.SLACK_WEBHOOK }}
      if: always()
```

#### 6.1.3 生产环境部署

```yaml
deploy-production:
  runs-on: ubuntu-latest
  needs: [build-docker-images, e2e-test, performance-test]
  if: github.ref == 'refs/heads/main' && github.event_name == 'release'
  environment:
    name: production
    url: https://yyc3-xy.example.com
  steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Create deployment backup
      uses: appleboy/ssh-action@v1.0.3
      with:
        host: ${{ secrets.PROD_DEPLOY_HOST }}
        username: ${{ secrets.DEPLOY_USER }}
        key: ${{ secrets.DEPLOY_SSH_KEY }}
        script: |
          cd /opt/yyc3-xy
          ./scripts/backup.sh

    - name: Deploy to production
      uses: appleboy/ssh-action@v1.0.3
      with:
        host: ${{ secrets.PROD_DEPLOY_HOST }}
        username: ${{ secrets.DEPLOY_USER }}
        key: ${{ secrets.DEPLOY_SSH_KEY }}
        script: |
          cd /opt/yyc3-xy
          docker-compose -f docker-compose.prod.yml pull
          docker-compose -f docker-compose.prod.yml up -d
          docker system prune -f

    - name: Health check
      run: |
        sleep 60
        curl -f https://yyc3-xy.example.com/health || exit 1

    - name: Run smoke tests
      run: pnpm test:smoke

    - name: Notify deployment
      uses: 8398a7/action-slack@v3
      with:
        status: ${{ job.status }}
        text: 'Production deployment completed'
        webhook_url: ${{ secrets.SLACK_WEBHOOK }}
      if: always()
```

### 6.2 灰度发布

#### 6.2.1 灰度发布配置

```yaml
deploy-canary:
  runs-on: ubuntu-latest
  needs: [build-docker-images]
  if: github.ref == 'refs/heads/main'
  environment:
    name: production-canary
    url: https://canary.yyc3-xy.example.com
  steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Deploy canary (10% traffic)
      uses: appleboy/ssh-action@v1.0.3
      with:
        host: ${{ secrets.PROD_DEPLOY_HOST }}
        username: ${{ secrets.DEPLOY_USER }}
        key: ${{ secrets.DEPLOY_SSH_KEY }}
        script: |
          cd /opt/yyc3-xy
          ./scripts/deploy-canary.sh 10

    - name: Monitor canary (5 minutes)
      run: sleep 300

    - name: Check canary metrics
      run: |
        curl -f https://canary.yyc3-xy.example.com/metrics || exit 1

    - name: Scale canary (50% traffic)
      uses: appleboy/ssh-action@v1.0.3
      with:
        host: ${{ secrets.PROD_DEPLOY_HOST }}
        username: ${{ secrets.DEPLOY_USER }}
        key: ${{ secrets.DEPLOY_SSH_KEY }}
        script: |
          cd /opt/yyc3-xy
          ./scripts/deploy-canary.sh 50

    - name: Monitor canary (10 minutes)
      run: sleep 600

    - name: Check canary metrics
      run: |
        curl -f https://canary.yyc3-xy.example.com/metrics || exit 1

    - name: Promote canary to full production
      uses: appleboy/ssh-action@v1.0.3
      with:
        host: ${{ secrets.PROD_DEPLOY_HOST }}
        username: ${{ secrets.DEPLOY_USER }}
        key: ${{ secrets.DEPLOY_SSH_KEY }}
        script: |
          cd /opt/yyc3-xy
          ./scripts/promote-canary.sh

    - name: Notify canary deployment
      uses: 8398a7/action-slack@v3
      with:
        status: ${{ job.status }}
        text: 'Canary deployment completed and promoted'
        webhook_url: ${{ secrets.SLACK_WEBHOOK }}
      if: always()
```

### 6.3 回滚机制

#### 6.3.1 自动回滚

```yaml
auto-rollback:
  runs-on: ubuntu-latest
  needs: [deploy-production]
  if: failure()
  steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Rollback to previous version
      uses: appleboy/ssh-action@v1.0.3
      with:
        host: ${{ secrets.PROD_DEPLOY_HOST }}
        username: ${{ secrets.DEPLOY_USER }}
        key: ${{ secrets.DEPLOY_SSH_KEY }}
        script: |
          cd /opt/yyc3-xy
          ./scripts/rollback.sh

    - name: Verify rollback
      run: |
        sleep 30
        curl -f https://yyc3-xy.example.com/health || exit 1

    - name: Notify rollback
      uses: 8398a7/action-slack@v3
      with:
        status: 'failure'
        text: 'Automatic rollback triggered'
        webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

#### 6.3.2 手动回滚脚本

```bash
#!/bin/bash
# scripts/rollback.sh

set -e

BACKUP_DIR="/opt/yyc3-xy/backups"
CURRENT_VERSION=$(docker ps --format '{{.Image}}' | grep yyc3-xy | head -1)
LATEST_BACKUP=$(ls -t $BACKUP_DIR | head -1)

echo "Current version: $CURRENT_VERSION"
echo "Latest backup: $LATEST_BACKUP"

if [ -z "$LATEST_BACKUP" ]; then
  echo "No backup found!"
  exit 1
fi

echo "Rolling back to $LATEST_BACKUP..."

cd /opt/yyc3-xy

docker-compose -f docker-compose.prod.yml down
docker load -i $BACKUP_DIR/$LATEST_BACKUP
docker-compose -f docker-compose.prod.yml up -d

echo "Rollback completed!"
```

---

## 7. 环境管理

### 7.1 环境配置

#### 7.1.1 开发环境配置

```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  frontend:
    image: ghcr.io/yyc3/yyc3-xy-frontend:develop
    container_name: yyc3-xy-frontend-dev
    ports:
      - "1228:1228"
    environment:
      - NODE_ENV=development
      - NEXT_PUBLIC_API_URL=http://localhost:1229
      - LOG_LEVEL=debug
    volumes:
      - ./src:/app/src
    restart: unless-stopped

  backend:
    image: ghcr.io/yyc3/yyc3-xy-backend:develop
    container_name: yyc3-xy-backend-dev
    ports:
      - "1229:1229"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://dev:dev@postgres:5432/yyc3xy_dev
      - REDIS_URL=redis://redis:6379
      - LOG_LEVEL=debug
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

  postgres:
    image: postgres:15-alpine
    container_name: yyc3-xy-postgres-dev
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=yyc3xy_dev
      - POSTGRES_USER=dev
      - POSTGRES_PASSWORD=dev
    volumes:
      - postgres-dev-data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    container_name: yyc3-xy-redis-dev
    ports:
      - "6379:6379"
    volumes:
      - redis-dev-data:/data
    restart: unless-stopped

volumes:
  postgres-dev-data:
  redis-dev-data:
```

#### 7.1.2 生产环境配置

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  frontend:
    image: ghcr.io/yyc3/yyc3-xy-frontend:latest
    container_name: yyc3-xy-frontend-prod
    ports:
      - "1228:1228"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=https://api.yyc3-xy.example.com
      - LOG_LEVEL=warn
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:1228/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  backend:
    image: ghcr.io/yyc3/yyc3-xy-backend:latest
    container_name: yyc3-xy-backend-prod
    ports:
      - "1229:1229"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - LOG_LEVEL=warn
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 2G
        reservations:
          cpus: '1.0'
          memory: 1G
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:1229/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  postgres:
    image: postgres:15-alpine
    container_name: yyc3-xy-postgres-prod
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=${POSTGRES_DB}
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - postgres-prod-data:/var/lib/postgresql/data
      - ./backups:/backups
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    container_name: yyc3-xy-redis-prod
    ports:
      - "6379:6379"
    volumes:
      - redis-prod-data:/data
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
    restart: unless-stopped

volumes:
  postgres-prod-data:
  redis-prod-data:
```

### 7.2 环境变量管理

#### 7.2.1 环境变量文件

```bash
# .env.development
NODE_ENV=development
API_PORT=1229
WEB_PORT=1228
LOG_LEVEL=debug

DATABASE_URL=postgresql://dev:dev@localhost:5432/yyc3xy_dev
REDIS_URL=redis://localhost:6379

NEXT_PUBLIC_API_URL=http://localhost:1229
NEXT_PUBLIC_APP_VERSION=1.0.0

OPENAI_API_KEY=sk-dev-key
QDRANT_URL=http://localhost:6333
```

```bash
# .env.production
NODE_ENV=production
API_PORT=1229
WEB_PORT=1228
LOG_LEVEL=warn

DATABASE_URL=postgresql://prod:prod@prod-db.example.com:5432/yyc3xy_prod
REDIS_URL=redis://prod-redis.example.com:6379

NEXT_PUBLIC_API_URL=https://api.yyc3-xy.example.com
NEXT_PUBLIC_APP_VERSION=1.0.0

OPENAI_API_KEY=sk-prod-key
QDRANT_URL=http://qdrant.example.com:6333
```

#### 7.2.2 密钥管理

```yaml
# .github/workflows/secrets-management.yml
name: Secrets Management

on:
  workflow_dispatch:

jobs:
  rotate-secrets:
    runs-on: ubuntu-latest
    steps:
      - name: Generate new API key
        id: generate-key
        run: |
          NEW_KEY=$(openssl rand -hex 32)
          echo "key=$NEW_KEY" >> $GITHUB_OUTPUT

      - name: Update GitHub Secrets
        uses: hmanzur/actions-set-secret@v2
        with:
          name: API_KEY
          value: ${{ steps.generate-key.outputs.key }}
          repository: ${{ github.repository }}

      - name: Update application secrets
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.DEPLOY_HOST }}
          username: ${{ secrets.DEPLOY_USER }}
          key: ${{ secrets.DEPLOY_SSH_KEY }}
          script: |
            echo "API_KEY=${{ steps.generate-key.outputs.key }}" >> /opt/yyc3-xy/.env
            docker-compose restart backend
```

---

## 8. 监控与告警

### 8.1 应用监控

#### 8.1.1 Prometheus配置

```yaml
# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'yyc3-xy-backend'
    static_configs:
      - targets: ['backend:1229']
    metrics_path: '/metrics'

  - job_name: 'yyc3-xy-frontend'
    static_configs:
      - targets: ['frontend:1228']
    metrics_path: '/metrics'

  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres-exporter:9187']

  - job_name: 'redis'
    static_configs:
      - targets: ['redis-exporter:9121']
```

#### 8.1.2 Grafana仪表板

```json
{
  "dashboard": {
    "title": "YYC³-XY Application Metrics",
    "panels": [
      {
        "title": "Request Rate",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])"
          }
        ]
      },
      {
        "title": "Response Time",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, http_request_duration_seconds_bucket)"
          }
        ]
      },
      {
        "title": "Error Rate",
        "targets": [
          {
            "expr": "rate(http_requests_total{status=~\"5..\"}[5m])"
          }
        ]
      },
      {
        "title": "Memory Usage",
        "targets": [
          {
            "expr": "process_resident_memory_bytes / 1024 / 1024"
          }
        ]
      }
    ]
  }
}
```

### 8.2 日志管理

#### 8.2.1 日志配置

```typescript
// src/lib/logger.ts
import pino from 'pino';

const logLevel = process.env.LOG_LEVEL || 'info';

export const logger = pino({
  level: logLevel,
  transport: process.env.NODE_ENV === 'development' ? {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss Z',
      ignore: 'pid,hostname',
    },
  } : undefined,
  redact: ['req.headers.authorization', 'req.headers.cookie'],
  serializers: {
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
    err: pino.stdSerializers.err,
  },
});

export const logRequest = (req: any, res: any, next: any) => {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.info({
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration,
    }, 'HTTP Request');
  });

  next();
};
```

#### 8.2.2 日志收集

```yaml
# docker-compose.logging.yml
version: '3.8'

services:
  loki:
    image: grafana/loki:latest
    container_name: loki
    ports:
      - "3100:3100"
    volumes:
      - ./loki-config.yml:/etc/loki/local-config.yaml
    command: -config.file=/etc/loki/local-config.yaml

  promtail:
    image: grafana/promtail:latest
    container_name: promtail
    volumes:
      - /var/log:/var/log:ro
      - /var/lib/docker/containers:/var/lib/docker/containers:ro
      - ./promtail-config.yml:/etc/promtail/config.yml
    command: -config.file=/etc/promtail/config.yml
```

### 8.3 告警规则

#### 8.3.1 Prometheus告警规则

```yaml
# alert-rules.yml
groups:
  - name: application_alerts
    interval: 30s
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value }} errors/sec"

      - alert: HighResponseTime
        expr: histogram_quantile(0.95, http_request_duration_seconds_bucket) > 1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High response time detected"
          description: "95th percentile response time is {{ $value }}s"

      - alert: HighMemoryUsage
        expr: process_resident_memory_bytes / 1024 / 1024 > 1024
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage detected"
          description: "Memory usage is {{ $value }}MB"

      - alert: ServiceDown
        expr: up == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Service is down"
          description: "Service {{ $labels.instance }} is down"
```

#### 8.3.2 告警通知

```yaml
# alertmanager.yml
global:
  slack_api_url: '${SLACK_WEBHOOK}'

route:
  group_by: ['alertname', 'cluster', 'service']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 1h
  receiver: 'default-receiver'
  routes:
    - match:
        severity: critical
      receiver: 'critical-receiver'
      continue: false

receivers:
  - name: 'default-receiver'
    slack_configs:
      - channel: '#alerts'
        send_resolved: true

  - name: 'critical-receiver'
    slack_configs:
      - channel: '#critical-alerts'
        send_resolved: true
    webhook_configs:
      - url: '${PAGERDUTY_WEBHOOK}'
```

---

## 9. 最佳实践

### 9.1 流水线优化

#### 9.1.1 并行执行

```yaml
# 并行执行多个独立的检查任务
jobs:
  quality-checks:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        check: [lint, type-check, format-check]
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run ${{ matrix.check }}
        run: pnpm ${{ matrix.check }}
```

#### 9.1.2 缓存优化

```yaml
# 使用GitHub Actions缓存加速构建
- name: Cache node modules
  uses: actions/cache@v4
  with:
    path: |
      ~/.pnpm-store
      node_modules
    key: ${{ runner.os }}-node-${{ hashFiles('**/pnpm-lock.yaml') }}
    restore-keys: |
      ${{ runner.os }}-node-

- name: Cache Docker layers
  uses: actions/cache@v4
  with:
    path: /tmp/.buildx-cache
    key: ${{ runner.os }}-buildx-${{ github.sha }}
    restore-keys: |
      ${{ runner.os }}-buildx-
```

#### 9.1.3 矩阵构建

```yaml
# 支持多版本、多平台构建
jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18.x, 20.x]
        os: [ubuntu-latest, macos-latest]
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build
        run: pnpm build
```

### 9.2 安全最佳实践

#### 9.2.1 密钥管理

- 使用GitHub Secrets存储敏感信息
- 定期轮换API密钥和访问令牌
- 使用最小权限原则配置访问控制
- 避免在日志中输出敏感信息

#### 9.2.2 依赖安全

```yaml
# 依赖安全扫描
security-scan:
  runs-on: ubuntu-latest
  steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Run Snyk security scan
      uses: snyk/actions/node@master
      env:
        SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

    - name: Run npm audit
      run: pnpm audit --audit-level=moderate

    - name: Check for outdated dependencies
      run: pnpm outdated || true
```

#### 9.2.3 镜像安全

```yaml
# 镜像安全扫描
image-scan:
  runs-on: ubuntu-latest
  steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Build image
      run: docker build -t yyc3-xy:latest .

    - name: Run Trivy vulnerability scanner
      uses: aquasecurity/trivy-action@master
      with:
        image-ref: 'yyc3-xy:latest'
        format: 'sarif'
        output: 'trivy-results.sarif'

    - name: Upload Trivy results
      uses: github/codeql-action/upload-sarif@v2
      with:
        sarif_file: 'trivy-results.sarif'
```

### 9.3 性能优化

#### 9.3.1 构建优化

```javascript
// next.config.js
module.exports = {
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@mui/material', 'lucide-react'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};
```

#### 9.3.2 部署优化

```yaml
# 使用多阶段构建减小镜像体积
# Dockerfile.optimized
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile --prod

FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 1228

CMD ["node", "server.js"]
```

---

## 10. 故障排查

### 10.1 常见问题

#### 10.1.1 构建失败

**问题**：Docker构建失败

**排查步骤**：
1. 检查Dockerfile语法是否正确
2. 验证依赖是否完整
3. 检查构建日志中的错误信息
4. 确认基础镜像是否可访问

**解决方案**：
```bash
# 本地测试构建
docker build -t test-image -f Dockerfile.frontend .

# 查看详细日志
docker build --progress=plain -t test-image -f Dockerfile.frontend .
```

#### 10.1.2 部署失败

**问题**：部署后服务无法启动

**排查步骤**：
1. 检查容器日志
2. 验证环境变量配置
3. 检查端口是否被占用
4. 确认依赖服务是否正常运行

**解决方案**：
```bash
# 查看容器日志
docker logs yyc3-xy-backend-prod

# 检查容器状态
docker ps -a

# 重启容器
docker-compose restart backend
```

#### 10.1.3 测试失败

**问题**：自动化测试失败

**排查步骤**：
1. 查看测试报告
2. 检查测试环境配置
3. 验证测试数据是否正确
4. 确认测试依赖服务是否正常

**解决方案**：
```bash
# 本地运行测试
pnpm test:unit
pnpm test:integration
pnpm test:e2e

# 查看测试覆盖率
pnpm test:coverage
```

### 10.2 监控指标

#### 10.2.1 关键指标

| 指标 | 阈值 | 告警级别 |
|------|------|---------|
| 错误率 | > 5% | Critical |
| 响应时间 (P95) | > 1s | Warning |
| 内存使用率 | > 80% | Warning |
| CPU使用率 | > 80% | Warning |
| 磁盘使用率 | > 85% | Warning |
| 数据库连接数 | > 80% | Warning |

#### 10.2.2 日志级别

| 级别 | 用途 |
|------|------|
| ERROR | 系统错误、异常 |
| WARN | 警告信息、潜在问题 |
| INFO | 关键业务操作、状态变更 |
| DEBUG | 调试信息、详细流程 |

---

## 11. 相关文档

- [总体架构设计文档](../YYC3-XY-架构设计/架构类/01-YYC3-XY-架构类-总体架构设计文档.md)
- [微服务架构设计文档](../YYC3-XY-架构设计/架构类/02-YYC3-XY-架构类-微服务架构设计文档.md)
- [部署架构实施文档](./01-YYC3-XY-架构类-部署架构实施文档.md)
- [多环境部署架构差异文档](./03-YYC3-XY-架构类-多环境部署架构差异文档.md)
- [灰度发布架构设计文档](./04-YYC3-XY-架构类-灰度发布架构设计文档.md)
- [代码架构实现说明书](../../YYC3-XY-开发实施/架构类/01-YYC3-XY-架构类-代码架构实现说明书.md)
- [智能化应用业务架构说明书](../../YYC3-XY-需求规划/架构类/01-YYC3-XY-架构类-智能化应用业务架构说明书.md)

---

<div align="center">

> 「***YanYuCloudCube***」
> 「***<admin@0379.email>***」
> 「***Words Initiate Quadrants, Language Serves as Core for the Future***」
> 「***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***」

</div>
