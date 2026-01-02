---

# YYC³-XY 架构类 - 数据架构详细设计文档

> ***YanYuCloudCube***
> **标语**：言启象限 | 语枢未来
> ***Words Initiate Quadrants, Language Serves as Core for the Future***
> **标语**：万象归元于云枢 | 深栈智启新纪元
> ***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***

---

/**
 * @file 数据架构详细设计文档
 * @description YYC³-XY智能成长守护系统的数据架构详细设计，涵盖PostgreSQL、Redis、向量数据库等数据存储方案
 * @module 架构类-数据架构详细设计
 * @author YYC³
 * @version 1.0.0
 * @created 2025-12-24
 * @updated 2025-12-28
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

## 文档信息

- **文件名称**: YYC3-XY-架构类-数据架构详细设计文档.md
- **文档类型**: 架构类
- **创建日期**: 2025-12-24
- **更新日期**: 2025-12-28
- **版本号**: V1.0.0
- **文档状态**: 已发布

---

## 概述

本文档描述YYC³-XY智能成长守护系统的数据架构详细设计，涵盖PostgreSQL、Redis、向量数据库等数据存储方案。文档遵循 YYC³-XY 项目"五高五标五化"架构原则。

---

## 目录

1. [五高五标五化原则体现](#五高五标五化原则体现)
2. [数据架构概述](#数据架构概述)
3. [数据库设计](#数据库设计)
4. [数据存储策略](#数据存储策略)
5. [数据安全](#数据安全)
6. [数据迁移](#数据迁移)

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


## 文档变更记录

| 版本号 | 变更日期 | 变更内容 | 变更人 |
|--------|----------|----------|--------|
| v1.0.0 | 2025-12-25 | 初始版本创建 | AI Assistant |
| v1.0.1 | 2025-12-26 | 内容更新 | AI Assistant |
| v1.0.2 | 2025-12-28 | 元数据标准化 | YYC³ Team |

---

## 一、概述

### 1.1 文档目的

本文档旨在描述YYC³-XY智能编程系统的数据架构设计，为架构师、开发人员和运维人员提供数据存储、访问、迁移、备份、安全、性能优化等方面的详细设计和实施指导。

### 1.2 背景说明

本文档基于YYC³-XY项目的业务需求和技术决策编写，遵循五高五标五化要求，采用多层次、多存储引擎的混合架构设计，满足高可用、高性能、高安全性的数据管理需求。

### 1.3 术语定义

| 术语 | 定义 |
|------|------|
| RDBMS | 关系型数据库管理系统，如PostgreSQL |
| NoSQL | 非关系型数据库，如Redis |
| ORM | 对象关系映射，用于在对象和关系数据库之间建立映射 |
| Cache-Aside | 缓存策略，应用程序负责维护缓存和数据库的同步 |
| RPO | 恢复点目标，数据丢失的最大可接受时间 |
| RTO | 恢复时间目标，系统恢复的最大可接受时间 |

---

## 二、架构设计原则

### 2.1 五高原则

| 维度 | 说明 | 实现方式 |
|------|------|----------|
| 高可用 | 确保数据服务99.99%可用性 | 多级缓存、读写分离、自动故障转移、主从复制 |
| 高性能 | 支持千万级数据存储和毫秒级响应 | 连接池、索引优化、缓存策略、查询优化 |
| 高安全 | 保护数据安全和隐私 | 数据加密、访问控制、审计日志、安全合规 |
| 高扩展 | 支持业务快速增长 | 分库分表、水平扩展、弹性伸缩、数据归档 |
| 高维护 | 降低运维复杂度 | 统一接口、自动化迁移、监控告警、数据治理 |

### 2.2 五标原则

| 维度 | 说明 | 实现方式 |
|------|------|----------|
| 标准化 | 统一数据访问接口和命名规范 | 统一ORM层、标准化表结构、统一命名规范 |
| 规范化 | 遵循数据库设计规范 | 第三范式、外键约束、数据完整性检查 |
| 自动化 | 自动化数据迁移和备份 | 自动化迁移脚本、定时备份、自动恢复 |
| 智能化 | 智能缓存和查询优化 | 智能缓存失效策略、查询计划分析、慢查询优化 |
| 可视化 | 数据监控和可视化 | Grafana监控面板、数据可视化报表、性能指标展示 |

### 2.3 五化原则

| 维度 | 说明 | 实现方式 |
|------|------|----------|
| 流程化 | 标准化的数据流转流程 | 数据生命周期管理、数据迁移流程、备份恢复流程 |
| 文档化 | 完整的数据架构文档 | 数据字典、接口文档、操作手册、故障处理指南 |
| 工具化 | 使用工具提升效率 | 数据迁移工具、监控工具、备份工具、性能分析工具 |
| 数字化 | 数字化数据管理 | 数字化监控指标、数字化告警、数字化性能分析 |
| 生态化 | 构建数据管理生态 | 与监控系统集成、与日志系统集成、与告警系统集成 |

---

## 三、架构现状分析

### 3.1 当前架构

```yaml
当前架构:
  数据存储层:
    - PostgreSQL: 14+ (生产数据)
    - Redis: 6.0+ (缓存、会话、消息队列)
    - SQLite: 3.35+ (本地存储、离线支持)
  
  数据访问层:
    - ORM层: Prisma/TypeORM
    - 缓存层: Redis客户端
    - 数据库管理器: DatabaseManager
  
  数据迁移:
    - localStorage到SQLite迁移: 已实现
    - SQLite到PostgreSQL迁移: 待实现
    - 数据同步机制: 待完善
  
  数据备份:
    - PostgreSQL备份: pg_dump/pg_restore
    - Redis备份: RDB/AOF
    - SQLite备份: 文件备份
  
  数据安全:
    - 传输加密: SSL/TLS
    - 存储加密: AES-256
    - 访问控制: RBAC
    - 审计日志: audit_logs表
```

### 3.2 架构优势

1. **多存储引擎混合架构**：结合PostgreSQL、Redis、SQLite的优势，满足不同场景的数据存储需求
2. **完善的缓存策略**：多级缓存设计，提升系统响应速度
3. **数据迁移支持**：支持从localStorage到SQLite的迁移，为后续迁移到PostgreSQL奠定基础
4. **数据安全保障**：多层次的数据安全机制，包括传输加密、存储加密、访问控制和审计日志
5. **性能优化策略**：索引优化、查询优化、缓存优化等多维度性能优化

### 3.3 架构不足

1. **SQLite到PostgreSQL迁移未完成**：生产环境仍使用SQLite，需要迁移到PostgreSQL
2. **缺少完整的数据同步机制**：本地数据与云端数据同步机制不完善
3. **部分查询未进行优化**：存在慢查询，需要进一步优化
4. **监控告警体系不完善**：缺少完整的监控指标和告警机制
5. **数据治理体系不完善**：缺少完整的数据生命周期管理和数据质量管理

---

## 四、架构设计

### 1.1 架构定位

数据架构是YYC3-XY智能编程系统的核心基础设施，采用多层次、多存储引擎的混合架构设计，满足高可用、高性能、高安全性的数据管理需求。

### 1.2 设计原则

- **高可用性**: 多级缓存、读写分离、自动故障转移
- **高性能性**: 连接池、索引优化、缓存策略
- **高安全性**: 数据加密、访问控制、审计日志
- **高扩展性**: 分库分表、水平扩展、弹性伸缩
- **高可维护性**: 统一接口、自动化迁移、监控告警

### 1.3 核心目标

- 支持千万级数据存储和检索
- 毫秒级响应时间
- 99.99%数据可用性
- 完整的数据生命周期管理

## 二、数据架构设计

### 2.1 整体架构图

```
┌─────────────────────────────────────────────────────────────┐
│                        应用层                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  前端应用    │  │  后端服务    │  │  AI服务      │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      数据访问层                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  ORM层       │  │  缓存层       │  │  数据库管理器 │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      存储引擎层                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  PostgreSQL  │  │    Redis     │  │    SQLite    │       │
│  │  (生产数据)  │  │   (缓存)     │  │  (本地存储)   │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 存储引擎选型

#### 2.2.1 PostgreSQL

- **用途**: 生产环境核心数据存储
- **版本**: PostgreSQL 14+
- **特点**:
  - ACID事务支持
  - 丰富的数据类型（JSONB、UUID、数组）
  - 强大的索引能力（B-tree、Hash、GIN）
  - 全文检索支持
  - 物化视图和函数

#### 2.2.2 Redis

- **用途**: 缓存、会话存储、消息队列
- **版本**: Redis 6.0+
- **特点**:
  - 内存存储，毫秒级响应
  - 丰富的数据结构（String、Hash、List、Set、ZSet）
  - 持久化支持（RDB、AOF）
  - 集群模式支持
  - 发布订阅机制

#### 2.2.3 SQLite

- **用途**: 本地数据存储、离线支持
- **版本**: SQLite 3.35+
- **特点**:
  - 零配置、嵌入式
  - 单文件存储
  - 完整的SQL支持
  - 跨平台兼容
  - 适合本地开发和小型应用

## 三、数据库设计

### 3.1 PostgreSQL 核心表结构

#### 3.1.1 用户表 (users)

```sql
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    avatar_url TEXT,
    role VARCHAR(20) NOT NULL DEFAULT 'parent' 
        CHECK (role IN ('parent', 'admin', 'moderator')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    email_verified BOOLEAN NOT NULL DEFAULT false,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_created_at ON users(created_at);
```

#### 3.1.2 儿童信息表 (children)

```sql
CREATE TABLE IF NOT EXISTS children (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    nickname VARCHAR(100),
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female')),
    birth_date DATE NOT NULL,
    avatar_url TEXT,
    current_stage VARCHAR(50),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_children_user_id ON children(user_id);
CREATE INDEX idx_children_birth_date ON children(birth_date);
```

#### 3.1.3 成长记录表 (growth_records)

```sql
CREATE TABLE IF NOT EXISTS growth_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(20) NOT NULL 
        CHECK (category IN ('milestone', 'daily', 'achievement', 
                           'health', 'education', 'social')),
    media_urls TEXT[],
    tags TEXT[],
    location VARCHAR(255),
    is_public BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_growth_records_child_id ON growth_records(child_id);
CREATE INDEX idx_growth_records_category ON growth_records(category);
CREATE INDEX idx_growth_records_created_at ON growth_records(created_at);
```

### 3.2 SQLite 本地表结构

#### 3.2.1 本地用户表 (users)

```typescript
interface LocalUser {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  role: string;
  created_at: string;
}
```

#### 3.2.2 本地儿童表 (children)

```typescript
interface LocalChild {
  id: string;
  user_id: string;
  name: string;
  nickname?: string;
  birth_date: string;
  gender: 'male' | 'female';
  avatar_url?: string;
  current_stage?: string;
  created_at: string;
}
```

### 3.3 Redis 缓存结构

#### 3.3.1 会话缓存

```
Key: session:{session_id}
Type: Hash
Fields:
  - user_id: 用户ID
  - email: 用户邮箱
  - role: 用户角色
  - created_at: 创建时间
  - expires_at: 过期时间
TTL: 3600秒 (1小时)
```

#### 3.3.2 用户数据缓存

```
Key: user:{user_id}
Type: Hash
Fields:
  - profile: 用户基本信息JSON
  - settings: 用户设置JSON
  - last_access: 最后访问时间
TTL: 1800秒 (30分钟)
```

#### 3.3.3 查询结果缓存

```
Key: query:{hash}
Type: String
Value: 查询结果JSON
TTL: 300秒 (5分钟)
```

## 四、数据访问层设计

### 4.1 数据库管理器 (DatabaseManager)

#### 4.1.1 核心功能

```typescript
class DatabaseManager {
  // 数据库连接管理
  getDatabase(): SQLiteDatabase | typeof localStorageDB
  
  // 数据迁移
  migrateFromLocalStorage(): Promise<MigrationResult>
  
  // 数据备份
  backupDatabase(): Promise<BackupResult>
  
  // 数据恢复
  restoreDatabase(backupPath: string): Promise<RestoreResult>
  
  // 数据优化
  optimizeDatabase(): Promise<OptimizationResult>
}
```

#### 4.1.2 连接池配置

```typescript
const postgresConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'yyc3_ai_xiaoyu',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  max: 20,                          // 最大连接数
  idleTimeoutMillis: 30000,         // 空闲超时
  connectionTimeoutMillis: 2000,    // 连接超时
};
```

### 4.2 Redis 客户端配置

```typescript
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
  database: parseInt(process.env.REDIS_DB || '0'),
};

const redisClient = createClient(redisConfig);
```

### 4.3 数据访问模式

#### 4.3.1 读写分离

- 主库: 处理所有写操作
- 从库: 处理读操作（可配置多个从库）

#### 4.3.2 缓存策略

- Cache-Aside: 应用层管理缓存
- Write-Through: 写入时同步更新缓存
- Write-Behind: 异步更新缓存

#### 4.3.3 事务管理

- PostgreSQL: 使用数据库事务
- SQLite: 支持事务操作
- Redis: 使用MULTI/EXEC命令

## 五、核心模块设计

### 5.1 数据库连接管理器 (DatabaseManager)

**模块职责**：统一管理PostgreSQL、Redis、SQLite三种数据库的连接、初始化、迁移和备份操作

**模块功能**：

- 数据库连接池管理
- 数据库初始化和配置
- 数据迁移（localStorage到SQLite、SQLite到PostgreSQL）
- 数据备份和恢复
- 数据库优化和监控

**技术实现**：

- 使用连接池管理PostgreSQL连接
- 使用Redis客户端管理Redis连接
- 使用SQLite3库管理SQLite连接
- 实现自动重连和故障转移
- 支持读写分离和负载均衡

**接口定义**：

```typescript
/**
 * 数据库管理器接口
 * @description 统一管理多种数据库的连接和操作
 */
