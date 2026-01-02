# 代码规范与最佳实践 (DOC-DEV-002)

> 「YanYuCloudCube」
> 「<admin@0379.email>」
> 「言启象限，语枢未来」
> 「Words Initiate Quadrants, Language Serves as Core for the Future」
> 「All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence」

---

## 📋 文档信息

| 属性 | 内容 |
|------|------|
| **文档标题** | YYC³ AI小语系统代码规范与最佳实践 |
| **文档版本** | v1.0.0 |
| **创建时间** | 2025-12-08 |
| **最后更新** | 2025-12-08 |
| **适用对象** | 开发团队、代码审查者 |
| **技术栈** | TypeScript, React, Next.js, Bun |

---

## 🎯 代码规范概述

YYC³ AI小语系统采用严格的代码规范，确保代码质量、可维护性和团队协作效率。本文档定义了项目的技术标准、编码约定和最佳实践。

### 核心原则
- **可读性优先**: 代码应该易于理解和维护
- **一致性**: 统一的编码风格和模式
- **安全性**: 儿童安全优先的安全编码实践
- **性能**: 高效的代码实现
- **可测试性**: 易于测试的代码结构

---

## 📝 TypeScript 规范

### 1. 基础类型定义

#### 1.1 类型定义标准
```typescript
// ✅ 推荐：明确的类型定义
interface UserProfile {
  id: string;
  name: string;
  age: number;
  email: string;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt?: Date; // 可选属性
}

// ✅ 推荐：使用联合类型
type Theme = 'light' | 'dark' | 'auto';

// ✅ 推荐：泛型约束
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// ❌ 避免：使用 any
function processData(data: any): any {
  // 避免使用 any
}

// ✅ 推荐：使用 unknown 和类型守卫
function processData(data: unknown): unknown {
  if (typeof data === 'string') {
    return data.toUpperCase();
  }
  return data;
}
```

#### 1.2 类型别名和接口
```typescript
// ✅ 推荐：接口用于对象类型
interface User {
  id: string;
  name: string;
}

// ✅ 推荐：类型别名用于联合类型、函数类型
type UserID = string;
type CreateUser = (name: string) => Promise<User>;

// ✅ 推荐：扩展接口
interface AdminUser extends User {
  role: 'admin';
  permissions: string[];
}

// ❌ 避免：混淆使用接口和类型别名
type User = { // 应该使用 interface
  id: string;
  name: string;
};
```

### 2. 函数定义

#### 2.1 函数签名
```typescript
// ✅ 推荐：明确的函数签名
async function fetchUserData(
  userId: string,
  options?: {
    includeProfile?: boolean;
    timeout?: number;
  }
): Promise<UserProfile> {
  // 实现
}

// ✅ 推荐：箭头函数和返回类型
const formatUserName = (user: User): string => {
  return `${user.name} (${user.id})`;
};

// ✅ 推荐：泛型函数
function createApiResponse<T>(
  data: T,
  success: boolean = true
): ApiResponse<T> {
  return { data, success };
}

// ❌ 避免：缺少返回类型
function processUserData(user) { // 缺少类型
  return user.name;
}
```

#### 2.2 异步函数
```typescript
// ✅ 推荐：正确的异步处理
class UserService {
  async getUser(id: string): Promise<User | null> {
    try {
      const response = await fetch(`/api/users/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  }

  // ✅ 推荐：错误边界处理
  async safeGetUser(id: string): Promise<{ user: User | null; error: Error | null }> {
    try {
      const user = await this.getUser(id);
      return { user, error: null };
    } catch (error) {
      return { user: null, error: error as Error };
    }
  }
}
```

---

## ⚛️ React 组件规范

### 1. 组件定义

#### 1.1 函数组件标准
```typescript
// ✅ 推荐：明确的 props 接口
interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
  className?: string;
  children?: React.ReactNode;
}

// ✅ 推荐：函数组件定义
const UserCard: React.FC<UserCardProps> = ({
  user,
  onEdit,
  className = '',
  children
}) => {
  // 组件逻辑
  return (
    <div className={`user-card ${className}`}>
      <h3>{user.name}</h3>
      {children}
      {onEdit && (
        <button onClick={() => onEdit(user)}>
          Edit
        </button>
      )}
    </div>
  );
};

export default UserCard;
```

#### 1.2 Hooks 使用
```typescript
// ✅ 推荐：自定义 Hook
const useUserData = (userId: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await userService.getUser(userId);
        setUser(userData);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  return { user, loading, error };
};

