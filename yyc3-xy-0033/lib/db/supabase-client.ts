// Supabase数据库客户端封装
// 为未来集成Supabase做准备，提供统一的数据访问接口

import type { Child, GrowthRecord, Assessment, Milestone, StorageKey } from "./client"
import type {
  DatabaseClient,
  AuthUser,
  AuthSession,
  RealtimeCallback,
  QueryBuilder,
  StorageClient,
  AuthClient,
  RealtimeClient
} from "@/types/database"

// Supabase配置类型
interface SupabaseConfig {
  url: string
  anonKey: string
  serviceRoleKey?: string
}

// 查询构建器实现
class MockQueryBuilder<T = any> implements QueryBuilder<T> {
  private query: {
    table: string
    columns?: string
    filters: Array<{column: string, operator: string, value: any}>
    orderBy?: {column: string, ascending: boolean}
    limitCount?: number
    offsetCount?: number
    rangeFrom?: number
    rangeTo?: number
  } = {
    table: '',
    filters: []
  }

  constructor(table: string) {
    this.query.table = table
  }

  select(columns?: string): QueryBuilder<T> {
    this.query.columns = columns
    return this
  }

  from(table: string): QueryBuilder<T> {
    this.query.table = table
    return this
  }

  where(column: string, operator: string, value: any): QueryBuilder<T> {
    this.query.filters.push({ column, operator, value })
    return this
  }

  whereIn(column: string, values: any[]): QueryBuilder<T> {
    this.query.filters.push({ column, operator: 'in', value: values })
    return this
  }

  orderBy(column: string, ascending = true): QueryBuilder<T> {
    this.query.orderBy = { column, ascending }
    return this
  }

  limit(count: number): QueryBuilder<T> {
    this.query.limitCount = count
    return this
  }

  offset(count: number): QueryBuilder<T> {
    this.query.offsetCount = count
    return this
  }

  range(from: number, to: number): QueryBuilder<T> {
    this.query.rangeFrom = from
    this.query.rangeTo = to
    return this
  }

  async single(): Promise<T | null> {
    // Mock implementation
    return null
  }

  async maybeSingle(): Promise<T | null> {
    // Mock implementation
    return null
  }

  async execute(): Promise<T[]> {
    // Mock implementation
    return []
  }
}

// 存储客户端实现
class MockStorageClient implements StorageClient {
  async upload(bucket: string, path: string, file: File): Promise<string> {
    return `/storage/${bucket}/${path}`
  }

  async download(bucket: string, path: string): Promise<Blob> {
    return new Blob()
  }

  async remove(bucket: string, paths: string[]): Promise<void> {
    // Mock implementation
  }

  getPublicUrl(bucket: string, path: string): string {
    return `/storage/${bucket}/${path}`
  }

  async list(bucket: string, path?: string): Promise<{ name: string; size: number }[]> {
    return []
  }
}

// 认证客户端实现
class MockAuthClient implements AuthClient {
  async signUp(email: string, password: string, options?: any): Promise<any> {
    return {
      user: { id: crypto.randomUUID(), email },
      session: { access_token: 'mock-token' }
    }
  }

  async signIn(email: string, password: string): Promise<any> {
    return {
      user: { id: crypto.randomUUID(), email },
      session: { access_token: 'mock-token' }
    }
  }

  async signOut(): Promise<void> {
    // Mock implementation
  }

  async getCurrentUser(): Promise<any> {
    return null
  }

  async getSession(): Promise<any> {
    return null
  }

  async updateUser(attributes: any): Promise<any> {
    return {}
  }

  async resetPasswordForEmail(email: string): Promise<void> {
    // Mock implementation
  }

  onAuthStateChange(callback: (session: any) => void): () => void {
    return () => {} // Mock cleanup function
  }
}

// 实时客户端实现
class MockRealtimeClient implements RealtimeClient {
  private channels = new Map<string, any>()

