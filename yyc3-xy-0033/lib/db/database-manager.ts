// 数据库管理器 - 统一管理数据库连接和数据迁移
// 支持从localStorage迁移到SQLite，并提供数据访问的统一接口

import { getDatabase, SQLiteDatabase } from "./sqlite-client"
import { db as localStorageDB, type Child, type GrowthRecord, type Assessment, type Milestone } from "./client"
import { reportError } from "../global-error-handler"

export interface DatabaseConfig {
  type: "sqlite" | "localStorage" | "hybrid"
  sqlitePath?: string
  enableMigration?: boolean
}

export class DatabaseManager {
  private static instance: DatabaseManager
  private sqliteDB: SQLiteDatabase | null = null
  private config: DatabaseConfig

  private constructor(config: DatabaseConfig = { type: "sqlite" }) {
    this.config = config
    this.initializeDatabase()
  }

  static getInstance(config?: DatabaseConfig): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager(config)
    }
    return DatabaseManager.instance
  }

  private initializeDatabase(): void {
    try {
      if (this.config.type === "sqlite" || this.config.type === "hybrid") {
        this.sqliteDB = getDatabase()

        // 初始化示例数据
        this.sqliteDB.seedMockData().then(() => {
          console.log("✅ 数据库初始化完成")
        }).catch((error) => {
          reportError(error as Error, { component: 'DatabaseManager', action: 'seedMockData' })
        })
      }
    } catch (error) {
      reportError(error as Error, { component: 'DatabaseManager', action: 'initializeDatabase' })
      // 降级到localStorage
      this.config.type = "localStorage"
    }
  }

  // 获取当前使用的数据库实例
  getDatabase(): SQLiteDatabase | typeof localStorageDB {
    if (this.config.type === "sqlite") {
      if (!this.sqliteDB) {
        throw new Error("SQLite数据库未初始化")
      }
      return this.sqliteDB
    }
    return localStorageDB
  }

  // 检查数据库连接状态
  async checkConnection(): Promise<{ status: "connected" | "disconnected" | "error"; type: string; details?: string }> {
    try {
      if (this.config.type === "sqlite" && this.sqliteDB) {
        // 测试SQLite连接
        await this.sqliteDB.count("users")
        return { status: "connected", type: "sqlite" }
      } else if (this.config.type === "localStorage") {
        // 测试localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("test", "test")
          localStorage.removeItem("test")
          return { status: "connected", type: "localStorage" }
        }
        return { status: "disconnected", type: "localStorage", details: "localStorage不可用" }
      }
      return { status: "disconnected", type: this.config.type, details: "数据库未初始化" }
    } catch (error) {
      return {
        status: "error",
        type: this.config.type,
        details: error instanceof Error ? error.message : "未知错误"
      }
    }
  }

  // 从localStorage迁移数据到SQLite
  async migrateFromLocalStorage(): Promise<{ success: boolean; migrated: { table: string; count: number }[]; error?: string }> {
    if (!this.sqliteDB) {
      return { success: false, migrated: [], error: "SQLite数据库未初始化" }
    }

    try {
      const migrated: { table: string; count: number }[] = []

      if (typeof window === "undefined") {
        return { success: false, migrated: [], error: "localStorage不可用" }
      }

      // 迁移用户数据
      const users = JSON.parse(localStorage.getItem("yyc3_users") || "[]")
      if (users.length > 0) {
        for (const user of users) {
          await this.sqliteDB.create("users", {
            email: user.email,
            name: user.name,
            avatar_url: user.avatar_url,
            role: user.role || "parent",
            created_at: user.created_at || new Date().toISOString(),
          })
        }
        migrated.push({ table: "users", count: users.length })
      }

      // 迁移儿童档案数据
      const children = JSON.parse(localStorage.getItem("yyc3_children") || "[]") as Child[]
      if (children.length > 0) {
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
        migrated.push({ table: "children", count: children.length })
      }

      // 迁移成长记录数据
      const records = JSON.parse(localStorage.getItem("yyc3_growth_records") || "[]") as GrowthRecord[]
      if (records.length > 0) {
        for (const record of records) {
          await this.sqliteDB.create("growth_records", {
            child_id: record.child_id,
            type: record.type,
            title: record.title,
            content: record.content,
            media_urls: JSON.stringify(record.media_urls),
            tags: JSON.stringify(record.tags),
            emotion: record.emotion,
            ai_analysis: record.ai_analysis,
            recorded_at: record.recorded_at,
          })
        }
        migrated.push({ table: "growth_records", count: records.length })
      }

      // 迁移评估数据
      const assessments = JSON.parse(localStorage.getItem("yyc3_growth_assessments") || "[]") as Assessment[]
      if (assessments.length > 0) {
        for (const assessment of assessments) {
          await this.sqliteDB.create("growth_assessments", {
            child_id: assessment.child_id,
            stage_id: assessment.stage_id,
            dimensions: JSON.stringify(assessment.dimensions),
            overall_score: assessment.overall_score,
            ai_summary: assessment.ai_summary,
            recommendations: JSON.stringify(assessment.recommendations),
          })
        }
        migrated.push({ table: "growth_assessments", count: assessments.length })
      }

      // 迁移里程碑数据
      const milestones = JSON.parse(localStorage.getItem("yyc3_milestones") || "[]") as Milestone[]
      if (milestones.length > 0) {
        for (const milestone of milestones) {
          await this.sqliteDB.create("milestones", {
            child_id: milestone.child_id,
            milestone_type: milestone.milestone_type,
            title: milestone.title,
            description: milestone.description,
            achieved_at: milestone.achieved_at,
            celebration_data: JSON.stringify(milestone.celebration_data || {}),
          })
        }
        migrated.push({ table: "milestones", count: milestones.length })
      }

      // 迁移作业任务数据
      const homework = JSON.parse(localStorage.getItem("yyc3_homework_tasks") || "[]")
      if (homework.length > 0) {
        for (const task of homework) {
          await this.sqliteDB.create("homework_tasks", {
            child_id: task.child_id,
            subject: task.subject,
            title: task.title,
            description: task.description,
            due_date: task.due_date,
            status: task.status,
            priority: task.priority,
            ai_feedback: task.ai_feedback,
          })
        }
        migrated.push({ table: "homework_tasks", count: homework.length })
      }

      console.log("✅ 数据迁移完成:", migrated)
      return { success: true, migrated }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "迁移失败"
      reportError(error as Error, { component: 'DatabaseManager', action: 'migrateFromLocalStorage' })
      return { success: false, migrated: [], error: errorMsg }
    }
  }

  // 备份数据库
  async backupDatabase(backupPath?: string): Promise<{ success: boolean; path?: string; error?: string }> {
    try {
      if (!this.sqliteDB) {
        return { success: false, error: "SQLite数据库未初始化" }
      }

      // 检查是否在服务器端环境
      if (typeof window === 'undefined') {
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
        const defaultPath = backupPath || `./backups/yyc3_database_backup_${timestamp}.db`

        // 确保备份目录存在
        const fs = require("fs")
        const path = require("path")
        const backupDir = path.dirname(defaultPath)

        if (!fs.existsSync(backupDir)) {
          fs.mkdirSync(backupDir, { recursive: true })
        }

        const success = this.sqliteDB.backup(defaultPath)
        if (success) {
          console.log(`✅ 数据库备份成功: ${defaultPath}`)
          return { success: true, path: defaultPath }
        } else {
          return { success: false, error: "备份失败" }
        }
      } else {
        return { success: false, error: "备份功能仅在服务器端可用" }
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "备份失败"
      reportError(error as Error, { component: 'DatabaseManager', action: 'backupDatabase' })
      return { success: false, error: errorMsg }
    }
  }

  // 数据库统计信息
  async getDatabaseStats(): Promise<Record<string, number>> {
    try {
      const db = this.getDatabase()
      const tables = [
        "users",
        "children",
        "growth_records",
        "growth_assessments",
        "milestones",
        "ai_conversations",
        "homework_tasks",
        "courses",
        "stage_transitions"
      ]

      const stats: Record<string, number> = {}

      if (this.config.type === "sqlite") {
        for (const table of tables) {
          stats[table] = await (db as SQLiteDatabase).count(table)
        }
      } else {
        // localStorage模式
        for (const table of tables) {
          const data = localStorage.getItem(`yyc3_${table}`)
          stats[table] = data ? JSON.parse(data).length : 0
        }
      }

      return stats
    } catch (error) {
      reportError(error as Error, { component: 'DatabaseManager', action: 'getStatistics' })
      return {}
    }
  }

  // 清理和优化数据库
  async optimizeDatabase(): Promise<{ success: boolean; message: string }> {
    try {
      if (this.config.type === "sqlite" && this.sqliteDB) {
        this.sqliteDB.optimize()
        return { success: true, message: "SQLite数据库优化完成" }
      } else if (this.config.type === "localStorage") {
        // 清理localStorage中的过期数据
        if (typeof window !== "undefined") {
          const keys = Object.keys(localStorage)
          let cleaned = 0

          for (const key of keys) {
            if (key.startsWith("yyc3_") && key !== "yyc3_initialized") {
              try {
                const data = JSON.parse(localStorage.getItem(key) || "[]")
                if (Array.isArray(data) && data.length === 0) {
                  localStorage.removeItem(key)
                  cleaned++
                }
              } catch {
                // 清理无效数据
                localStorage.removeItem(key)
                cleaned++
              }
            }
          }

          return { success: true, message: `localStorage清理完成，清理了${cleaned}个无效项目` }
        }
      }

      return { success: false, message: "不支持的数据库类型" }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "优化失败"
      reportError(error as Error, { component: 'DatabaseManager', action: 'optimizeDatabase' })
      return { success: false, message: errorMsg }
    }
  }

  // 重置数据库（开发环境用）
  async resetDatabase(): Promise<{ success: boolean; message: string }> {
    try {
      if (this.config.type === "sqlite" && this.sqliteDB) {
        await this.sqliteDB.clearAll()
        await this.sqliteDB.seedMockData()
        return { success: true, message: "SQLite数据库重置完成" }
      } else if (this.config.type === "localStorage") {
        await localStorageDB.clearAll()
        await localStorageDB.seedMockData()
        return { success: true, message: "localStorage数据库重置完成" }
      }

      return { success: false, message: "不支持的数据库类型" }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "重置失败"
      reportError(error as Error, { component: 'DatabaseManager', action: 'resetDatabase' })
      return { success: false, message: errorMsg }
    }
  }

  // 关闭数据库连接
  close(): void {
    if (this.sqliteDB) {
      this.sqliteDB.close()
      this.sqliteDB = null
    }
    DatabaseManager.instance = null as any
  }
}

// 导出单例实例
export const databaseManager = DatabaseManager.getInstance()

// 导出便捷方法
export function getDBManager(): DatabaseManager {
  return DatabaseManager.getInstance()
}

// 默认导出数据库实例（向后兼容）
export { databaseManager as db }