// ✅ 推荐：在组件中使用自定义 Hook
const UserProfile: React.FC<{ userId: string }> = ({ userId }) => {
  const { user, loading, error } = useUserData(userId);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!user) return <div>User not found</div>;

  return <div>{user.name}</div>;
};
```

### 2. 组件最佳实践

#### 2.1 Props 传递
```typescript
// ✅ 推荐：使用展开操作符传递 props
const Button: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}> = ({
  children,
  variant = 'primary',
  disabled = false,
  onClick,
  className = '',
  ...props
}) => {
  const baseClass = `button ${variant} ${className}`;

  return (
    <button
      className={baseClass}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

// ✅ 推荐：使用 props 解构
const App: React.FC = () => {
  const handleClick = () => {
    console.log('Button clicked');
  };

  return (
    <Button
      variant="secondary"
      onClick={handleClick}
      className="custom-button"
    >
      Click me
    </Button>
  );
};
```

#### 2.2 条件渲染
```typescript
// ✅ 推荐：使用三元运算符进行简单条件渲染
const LoadingSpinner: React.FC<{ isLoading: boolean }> = ({ isLoading }) => {
  return (
    <div>
      {isLoading ? <div>Loading...</div> : <div>Content loaded</div>}
    </div>
  );
};

// ✅ 推荐：使用 && 运算符进行可选渲染
const OptionalComponent: React.FC<{ showWarning?: boolean }> = ({ showWarning }) => {
  return (
    <div>
      {showWarning && <div className="warning">Warning message</div>}
    </div>
  );
};

// ✅ 推荐：复杂条件使用函数
const UserStatus: React.FC<{ status: 'active' | 'inactive' | 'pending' }> = ({ status }) => {
  const getStatusMessage = () => {
    switch (status) {
      case 'active':
        return <span className="text-green">Active</span>;
      case 'inactive':
        return <span className="text-red">Inactive</span>;
      case 'pending':
        return <span className="text-yellow">Pending</span>;
      default:
        return null;
    }
  };

  return <div>Status: {getStatusMessage()}</div>;
};
```

---

## 🎨 样式规范

### 1. Tailwind CSS 使用

#### 1.1 类名组织
```typescript
// ✅ 推荐：使用 Tailwind CSS 类名
const Card: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`
      bg-white
      rounded-lg
      shadow-md
      p-6
      border
      border-gray-200
      ${className}
    `}>
      <h2 className="text-xl font-bold mb-4">Card Title</h2>
      <p className="text-gray-700">Card content goes here.</p>
    </div>
  );
};

// ✅ 推荐：使用 clsx 工具合并类名
import clsx from 'clsx';

const Button: React.FC<{
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({
  variant = 'primary',
  size = 'md',
  className = ''
}) => {
  const baseClasses = 'font-medium rounded transition-colors';

  const variantClasses = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300'
  };

  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      Button
    </button>
  );
};
```

#### 1.2 响应式设计
```typescript
// ✅ 推荐：响应式类名
const ResponsiveCard: React.FC = () => {
  return (
    <div className="
      p-4
      sm:p-6
      md:p-8
      lg:p-10
      bg-white
      rounded
      shadow-sm
      sm:shadow-md
      md:shadow-lg
    ">
      <h3 className="
        text-sm
        sm:text-base
        md:text-lg
        lg:text-xl
        font-bold
      ">
        Responsive Title
      </h3>
    </div>
  );
};
```

### 2. CSS-in-JS (如需要)

#### 2.1 使用 CSS 模块
```typescript
// styles.module.css
.card {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

// 组件中使用
import styles from './styles.module.css';

const StyledCard: React.FC = () => {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Styled Card</h3>
    </div>
  );
};
```

---

## 🗂️ 文件组织

### 1. 目录结构

#### 1.1 项目目录规范
```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/           # 路由组
│   ├── api/              # API 路由
│   ├── globals.css       # 全局样式
│   ├── layout.tsx        # 根布局
│   └── page.tsx          # 首页
├── components/           # React 组件
│   ├── ui/              # 基础 UI 组件
│   ├── features/        # 功能组件
│   └── layout/          # 布局组件
├── lib/                 # 工具库
│   ├── utils/           # 通用工具函数
│   ├── hooks/           # 自定义 Hooks
│   ├── services/        # API 服务
│   └── types/           # 类型定义
├── styles/              # 样式文件
├── types/               # 全局类型定义
└── public/              # 静态资源
```

#### 1.2 文件命名规范
```typescript
// ✅ 推荐：组件文件使用 PascalCase
components/
├── Button/
│   ├── Button.tsx
│   ├── Button.test.tsx
│   ├── Button.stories.tsx
│   └── index.ts
├── UserProfile/
│   ├── UserProfile.tsx
│   ├── UserProfile.test.tsx
│   └── index.ts