  channel(channel: string): any {
    if (!this.channels.has(channel)) {
      this.channels.set(channel, {
        on: () => this.channels.get(channel),
        subscribe: () => this.channels.get(channel),
        unsubscribe: () => {},
        send: () => this.channels.get(channel)
      })
    }
    return this.channels.get(channel)
  }

  async connect(): Promise<void> {
    // Mock implementation
  }

  disconnect(): void {
    // Mock implementation
  }
}

// 模拟Supabase客户端（开发环境）
class MockSupabaseClient implements DatabaseClient {
  private storage = new Map<string, unknown[]>()
  private currentUser: AuthUser | null = null
  private currentSession: AuthSession | null = null
  private authListeners: ((session: AuthSession | null) => void)[] = []
  private realtimeListeners: Map<string, RealtimeCallback<unknown>[]> = new Map()

  // 服务实例
  public readonly storage: StorageClient = new MockStorageClient()
  public readonly auth: AuthClient = new MockAuthClient()
  public readonly realtime: RealtimeClient = new MockRealtimeClient()

  constructor() {
    // 从localStorage恢复会话
    if (typeof window !== "undefined") {
      const savedSession = localStorage.getItem("yyc3_auth_session")
      if (savedSession) {
        try {
          this.currentSession = JSON.parse(savedSession)
          this.currentUser = this.currentSession.user
        } catch {
          // 忽略解析错误
        }
      }
    }
  }

  // 基础查询方法
  async findMany<T>(table: string, filter?: (item: T) => boolean): Promise<T[]> {
    const collection = this.getCollection<T>(table)
    return filter ? collection.filter(filter) : collection
  }

  async findOne<T extends { id: string }>(table: string, id: string): Promise<T | null> {
    const collection = this.getCollection<T>(table)
    return collection.find((item) => item.id === id) || null
  }

  async findFirst<T>(table: string, filter: (item: T) => boolean): Promise<T | null> {
    const collection = this.getCollection<T>(table)
    return collection.find(filter) || null
  }

  // 数据修改方法
  async create<T extends { id?: string; created_at?: string }>(
    table: string,
    data: Omit<T, 'id' | 'created_at'>
  ): Promise<T> {
    const collection = this.getCollection<T>(table)
    const newItem = {
      ...data,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    } as T
    collection.push(newItem)
    this.setCollection(table, collection)
    return newItem
  }

  async createMany<T extends { id?: string; created_at?: string }>(
    table: string,
    dataArray: Omit<T, 'id' | 'created_at'>[]
  ): Promise<T[]> {
    const collection = this.getCollection<T>(table)
    const newItems = dataArray.map((data) => ({
      ...data,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    })) as T[]
    collection.push(...newItems)
    this.setCollection(table, collection)
    return newItems
  }

  async update<T extends { id: string; updated_at?: string }>(
    table: string,
    id: string,
    data: Partial<Omit<T, 'id'>>
  ): Promise<T | null> {
    const collection = this.getCollection<T>(table)
    const index = collection.findIndex((item) => item.id === id)
    if (index === -1) return null

    collection[index] = {
      ...collection[index],
      ...data,
      updated_at: new Date().toISOString(),
    }
    this.setCollection(table, collection)
    return collection[index]
  }

  async upsert<T extends { id: string; created_at?: string; updated_at?: string }>(
    table: string,
    id: string,
    data: Omit<T, 'id' | 'created_at' | 'updated_at'>
  ): Promise<T> {
    const existing = await this.findOne<T>(table, id)
    if (existing) {
      return (await this.update<T>(table, id, data as Partial<Omit<T, 'id'>>)) as T
    }
    return this.create<T>(table, { ...data, id } as Omit<T, 'id' | 'created_at'>)
  }

  async delete(table: string, id: string): Promise<boolean> {
    const collection = this.getCollection<{ id: string }>(table)
    const filtered = collection.filter((item) => item.id !== id)
    if (filtered.length === collection.length) return false
    this.setCollection(table, filtered)
    return true
  }

  async deleteMany(table: string, ids: string[]): Promise<number> {
    const collection = this.getCollection<{ id: string }>(table)
    const filtered = collection.filter((item) => !ids.includes(item.id))
    const deletedCount = collection.length - filtered.length
    this.setCollection(table, filtered)
    return deletedCount
  }

