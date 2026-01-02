# YYC³ 智能插拔式移动AI系统 贡献指南

## 🤝 欢迎贡献

感谢您对YYC³智能插拔式移动AI系统项目的关注！我们欢迎各种形式的贡献，包括但不限于：

- 🐛 报告Bug和建议
- 💡 提出新功能和改进
- 📝 完善文档和示例
- 🧪 编写测试用例
- 🔧 性能优化
- 🌐 国际化和本地化

## 🚀 快速开始

### 环境准备

1. **克隆项目**
   ```bash
   git clone https://github.com/YY-Nexus/yyc3-xy-03.git
   cd yyc3-xy-03
   ```

2. **设置开发环境**
   ```bash
   # 安装依赖
   bun install

   # 配置环境变量
   cp .env.example .env.local
   # 编辑 .env.local 文件

   # 启动开发服务器
   bun run dev
   ```

3. **运行测试**
   ```bash
   # 运行所有测试
   bun run test

   # 运行特定测试文件
   bun test tests/unit/services/core/AgenticCore.test.ts
   ```

## 📋 贡献流程

### 1. 创建Issue（可选）

- 如果您计划实现新功能，建议先创建Issue进行讨论
- 详细描述功能需求、技术方案和实现思路
- 等待维护者确认后方可开始开发

### 2. 创建分支

```bash
# 从main分支创建功能分支
git checkout -b feature/amazing-feature

# 从develop分支创建功能分支
git checkout -b feature/amazing-feature develop

# 为Bug修复创建分支
git checkout -b fix/bug-description main
```

**分支命名规范**：
- `feature/功能描述` - 新功能开发
- `fix/问题描述` - Bug修复
- `docs/文档更新` - 文档更新
- `refactor/重构描述` - 代码重构
- `chore/维护任务` - 维护任务

### 3. 开发和测试

#### 开发规范

1. **遵循代码规范**
   ```bash
   # 代码检查
   bun run lint

   # 代码格式化
   bun run format

   # 类型检查
   bun run type-check
   ```

2. **编写测试**
   ```bash
   # 单元测试
   bun test:unit

   # 集成测试
   bun test:integration

   # E2E测试
   bun test:e2e
   ```

3. **更新文档**
   - 更新相关的API文档
   - 添加代码注释
   - 更新README和CHangelog

### 4. 提交代码

```bash
# 添加文件到暂存区
git add .

# 提交代码
git commit -m "feat: 添加新功能描述

- 实现功能A
- 添加测试用例
- 更新文档

Closes #123"
```

**提交信息规范**：
```
<type>(<scope>): <description>

[optional body]

Closes #<issue_number>
```

**提交类型**：
- `feat`: 新功能
- `fix`: Bug修复
- `docs`: 文档更新
- `style`: 代码格式化
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

### 5. 创建Pull Request

```bash
# 推送到您的Fork
git push origin feature/amazing-feature

# 在GitHub上创建Pull Request
# 选择目标分支（通常是main或develop）
```

### 6. 代码审查

**审查要点**：
- 代码质量和规范性
- 功能实现正确性
- 测试覆盖率
- 文档完整性
- 性能影响
- 安全性考虑

### 7. 合并代码

- 通过所有CI检查
- 获得至少一个维护者的批准
- 解决所有审查意见
- 合并到目标分支

## 📝 代码规范

### TypeScript规范

#### 1. 类型定义

```typescript
// 优先使用interface而非type
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

// 避免使用any
const processData = (data: unknown) => {
  if (typeof data === 'string') {
    return data.toUpperCase();
  }
  throw new Error('Invalid data type');
};

// 使用泛型提高复用性
interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}
```

#### 2. 函数定义

```typescript
// 明确的返回类型
async function fetchUser(id: string): Promise<User | null> {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) {
    return null;
  }
  return response.json();
}

// 参数验证
function greet(name: string, greeting = 'Hello'): string {
  if (!name || name.trim().length === 0) {
    throw new Error('Name cannot be empty');
  }
  return `${greeting}, ${name}!`;
}
```

#### 3. 类定义

```typescript
class UserService {
  private repository: UserRepository;

  constructor(repository: UserRepository) {
    this.repository = repository;
  }

  async createUser(userData: CreateUserData): Promise<User> {
    // 参数验证
    this.validateUserData(userData);

    // 创建用户
    const user = await this.repository.create(userData);

    // 返回时移除敏感信息
    return this.sanitizeUser(user);
  }

  private validateUserData(userData: CreateUserData): void {
    if (!userData.email || !userData.name) {
      throw new ValidationError('Email and name are required');
    }
  }

  private sanitizeUser(user: User): User {
    const { passwordHash, ...sanitizedUser } = user as any;
    return sanitizedUser;
  }
}
```

### React组件规范

#### 1. 函数组件

