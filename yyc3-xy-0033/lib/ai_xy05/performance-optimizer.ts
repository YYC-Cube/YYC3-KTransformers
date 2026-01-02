/**
 * AI响应加速优化模块
 * 提供智能缓存、批量处理、预测性加载等性能优化策略
 */

// AI响应类型
interface AIResponse {
  content: string
  role: string
  timestamp: number
  processingTime?: number
  [key: string]: unknown
}

// 请求上下文类型
interface RequestContext {
  [key: string]: unknown
}

// 响应缓存系统
interface CacheEntry {
  response: AIResponse
  timestamp: number
  ttl: number // 缓存生存时间（毫秒）
  context: string // 上下文指纹
}

class AIResponseCache {
  private cache = new Map<string, CacheEntry>()
  private readonly DEFAULT_TTL = 5 * 60 * 1000 // 5分钟
  private readonly MAX_CACHE_SIZE = 1000

  // 生成缓存键
  private generateCacheKey(prompt: string, context?: RequestContext): string {
    const contextStr = context ? JSON.stringify(context) : ''
    return `${prompt}_${contextStr}`.slice(0, 200)
  }

  // 获取缓存
  get(prompt: string, context?: RequestContext): AIResponse | null {
    const key = this.generateCacheKey(prompt, context)
    const entry = this.cache.get(key)

    if (!entry) return null

    // 检查是否过期
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }

    return entry.response
  }

  // 设置缓存
  set(prompt: string, response: AIResponse, context?: RequestContext, ttl?: number): void {
    const key = this.generateCacheKey(prompt, context)

    // LRU清理
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }

    this.cache.set(key, {
      response,
      timestamp: Date.now(),
      ttl: ttl || this.DEFAULT_TTL,
      context: JSON.stringify(context || {})
    })
  }

  // 清理过期缓存
  cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key)
      }
    }
  }
}

// 请求队列和批量处理
interface RequestItem {
  prompt: string
  context?: RequestContext
  resolve: (value: AIResponse) => void
  reject: (error: Error) => void
}

class RequestBatcher {
  private requestQueue: RequestItem[] = []

  private batchTimer: NodeJS.Timeout | null = null
  private readonly BATCH_DELAY = 50 // 50ms内的请求合并处理
  private readonly MAX_BATCH_SIZE = 5

  // 添加请求到队列
  addRequest(prompt: string, context?: RequestContext): Promise<AIResponse> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({ prompt, context, resolve, reject })

      // 检查是否需要立即处理
      if (this.requestQueue.length >= this.MAX_BATCH_SIZE) {
        this.processBatch()
      } else if (!this.batchTimer) {
        this.batchTimer = setTimeout(() => this.processBatch(), this.BATCH_DELAY)
      }
    })
  }

  // 处理批量请求
  private async processBatch(): Promise<void> {
    if (this.batchTimer) {
      clearTimeout(this.batchTimer)
      this.batchTimer = null
    }

    if (this.requestQueue.length === 0) return

    const batch = this.requestQueue.splice(0, this.MAX_BATCH_SIZE)

    try {
      // 合并相似请求，减少AI调用次数
      const groupedRequests = this.groupSimilarRequests(batch)
      const responses = await Promise.all(
        groupedRequests.map(group => this.processGroup(group))
      )

      // 分发响应
      batch.forEach(request => {
        const response = this.findResponseForRequest(request, groupedRequests, responses)
        request.resolve(response)
      })
    } catch (error) {
      batch.forEach(request => request.reject(error))
    }
  }

  // 将相似请求分组
  private groupSimilarRequests(requests: RequestItem[]): RequestItem[][] {
    // 简单的相似度分组逻辑（可根据需要优化）
    const groups: RequestItem[][] = []

    for (const request of requests) {
      let added = false

      for (const group of groups) {
        if (this.areSimilar(request, group[0])) {
          group.push(request)
          added = true
          break
        }
      }

      if (!added) {
        groups.push([request])
      }
    }

    return groups
  }

  // 判断请求是否相似
  private areSimilar(req1: RequestItem, req2: RequestItem): boolean {
    const distance = this.levenshteinDistance(req1.prompt, req2.prompt)
    const similarity = 1 - distance / Math.max(req1.prompt.length, req2.prompt.length)
    return similarity > 0.8 // 80%相似度
  }

  // 计算编辑距离
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() =>
      Array(str1.length + 1).fill(null)
    )

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        )
      }
    }

    return matrix[str2.length][str1.length]
  }

  // 处理请求组
  private async processGroup(group: RequestItem[]): Promise<AIResponse> {
    if (group.length === 1) {
      return this.callAI(group[0].prompt, group[0].context)
    }

    // 对于相似请求，使用第一个请求的结果
    return this.callAI(group[0].prompt, group[0].context)
  }

  // AI调用接口（需要实现具体的AI调用逻辑）
  private async callAI(prompt: string, context?: RequestContext): Promise<AIResponse> {
    // 这里应该集成实际的AI调用逻辑
    // 现在返回模拟数据
    return {
      content: "AI响应内容",
      role: "advisor",
      timestamp: Date.now()
    }
  }

  // 为请求找到对应的响应
  private findResponseForRequest(request: RequestItem, groups: RequestItem[][], responses: AIResponse[]): AIResponse {
    for (let i = 0; i < groups.length; i++) {
      if (groups[i].includes(request)) {
        return responses[i]
      }
    }
    throw new Error('Response not found for request')
  }
}

