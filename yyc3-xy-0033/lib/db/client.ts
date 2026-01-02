// 数据库客户端封装
// 目前使用localStorage模拟，待集成Supabase后替换

export type StorageKey =
  | "users"
  | "children"
  | "growth_records"
  | "growth_assessments"
  | "ai_conversations"
  | "homework_tasks"
  | "courses"
  | "milestones"
  | "stage_transitions"
  | "birthdayWishes"
  | "user_profiles"

// 儿童档案类型
export interface Child {
  id: string
  user_id: string
  name: string
  nickname?: string
  birth_date: string
  gender: "male" | "female" | "other"
  avatar_url?: string
  current_stage?: string
  created_at: string
  updated_at?: string
}

// 用户档案类型
export interface UserProfile {
  id: string
  user_id: string
  bio?: string
  interests: string[]
  age_group: {
    id: string
    name: string
    min_age: number
    max_age: number
    description: string
    characteristics: string[]
    recommendations: string[]
  }
  grade?: string
  school?: string
  birthday?: {
    lunar?: string
    solar: string
  }
  zodiac?: string
  created_at: string
  updated_at?: string
}

// 成长记录类型
export interface GrowthRecord {
  id: string
  child_id: string
  type: "milestone" | "observation" | "emotion" | "learning"
  title: string
  content: string
  media_urls: string[]
  tags: string[]
  emotion?: string
  ai_analysis?: string
  recorded_at: string
  created_at: string
}

// 评估记录类型
export interface Assessment {
  id: string
  child_id: string
  stage_id: string
  dimensions: AssessmentDimension[]
  overall_score: number
  ai_summary: string
  recommendations: string[]
  created_at: string
}

export interface AssessmentDimension {
  id: string
  name: string
  score: number
  max_score: number
  level: "优秀" | "良好" | "一般" | "需关注"
}

// 里程碑记录类型
export interface Milestone {
  id: string
  child_id: string
  milestone_type: string
  title: string
  description?: string
  achieved_at: string
  celebration_data?: {
    shared: boolean
    reactions: number
  }
  created_at: string
}

class LocalStorageDB {
  private getCollection<T>(key: StorageKey): T[] {
    const storageKey = `yyc3_${key}`
    
    if (typeof window === "undefined") {
      // 服务器端使用内存存储
      return this.serverData.get(storageKey) || []
    }
    
    const data = localStorage.getItem(storageKey)
    return data ? JSON.parse(data) : []
  }

  private setCollection<T>(key: StorageKey, data: T[]): void {
    const storageKey = `yyc3_${key}`
    
    if (typeof window === "undefined") {
      // 服务器端使用内存存储
      this.serverData.set(storageKey, data)
      return
    }
    
    localStorage.setItem(storageKey, JSON.stringify(data))
  }

  // 查询多条记录
  async findMany<T>(table: StorageKey, filter?: (item: T) => boolean): Promise<T[]> {
    const collection = this.getCollection<T>(table)
    return filter ? collection.filter(filter) : collection
  }

  // 查询单条记录
  async findOne<T extends { id: string }>(table: StorageKey, id: string): Promise<T | null> {
    const collection = this.getCollection<T>(table)
    return collection.find((item) => item.id === id) || null
  }

  // 按条件查询单条记录
  async findFirst<T>(table: StorageKey, filter: (item: T) => boolean): Promise<T | null> {
    const collection = this.getCollection<T>(table)
    return collection.find(filter) || null
  }