```typescript
import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/utils/helpers';

interface ExampleComponentProps {
  title: string;
  onAction?: (data: any) => void;
  className?: string;
  children?: React.ReactNode;
}

export const ExampleComponent: React.FC<ExampleComponentProps> = ({
  title,
  onAction,
  className,
  children
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback(() => {
    setIsLoading(true);
    onAction?.({ title, isLoading: false });
    setIsLoading(false);
  }, [title, onAction, isLoading]);

  return (
    <div className={cn('example-component', className)}>
      <h2>{title}</h2>
      <button onClick={handleClick} disabled={isLoading}>
        {isLoading ? 'Processing...' : 'Click me'}
      </button>
      {children}
    </div>
  );
};

export default ExampleComponent;
```

#### 2. 自定义Hook

```typescript
import { useState, useCallback, useEffect } from 'react';

interface UseApiResult<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useApi<T>(
  fetcher: () => Promise<T>,
  dependencies: React.DependencyList = []
): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await fetcher();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    fetchData();
  }, [fetchData, ...dependencies]);

  return { data, isLoading, error, refetch: fetchData };
}
```

### 样式规范

#### 1. CSS类命名

```css
/* 使用BEM方法论 */
.component {
  /* 基础样式 */
}

.component__element {
  /* 元素样式 */
}

.component--modifier {
  /* 修饰符样式 */
}

/* Tailwind CSS组合 */
.flex-center {
  @apply flex items-center justify-center;
}

.text-primary {
  @apply text-blue-600 dark:text-blue-400;
}
```

#### 2. 组件样式

```typescript
// 使用CSS模块
import styles from './ExampleComponent.module.css';

export const ExampleComponent = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Title</h1>
    </div>
  );
};

// 或者使用Tailwind
export const ExampleComponent = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-gray-900">Title</h1>
    </div>
  );
};
```

## 🧪 测试规范

### 单元测试

```typescript
// services/core/AgenticCore.test.ts
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { AgenticCore } from '../AgenticCore';
import { mockEventBus } from '../__mocks__/eventBus';

describe('AgenticCore', () => {
  let agenticCore: AgenticCore;

  beforeEach(() => {
    agenticCore = new AgenticCore({
      eventBus: mockEventBus
    });
  });

  describe('initialization', () => {
    it('should initialize successfully', async () => {
      await expect(agenticCore.initialize()).resolves.toBeUndefined();
      expect(agenticCore.isInitialized()).toBe(true);
    });

    it('should emit initialized event', async () => {
      const spy = jest.spyOn(mockEventBus, 'emit');

      await agenticCore.initialize();

      expect(spy).toHaveBeenCalledWith('core:initialized', expect.any(Object));
    });
  });

  describe('goal management', () => {
    it('should create goal successfully', async () => {
      const goalDefinition = {
        title: 'Test Goal',
        description: 'Test Description',
        category: 'test',
        targetDate: new Date('2024-12-31')
      };

      const goal = await agenticCore.createGoal(goalDefinition);

      expect(goal).toBeDefined();
      expect(goal.title).toBe('Test Goal');
      expect(goal.status).toBe('active');
    });

    it('should update goal progress', async () => {
      const goal = await agenticCore.createGoal({
        title: 'Test Goal',
        description: 'Test Description',
        category: 'test'
      });

      await agenticCore.updateProgress(goal.id, 50);

      expect(goal.progress).toBe(50);
    });
  });
});
```

### 集成测试

```typescript
// tests/integration/api/chat.test.ts
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../../../main';

describe('Chat API', () => {
  let server: any;

  beforeAll(async () => {
    server = app.listen(0);
  });

  afterAll(async () => {
    await server.close();
  });

  describe('POST /api/ai/chat', () => {
    it('should return AI response', async () => {
      const response = await request(server)
        .post('/api/ai/chat')
        .send({
          message: 'Hello AI',
          mode: 'chat'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.message).toBeDefined();
    });

    it('should handle invalid input', async () => {
      const response = await request(server)
        .post('/api/ai/chat')
        .send({
          message: ''
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});
```

### E2E测试

```typescript
// tests/e2e/ai-widget.test.ts
import { test, expect } from '@playwright/test';
import { chromium } from 'playwright';

test.describe('AI Widget', () => {
  test('should load and display AI widget', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // 等待组件加载
    await page.waitForSelector('[data-testid="ai-widget"]');

    // 检查组件是否可见
    const widget = await page.locator('[data-testid="ai-widget"]');
    await expect(widget).toBeVisible();

    // 验证标题
    const title = await widget.locator('h2');
    await expect(title).toContainText('AI Assistant');
  });

  test('should handle user interaction', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // 输入消息
    await page.fill('[data-testid="message-input"]', 'Hello AI');

    // 点击发送按钮
    await page.click('[data-testid="send-button"]');

    // 等待AI回复
    await page.waitForSelector('[data-testid="ai-response"]');

    // 验证回复内容
    const response = await page.locator('[data-testid="ai-response"]');
    await expect(response).toBeVisible();
    await expect(response.textContent()).length.toBeGreaterThan(0);
  });
});
```

