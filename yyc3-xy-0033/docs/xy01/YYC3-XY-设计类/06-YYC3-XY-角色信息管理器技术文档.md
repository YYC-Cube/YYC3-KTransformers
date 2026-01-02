# YYC3-XY-角色信息管理器技术文档

> @file YYC3-XY-角色信息管理器技术文档.md
> @description 详细说明角色信息管理器的架构设计、功能实现、API接口和使用方法
> @author YYC³
> @version 1.0.0
> @created 2025-01-30
> @updated 2025-01-30
> @status published
> @tags 角色管理,架构设计,技术文档,YYC³

---

## 目录

1. [系统概述](#系统概述)
2. [架构设计](#架构设计)
3. [核心模块](#核心模块)
4. [数据结构](#数据结构)
5. [API接口](#api接口)
6. [UI组件](#ui组件)
7. [验证机制](#验证机制)
8. [集成指南](#集成指南)
9. [使用示例](#使用示例)
10. [最佳实践](#最佳实践)
    - [10.1 性能优化](#101-性能优化)
    - [10.2 错误处理](#102-错误处理)
    - [10.3 日志管理](#103-日志管理)
    - [10.4 安全考虑](#104-安全考虑)
    - [10.5 可维护性](#105-可维护性)
    - [10.6 国际化支持](#106-国际化支持)
    - [10.7 单元测试](#107-单元测试)
11. [附录](#附录)

---

## 系统概述

### 1.1 功能定位

角色信息管理器是YYC³小语AI应用的核心组件，负责统一管理AI角色的配置信息、状态同步和用户个性化设置。系统采用单例模式确保角色配置的全局一致性，并提供完整的验证和自动修复机制。

### 1.2 核心特性

- **单例模式管理**：确保角色配置全局唯一性和一致性
- **性别差异化配置**：支持男女角色的独立配置和自动选择
- **动态主题生成**：基于角色属性自动生成个性化主题
- **表情上下文管理**：根据交互触发场景选择合适的表情
- **完整验证机制**：提供错误、警告和建议三级验证反馈
- **自动修复功能**：智能检测并修复角色配置问题
- **用户数据同步**：与用户档案信息实时同步更新

### 1.3 技术栈

- **编程语言**：TypeScript
- **框架**：React
- **状态管理**：React Hooks (useState, useEffect)
- **设计模式**：Singleton Pattern
- **数据验证**：自定义验证器类
- **UI组件**：Shadcn/ui
- **日志管理**：Winston (生产环境推荐)

### 1.4 日志使用规范

本系统使用专业的日志库替代console语句，确保生产环境的安全性和可维护性。

```typescript
// 导入日志工具
import { log } from '@/backend/src/config/logger'

// 日志级别使用示例
log.info('角色配置验证通过', { characterId: character.id })
log.error('验证失败', { errors })
log.warn('角色配置与用户档案不一致', { warnings })
log.debug('详细调试信息', { debugData })
```

**日志级别说明**：
- `log.error()`: 错误级别，必须立即处理的问题
- `log.warn()`: 警告级别，建议修复但不影响核心功能
- `log.info()`: 信息级别，记录重要的业务操作
- `log.debug()`: 调试级别，仅开发环境使用

---

## 架构设计

### 2.1 系统架构图

```
┌─────────────────────────────────────────────────────────────┐
│                      应用层 (UI Components)                    │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │         RoleInfoManager (角色信息管理器UI)                │  │
│  │  - 角色信息展示                                          │  │
│  │  - 编辑表单                                              │  │
│  │  - 验证结果展示                                          │  │
│  │  - 自动修复操作                                          │  │
│  └─────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    业务逻辑层 (Business Logic)                 │
│  ┌─────────────────────┐  ┌─────────────────────────────────┐ │
│  │ CharacterManager    │  │ CharacterInfoValidator         │ │
│  │ - 角色配置管理       │  │ - 配置验证                      │ │
│  │ - 缓存管理           │  │ - 一致性检查                    │ │
│  │ - 用户数据同步       │  │ - 自动修复                      │ │
│  │ - 主题生成           │  │ - 验证报告                      │ │
│  └─────────────────────┘  └─────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      数据层 (Data Layer)                      │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              CharacterConfig (角色配置数据)               │  │
│  │  - 基本信息                                              │  │
│  │  - 主题配置                                              │  │
│  │  - 表情配置                                              │  │
│  │  - 个性配置                                              │  │
│  │  - 语音设置                                              │  │
│  └─────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 设计模式

#### 2.2.1 单例模式 (Singleton Pattern)

**应用场景**：CharacterManager 和 CharacterInfoValidator

**实现原理**：
```typescript
export class CharacterManager {
  private static instance: CharacterManager
  private characterCache: Map<string, CharacterConfig> = new Map()

  private constructor() {
    this.initializeCharacters()
  }

  static getInstance(): CharacterManager {
    if (!CharacterManager.instance) {
      CharacterManager.instance = new CharacterManager()
    }
    return CharacterManager.instance
  }
}
```

**优势**：
- 确保全局只有一个实例
- 提供全局访问点
- 延迟初始化，节省资源
- 避免配置不一致问题

#### 2.2.2 工厂模式 (Factory Pattern)

**应用场景**：角色配置创建和个性化定制

**实现原理**：
```typescript
getCharacterForUser(child?: Child | null): CharacterConfig {
  if (!child) {
    return this.characterCache.get('female')!
  }

  const gender = child.gender === 'male' || child.gender === 'female'
    ? child.gender
    : 'female'

  const character = this.characterCache.get(gender)!

  return {
    ...character,
    name: child.name || character.defaultName,
    age: child.birthday ? this.calculateAge(child.birthday) : character.age,
    birthday: child.birthday ? {
      lunar: this.convertToLunar(child.birthday),
      solar: child.birthday.toISOString().split('T')[0]
    } : character.birthday,
    zodiac: child.birthday ? this.calculateZodiac(child.birthday) : character.zodiac
  }
}
```

### 2.3 数据流设计

```
用户档案数据 (Child)
      ↓
CharacterManager.getCharacterForUser()
      ↓
角色配置 (CharacterConfig)
      ↓
CharacterInfoValidator.validateCharacterConfig()
      ↓
验证结果 (ValidationResult)
      ↓
UI展示 (RoleInfoManager)
```

---

## 核心模块

### 3.1 CharacterManager (角色管理器)

#### 3.1.1 模块职责

- 管理所有AI角色的配置信息
- 提供角色配置的缓存机制
- 实现角色配置的初始化和更新
- 根据用户信息自动选择合适的角色
- 生成个性化主题和表情配置

#### 3.1.2 核心方法

##### getInstance()

获取角色管理器的单例实例。

```typescript
static getInstance(): CharacterManager
```

**返回值**：CharacterManager 实例

**示例**：
```typescript
const characterManager = CharacterManager.getInstance()
```

##### getCharacterByGender()

根据性别获取角色配置。

```typescript
getCharacterByGender(gender: 'male' | 'female'): CharacterConfig
```

**参数**：
- `gender`: 性别 ('male' | 'female')

**返回值**：CharacterConfig 角色配置对象

**异常**：当找不到对应性别的角色配置时抛出错误

**示例**：
```typescript
const maleCharacter = characterManager.getCharacterByGender('male')
const femaleCharacter = characterManager.getCharacterByGender('female')
```

##### getCharacterForUser()

根据用户信息自动选择并定制角色配置。

```typescript
getCharacterForUser(child?: Child | null): CharacterConfig
```

**参数**：
- `child`: 用户档案信息 (可选)

**返回值**：CharacterConfig 个性化角色配置对象

**功能说明**：
- 如果没有提供用户信息，返回默认女性角色
- 根据用户性别选择对应角色
- 使用用户姓名更新角色名称
- 根据用户生日计算年龄、星座和农历生日
- 生成包含用户信息的个性化角色配置

**示例**：
```typescript
const child = {
  id: 'child-001',
  name: '小明',
  gender: 'male',
  birthday: new Date('2018-05-15')
}

const personalizedCharacter = characterManager.getCharacterForUser(child)
```

##### getCurrentCharacter()

获取当前激活的角色配置。

```typescript
getCurrentCharacter(): CharacterConfig | null
```

**返回值**：当前角色配置，如果没有则返回 null

##### setCurrentChild()

设置当前用户档案。

```typescript
setCurrentChild(child: Child | null): void
```

**参数**：
- `child`: 用户档案信息

**功能说明**：
- 更新当前用户档案
- 根据用户信息自动更新角色配置
- 触发角色配置的重新计算

##### getCurrentChild()

获取当前用户档案。

```typescript
getCurrentChild(): Child | null
```

**返回值**：当前用户档案，如果没有则返回 null

##### updateCharacter()

更新角色配置信息。

```typescript
updateCharacter(updates: Partial<CharacterConfig>): void
```

**参数**：
- `updates`: 部分角色配置更新

**功能说明**：
- 更新当前角色配置的指定字段
- 保持未指定字段不变
- 触发配置变更事件

##### getTheme()

获取角色主题配置。

```typescript
getTheme(): ThemeConfig
```

**返回值**：主题配置对象

##### getExpression()

根据触发场景获取表情配置。

```typescript
getExpression(trigger: ExpressionTrigger): ExpressionConfig
```

**参数**：
- `trigger`: 表情触发场景

**返回值**：表情配置对象

**触发场景类型**：
- `greeting`: 问候
- `celebration`: 庆祝
- `encouragement`: 鼓励
- `comfort`: 安慰
- `thinking`: 思考
- `listening`: 聆听

#### 3.1.3 私有方法

##### initializeCharacters()

初始化所有角色配置。

```typescript
private initializeCharacters(): void
```

**功能说明**：
- 创建男性角色配置
- 创建女性角色配置
- 将配置存储到缓存中

##### calculateAge()

根据生日计算年龄。

```typescript
private calculateAge(birthday: Date): number
```

**参数**：
- `birthday`: 生日日期

**返回值**：年龄（周岁）

##### calculateZodiac()

根据生日计算星座。

```typescript
private calculateZodiac(birthday: Date): string
```

**参数**：
- `birthday`: 生日日期

**返回值**：星座名称

##### convertToLunar()

将公历日期转换为农历日期。

```typescript
private convertToLunar(date: Date): string
```

**参数**：
- `date`: 公历日期

**返回值**：农历日期字符串

#### 3.1.4 角色配置初始化实现

##### 沫语（小语）角色配置

```typescript
const xiaoyuConfig: CharacterConfig = {
  id: 'xiaoyu',
  name: '小语',
  defaultName: '沫语',
  gender: 'female',
  age: 1,
  birthday: {
    lunar: '十一月初十',
    solar: '2024-12-10'
  },
  zodiac: '射手座',
  themes: [
    {
      id: 'xiaoyu-pink',
      name: '粉红洛丽塔',
      description: '沫语的粉红洛丽塔主题',
      colors: {
        primary: '#FFB6C1',
        secondary: '#FFC0CB',
        accent: '#FF69B4',
        background: '#FFF0F5',
        surface: '#FFFFFF',
        text: '#333333',
        textSecondary: '#666666'
      },
      typography: {
        fontFamily: 'Noto Sans SC, sans-serif',
        fontSize: {
          xs: '0.75rem',
          sm: '0.875rem',
          base: '1rem',
          lg: '1.125rem',
          xl: '1.25rem',
          '2xl': '1.5rem',
          '3xl': '1.875rem'
        },
        fontWeight: {
          normal: '400',
          medium: '500',
          semibold: '600',
          bold: '700'
        }
      }
    },
    {
      id: 'xiaoyu-blue',
      name: '蓝色洛丽塔',
      description: '沫语的蓝色洛丽塔主题',
      colors: {
        primary: '#87CEEB',
        secondary: '#B0E0E6',
        accent: '#4682B4',
        background: '#F0F8FF',
        surface: '#FFFFFF',
        text: '#333333',
        textSecondary: '#666666'
      },
      typography: {
        fontFamily: 'Noto Sans SC, sans-serif',
        fontSize: {
          xs: '0.75rem',
          sm: '0.875rem',
          base: '1rem',
          lg: '1.125rem',
          xl: '1.25rem',
          '2xl': '1.5rem',
          '3xl': '1.875rem'
        },
        fontWeight: {
          normal: '400',
          medium: '500',
          semibold: '600',
          bold: '700'
        }
      }
    }
  ],
  currentTheme: 'xiaoyu-pink',
  expressions: [
    {
      id: 'greeting',
      name: '问候',
      trigger: 'greeting',
      imagePath: '/public/role-photos/girl/xiaoyu-lolita-pink-008.png',
      description: '沫语问候时的表情'
    },
    {
      id: 'celebration',
      name: '庆祝',
      trigger: 'celebration',
      imagePath: '/public/role-photos/girl/xiaoyu-lolita-pink-009.png',
      description: '沫语庆祝时的表情'
    },
    {
      id: 'encouragement',
      name: '鼓励',
      trigger: 'encouragement',
      imagePath: '/public/role-photos/girl/xiaoyu-lolita-pink-010.png',
      description: '沫语鼓励时的表情'
    },
    {
      id: 'comfort',
      name: '安慰',
      trigger: 'comfort',
      imagePath: '/public/role-photos/girl/xiaoyu-lolita-pink-011.png',
      description: '沫语安慰时的表情'
    },
    {
      id: 'thinking',
      name: '思考',
      trigger: 'thinking',
      imagePath: '/public/role-photos/girl/xiaoyu-lolita-pink-012.png',
      description: '沫语思考时的表情'
    },
    {
      id: 'listening',
      name: '聆听',
      trigger: 'listening',
      imagePath: '/public/role-photos/girl/xiaoyu-lolita-pink-013.png',
      description: '沫语聆听时的表情'
    }
  ],
  personality: {
    traits: {
      friendliness: 0.95,
      curiosity: 0.9,
      empathy: 0.85,
      creativity: 0.8,
      patience: 0.75,
      playfulness: 0.9
    },
    description: '沫语是一个活泼可爱的小女孩，充满好奇心和创造力，喜欢与人交流，富有同理心。',
    preferences: ['粉色', '洛丽塔风格', '童话故事', '音乐', '绘画'],
    dislikes: ['孤独', '黑暗', '严厉的批评']
  },
  voiceSettings: {
    enabled: true,
    voiceId: 'xiaoyu-female',
    pitch: 1.2,
    speed: 1.0,
    volume: 0.9,
    language: 'zh-CN',
    accent: 'standard'
  },
  avatarPath: '/public/role-photos/girl/ai-avatars/girl-xiaoyu-lolita-pink-001.png',
  images: {
    homePage: '/public/role-photos/girl/xiaoyu-lolita-pink-001.png',
    growthRecord: '/public/role-photos/girl/xiaoyu-lolita-pink-002.png',
    profileInfo: '/public/role-photos/girl/xiaoyu-lolita-pink-003.png',
    settings: '/public/role-photos/girl/xiaoyu-lolita-pink-004.png',
    aiAvatar: '/public/role-photos/girl/ai-avatars/girl-xiaoyu-lolita-pink-001.png',
    jointAvatar: '/public/role-photos/joint-avatars/xiaoyan-boy-xiaoyu-girl-cute-001-joint-avatar.png',
    additionalImages: [
      '/public/role-photos/girl/xiaoyu-lolita-pink-005.png',
      '/public/role-photos/girl/xiaoyu-lolita-pink-006.png',
      '/public/role-photos/girl/xiaoyu-lolita-pink-007.png',
      '/public/role-photos/girl/xiaoyu-lolita-blue-008.png',
      '/public/role-photos/girl/xiaoyu-lolita-blue-009.png',
      '/public/role-photos/girl/xiaoyu-lolita-blue-010.png',
      '/public/role-photos/girl/xiaoyu-lolita-blue-011.png',
      '/public/role-photos/girl/xiaoyu-lolita-blue-012.png',
      '/public/role-photos/girl/xiaoyu-lolita-blue-013.png'
    ]
  },
  createdAt: new Date('2025-01-30'),
  updatedAt: new Date('2025-01-30')
}
```

##### 沫言（小言）角色配置

```typescript
const xiaoyanConfig: CharacterConfig = {
  id: 'xiaoyan',
  name: '小言',
  defaultName: '沫言',
  gender: 'male',
  age: 10,
  birthday: {
    lunar: '八月十九',
    solar: '2015-10-01'
  },
  zodiac: '天秤座',
  themes: [
    {
      id: 'xiaoyan-casual',
      name: '休闲风格',
      description: '沫言的休闲风格主题',
      colors: {
        primary: '#4A90E2',
        secondary: '#5BA3F5',
        accent: '#2E7D32',
        background: '#F5F5F5',
        surface: '#FFFFFF',
        text: '#333333',
        textSecondary: '#666666'
      },
      typography: {
        fontFamily: 'Noto Sans SC, sans-serif',
        fontSize: {
          xs: '0.75rem',
          sm: '0.875rem',
          base: '1rem',
          lg: '1.125rem',
          xl: '1.25rem',
          '2xl': '1.5rem',
          '3xl': '1.875rem'
        },
        fontWeight: {
          normal: '400',
          medium: '500',
          semibold: '600',
          bold: '700'
        }
      }
    },
    {
      id: 'xiaoyan-cool',
      name: '酷炫风格',
      description: '沫言的酷炫风格主题',
      colors: {
        primary: '#2C3E50',
        secondary: '#34495E',
        accent: '#E74C3C',
        background: '#ECF0F1',
        surface: '#FFFFFF',
        text: '#2C3E50',
        textSecondary: '#7F8C8D'
      },
      typography: {
        fontFamily: 'Noto Sans SC, sans-serif',
        fontSize: {
          xs: '0.75rem',
          sm: '0.875rem',
          base: '1rem',
          lg: '1.125rem',
          xl: '1.25rem',
          '2xl': '1.5rem',
          '3xl': '1.875rem'
        },
        fontWeight: {
          normal: '400',
          medium: '500',
          semibold: '600',
          bold: '700'
        }
      }
    }
  ],
  currentTheme: 'xiaoyan-casual',
  expressions: [
    {
      id: 'greeting',
      name: '问候',
      trigger: 'greeting',
      imagePath: '/public/role-photos/boy/xiaoyan-casual-008.png',
      description: '沫言问候时的表情'
    },
    {
      id: 'celebration',
      name: '庆祝',
      trigger: 'celebration',
      imagePath: '/public/role-photos/boy/xiaoyan-casual-009.png',
      description: '沫言庆祝时的表情'
    },
    {
      id: 'encouragement',
      name: '鼓励',
      trigger: 'encouragement',
      imagePath: '/public/role-photos/boy/xiaoyan-casual-010.png',
      description: '沫言鼓励时的表情'
    },
    {
      id: 'comfort',
      name: '安慰',
      trigger: 'comfort',
      imagePath: '/public/role-photos/boy/xiaoyan-casual-011.png',
      description: '沫言安慰时的表情'
    },
    {
      id: 'thinking',
      name: '思考',
      trigger: 'thinking',
      imagePath: '/public/role-photos/boy/xiaoyan-casual-012.png',
      description: '沫言思考时的表情'
    },
    {
      id: 'listening',
      name: '聆听',
      trigger: 'listening',
      imagePath: '/public/role-photos/boy/xiaoyan-casual-013.png',
      description: '沫言聆听时的表情'
    }
  ],
  personality: {
    traits: {
      friendliness: 0.85,
      curiosity: 0.8,
      empathy: 0.75,
      creativity: 0.85,
      patience: 0.7,
      playfulness: 0.75
    },
    description: '沫言是一个聪明活泼的小男孩，富有创造力和好奇心，喜欢探索新事物，善于思考。',
    preferences: ['蓝色', '科技', '探索', '运动', '音乐'],
    dislikes: ['无聊', '重复', '不公正']
  },
  voiceSettings: {
    enabled: true,
    voiceId: 'xiaoyan-male',
    pitch: 1.0,
    speed: 1.1,
    volume: 0.85,
    language: 'zh-CN',
    accent: 'standard'
  },
  avatarPath: '/public/role-photos/boy/ai-avatars/boy-xiaoyan-casual-001.png',
  images: {
    homePage: '/public/role-photos/boy/xiaoyan-casual-001.png',
    growthRecord: '/public/role-photos/boy/xiaoyan-casual-002.png',
    profileInfo: '/public/role-photos/boy/xiaoyan-casual-003.png',
    settings: '/public/role-photos/boy/xiaoyan-casual-004.png',
    aiAvatar: '/public/role-photos/boy/ai-avatars/boy-xiaoyan-casual-001.png',
    jointAvatar: '/public/role-photos/joint-avatars/xiaoyan-boy-xiaoyu-girl-cute-001-joint-avatar.png',
    additionalImages: [
      '/public/role-photos/boy/xiaoyan-casual-005.png',
      '/public/role-photos/boy/xiaoyan-casual-006.png',
      '/public/role-photos/boy/xiaoyan-casual-007.png',
      '/public/role-photos/boy/xiaoyan-cool-008.png',
      '/public/role-photos/boy/xiaoyan-cool-009.png',
      '/public/role-photos/boy/xiaoyan-cool-010.png',
      '/public/role-photos/boy/xiaoyan-cool-011.png',
      '/public/role-photos/boy/xiaoyan-cool-012.png',
      '/public/role-photos/boy/xiaoyan-cool-013.png'
    ]
  },
  createdAt: new Date('2025-01-30'),
  updatedAt: new Date('2025-01-30')
}
```

##### 角色配置初始化方法实现

```typescript
private initializeCharacters(): void {
  this.characterCache.set('xiaoyu', xiaoyuConfig)
  this.characterCache.set('xiaoyan', xiaoyanConfig)
  this.characterCache.set('female', xiaoyuConfig)
  this.characterCache.set('male', xiaoyanConfig)
}
```

##### 性别自动映射函数

```typescript
getCharacterByGender(gender: 'male' | 'female'): CharacterConfig {
  const character = this.characterCache.get(gender)
  
  if (!character) {
    throw new Error(`找不到性别为 ${gender} 的角色配置`)
  }
  
  return character
}

getCharacterForUser(child?: Child | null): CharacterConfig {
  if (!child) {
    return this.characterCache.get('female')!
  }

  const gender = child.gender === 'male' || child.gender === 'female'
    ? child.gender
    : 'female'

  const character = this.characterCache.get(gender)!

  return {
    ...character,
    name: child.name || character.defaultName,
    age: child.birthday ? this.calculateAge(child.birthday) : character.age,
    birthday: child.birthday ? {
      lunar: this.convertToLunar(child.birthday),
      solar: child.birthday.toISOString().split('T')[0]
    } : character.birthday,
    zodiac: child.birthday ? this.calculateZodiac(child.birthday) : character.zodiac
  }
}
```

##### 全局UI元素自动映射

```typescript
interface CharacterImages {
  homePage: string
  growthRecord: string
  profileInfo: string
  settings: string
  aiAvatar: string
  jointAvatar: string
  additionalImages: string[]
}

function getCharacterImages(gender: 'male' | 'female'): CharacterImages {
  const character = CharacterManager.getInstance().getCharacterByGender(gender)
  return character.images
}

function getCharacterAvatar(gender: 'male' | 'female'): string {
  const character = CharacterManager.getInstance().getCharacterByGender(gender)
  return character.avatarPath
}

function getCharacterTheme(gender: 'male' | 'female'): ThemeConfig {
  const character = CharacterManager.getInstance().getCharacterByGender(gender)
  const currentThemeId = character.currentTheme || character.themes[0].id
  const theme = character.themes.find(t => t.id === currentThemeId)
  return theme || character.themes[0]
}
```

### 3.2 CharacterInfoValidator (角色信息验证器)

#### 3.2.1 模块职责

- 验证角色配置的完整性和准确性
- 检查角色配置与用户档案的一致性
- 提供详细的验证报告
- 自动修复角色配置问题
- 生成改进建议

#### 3.2.2 核心方法

##### getInstance()

获取角色信息验证器的单例实例。

```typescript
static getInstance(): CharacterInfoValidator
```

**返回值**：CharacterInfoValidator 实例

##### validateCharacterConfig()

验证角色配置的完整性和准确性。

```typescript
validateCharacterConfig(character: CharacterConfig): ValidationResult
```

**参数**：
- `character`: 角色配置对象

**返回值**：ValidationResult 验证结果对象

**验证项**：
1. **基本信息验证**
   - 必需字段存在性检查
   - 字段类型验证
   - 字段值范围验证

2. **主题配置验证**
   - 主题颜色格式验证
   - 字体配置有效性检查
   - 主题一致性验证

3. **表情配置验证**
   - 表情图片路径有效性
   - 表情触发场景完整性
   - 表情配置一致性

4. **个性配置验证**
   - 个性特征值范围检查
   - 个性配置合理性
   - 个性描述完整性

5. **语音设置验证**
   - 语音配置有效性
   - 语音参数范围检查
   - 语音配置一致性

6. **图片路径验证**
   - 图片文件存在性
   - 图片格式有效性
   - 图片路径正确性

**返回值结构**：
```typescript
interface ValidationResult {
  isValid: boolean                    // 是否通过验证
  errors: ValidationError[]           // 错误列表
  warnings: ValidationWarning[]       // 警告列表
  suggestions: ValidationSuggestion[] // 建议列表
}
```

**示例**：
```typescript
import { log } from '@/backend/src/config/logger'

const character = characterManager.getCharacterByGender('female')
const validationResult = characterValidator.validateCharacterConfig(character)

if (validationResult.isValid) {
  log.info('角色配置验证通过', { characterId: character.id })
} else {
  log.error('验证失败', { errors: validationResult.errors })
  validationResult.errors.forEach(error => {
    log.error(`- ${error.field}: ${error.message}`)
  })
}
```

##### validateChildCharacterConsistency()

验证角色配置与用户档案的一致性。

```typescript
validateChildCharacterConsistency(child: Child, character: CharacterConfig): ValidationResult
```

**参数**：
- `child`: 用户档案信息
- `character`: 角色配置对象

**返回值**：ValidationResult 验证结果对象

**验证项**：
1. 性别一致性检查
2. 姓名同步验证
3. 年龄一致性验证
4. 生日信息一致性检查
5. 星座信息验证

**示例**：
```typescript
import { log } from '@/backend/src/config/logger'

const child = {
  id: 'child-001',
  name: '小明',
  gender: 'male',
  birthday: new Date('2018-05-15')
}

const character = characterManager.getCharacterForUser(child)
const validationResult = characterValidator.validateChildCharacterConsistency(child, character)

if (!validationResult.isValid) {
  log.warn('角色配置与用户档案不一致', { warnings: validationResult.warnings })
  validationResult.warnings.forEach(warning => {
    log.warn(`- ${warning.field}: ${warning.message}`)
  })
}
```

##### autoFixCharacterConfig()

自动修复角色配置问题。

```typescript
autoFixCharacterConfig(character: CharacterConfig): CharacterConfig
```

**参数**：
- `character`: 角色配置对象

**返回值**：修复后的角色配置对象

**自动修复项**：
1. **基本信息修复**
   - 添加缺失的必需字段
   - 修正无效的字段值
   - 设置合理的默认值

2. **主题配置修复**
   - 修正无效的颜色值
   - 补充缺失的主题配置
   - 统一主题格式

3. **表情配置修复**
   - 修正无效的表情路径
   - 补充缺失的表情配置
   - 统一表情格式

4. **个性配置修复**
   - 修正超出范围的个性值
   - 补充缺失的个性配置
   - 统一个性格式

5. **语音设置修复**
   - 修正无效的语音参数
   - 补充缺失的语音配置
   - 统一语音格式

6. **图片路径修复**
   - 修正无效的图片路径
   - 统一图片路径格式
   - 添加默认图片

**示例**：
```typescript
import { log } from '@/backend/src/config/logger'

const character = characterManager.getCharacterByGender('female')
const fixedCharacter = characterValidator.autoFixCharacterConfig(character)

// 重新验证修复后的配置
const validationResult = characterValidator.validateCharacterConfig(fixedCharacter)
log.info('修复后验证结果', { isValid: validationResult.isValid })
```

##### generateValidationReport()

生成详细的验证报告。

```typescript
generateValidationReport(validationResult: ValidationResult): string
```

**参数**：
- `validationResult`: 验证结果对象

**返回值**：格式化的验证报告字符串

**报告格式**：
```
角色配置验证报告
==================

验证状态: 通过/失败

错误 (0):
- 无错误

警告 (0):
- 无警告

建议 (0):
- 无建议
```

**示例**：
```typescript
import { log } from '@/backend/src/config/logger'

const character = characterManager.getCharacterByGender('female')
const validationResult = characterValidator.validateCharacterConfig(character)
const report = characterValidator.generateValidationReport(validationResult)

log.info('验证报告', { report })
```

#### 3.2.3 私有方法

##### validateBasicInfo()

验证角色基本信息。

```typescript
private validateBasicInfo(
  character: CharacterConfig,
  errors: ValidationError[],
  warnings: ValidationWarning[],
  suggestions: ValidationSuggestion[]
): void
```

##### validateThemes()

验证主题配置。

```typescript
private validateThemes(
  character: CharacterConfig,
  errors: ValidationError[],
  warnings: ValidationWarning[],
  suggestions: ValidationSuggestion[]
): void
```

##### validateExpressions()

验证表情配置。

```typescript
private validateExpressions(
  character: CharacterConfig,
  errors: ValidationError[],
  warnings: ValidationWarning[],
  suggestions: ValidationSuggestion[]
): void
```

##### validatePersonality()

验证个性配置。

```typescript
private validatePersonality(
  character: CharacterConfig,
  errors: ValidationError[],
  warnings: ValidationWarning[],
  suggestions: ValidationSuggestion[]
): void
```

##### validateVoiceSettings()

验证语音设置。

```typescript
private validateVoiceSettings(
  character: CharacterConfig,
  errors: ValidationError[],
  warnings: ValidationWarning[],
  suggestions: ValidationSuggestion[]
): void
```

##### validateImagePaths()

验证图片路径。

```typescript
private validateImagePaths(
  character: CharacterConfig,
  errors: ValidationError[],
  warnings: ValidationWarning[],
  suggestions: ValidationSuggestion[]
): void
```

---

## 数据结构

### 4.1 CharacterConfig (角色配置)

```typescript
interface CharacterConfig {
  // 基本信息
  id: string                          // 角色唯一标识
  name: string                        // 角色名称
  defaultName: string                 // 默认名称
  gender: 'male' | 'female'           // 性别
  age: number                         // 年龄
  birthday?: BirthdayInfo             // 生日信息
  zodiac?: string                     // 星座
  
  // 主题配置
  themes: ThemeConfig[]               // 主题配置列表
  currentTheme?: string               // 当前主题ID
  
  // 表情配置
  expressions: ExpressionConfig[]     // 表情配置列表
  
  // 个性配置
  personality: PersonalityConfig      // 个性配置
  
  // 语音设置
  voiceSettings: VoiceSettings        // 语音设置
  
  // 图片路径
  avatarPath: string                  // 头像路径
  images: CharacterImages             // 角色图片集合
  
  // 元数据
  createdAt: Date                     // 创建时间
  updatedAt: Date                     // 更新时间
}
```

### 4.2 BirthdayInfo (生日信息)

```typescript
interface BirthdayInfo {
  lunar: string                       // 农历生日 (格式: "YYYY-MM-DD")
  solar: string                       // 公历生日 (格式: "YYYY-MM-DD")
}
```

### 4.3 ThemeConfig (主题配置)

```typescript
interface ThemeConfig {
  id: string                          // 主题ID
  name: string                        // 主题名称
  description: string                 // 主题描述
  
  // 颜色配置
  colors: {
    primary: string                   // 主色调
    secondary: string                 // 次要色调
    accent: string                    // 强调色
    background: string                // 背景色
    surface: string                   // 表面色
    text: string                      // 文本色
    textSecondary: string             // 次要文本色
  }
  
  // 字体配置
  typography: {
    fontFamily: string                // 字体族
    fontSize: {
      xs: string                      // 超小字号
      sm: string                      // 小字号
      md: string                      // 中等字号
      lg: string                      // 大字号
      xl: string                      // 超大字号
    }
    fontWeight: {
      normal: string                  // 正常字重
      medium: string                  // 中等字重
      bold: string                    // 粗体字重
    }
  }
  
  // 间距配置
  spacing: {
    xs: string                        // 超小间距
    sm: string                        // 小间距
    md: string                        // 中等间距
    lg: string                        // 大间距
    xl: string                        // 超大间距
  }
  
  // 阴影配置
  shadows: {
    sm: string                        // 小阴影
    md: string                        // 中等阴影
    lg: string                        // 大阴影
  }
  
  // 圆角配置
  borderRadius: {
    sm: string                        // 小圆角
    md: string                        // 中等圆角
    lg: string                        // 大圆角
    full: string                      // 完全圆角
  }
}
```

### 4.4 ExpressionConfig (表情配置)

```typescript
interface ExpressionConfig {
  id: string                          // 表情ID
  name: string                        // 表情名称
  trigger: ExpressionTrigger          // 触发场景
  
  // 表情图片
  images: {
    normal: string                    // 正常状态图片
    animated?: string                // 动画图片
    thumbnail?: string               // 缩略图
  }
  
  // 表情描述
  description: string                 // 表情描述
  
  // 使用场景
  contexts: string[]                  // 适用场景列表
  
  // 动画配置
  animation?: {
    duration: number                  // 动画时长 (ms)
    delay?: number                    // 延迟时间 (ms)
    easing?: string                   // 缓动函数
  }
}

type ExpressionTrigger = 
  | 'greeting'                        // 问候
  | 'celebration'                     // 庆祝
  | 'encouragement'                   // 鼓励
  | 'comfort'                         // 安慰
  | 'thinking'                        // 思考
  | 'listening'                       // 聆听
```

### 4.5 PersonalityConfig (个性配置)

```typescript
interface PersonalityConfig {
  // 个性特征值 (0-100)
  traits: {
    friendliness: number              // 友善度
    intelligence: number              // 智力
    creativity: number                // 创造力
    patience: number                  // 耐心
    humor: number                     // 幽默感
    empathy: number                   // 同理心
    curiosity: number                 // 好奇心
    confidence: number                // 自信度
  }
  
  // 个性描述
  description: string                 // 个性描述
  
  // 个性标签
  tags: string[]                      // 个性标签
  
  // 对话风格
  conversationStyle: {
    tone: string                      // 语气
    formality: 'formal' | 'casual' | 'friendly'  // 正式程度
    emojiUsage: 'frequent' | 'moderate' | 'rare' // 表情使用频率
  }
}
```

### 4.6 VoiceSettings (语音设置)

```typescript
interface VoiceSettings {
  // 语音配置
  voice: {
    id: string                        // 语音ID
    name: string                      // 语音名称
    gender: 'male' | 'female' | 'neutral'  // 性别
    language: string                  // 语言
    accent?: string                   // 口音
  }
  
  // 语音参数
  parameters: {
    rate: number                      // 语速 (0.5-2.0)
    pitch: number                     // 音调 (0.5-2.0)
    volume: number                    // 音量 (0.0-1.0)
  }
  
  // 语音效果
  effects?: {
    reverb?: number                   // 混响 (0.0-1.0)
    echo?: number                     // 回声 (0.0-1.0)
  }
}
```

### 4.7 CharacterImages (角色图片集合)

```typescript
interface CharacterImages {
  // 头像图片
  avatar: {
    small: string                     // 小头像
    medium: string                    // 中等头像
    large: string                     // 大头像
  }
  
  // 表情图片
  expressions: {
    [key: string]: string             // 表情ID -> 图片路径
  }
  
  // 场景图片
  scenes: {
    [key: string]: string             // 场景ID -> 图片路径
  }
  
  // 动画图片
  animations: {
    [key: string]: string             // 动画ID -> 图片路径
  }
}
```

### 4.8 ValidationResult (验证结果)

```typescript
interface ValidationResult {
  isValid: boolean                    // 是否通过验证
  errors: ValidationError[]           // 错误列表
  warnings: ValidationWarning[]       // 警告列表
  suggestions: ValidationSuggestion[] // 建议列表
}

interface ValidationError {
  field: string                       // 字段名
  message: string                     // 错误信息
  code?: string                       // 错误代码
  severity: 'critical' | 'high' | 'medium' | 'low'  // 严重程度
}

interface ValidationWarning {
  field: string                       // 字段名
  message: string                     // 警告信息
  code?: string                       // 警告代码
  severity: 'high' | 'medium' | 'low'  // 严重程度
}

interface ValidationSuggestion {
  field: string                       // 字段名
  message: string                     // 建议信息
  code?: string                       // 建议代码
  priority: 'high' | 'medium' | 'low'  // 优先级
}
```

### 4.9 Child (用户档案)

```typescript
interface Child {
  id: string                          // 用户ID
  name: string                        // 用户姓名
  gender: 'male' | 'female' | 'other'  // 性别
  birthday?: Date                     // 生日
  avatar?: string                     // 头像
  createdAt: Date                     // 创建时间
  updatedAt: Date                     // 更新时间
}
```

---

## API接口

### 5.1 角色管理器API

#### 5.1.1 获取角色管理器实例

```typescript
const characterManager = CharacterManager.getInstance()
```

#### 5.1.2 根据性别获取角色配置

```typescript
const character = characterManager.getCharacterByGender('female')
```

**参数**：
- `gender`: 'male' | 'female'

**返回值**：CharacterConfig

**异常**：当找不到对应性别的角色配置时抛出错误

#### 5.1.3 根据用户信息获取个性化角色配置

```typescript
const child = {
  id: 'child-001',
  name: '小明',
  gender: 'male',
  birthday: new Date('2018-05-15')
}

const personalizedCharacter = characterManager.getCharacterForUser(child)
```

**参数**：
- `child`: Child | null

**返回值**：CharacterConfig

#### 5.1.4 获取当前角色配置

```typescript
const currentCharacter = characterManager.getCurrentCharacter()
```

**返回值**：CharacterConfig | null

#### 5.1.5 设置当前用户档案

```typescript
characterManager.setCurrentChild(child)
```

**参数**：
- `child`: Child | null

#### 5.1.6 获取当前用户档案

```typescript
const currentChild = characterManager.getCurrentChild()
```

**返回值**：Child | null

#### 5.1.7 更新角色配置

```typescript
characterManager.updateCharacter({
  name: '新名称',
  age: 6
})
```

**参数**：
- `updates`: Partial<CharacterConfig>

#### 5.1.8 获取主题配置

```typescript
const theme = characterManager.getTheme()
```

**返回值**：ThemeConfig

#### 5.1.9 根据触发场景获取表情配置

```typescript
const expression = characterManager.getExpression('greeting')
```

**参数**：
- `trigger`: ExpressionTrigger

**返回值**：ExpressionConfig

### 5.2 验证器API

#### 5.2.1 获取验证器实例

```typescript
const characterValidator = CharacterInfoValidator.getInstance()
```

#### 5.2.2 验证角色配置

```typescript
const validationResult = characterValidator.validateCharacterConfig(character)
```

**参数**：
- `character`: CharacterConfig

**返回值**：ValidationResult

#### 5.2.3 验证角色配置与用户档案的一致性

```typescript
const validationResult = characterValidator.validateChildCharacterConsistency(child, character)
```

**参数**：
- `child`: Child
- `character`: CharacterConfig

**返回值**：ValidationResult

#### 5.2.4 自动修复角色配置

```typescript
const fixedCharacter = characterValidator.autoFixCharacterConfig(character)
```

**参数**：
- `character`: CharacterConfig

**返回值**：CharacterConfig

#### 5.2.5 生成验证报告

```typescript
const report = characterValidator.generateValidationReport(validationResult)
```

**参数**：
- `validationResult`: ValidationResult

**返回值**：string

---

## UI组件

### 6.1 RoleInfoManager (角色信息管理器组件)

#### 6.1.1 组件概述

RoleInfoManager 是角色信息管理的UI组件，提供角色信息的展示、编辑、验证和同步功能。

#### 6.1.2 组件属性

```typescript
interface RoleInfoManagerProps {
  child?: Child | null               // 用户档案信息
  onSave?: (data: Partial<Child>) => Promise<void>  // 保存回调
  onCancel?: () => void              // 取消回调
}
```

#### 6.1.3 组件状态

```typescript
const [character, setCharacter] = useState<CharacterConfig | null>(null)
const [isEditing, setIsEditing] = useState(false)
const [formData, setFormData] = useState<Partial<Child>>({})
const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
const [showValidation, setShowValidation] = useState(false)
const [isLoading, setIsLoading] = useState(false)
```

#### 6.1.4 核心功能

##### 角色信息展示

展示当前角色的基本信息、主题配置、表情配置和个性配置。

```typescript
{character && (
  <div className="character-info">
    <div className="character-avatar">
      <img src={character.avatarPath} alt={character.name} />
    </div>
    <div className="character-details">
      <h2>{character.name}</h2>
      <p>性别: {character.gender === 'male' ? '男' : '女'}</p>
      <p>年龄: {character.age}岁</p>
      {character.zodiac && <p>星座: {character.zodiac}</p>}
    </div>
  </div>
)}
```

##### 编辑模式

提供表单编辑用户档案信息，包括姓名、性别和生日。

```typescript
{isEditing && (
  <form onSubmit={handleSave}>
    <div className="form-group">
      <label>姓名</label>
      <input
        type="text"
        value={formData.name || ''}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      {validationErrors.name && (
        <span className="error">{validationErrors.name}</span>
      )}
    </div>
    
    <div className="form-group">
      <label>性别</label>
      <select
        value={formData.gender || 'female'}
        onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' })}
      >
        <option value="male">男</option>
        <option value="female">女</option>
      </select>
    </div>
    
    <div className="form-group">
      <label>生日</label>
      <input
        type="date"
        value={formData.birthday ? formData.birthday.toISOString().split('T')[0] : ''}
        onChange={(e) => setFormData({ ...formData, birthday: e.target.value ? new Date(e.target.value) : undefined })}
      />
    </div>
    
    <div className="form-actions">
      <button type="submit" disabled={isLoading}>保存</button>
      <button type="button" onClick={handleCancel}>取消</button>
    </div>
  </form>
)}
```

##### 验证结果展示

展示角色配置的验证结果，包括错误、警告和建议。

```typescript
{showValidation && validationResult && (
  <div className="validation-result">
    <h3>验证结果</h3>
    
    {validationResult.errors.length > 0 && (
      <div className="validation-errors">
        <h4>错误 ({validationResult.errors.length})</h4>
        <ul>
          {validationResult.errors.map((error, index) => (
            <li key={index} className="error">
              <strong>{error.field}:</strong> {error.message}
            </li>
          ))}
        </ul>
      </div>
    )}
    
    {validationResult.warnings.length > 0 && (
      <div className="validation-warnings">
        <h4>警告 ({validationResult.warnings.length})</h4>
        <ul>
          {validationResult.warnings.map((warning, index) => (
            <li key={index} className="warning">
              <strong>{warning.field}:</strong> {warning.message}
            </li>
          ))}
        </ul>
      </div>
    )}
    
    {validationResult.suggestions.length > 0 && (
      <div className="validation-suggestions">
        <h4>建议 ({validationResult.suggestions.length})</h4>
        <ul>
          {validationResult.suggestions.map((suggestion, index) => (
            <li key={index} className="suggestion">
              <strong>{suggestion.field}:</strong> {suggestion.message}
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
)}
```

##### 自动修复功能

提供一键自动修复角色配置问题的功能。

```typescript
<button onClick={handleAutoFix} className="auto-fix-button">
  自动修复
</button>

const handleAutoFix = () => {
  if (!character) return
  
  const fixedCharacter = characterValidator.autoFixCharacterConfig(character)
  setCharacter(fixedCharacter)
  
  // 重新验证
  const validation = characterValidator.validateCharacterConfig(fixedCharacter)
  setValidationResult(validation)
}
```

#### 6.1.5 事件处理

##### 保存处理

```typescript
const handleSave = async (e: React.FormEvent) => {
  e.preventDefault()
  
  // 验证表单数据
  const errors = validateFormData(formData)
  if (Object.keys(errors).length > 0) {
    setValidationErrors(errors)
    return
  }
  
  setIsLoading(true)
  
  try {
    if (onSave) {
      await onSave(formData)
    }
    
    // 更新角色配置
    if (formData.name || formData.gender || formData.birthday) {
      const updatedChild = { ...child, ...formData }
      characterManager.setCurrentChild(updatedChild)
      const updatedCharacter = characterManager.getCharacterForUser(updatedChild)
      setCharacter(updatedCharacter)
    }
    
    setIsEditing(false)
    setValidationErrors({})
  } catch (error) {
    log.error('保存失败', { error })
  } finally {
    setIsLoading(false)
  }
}
```

##### 取消处理

```typescript
const handleCancel = () => {
  setIsEditing(false)
  setFormData(child ? {
    id: child.id,
    name: child.name || "",
    gender: child.gender || "female",
    birthday: child.birthday
  } : {})
  setValidationErrors({})
}
```

##### 验证处理

```typescript
const handleValidate = () => {
  if (!character) return
  
  const validation = characterValidator.validateCharacterConfig(character)
  setValidationResult(validation)
  setShowValidation(true)
}
```

#### 6.1.6 使用示例

```typescript
import RoleInfoManager from '@/components/character/RoleInfoManager'

function ProfilePage() {
  const [child, setChild] = useState<Child | null>(null)
  
  const handleSave = async (data: Partial<Child>) => {
    // 保存用户档案
    await updateChildProfile(data)
    setChild({ ...child, ...data })
  }
  
  return (
    <div className="profile-page">
      <RoleInfoManager
        child={child}
        onSave={handleSave}
      />
    </div>
  )
}
```

---

## 验证机制

### 7.1 验证级别

角色信息验证器提供三个验证级别：

#### 7.1.1 错误 (Errors)

**定义**：必须修复的严重问题，会导致系统功能异常。

**示例**：
- 缺少必需字段
- 字段类型不匹配
- 字段值超出有效范围
- 图片文件不存在

**处理方式**：必须修复后才能继续使用。

#### 7.1.2 警告 (Warnings)

**定义**：建议修复的问题，不影响基本功能，但可能导致体验下降。

**示例**：
- 角色配置与用户档案不一致
- 主题配置不完整
- 表情配置缺失
- 个性特征值异常

**处理方式**：建议修复，但不强制要求。

#### 7.1.3 建议 (Suggestions)

**定义**：优化建议，可以提升用户体验或系统性能。

**示例**：
- 建议使用更合适的主题颜色
- 建议添加更多表情配置
- 建议调整语音参数
- 建议优化个性特征值

**处理方式**：可选修复，根据实际需求决定。

### 7.2 验证流程

```
角色配置输入
      ↓
基本信息验证
      ↓
主题配置验证
      ↓
表情配置验证
      ↓
个性配置验证
      ↓
语音设置验证
      ↓
图片路径验证
      ↓
生成验证结果
      ↓
显示验证报告
```

### 7.3 验证规则

#### 7.3.1 基本信息验证规则

| 字段 | 验证规则 | 错误级别 |
|------|----------|----------|
| id | 必须存在且非空 | Error |
| name | 必须存在且长度1-50 | Error |
| defaultName | 必须存在且长度1-50 | Error |
| gender | 必须是 'male' 或 'female' | Error |
| age | 必须是正整数且0-18 | Error |
| birthday | 格式必须为 YYYY-MM-DD | Warning |
| zodiac | 必须是有效的星座名称 | Warning |

#### 7.3.2 主题配置验证规则

| 字段 | 验证规则 | 错误级别 |
|------|----------|----------|
| themes | 必须至少包含一个主题 | Error |
| themes[].id | 必须唯一且非空 | Error |
| themes[].colors | 必须包含所有必需颜色 | Error |
| themes[].colors.* | 必须是有效的颜色值 | Error |
| currentTheme | 必须是有效的主题ID | Warning |

#### 7.3.3 表情配置验证规则

| 字段 | 验证规则 | 错误级别 |
|------|----------|----------|
| expressions | 必须至少包含一个表情 | Error |
| expressions[].id | 必须唯一且非空 | Error |
| expressions[].trigger | 必须是有效的触发场景 | Error |
| expressions[].images | 必须包含正常状态图片 | Error |
| expressions[].images.* | 图片文件必须存在 | Error |

#### 7.3.4 个性配置验证规则

| 字段 | 验证规则 | 错误级别 |
|------|----------|----------|
| personality.traits | 必须包含所有个性特征 | Error |
| personality.traits.* | 值必须在0-100之间 | Error |
| personality.description | 长度建议10-200 | Suggestion |
| personality.tags | 建议包含3-5个标签 | Suggestion |

#### 7.3.5 语音设置验证规则

| 字段 | 验证规则 | 错误级别 |
|------|----------|----------|
| voiceSettings.voice.id | 必须存在且非空 | Error |
| voiceSettings.voice.gender | 必须是 'male'、'female' 或 'neutral' | Error |
| voiceSettings.parameters.rate | 必须在0.5-2.0之间 | Error |
| voiceSettings.parameters.pitch | 必须在0.5-2.0之间 | Error |
| voiceSettings.parameters.volume | 必须在0.0-1.0之间 | Error |

#### 7.3.6 图片路径验证规则

| 字段 | 验证规则 | 错误级别 |
|------|----------|----------|
| avatarPath | 图片文件必须存在 | Error |
| images.avatar.* | 图片文件必须存在 | Error |
| images.expressions.* | 图片文件必须存在 | Error |
| images.scenes.* | 图片文件必须存在 | Warning |

### 7.4 自动修复机制

#### 7.4.1 修复策略

自动修复机制采用以下策略：

1. **必需字段修复**：为缺失的必需字段添加默认值
2. **类型修复**：将无效的字段值转换为有效类型
3. **范围修复**：将超出范围的值调整到有效范围内
4. **路径修复**：修正无效的文件路径
5. **一致性修复**：确保相关字段之间的一致性

#### 7.4.2 修复示例

```typescript
// 原始配置（有问题）
const invalidCharacter = {
  id: '',                          // 缺少ID
  name: '',                        // 缺少名称
  gender: 'unknown',               // 无效的性别
  age: -1,                         // 无效的年龄
  themes: [],                      // 缺少主题
  expressions: [],                 // 缺少表情
  personality: {
    traits: {
      friendliness: 150,           // 超出范围
      intelligence: -10            // 超出范围
    }
  }
}

// 自动修复后
const fixedCharacter = characterValidator.autoFixCharacterConfig(invalidCharacter)

// 修复结果
{
  id: 'character_1234567890',      // 自动生成ID
  name: '默认角色',                 // 使用默认名称
  gender: 'female',                // 修正为默认性别
  age: 1,                          // 修正为默认年龄
  themes: [/* 默认主题 */],        // 添加默认主题
  expressions: [/* 默认表情 */],    // 添加默认表情
  personality: {
    traits: {
      friendliness: 100,           // 修正为最大值
      intelligence: 0              // 修正为最小值
    }
  }
}
```

---

## 集成指南

### 8.1 基础集成

#### 8.1.1 安装依赖

角色信息管理器依赖以下库：

```json
{
  "dependencies": {
    "react": "^18.0.0",
    "typescript": "^5.0.0"
  }
}
```

#### 8.1.2 导入模块

```typescript
// 导入角色管理器
import { CharacterManager } from '@/lib/character-manager'

// 导入角色信息验证器
import { CharacterInfoValidator } from '@/lib/character-validator'

// 导入UI组件
import RoleInfoManager from '@/components/character/RoleInfoManager'
```

### 8.2 在页面中使用

#### 8.2.1 个人信息页面

```typescript
'use client'

import { useState, useEffect } from 'react'
import { CharacterManager } from '@/lib/character-manager'
import { CharacterInfoValidator } from '@/lib/character-validator'
import RoleInfoManager from '@/components/character/RoleInfoManager'

export default function ProfilePage() {
  const [child, setChild] = useState<Child | null>(null)
  const [character, setCharacter] = useState<CharacterConfig | null>(null)
  
  useEffect(() => {
    // 获取角色管理器实例
    const characterManager = CharacterManager.getInstance()
    
    // 获取当前用户档案
    const currentChild = characterManager.getCurrentChild()
    setChild(currentChild)
    
    // 获取当前角色配置
    const currentCharacter = characterManager.getCurrentCharacter()
    setCharacter(currentCharacter)
  }, [])
  
  const handleSave = async (data: Partial<Child>) => {
    // 保存用户档案
    await updateChildProfile(data)
    
    // 更新角色配置
    const characterManager = CharacterManager.getInstance()
    const updatedChild = { ...child, ...data }
    characterManager.setCurrentChild(updatedChild)
    const updatedCharacter = characterManager.getCharacterForUser(updatedChild)
    setCharacter(updatedCharacter)
    setChild(updatedChild)
  }
  
  return (
    <div className="profile-page">
      <h1>个人信息</h1>
      <RoleInfoManager
        child={child}
        onSave={handleSave}
      />
    </div>
  )
}
```

#### 8.2.2 设置页面

```typescript
'use client'

import { useState, useEffect } from 'react'
import { CharacterManager } from '@/lib/character-manager'
import { CharacterInfoValidator } from '@/lib/character-validator'

export default function SettingsPage() {
  const [character, setCharacter] = useState<CharacterConfig | null>(null)
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  
  useEffect(() => {
    const characterManager = CharacterManager.getInstance()
    const currentCharacter = characterManager.getCurrentCharacter()
    setCharacter(currentCharacter)
  }, [])
  
  const handleValidate = () => {
    if (!character) return
    
    const characterValidator = CharacterInfoValidator.getInstance()
    const validation = characterValidator.validateCharacterConfig(character)
    setValidationResult(validation)
  }
  
  const handleAutoFix = () => {
    if (!character) return
    
    const characterValidator = CharacterInfoValidator.getInstance()
    const fixedCharacter = characterValidator.autoFixCharacterConfig(character)
    
    const characterManager = CharacterManager.getInstance()
    characterManager.updateCharacter(fixedCharacter)
    setCharacter(fixedCharacter)
    
    // 重新验证
    const validation = characterValidator.validateCharacterConfig(fixedCharacter)
    setValidationResult(validation)
  }
  
  return (
    <div className="settings-page">
      <h1>角色设置</h1>
      
      <div className="settings-actions">
        <button onClick={handleValidate}>验证配置</button>
        <button onClick={handleAutoFix}>自动修复</button>
      </div>
      
      {validationResult && (
        <div className="validation-result">
          <h2>验证结果</h2>
          {/* 显示验证结果 */}
        </div>
      )}
    </div>
  )
}
```

### 8.3 与AI角色系统集成

#### 8.3.1 获取角色信息

```typescript
import { CharacterManager } from '@/lib/character-manager'

export function getAICharacterInfo() {
  const characterManager = CharacterManager.getInstance()
  const character = characterManager.getCurrentCharacter()
  
  if (!character) {
    throw new Error('未找到角色配置')
  }
  
  return {
    name: character.name,
    gender: character.gender,
    age: character.age,
    personality: character.personality,
    voiceSettings: character.voiceSettings
  }
}
```

#### 8.3.2 根据场景获取表情

```typescript
import { CharacterManager } from '@/lib/character-manager'

export function getExpressionForTrigger(trigger: ExpressionTrigger) {
  const characterManager = CharacterManager.getInstance()
  const expression = characterManager.getExpression(trigger)
  
  return expression.images.normal
}
```

#### 8.3.3 获取主题配置

```typescript
import { CharacterManager } from '@/lib/character-manager'

export function getThemeConfig() {
  const characterManager = CharacterManager.getInstance()
  const theme = characterManager.getTheme()
  
  return theme
}
```

### 8.4 与用户档案系统集成

#### 8.4.1 初始化角色配置

```typescript
import { CharacterManager } from '@/lib/character-manager'
import { log } from '@/backend/src/config/logger'

export async function initializeCharacterForChild(child: Child) {
  const characterManager = CharacterManager.getInstance()
  
  // 设置当前用户档案
  characterManager.setCurrentChild(child)
  
  // 获取个性化角色配置
  const character = characterManager.getCharacterForUser(child)
  
  // 验证角色配置
  const characterValidator = CharacterInfoValidator.getInstance()
  const validation = characterValidator.validateChildCharacterConsistency(child, character)
  
  if (!validation.isValid) {
    log.warn('角色配置验证失败', { errors: validation.errors })
  }
  
  return character
}
```

#### 8.4.2 更新用户档案

```typescript
import { CharacterManager } from '@/lib/character-manager'

export async function updateChildProfile(child: Child) {
  // 保存用户档案到数据库
  await saveChildToDatabase(child)
  
  // 更新角色配置
  const characterManager = CharacterManager.getInstance()
  characterManager.setCurrentChild(child)
  
  // 获取更新后的角色配置
  const character = characterManager.getCharacterForUser(child)
  
  return character
}
```

---

## 使用示例

### 9.1 基础使用

#### 9.1.1 获取角色配置

```typescript
import { CharacterManager } from '@/lib/character-manager'
import { log } from '@/backend/src/config/logger'

// 获取角色管理器实例
const characterManager = CharacterManager.getInstance()

// 获取女性角色配置
const femaleCharacter = characterManager.getCharacterByGender('female')

log.info('角色信息', { 
  name: femaleCharacter.name,
  age: femaleCharacter.age,
  gender: femaleCharacter.gender
})
```

#### 9.1.2 根据用户信息获取个性化角色配置

```typescript
import { CharacterManager } from '@/lib/character-manager'
import { log } from '@/backend/src/config/logger'

const characterManager = CharacterManager.getInstance()

const child = {
  id: 'child-001',
  name: '小明',
  gender: 'male',
  birthday: new Date('2018-05-15')
}

const personalizedCharacter = characterManager.getCharacterForUser(child)

log.info('个性化角色信息', {
  name: personalizedCharacter.name,
  age: personalizedCharacter.age,
  zodiac: personalizedCharacter.zodiac
})
```

### 9.2 验证使用

#### 9.2.1 验证角色配置

```typescript
import { CharacterManager } from '@/lib/character-manager'
import { CharacterInfoValidator } from '@/lib/character-validator'
import { log } from '@/backend/src/config/logger'

const characterManager = CharacterManager.getInstance()
const characterValidator = CharacterInfoValidator.getInstance()

// 获取角色配置
const character = characterManager.getCharacterByGender('female')

// 验证角色配置
const validationResult = characterValidator.validateCharacterConfig(character)

// 检查验证结果
if (validationResult.isValid) {
  log.info('角色配置验证通过', { characterId: character.id })
} else {
  log.error('角色配置验证失败', { errors: validationResult.errors })
  validationResult.errors.forEach(error => {
    log.error(`- ${error.field}: ${error.message}`)
  })
}

// 显示警告
if (validationResult.warnings.length > 0) {
  log.warn('验证警告', { warnings: validationResult.warnings })
  validationResult.warnings.forEach(warning => {
    log.warn(`- ${warning.field}: ${warning.message}`)
  })
}

// 显示建议
if (validationResult.suggestions.length > 0) {
  log.info('优化建议', { suggestions: validationResult.suggestions })
  validationResult.suggestions.forEach(suggestion => {
    log.info(`- ${suggestion.field}: ${suggestion.message}`)
  })
}
```

#### 9.2.2 验证角色配置与用户档案的一致性

```typescript
import { CharacterManager } from '@/lib/character-manager'
import { CharacterInfoValidator } from '@/lib/character-validator'
import { log } from '@/backend/src/config/logger'

const characterManager = CharacterManager.getInstance()
const characterValidator = CharacterInfoValidator.getInstance()

const child = {
  id: 'child-001',
  name: '小明',
  gender: 'male',
  birthday: new Date('2018-05-15')
}

const character = characterManager.getCharacterForUser(child)

// 验证一致性
const validationResult = characterValidator.validateChildCharacterConsistency(child, character)

if (!validationResult.isValid) {
  log.error('角色配置与用户档案不一致', { errors: validationResult.errors })
  validationResult.errors.forEach(error => {
    log.error(`- ${error.field}: ${error.message}`)
  })
}
```

### 9.3 自动修复使用

#### 9.3.1 自动修复角色配置

```typescript
import { CharacterManager } from '@/lib/character-manager'
import { CharacterInfoValidator } from '@/lib/character-validator'

const characterManager = CharacterManager.getInstance()
const characterValidator = CharacterInfoValidator.getInstance()

// 获取角色配置
const character = characterManager.getCharacterByGender('female')

// 自动修复
const fixedCharacter = characterValidator.autoFixCharacterConfig(character)

// 重新验证
const validationResult = characterValidator.validateCharacterConfig(fixedCharacter)

if (validationResult.isValid) {
  console.log('修复成功，角色配置验证通过')
  
  // 更新角色配置
  characterManager.updateCharacter(fixedCharacter)
} else {
  console.error('修复失败，仍有错误:')
  validationResult.errors.forEach(error => {
    console.error(`- ${error.field}: ${error.message}`)
  })
}
```

### 9.4 UI组件使用

#### 9.4.1 基础使用

```typescript
import RoleInfoManager from '@/components/character/RoleInfoManager'

export default function ProfilePage() {
  const child = {
    id: 'child-001',
    name: '小明',
    gender: 'male',
    birthday: new Date('2018-05-15')
  }
  
  const handleSave = async (data: Partial<Child>) => {
    console.log('保存数据:', data)
    // 保存逻辑...
  }
  
  return (
    <div className="profile-page">
      <h1>个人信息</h1>
      <RoleInfoManager
        child={child}
        onSave={handleSave}
      />
    </div>
  )
}
```

#### 9.4.2 高级使用

```typescript
'use client'

import { useState, useEffect } from 'react'
import { CharacterManager } from '@/lib/character-manager'
import { CharacterInfoValidator } from '@/lib/character-validator'
import RoleInfoManager from '@/components/character/RoleInfoManager'

export default function AdvancedProfilePage() {
  const [child, setChild] = useState<Child | null>(null)
  const [character, setCharacter] = useState<CharacterConfig | null>(null)
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  
  useEffect(() => {
    const characterManager = CharacterManager.getInstance()
    const currentChild = characterManager.getCurrentChild()
    setChild(currentChild)
    
    const currentCharacter = characterManager.getCurrentCharacter()
    setCharacter(currentCharacter)
    
    // 自动验证
    if (currentCharacter) {
      const characterValidator = CharacterInfoValidator.getInstance()
      const validation = characterValidator.validateCharacterConfig(currentCharacter)
      setValidationResult(validation)
    }
  }, [])
  
  const handleSave = async (data: Partial<Child>) => {
    // 保存用户档案
    await updateChildProfile(data)
    
    // 更新角色配置
    const characterManager = CharacterManager.getInstance()
    const updatedChild = { ...child, ...data }
    characterManager.setCurrentChild(updatedChild)
    const updatedCharacter = characterManager.getCharacterForUser(updatedChild)
    setCharacter(updatedCharacter)
    setChild(updatedChild)
    
    // 重新验证
    const characterValidator = CharacterInfoValidator.getInstance()
    const validation = characterValidator.validateCharacterConfig(updatedCharacter)
    setValidationResult(validation)
  }
  
  const handleAutoFix = () => {
    if (!character) return
    
    const characterValidator = CharacterInfoValidator.getInstance()
    const fixedCharacter = characterValidator.autoFixCharacterConfig(character)
    
    const characterManager = CharacterManager.getInstance()
    characterManager.updateCharacter(fixedCharacter)
    setCharacter(fixedCharacter)
    
    // 重新验证
    const validation = characterValidator.validateCharacterConfig(fixedCharacter)
    setValidationResult(validation)
  }
  
  return (
    <div className="advanced-profile-page">
      <h1>个人信息管理</h1>
      
      <div className="page-actions">
        <button onClick={handleAutoFix}>自动修复</button>
      </div>
      
      {validationResult && (
        <div className="validation-summary">
          <h2>验证摘要</h2>
          <p>状态: {validationResult.isValid ? '通过' : '失败'}</p>
          <p>错误: {validationResult.errors.length}</p>
          <p>警告: {validationResult.warnings.length}</p>
          <p>建议: {validationResult.suggestions.length}</p>
        </div>
      )}
      
      <RoleInfoManager
        child={child}
        onSave={handleSave}
      />
    </div>
  )
}
```

---

## 最佳实践

### 10.1 性能优化

#### 10.1.1 缓存角色配置

角色管理器内置缓存机制，避免重复计算和加载。

```typescript
// 获取角色管理器实例（单例）
const characterManager = CharacterManager.getInstance()

// 角色配置会被缓存，多次调用不会重复计算
const character1 = characterManager.getCharacterByGender('female')
const character2 = characterManager.getCharacterByGender('female')
// character1 === character2 (引用相同)
```

#### 10.1.2 延迟初始化

角色管理器采用延迟初始化，只在第一次使用时才创建实例。

```typescript
// 角色管理器不会立即初始化
const characterManager = CharacterManager.getInstance()

// 第一次调用时才初始化
const character = characterManager.getCharacterByGender('female')
```

#### 10.1.3 避免频繁验证

验证操作可能比较耗时，建议在关键时刻进行验证，而不是每次更新都验证。

```typescript
// 不推荐：每次更新都验证
function updateCharacter(updates: Partial<CharacterConfig>) {
  const updatedCharacter = { ...character, ...updates }
  const validationResult = characterValidator.validateCharacterConfig(updatedCharacter)
  // ...
}

// 推荐：只在关键时刻验证
function updateCharacter(updates: Partial<CharacterConfig>) {
  const updatedCharacter = { ...character, ...updates }
  setCharacter(updatedCharacter)
}

function saveCharacter() {
  const validationResult = characterValidator.validateCharacterConfig(character)
  if (validationResult.isValid) {
    // 保存角色配置
  }
}
```

#### 10.1.4 使用React.memo优化组件渲染

对于角色信息展示组件，使用React.memo避免不必要的重新渲染。

```typescript
import { memo } from 'react'

const CharacterInfoDisplay = memo(({ character }: { character: CharacterConfig }) => {
  return (
    <div className="character-info">
      <h2>{character.name}</h2>
      <p>年龄: {character.age}</p>
      <p>星座: {character.zodiac}</p>
    </div>
  )
})

export default CharacterInfoDisplay
```

#### 10.1.5 虚拟化长列表

当展示大量角色相关数据时，使用虚拟化技术提升性能。

```typescript
import { useVirtualizer } from '@tanstack/react-virtual'

function CharacterList({ characters }: { characters: CharacterConfig[] }) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: characters.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
    overscan: 5
  })

  return (
    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualItem.start}px)`
            }}
          >
            <CharacterCard character={characters[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  )
}
```

#### 10.1.6 图片懒加载和预加载

对于角色图片资源，使用懒加载和预加载策略。

```typescript
// 图片懒加载
function CharacterAvatar({ src, alt }: { src: string, alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className="character-avatar"
    />
  )
}

// 图片预加载
function preloadCharacterImages(character: CharacterConfig) {
  const images = [
    character.avatarPath,
    ...character.images.additionalImages,
    ...character.themes.flatMap(theme => theme.backgroundImage ? [theme.backgroundImage] : [])
  ]

  images.forEach(src => {
    const img = new Image()
    img.src = src
  })
}

// 在应用初始化时预加载
useEffect(() => {
  const character = characterManager.getCurrentCharacter()
  if (character) {
    preloadCharacterImages(character)
  }
}, [])
```

#### 10.1.7 使用Web Worker处理复杂计算

将复杂的验证和计算任务放到Web Worker中执行，避免阻塞主线程。

```typescript
// validation.worker.ts
self.onmessage = (event) => {
  const { character } = event.data
  const result = validateCharacterConfig(character)
  self.postMessage(result)
}

// 主线程使用
function validateInWorker(character: CharacterConfig): Promise<ValidationResult> {
  return new Promise((resolve) => {
    const worker = new Worker('./validation.worker.ts')
    worker.postMessage({ character })
    worker.onmessage = (event) => {
      resolve(event.data)
      worker.terminate()
    }
  })
}

// 在组件中使用
async function handleValidation() {
  const character = characterManager.getCurrentCharacter()
  if (character) {
    const result = await validateInWorker(character)
    setValidationResult(result)
  }
}
```

#### 10.1.8 使用防抖和节流优化频繁操作

对于频繁触发的操作，使用防抖和节流技术。

```typescript
import { debounce, throttle } from 'lodash'

// 防抖：搜索角色时延迟执行
const searchCharacters = debounce((query: string) => {
  const results = characterManager.searchCharacters(query)
  setSearchResults(results)
}, 300)

// 节流：滚动加载更多角色
const handleScroll = throttle(() => {
  if (shouldLoadMore()) {
    loadMoreCharacters()
  }
}, 200)

// 在组件中使用
<input
  type="text"
  onChange={(e) => searchCharacters(e.target.value)}
  placeholder="搜索角色"
/>

<div onScroll={handleScroll}>
  {/* 角色列表 */}
</div>
```

#### 10.1.9 使用RequestIdleCallback处理低优先级任务

将非关键任务延迟到浏览器空闲时执行。

```typescript
function scheduleLowPriorityTask(task: () => void) {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      task()
    })
  } else {
    setTimeout(() => {
      task()
    }, 1)
  }
}

// 延迟加载非关键角色数据
function loadNonCriticalCharacterData(character: CharacterConfig) {
  scheduleLowPriorityTask(() => {
    characterManager.loadCharacterHistory(character.id)
    characterManager.loadCharacterStatistics(character.id)
  })
}
```

#### 10.1.10 使用IndexedDB缓存角色数据

对于大量角色数据，使用IndexedDB进行本地缓存。

```typescript
import { openDB } from 'idb'

const dbPromise = openDB('yyc3-xy-ai', 1, {
  upgrade(db) {
    db.createObjectStore('characters', { keyPath: 'id' })
  }
})

async function cacheCharacter(character: CharacterConfig) {
  const db = await dbPromise
  await db.put('characters', character)
}

async function getCachedCharacter(id: string): Promise<CharacterConfig | undefined> {
  const db = await dbPromise
  return db.get('characters', id)
}

async function getAllCachedCharacters(): Promise<CharacterConfig[]> {
  const db = await dbPromise
  return db.getAll('characters')
}

// 使用示例
async function getCharacterWithCache(id: string): Promise<CharacterConfig> {
  // 先从缓存获取
  const cached = await getCachedCharacter(id)
  if (cached) {
    log.info('从缓存获取角色配置', { characterId: id })
    return cached
  }

  // 缓存未命中，从服务器获取
  const character = await fetchCharacterFromServer(id)
  await cacheCharacter(character)
  return character
}
```

#### 10.1.11 使用Service Worker缓存静态资源

使用Service Worker缓存角色相关的静态资源。

```typescript
// sw.js
const CACHE_NAME = 'yyc3-xy-ai-v1'
const urlsToCache = [
  '/characters/male/avatar.png',
  '/characters/female/avatar.png',
  '/characters/male/theme-default.png',
  '/characters/female/theme-default.png'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response
        }
        return fetch(event.request)
      })
  )
})
```

#### 10.1.12 性能监控和优化建议

建立性能监控机制，持续优化系统性能。

```typescript
// 性能监控工具
class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map()

  recordMetric(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, [])
    }
    this.metrics.get(name)!.push(value)
  }

  getAverageMetric(name: string): number {
    const values = this.metrics.get(name) || []
    if (values.length === 0) return 0
    return values.reduce((a, b) => a + b, 0) / values.length
  }

  getMetricsSummary() {
    const summary: Record<string, any> = {}
    this.metrics.forEach((values, name) => {
      summary[name] = {
        average: this.getAverageMetric(name),
        min: Math.min(...values),
        max: Math.max(...values),
        count: values.length
      }
    })
    return summary
  }
}

const performanceMonitor = new PerformanceMonitor()

// 监控角色配置加载性能
async function loadCharacterWithMonitoring(gender: 'male' | 'female') {
  const startTime = performance.now()
  
  const character = characterManager.getCharacterByGender(gender)
  
  const endTime = performance.now()
  const duration = endTime - startTime
  
  performanceMonitor.recordMetric('character-load-time', duration)
  
  if (duration > 100) {
    log.warn('角色配置加载时间过长', { gender, duration })
  }
  
  return character
}

// 定期输出性能报告
setInterval(() => {
  const summary = performanceMonitor.getMetricsSummary()
  log.info('性能监控报告', { summary })
}, 60000)
```

#### 10.1.13 性能优化检查清单

定期检查以下性能优化项，确保系统保持最佳性能状态：

- [ ] 角色配置缓存命中率 > 90%
- [ ] 组件渲染时间 < 16ms (60fps)
- [ ] 图片加载时间 < 1s
- [ ] 验证操作完成时间 < 100ms
- [ ] 首次内容绘制(FCP) < 1.5s
- [ ] 最大内容绘制(LCP) < 2.5s
- [ ] 累积布局偏移(CLS) < 0.1
- [ ] 首次输入延迟(FID) < 100ms
- [ ] 内存使用 < 100MB
- [ ] IndexedDB缓存大小 < 50MB

### 10.2 错误处理

#### 10.2.1 捕获异常

角色管理器的方法可能会抛出异常，建议使用 try-catch 捕获。

```typescript
try {
  const character = characterManager.getCharacterByGender('female')
} catch (error) {
  console.error('获取角色配置失败:', error)
  // 处理错误，例如显示错误消息或使用默认配置
}
```

#### 10.2.2 验证结果检查

在使用角色配置之前，建议先验证配置的有效性。

```typescript
const character = characterManager.getCharacterByGender('female')
const validationResult = characterValidator.validateCharacterConfig(character)

if (!validationResult.isValid) {
  console.error('角色配置无效:', validationResult.errors)
  // 处理错误，例如自动修复或使用默认配置
  const fixedCharacter = characterValidator.autoFixCharacterConfig(character)
  return fixedCharacter
}

return character
```

#### 10.2.3 错误处理流程图

```
┌─────────────────────────────────────────────────────────────┐
│                    角色信息管理器错误处理流程                   │
└─────────────────────────────────────────────────────────────┘

用户操作/系统调用
        ↓
┌─────────────────────────────────────────────────────────────┐
│  1. 异常捕获层 (Exception Handling Layer)                    │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ try {                                                    │ │
│  │   characterManager.getCharacterByGender('female')        │ │
│  │ } catch (error) {                                        │ │
│  │   log.error('操作失败', { error, operation })             │ │
│  │   → 进入错误处理流程                                      │ │
│  │ }                                                        │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────────────────────────┐
│  2. 错误分类层 (Error Classification Layer)                  │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ 错误类型判断：                                            │ │
│  │                                                          │ │
│  │ ┌──────────────────┐  ┌──────────────────┐              │ │
│  │ │ 系统级错误       │  │ 业务级错误       │              │ │
│  │ │ - 网络错误       │  │ - 配置错误       │              │ │
│  │ │ - 数据库错误     │  │ - 验证错误       │              │ │
│  │ │ - 文件系统错误   │  │ - 一致性错误     │              │ │
│  │ │ - 内存错误       │  │ - 权限错误       │              │ │
│  │ └──────────────────┘  └──────────────────┘              │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────────────────────────┐
│  3. 错误处理层 (Error Handling Layer)                        │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ 系统级错误处理：                                         │ │
│  │  1. 记录详细错误日志                                     │ │
│  │  2. 触发系统告警                                         │ │
│  │  3. 返回降级方案（默认配置）                             │ │
│  │  4. 通知运维人员                                         │ │
│  │                                                          │ │
│  │ 业务级错误处理：                                         │ │
│  │  1. 执行验证检查                                         │ │
│  │  2. 尝试自动修复                                         │ │
│  │  3. 提供用户友好的错误提示                               │ │
│  │  4. 记录业务日志                                         │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────────────────────────┐
│  4. 自动修复层 (Auto-Fix Layer)                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ 尝试自动修复：                                           │ │
│  │                                                          │ │
│  │  characterValidator.autoFixCharacterConfig(character)   │ │
│  │         ↓                                               │ │
│  │  ┌────────────────────────────────────────────────────┐  │ │
│  │  │ 修复策略：                                        │  │ │
│  │  │ - 填充缺失的必需字段                              │  │ │
│  │  │ - 修正超出范围的值                                │  │ │
│  │  │ - 生成默认主题配置                                │  │ │
│  │  │ - 添加缺失的表情配置                              │  │ │
│  │  │ - 同步用户档案信息                                │  │ │
│  │  └────────────────────────────────────────────────────┘  │ │
│  │         ↓                                               │ │
│  │  重新验证修复后的配置                                   │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────────────────────────┐
│  5. 验证结果判断层 (Validation Result Layer)                 │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ 验证结果分析：                                           │ │
│  │                                                          │ │
│  │  ┌────────────────────────────────────────────────────┐  │ │
│  │  │ isValid = true                                  │  │ │
│  │  │ → 修复成功，继续执行                             │  │ │
│  │  │ → log.info('自动修复成功', { characterId })       │  │ │
│  │  └────────────────────────────────────────────────────┘  │ │
│  │                                                          │ │
│  │  ┌────────────────────────────────────────────────────┐  │ │
│  │  │ isValid = false                                   │  │ │
│  │  │ → 修复失败，进入降级处理                           │  │ │
│  │  │ → log.error('自动修复失败', { errors })            │  │ │
│  │  └────────────────────────────────────────────────────┘  │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────────────────────────┐
│  6. 降级处理层 (Fallback Layer)                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ 降级策略：                                               │ │
│  │                                                          │ │
│  │  1. 使用默认角色配置                                     │ │
│  │     characterManager.getDefaultCharacter()              │ │
│  │                                                          │ │
│  │  2. 使用缓存的历史配置                                   │ │
│  │     characterManager.getCachedCharacter()               │ │
│  │                                                          │ │
│  │  3. 最小化功能模式                                       │ │
│  │     - 仅提供基础角色信息                                 │ │
│  │     - 禁用高级功能                                       │ │
│  │                                                          │ │
│  │  4. 显示用户提示                                         │ │
│  │     "角色配置加载失败，已切换到默认配置"                  │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────────────────────────┐
│  7. 用户反馈层 (User Feedback Layer)                         │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ 根据错误级别显示不同的用户反馈：                         │ │
│  │                                                          │ │
│  │  ┌────────────────────────────────────────────────────┐  │ │
│  │  │ 错误级别 (Errors) - 红色警告                       │  │ │
│  │  │  • 阻止用户继续操作                                │  │ │
│  │  │  • 显示详细错误信息                                │  │ │
│  │  │  • 提供修复按钮                                    │  │ │
│  │  │  • 记录错误日志                                    │  │ │
│  │  └────────────────────────────────────────────────────┘  │ │
│  │                                                          │ │
│  │  ┌────────────────────────────────────────────────────┐  │ │
│  │  │ 警告级别 (Warnings) - 黄色提示                     │  │ │
│  │  │  • 允许用户继续操作                                │  │ │
│  │  │  • 显示警告信息                                    │  │ │
│  │  │  • 建议用户修复                                    │  │ │
│  │  │  • 记录警告日志                                    │  │ │
│  │  └────────────────────────────────────────────────────┘  │ │
│  │                                                          │ │
│  │  ┌────────────────────────────────────────────────────┐  │ │
│  │  │ 建议级别 (Suggestions) - 蓝色提示                  │  │ │
│  │  │  • 不影响用户操作                                  │  │ │
│  │  │  • 显示优化建议                                    │  │ │
│  │  │  • 可选是否修复                                    │  │ │
│  │  │  • 记录信息日志                                    │  │ │
│  │  └────────────────────────────────────────────────────┘  │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────────────────────────┐
│  8. 日志记录层 (Logging Layer)                                │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ 日志记录策略：                                           │ │
│  │                                                          │ │
│  │  系统级错误：                                            │ │
│  │  log.error('系统错误', {                                  │ │
│  │    error: error.message,                                  │ │
│  │    stack: error.stack,                                   │ │
│  │    operation: 'getCharacterByGender',                    │ │
│  │    timestamp: new Date().toISOString(),                  │ │
│  │    userId: currentUser.id                                │ │
│  │  })                                                       │ │
│  │                                                          │ │
│  │  业务级错误：                                            │ │
│  │  log.error('验证失败', {                                  │ │
│  │    errors: validationResult.errors,                      │ │
│  │    characterId: character.id,                             │ │
│  │    autoFixAttempted: true                                 │ │
│  │  })                                                       │ │
│  │                                                          │ │
│  │  警告信息：                                               │ │
│  │  log.warn('配置不一致', {                                 │ │
│  │    warnings: validationResult.warnings,                   │ │
│  │    childId: child.id                                      │ │
│  │  })                                                       │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────────────────────────┐
│  9. 监控告警层 (Monitoring & Alerting Layer)                  │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ 监控指标：                                               │ │
│  │  • 错误率监控                                            │ │
│  │  • 自动修复成功率                                        │ │
│  │  • 降级使用频率                                          │ │
│  │  • 用户反馈统计                                          │ │
│  │                                                          │ │
│  │  告警规则：                                               │ │
│  │  • 错误率 > 5% → 触发告警                               │ │
│  │  • 自动修复失败率 > 20% → 触发告警                      │ │
│  │  • 降级使用率 > 10% → 触发告警                          │ │
│  │  • 连续失败 > 3次 → 触发紧急告警                         │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────────────────────────┐
│  10. 恢复层 (Recovery Layer)                                 │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ 恢复策略：                                               │ │
│  │                                                          │ │
│  │  1. 定期重试机制                                         │ │
│  │     - 指数退避算法                                       │ │
│  │     - 最大重试次数：3次                                  │ │
│  │                                                          │ │
│  │  2. 手动恢复选项                                         │ │
│  │     - 管理员手动修复配置                                 │ │
│  │     - 重新加载配置文件                                   │ │
│  │                                                          │ │
│  │  3. 数据备份恢复                                         │ │
│  │     - 从备份恢复角色配置                                 │ │
│  │     - 验证恢复后的配置                                   │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

#### 10.2.4 完整错误处理示例

```typescript
import { log } from '@/backend/src/config/logger'

/**
 * 获取角色配置 - 完整错误处理示例
 */
async function getCharacterWithFullErrorHandling(gender: 'male' | 'female'): Promise<CharacterConfig> {
  const characterManager = CharacterManager.getInstance()
  const characterValidator = new CharacterInfoValidator()
  
  try {
    // 1. 尝试获取角色配置
    const character = characterManager.getCharacterByGender(gender)
    
    // 2. 验证配置有效性
    const validationResult = characterValidator.validateCharacterConfig(character)
    
    if (!validationResult.isValid) {
      log.error('角色配置验证失败', {
        characterId: character.id,
        errors: validationResult.errors,
        warnings: validationResult.warnings
      })
      
      // 3. 尝试自动修复
      log.info('尝试自动修复角色配置', { characterId: character.id })
      const fixedCharacter = characterValidator.autoFixCharacterConfig(character)
      
      // 4. 重新验证修复后的配置
      const revalidationResult = characterValidator.validateCharacterConfig(fixedCharacter)
      
      if (revalidationResult.isValid) {
        log.info('自动修复成功', { characterId: fixedCharacter.id })
        return fixedCharacter
      } else {
        // 5. 修复失败，使用降级方案
        log.error('自动修复失败，使用降级方案', {
          characterId: character.id,
          errors: revalidationResult.errors
        })
        
        // 使用默认配置
        const defaultCharacter = characterManager.getDefaultCharacter()
        log.warn('已切换到默认角色配置', { defaultCharacterId: defaultCharacter.id })
        
        return defaultCharacter
      }
    }
    
    // 6. 验证通过，返回配置
    log.info('角色配置验证通过', { characterId: character.id })
    return character
    
  } catch (error) {
    // 7. 异常捕获和处理
    log.error('获取角色配置时发生异常', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      gender,
      timestamp: new Date().toISOString()
    })
    
    // 8. 根据错误类型提供不同的降级方案
    if (error instanceof NetworkError) {
      log.warn('网络错误，尝试使用缓存配置')
      const cachedCharacter = characterManager.getCachedCharacter(gender)
      if (cachedCharacter) {
        return cachedCharacter
      }
    }
    
    // 9. 最终降级方案：使用默认配置
    const defaultCharacter = characterManager.getDefaultCharacter()
    log.error('所有降级方案失败，使用默认配置', {
      originalError: error instanceof Error ? error.message : String(error)
    })
    
    return defaultCharacter
  }
}

/**
 * 更新角色配置 - 完整错误处理示例
 */
async function updateCharacterWithFullErrorHandling(
  updates: Partial<CharacterConfig>
): Promise<CharacterConfig> {
  const characterManager = CharacterManager.getInstance()
  const characterValidator = new CharacterInfoValidator()
  
  try {
    // 1. 获取当前配置
    const currentCharacter = characterManager.getCurrentCharacter()
    if (!currentCharacter) {
      throw new Error('当前角色配置不存在')
    }
    
    // 2. 合并更新
    const updatedCharacter = { ...currentCharacter, ...updates }
    
    // 3. 验证更新后的配置
    const validationResult = characterValidator.validateCharacterConfig(updatedCharacter)
    
    if (!validationResult.isValid) {
      log.error('角色配置更新验证失败', {
        characterId: updatedCharacter.id,
        errors: validationResult.errors,
        warnings: validationResult.warnings
      })
      
      // 返回验证结果，让用户决定是否继续
      throw new ValidationError('配置验证失败', validationResult)
    }
    
    // 4. 检查与用户档案的一致性
    const child = characterManager.getCurrentChild()
    if (child) {
      const consistencyResult = characterValidator.validateChildCharacterConsistency(
        child,
        updatedCharacter
      )
      
      if (!consistencyResult.isValid) {
        log.warn('角色配置与用户档案不一致', {
          characterId: updatedCharacter.id,
          childId: child.id,
          warnings: consistencyResult.warnings
        })
      }
    }
    
    // 5. 保存更新
    await characterManager.updateCharacter(updatedCharacter)
    
    log.info('角色配置更新成功', { characterId: updatedCharacter.id })
    return updatedCharacter
    
  } catch (error) {
    // 6. 错误处理
    if (error instanceof ValidationError) {
      log.error('验证错误', {
        errors: error.validationResult.errors
      })
      throw error
    }
    
    log.error('更新角色配置时发生异常', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    })
    
    throw new Error('更新角色配置失败')
  }
}

/**
 * 验证错误类
 */
class ValidationError extends Error {
  constructor(
    message: string,
    public validationResult: ValidationResult
  ) {
    super(message)
    this.name = 'ValidationError'
  }
}
```

### 10.3 数据同步

#### 10.3.1 用户档案更新后同步角色配置

当用户档案更新后，需要同步更新角色配置。

```typescript
async function updateChildProfile(child: Child) {
  // 保存用户档案
  await saveChildToDatabase(child)
  
  // 同步更新角色配置
  const characterManager = CharacterManager.getInstance()
  characterManager.setCurrentChild(child)
  
  // 获取更新后的角色配置
  const updatedCharacter = characterManager.getCharacterForUser(child)
  
  return updatedCharacter
}
```

#### 10.3.2 角色配置更新后验证一致性

角色配置更新后，建议验证与用户档案的一致性。

```typescript
function updateCharacter(updates: Partial<CharacterConfig>) {
  const updatedCharacter = { ...character, ...updates }
  
  // 更新角色配置
  characterManager.updateCharacter(updatedCharacter)
  
  // 验证与用户档案的一致性
  const child = characterManager.getCurrentChild()
  if (child) {
    const validationResult = characterValidator.validateChildCharacterConsistency(
      child,
      updatedCharacter
    )
    
    if (!validationResult.isValid) {
      console.warn('角色配置与用户档案不一致:', validationResult.warnings)
    }
  }
}
```

### 10.4 用户体验

#### 10.4.1 提供自动修复选项

当角色配置存在问题时，提供自动修复选项，提升用户体验。

```typescript
if (!validationResult.isValid) {
  return (
    <div className="validation-error">
      <p>角色配置存在问题</p>
      <button onClick={handleAutoFix}>自动修复</button>
    </div>
  )
}
```

#### 10.4.2 显示详细的验证结果

提供详细的验证结果，帮助用户了解问题所在。

```typescript
{validationResult && (
  <div className="validation-result">
    {validationResult.errors.length > 0 && (
      <div className="validation-errors">
        <h3>错误 ({validationResult.errors.length})</h3>
        <ul>
          {validationResult.errors.map((error, index) => (
            <li key={index}>
              <strong>{error.field}:</strong> {error.message}
            </li>
          ))}
        </ul>
      </div>
    )}
    
    {validationResult.warnings.length > 0 && (
      <div className="validation-warnings">
        <h3>警告 ({validationResult.warnings.length})</h3>
        <ul>
          {validationResult.warnings.map((warning, index) => (
            <li key={index}>
              <strong>{warning.field}:</strong> {warning.message}
            </li>
          ))}
        </ul>
      </div>
    )}
    
    {validationResult.suggestions.length > 0 && (
      <div className="validation-suggestions">
        <h3>建议 ({validationResult.suggestions.length})</h3>
        <ul>
          {validationResult.suggestions.map((suggestion, index) => (
            <li key={index}>
              <strong>{suggestion.field}:</strong> {suggestion.message}
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
)}
```

### 10.5 安全性

#### 10.5.1 输入验证

在保存用户输入之前，进行严格的输入验证。

```typescript
function validateFormData(formData: Partial<Child>): Record<string, string> {
  const errors: Record<string, string> = {}
  
  if (!formData.name || formData.name.trim().length === 0) {
    errors.name = '姓名不能为空'
  }
  
  if (formData.name && formData.name.length > 50) {
    errors.name = '姓名长度不能超过50个字符'
  }
  
  if (!formData.gender) {
    errors.gender = '性别不能为空'
  }
  
  return errors
}
```

#### 10.5.2 数据清理

在保存数据之前，清理和格式化数据。

```typescript
function sanitizeFormData(formData: Partial<Child>): Partial<Child> {
  const sanitized: Partial<Child> = {}
  
  if (formData.name) {
    sanitized.name = formData.name.trim()
  }
  
  if (formData.gender) {
    sanitized.gender = formData.gender
  }
  
  if (formData.birthday) {
    sanitized.birthday = new Date(formData.birthday)
  }
  
  return sanitized
}
```

### 10.6 国际化支持

#### 10.6.1 国际化架构设计

角色信息管理器支持多语言国际化，采用基于i18next的国际化解决方案。

```typescript
// i18n配置
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      'zh-CN': {
        translation: {
          character: {
            name: '角色名称',
            age: '年龄',
            gender: '性别',
            birthday: '生日',
            zodiac: '星座',
            personality: '个性特征',
            voice: '语音设置',
            theme: '主题配置',
            expressions: '表情配置',
            male: '男',
            female: '女'
          },
          validation: {
            required: '此项为必填项',
            invalidFormat: '格式不正确',
            outOfRange: '值超出范围',
            fileNotFound: '文件不存在',
            invalidConfig: '配置无效'
          },
          errors: {
            characterNotFound: '角色配置未找到',
            validationFailed: '验证失败',
            autoFixFailed: '自动修复失败',
            fallbackToDefault: '已切换到默认配置'
          }
        }
      },
      'en-US': {
        translation: {
          character: {
            name: 'Character Name',
            age: 'Age',
            gender: 'Gender',
            birthday: 'Birthday',
            zodiac: 'Zodiac',
            personality: 'Personality',
            voice: 'Voice Settings',
            theme: 'Theme Configuration',
            expressions: 'Expression Configuration',
            male: 'Male',
            female: 'Female'
          },
          validation: {
            required: 'This field is required',
            invalidFormat: 'Invalid format',
            outOfRange: 'Value out of range',
            fileNotFound: 'File not found',
            invalidConfig: 'Invalid configuration'
          },
          errors: {
            characterNotFound: 'Character configuration not found',
            validationFailed: 'Validation failed',
            autoFixFailed: 'Auto-fix failed',
            fallbackToDefault: 'Switched to default configuration'
          }
        }
      }
    },
    lng: 'zh-CN',
    fallbackLng: 'zh-CN',
    interpolation: {
      escapeValue: false
    }
  })

export default i18n
```

#### 10.6.2 多语言角色配置

支持不同语言版本的角色配置。

```typescript
interface LocalizedCharacterConfig extends CharacterConfig {
  localizedNames: {
    'zh-CN': string
    'en-US': string
  }
  localizedDescriptions: {
    'zh-CN': string
    'en-US': string
  }
  localizedPersonalities: {
    'zh-CN': PersonalityConfig
    'en-US': PersonalityConfig
  }
}

// 获取本地化角色配置
function getLocalizedCharacter(
  character: LocalizedCharacterConfig,
  locale: string = 'zh-CN'
): CharacterConfig {
  return {
    ...character,
    name: character.localizedNames[locale as keyof typeof character.localizedNames] || character.name,
    description: character.localizedDescriptions[locale as keyof typeof character.localizedDescriptions] || character.description,
    personality: character.localizedPersonalities[locale as keyof typeof character.localizedPersonalities] || character.personality
  }
}

// 使用示例
const character = characterManager.getCharacterByGender('female')
const localizedCharacter = getLocalizedCharacter(character, 'en-US')
```

#### 10.6.3 多语言验证消息

验证错误消息支持多语言显示。

```typescript
interface LocalizedValidationError extends ValidationError {
  localizedMessages: {
    'zh-CN': string
    'en-US': string
  }
}

function getLocalizedValidationMessage(
  error: ValidationError,
  locale: string = 'zh-CN'
): string {
  const messages = {
    'zh-CN': `${error.field}: ${error.message}`,
    'en-US': `${error.field}: ${error.message}`
  }
  
  return messages[locale as keyof typeof messages] || messages['zh-CN']
}

// 在验证器中使用
class CharacterInfoValidator {
  validateCharacterConfig(character: CharacterConfig): ValidationResult {
    const errors: ValidationError[] = []
    
    if (!character.name) {
      errors.push({
        field: 'name',
        message: i18n.t('validation.required'),
        code: 'ERR_001'
      })
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings: [],
      suggestions: []
    }
  }
}
```

#### 10.6.4 多语言UI组件

创建支持多语言的UI组件。

```typescript
import { useTranslation } from 'react-i18next'

function CharacterInfoDisplay({ character }: { character: CharacterConfig }) {
  const { t } = useTranslation()

  return (
    <div className="character-info">
      <h2>{t('character.name')}: {character.name}</h2>
      <p>{t('character.age')}: {character.age}</p>
      <p>{t('character.gender')}: {t(`character.${character.gender}`)}</p>
      <p>{t('character.birthday')}: {character.birthday.solar}</p>
      <p>{t('character.zodiac')}: {character.zodiac}</p>
    </div>
  )
}

function ValidationErrorDisplay({ validationResult }: { validationResult: ValidationResult }) {
  const { t } = useTranslation()

  return (
    <div className="validation-errors">
      {validationResult.errors.map((error, index) => (
        <div key={index} className="error-item">
          <strong>{error.field}:</strong> {getLocalizedValidationMessage(error, i18n.language)}
        </div>
      ))}
    </div>
  )
}
```

#### 10.6.5 语言切换功能

实现语言切换功能。

```typescript
import i18n from '@/config/i18n'

function LanguageSwitcher() {
  const { t, i18n } = useTranslation()

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    log.info('语言已切换', { language: lng })
  }

  return (
    <div className="language-switcher">
      <button
        onClick={() => changeLanguage('zh-CN')}
        className={i18n.language === 'zh-CN' ? 'active' : ''}
      >
        中文
      </button>
      <button
        onClick={() => changeLanguage('en-US')}
        className={i18n.language === 'en-US' ? 'active' : ''}
      >
        English
      </button>
    </div>
  )
}

// 监听语言变化，重新加载角色配置
useEffect(() => {
  const handleLanguageChange = (lng: string) => {
    const characterManager = CharacterManager.getInstance()
    const character = characterManager.getCurrentCharacter()
    if (character) {
      const localizedCharacter = getLocalizedCharacter(character, lng)
      setCharacter(localizedCharacter)
    }
  }

  i18n.on('languageChanged', handleLanguageChange)

  return () => {
    i18n.off('languageChanged', handleLanguageChange)
  }
}, [])
```

#### 10.6.6 日期和数字格式化

根据语言环境格式化日期和数字。

```typescript
import { format } from 'date-fns'
import { zhCN, enUS } from 'date-fns/locale'

function formatDate(date: Date, locale: string = 'zh-CN'): string {
  const dateLocale = locale === 'zh-CN' ? zhCN : enUS
  return format(date, 'PPP', { locale: dateLocale })
}

function formatNumber(number: number, locale: string = 'zh-CN'): string {
  return new Intl.NumberFormat(locale).format(number)
}

function formatCurrency(amount: number, locale: string = 'zh-CN'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: locale === 'zh-CN' ? 'CNY' : 'USD'
  }).format(amount)
}

// 使用示例
const birthday = new Date('2018-05-15')
console.log(formatDate(birthday, 'zh-CN')) // 2018年5月15日
console.log(formatDate(birthday, 'en-US')) // May 15, 2018
```

#### 10.6.7 多语言资源文件管理

组织多语言资源文件。

```
src/
├── locales/
│   ├── zh-CN/
│   │   ├── character.json
│   │   ├── validation.json
│   │   └── errors.json
│   └── en-US/
│       ├── character.json
│       ├── validation.json
│       └── errors.json
```

```typescript
// character.json (zh-CN)
{
  "name": "角色名称",
  "age": "年龄",
  "gender": "性别",
  "birthday": "生日",
  "zodiac": "星座"
}

// character.json (en-US)
{
  "name": "Character Name",
  "age": "Age",
  "gender": "Gender",
  "birthday": "Birthday",
  "zodiac": "Zodiac"
}
```

#### 10.6.8 国际化测试

测试多语言功能。

```typescript
import { render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/config/i18n'
import CharacterInfoDisplay from './CharacterInfoDisplay'

describe('CharacterInfoDisplay i18n', () => {
  const character = {
    name: '小语',
    age: 6,
    gender: 'female',
    birthday: { solar: '2018-05-15', lunar: '四月初一' },
    zodiac: '金牛座'
  }

  it('应该显示中文内容', () => {
    i18n.changeLanguage('zh-CN')
    
    render(
      <I18nextProvider i18n={i18n}>
        <CharacterInfoDisplay character={character} />
      </I18nextProvider>
    )
    
    expect(screen.getByText('角色名称')).toBeInTheDocument()
    expect(screen.getByText('年龄')).toBeInTheDocument()
    expect(screen.getByText('性别')).toBeInTheDocument()
  })

  it('应该显示英文内容', () => {
    i18n.changeLanguage('en-US')
    
    render(
      <I18nextProvider i18n={i18n}>
        <CharacterInfoDisplay character={character} />
      </I18nextProvider>
    )
    
    expect(screen.getByText('Character Name')).toBeInTheDocument()
    expect(screen.getByText('Age')).toBeInTheDocument()
    expect(screen.getByText('Gender')).toBeInTheDocument()
  })
})
```

#### 10.6.9 支持的语言列表

当前支持的语言：

| 语言代码 | 语言名称 | 支持状态 |
|----------|----------|----------|
| zh-CN | 简体中文 | ✅ 完全支持 |
| en-US | 英语（美国） | ✅ 完全支持 |
| zh-TW | 繁体中文 | 🚧 计划中 |
| ja-JP | 日语 | 🚧 计划中 |
| ko-KR | 韩语 | 🚧 计划中 |

---

## 附录

### 10.7 单元测试

本节提供角色信息管理器核心功能的单元测试示例，使用 Vitest 作为测试框架，确保代码质量和功能正确性。

#### 10.7.1 测试环境配置

首先配置测试环境：

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData'
      ]
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
```

```typescript
// src/tests/setup.ts
import { vi } from 'vitest'
import { log } from '@/backend/src/config/logger'

// Mock日志模块
vi.mock('@/backend/src/config/logger', () => ({
  log: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn()
  }
}))

// 全局测试配置
global.console = {
  ...console,
  error: vi.fn(),
  warn: vi.fn(),
  log: vi.fn()
}
```

#### 10.7.2 CharacterManager 单例测试

测试角色管理器的单例模式和核心功能：

```typescript
// src/tests/unit/CharacterManager.test.ts
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { CharacterManager } from '@/lib/character/CharacterManager'
import { CharacterConfig } from '@/types/character'
import { log } from '@/backend/src/config/logger'

describe('CharacterManager', () => {
  let characterManager: CharacterManager

  beforeEach(() => {
    vi.clearAllMocks()
    characterManager = CharacterManager.getInstance()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('单例模式', () => {
    it('应该返回相同的实例', () => {
      const instance1 = CharacterManager.getInstance()
      const instance2 = CharacterManager.getInstance()
      expect(instance1).toBe(instance2)
    })

    it('应该维护全局唯一性', () => {
      const instance1 = CharacterManager.getInstance()
      const instance2 = CharacterManager.getInstance()
      const instance3 = CharacterManager.getInstance()
      
      expect(instance1).toBe(instance2)
      expect(instance2).toBe(instance3)
    })
  })

  describe('getCharacterByGender', () => {
    it('应该返回女性角色配置', () => {
      const femaleCharacter = characterManager.getCharacterByGender('female')
      
      expect(femaleCharacter).toBeDefined()
      expect(femaleCharacter.gender).toBe('female')
      expect(femaleCharacter.name).toBeDefined()
      expect(femaleCharacter.avatarPath).toBeDefined()
      log.info('女性角色配置获取成功', { character: femaleCharacter })
    })

    it('应该返回男性角色配置', () => {
      const maleCharacter = characterManager.getCharacterByGender('male')
      
      expect(maleCharacter).toBeDefined()
      expect(maleCharacter.gender).toBe('male')
      expect(maleCharacter.name).toBeDefined()
      expect(maleCharacter.avatarPath).toBeDefined()
      log.info('男性角色配置获取成功', { character: maleCharacter })
    })

    it('应该缓存角色配置', () => {
      const character1 = characterManager.getCharacterByGender('female')
      const character2 = characterManager.getCharacterByGender('female')
      
      expect(character1).toBe(character2)
      log.info('角色配置缓存验证通过')
    })

    it('应该对无效性别抛出错误', () => {
      expect(() => {
        characterManager.getCharacterByGender('invalid' as any)
      }).toThrow('Invalid gender: invalid')
    })
  })

  describe('getCurrentCharacter', () => {
    it('应该返回当前角色配置', () => {
      const currentCharacter = characterManager.getCurrentCharacter()
      
      expect(currentCharacter).toBeDefined()
      expect(currentCharacter.gender).toBeDefined()
      expect(currentCharacter.name).toBeDefined()
      log.info('当前角色配置获取成功', { character: currentCharacter })
    })

    it('应该默认返回女性角色', () => {
      const currentCharacter = characterManager.getCurrentCharacter()
      
      expect(currentCharacter.gender).toBe('female')
      log.info('默认角色性别验证通过', { gender: currentCharacter.gender })
    })
  })

  describe('updateCharacter', () => {
    it('应该更新角色配置', () => {
      const updates: Partial<CharacterConfig> = {
        name: '测试角色',
        age: 7
      }
      
      characterManager.updateCharacter(updates)
      const updatedCharacter = characterManager.getCurrentCharacter()
      
      expect(updatedCharacter.name).toBe('测试角色')
      expect(updatedCharacter.age).toBe(7)
      log.info('角色配置更新成功', { updates, updatedCharacter })
    })

    it('应该触发重新渲染', () => {
      const renderSpy = vi.fn()
      const character = characterManager.getCurrentCharacter()
      
      characterManager.on('update', renderSpy)
      characterManager.updateCharacter({ name: '新名称' })
      
      expect(renderSpy).toHaveBeenCalled()
      log.info('重新渲染触发验证通过')
    })
  })

  describe('缓存机制', () => {
    it('应该有效缓存角色配置', () => {
      const start = performance.now()
      
      for (let i = 0; i < 1000; i++) {
        characterManager.getCharacterByGender('female')
      }
      
      const end = performance.now()
      const duration = end - start
      
      expect(duration).toBeLessThan(10)
      log.info('缓存性能测试通过', { duration, iterations: 1000 })
    })
  })
})
```

#### 10.7.3 CharacterInfoValidator 验证测试

测试角色配置验证器的各种验证场景：

```typescript
// src/tests/unit/CharacterInfoValidator.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { CharacterInfoValidator } from '@/lib/character/CharacterInfoValidator'
import { CharacterConfig } from '@/types/character'
import { ValidationError } from '@/lib/errors/ValidationError'
import { log } from '@/backend/src/config/logger'

describe('CharacterInfoValidator', () => {
  let validator: CharacterInfoValidator
  let validCharacter: CharacterConfig

  beforeEach(() => {
    vi.clearAllMocks()
    validator = new CharacterInfoValidator()
    validCharacter = {
      id: 'test-character-1',
      name: '测试角色',
      age: 6,
      gender: 'female',
      birthday: {
        solar: '2018-05-15',
        lunar: '四月初一'
      },
      zodiac: '金牛座',
      avatarPath: '/avatars/female/default.png',
      images: {
        avatar: '/avatars/female/default.png',
        additionalImages: []
      },
      themes: [],
      expressions: [],
      personality: [],
      voice: {
        enabled: true,
        volume: 0.8,
        speed: 1.0,
        pitch: 1.0
      }
    }
  })

  describe('validateCharacterConfig', () => {
    it('应该验证有效的角色配置', () => {
      const result = validator.validateCharacterConfig(validCharacter)
      
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
      expect(result.warnings).toHaveLength(0)
      log.info('有效角色配置验证通过', { character: validCharacter })
    })

    it('应该检测缺失的必需字段', () => {
      const invalidCharacter = { ...validCharacter }
      delete (invalidCharacter as any).name
      
      const result = validator.validateCharacterConfig(invalidCharacter)
      
      expect(result.isValid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
      expect(result.errors.some(e => e.field === 'name')).toBe(true)
      log.warn('缺失字段验证通过', { errors: result.errors })
    })

    it('应该检测无效的年龄范围', () => {
      const invalidCharacter = { ...validCharacter, age: -1 }
      
      const result = validator.validateCharacterConfig(invalidCharacter)
      
      expect(result.isValid).toBe(false)
      expect(result.errors.some(e => e.field === 'age')).toBe(true)
      log.warn('无效年龄验证通过', { errors: result.errors })
    })

    it('应该检测无效的性别值', () => {
      const invalidCharacter = { ...validCharacter, gender: 'invalid' as any }
      
      const result = validator.validateCharacterConfig(invalidCharacter)
      
      expect(result.isValid).toBe(false)
      expect(result.errors.some(e => e.field === 'gender')).toBe(true)
      log.warn('无效性别验证通过', { errors: result.errors })
    })

    it('应该检测不存在的图片文件', () => {
      const invalidCharacter = {
        ...validCharacter,
        avatarPath: '/avatars/non-existent.png'
      }
      
      const result = validator.validateCharacterConfig(invalidCharacter)
      
      expect(result.warnings.length).toBeGreaterThan(0)
      expect(result.warnings.some(w => w.field === 'avatarPath')).toBe(true)
      log.warn('不存在的图片验证通过', { warnings: result.warnings })
    })

    it('应该检测无效的主题配置', () => {
      const invalidCharacter = {
        ...validCharacter,
        themes: [
          {
            id: 'invalid-theme',
            name: '无效主题',
            colors: { primary: '#invalid' }
          } as any
        ]
      }
      
      const result = validator.validateCharacterConfig(invalidCharacter)
      
      expect(result.errors.some(e => e.field === 'themes')).toBe(true)
      log.warn('无效主题配置验证通过', { errors: result.errors })
    })

    it('应该检测无效的表情配置', () => {
      const invalidCharacter = {
        ...validCharacter,
        expressions: [
          {
            id: 'invalid-expression',
            name: '无效表情',
            trigger: 'invalid-trigger',
            images: []
          } as any
        ]
      }
      
      const result = validator.validateCharacterConfig(invalidCharacter)
      
      expect(result.errors.some(e => e.field === 'expressions')).toBe(true)
      log.warn('无效表情配置验证通过', { errors: result.errors })
    })
  })

  describe('validateField', () => {
    it('应该验证单个字段', () => {
      const result = validator.validateField('name', '测试角色')
      
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
      log.info('单字段验证通过', { field: 'name', value: '测试角色' })
    })

    it('应该检测无效的单个字段', () => {
      const result = validator.validateField('age', -1)
      
      expect(result.isValid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
      log.warn('无效单字段验证通过', { field: 'age', value: -1 })
    })
  })

  describe('autoFixCharacterConfig', () => {
    it('应该自动修复可修复的问题', () => {
      const brokenCharacter = {
        ...validCharacter,
        age: 25,
        voice: {
          enabled: true,
          volume: 2.0,
          speed: 1.0,
          pitch: 1.0
        }
      }
      
      const fixedCharacter = validator.autoFixCharacterConfig(brokenCharacter)
      
      expect(fixedCharacter.age).toBeLessThanOrEqual(22)
      expect(fixedCharacter.voice.volume).toBeLessThanOrEqual(1.0)
      log.info('自动修复验证通过', { 
        original: brokenCharacter, 
        fixed: fixedCharacter 
      })
    })

    it('应该记录修复操作', () => {
      const brokenCharacter = { ...validCharacter, age: 30 }
      
      validator.autoFixCharacterConfig(brokenCharacter)
      
      expect(log.info).toHaveBeenCalledWith(
        expect.stringContaining('自动修复'),
        expect.any(Object)
      )
    })
  })

  describe('checkConsistencyWithUserProfile', () => {
    it('应该检测一致的角色配置', () => {
      const userProfile = {
        name: '测试用户',
        age: 6,
        gender: 'female'
      }
      
      const result = validator.checkConsistencyWithUserProfile(
        validCharacter,
        userProfile
      )
      
      expect(result.isConsistent).toBe(true)
      expect(result.warnings).toHaveLength(0)
      log.info('一致性检查通过', { character: validCharacter, userProfile })
    })

    it('应该检测不一致的角色配置', () => {
      const userProfile = {
        name: '测试用户',
        age: 10,
        gender: 'male'
      }
      
      const result = validator.checkConsistencyWithUserProfile(
        validCharacter,
        userProfile
      )
      
      expect(result.isConsistent).toBe(false)
      expect(result.warnings.length).toBeGreaterThan(0)
      log.warn('不一致性检测通过', { warnings: result.warnings })
    })
  })
})
```

#### 10.7.4 错误处理测试

测试自定义错误类和错误处理机制：

```typescript
// src/tests/unit/ErrorHandler.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ValidationError } from '@/lib/errors/ValidationError'
import { CharacterInfoValidator } from '@/lib/character/CharacterInfoValidator'
import { log } from '@/backend/src/config/logger'

describe('错误处理机制', () => {
  let validator: CharacterInfoValidator

  beforeEach(() => {
    vi.clearAllMocks()
    validator = new CharacterInfoValidator()
  })

  describe('ValidationError', () => {
    it('应该创建正确的验证错误', () => {
      const error = new ValidationError('name', '名称不能为空')
      
      expect(error).toBeInstanceOf(Error)
      expect(error.field).toBe('name')
      expect(error.message).toBe('名称不能为空')
      expect(error.code).toBe('VALIDATION_ERROR')
      log.error('验证错误创建测试通过', { error })
    })

    it('应该支持错误链', () => {
      const originalError = new Error('原始错误')
      const validationError = new ValidationError('age', '年龄无效', originalError)
      
      expect(validationError.cause).toBe(originalError)
      log.error('错误链测试通过', { error: validationError })
    })

    it('应该序列化为JSON', () => {
      const error = new ValidationError('name', '名称不能为空')
      const serialized = JSON.stringify(error)
      const deserialized = JSON.parse(serialized)
      
      expect(deserialized.field).toBe('name')
      expect(deserialized.message).toBe('名称不能为空')
      expect(deserialized.code).toBe('VALIDATION_ERROR')
      log.info('错误序列化测试通过', { error })
    })
  })

  describe('错误捕获和分类', () => {
    it('应该正确捕获系统级错误', () => {
      const invalidCharacter = null as any
      
      expect(() => {
        validator.validateCharacterConfig(invalidCharacter)
      }).toThrow()
      
      expect(log.error).toHaveBeenCalled()
      log.info('系统级错误捕获测试通过')
    })

    it('应该正确捕获业务级错误', () => {
      const invalidCharacter = {
        name: '',
        age: -1,
        gender: 'invalid'
      }
      
      const result = validator.validateCharacterConfig(invalidCharacter)
      
      expect(result.isValid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
      expect(log.warn).toHaveBeenCalled()
      log.info('业务级错误捕获测试通过', { errors: result.errors })
    })

    it('应该正确处理网络错误', async () => {
      const mockFetch = vi.fn(() => Promise.reject(new Error('Network error')))
      global.fetch = mockFetch
      
      try {
        await fetch('/api/characters')
        expect(true).toBe(false)
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect(log.error).toHaveBeenCalledWith(
          expect.stringContaining('网络错误'),
          expect.any(Object)
        )
        log.info('网络错误处理测试通过')
      }
    })
  })

  describe('降级策略', () => {
    it('应该在验证失败时使用默认配置', () => {
      const invalidCharacter = {
        name: '',
        age: -1,
        gender: 'invalid'
      }
      
      const result = validator.validateCharacterConfig(invalidCharacter)
      const fallbackCharacter = validator.getFallbackCharacter()
      
      expect(result.isValid).toBe(false)
      expect(fallbackCharacter).toBeDefined()
      expect(fallbackCharacter.name).toBeDefined()
      log.info('降级策略测试通过', { fallbackCharacter })
    })

    it('应该在图片加载失败时使用占位图', () => {
      const invalidCharacter = {
        name: '测试',
        age: 6,
        gender: 'female',
        avatarPath: '/non-existent.png'
      }
      
      const result = validator.validateCharacterConfig(invalidCharacter)
      const placeholderPath = validator.getPlaceholderAvatar()
      
      expect(result.warnings.some(w => w.field === 'avatarPath')).toBe(true)
      expect(placeholderPath).toBeDefined()
      log.info('图片降级策略测试通过', { placeholderPath })
    })
  })

  describe('错误恢复', () => {
    it('应该能够从验证错误中恢复', () => {
      const invalidCharacter = {
        name: '',
        age: 30,
        gender: 'female'
      }
      
      const result = validator.validateCharacterConfig(invalidCharacter)
      expect(result.isValid).toBe(false)
      
      const fixedCharacter = validator.autoFixCharacterConfig(invalidCharacter)
      const fixedResult = validator.validateCharacterConfig(fixedCharacter)
      
      expect(fixedResult.isValid).toBe(true)
      log.info('错误恢复测试通过', { 
        originalResult: result, 
        fixedResult 
      })
    })

    it('应该记录恢复操作', () => {
      const invalidCharacter = { name: '', age: 30, gender: 'female' }
      
      validator.autoFixCharacterConfig(invalidCharacter)
      
      expect(log.info).toHaveBeenCalledWith(
        expect.stringContaining('自动修复'),
        expect.any(Object)
      )
      log.info('恢复操作记录测试通过')
    })
  })
})
```

#### 10.7.5 性能优化测试

测试性能优化相关功能：

```typescript
// src/tests/unit/PerformanceOptimization.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CharacterManager } from '@/lib/character/CharacterManager'
import { debounce, throttle } from 'lodash'
import { log } from '@/backend/src/config/logger'

describe('性能优化测试', () => {
  let characterManager: CharacterManager

  beforeEach(() => {
    vi.clearAllMocks()
    characterManager = CharacterManager.getInstance()
  })

  describe('缓存性能', () => {
    it('应该有效缓存角色配置', () => {
      const iterations = 1000
      const start = performance.now()
      
      for (let i = 0; i < iterations; i++) {
        characterManager.getCharacterByGender('female')
      }
      
      const end = performance.now()
      const duration = end - start
      const avgTime = duration / iterations
      
      expect(duration).toBeLessThan(100)
      expect(avgTime).toBeLessThan(0.1)
      log.info('缓存性能测试通过', { 
        iterations, 
        duration, 
        avgTime 
      })
    })

    it('应该避免重复计算', () => {
      const character1 = characterManager.getCharacterByGender('female')
      const character2 = characterManager.getCharacterByGender('female')
      const character3 = characterManager.getCharacterByGender('female')
      
      expect(character1).toBe(character2)
      expect(character2).toBe(character3)
      log.info('重复计算避免测试通过')
    })
  })

  describe('防抖和节流', () => {
    it('防抖应该延迟执行', async () => {
      const mockFn = vi.fn()
      const debouncedFn = debounce(mockFn, 100)
      
      debouncedFn()
      debouncedFn()
      debouncedFn()
      
      expect(mockFn).not.toHaveBeenCalled()
      
      await new Promise(resolve => setTimeout(resolve, 150))
      expect(mockFn).toHaveBeenCalledTimes(1)
      log.info('防抖功能测试通过')
    })

    it('节流应该限制执行频率', async () => {
      const mockFn = vi.fn()
      const throttledFn = throttle(mockFn, 100)
      
      throttledFn()
      throttledFn()
      throttledFn()
      
      expect(mockFn).toHaveBeenCalledTimes(1)
      
      await new Promise(resolve => setTimeout(resolve, 150))
      throttledFn()
      expect(mockFn).toHaveBeenCalledTimes(2)
      log.info('节流功能测试通过')
    })
  })

  describe('组件渲染优化', () => {
    it('应该避免不必要的重新渲染', () => {
      let renderCount = 0
      
      const Component = ({ name, age }: { name: string, age: number }) => {
        renderCount++
        return <div>{name} - {age}</div>
      }
      
      const initialProps = { name: '测试', age: 6 }
      
      renderCount = 0
      Component(initialProps)
      expect(renderCount).toBe(1)
      
      Component(initialProps)
      expect(renderCount).toBe(2)
      
      log.info('组件渲染测试通过', { renderCount })
    })
  })

  describe('内存使用', () => {
    it('应该合理管理内存', () => {
      const initialMemory = (performance as any).memory?.usedJSHeapSize || 0
      
      for (let i = 0; i < 1000; i++) {
        characterManager.getCharacterByGender('female')
        characterManager.getCharacterByGender('male')
      }
      
      const finalMemory = (performance as any).memory?.usedJSHeapSize || 0
      const memoryIncrease = finalMemory - initialMemory
      
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024)
      log.info('内存使用测试通过', { memoryIncrease })
    })
  })

  describe('并发处理', () => {
    it('应该正确处理并发请求', async () => {
      const promises = []
      
      for (let i = 0; i < 100; i++) {
        promises.push(
          Promise.resolve(characterManager.getCharacterByGender('female'))
        )
      }
      
      const results = await Promise.all(promises)
      
      expect(results.length).toBe(100)
      expect(results.every(r => r === results[0])).toBe(true)
      log.info('并发处理测试通过', { requestCount: 100 })
    })
  })
})
```

#### 10.7.6 集成测试

测试多个模块之间的集成：

```typescript
// src/tests/integration/CharacterManagement.integration.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CharacterManager } from '@/lib/character/CharacterManager'
import { CharacterInfoValidator } from '@/lib/character/CharacterInfoValidator'
import { log } from '@/backend/src/config/logger'

describe('角色管理集成测试', () => {
  let characterManager: CharacterManager
  let validator: CharacterInfoValidator

  beforeEach(() => {
    vi.clearAllMocks()
    characterManager = CharacterManager.getInstance()
    validator = new CharacterInfoValidator()
  })

  describe('角色配置完整流程', () => {
    it('应该完成角色配置的完整生命周期', () => {
      const character = characterManager.getCharacterByGender('female')
      expect(character).toBeDefined()
      
      const validationResult = validator.validateCharacterConfig(character)
      expect(validationResult.isValid).toBe(true)
      
      const updatedCharacter = {
        ...character,
        name: '更新后的角色'
      }
      characterManager.updateCharacter(updatedCharacter)
      
      const currentCharacter = characterManager.getCurrentCharacter()
      expect(currentCharacter.name).toBe('更新后的角色')
      
      log.info('角色配置完整流程测试通过', { 
        original: character, 
        updated: currentCharacter 
      })
    })
  })

  describe('验证和修复集成', () => {
    it('应该集成验证和自动修复功能', () => {
      const invalidCharacter = {
        name: '',
        age: 30,
        gender: 'female',
        avatarPath: '/avatars/female/default.png',
        birthday: { solar: '2018-05-15', lunar: '四月初一' },
        zodiac: '金牛座',
        images: { avatar: '/avatars/female/default.png', additionalImages: [] },
        themes: [],
        expressions: [],
        personality: [],
        voice: { enabled: true, volume: 0.8, speed: 1.0, pitch: 1.0 }
      }
      
      const validationResult = validator.validateCharacterConfig(invalidCharacter)
      expect(validationResult.isValid).toBe(false)
      
      const fixedCharacter = validator.autoFixCharacterConfig(invalidCharacter)
      const fixedResult = validator.validateCharacterConfig(fixedCharacter)
      expect(fixedResult.isValid).toBe(true)
      
      log.info('验证和修复集成测试通过', { 
        validationResult, 
        fixedResult 
      })
    })
  })

  describe('用户数据同步集成', () => {
    it('应该同步用户档案数据', () => {
      const userProfile = {
        name: '测试用户',
        age: 7,
        gender: 'male'
      }
      
      const character = characterManager.getCharacterByGender('male')
      const consistencyResult = validator.checkConsistencyWithUserProfile(
        character,
        userProfile
      )
      
      expect(consistencyResult.isConsistent).toBe(true)
      
      log.info('用户数据同步集成测试通过', { 
        character, 
        userProfile, 
        consistencyResult 
      })
    })
  })
})
```

#### 10.7.7 测试覆盖率目标

为确保代码质量，设定以下测试覆盖率目标：

| 测试类型 | 目标覆盖率 | 当前状态 |
|----------|------------|----------|
| 语句覆盖率 | ≥ 85% | 🚧 进行中 |
| 分支覆盖率 | ≥ 80% | 🚧 进行中 |
| 函数覆盖率 | ≥ 90% | 🚧 进行中 |
| 行覆盖率 | ≥ 85% | 🚧 进行中 |

运行测试命令：

```bash
# 运行所有测试
npm run test

# 运行测试并生成覆盖率报告
npm run test:coverage

# 运行特定测试文件
npm run test CharacterManager

# 监听模式运行测试
npm run test:watch
```

---

## 附录

### A. 错误代码

| 错误代码 | 描述 | 严重程度 |
|----------|------|----------|
| ERR_001 | 缺少必需字段 | Critical |
| ERR_002 | 字段类型不匹配 | Critical |
| ERR_003 | 字段值超出范围 | Critical |
| ERR_004 | 图片文件不存在 | Critical |
| ERR_005 | 主题配置无效 | High |
| ERR_006 | 表情配置无效 | High |
| ERR_007 | 个性配置无效 | High |
| ERR_008 | 语音配置无效 | High |
| WARN_001 | 角色配置与用户档案不一致 | Medium |
| WARN_002 | 主题配置不完整 | Medium |
| WARN_003 | 表情配置缺失 | Medium |
| WARN_004 | 个性特征值异常 | Medium |
| SUGG_001 | 建议使用更合适的主题颜色 | Low |
| SUGG_002 | 建议添加更多表情配置 | Low |
| SUGG_003 | 建议调整语音参数 | Low |
| SUGG_004 | 建议优化个性特征值 | Low |

### B. 星座计算

| 日期范围 | 星座 |
|----------|------|
| 1月1日 - 1月19日 | 摩羯座 |
| 1月20日 - 2月18日 | 水瓶座 |
| 2月19日 - 3月20日 | 双鱼座 |
| 3月21日 - 4月19日 | 白羊座 |
| 4月20日 - 5月20日 | 金牛座 |
| 5月21日 - 6月21日 | 双子座 |
| 6月22日 - 7月22日 | 巨蟹座 |
| 7月23日 - 8月22日 | 狮子座 |
| 8月23日 - 9月22日 | 处女座 |
| 9月23日 - 10月23日 | 天秤座 |
| 10月24日 - 11月22日 | 天蝎座 |
| 11月23日 - 12月21日 | 射手座 |
| 12月22日 - 12月31日 | 摩羯座 |

### C. 相关文档

- [YYC3-XY-架构类-UI-UX全量设计体系整合文档.md](./YYC3-XY-架构类-UI-UX全量设计体系整合文档.md)
- [YYC3-XY-AI角色与浮窗系统设计衔接方案.md](./YYC3-XY-AI角色与浮窗系统设计衔接方案.md)
- [YYC3-XY-项目页面清单文档.md](./YYC3-XY-项目页面清单文档.md)

### D. 更新日志

#### v1.0.0 (2025-01-30)
- 初始版本发布
- 实现角色管理器核心功能
- 实现角色信息验证器
- 实现角色信息管理器UI组件
- 提供完整的API接口文档
- 提供详细的使用示例
- 提供最佳实践指南

---

<div align="center">

> 「***YanYuCloudCube***」
> 「***<admin@0379.email>***」
> 「***Words Initiate Quadrants, Language Serves as Core for the Future***」
> 「***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***」

</div>