  // 创建记录
  async create<T extends { id?: string; created_at?: string }>(
    table: StorageKey,
    data: Omit<T, "id" | "created_at">,
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

  // 批量创建记录
  async createMany<T extends { id?: string; created_at?: string }>(
    table: StorageKey,
    dataArray: Omit<T, "id" | "created_at">[],
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

  // 更新记录
  async update<T extends { id: string; updated_at?: string }>(
    table: StorageKey,
    id: string,
    data: Partial<Omit<T, "id">>,
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

  // 更新或创建记录
  async upsert<T extends { id: string; created_at?: string; updated_at?: string }>(
    table: StorageKey,
    id: string,
    data: Omit<T, "id" | "created_at" | "updated_at">,
  ): Promise<T> {
    const existing = await this.findOne<T>(table, id)
    if (existing) {
      return (await this.update<T>(table, id, data as Partial<Omit<T, "id">>)) as T
    }
    return this.create<T>(table, { ...data, id } as Omit<T, "id" | "created_at">)
  }

  // 删除记录
  async delete(table: StorageKey, id: string): Promise<boolean> {
    const collection = this.getCollection<{ id: string }>(table)
    const filtered = collection.filter((item) => item.id !== id)
    if (filtered.length === collection.length) return false
    this.setCollection(table, filtered)
    return true
  }

  // 批量删除记录
  async deleteMany(table: StorageKey, ids: string[]): Promise<number> {
    const collection = this.getCollection<{ id: string }>(table)
    const filtered = collection.filter((item) => !ids.includes(item.id))
    const deletedCount = collection.length - filtered.length
    this.setCollection(table, filtered)
    return deletedCount
  }

  // 统计数量
  async count<T>(table: StorageKey, filter?: (item: T) => boolean): Promise<number> {
    const collection = this.getCollection<T>(table)
    return filter ? collection.filter(filter).length : collection.length
  }

  // 聚合查询
  async aggregate<T, R>(table: StorageKey, aggregator: (items: T[]) => R): Promise<R> {
    const collection = this.getCollection<T>(table)
    return aggregator(collection)
  }

  // 分页查询
  async paginate<T>(
    table: StorageKey,
    options: {
      page: number
      pageSize: number
      filter?: (item: T) => boolean
      sort?: (a: T, b: T) => number
    },
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

  // 服务器端数据存储
  private serverData: Map<string, any> = new Map()
  
  // 辅助方法：设置存储值
  private setStorageValue(key: string, value: any): void {
    if (typeof window === "undefined") {
      // 服务器端使用内存存储
      this.serverData.set(key, value)
    } else {
      localStorage.setItem(key, value)
    }
  }

  // 初始化模拟数据
  async seedMockData(): Promise<void> {
    // 检查是否已初始化
    const isServer = typeof window === "undefined"
    const storageKey = "yyc3_initialized"
    
    let hasData = false
    if (isServer) {
      hasData = this.serverData.has(storageKey)
    } else {
      hasData = !!localStorage.getItem(storageKey)
    }
    
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
    this.setStorageValue("yyc3_users", JSON.stringify([mockUser]))

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
    this.setStorageValue("yyc3_children", JSON.stringify([mockChild]))

    // 创建模拟作业任务
    const mockHomework = [
      {
        id: "hw-001",
        child_id: "child-001",
        subject: "数学",
        title: "完成练习册第15-18页",
        description: "重点复习分数加减法",
        due_date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
        status: "in_progress",
        priority: "high",
        created_at: new Date().toISOString(),
      },
      {
        id: "hw-002",
        child_id: "child-001",
        subject: "语文",
        title: "背诵古诗《春晓》",
        description: "理解诗意并能默写",
        due_date: new Date(Date.now() + 172800000).toISOString().split("T")[0],
        status: "pending",
        priority: "normal",
        created_at: new Date().toISOString(),
      },
    ]
    localStorage.setItem("yyc3_homework_tasks", JSON.stringify(mockHomework))

    // 创建模拟成长记录
    const mockRecords: GrowthRecord[] = [
      {
        id: "record-001",
        child_id: "child-001",
        type: "milestone",
        title: "第一次独立完成数学作业",
        content: "今天小云第一次不需要任何帮助就完成了所有数学作业，展现了很强的独立学习能力。",
        media_urls: [],
        tags: ["学习", "独立"],
        emotion: "proud",
        recorded_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      },
      {
        id: "record-002",
        child_id: "child-001",
        type: "observation",
        title: "社交能力观察",
        content: "今天在公园主动邀请其他小朋友一起玩耍，表现出良好的社交意愿。",
        media_urls: [],
        tags: ["社交", "友谊"],
        emotion: "happy",
        recorded_at: new Date(Date.now() - 86400000 * 3).toISOString(),
        created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
      },
    ]
    localStorage.setItem("yyc3_growth_records", JSON.stringify(mockRecords))

    // 创建模拟里程碑
    const mockMilestones: Milestone[] = [
      {
        id: "milestone-001",
        child_id: "child-001",
        milestone_type: "academic",
        title: "独立完成作业",
        description: "第一次独立完成全部家庭作业",
        achieved_at: new Date(Date.now() - 86400000 * 3).toISOString(),
        celebration_data: { shared: true, reactions: 12 },
        created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
      },
      {
        id: "milestone-002",
        child_id: "child-001",
        milestone_type: "creative",
        title: "第一幅完整画作",
        description: "独立完成了一幅有主题的绘画作品",
        achieved_at: new Date(Date.now() - 86400000 * 7).toISOString(),
        celebration_data: { shared: true, reactions: 25 },
        created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
      },
    ]
    localStorage.setItem("yyc3_milestones", JSON.stringify(mockMilestones))

    // 创建模拟评估记录
    const mockAssessment: Assessment = {
      id: "assessment-001",
      child_id: "child-001",
      stage_id: "stage_6_9",
      dimensions: [
        { id: "academic", name: "学业基础", score: 85, max_score: 100, level: "良好" },
        { id: "learning_habits", name: "学习习惯", score: 82, max_score: 100, level: "良好" },
        { id: "logical_thinking", name: "逻辑思维", score: 90, max_score: 100, level: "优秀" },
        { id: "self_management", name: "自我管理", score: 78, max_score: 100, level: "良好" },
        { id: "social_skills", name: "社交能力", score: 92, max_score: 100, level: "优秀" },
      ],
      overall_score: 87,
      ai_summary: "小云整体发展良好，在逻辑思维和社交能力方面表现突出。",
      recommendations: ["继续培养阅读习惯", "加强时间管理能力", "鼓励参与团队活动"],
      created_at: new Date().toISOString(),
    }
    localStorage.setItem("yyc3_growth_assessments", JSON.stringify([mockAssessment]))

    // 创建模拟用户档案
    const mockUserProfile: UserProfile = {
      id: "profile-001",
      user_id: "user-001",
      bio: "热爱教育，关注孩子全面发展的家长",
      interests: ["阅读", "旅行", "摄影", "教育心理学"],
      age_group: {
        id: "adult_30_40",
        name: "30-40岁成年人",
        min_age: 30,
        max_age: 40,
        description: "处于事业和家庭稳定期的成年人",
        characteristics: ["成熟稳重", "责任感强", "注重家庭"],
        recommendations: ["平衡工作与家庭", "关注个人成长", "培养健康习惯"]
      },
      grade: "",
      school: "",
      birthday: {
        lunar: "1990-05-15",
        solar: "1990-06-08"
      },
      zodiac: "双子座",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    localStorage.setItem("yyc3_user_profiles", JSON.stringify([mockUserProfile]))

    // 设置初始化标志
    if (isServer) {
      this.serverData.set(storageKey, "true")
    } else {
      localStorage.setItem(storageKey, "true")
    }
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
      "user_profiles",
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
      "user_profiles",
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
        this.setCollection(key as StorageKey, value)
      }
    })
  }
}

export const db = new LocalStorageDB()