// 预测性内容加载
interface ContextHistoryItem {
  timestamp: number
  context: RequestContext
  action: string
}

class PredictiveLoader {
  private contextHistory: ContextHistoryItem[] = []

  private maxHistorySize = 100

  // 记录用户行为
  recordContext(context: RequestContext, action: string): void {
    this.contextHistory.push({
      timestamp: Date.now(),
      context: JSON.parse(JSON.stringify(context)),
      action
    })

    // 保持历史记录大小
    if (this.contextHistory.length > this.maxHistorySize) {
      this.contextHistory.shift()
    }
  }

  // 预测下一步操作
  predictNextAction(currentContext: RequestContext): string[] {
    const recentContexts = this.contextHistory.slice(-10)
    const predictions: string[] = []

    // 简单的模式匹配预测
    for (const record of recentContexts) {
      if (this.isContextSimilar(currentContext, record.context)) {
        if (!predictions.includes(record.action)) {
          predictions.push(record.action)
        }
      }
    }

    return predictions.slice(0, 3) // 最多返回3个预测
  }

  // 预测性内容获取
  async preloadContent(predictions: string[]): Promise<void> {
    for (const action of predictions) {
      // 根据预测的操作预加载相应内容
      switch (action) {
        case 'ai_chat':
          await this.preloadAIResponses()
          break
        case 'emotion_analysis':
          await this.preloadEmotionModels()
          break
        case 'growth_milestone':
          await this.preloadMilestoneData()
          break
      }
    }
  }

  private isContextSimilar(ctx1: RequestContext, ctx2: RequestContext): boolean {
    // 简单的上下文相似度判断
    return JSON.stringify(ctx1) === JSON.stringify(ctx2)
  }

  private async preloadAIResponses(): Promise<void> {
    // 预加载常用AI响应
    console.log('预加载AI响应模型')
  }

  private async preloadEmotionModels(): Promise<void> {
    // 预加载情感分析模型
    console.log('预加载情感分析模型')
  }

  private async preloadMilestoneData(): Promise<void> {
    // 预加载里程碑数据
    console.log('预加载成长里程碑数据')
  }
}

// 智能路由器
interface RouteRequestOptions {
  useCache?: boolean
  priority?: 'high' | 'normal' | 'low'
  predictedActions?: string[]
}

class SmartRouter {
  private responseCache = new AIResponseCache()
  private requestBatcher = new RequestBatcher()
  private predictiveLoader = new PredictiveLoader()

  // 主入口：智能路由AI请求
  async routeRequest(prompt: string, context?: RequestContext, options?: RouteRequestOptions): Promise<AIResponse> {
    const startTime = Date.now()

    try {
      // 1. 检查缓存
      if (options?.useCache !== false) {
        const cachedResponse = this.responseCache.get(prompt, context)
        if (cachedResponse) {
          console.log(`缓存命中，耗时: ${Date.now() - startTime}ms`)
          return cachedResponse
        }
      }

      // 2. 预测性加载
      if (options?.predictedActions) {
        await this.predictiveLoader.preloadContent(options.predictedActions)
      }

      // 3. 根据优先级处理请求
      let response: AIResponse
      if (options?.priority === 'high') {
        // 高优先级请求直接处理
        response = await this.processRequest(prompt, context)
      } else {
        // 普通请求加入批量处理
        response = await this.requestBatcher.addRequest(prompt, context)
      }

      // 4. 缓存响应
      this.responseCache.set(prompt, response, context)

      // 5. 记录行为用于预测
      this.predictiveLoader.recordContext(context, 'ai_request')

      console.log(`AI响应完成，耗时: ${Date.now() - startTime}ms`)
      return response

    } catch (error) {
      console.error('AI请求处理失败:', error)
      throw error
    }
  }

  // 实际的AI请求处理
  private async processRequest(prompt: string, context?: RequestContext): Promise<AIResponse> {
    // 这里应该调用实际的AI服务
    // 可以是OpenAI API、本地模型等

    // 模拟AI响应延迟
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200))

    return {
      content: "这是优化后的AI响应",
      role: "advisor",
      timestamp: Date.now(),
      processingTime: Date.now()
    }
  }

  // 定期清理缓存
  startPeriodicCleanup(): void {
    setInterval(() => {
      this.responseCache.cleanup()
    }, 60000) // 每分钟清理一次
  }
}

// 导出单例
export const aiOptimizer = new SmartRouter()

// 自动启动定期清理
if (typeof window === 'undefined') { // 只在服务端运行
  aiOptimizer.startPeriodicCleanup()
}

export {
  AIResponseCache,
  RequestBatcher,
  PredictiveLoader,
  SmartRouter
}