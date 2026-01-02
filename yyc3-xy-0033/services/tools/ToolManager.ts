/**
 * YYC³ 智能预测系统 - 工具管理器
 * 统一管理工具注册、发现、执行和编排
 */

import { ToolRegistry } from './ToolRegistry'
import { ToolOrchestrator } from './ToolOrchestrator'
import { EventEmitter } from 'events'
import type {
  ToolDefinition,
  ToolExecutionRequest,
  ToolExecutionResult,
  ToolOrchestrationRequest,
  ToolOrchestrationPlan,
  ToolRegistryConfig
} from '@/types/tools/common'
import { ToolStatus } from '@/types/tools/common'

/**
 * 工具管理器
 * 提供工具系统的统一接口
 */
export class ToolManager extends EventEmitter {
  private toolRegistry: ToolRegistry
  private toolOrchestrator: ToolOrchestrator
  private builtinTools: ToolDefinition[] = []
  private isInitialized = false

  constructor(config: ToolRegistryConfig = {}) {
    super()
    this.toolRegistry = new ToolRegistry(config)
    this.toolOrchestrator = new ToolOrchestrator(this.toolRegistry)

    this.setupEventHandlers()
  }

  /**
   * 初始化工具管理器
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return

    try {
      console.log('🔧 初始化工具管理器...')

      // 注册内置工具
      await this.registerBuiltinTools()

      // 启动工具编排器
      this.toolOrchestrator.start()

      // 执行初始健康检查
      await this.toolRegistry.performHealthCheck()

      this.isInitialized = true
      console.log('✅ 工具管理器初始化完成')
      this.emit('initialized')

    } catch (error) {
      console.error('❌ 工具管理器初始化失败:', error)
      this.emit('initializationError', error)
      throw error
    }
  }

  /**
   * 注册工具
   */
  async registerTool(toolDefinition: ToolDefinition): Promise<boolean> {
    if (!this.isInitialized) {
      throw new Error('工具管理器未初始化')
    }

    return await this.toolRegistry.registerTool(toolDefinition)
  }

  /**
   * 注销工具
   */
  async unregisterTool(toolName: string): Promise<boolean> {
    if (!this.isInitialized) {
      throw new Error('工具管理器未初始化')
    }

    return await this.toolRegistry.unregisterTool(toolName)
  }

  /**
   * 执行单个工具
   */
  async executeTool(request: ToolExecutionRequest): Promise<ToolExecutionResult> {
    if (!this.isInitialized) {
      throw new Error('工具管理器未初始化')
    }

    return await this.toolRegistry.executeTool(request)
  }

  /**
   * 执行编排计划
   */
  async executeOrchestration(
    request: ToolOrchestrationRequest,
    userId: string,
    sessionId?: string
  ): Promise<string> {
    if (!this.isInitialized) {
      throw new Error('工具管理器未初始化')
    }

    // 生成执行计划
    const plan = await this.toolRegistry.orchestrateTools(request)

    // 执行计划
    return await this.toolOrchestrator.executePlan(plan, userId, sessionId)
  }

  /**
   * 搜索工具
   */
  async searchTools(query: {
    text?: string
    capabilities?: string[]
    category?: string
    tags?: string[]
    semantic?: boolean
  }): Promise<ToolDefinition[]> {
    if (!this.isInitialized) {
      throw new Error('工具管理器未初始化')
    }

    return await this.toolRegistry.searchTools(query)
  }

  /**
   * 获取工具列表
   */
  getTools(): ToolDefinition[] {
    if (!this.isInitialized) {
      throw new Error('工具管理器未初始化')
    }

    return this.toolRegistry.getAllTools()
  }

  /**
   * 获取工具详情
   */
  getTool(toolName: string): ToolDefinition | undefined {
    if (!this.isInitialized) {
      throw new Error('工具管理器未初始化')
    }

    const tools = this.toolRegistry.getAllTools()
    return tools.find(tool => tool.name === toolName)
  }

  /**
   * 获取工具状态
   */
  getToolStatus(toolName: string): ToolStatus | undefined {
    if (!this.isInitialized) {
      throw new Error('工具管理器未初始化')
    }

    return this.toolRegistry.getToolStatus(toolName)
  }

  /**
   * 获取工具分类
   */
  getToolCategories(): string[] {
    if (!this.isInitialized) {
      throw new Error('工具管理器未初始化')
    }

    return this.toolRegistry.getToolCategories()
  }

  /**
   * 获取所有能力
   */
  getAllCapabilities(): string[] {
    if (!this.isInitialized) {
      throw new Error('工具管理器未初始化')
    }

    return this.toolRegistry.getAllCapabilities()
  }