interface DatabaseManager {
  /**
   * 初始化数据库连接
   * @param config - 数据库配置
   * @returns 初始化结果
   */
  initialize(config: DatabaseConfig): Promise<InitializationResult>

  /**
   * 获取数据库实例
   * @param type - 数据库类型
   * @returns 数据库实例
   */
  getDatabase(type: DatabaseType): DatabaseInstance

  /**
   * 从localStorage迁移数据到SQLite
   * @returns 迁移结果
   */
  migrateFromLocalStorage(): Promise<MigrationResult>

  /**
   * 从SQLite迁移数据到PostgreSQL
   * @returns 迁移结果
   */
  migrateFromSQLite(): Promise<MigrationResult>

  /**
   * 备份数据库
   * @param type - 数据库类型
   * @param options - 备份选项
   * @returns 备份结果
   */
  backupDatabase(type: DatabaseType, options?: BackupOptions): Promise<BackupResult>

  /**
   * 恢复数据库
   * @param type - 数据库类型
   * @param backupPath - 备份文件路径
   * @returns 恢复结果
   */
  restoreDatabase(type: DatabaseType, backupPath: string): Promise<RestoreResult>

  /**
   * 优化数据库
   * @param type - 数据库类型
   * @returns 优化结果
   */
  optimizeDatabase(type: DatabaseType): Promise<OptimizationResult>

  /**
   * 关闭所有数据库连接
   * @returns 关闭结果
   */
  closeAll(): Promise<void>
}
```

### 5.2 ORM数据访问层 (ORMDataAccessLayer)

**模块职责**：提供统一的数据访问接口，封装ORM操作，支持多种数据库

**模块功能**：

- 统一的数据访问接口
- ORM实体映射
- 查询构建器
- 事务管理
- 缓存集成

**技术实现**：

- 使用Prisma/TypeORM作为ORM框架
- 实现Repository模式
- 支持查询缓存
- 实现批量操作优化
- 支持软删除和审计字段

**接口定义**：

```typescript
/**
 * ORM数据访问层接口
 * @description 统一的数据访问接口，封装ORM操作
 */
interface ORMDataAccessLayer<T> {
  /**
   * 创建记录
   * @param data - 数据对象
   * @returns 创建的记录
   */
  create(data: Partial<T>): Promise<T>

  /**
   * 批量创建记录
   * @param dataList - 数据对象数组
   * @returns 创建的记录数组
   */
  createMany(dataList: Partial<T>[]): Promise<T[]>

  /**
   * 根据ID查询记录
   * @param id - 记录ID
   * @returns 记录对象
   */
  findById(id: string): Promise<T | null>

  /**
   * 根据条件查询记录
   * @param where - 查询条件
   * @returns 记录数组
   */
  findMany(where?: WhereClause<T>): Promise<T[]>

  /**
   * 查询单条记录
   * @param where - 查询条件
   * @returns 记录对象
   */
  findOne(where: WhereClause<T>): Promise<T | null>

  /**
   * 更新记录
   * @param id - 记录ID
   * @param data - 更新数据
   * @returns 更新后的记录
   */
  update(id: string, data: Partial<T>): Promise<T>

  /**
   * 删除记录
   * @param id - 记录ID
   * @returns 删除结果
   */
  delete(id: string): Promise<boolean>

  /**
   * 批量删除记录
   * @param where - 删除条件
   * @returns 删除的记录数
   */
  deleteMany(where: WhereClause<T>): Promise<number>

  /**
   * 分页查询
   * @param options - 分页选项
   * @returns 分页结果
   */
  paginate(options: PaginationOptions<T>): Promise<PaginatedResult<T>>
}
```

### 5.3 缓存管理器 (CacheManager)

**模块职责**：统一管理Redis缓存，提供缓存操作接口

**模块功能**：

- 缓存读写操作
- 缓存失效策略
- 缓存预热
- 缓存统计和监控
- 分布式缓存支持

**技术实现**：

- 使用Redis作为缓存存储
- 实现多级缓存策略
- 支持缓存穿透、击穿、雪崩防护
- 实现缓存一致性保证
- 支持缓存预热和刷新

**接口定义**：

```typescript
/**
 * 缓存管理器接口
 * @description 统一管理Redis缓存操作
 */
interface CacheManager {
  /**
   * 设置缓存
   * @param key - 缓存键
   * @param value - 缓存值
   * @param ttl - 过期时间（秒）
   * @returns 设置结果
   */
  set(key: string, value: any, ttl?: number): Promise<boolean>

  /**
   * 获取缓存
   * @param key - 缓存键
   * @returns 缓存值
   */
  get(key: string): Promise<any | null>

  /**
   * 批量获取缓存
   * @param keys - 缓存键数组
   * @returns 缓存值对象
   */
  getMany(keys: string[]): Promise<Record<string, any>>

  /**
   * 删除缓存
   * @param key - 缓存键
   * @returns 删除结果
   */
  delete(key: string): Promise<boolean>

  /**
   * 批量删除缓存
   * @param keys - 缓存键数组
   * @returns 删除的键数量
   */
  deleteMany(keys: string[]): Promise<number>

  /**
   * 清空所有缓存
   * @returns 清空结果
   */
  flushAll(): Promise<boolean>

  /**
   * 检查缓存是否存在
   * @param key - 缓存键
   * @returns 是否存在
   */
  exists(key: string): Promise<boolean>

  /**
   * 设置缓存过期时间
   * @param key - 缓存键
   * @param ttl - 过期时间（秒）
   * @returns 设置结果
   */
  expire(key: string, ttl: number): Promise<boolean>

  /**
   * 获取缓存统计信息
   * @returns 统计信息
   */
  getStats(): Promise<CacheStats>
}
```

### 5.4 数据迁移管理器 (DataMigrationManager)

**模块职责**：管理数据迁移任务，确保数据迁移的安全性和可靠性

**模块功能**：

- 迁移任务管理
- 迁移进度跟踪
- 迁移回滚
- 迁移验证
- 迁移日志记录

**技术实现**：

- 实现迁移任务队列
- 支持增量迁移
- 实现迁移断点续传
- 支持迁移数据校验
- 实现迁移失败重试

**接口定义**：

```typescript
/**
 * 数据迁移管理器接口
 * @description 管理数据迁移任务
 */
interface DataMigrationManager {
  /**
   * 创建迁移任务
   * @param config - 迁移配置
   * @returns 迁移任务
   */
  createMigration(config: MigrationConfig): Promise<MigrationTask>

  /**
   * 执行迁移任务
   * @param taskId - 任务ID
   * @returns 迁移结果
   */
  executeMigration(taskId: string): Promise<MigrationResult>

  /**
   * 回滚迁移任务
   * @param taskId - 任务ID
   * @returns 回滚结果
   */
  rollbackMigration(taskId: string): Promise<RollbackResult>

  /**
   * 获取迁移进度
   * @param taskId - 任务ID
   * @returns 迁移进度
   */
  getProgress(taskId: string): Promise<MigrationProgress>

  /**
   * 验证迁移结果
   * @param taskId - 任务ID
   * @returns 验证结果
   */
  validateMigration(taskId: string): Promise<ValidationResult>

  /**
   * 获取迁移日志
   * @param taskId - 任务ID
   * @returns 迁移日志
   */
  getLogs(taskId: string): Promise<MigrationLog[]>
}
```

### 5.5 数据同步管理器 (DataSyncManager)

**模块职责**：管理本地数据与云端数据的同步

**模块功能**：

- 数据同步策略管理
- 冲突检测和解决
- 同步状态跟踪
- 增量同步
- 离线数据合并

**技术实现**：

- 实现双向同步机制
- 使用时间戳或版本号检测冲突
- 实现冲突解决策略（最后写入优先、手动解决）
- 支持增量同步
- 实现离线队列

**接口定义**：

```typescript
/**
 * 数据同步管理器接口
 * @description 管理本地数据与云端数据的同步
 */
interface DataSyncManager {
  /**
   * 执行全量同步
   * @param options - 同步选项
   * @returns 同步结果
   */
  syncAll(options?: SyncOptions): Promise<SyncResult>

  /**
   * 执行增量同步
   * @param lastSyncTime - 上次同步时间
   * @returns 同步结果
   */
  syncIncremental(lastSyncTime: Date): Promise<SyncResult>

  /**
   * 同步指定实体
   * @param entityType - 实体类型
   * @param entityId - 实体ID
   * @returns 同步结果
   */
  syncEntity(entityType: string, entityId: string): Promise<SyncResult>

  /**
   * 获取同步状态
   * @returns 同步状态
   */
  getSyncStatus(): Promise<SyncStatus>

  /**
   * 解决同步冲突
   * @param conflict - 冲突信息
   * @param resolution - 解决方案
   * @returns 解决结果
   */
  resolveConflict(conflict: SyncConflict, resolution: ConflictResolution): Promise<ResolveResult>

  /**
   * 添加离线操作
   * @param operation - 离线操作
   * @returns 添加结果
   */
  addOfflineOperation(operation: OfflineOperation): Promise<boolean>

  /**
   * 处理离线操作队列
   * @returns 处理结果
   */
  processOfflineQueue(): Promise<ProcessResult>
}
```

**类型定义**：

```typescript
/**
 * 同步选项
 */
interface SyncOptions {
  /** 是否强制同步 */
  force?: boolean
  /** 同步超时时间（毫秒） */
  timeout?: number
  /** 同步的实体类型 */
  entityTypes?: string[]
  /** 批量大小 */
  batchSize?: number
  /** 是否跳过冲突 */
  skipConflicts?: boolean
}

/**
 * 同步结果
 */
interface SyncResult {
  /** 是否成功 */
  success: boolean
  /** 同步的实体数量 */
  syncedCount: number
  /** 失败的实体数量 */
  failedCount: number
  /** 冲突数量 */
  conflictCount: number
  /** 同步耗时（毫秒） */
  duration: number
  /** 同步的实体列表 */
  syncedEntities?: SyncedEntity[]
  /** 错误信息 */
  error?: string
  /** 错误列表 */
  errors?: SyncError[]
}

/**
 * 同步的实体
 */
interface SyncedEntity {
  /** 实体类型 */
  entityType: string
  /** 实体ID */
  entityId: string
  /** 操作类型 */
  operation: 'create' | 'update' | 'delete'
  /** 同步时间 */
  syncedAt: Date
}

/**
 * 同步错误
 */
interface SyncError {
  /** 实体类型 */
  entityType: string
  /** 实体ID */
  entityId: string
  /** 错误信息 */
  error: string
  /** 错误堆栈 */
  stack?: string
}

/**
 * 同步状态
 */
interface SyncStatus {
  /** 当前状态 */
  status: 'idle' | 'syncing' | 'paused' | 'error'
  /** 最后同步时间 */
  lastSyncTime?: Date
  /** 下次同步时间 */
  nextSyncTime?: Date
  /** 待同步数量 */
  pendingCount: number
  /** 同步进度 */
  progress: number
  /** 当前同步的实体 */
  currentEntity?: {
    entityType: string
    entityId: string
  }
}

/**
 * 同步冲突
 */
interface SyncConflict {
  /** 冲突ID */
  conflictId: string
  /** 实体类型 */
  entityType: string
  /** 实体ID */
  entityId: string
  /** 本地版本 */
  localVersion: {
    data: any
    version: number
    updatedAt: Date
  }
  /** 云端版本 */
  remoteVersion: {
    data: any
    version: number
    updatedAt: Date
  }
  /** 冲突类型 */
  conflictType: 'version' | 'data' | 'delete'
  /** 冲突时间 */
  conflictTime: Date
}

/**
 * 冲突解决方案
 */
type ConflictResolution = 
  | 'local'      // 使用本地版本
  | 'remote'     // 使用云端版本
  | 'merge'      // 合并版本
  | 'manual'     // 手动解决
  | {           // 自定义合并策略
      type: 'custom'
      mergeFn: (local: any, remote: any) => any
    }

/**
 * 解决结果
 */
interface ResolveResult {
  /** 是否成功 */
  success: boolean
  /** 解决的冲突ID */
  conflictId: string
  /** 采用的版本 */
  resolvedVersion: 'local' | 'remote' | 'merged'
  /** 合并后的数据 */
  mergedData?: any
  /** 错误信息 */
  error?: string
}

/**
 * 离线操作
 */
interface OfflineOperation {
  /** 操作ID */
  operationId: string
  /** 操作类型 */
  operationType: 'create' | 'update' | 'delete'
  /** 实体类型 */
  entityType: string
  /** 实体ID */
  entityId: string
  /** 操作数据 */
  data?: any
  /** 操作时间 */
  operationTime: Date
  /** 操作状态 */
  status: 'pending' | 'processing' | 'completed' | 'failed'
  /** 重试次数 */
  retryCount: number
  /** 错误信息 */
  error?: string
}

/**
 * 处理结果
 */
interface ProcessResult {
  /** 处理的操作数量 */
  processedCount: number
  /** 成功的操作数量 */
  successCount: number
  /** 失败的操作数量 */
  failedCount: number
  /** 处理耗时（毫秒） */
  duration: number
  /** 失败的操作列表 */
  failedOperations?: OfflineOperation[]
}
```

**实现类**：

```typescript
/**
 * 数据同步管理器实现
 * @description 管理本地数据与云端数据的双向同步
 */
class DataSyncManagerImpl implements DataSyncManager {
  private localDB: SQLiteDatabase
  private remoteDB: PostgreSQLDatabase
  private syncState: SyncState
  private config: SyncConfig
  private offlineQueue: OfflineQueue
  private conflictResolver: ConflictResolver
  private syncLogger: SyncLogger
  private eventEmitter: EventEmitter

  constructor(
    localDB: SQLiteDatabase,
    remoteDB: PostgreSQLDatabase,
    config: SyncConfig
  ) {
    this.localDB = localDB
    this.remoteDB = remoteDB
    this.config = config
    this.syncState = {
      status: 'idle',
      pendingCount: 0,
      progress: 0
    }
    this.offlineQueue = new OfflineQueue(localDB)
    this.conflictResolver = new ConflictResolver(config.conflictStrategy)
    this.syncLogger = new SyncLogger(localDB)
    this.eventEmitter = new EventEmitter()
  }

  /**
   * 执行全量同步
   * @param options - 同步选项
   * @returns 同步结果
   */
  async syncAll(options: SyncOptions = {}): Promise<SyncResult> {
    const startTime = Date.now()
    const result: SyncResult = {
      success: false,
      syncedCount: 0,
      failedCount: 0,
      conflictCount: 0,
      duration: 0,
      syncedEntities: [],
      errors: []
    }

    try {
      this.syncState.status = 'syncing'
      this.eventEmitter.emit('sync:start')

      const {
        force = false,
        timeout = 300000,
        entityTypes = this.config.syncEntityTypes,
        batchSize = this.config.batchSize || 100,
        skipConflicts = false
      } = options

      for (const entityType of entityTypes) {
        const entityResult = await this.syncEntityType(
          entityType,
          { force, timeout, batchSize, skipConflicts }
        )

        result.syncedCount += entityResult.syncedCount
        result.failedCount += entityResult.failedCount
        result.conflictCount += entityResult.conflictCount
        result.syncedEntities?.push(...(entityResult.syncedEntities || []))
        result.errors?.push(...(entityResult.errors || []))
      }

      result.success = result.failedCount === 0
      result.duration = Date.now() - startTime

      this.syncState.status = 'idle'
      this.syncState.lastSyncTime = new Date()
      this.syncState.nextSyncTime = new Date(Date.now() + this.config.syncInterval)
      this.eventEmitter.emit('sync:complete', result)

      return result
    } catch (error) {
      result.success = false
      result.error = error.message
      result.duration = Date.now() - startTime

      this.syncState.status = 'error'
      this.eventEmitter.emit('sync:error', error)

      return result
    }
  }

  /**
   * 执行增量同步
   * @param lastSyncTime - 上次同步时间
   * @returns 同步结果
   */
  async syncIncremental(lastSyncTime: Date): Promise<SyncResult> {
    const startTime = Date.now()
    const result: SyncResult = {
      success: false,
      syncedCount: 0,
      failedCount: 0,
      conflictCount: 0,
      duration: 0,
      syncedEntities: [],
      errors: []
    }

    try {
      this.syncState.status = 'syncing'

      for (const entityType of this.config.syncEntityTypes) {
        const localChanges = await this.getLocalChanges(entityType, lastSyncTime)
        const remoteChanges = await this.getRemoteChanges(entityType, lastSyncTime)

        for (const change of localChanges) {
          const syncResult = await this.syncChange(change, 'local')
          if (syncResult.success) {
            result.syncedCount++
            result.syncedEntities?.push({
              entityType,
              entityId: change.entityId,
              operation: change.operation,
              syncedAt: new Date()
            })
          } else {
            result.failedCount++
            result.errors?.push({
              entityType,
              entityId: change.entityId,
              error: syncResult.error || 'Unknown error'
            })
          }
        }

        for (const change of remoteChanges) {
          const syncResult = await this.syncChange(change, 'remote')
          if (syncResult.success) {
            result.syncedCount++
            result.syncedEntities?.push({
              entityType,
              entityId: change.entityId,
              operation: change.operation,
              syncedAt: new Date()
            })
          } else {
            result.failedCount++
            result.errors?.push({
              entityType,
              entityId: change.entityId,
              error: syncResult.error || 'Unknown error'
            })
          }
        }
      }

      result.success = result.failedCount === 0
      result.duration = Date.now() - startTime

      this.syncState.status = 'idle'
      this.syncState.lastSyncTime = new Date()

      return result
    } catch (error) {
      result.success = false
      result.error = error.message
      result.duration = Date.now() - startTime

      this.syncState.status = 'error'

      return result
    }
  }

  /**
   * 同步指定实体
   * @param entityType - 实体类型
   * @param entityId - 实体ID
   * @returns 同步结果
   */
  async syncEntity(entityType: string, entityId: string): Promise<SyncResult> {
    const startTime = Date.now()
    const result: SyncResult = {
      success: false,
      syncedCount: 0,
      failedCount: 0,
      conflictCount: 0,
      duration: 0
    }

    try {
      const localEntity = await this.localDB.findOne(entityType, { id: entityId })
      const remoteEntity = await this.remoteDB.findOne(entityType, { id: entityId })

      if (!localEntity && !remoteEntity) {
        return {
          ...result,
          success: true,
          duration: Date.now() - startTime
        }
      }

      if (!localEntity && remoteEntity) {
        await this.localDB.create(entityType, remoteEntity)
        return {
          ...result,
          success: true,
          syncedCount: 1,
          duration: Date.now() - startTime
        }
      }

      if (localEntity && !remoteEntity) {
        await this.remoteDB.create(entityType, localEntity)
        return {
          ...result,
          success: true,
          syncedCount: 1,
          duration: Date.now() - startTime
        }
      }

      const conflict = this.detectConflict(localEntity, remoteEntity)
      if (conflict) {
        result.conflictCount++
        const resolution = await this.conflictResolver.resolve(conflict)
        if (resolution.success) {
          await this.applyResolution(entityType, entityId, resolution)
          return {
            ...result,
            success: true,
            syncedCount: 1,
            duration: Date.now() - startTime
          }
        } else {
          return {
            ...result,
            success: false,
            error: resolution.error,
            duration: Date.now() - startTime
          }
        }
      }

      if (localEntity.updated_at > remoteEntity.updated_at) {
        await this.remoteDB.update(entityType, entityId, localEntity)
      } else {
        await this.localDB.update(entityType, entityId, remoteEntity)
      }

      return {
        ...result,
        success: true,
        syncedCount: 1,
        duration: Date.now() - startTime
      }
    } catch (error) {
      return {
        ...result,
        success: false,
        error: error.message,
        duration: Date.now() - startTime
      }
    }
  }

  /**
   * 获取同步状态
   * @returns 同步状态
   */
  async getSyncStatus(): Promise<SyncStatus> {
    const pendingCount = await this.offlineQueue.getPendingCount()
    
    return {
      ...this.syncState,
      pendingCount,
      progress: this.calculateProgress()
    }
  }

  /**
   * 解决同步冲突
   * @param conflict - 冲突信息
   * @param resolution - 解决方案
   * @returns 解决结果
   */
  async resolveConflict(
    conflict: SyncConflict,
    resolution: ConflictResolution
  ): Promise<ResolveResult> {
    try {
      const result = await this.conflictResolver.resolve(conflict, resolution)
      
      if (result.success) {
        await this.applyResolution(conflict.entityType, conflict.entityId, result)
        await this.syncLogger.logResolution(conflict.conflictId, resolution)
      }

      return result
    } catch (error) {
      return {
        success: false,
        conflictId: conflict.conflictId,
        error: error.message
      }
    }
  }

  /**
   * 添加离线操作
   * @param operation - 离线操作
   * @returns 添加结果
   */
  async addOfflineOperation(operation: OfflineOperation): Promise<boolean> {
    try {
      await this.offlineQueue.add(operation)
      this.syncState.pendingCount++
      this.eventEmitter.emit('offline:added', operation)
      return true
    } catch (error) {
      console.error('Failed to add offline operation:', error)
      return false
    }
  }

  /**
   * 处理离线操作队列
   * @returns 处理结果
   */
  async processOfflineQueue(): Promise<ProcessResult> {
    const startTime = Date.now()
    const result: ProcessResult = {
      processedCount: 0,
      successCount: 0,
      failedCount: 0,
      duration: 0,
      failedOperations: []
    }

    try {
      const operations = await this.offlineQueue.getAll()
      this.syncState.status = 'syncing'

      for (const operation of operations) {
        if (operation.status !== 'pending') continue

        try {
          operation.status = 'processing'
          await this.offlineQueue.update(operation)

          const syncResult = await this.syncChange(operation, 'local')

          if (syncResult.success) {
            operation.status = 'completed'
            result.successCount++
          } else {
            operation.status = 'failed'
            operation.retryCount++
            operation.error = syncResult.error
            result.failedCount++
            result.failedOperations?.push(operation)
          }

          await this.offlineQueue.update(operation)
          result.processedCount++
        } catch (error) {
          operation.status = 'failed'
          operation.retryCount++
          operation.error = error.message
          await this.offlineQueue.update(operation)
          
          result.processedCount++
          result.failedCount++
          result.failedOperations?.push(operation)
        }
      }

      result.duration = Date.now() - startTime
      this.syncState.status = 'idle'
      this.syncState.pendingCount = await this.offlineQueue.getPendingCount()

      return result
    } catch (error) {
      result.duration = Date.now() - startTime
      this.syncState.status = 'error'
      return result
    }
  }

  /**
   * 同步指定实体类型
   */
  private async syncEntityType(
    entityType: string,
    options: {
      force: boolean
      timeout: number
      batchSize: number
      skipConflicts: boolean
    }
  ): Promise<SyncResult> {
    const result: SyncResult = {
      success: false,
      syncedCount: 0,
      failedCount: 0,
      conflictCount: 0,
      duration: 0,
      syncedEntities: [],
      errors: []
    }

    const startTime = Date.now()
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Sync timeout')), options.timeout)
    )

    try {
      const syncPromise = this.doSyncEntityType(entityType, options)
      await Promise.race([syncPromise, timeoutPromise])
      result.success = true
    } catch (error) {
      result.error = error.message
    }

    result.duration = Date.now() - startTime
    return result
  }

  /**
   * 执行实体类型同步
   */
  private async doSyncEntityType(
    entityType: string,
    options: {
      force: boolean
      batchSize: number
      skipConflicts: boolean
    }
  ): Promise<void> {
    const localIds = await this.localDB.getAllIds(entityType)
    const remoteIds = await this.remoteDB.getAllIds(entityType)

    const allIds = new Set([...localIds, ...remoteIds])

    for (const entityId of allIds) {
      const localEntity = await this.localDB.findOne(entityType, { id: entityId })
      const remoteEntity = await this.remoteDB.findOne(entityType, { id: entityId })

      if (!localEntity && remoteEntity) {
        await this.localDB.create(entityType, remoteEntity)
        continue
      }

      if (localEntity && !remoteEntity) {
        await this.remoteDB.create(entityType, localEntity)
        continue
      }

      if (localEntity && remoteEntity) {
        const conflict = this.detectConflict(localEntity, remoteEntity)
        if (conflict) {
          if (options.skipConflicts) {
            continue
          }
          const resolution = await this.conflictResolver.resolve(conflict)
          await this.applyResolution(entityType, entityId, resolution)
          continue
        }

        if (localEntity.updated_at > remoteEntity.updated_at) {
          await this.remoteDB.update(entityType, entityId, localEntity)
        } else {
          await this.localDB.update(entityType, entityId, remoteEntity)
        }
      }
    }
  }

  /**
   * 检测冲突
   */
  private detectConflict(local: any, remote: any): SyncConflict | null {
    if (local.version !== remote.version) {
      return {
        conflictId: `${local.id}_${local.version}_${remote.version}`,
        entityType: local.__entityType__,
        entityId: local.id,
        localVersion: {
          data: local,
          version: local.version,
          updatedAt: local.updated_at
        },
        remoteVersion: {
          data: remote,
          version: remote.version,
          updatedAt: remote.updated_at
        },
        conflictType: 'version',
        conflictTime: new Date()
      }
    }

    return null
  }

  /**
   * 应用冲突解决方案
   */
  private async applyResolution(
    entityType: string,
    entityId: string,
    resolution: ResolveResult
  ): Promise<void> {
    if (resolution.resolvedVersion === 'local') {
      const local = await this.localDB.findOne(entityType, { id: entityId })
      await this.remoteDB.update(entityType, entityId, local)
    } else if (resolution.resolvedVersion === 'remote') {
      const remote = await this.remoteDB.findOne(entityType, { id: entityId })
      await this.localDB.update(entityType, entityId, remote)
    } else if (resolution.resolvedVersion === 'merged' && resolution.mergedData) {
      await this.localDB.update(entityType, entityId, resolution.mergedData)
      await this.remoteDB.update(entityType, entityId, resolution.mergedData)
    }
  }

  /**
   * 获取本地变更
   */
  private async getLocalChanges(
    entityType: string,
    since: Date
  ): Promise<OfflineOperation[]> {
    return await this.localDB.find(entityType, {
      updated_at: { $gt: since }
    })
  }

  /**
   * 获取远程变更
   */
  private async getRemoteChanges(
    entityType: string,
    since: Date
  ): Promise<OfflineOperation[]> {
    return await this.remoteDB.find(entityType, {
      updated_at: { $gt: since }
    })
  }

  /**
   * 同步变更
   */
  private async syncChange(
    change: OfflineOperation,
    source: 'local' | 'remote'
  ): Promise<SyncResult> {
    const targetDB = source === 'local' ? this.remoteDB : this.localDB

    try {
      if (change.operationType === 'create') {
        await targetDB.create(change.entityType, change.data)
      } else if (change.operationType === 'update') {
        await targetDB.update(change.entityType, change.entityId, change.data)
      } else if (change.operationType === 'delete') {
        await targetDB.delete(change.entityType, change.entityId)
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  /**
   * 计算同步进度
   */
  private calculateProgress(): number {
    const total = this.syncState.pendingCount
    const synced = this.syncState.syncedCount || 0
    return total > 0 ? (synced / total) * 100 : 0
  }
}

/**
 * 冲突解决器
 */
class ConflictResolver {
  private defaultStrategy: ConflictResolution

  constructor(defaultStrategy: ConflictResolution = 'remote') {
    this.defaultStrategy = defaultStrategy
  }

  async resolve(
    conflict: SyncConflict,
    strategy?: ConflictResolution
  ): Promise<ResolveResult> {
    const resolution = strategy || this.defaultStrategy

    try {
      if (resolution === 'local') {
        return {
          success: true,
          conflictId: conflict.conflictId,
          resolvedVersion: 'local'
        }
      }

      if (resolution === 'remote') {
        return {
          success: true,
          conflictId: conflict.conflictId,
          resolvedVersion: 'remote'
        }
      }

      if (resolution === 'merge') {
        const merged = this.mergeData(
          conflict.localVersion.data,
          conflict.remoteVersion.data
        )
        return {
          success: true,
          conflictId: conflict.conflictId,
          resolvedVersion: 'merged',
          mergedData: merged
        }
      }

      if (typeof resolution === 'object' && resolution.type === 'custom') {
        const merged = resolution.mergeFn(
          conflict.localVersion.data,
          conflict.remoteVersion.data
        )
        return {
          success: true,
          conflictId: conflict.conflictId,
          resolvedVersion: 'merged',
          mergedData: merged
        }
      }

      return {
        success: false,
        conflictId: conflict.conflictId,
        error: 'Unsupported resolution strategy'
      }
    } catch (error) {
      return {
        success: false,
        conflictId: conflict.conflictId,
        error: error.message
      }
    }
  }

  private mergeData(local: any, remote: any): any {
    const merged = { ...local }
    
    for (const key in remote) {
      if (remote[key] !== undefined) {
        merged[key] = remote[key]
      }
    }

    merged.version = Math.max(local.version, remote.version) + 1
    merged.updated_at = new Date()

    return merged
  }
}

/**
 * 离线队列管理器
 */
class OfflineQueue {
  private db: SQLiteDatabase

  constructor(db: SQLiteDatabase) {
    this.db = db
  }

  async add(operation: OfflineOperation): Promise<void> {
    await this.db.create('offline_operations', {
      ...operation,
      status: 'pending',
      retryCount: 0
    })
  }

  async getAll(): Promise<OfflineOperation[]> {
    return await this.db.find('offline_operations', {
      status: { $in: ['pending', 'processing'] }
    })
  }

  async update(operation: OfflineOperation): Promise<void> {
    await this.db.update('offline_operations', operation.operationId, operation)
  }

  async getPendingCount(): Promise<number> {
    const operations = await this.db.find('offline_operations', {
      status: 'pending'
    })
    return operations.length
  }
}

/**
 * 同步日志记录器
 */
class SyncLogger {
  private db: SQLiteDatabase

  constructor(db: SQLiteDatabase) {
    this.db = db
  }

  async logResolution(
    conflictId: string,
    resolution: ConflictResolution
  ): Promise<void> {
    await this.db.create('sync_logs', {
      conflictId,
      resolution: JSON.stringify(resolution),
      timestamp: new Date()
    })
  }
}

/**
 * 同步状态
 */
interface SyncState {
  status: 'idle' | 'syncing' | 'paused' | 'error'
  lastSyncTime?: Date
  nextSyncTime?: Date
  pendingCount: number
  syncedCount?: number
  progress: number
}

/**
 * 同步配置
 */
interface SyncConfig {
  syncInterval: number
  syncEntityTypes: string[]
  batchSize?: number
  conflictStrategy: ConflictResolution
  maxRetries: number
  retryDelay: number
}
```

**同步策略**：

1. **双向同步**：本地和云端数据双向同步，确保数据一致性
2. **增量同步**：仅同步变更的数据，减少网络传输
3. **冲突检测**：基于版本号和时间戳检测数据冲突
4. **冲突解决**：支持多种冲突解决策略（本地优先、云端优先、合并、手动）
5. **离线支持**：离线时缓存操作，上线后自动同步

**同步流程**：

```
┌─────────────┐
│  开始同步    │
└──────┬──────┘
       ↓
┌─────────────┐
│ 检查网络状态 │
└──────┬──────┘
       ↓
    离线？
   /      \
  是       否
  ↓        ↓
┌──────┐ ┌─────────────┐
│缓存操作│ │获取本地变更 │
└──────┘ └──────┬──────┘
              ↓
        ┌─────────────┐
        │获取远程变更 │
        └──────┬──────┘
               ↓
        ┌─────────────┐
        │检测数据冲突 │
        └──────┬──────┘
               ↓
          有冲突？
         /       \
        是        否
        ↓         ↓
   ┌─────────┐ ┌─────────┐
   │解决冲突 │ │执行同步 │
   └────┬────┘ └────┬────┘
        ↓          ↓
        └─────┬────┘
              ↓
        ┌─────────────┐
        │更新同步状态 │
        └──────┬──────┘
               ↓
        ┌─────────────┐
        │记录同步日志 │
        └──────┬──────┘
               ↓
        ┌─────────────┐
        │  同步完成    │
        └─────────────┘
```

**监控指标**：

- 同步成功率
- 同步延迟
- 冲突数量
- 离线队列长度
- 同步数据量
- 同步耗时

## 六、数据迁移策略

### 6.1 localStorage 到 SQLite 迁移

#### 6.1.1 迁移流程

```typescript
async migrateFromLocalStorage(): Promise<MigrationResult> {
  // 1. 检查SQLite数据库状态
  if (!this.sqliteDB) {
    return { success: false, migrated: [], error: "SQLite数据库未初始化" }
  }

  // 2. 检查localStorage可用性
  if (typeof window === "undefined") {
    return { success: false, migrated: [], error: "localStorage不可用" }
  }

  // 3. 迁移用户数据
  const users = JSON.parse(localStorage.getItem("yyc3_users") || "[]")
  for (const user of users) {
    await this.sqliteDB.create("users", {
      email: user.email,
      name: user.name,
      avatar_url: user.avatar_url,
      role: user.role || "parent",
      created_at: user.created_at || new Date().toISOString(),
    })
  }

  // 4. 迁移儿童档案数据
  const children = JSON.parse(localStorage.getItem("yyc3_children") || "[]")
  for (const child of children) {
    await this.sqliteDB.create("children", {
      user_id: child.user_id,
      name: child.name,
      nickname: child.nickname,
      birth_date: child.birth_date,
      gender: child.gender,
      avatar_url: child.avatar_url,
      current_stage: child.current_stage,
      created_at: child.created_at,
    })
  }

  // 5. 迁移其他数据...
  
  return { success: true, migrated }
}
```

#### 6.1.2 迁移验证

- 数据完整性检查
- 关联关系验证
- 数据格式转换验证

### 6.2 SQLite 到 PostgreSQL 迁移

#### 6.2.1 迁移架构设计

```typescript
/**
 * SQLite到PostgreSQL迁移管理器
 * @description 管理从SQLite到PostgreSQL的数据迁移，支持增量迁移和断点续传
 */
class SQLiteToPostgreSQLMigrator {
  private sqliteDB: SQLiteDatabase
  private postgresDB: PostgreSQLDatabase
  private migrationState: MigrationState
  private config: MigrationConfig

  /**
   * 初始化迁移管理器
   * @param sqliteConfig - SQLite数据库配置
   * @param postgresConfig - PostgreSQL数据库配置
   * @param config - 迁移配置
   */
  constructor(
    sqliteConfig: SQLiteConfig,
    postgresConfig: PostgreSQLConfig,
    config: MigrationConfig
  ) {
    this.sqliteDB = new SQLiteDatabase(sqliteConfig)
    this.postgresDB = new PostgreSQLDatabase(postgresConfig)
    this.config = config
    this.migrationState = {
      status: 'idle',
      progress: 0,
      migratedTables: [],
      errors: [],
      startTime: null,
      endTime: null
    }
  }

  /**
   * 执行完整迁移流程
   * @returns 迁移结果
   */
  async migrate(): Promise<MigrationResult> {
    try {
      this.migrationState.status = 'running'
      this.migrationState.startTime = new Date()

      await this.preMigrationCheck()
      await this.createSchema()
      await this.migrateData()
      await this.migrateIndexes()
      await this.migrateConstraints()
      await this.validateMigration()
      await this.postMigrationCleanup()

      this.migrationState.status = 'completed'
      this.migrationState.endTime = new Date()
      this.migrationState.progress = 100

      return {
        success: true,
        migratedTables: this.migrationState.migratedTables,
        duration: this.calculateDuration(),
        recordCount: await this.getMigratedRecordCount()
      }
    } catch (error) {
      this.migrationState.status = 'failed'
      this.migrationState.errors.push(error.message)
      this.migrationState.endTime = new Date()

      return {
        success: false,
        error: error.message,
        errors: this.migrationState.errors
      }
    }
  }

  /**
   * 迁移前检查
   */
  private async preMigrationCheck(): Promise<void> {
    const checks = [
      this.checkSQLiteConnection(),
      this.checkPostgreSQLConnection(),
      this.checkPostgreSQLSchema(),
      this.checkDiskSpace(),
      this.checkDataIntegrity()
    ]

    const results = await Promise.all(checks)
    const failedChecks = results.filter(r => !r.success)

    if (failedChecks.length > 0) {
      throw new Error(`迁移前检查失败: ${failedChecks.map(r => r.error).join(', ')}`)
    }
  }

  /**
   * 创建PostgreSQL表结构
   */
  private async createSchema(): Promise<void> {
    const tables = await this.getSQLiteTables()

    for (const table of tables) {
      const schema = await this.generatePostgreSQLSchema(table)
      await this.postgresDB.execute(schema)
      this.migrationState.migratedTables.push(table)
    }
  }

  /**
   * 迁移数据
   */
  private async migrateData(): Promise<void> {
    const tables = this.migrationState.migratedTables
    const totalTables = tables.length

    for (let i = 0; i < totalTables; i++) {
      const table = tables[i]
      await this.migrateTableData(table)
      this.migrationState.progress = Math.round(((i + 1) / totalTables) * 80)
    }
  }

  /**
   * 迁移单个表的数据
   * @param tableName - 表名
   */
  private async migrateTableData(tableName: string): Promise<void> {
    const batchSize = this.config.batchSize || 1000
    let offset = 0
    let hasMore = true

    while (hasMore) {
      const records = await this.sqliteDB.query(
        `SELECT * FROM ${tableName} LIMIT ${batchSize} OFFSET ${offset}`
      )

      if (records.length === 0) {
        hasMore = false
        continue
      }

      const transformedRecords = records.map(record => 
        this.transformData(tableName, record)
      )

      await this.postgresDB.insert(tableName, transformedRecords)
      offset += batchSize
    }
  }

  /**
   * 数据转换
   * @param tableName - 表名
   * @param record - 记录
   * @returns 转换后的记录
   */
  private transformData(tableName: string, record: any): any {
    const transformed = { ...record }

    switch (tableName) {
      case 'users':
        transformed.id = this.convertToUUID(record.id)
        transformed.created_at = this.convertToTimestamp(record.created_at)
        transformed.updated_at = this.convertToTimestamp(record.updated_at)
        break

      case 'children':
        transformed.id = this.convertToUUID(record.id)
        transformed.user_id = this.convertToUUID(record.user_id)
        transformed.birth_date = this.convertToDate(record.birth_date)
        break

      case 'growth_records':
        transformed.id = this.convertToUUID(record.id)
        transformed.child_id = this.convertToUUID(record.child_id)
        transformed.media_urls = this.convertToArray(record.media_urls)
        transformed.tags = this.convertToArray(record.tags)
        break
    }

    return transformed
  }

  /**
   * 迁移索引
   */
  private async migrateIndexes(): Promise<void> {
    const indexes = [
      { table: 'users', name: 'idx_users_email', columns: ['email'] },
      { table: 'users', name: 'idx_users_role', columns: ['role'] },
      { table: 'children', name: 'idx_children_user_id', columns: ['user_id'] },
      { table: 'growth_records', name: 'idx_growth_records_child_id', columns: ['child_id'] },
      { table: 'growth_records', name: 'idx_growth_records_category', columns: ['category'] }
    ]

    for (const index of indexes) {
      const sql = `CREATE INDEX IF NOT EXISTS ${index.name} ON ${index.table}(${index.columns.join(', ')})`
      await this.postgresDB.execute(sql)
    }
  }

  /**
   * 迁移约束
   */
  private async migrateConstraints(): Promise<void> {
    const constraints = [
      { table: 'children', type: 'FOREIGN KEY', columns: ['user_id'], references: 'users(id)' },
      { table: 'growth_records', type: 'FOREIGN KEY', columns: ['child_id'], references: 'children(id)' }
    ]

    for (const constraint of constraints) {
      const sql = `ALTER TABLE ${constraint.table} ADD CONSTRAINT fk_${constraint.table}_${constraint.columns[0]} 
                   FOREIGN KEY (${constraint.columns.join(', ')}) REFERENCES ${constraint.references}`
      await this.postgresDB.execute(sql)
    }
  }

  /**
   * 验证迁移结果
   */
  private async validateMigration(): Promise<void> {
    const tables = this.migrationState.migratedTables

    for (const table of tables) {
      const sqliteCount = await this.sqliteDB.query(`SELECT COUNT(*) as count FROM ${table}`)
      const postgresCount = await this.postgresDB.query(`SELECT COUNT(*) as count FROM ${table}`)

      if (sqliteCount[0].count !== postgresCount[0].count) {
        throw new Error(`表 ${table} 数据数量不匹配: SQLite=${sqliteCount[0].count}, PostgreSQL=${postgresCount[0].count}`)
      }
    }
  }

  /**
   * 迁移后清理
   */
  private async postMigrationCleanup(): Promise<void> {
    await this.postgresDB.execute('ANALYZE')
    await this.postgresDB.execute('VACUUM ANALYZE')
  }
}
```

#### 6.2.2 迁移配置

```typescript
interface MigrationConfig {
  batchSize?: number
  skipValidation?: boolean
  dryRun?: boolean
  preserveSQLite?: boolean
  onProgress?: (progress: MigrationProgress) => void
  onError?: (error: Error) => void
}

interface MigrationState {
  status: 'idle' | 'running' | 'completed' | 'failed'
  progress: number
  migratedTables: string[]
  errors: string[]
  startTime: Date | null
  endTime: Date | null
}

interface MigrationResult {
  success: boolean
  migratedTables?: string[]
  duration?: number
  recordCount?: number
  error?: string
  errors?: string[]
}
```

#### 6.2.3 迁移工具

##### 6.2.3.1 使用pgloader工具

```bash
# 安装pgloader
brew install pgloader

# 执行迁移
pgloader \
  sqlite:///path/to/database.db \
  postgresql://user:password@localhost:5432/yyc3_ai_xiaoyu

# 使用配置文件迁移
pgloader load.load
```

##### 6.2.3.2 pgloader配置文件

```lisp
LOAD DATABASE
    FROM sqlite:///path/to/database.db
    INTO postgresql://user:password@localhost:5432/yyc3_ai_xiaoyu

WITH include drop, create tables, create indexes, reset sequences

SET work_mem to '256MB',
    maintenance_work_mem to '512MB'

CAST type text to uuid drop typemod using uuid-osp-uuid-text-drop,
     type text to date drop typemod using date-sql-date-text-drop,
     type text to timestamp drop typemod using timestamp-sql-timestamp-text-drop

MIGRATE DATA
    WITH workers = 4,
         batch rows = 10000,
         prefetch rows = 100000

AFTER MIGRATE
    DO $$ BEGIN
        ANALYZE;
        VACUUM ANALYZE;
    END; $$;
```

#### 6.2.4 迁移步骤

##### 6.2.4.1 准备阶段

1. **备份SQLite数据库**：
```bash
cp database.db database_backup_$(date +%Y%m%d).db
```

2. **创建PostgreSQL数据库**：
```sql
CREATE DATABASE yyc3_ai_xiaoyu
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    TEMPLATE = template0;
```

3. **安装UUID扩展**：
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

##### 6.2.4.2 执行迁移

1. **导出SQLite数据为CSV格式**：
```bash
sqlite3 database.db <<EOF
.headers on
.mode csv
.output users.csv
SELECT * FROM users;
.output children.csv
SELECT * FROM children;
.output growth_records.csv
SELECT * FROM growth_records;
.quit
EOF
```

2. **数据清洗和格式转换**：
```python
import csv
import uuid
from datetime import datetime

def transform_users(input_file, output_file):
    with open(input_file, 'r') as infile, open(output_file, 'w', newline='') as outfile:
        reader = csv.DictReader(infile)
        writer = csv.DictWriter(outfile, fieldnames=reader.fieldnames)
        writer.writeheader()
        
        for row in reader:
            row['id'] = str(uuid.uuid4())
            if row['created_at']:
                row['created_at'] = datetime.fromisoformat(row['created_at']).isoformat()
            if row['updated_at']:
                row['updated_at'] = datetime.fromisoformat(row['updated_at']).isoformat()
            writer.writerow(row)

transform_users('users.csv', 'users_transformed.csv')
```

3. **使用COPY命令导入PostgreSQL**：
```sql
-- 创建临时表
CREATE TABLE users_temp (
    LIKE users INCLUDING ALL
);

-- 导入数据
COPY users_temp(id, email, password_hash, first_name, last_name, phone, avatar_url, role, is_active, email_verified, last_login_at, created_at, updated_at)
FROM '/path/to/users_transformed.csv'
DELIMITER ','
CSV HEADER;

-- 插入到正式表
INSERT INTO users SELECT * FROM users_temp;

-- 删除临时表
DROP TABLE users_temp;
```

4. **验证数据完整性**：
```sql
-- 检查记录数量
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'children', COUNT(*) FROM children
UNION ALL
SELECT 'growth_records', COUNT(*) FROM growth_records;

-- 检查外键约束
SELECT COUNT(*) as orphaned_children 
FROM children c 
LEFT JOIN users u ON c.user_id = u.id 
WHERE u.id IS NULL;
```

##### 6.2.4.3 验证阶段

1. **数据完整性检查**：
```sql
-- 检查必填字段
SELECT COUNT(*) as missing_required_fields
FROM users
WHERE email IS NULL 
   OR password_hash IS NULL 
   OR first_name IS NULL 
   OR last_name IS NULL;
```

2. **关联关系验证**：
```sql
-- 检查外键关系
SELECT COUNT(*) as invalid_references
FROM growth_records gr
LEFT JOIN children c ON gr.child_id = c.id
WHERE c.id IS NULL;
```

3. **数据格式验证**：
```sql
-- 检查邮箱格式
SELECT COUNT(*) as invalid_emails
FROM users
WHERE email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
```

##### 6.2.4.4 切换阶段

1. **更新应用配置**：
```typescript
const databaseConfig = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'yyc3_ai_xiaoyu',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
}
```

2. **执行灰度发布**：
- 先将10%的流量切换到PostgreSQL
- 监控错误率和性能指标
- 逐步增加流量到100%

3. **回滚准备**：
```bash
# 保留SQLite数据库作为备份
cp database.db database_rollback.db

# 准备回滚脚本
cat > rollback.sh <<EOF
#!/bin/bash
# 更新应用配置回SQLite
# 重启应用服务
EOF
```

#### 6.2.5 迁移监控

```typescript
class MigrationMonitor {
  private metrics: MigrationMetrics = {
    startTime: null,
    endTime: null,
    totalRecords: 0,
    migratedRecords: 0,
    failedRecords: 0,
    speed: 0,
    estimatedTimeRemaining: 0
  }

  /**
   * 更新迁移指标
   * @param tableName - 表名
   * @param migratedCount - 已迁移记录数
   */
  updateMetrics(tableName: string, migratedCount: number): void {
    this.metrics.migratedRecords += migratedCount
    
    if (this.metrics.startTime) {
      const elapsed = Date.now() - this.metrics.startTime.getTime()
      this.metrics.speed = this.metrics.migratedRecords / (elapsed / 1000)
      this.metrics.estimatedTimeRemaining = 
        (this.metrics.totalRecords - this.metrics.migratedRecords) / this.metrics.speed
    }
  }

  /**
   * 获取迁移进度
   * @returns 进度百分比
   */
  getProgress(): number {
    if (this.metrics.totalRecords === 0) return 0
    return Math.round((this.metrics.migratedRecords / this.metrics.totalRecords) * 100)
  }

  /**
   * 生成迁移报告
   * @returns 迁移报告
   */
  generateReport(): MigrationReport {
    return {
      status: this.metrics.endTime ? 'completed' : 'in_progress',
      startTime: this.metrics.startTime,
      endTime: this.metrics.endTime,
      duration: this.metrics.endTime 
        ? this.metrics.endTime.getTime() - this.metrics.startTime!.getTime() 
        : null,
      totalRecords: this.metrics.totalRecords,
      migratedRecords: this.metrics.migratedRecords,
      failedRecords: this.metrics.failedRecords,
      successRate: this.metrics.totalRecords > 0 
        ? (this.metrics.migratedRecords / this.metrics.totalRecords) * 100 
        : 0,
      speed: this.metrics.speed,
      estimatedTimeRemaining: this.metrics.estimatedTimeRemaining
    }
  }
}
```

## 七、数据备份与恢复

### 7.1 备份策略

#### 7.1.1 PostgreSQL 备份

```bash
# 全量备份
pg_dump -h localhost -U postgres -d yyc3_ai_xiaoyu -F c -f backup_$(date +%Y%m%d).dump

# 增量备份（使用WAL归档）
archive_mode = on
archive_command = 'cp %p /var/lib/postgresql/wal/%f'
```

#### 7.1.2 Redis 备份

```bash
# RDB快照
save 900 1     # 900秒内至少1个key变化
save 300 10    # 300秒内至少10个key变化
save 60 10000  # 60秒内至少10000个key变化

# AOF持久化
appendonly yes
appendfsync everysec
```

#### 7.1.3 SQLite 备份

```typescript
async backupDatabase(): Promise<BackupResult> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backupPath = `/backups/sqlite_backup_${timestamp}.db`
  
  try {
    const db = this.getDatabase() as SQLiteDatabase
    await db.backup(backupPath)
    
    return {
      success: true,
      backupPath,
      timestamp: new Date().toISOString(),
      size: fs.statSync(backupPath).size
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '备份失败'
    }
  }
}
```

### 7.2 恢复策略

#### 7.2.1 PostgreSQL 恢复

```bash
# 恢复全量备份
pg_restore -h localhost -U postgres -d yyc3_ai_xiaoyu -F c backup_20251225.dump

# 恢复到指定时间点
pg_restore --use-set-session-ownership --exit-on-error -d yyc3_ai_xiaoyu backup.dump
```

#### 7.2.2 Redis 恢复

```bash
# 从RDB文件恢复
cp dump.rdb /var/lib/redis/dump.rdb
redis-server

# 从AOF文件恢复
redis-server --appendonly yes --appendfilename appendonly.aof
```

#### 7.2.3 SQLite 恢复

```typescript
async restoreDatabase(backupPath: string): Promise<RestoreResult> {
  try {
    if (!fs.existsSync(backupPath)) {
      throw new Error('备份文件不存在')
    }

    // 关闭当前数据库连接
    if (this.sqliteDB) {
      await this.sqliteDB.close()
    }

    // 恢复备份文件
    fs.copyFileSync(backupPath, this.config.sqlitePath!)

    // 重新初始化数据库
    await this.initialize()

    return {
      success: true,
      restorePath: backupPath,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '恢复失败'
    }
  }
}
```

## 八、数据安全与权限

### 8.1 数据加密

#### 8.1.1 传输加密

- PostgreSQL: SSL/TLS加密
- Redis: TLS加密
- 应用层: HTTPS协议

#### 8.1.2 存储加密

- 敏感字段加密（密码、个人信息）
- 使用AES-256加密算法
- 密钥管理使用KMS服务

### 8.2 访问控制

#### 8.2.1 PostgreSQL 权限

```sql
-- 创建只读用户
CREATE USER readonly_user WITH PASSWORD 'readonly_password';
GRANT CONNECT ON DATABASE yyc3_ai_xiaoyu TO readonly_user;
GRANT USAGE ON SCHEMA public TO readonly_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_user;

-- 创建读写用户
CREATE USER readwrite_user WITH PASSWORD 'readwrite_password';
GRANT CONNECT ON DATABASE yyc3_ai_xiaoyu TO readwrite_user;
GRANT USAGE ON SCHEMA public TO readwrite_user;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO readwrite_user;
```

#### 8.2.2 Redis 权限

```conf
# redis.conf
requirepass your_redis_password
rename-command FLUSHDB ""
rename-command FLUSHALL ""
```

### 8.3 审计日志

#### 8.3.1 操作审计

- 记录所有数据访问操作
- 记录敏感数据修改
- 记录用户登录和权限变更

#### 8.3.2 审计表设计

```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(50) NOT NULL,
    table_name VARCHAR(100),
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

## 九、性能优化

### 9.1 索引优化

#### 9.1.1 索引策略

- 为外键创建索引
- 为常用查询条件创建索引
- 使用复合索引优化多条件查询
- 定期分析索引使用情况

#### 8.1.2 索引示例

```sql
-- 复合索引
CREATE INDEX idx_growth_records_child_category 
ON growth_records(child_id, category);

-- 部分索引
CREATE INDEX idx_active_users 
ON users(email) 
WHERE is_active = true;

-- 表达式索引
CREATE INDEX idx_users_lower_email 
ON users(LOWER(email));
```

### 8.2 查询优化

#### 8.2.1 查询优化技巧

- 使用EXPLAIN ANALYZE分析查询计划
- 避免SELECT *，只查询需要的字段
- 使用JOIN替代子查询
- 使用LIMIT限制返回结果数量
- 使用批量操作减少数据库往返

#### 8.2.2 慢查询优化

```sql
-- 启用慢查询日志
ALTER SYSTEM SET log_min_duration_statement = 1000; -- 1秒

-- 分析慢查询
SELECT 
    query,
    calls,
    total_time,
    mean_time,
    max_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

### 8.3 缓存优化

#### 8.3.1 缓存策略

- 热点数据缓存
- 查询结果缓存
- 会话数据缓存
- 使用Redis集群提高缓存容量

#### 8.3.2 缓存失效策略

- TTL过期自动失效
- 数据更新时主动失效
- 使用缓存版本号控制

## 九、监控与告警

### 9.1 监控指标

#### 9.1.1 PostgreSQL 监控

```sql
-- 连接数监控
SELECT count(*) FROM pg_stat_activity;

-- 慢查询监控
SELECT * FROM pg_stat_statements 
WHERE mean_time > 1000;

-- 表大小监控
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

#### 9.1.2 Redis 监控

```bash
# 内存使用
redis-cli INFO memory

# 连接数
redis-cli INFO clients

# 命令统计
redis-cli INFO commandstats
```

### 9.2 告警规则

#### 9.2.1 数据库告警

- 连接数超过阈值（>80%）
- 慢查询数量增加
- 磁盘空间不足（<20%）
- 复制延迟过高（>5秒）

#### 9.2.2 缓存告警

- 内存使用率过高（>90%）
- 缓存命中率过低（<80%）
- 连接数过多（>1000）

## 十、数据治理

### 10.1 数据生命周期管理

#### 10.1.1 数据保留策略

- 活跃数据: 永久保留
- 历史数据: 保留3年
- 日志数据: 保留1年
- 临时数据: 保留30天

#### 10.1.2 数据归档

```sql
-- 创建归档表
CREATE TABLE growth_records_archive (
    LIKE growth_records INCLUDING ALL
);

-- 归档数据
INSERT INTO growth_records_archive
SELECT * FROM growth_records
WHERE created_at < NOW() - INTERVAL '3 years';

-- 删除已归档数据
DELETE FROM growth_records
WHERE created_at < NOW() - INTERVAL '3 years';
```

### 10.2 数据质量

#### 10.2.1 数据验证

- 数据完整性检查
- 数据一致性检查
- 数据格式验证
- 重复数据检测

#### 10.2.2 数据清洗

```sql
-- 删除重复数据
DELETE FROM growth_records g1
USING growth_records g2
WHERE g1.id > g2.id
AND g1.child_id = g2.child_id
AND g1.title = g2.title
AND g1.created_at = g2.created_at;

-- 更新无效数据
UPDATE users
SET email = NULL
WHERE email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
```

## 十一、部署架构设计

### 11.1 部署环境

| 环境 | 用途 | 配置 | 部署方式 |
|------|------|------|---------|
| 开发环境 | 本地开发和调试 | PostgreSQL 15, Redis 7, SQLite 3 | Docker Compose |
| 测试环境 | 功能测试和集成测试 | PostgreSQL 15 (2核4G), Redis 7 (1核2G) | Kubernetes |
| 预生产环境 | 性能测试和压力测试 | PostgreSQL 15 (4核8G), Redis 7 (2核4G) | Kubernetes |
| 生产环境 | 线上服务运行 | PostgreSQL 15 (8核16G), Redis 7 (4核8G) | Kubernetes + HA |

### 11.2 部署流程

#### 11.2.1 PostgreSQL 部署流程

1. **初始化数据库集群**：
   - 创建主数据库实例
   - 配置主从复制
   - 设置连接池（PgBouncer）

2. **数据库初始化**：
   - 执行数据库迁移脚本
   - 创建初始数据
   - 配置用户权限

3. **配置监控**：
   - 部署Prometheus exporter
   - 配置Grafana监控面板
   - 设置告警规则

#### 11.2.2 Redis 部署流程

1. **初始化Redis集群**：
   - 部署Redis主节点
   - 配置Redis从节点
   - 部署Redis Sentinel

2. **配置持久化**：
   - 启用RDB快照
   - 启用AOF持久化
   - 配置备份策略

3. **配置监控**：
   - 部署Redis exporter
   - 配置监控指标
   - 设置告警规则

#### 11.2.3 SQLite 部署流程

1. **初始化SQLite数据库**：
   - 创建数据库文件
   - 执行初始化脚本
   - 配置数据迁移路径

2. **配置备份**：
   - 设置自动备份
   - 配置备份保留策略
   - 测试恢复流程

### 11.3 容器化部署

#### 11.3.1 Docker Compose 配置

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: yyc3-postgres
    environment:
      POSTGRES_DB: yyc3_ai_xiaoyu
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./migrations:/docker-entrypoint-initdb.d
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - yyc3-network

  redis:
    image: redis:7-alpine
    container_name: yyc3-redis
    command: redis-server --requirepass ${REDIS_PASSWORD}
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "--raw", "incr", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - yyc3-network

  pgbouncer:
    image: edoburu/pgbouncer:latest
    container_name: yyc3-pgbouncer
    environment:
      DATABASES_HOST: postgres
      DATABASES_PORT: 5432
      DATABASES_USER: postgres
      DATABASES_PASSWORD: ${POSTGRES_PASSWORD}
      DATABASES_DBNAME: yyc3_ai_xiaoyu
      POOL_MODE: transaction
      MAX_CLIENT_CONN: 1000
      DEFAULT_POOL_SIZE: 25
    ports:
      - "6432:6432"
    depends_on:
      - postgres
    networks:
      - yyc3-network

volumes:
  postgres_data:
  redis_data:

networks:
  yyc3-network:
    driver: bridge
```

#### 11.3.2 Kubernetes 配置

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
  namespace: yyc3
spec:
  serviceName: postgres
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:15-alpine
        env:
        - name: POSTGRES_DB
          value: yyc3_ai_xiaoyu
        - name: POSTGRES_USER
          valueFrom:
            secretKeyRef:
              name: postgres-secret
              key: username
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: postgres-secret
              key: password
        ports:
        - containerPort: 5432
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
        resources:
          requests:
            memory: "8Gi"
            cpu: "4"
          limits:
            memory: "16Gi"
            cpu: "8"
        livenessProbe:
          exec:
            command:
            - pg_isready
            - -U
            - postgres
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          exec:
            command:
            - pg_isready
            - -U
            - postgres
          initialDelaySeconds: 5
          periodSeconds: 5
  volumeClaimTemplates:
  - metadata:
      name: postgres-storage
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 100Gi
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis
  namespace: yyc3
spec:
  replicas: 1
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
    spec:
      containers:
      - name: redis
        image: redis:7-alpine
        command: ["redis-server", "--requirepass", "$(REDIS_PASSWORD)"]
        env:
        - name: REDIS_PASSWORD
          valueFrom:
            secretKeyRef:
              name: redis-secret
              key: password
        ports:
        - containerPort: 6379
        volumeMounts:
        - name: redis-storage
          mountPath: /data
        resources:
          requests:
            memory: "2Gi"
            cpu: "1"
          limits:
            memory: "4Gi"
            cpu: "2"
        livenessProbe:
          exec:
            command:
            - redis-cli
            - ping
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          exec:
            command:
            - redis-cli
            - ping
          initialDelaySeconds: 5
          periodSeconds: 5
  volumes:
  - name: redis-storage
    emptyDir:
      sizeLimit: 10Gi
```

#### 11.3.3 高可用配置

```yaml
容器化:
  容器技术: Docker + Kubernetes
  镜像管理: Harbor私有镜像仓库
  编排方案: Kubernetes StatefulSet (PostgreSQL), Deployment (Redis)
  服务发现: CoreDNS + Kubernetes Service
  配置管理: ConfigMap + Secret
  存储管理: PersistentVolumeClaim
  负载均衡: Nginx Ingress Controller
  健康检查: Kubernetes Liveness/Readiness Probes
  滚动更新: Kubernetes RollingUpdate
  自动扩缩容: Horizontal Pod Autoscaler (HPA)
```

### 11.4 部署检查清单

#### 11.4.1 部署前检查

- [ ] 确认服务器资源充足（CPU、内存、磁盘）
- [ ] 确认网络配置正确（端口、防火墙）
- [ ] 确认DNS配置正确
- [ ] 确认证书配置正确（SSL/TLS）
- [ ] 确认备份策略已配置
- [ ] 确认监控告警已配置

#### 11.4.2 部署后验证

- [ ] 数据库连接正常
- [ ] 数据迁移成功
- [ ] 缓存服务正常
- [ ] 监控指标正常
- [ ] 告警规则生效
- [ ] 备份恢复测试通过

### 11.5 回滚策略

#### 11.5.1 回滚触发条件

- 数据库连接失败率 > 50%
- 慢查询数量突增 > 100%
- 缓存命中率 < 70%
- 数据迁移失败

#### 11.5.2 回滚流程

1. 停止新版本服务
2. 恢复数据库备份
3. 恢复缓存数据
4. 启动旧版本服务
5. 验证系统功能
6. 通知相关人员

### 11.6 监控告警体系配置

#### 11.6.1 监控架构设计

**监控架构**：

```
┌─────────────────────────────────────────────────────────────┐
│                        监控告警体系                           │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ↓                     ↓                     ↓
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  数据采集层   │    │  数据处理层   │    │  告警通知层   │
├──────────────┤    ├──────────────┤    ├──────────────┤
│ PostgreSQL   │    │ Prometheus   │    │ Alertmanager │
│ Redis        │    │              │    │              │
│ SQLite       │    │              │    │              │
│ PgBouncer    │    │              │    │              │
│ Application  │    │              │    │              │
└──────────────┘    └──────────────┘    └──────────────┘
        │                     │                     │
        ↓                     ↓                     ↓
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Exporter    │    │  TSDB存储    │    │  通知渠道     │
├──────────────┤    ├──────────────┤    ├──────────────┤
│ pg_exporter  │    │ 时序数据库    │    │ Email        │
│ redis_exporter│   │              │    │ Slack        │
│ node_exporter│   │              │    │ SMS          │
│ custom_exporter│  │              │    │ Webhook      │
└──────────────┘    └──────────────┘    └──────────────┘
        │                     │
        ↓                     ↓
┌──────────────┐    ┌──────────────┐
│  可视化展示   │    │  规则引擎     │
├──────────────┤    ├──────────────┤
│ Grafana      │    │ 告警规则     │
│ Dashboard    │    │ 聚合规则     │
│              │    │ 记录规则     │
└──────────────┘    └──────────────┘
```

**监控组件**：

1. **数据采集层**：
   - PostgreSQL Exporter: 采集PostgreSQL数据库指标
   - Redis Exporter: 采集Redis缓存指标
   - Node Exporter: 采集服务器系统指标
   - Custom Exporter: 采集应用自定义指标

2. **数据处理层**：
   - Prometheus: 时序数据库和监控数据处理
   - Alertmanager: 告警管理和通知路由

3. **可视化展示层**：
   - Grafana: 监控仪表板和数据可视化
   - Dashboard: 预定义监控面板

#### 11.6.2 PostgreSQL 监控配置

**监控指标**：

| 指标类别 | 指标名称 | 说明 | 告警阈值 |
|---------|---------|------|---------|
| 连接指标 | pg_stat_database_connections | 数据库连接数 | > 80% 最大连接数 |
| 查询指标 | pg_stat_statements_calls | 查询执行次数 | N/A |
| 查询指标 | pg_stat_statements_total_time | 查询总耗时 | > 5秒 (P95) |
| 查询指标 | pg_stat_statements_rows | 查询返回行数 | N/A |
| 锁指标 | pg_locks_count | 锁等待数量 | > 10 |
| 缓存指标 | pg_stat_database_blks_hit | 缓存命中次数 | N/A |
| 缓存指标 | pg_stat_database_blks_read | 缓存未命中次数 | N/A |
| 缓存指标 | cache_hit_ratio | 缓存命中率 | < 90% |
| 事务指标 | pg_stat_database_xact_commit | 提交事务数 | N/A |
| 事务指标 | pg_stat_database_xact_rollback | 回滚事务数 | > 5% |
| 复制指标 | pg_stat_replication_lag | 复制延迟 | > 30秒 |
| 表大小 | pg_stat_user_tables_size | 表大小 | N/A |
| 索引大小 | pg_stat_user_indexes_size | 索引大小 | N/A |
| 死锁指标 | pg_stat_database_deadlocks | 死锁次数 | > 0 |

**Prometheus 配置**：

```yaml
# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres-exporter:9187']
    metrics_path: /metrics
    scrape_interval: 10s

  - job_name: 'postgres-pgbouncer'
    static_configs:
      - targets: ['pgbouncer-exporter:9127']
    metrics_path: /metrics
    scrape_interval: 10s
```

**告警规则**：

```yaml
# postgres-alerts.yml
groups:
  - name: postgres_alerts
    interval: 30s
    rules:
      - alert: PostgreSQLHighConnections
        expr: pg_stat_database_connections{datname="yyc3_ai_xiaoyu"} > pg_settings_max_connections * 0.8
        for: 2m
        labels:
          severity: warning
          service: postgres
        annotations:
          summary: "PostgreSQL连接数过高"
          description: "数据库 {{ $labels.datname }} 连接数 {{ $value }} 超过80%"

      - alert: PostgreSQLSlowQueries
        expr: rate(pg_stat_statements_total_time_sum[5m]) > 5
        for: 5m
        labels:
          severity: warning
          service: postgres
        annotations:
          summary: "PostgreSQL慢查询过多"
          description: "平均查询耗时 {{ $value }}秒 超过5秒"

      - alert: PostgreSQLCacheHitRatioLow
        expr: (pg_stat_database_blks_hit / (pg_stat_database_blks_hit + pg_stat_database_blks_read)) < 0.9
        for: 10m
        labels:
          severity: warning
          service: postgres
        annotations:
          summary: "PostgreSQL缓存命中率过低"
          description: "缓存命中率 {{ $value | humanizePercentage }} 低于90%"

      - alert: PostgreSQLReplicationLag
        expr: pg_stat_replication_lag > 30
        for: 5m
        labels:
          severity: critical
          service: postgres
        annotations:
          summary: "PostgreSQL复制延迟过高"
          description: "复制延迟 {{ $value }}秒 超过30秒"

      - alert: PostgreSQLDeadlocks
        expr: rate(pg_stat_database_deadlocks[5m]) > 0
        for: 1m
        labels:
          severity: warning
          service: postgres
        annotations:
          summary: "PostgreSQL检测到死锁"
          description: "死锁发生率 {{ $value }}次/秒"

      - alert: PostgreSQLTransactionRollbackHigh
        expr: rate(pg_stat_database_xact_rollback[5m]) / rate(pg_stat_database_xact_commit[5m]) > 0.05
        for: 5m
        labels:
          severity: warning
          service: postgres
        annotations:
          summary: "PostgreSQL事务回滚率过高"
          description: "事务回滚率 {{ $value | humanizePercentage }} 超过5%"
```

**Grafana Dashboard 配置**：

```json
{
  "dashboard": {
    "title": "PostgreSQL 监控仪表板",
    "panels": [
      {
        "title": "数据库连接数",
        "targets": [
          {
            "expr": "pg_stat_database_connections{datname=\"yyc3_ai_xiaoyu\"}",
            "legendFormat": "连接数"
          },
          {
            "expr": "pg_settings_max_connections",
            "legendFormat": "最大连接数"
          }
        ],
        "type": "graph"
      },
      {
        "title": "查询性能",
        "targets": [
          {
            "expr": "rate(pg_stat_statements_total_time_sum[5m])",
            "legendFormat": "平均查询耗时"
          },
          {
            "expr": "rate(pg_stat_statements_calls[5m])",
            "legendFormat": "查询速率"
          }
        ],
        "type": "graph"
      },
      {
        "title": "缓存命中率",
        "targets": [
          {
            "expr": "pg_stat_database_blks_hit / (pg_stat_database_blks_hit + pg_stat_database_blks_read)",
            "legendFormat": "缓存命中率"
          }
        ],
        "type": "graph"
      },
      {
        "title": "复制延迟",
        "targets": [
          {
            "expr": "pg_stat_replication_lag",
            "legendFormat": "复制延迟(秒)"
          }
        ],
        "type": "graph"
      }
    ]
  }
}
```

#### 11.6.3 Redis 监控配置

**监控指标**：

| 指标类别 | 指标名称 | 说明 | 告警阈值 |
|---------|---------|------|---------|
| 内存指标 | redis_memory_used_bytes | 已使用内存 | > 80% 最大内存 |
| 内存指标 | redis_memory_max_bytes | 最大内存限制 | N/A |
| 内存指标 | redis_memory_fragmentation_ratio | 内存碎片率 | > 1.5 |
| 连接指标 | redis_connected_clients | 客户端连接数 | > 80% 最大连接数 |
| 命令指标 | redis_commands_processed_total | 处理命令总数 | N/A |
| 命令指标 | redis_instantaneous_ops_per_sec | 每秒操作数 | N/A |
| 键指标 | redis_db_keys | 键数量 | N/A |
| 键指标 | redis_db_expiring_keys | 过期键数量 | N/A |
| 键指标 | redis_keyspace_hits | 缓存命中次数 | N/A |
| 键指标 | redis_keyspace_misses | 缓存未命中次数 | N/A |
| 缓存指标 | cache_hit_ratio | 缓存命中率 | < 85% |
| 持久化指标 | redis_rdb_last_save_timestamp | 最后RDB保存时间 | N/A |
| 持久化指标 | redis_aof_enabled | AOF是否启用 | N/A |
| 复制指标 | redis_connected_slaves | 从节点数量 | < 期望数量 |
| 复制指标 | redis_master_link_down_since | 主从连接断开时间 | > 0 |

**Prometheus 配置**：

```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'redis'
    static_configs:
      - targets: ['redis-exporter:9121']
    metrics_path: /metrics
    scrape_interval: 10s
```

**告警规则**：

```yaml
# redis-alerts.yml
groups:
  - name: redis_alerts
    interval: 30s
    rules:
      - alert: RedisHighMemoryUsage
        expr: redis_memory_used_bytes / redis_memory_max_bytes > 0.8
        for: 5m
        labels:
          severity: warning
          service: redis
        annotations:
          summary: "Redis内存使用率过高"
          description: "Redis内存使用率 {{ $value | humanizePercentage }} 超过80%"

      - alert: RedisMemoryFragmentationHigh
        expr: redis_memory_fragmentation_ratio > 1.5
        for: 10m
        labels:
          severity: warning
          service: redis
        annotations:
          summary: "Redis内存碎片率过高"
          description: "内存碎片率 {{ $value }} 超过1.5"

      - alert: RedisHighConnections
        expr: redis_connected_clients / redis_config_maxclients > 0.8
        for: 5m
        labels:
          severity: warning
          service: redis
        annotations:
          summary: "Redis连接数过高"
          description: "客户端连接数 {{ $value }} 超过80%"

      - alert: RedisCacheHitRatioLow
        expr: redis_keyspace_hits / (redis_keyspace_hits + redis_keyspace_misses) < 0.85
        for: 10m
        labels:
          severity: warning
          service: redis
        annotations:
          summary: "Redis缓存命中率过低"
          description: "缓存命中率 {{ $value | humanizePercentage }} 低于85%"

      - alert: RedisReplicationDown
        expr: redis_master_link_down_since > 0
        for: 1m
        labels:
          severity: critical
          service: redis
        annotations:
          summary: "Redis主从复制断开"
          description: "主从复制已断开 {{ $value }}秒"

      - alert: RedisSlaveDisconnected
        expr: redis_connected_slaves < 1
        for: 5m
        labels:
          severity: warning
          service: redis
        annotations:
          summary: "Redis从节点连接失败"
          description: "从节点连接数 {{ $value }} 低于期望值"
```

#### 11.6.4 应用监控配置

**监控指标**：