  // 聚合和统计方法
  async count<T>(table: string, filter?: (item: T) => boolean): Promise<number> {
    const collection = this.getCollection<T>(table)
    return filter ? collection.filter(filter).length : collection.length
  }

  async aggregate<T, R>(table: string, aggregator: (items: T[]) => R): Promise<R> {
    const collection = this.getCollection<T>(table)
    return aggregator(collection)
  }

  async paginate<T>(
    table: string,
    options: {
      page: number
      pageSize: number
      filter?: (item: T) => boolean
      sort?: (a: T, b: T) => number
    }
  ): Promise<{ data: T[]; total: number; totalPages: number }> {
    let collection = this.getCollection<T>(table)

    if (options.filter) {
      collection = collection.filter(options.filter)
    }

    if (options.sort) {
      collection = collection.sort(options.sort)
    }

    const total = collection.length
    const totalPages = Math.ceil(total / options.pageSize)
    const start = (options.page - 1) * options.pageSize
    const data = collection.slice(start, start + options.pageSize)

    return { data, total, totalPages }
  }

  // 查询构建器
  from<T = any>(table: string): QueryBuilder<T> {
    return new MockQueryBuilder<T>(table)
  }

  // RPC 调用
  async rpc<T>(functionName: string, params?: Record<string, unknown>): Promise<T> {
    return {} as T
  }

  // 私有方法
  private getCollection<T>(table: string): T[] {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(`yyc3_${table}`)
    return data ? JSON.parse(data) : []
  }

  private setCollection<T>(table: string, data: T[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem(`yyc3_${table}`, JSON.stringify(data))
  }

  // 初始化模拟数据
  async seedMockData(): Promise<void> {
    if (typeof window === "undefined") return

    const hasData = localStorage.getItem("yyc3_initialized")
    if (hasData) return

    // 创建模拟用户
    const mockUser = {
      id: "user-001",
      email: "parent@example.com",
      name: "张女士",
      avatar_url: "/placeholder.svg?height=100&width=100",
      role: "parent",
      created_at: new Date().toISOString(),
    }
    localStorage.setItem("yyc3_users", JSON.stringify([mockUser]))

    // 创建模拟儿童档案
    const mockChild: Child = {
      id: "child-001",
      user_id: "user-001",
      name: "小语",
      nickname: "小语",
      birth_date: "2018-09-15",
      gender: "female",
      avatar_url: "/placeholder.svg?height=100&width=100",
      current_stage: "6-9岁学术奠基期",
      created_at: new Date().toISOString(),
    }
    localStorage.setItem("yyc3_children", JSON.stringify([mockChild]))

    localStorage.setItem("yyc3_initialized", "true")
  }

  // 清除所有数据
  async clearAll(): Promise<void> {
    if (typeof window === "undefined") return
    const keys: StorageKey[] = [
      "users",
      "children",
      "growth_records",
      "growth_assessments",
      "ai_conversations",
      "homework_tasks",
      "courses",
      "milestones",
      "stage_transitions",
    ]
    keys.forEach((key) => localStorage.removeItem(`yyc3_${key}`))
    localStorage.removeItem("yyc3_initialized")
  }

  // 导出所有数据
  async exportData(): Promise<Record<string, unknown[]>> {
    const keys: StorageKey[] = [
      "users",
      "children",
      "growth_records",
      "growth_assessments",
      "ai_conversations",
      "homework_tasks",
      "courses",
      "milestones",
    ]
    const data: Record<string, unknown[]> = {}
    keys.forEach((key) => {
      data[key] = this.getCollection(key)
    })
    return data
  }

  // 导入数据
  async importData(data: Record<string, unknown[]>): Promise<void> {
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        this.setCollection(key, value)
      }
    })
  }
}

// 导出客户端实例
export const supabase = new MockSupabaseClient()

// 导出类型
export type { AuthUser, AuthSession, RealtimeCallback }
export { MockSupabaseClient }