  /**
   * 执行健康检查
   */
  async performHealthCheck(): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('工具管理器未初始化')
    }

    await this.toolRegistry.performHealthCheck()
  }

  /**
   * 获取系统统计
   */
  getSystemStatistics() {
    if (!this.isInitialized) {
      throw new Error('工具管理器未初始化')
    }

    const registryStats = this.toolRegistry.getStatistics()
    const orchestratorStats = this.toolOrchestrator.getPerformanceStats()

    return {
      registry: registryStats,
      orchestrator: orchestratorStats,
      builtin: this.builtinTools.length,
      total: registryStats.totalTools,
      system: {
        initialized: this.isInitialized,
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        timestamp: new Date()
      }
    }
  }

  /**
   * 智能工具推荐
   */
  async recommendTools(
    goal: string,
    context?: Record<string, any>
  ): Promise<{
    primary: ToolDefinition[]
    secondary: ToolDefinition[]
    alternative: ToolDefinition[]
  }> {
    if (!this.isInitialized) {
      throw new Error('工具管理器未初始化')
    }

    // 搜索相关工具
    const allTools = await this.searchTools({
      text: goal,
      semantic: true
    })

    // 根据相关性和质量分数分类
    const sorted = allTools.sort((a, b) => {
      const scoreA = this.calculateRelevanceScore(a, goal, context)
      const scoreB = this.calculateRelevanceScore(b, goal, context)
      return scoreB - scoreA
    })

    // 分为三个等级
    const primary = sorted.slice(0, Math.min(3, sorted.length))
    const secondary = sorted.slice(3, Math.min(8, sorted.length))
    const alternative = sorted.slice(8)

    return { primary, secondary, alternative }
  }

  /**
   * 批量注册工具
   */
  async registerTools(tools: ToolDefinition[]): Promise<{
    successful: string[]
    failed: Array<{ name: string; error: string }>
  }> {
    if (!this.isInitialized) {
      throw new Error('工具管理器未初始化')
    }

    const successful: string[] = []
    const failed: Array<{ name: string; error: string }> = []

    for (const tool of tools) {
      try {
        const result = await this.registerTool(tool)
        if (result) {
          successful.push(tool.name)
        } else {
          failed.push({ name: tool.name, error: '注册失败' })
        }
      } catch (error) {
        failed.push({
          name: tool.name,
          error: error instanceof Error ? error.message : String(error)
        })
      }
    }

    return { successful, failed }
  }

  /**
   * 更新工具
   */
  async updateTool(toolName: string, updates: Partial<ToolDefinition>): Promise<boolean> {
    if (!this.isInitialized) {
      throw new Error('工具管理器未初始化')
    }

    try {
      // 先注销旧工具
      await this.unregisterTool(toolName)

      // 合并更新
      const existingTool = this.getTool(toolName)
      if (!existingTool) {
        throw new Error(`工具 "${toolName}" 不存在`)
      }

      const updatedTool = {
        ...existingTool,
        ...updates,
        name: toolName, // 保持名称不变
        updatedAt: new Date()
      }

      // 重新注册
      return await this.registerTool(updatedTool)

    } catch (error) {
      this.emit('toolUpdateError', { toolName, error })
      return false
    }
  }

  /**
   * 关闭工具管理器
   */
  async shutdown(): Promise<void> {
    if (!this.isInitialized) return

    console.log('🛑 关闭工具管理器...')

    try {
      // 停止编排器
      await this.toolOrchestrator.stop()

      // 清理资源
      this.activeExecutions.clear()
      this.isInitialized = false

      console.log('✅ 工具管理器已关闭')
      this.emit('shutdown')

    } catch (error) {
      console.error('❌ 关闭工具管理器时出错:', error)
      throw error
    }
  }

  // 私有方法实现
  private setupEventHandlers(): void {
    // 转发注册表事件
    this.toolRegistry.on('toolRegistered', (event) => {
      this.emit('toolRegistered', event)
    })

    this.toolRegistry.on('toolUnregistered', (event) => {
      this.emit('toolUnregistered', event)
    })

    this.toolRegistry.on('toolExecutionStarted', (event) => {
      this.emit('toolExecutionStarted', event)
    })

    this.toolRegistry.on('toolExecutionCompleted', (event) => {
      this.emit('toolExecutionCompleted', event)
    })

    this.toolRegistry.on('toolExecutionError', (event) => {
      this.emit('toolExecutionError', event)
    })

    // 转发编排器事件
    this.toolOrchestrator.on('executionQueued', (event) => {
      this.emit('orchestrationQueued', event)
    })

    this.toolOrchestrator.on('executionCompleted', (event) => {
      this.emit('orchestrationCompleted', event)
    })

    this.toolOrchestrator.on('executionError', (event) => {
      this.emit('orchestrationError', event)
    })
  }

  private async registerBuiltinTools(): Promise<void> {
    // 注册内置工具
    const builtinTools = this.createBuiltinTools()

    for (const tool of builtinTools) {
      try {
        await this.registerTool(tool)
        this.builtinTools.push(tool)
      } catch (error) {
        console.warn(`⚠️ 内置工具 "${tool.name}" 注册失败:`, error)
      }
    }
  }

  private createBuiltinTools(): ToolDefinition[] {
    return [
      // 文本处理工具
      {
        name: 'text-processor',
        displayName: '文本处理器',
        description: '处理和分析文本内容',
        version: '1.0.0',
        category: 'text',
        tags: ['text', 'nlp', 'processing'],
        entryPoint: './tools/text-processor',
        capabilities: [
          {
            name: 'process_text',
            description: '处理文本内容',
            parameters: [
              {
                name: 'text',
                type: 'string',
                required: true,
                description: '要处理的文本'
              },
              {
                name: 'operation',
                type: 'string',
                required: true,
                description: '处理操作类型',
                enum: ['summarize', 'analyze', 'translate', 'extract']
              }
            ],
            returnType: 'object'
          }
        ],
        status: ToolStatus.READY,
        registeredAt: new Date()
      },

      // 数据分析工具
      {
        name: 'data-analyzer',
        displayName: '数据分析器',
        description: '分析数据和生成洞察',
        version: '1.0.0',
        category: 'analysis',
        tags: ['data', 'analytics', 'statistics'],
        entryPoint: './tools/data-analyzer',
        capabilities: [
          {
            name: 'analyze_data',
            description: '分析数据集',
            parameters: [
              {
                name: 'data',
                type: 'array',
                required: true,
                description: '要分析的数据'
              },
              {
                name: 'analysis_type',
                type: 'string',
                required: true,
                description: '分析类型',
                enum: ['statistical', 'trend', 'correlation', 'prediction']
              }
            ],
            returnType: 'object'
          }
        ],
        status: ToolStatus.READY,
        registeredAt: new Date()
      },

      // 预测工具
      {
        name: 'prediction-engine',
        displayName: '预测引擎',
        description: '执行各种预测任务',
        version: '1.0.0',
        category: 'prediction',
        tags: ['prediction', 'forecasting', 'ml'],
        entryPoint: './tools/prediction-engine',
        capabilities: [
          {
            name: 'predict',
            description: '执行预测',
            parameters: [
              {
                name: 'data',
                type: 'array',
                required: true,
                description: '预测数据'
              },
              {
                name: 'model',
                type: 'string',
                required: true,
                description: '预测模型'
              },
              {
                name: 'horizon',
                type: 'number',
                required: false,
                description: '预测时间范围',
                defaultValue: 1
              }
            ],
            returnType: 'object'
          }
        ],
        status: ToolStatus.READY,
        registeredAt: new Date()
      },

      // 通信工具
      {
        name: 'communication',
        displayName: '通信工具',
        description: '处理外部通信和通知',
        version: '1.0.0',
        category: 'communication',
        tags: ['notification', 'email', 'webhook'],
        entryPoint: './tools/communication',
        capabilities: [
          {
            name: 'send_notification',
            description: '发送通知',
            parameters: [
              {
                name: 'recipient',
                type: 'string',
                required: true,
                description: '接收者'
              },
              {
                name: 'message',
                type: 'string',
                required: true,
                description: '通知内容'
              },
              {
                name: 'channel',
                type: 'string',
                required: true,
                description: '通知渠道',
                enum: ['email', 'sms', 'webhook', 'push']
              }
            ],
            returnType: 'boolean'
          }
        ],
        status: ToolStatus.READY,
        registeredAt: new Date()
      }
    ]
  }

  private calculateRelevanceScore(
    tool: ToolDefinition,
    goal: string,
    context?: Record<string, any>
  ): number {
    let score = 0

    // 基础相关性分数
    const goalLower = goal.toLowerCase()
    const searchText = `${tool.name} ${tool.description} ${tool.tags?.join(' ')}`.toLowerCase()
    const textMatch = searchText.includes(goalLower)
    score += textMatch ? 40 : 0

    // 能力匹配
    if (tool.capabilities) {
      const capabilityMatch = tool.capabilities.some(cap =>
        cap.name.toLowerCase().includes(goalLower) ||
        cap.description.toLowerCase().includes(goalLower)
      )
      score += capabilityMatch ? 30 : 0
    }

    // 质量分数
    const metrics = this.toolRegistry.getToolMetrics(tool.name)
    if (metrics) {
      score += metrics.qualityScore * 20
    }

    // 使用频率
    if (metrics && metrics.executionCount > 0) {
      score += Math.min(metrics.executionCount / 10, 10)
    }

    return score
  }
}