// ✅ 推荐：工具文件使用 camelCase
lib/
├── utils/
│   ├── formatDate.ts
│   ├── validateEmail.ts
│   └── constants.ts
├── hooks/
│   ├── useAuth.ts
│   └── useLocalStorage.ts

// ✅ 推荐：类型文件使用描述性命名
types/
├── user.ts
├── api.ts
└── common.ts
```

### 2. 导入导出规范

#### 2.1 导入顺序
```typescript
// ✅ 推荐：按类型分组导入
// 1. React 相关
import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';

// 2. 第三方库
import clsx from 'clsx';
import { AxiosError } from 'axios';

// 3. 内部模块 (按路径层级)
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { formatDate } from '@/lib/utils/formatDate';

// 4. 类型导入
import type { User, ApiResponse } from '@/types';
import type { UserProfileProps } from './UserProfile';
```

#### 2.2 导出规范
```typescript
// ✅ 推荐：命名导出
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// ✅ 推荐：类型导出
export type User = {
  id: string;
  name: string;
  email: string;
};

// ✅ 推荐：默认导出组件
export default UserProfile;

// ✅ 推荐：index.ts 文件统一导出
// components/ui/index.ts
export { default as Button } from './Button';
export { default as Input } from './Input';
export { default as Card } from './Card';
```

---

## 🔒 安全编码规范

### 1. 输入验证

#### 1.1 数据验证
```typescript
// ✅ 推荐：使用 Zod 进行数据验证
import { z } from 'zod';

const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  email: z.string().email(),
  age: z.number().min(0).max(150),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'auto']),
    notifications: z.boolean().default(true)
  })
});

type User = z.infer<typeof UserSchema>;

// 使用验证
const validateUser = (data: unknown): User => {
  return UserSchema.parse(data);
};
```

#### 1.2 API 参数验证
```typescript
// ✅ 推荐：API 路由参数验证
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // 验证必需参数
  const userId = searchParams.get('userId');
  if (!userId) {
    return NextResponse.json(
      { error: 'userId is required' },
      { status: 400 }
    );
  }

  // 验证参数格式
  if (!/^[a-f0-9-]{36}$/.test(userId)) {
    return NextResponse.json(
      { error: 'Invalid userId format' },
      { status: 400 }
    );
  }

  // 验证参数范围
  const limit = parseInt(searchParams.get('limit') || '10');
  if (limit > 100) {
    return NextResponse.json(
      { error: 'limit cannot exceed 100' },
      { status: 400 }
    );
  }

  // 处理请求
  const data = await fetchUserData(userId, { limit });
  return NextResponse.json(data);
}
```

### 2. 数据处理

#### 2.1 敏感数据处理
```typescript
// ✅ 推荐：敏感数据脱敏
interface SensitiveUserData {
  id: string;
  fullName: string;
  email: string;
  phone: string;
}

const sanitizeUserData = (userData: SensitiveUserData) => {
  return {
    id: userData.id,
    fullName: userData.fullName.charAt(0) + '***', // 只显示首字母
    email: userData.email.replace(/(.{2}).*(@.*)/, '$1***$2'),
    phone: userData.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
  };
};

// ✅ 推荐：环境变量使用
const config = {
  databaseUrl: process.env.DATABASE_URL!,
  jwtSecret: process.env.JWT_SECRET!,
  openaiApiKey: process.env.OPENAI_API_KEY!,
  isProduction: process.env.NODE_ENV === 'production'
};

// 确保必需的环境变量存在
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET', 'OPENAI_API_KEY'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}
```

#### 2.2 AI 安全处理
```typescript
// ✅ 推荐：AI 输入安全检查
class AIInputSanitizer {
  private static readonly UNSAFE_PATTERNS = [
    /javascript:/gi,
    /<script/gi,
    /on\w+\s*=/gi,
    /data:/gi
  ];