## 📚 文档贡献

### 文档类型

- **API文档**: 接口说明、参数定义、使用示例
- **架构文档**: 系统设计、技术选型、部署方案
- **用户指南**: 安装说明、使用教程、常见问题
- **开发者指南**: 开发环境、代码规范、贡献流程

### 文档规范

1. **Markdown格式**
   ```markdown
   # 标题层级1
   ## 标题层级2
   ### 标题层级3

   - 项目符号列表
   1. 有序列表
   2. 有序列表

   ```代码内联` 或 ```代码块```

   [链接文本](URL)
   ```

2. **文档结构**
   ```markdown
   # 页面标题

   ## 概述
   简要说明文档内容和目的

   ## 安装指南
   详细的安装步骤

   ## 使用示例
   实际的使用代码示例

   ## API参考
   详细的API文档
   ```

### 更新文档

- 代码变更时同步更新相关文档
- 新增功能时添加API文档
- 架构变更时更新架构文档
- 定期检查文档的准确性和完整性

## 🔍 代码审查指南

### 审查清单

#### 功能性检查
- [ ] 功能按需求实现
- [ ] 边界条件处理正确
- [ ] 错误处理完善
- [ ] 性能符合要求

#### 代码质量
- [ ] 遵循编码规范
- [ ] 类型定义完整
- [ ] 代码可读性好
- [ ] 代码复用性高

#### 测试覆盖
- [ ] 单元测试通过
- [ ] 集成测试覆盖主要流程
- [ ] E2E测试覆盖核心功能
- [ ] 测试用例有意义

#### 安全性
- [ ] 无安全漏洞
- [ ] 输入验证完善
- [ ] 敏感信息处理正确
- [ ] 权限控制合理

#### 性能
- [ ] 无性能瓶颈
- [ ] 资源使用合理
- [ ] 缓存策略有效
- [ ] 并发处理安全

### 审查要点

1. **代码结构**
   - 文件组织是否合理
   - 目录结构是否清晰
   - 模块依赖关系是否简单

2. **命名规范**
   - 变量和函数命名是否有意义
   - 类名和文件名是否一致
   - 常量是否使用大写

3. **错误处理**
   - 异常处理是否完整
   - 错误信息是否有帮助
   - 日志记录是否充分

4. **测试质量**
   - 测试覆盖率是否足够
   - 测试用例是否覆盖边界情况
   - 测试数据是否合理

## 🐛 报告Bug

### Bug报告模板

**问题描述**：
- 简要描述问题
- 复现步骤
- 期望行为
- 实际行为

**环境信息**：
- 操作系统
- 浏览器（如适用）
- Node.js版本
- 项目版本

**复现步骤**：
1. 步骤一
2. 步骤二
3. 步骤三

**附加信息**：
- 截图（如适用）
- 错误日志
- 相关链接

### 报告流程

1. 检查是否已有相关Issue
2. 创建新的Issue
3. 使用Bug报告模板
4. 添加相关标签
5. 等待维护者响应

## 💡 功能请求

### 功能请求模板

**功能描述**：
- 详细描述希望实现的功能
- 功能的使用场景
- 预期效果

**技术方案**：
- 建议的实现方案
- 技术选型理由
- 可能的替代方案

**优先级**：
- 低： nice to have
- 中： should have
- 高： must have
- 紧急： critical

### 请求流程

1. 讨论功能想法
2. 收集社区反馈
3. 确定技术方案
4. 制定实施计划
5. 开始开发实现

## 🏆 社区规范

### 行为准则

- **尊重他人**：友善沟通，尊重不同意见
- **建设性反馈**：提供建设性意见，避免负面评论
- **耐心等待**：维护者都是志愿者，回复可能需要时间
- **遵循规范**：遵循项目贡献指南和代码规范

### 沟通方式

- **GitHub Issues**: 技告Bug、功能请求、技术讨论
- **讨论区**: 技术讨论、设计评审
- **邮件联系**: admin@0379.email

## 📜 贡献者名单

感谢所有为YYC³智能插拔式移动AI系统做出贡献的开发者！

### 核心贡献者

- YYC³ Team - 项目创建者和维护团队

### 贡献统计

- 总贡献次数：持续更新中
- 贡献人数：持续增长中
- 最新发布：v1.0.0

## 🎉 致谢

感谢您为YYC³智能插拔式移动AI系统项目做出贡献！您的参与让这个项目变得更好。

### 获得认可

- 贡献者徽章
- 年度贡献者认证
- 技术分享机会

---

**让我们共同打造更优秀的YYC³智能插拔式移动AI系统！**

如有任何问题，请随时联系我们：

- 📧 Email: admin@0379.email
- 🌐 项目主页: https://github.com/YY-Nexus/yyc3-xy-03
- 💬 官时讨论: [Discord社区链接]

最后更新: 2024-01-01