| 指标类别 | 指标名称 | 说明 | 告警阈值 |
|---------|---------|------|---------|
| HTTP指标 | http_requests_total | HTTP请求总数 | N/A |
| HTTP指标 | http_request_duration_seconds | HTTP请求耗时 | > 1秒 (P95) |
| HTTP指标 | http_requests_in_flight | 处理中请求数 | > 100 |
| HTTP指标 | http_request_errors_total | HTTP错误请求数 | > 5% |
| 数据库指标 | db_query_duration_seconds | 数据库查询耗时 | > 500ms (P95) |
| 数据库指标 | db_connections_active | 活跃数据库连接数 | > 80% 最大连接数 |
| 数据库指标 | db_query_errors_total | 数据库查询错误数 | > 1% |
| 缓存指标 | cache_hits_total | 缓存命中总数 | N/A |
| 缓存指标 | cache_misses_total | 缓存未命中总数 | N/A |
| 缓存指标 | cache_hit_ratio | 缓存命中率 | < 80% |
| 业务指标 | active_users | 活跃用户数 | N/A |
| 业务指标 | ai_requests_total | AI请求总数 | N/A |
| 业务指标 | ai_request_duration_seconds | AI请求耗时 | > 5秒 (P95) |

**Prometheus 配置**：

```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'yyc3-backend'
    static_configs:
      - targets: ['backend:3000']
    metrics_path: /metrics
    scrape_interval: 15s

  - job_name: 'yyc3-frontend'
    static_configs:
      - targets: ['frontend:3001']
    metrics_path: /metrics
    scrape_interval: 15s
```

**告警规则**：

```yaml
# application-alerts.yml
groups:
  - name: application_alerts
    interval: 30s
    rules:
      - alert: HighHTTPErrorRate
        expr: rate(http_request_errors_total[5m]) / rate(http_requests_total[5m]) > 0.05
        for: 5m
        labels:
          severity: warning
          service: backend
        annotations:
          summary: "HTTP错误率过高"
          description: "HTTP错误率 {{ $value | humanizePercentage }} 超过5%"

      - alert: HighHTTPLatency
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 1
        for: 5m
        labels:
          severity: warning
          service: backend
        annotations:
          summary: "HTTP请求延迟过高"
          description: "P95延迟 {{ $value }}秒 超过1秒"

      - alert: HighDatabaseLatency
        expr: histogram_quantile(0.95, rate(db_query_duration_seconds_bucket[5m])) > 0.5
        for: 5m
        labels:
          severity: warning
          service: backend
        annotations:
          summary: "数据库查询延迟过高"
          description: "P95延迟 {{ $value }}秒 超过500ms"

      - alert: HighDatabaseErrorRate
        expr: rate(db_query_errors_total[5m]) / rate(db_query_duration_seconds_count[5m]) > 0.01
        for: 5m
        labels:
          severity: warning
          service: backend
        annotations:
          summary: "数据库错误率过高"
          description: "数据库错误率 {{ $value | humanizePercentage }} 超过1%"

      - alert: LowCacheHitRatio
        expr: cache_hits_total / (cache_hits_total + cache_misses_total) < 0.8
        for: 10m
        labels:
          severity: warning
          service: backend
        annotations:
          summary: "缓存命中率过低"
          description: "缓存命中率 {{ $value | humanizePercentage }} 低于80%"

      - alert: HighAILatency
        expr: histogram_quantile(0.95, rate(ai_request_duration_seconds_bucket[5m])) > 5
        for: 5m
        labels:
          severity: warning
          service: backend
        annotations:
          summary: "AI请求延迟过高"
          description: "P95延迟 {{ $value }}秒 超过5秒"
```

#### 11.6.5 告警通知配置

**Alertmanager 配置**：

```yaml
# alertmanager.yml
global:
  resolve_timeout: 5m
  smtp_smarthost: 'smtp.example.com:587'
  smtp_from: 'alerts@yyc3.com'
  smtp_auth_username: 'alerts@yyc3.com'
  smtp_auth_password: '${SMTP_PASSWORD}'

route:
  group_by: ['alertname', 'service']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 12h
  receiver: 'default'
  routes:
    - match:
        severity: critical
      receiver: 'critical-alerts'
      continue: true
    
    - match:
        severity: warning
      receiver: 'warning-alerts'
      continue: true
    
    - match:
        service: postgres
      receiver: 'postgres-team'
    
    - match:
        service: redis
      receiver: 'redis-team'

receivers:
  - name: 'default'
    email_configs:
      - to: 'team@yyc3.com'
        headers:
          Subject: '[YYC3 Alert] {{ .GroupLabels.alertname }}'

  - name: 'critical-alerts'
    email_configs:
      - to: 'oncall@yyc3.com'
        headers:
          Subject: '[CRITICAL] {{ .GroupLabels.alertname }}'
    slack_configs:
      - api_url: '${SLACK_WEBHOOK_URL}'
        channel: '#alerts-critical'
        title: '🚨 Critical Alert'
        text: '{{ range .Alerts }}{{ .Annotations.description }}{{ end }}'
    pagerduty_configs:
      - service_key: '${PAGERDUTY_SERVICE_KEY}'

  - name: 'warning-alerts'
    email_configs:
      - to: 'team@yyc3.com'
        headers:
          Subject: '[WARNING] {{ .GroupLabels.alertname }}'
    slack_configs:
      - api_url: '${SLACK_WEBHOOK_URL}'
        channel: '#alerts-warning'
        title: '⚠️ Warning Alert'
        text: '{{ range .Alerts }}{{ .Annotations.description }}{{ end }}'

  - name: 'postgres-team'
    email_configs:
      - to: 'postgres-team@yyc3.com'
        headers:
          Subject: '[PostgreSQL] {{ .GroupLabels.alertname }}'

  - name: 'redis-team'
    email_configs:
      - to: 'redis-team@yyc3.com'
        headers:
          Subject: '[Redis] {{ .GroupLabels.alertname }}'

inhibit_rules:
  - source_match:
      severity: 'critical'
    target_match:
      severity: 'warning'
    equal: ['alertname', 'service']
```

#### 11.6.6 监控仪表板

**Grafana 仪表板配置**：

```json
{
  "dashboard": {
    "title": "YYC3 数据架构监控仪表板",
    "panels": [
      {
        "title": "系统概览",
        "type": "stat",
        "gridPos": {"h": 4, "w": 4, "x": 0, "y": 0},
        "targets": [
          {
            "expr": "up{job=~\"postgres|redis\"}",
            "legendFormat": "{{ job }}"
          }
        ]
      },
      {
        "title": "PostgreSQL 连接数",
        "type": "graph",
        "gridPos": {"h": 8, "w": 12, "x": 0, "y": 4},
        "targets": [
          {
            "expr": "pg_stat_database_connections{datname=\"yyc3_ai_xiaoyu\"}",
            "legendFormat": "活跃连接"
          },
          {
            "expr": "pg_settings_max_connections",
            "legendFormat": "最大连接"
          }
        ]
      },
      {
        "title": "PostgreSQL 查询性能",
        "type": "graph",
        "gridPos": {"h": 8, "w": 12, "x": 12, "y": 4},
        "targets": [
          {
            "expr": "rate(pg_stat_statements_total_time_sum[5m])",
            "legendFormat": "平均耗时"
          },
          {
            "expr": "rate(pg_stat_statements_calls[5m])",
            "legendFormat": "查询速率"
          }
        ]
      },
      {
        "title": "Redis 内存使用",
        "type": "graph",
        "gridPos": {"h": 8, "w": 12, "x": 0, "y": 12},
        "targets": [
          {
            "expr": "redis_memory_used_bytes / 1024 / 1024 / 1024",
            "legendFormat": "已使用 (GB)"
          },
          {
            "expr": "redis_memory_max_bytes / 1024 / 1024 / 1024",
            "legendFormat": "最大值 (GB)"
          }
        ]
      },
      {
        "title": "Redis 缓存命中率",
        "type": "graph",
        "gridPos": {"h": 8, "w": 12, "x": 12, "y": 12},
        "targets": [
          {
            "expr": "redis_keyspace_hits / (redis_keyspace_hits + redis_keyspace_misses)",
            "legendFormat": "命中率"
          }
        ]
      },
      {
        "title": "HTTP 请求延迟",
        "type": "graph",
        "gridPos": {"h": 8, "w": 12, "x": 0, "y": 20},
        "targets": [
          {
            "expr": "histogram_quantile(0.50, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "P50"
          },
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "P95"
          },
          {
            "expr": "histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "P99"
          }
        ]
      },
      {
        "title": "HTTP 错误率",
        "type": "graph",
        "gridPos": {"h": 8, "w": 12, "x": 12, "y": 20},
        "targets": [
          {
            "expr": "rate(http_request_errors_total[5m]) / rate(http_requests_total[5m])",
            "legendFormat": "错误率"
          }
        ]
      }
    ]
  }
}
```

#### 11.6.7 监控检查清单

**部署前检查**：

- [ ] Prometheus 配置文件正确
- [ ] Alertmanager 配置文件正确
- [ ] Exporter 部署完成
- [ ] 告警规则配置完成
- [ ] Grafana 仪表板配置完成
- [ ] 通知渠道配置正确
- [ ] 防火墙规则正确

**部署后验证**：

- [ ] Prometheus 正常采集指标
- [ ] Alertmanager 正常处理告警
- [ ] Grafana 仪表板正常显示
- [ ] 告警规则正常触发
- [ ] 通知渠道正常接收
- [ ] 监控数据正常存储

#### 11.6.8 监控最佳实践

1. **指标命名规范**：
   - 使用下划线分隔单词
   - 包含单位后缀（如 _bytes, _seconds）
   - 避免使用特殊字符
   - 保持命名一致性

2. **告警规则设计**：
   - 设置合理的告警阈值
   - 避免告警风暴
   - 区分严重级别
   - 提供清晰的告警描述

3. **仪表板设计**：
   - 突出关键指标
   - 使用合适的图表类型
   - 保持简洁清晰
   - 定期更新优化

4. **监控数据保留**：
   - 设置合理的数据保留策略
   - 定期清理历史数据
   - 优化存储空间使用
   - 备份重要监控数据

## 十二、灾难恢复

### 12.1 高可用架构

#### 12.1.1 PostgreSQL 高可用

- 主从复制（Streaming Replication）
- 自动故障转移（Patroni）
- 负载均衡（PgBouncer）

#### 12.1.2 Redis 高可用

- Redis Sentinel（哨兵模式）
- Redis Cluster（集群模式）
- 自动故障转移

### 12.2 灾难恢复计划

#### 12.2.1 RPO/RTO 目标

- RPO (恢复点目标): < 5分钟
- RTO (恢复时间目标): < 30分钟

#### 12.2.2 恢复流程

1. 检测故障
2. 启动备用系统
3. 恢复数据备份
4. 验证数据完整性
5. 切换流量
6. 监控系统状态

## 十三、技术债务与改进

### 13.1 当前技术债务

- SQLite到PostgreSQL的迁移尚未完成
- 缺少完整的数据同步机制
- 部分查询未进行优化
- 监控告警体系不完善

### 13.2 改进计划

#### 13.2.1 短期改进（1-3个月）

- 完成SQLite到PostgreSQL的迁移
- 实现数据同步机制
- 优化慢查询
- 完善监控告警

#### 13.2.2 中期改进（3-6个月）

- 实现读写分离
- 引入分库分表
- 优化缓存策略
- 完善数据治理

#### 13.2.3 长期改进（6-12个月）

- 引入分布式数据库
- 实现多地域部署
- 完善数据湖架构
- 引入数据中台

## 十四、附录

### 14.1 相关文档

- [总体架构设计文档](./01-YYC3-XY-架构类-总体架构设计文档.md)
- [微服务架构设计文档](./02-YYC3-XY-架构类-微服务架构设计文档.md)
- [安全架构设计文档](./05-YYC3-XY-架构类-安全架构设计文档.md)

### 14.2 相关代码

- 数据库管理器: `/lib/db/database-manager.ts`
- PostgreSQL配置: `/backend/src/config/database.ts`
- 数据库迁移: `/backend/src/migrations/001_initial_schema.sql`

### 14.3 变更历史

| 版本 | 日期 | 修改人 | 修改内容 |
|------|------|--------|----------|
| V1.0 | 2025-12-25 | YanYu | 初始版本创建 |
| V1.1 | 2025-12-26 | YanYu | 补充核心模块设计章节、部署架构设计章节，更新章节编号 |

### 14.4 审核记录

| 审核日期 | 审核人 | 审核结果 | 审核意见 |
|---------|--------|---------|---------|
| 2025-12-25 | YanYu | 通过 | 初始版本审核通过 |
| 2025-12-26 | YanYu | 通过 | 补充内容审核通过 |

---

> 「***YanYuCloudCube***」
> 「***<admin@0379.email>***」
> 「***Words Initiate Quadrants, Language Serves as Core for the Future***」
> 「***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***」