  static sanitizeInput(input: string): string {
    // 移除潜在的危险模式
    let sanitized = input;

    for (const pattern of this.UNSAFE_PATTERNS) {
      sanitized = sanitized.replace(pattern, '');
    }

    // 限制输入长度
    if (sanitized.length > 1000) {
      sanitized = sanitized.substring(0, 1000);
    }

    return sanitized.trim();
  }

  static validateForChildren(input: string, age: number): {
    safe: boolean;
    reason?: string;
  } {
    // 检查不当内容关键词
    const inappropriateKeywords = [
      'violence', 'weapon', 'adult content', 'self-harm',
      'drugs', 'alcohol', 'gambling'
    ];

    const lowerInput = input.toLowerCase();

    for (const keyword of inappropriateKeywords) {
      if (lowerInput.includes(keyword)) {
        return {
          safe: false,
          reason: `Contains inappropriate content: ${keyword}`
        };
      }
    }

    // 年龄适宜性检查
    if (age < 13 && this.isComplexInput(input)) {
      return {
        safe: false,
        reason: 'Input too complex for age group'
      };
    }

    return { safe: true };
  }

  private static isComplexInput(input: string): boolean {
    // 检查输入复杂度（概念性示例）
    return input.split(' ').length > 50 ||
           input.includes('metaphysics') ||
           input.includes('philosophy');
  }
}
```

---

## 🧪 测试规范

### 1. 单元测试

#### 1.1 测试文件结构
```typescript
// ✅ 推荐：测试文件组织
// utils/formatDate.test.ts
import { describe, it, expect } from 'bun:test';
import { formatDate } from './formatDate';

describe('formatDate', () => {
  it('should format date correctly', () => {
    const date = new Date('2023-12-08T10:30:00Z');
    const result = formatDate(date);
    expect(result).toBe('2023-12-08');
  });

  it('should handle invalid date', () => {
    const result = formatDate(new Date('invalid'));
    expect(result).toBe('');
  });

  it('should handle edge cases', () => {
    const edgeCases = [
      new Date('2000-01-01'),
      new Date('2099-12-31'),
      new Date()
    ];

    edgeCases.forEach(date => {
      const result = formatDate(date);
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });
});
```

#### 1.2 组件测试
```typescript
// ✅ 推荐：React 组件测试
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UserCard } from './UserCard';

const mockUser = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  age: 25
};

describe('UserCard', () => {
  it('should render user information correctly', () => {
    render(<UserCard user={mockUser} />);

    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', async () => {
    const mockOnEdit = jest.fn();
    render(<UserCard user={mockUser} onEdit={mockOnEdit} />);

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(mockOnEdit).toHaveBeenCalledWith(mockUser);
    });
  });

  it('should not show edit button when onEdit is not provided', () => {
    render(<UserCard user={mockUser} />);

    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
  });
});
```

### 2. 集成测试

#### 2.1 API 测试
```typescript
// ✅ 推荐：API 集成测试
import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import { app } from '../app';

describe('User API', () => {
  beforeAll(async () => {
    // 设置测试数据库
    await setupTestDatabase();
  });

  afterAll(async () => {
    // 清理测试数据库
    await cleanupTestDatabase();
  });

  it('should create user successfully', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      age: 25
    };

    const response = await app.request('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.name).toBe(userData.name);
    expect(data.email).toBe(userData.email);
  });

  it('should validate user input', async () => {
    const invalidUserData = {
      name: '', // 空名称
      email: 'invalid-email', // 无效邮箱
      age: -1 // 无效年龄
    };

    const response = await app.request('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidUserData)
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.errors).toBeDefined();
  });
});
```

---

## 📚 相关文档

- [开发环境设置指南](./01-SETUP_GUIDE.md)
- [测试策略文档](../TESTING/01-TESTING_STRATEGY.md)
- [安全架构文档](../SECURITY/01-SECURITY_ARCHITECTURE.md)
- [部署指南](./03-DEPLOYMENT_GUIDE.md)
- [贡献指南](./04-CONTRIBUTING.md)

---

**代码审查**: 所有代码变更必须经过代码审查，确保符合本规范。

**自动化检查**: 使用 ESLint、Prettier 和 TypeScript 进行自动化代码检查。

**持续学习**: 定期更新和改进代码规范，跟进最佳实践。

---

> 「YanYuCloudCube」
> 「<admin@0379.email>」
> 「言启象限，语枢未来」
> 「Words Initiate Quadrants, Language Serves as Core for the Future」
> 「All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence」