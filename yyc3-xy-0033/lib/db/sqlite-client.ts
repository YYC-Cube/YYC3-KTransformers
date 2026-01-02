// SQLite数据库客户端 - 真正的数据库解决方案
// 使用Bun内置的SQLite支持，提供高性能的数据持久化

import { Database } from "bun:sqlite"
import type { Child, GrowthRecord, Assessment, Milestone } from "./client"

// 数据库表创建SQL
const CREATE_TABLES_SQL = `
-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'parent',
  created_at TEXT NOT NULL,
  updated_at TEXT
);

-- 儿童档案表
CREATE TABLE IF NOT EXISTS children (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  nickname TEXT,
  birth_date TEXT NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  avatar_url TEXT,
  current_stage TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 成长记录表
CREATE TABLE IF NOT EXISTS growth_records (
  id TEXT PRIMARY KEY,
  child_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('milestone', 'observation', 'emotion', 'learning')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  media_urls TEXT, -- JSON数组
  tags TEXT, -- JSON数组
  emotion TEXT,
  ai_analysis TEXT,
  recorded_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
);

-- 评估记录表
CREATE TABLE IF NOT EXISTS growth_assessments (
  id TEXT PRIMARY KEY,
  child_id TEXT NOT NULL,
  stage_id TEXT NOT NULL,
  dimensions TEXT NOT NULL, -- JSON数组
  overall_score INTEGER NOT NULL,
  ai_summary TEXT,
  recommendations TEXT, -- JSON数组
  created_at TEXT NOT NULL,
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
);

-- 里程碑记录表
CREATE TABLE IF NOT EXISTS milestones (
  id TEXT PRIMARY KEY,
  child_id TEXT NOT NULL,
  milestone_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  achieved_at TEXT NOT NULL,
  celebration_data TEXT, -- JSON对象
  created_at TEXT NOT NULL,
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
);

-- AI对话记录表
CREATE TABLE IF NOT EXISTS ai_conversations (
  id TEXT PRIMARY KEY,
  child_id TEXT,
  user_id TEXT NOT NULL,
  messages TEXT NOT NULL, -- JSON数组
  session_id TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 作业任务表
CREATE TABLE IF NOT EXISTS homework_tasks (
  id TEXT PRIMARY KEY,
  child_id TEXT NOT NULL,
  subject TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed', 'overdue')),
  priority TEXT NOT NULL CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  ai_feedback TEXT,
  created_at TEXT NOT NULL,
  completed_at TEXT,
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
);

-- 课程表
CREATE TABLE IF NOT EXISTS courses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  subject TEXT NOT NULL,
  age_group TEXT,
  difficulty_level INTEGER CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
  content TEXT, -- JSON对象
  media_urls TEXT, -- JSON数组
  tags TEXT, -- JSON数组
  is_free BOOLEAN DEFAULT true,
  created_at TEXT NOT NULL,
  updated_at TEXT
);

-- 阶段转换记录表
CREATE TABLE IF NOT EXISTS stage_transitions (
  id TEXT PRIMARY KEY,
  child_id TEXT NOT NULL,
  from_stage TEXT,
  to_stage TEXT NOT NULL,
  transition_date TEXT NOT NULL,
  notes TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_children_user_id ON children(user_id);
CREATE INDEX IF NOT EXISTS idx_growth_records_child_id ON growth_records(child_id);
CREATE INDEX IF NOT EXISTS idx_growth_records_recorded_at ON growth_records(recorded_at);
CREATE INDEX IF NOT EXISTS idx_growth_assessments_child_id ON growth_assessments(child_id);
CREATE INDEX IF NOT EXISTS idx_milestones_child_id ON milestones(child_id);
CREATE INDEX IF NOT EXISTS idx_milestones_achieved_at ON milestones(achieved_at);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_child_id ON ai_conversations(child_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_id ON ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_homework_tasks_child_id ON homework_tasks(child_id);
CREATE INDEX IF NOT EXISTS idx_homework_tasks_due_date ON homework_tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_homework_tasks_status ON homework_tasks(status);
CREATE INDEX IF NOT EXISTS idx_courses_subject ON courses(subject);
CREATE INDEX IF NOT EXISTS idx_stage_transitions_child_id ON stage_transitions(child_id);
`

export class SQLiteDatabase {
  private db: Database

  constructor(dbPath: string = "./yyc3_database.db") {
    this.db = new Database(dbPath, { create: true, strict: true })
    this.initializeDatabase()
  }

  private initializeDatabase() {
    try {
      // 创建所有表
      this.db.exec(CREATE_TABLES_SQL)

      // 启用外键约束
      this.db.exec("PRAGMA foreign_keys = ON")

      // 设置WAL模式以提高并发性能
      this.db.exec("PRAGMA journal_mode = WAL")

      console.log("✅ SQLite数据库初始化成功")
    } catch (error) {
      console.error("❌ SQLite数据库初始化失败:", error)
      throw error
    }
  }

  // 通用查询方法
  async findMany<T>(table: string, conditions: Record<string, unknown> = {}): Promise<T[]> {
    try {
      let query = `SELECT * FROM ${table}`
      const params: unknown[] = []

      if (Object.keys(conditions).length > 0) {
        const whereClause = Object.keys(conditions)
          .map((key, index) => `${key} = $${index + 1}`)
          .join(" AND ")
        query += ` WHERE ${whereClause}`
        params.push(...Object.values(conditions))
      }

      const stmt = this.db.query(query)
      return stmt.all(...params) as T[]
    } catch (error) {
      console.error(`查询失败 ${table}:`, error)
      return []
    }
  }

  async findOne<T>(table: string, id: string): Promise<T | null> {
    try {
      const stmt = this.db.query(`SELECT * FROM ${table} WHERE id = $1`)
      const result = stmt.get(id) as T | undefined
      return result || null
    } catch (error) {
      console.error(`查询单条记录失败 ${table}:`, error)
      return null
    }
  }

  async findFirst<T>(table: string, conditions: Record<string, unknown>): Promise<T | null> {
    try {
      const results = await this.findMany<T>(table, conditions)
      return results[0] || null
    } catch (error) {
      console.error(`查询首条记录失败 ${table}:`, error)
      return null
    }
  }

  async create<T extends Record<string, unknown>>(
    table: string,
    data: Omit<T, "id" | "created_at">
  ): Promise<T> {
    try {
      const id = crypto.randomUUID()
      const created_at = new Date().toISOString()
      const item = { ...data, id, created_at } as T

      const columns = Object.keys(item).join(", ")
      const placeholders = Object.keys(item)
        .map((_, index) => `$${index + 1}`)
        .join(", ")
      const values = Object.values(item)

      const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`
      const stmt = this.db.query(query)
      stmt.run(...values)

      return item
    } catch (error) {
      console.error(`创建记录失败 ${table}:`, error)
      throw error
    }
  }

  async createMany<T extends Record<string, unknown>>(
    table: string,
    dataArray: Omit<T, "id" | "created_at">[]
  ): Promise<T[]> {
    try {
      const items = dataArray.map((data) => ({
        ...data,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
      })) as T[]

      for (const item of items) {
        await this.create(table, item)
      }

      return items
    } catch (error) {
      console.error(`批量创建记录失败 ${table}:`, error)
      throw error
    }
  }

  async update<T extends Record<string, unknown>>(
    table: string,
    id: string,
    data: Partial<Omit<T, "id" | "created_at">>
  ): Promise<T | null> {
    try {
      const updated_at = new Date().toISOString()
      const updateData = { ...data, updated_at }

      const columns = Object.keys(updateData)
        .map((key, index) => `${key} = $${index + 1}`)
        .join(", ")
      const values = [...Object.values(updateData), id]

      const query = `UPDATE ${table} SET ${columns} WHERE id = $${columns.length + 1}`
      const stmt = this.db.query(query)
      stmt.run(...values)

      return this.findOne<T>(table, id)
    } catch (error) {
      console.error(`更新记录失败 ${table}:`, error)
      return null
    }
  }

  async upsert<T extends Record<string, unknown>>(
    table: string,
    id: string,
    data: Omit<T, "id" | "created_at" | "updated_at">
  ): Promise<T> {
    try {
      const existing = await this.findOne<T>(table, id)
      if (existing) {
        return (await this.update<T>(table, id, data as Partial<Omit<T, "id">>)) as T
      }
      return this.create<T>(table, { ...data, id } as Omit<T, "id" | "created_at">)
    } catch (error) {
      console.error(`upsert记录失败 ${table}:`, error)
      throw error
    }
  }

  async delete(table: string, id: string): Promise<boolean> {
    try {
      const stmt = this.db.query(`DELETE FROM ${table} WHERE id = $1`)
      const result = stmt.run(id)
      return result.changes > 0
    } catch (error) {
      console.error(`删除记录失败 ${table}:`, error)
      return false
    }
  }

  async deleteMany(table: string, ids: string[]): Promise<number> {
    try {
      if (ids.length === 0) return 0

      const placeholders = ids.map((_, index) => `$${index + 1}`).join(", ")
      const query = `DELETE FROM ${table} WHERE id IN (${placeholders})`
      const stmt = this.db.query(query)
      const result = stmt.run(...ids)
      return result.changes
    } catch (error) {
      console.error(`批量删除记录失败 ${table}:`, error)
      return 0
    }
  }

  async count(table: string, conditions: Record<string, unknown> = {}): Promise<number> {
    try {
      let query = `SELECT COUNT(*) as count FROM ${table}`
      const params: unknown[] = []

      if (Object.keys(conditions).length > 0) {
        const whereClause = Object.keys(conditions)
          .map((key, index) => `${key} = $${index + 1}`)
          .join(" AND ")
        query += ` WHERE ${whereClause}`
        params.push(...Object.values(conditions))
      }

      const stmt = this.db.query(query)
      const result = stmt.get(...params) as { count: number }
      return result.count
    } catch (error) {
      console.error(`统计记录数失败 ${table}:`, error)
      return 0
    }
  }

  // 分页查询
  async paginate<T>(
    table: string,
    options: {
      page: number
      pageSize: number
      filter?: Record<string, unknown>
      sort?: string
      order?: "ASC" | "DESC"
    }
  ): Promise<{ data: T[]; total: number; totalPages: number }> {
    try {
      const { page, pageSize, filter = {}, sort = "created_at", order = "DESC" } = options
      const offset = (page - 1) * pageSize

      // 查询总数
      const total = await this.count(table, filter)

      // 查询分页数据
      let query = `SELECT * FROM ${table}`
      const params: unknown[] = []

      if (Object.keys(filter).length > 0) {
        const whereClause = Object.keys(filter)
          .map((key, index) => `${key} = $${index + 1}`)
          .join(" AND ")
        query += ` WHERE ${whereClause}`
        params.push(...Object.values(filter))
      }

      query += ` ORDER BY ${sort} ${order}`
      query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
      params.push(pageSize, offset)

      const stmt = this.db.query(query)
      const data = stmt.all(...params) as T[]

      const totalPages = Math.ceil(total / pageSize)

      return { data, total, totalPages }
    } catch (error) {
      console.error(`分页查询失败 ${table}:`, error)
      return { data: [], total: 0, totalPages: 0 }
    }
  }

  // 原子性事务支持
  transaction<T>(callback: () => Promise<T>): Promise<T> {
    return this.db.transaction(callback) as Promise<T>
  }

  // 数据库备份
  backup(backupPath: string): boolean {
    try {
      this.db.backup(backupPath)
      console.log(`✅ 数据库备份成功: ${backupPath}`)
      return true
    } catch (error) {
      console.error(`❌ 数据库备份失败:`, error)
      return false
    }
  }

  // 数据库优化
  optimize(): void {
    try {
      this.db.exec("VACUUM")
      this.db.exec("ANALYZE")
      console.log("✅ 数据库优化完成")
    } catch (error) {
      console.error("❌ 数据库优化失败:", error)
    }
  }

  // 关闭数据库连接
  close(): void {
    this.db.close()
    console.log("✅ 数据库连接已关闭")
  }

  // 初始化示例数据
  async seedMockData(): Promise<void> {
    try {
      // 检查是否已有数据
      const userCount = await this.count("users")
      if (userCount > 0) {
        console.log("📋 数据库已有数据，跳过初始化")
        return
      }

      console.log("🌱 开始初始化示例数据...")

      await this.transaction(async () => {
        // 创建示例用户
        const user = await this.create("users", {
          email: "parent@yyc3.com",
          name: "张女士",
          avatar_url: "/placeholder.svg?height=100&width=100",
          role: "parent",
        })

        // 创建示例儿童档案
        const child = await this.create("children", {
          user_id: user.id,
          name: "小语",
          nickname: "小语",
          birth_date: "2018-09-15",
          gender: "female",
          avatar_url: "/placeholder.svg?height=100&width=100",
          current_stage: "6-9岁学术奠基期",
        })

        // 创建示例成长记录
        await this.create("growth_records", {
          child_id: child.id,
          type: "milestone",
          title: "第一次独立完成数学作业",
          content: "今天小语第一次不需要任何帮助就完成了所有数学作业，展现了很强的独立学习能力。",
          media_urls: JSON.stringify([]),
          tags: JSON.stringify(["学习", "独立"]),
          emotion: "proud",
          recorded_at: new Date().toISOString(),
        })

        // 创建示例作业任务
        await this.createMany("homework_tasks", [
          {
            child_id: child.id,
            subject: "数学",
            title: "完成练习册第15-18页",
            description: "重点复习分数加减法",
            due_date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
            status: "in_progress",
            priority: "high",
          },
          {
            child_id: child.id,
            subject: "语文",
            title: "背诵古诗《春晓》",
            description: "理解诗意并能默写",
            due_date: new Date(Date.now() + 172800000).toISOString().split("T")[0],
            status: "pending",
            priority: "normal",
          },
        ])

        // 创建示例课程
        await this.createMany("courses", [
          {
            title: "趣味数学入门",
            description: "通过游戏和故事学习基础数学概念",
            subject: "数学",
            age_group: "6-9岁",
            difficulty_level: 2,
            content: JSON.stringify({
              chapters: ["数字认知", "简单加法", "趣味减法", "实际应用"],
              duration: "4周",
            }),
            media_urls: JSON.stringify([]),
            tags: JSON.stringify(["基础", "游戏化", "互动"]),
          },
          {
            title: "语文阅读启蒙",
            description: "培养阅读兴趣和理解能力",
            subject: "语文",
            age_group: "6-9岁",
            difficulty_level: 1,
            content: JSON.stringify({
              chapters: ["字母认知", "拼音基础", "简单词汇", "阅读理解"],
              duration: "6周",
            }),
            media_urls: JSON.stringify([]),
            tags: JSON.stringify(["启蒙", "阅读", "基础"]),
          },
        ])
      })

      console.log("✅ 示例数据初始化完成")
    } catch (error) {
      console.error("❌ 示例数据初始化失败:", error)
      throw error
    }
  }

  // 清除所有数据（开发用）
  async clearAll(): Promise<void> {
    try {
      const tables = [
        "stage_transitions",
        "courses",
        "homework_tasks",
        "ai_conversations",
        "milestones",
        "growth_assessments",
        "growth_records",
        "children",
        "users",
      ]

      await this.transaction(async () => {
        for (const table of tables) {
          this.db.exec(`DELETE FROM ${table}`)
        }
      })

      console.log("✅ 所有数据已清除")
    } catch (error) {
      console.error("❌ 清除数据失败:", error)
      throw error
    }
  }
}

// 创建并导出数据库实例
let dbInstance: SQLiteDatabase | null = null

export function getDatabase(): SQLiteDatabase {
  if (!dbInstance) {
    const dbPath = process.env.DATABASE_URL || "./yyc3_database.db"
    dbInstance = new SQLiteDatabase(dbPath)
  }
  return dbInstance
}

// 兼容性导出，保持与现有代码的接口一致性
export const db = getDatabase()

// 类型导出
export type { Child, GrowthRecord, Assessment, Milestone }