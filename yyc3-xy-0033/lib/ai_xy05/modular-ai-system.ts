"use client"

/**
 * @file YYC³ 模块化AI系统
 * @description 支持插拔式AI模块、动态加载、协同工作
 * @module lib/ai
 * @author YYC³
 * @version 1.0.0
 * @created 2025-12-28
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

import logger from '@/lib/logger'

export interface AIModule {
  id: string
  name: string
  version: string
  description: string
  category: 'core' | 'extension' | 'experiment'
  capabilities: string[]
  dependencies: string[]
  isEnabled: boolean
  config: Record<string, unknown>
  instance?: AIModuleInstance
}

export interface AIRequest {
  input: string
  context?: Record<string, unknown>
  modules?: string[]
  priority?: 'low' | 'normal' | 'high'
  metadata?: Record<string, unknown>
}

export interface AIResponse {
  output: string
  confidence: number
  modules: string[]
  processingTime: number
  metadata: Record<string, unknown>
}

interface AIModuleInstance {
  process: (input: unknown) => Promise<unknown>
  dispose?: () => void
  [key: string]: unknown
}

/**
 * 模块化AI管理器
 */
export class ModularAIManager {
  private modules: Map<string, AIModule> = new Map()
  private processingQueue: AIRequest[] = []
  private isProcessing = false
  private eventListeners: Map<string, Function[]> = new Map()

  constructor() {
    this.loadCoreModules()
  }

  /**
   * 加载核心AI模块
   */
  private loadCoreModules() {
    // 注册核心AI模块
    this.registerModule({
      id: 'conversation',
      name: '对话模块',
      version: '1.0.0',
      description: '基础对话交互功能',
      category: 'core',
      capabilities: ['text-generation', 'conversation', 'context-memory'],
      dependencies: [],
      isEnabled: true,
      config: {
        maxTokens: 1000,
        temperature: 0.7,
        model: 'gpt-4o-mini'
      }
    })

    this.registerModule({
      id: 'emotion-analysis',
      name: '情感分析模块',
      version: '1.0.0',
      description: '多模态情感识别与分析',
      category: 'core',
      capabilities: ['emotion-detection', 'sentiment-analysis', 'mood-tracking'],
      dependencies: [],
      isEnabled: true,
      config: {
        confidence: 0.8,
        languages: ['zh-CN', 'en-US']
      }
    })

    this.registerModule({
      id: 'learning-guidance',
      name: '学习指导模块',
      version: '1.0.0',
      description: '个性化学习建议与指导',
      category: 'core',
      capabilities: ['learning-analysis', 'recommendation', 'progress-tracking'],
      dependencies: ['conversation'],
      isEnabled: true,
      config: {
        ageGroups: ['0-3', '3-6', '6-9', '9-12', '12-15', '15-18', '18-22'],
        subjects: ['language', 'math', 'science', 'art', 'music']
      }
    })

    this.registerModule({
      id: 'growth-tracking',
      name: '成长追踪模块',
      version: '1.0.0',
      description: '儿童发展里程碑追踪与评估',
      category: 'core',
      capabilities: ['milestone-tracking', 'development-assessment', 'growth-prediction'],
      dependencies: ['emotion-analysis'],
      isEnabled: true,
      config: {
        trackingFrequency: 'weekly',
        assessmentTypes: ['cognitive', 'physical', 'social', 'emotional']
      }
    })

    this.registerModule({
      id: 'voice-interaction',
      name: '语音交互模块',
      version: '1.0.0',
      description: '语音识别、合成与交互',
      category: 'core',
      capabilities: ['speech-recognition', 'text-to-speech', 'voice-emotion'],
      dependencies: [],
      isEnabled: true,
      config: {
        language: 'zh-CN',
        voiceSpeed: 1.0,
        emotionEnabled: true
      }
    })

    logger.info(`已加载 ${this.modules.size} 个核心模块`, { moduleCount: this.modules.size }, 'ModularAIManager')
  }

  /**
   * 注册AI模块
   */
  registerModule(module: AIModule): boolean {
    try {
      // 检查依赖
      for (const dependency of module.dependencies) {
        if (!this.modules.has(dependency)) {
          logger.error(`模块 ${module.id} 缺少依赖: ${dependency}`, { moduleId: module.id, dependency }, 'ModularAIManager')
          return false
        }
      }

      // 检查版本兼容性
      this.validateModule(module)

      // 实例化模块
      module.instance = this.createModuleInstance(module)

      this.modules.set(module.id, module)
      this.emit('moduleRegistered', module)

      logger.info(`模块注册成功: ${module.name} v${module.version}`, { moduleId: module.id, name: module.name, version: module.version }, 'ModularAIManager')
      return true

    } catch (error) {
      logger.error(`模块注册失败 ${module.id}`, { moduleId: module.id, error }, 'ModularAIManager')
      return false
    }
  }

  /**
   * 卸载AI模块
   */
  unregisterModule(moduleId: string): boolean {
    const module = this.modules.get(moduleId)
    if (!module) return false

    // 检查是否有其他模块依赖此模块
    for (const [, mod] of this.modules) {
      if (mod.dependencies.includes(moduleId) && mod.isEnabled) {
        logger.error(`模块 ${moduleId} 被其他模块依赖，无法卸载`, { moduleId }, 'ModularAIManager')
        return false
      }
    }

    // 清理模块实例
    if (module.instance && typeof module.instance.dispose === 'function') {
      module.instance.dispose()
    }

    this.modules.delete(moduleId)
    this.emit('moduleUnregistered', { moduleId })

    logger.info(`模块卸载成功: ${moduleId}`, { moduleId }, 'ModularAIManager')
    return true
  }

  /**
   * 启用/禁用模块
   */
  toggleModule(moduleId: string, enabled?: boolean): boolean {
    const module = this.modules.get(moduleId)
    if (!module) return false

    const newState = enabled !== undefined ? enabled : !module.isEnabled

    if (newState && !this.checkDependencies(moduleId)) {
      return false
    }

    module.isEnabled = newState
    this.emit('moduleToggled', { moduleId, enabled: newState })

    logger.info(`模块 ${moduleId} ${newState ? '已启用' : '已禁用'}`, { moduleId, enabled: newState }, 'ModularAIManager')
    return true
  }

  /**
   * 处理AI请求
   */
  async processRequest(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now()

    try {
      // 确定需要使用的模块
      const modulesToUse = this.selectModules(request)

      if (modulesToUse.length === 0) {
        throw new Error('没有可用的AI模块处理此请求')
      }

      // 创建处理管道
      const pipeline = this.createPipeline(modulesToUse)

      // 执行处理管道
      let result = {
        output: request.input,
        confidence: 1.0,
        modules: [],
        metadata: {}
      }

      for (const module of pipeline) {
        const moduleResult = await this.executeModule(module, {
          input: result.output,
          context: { ...request.context, previousResults: result },
          config: module.config
        })

        result = {
          ...result,
          ...moduleResult,
          modules: [...result.modules, module.id]
        }
      }

      const processingTime = Date.now() - startTime

      const response: AIResponse = {
        output: result.output,
        confidence: result.confidence,
        modules: result.modules,
        processingTime,
        metadata: {
          ...result.metadata,
          requestPriority: request.priority || 'normal',
          timestamp: new Date().toISOString()
        }
      }

      this.emit('requestProcessed', response)
      return response

    } catch (error) {
      logger.error('请求处理失败', { error }, 'ModularAIManager')

      const response: AIResponse = {
        output: '抱歉，我暂时无法处理您的请求，请稍后再试。',
        confidence: 0,
        modules: [],
        processingTime: Date.now() - startTime,
        metadata: {
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        }
      }

      this.emit('requestError', { request, error })
      return response
    }
  }

  /**
   * 选择适用的模块
   */
  private selectModules(request: AIRequest): AIModule[] {
    const selectedModules: AIModule[] = []

    // 如果指定了特定模块
    if (request.modules && request.modules.length > 0) {
      for (const moduleId of request.modules) {
        const module = this.modules.get(moduleId)
        if (module && module.isEnabled) {
          selectedModules.push(module)
        }
      }
      return selectedModules
    }

    // 基于请求内容自动选择模块
    for (const [, module] of this.modules) {
      if (!module.isEnabled) continue

      if (this.shouldUseModule(module, request)) {
        selectedModules.push(module)
      }
    }

    return this.sortModulesByPriority(selectedModules)
  }

  /**
   * 判断是否应该使用某个模块
   */
  private shouldUseModule(module: AIModule, request: AIRequest): boolean {
    const input = request.input.toLowerCase()

    // 情感分析模块
    if (module.id === 'emotion-analysis') {
      const emotionKeywords = ['心情', '感觉', '情绪', '高兴', '难过', '生气', '害怕']
      return emotionKeywords.some(keyword => input.includes(keyword))
    }

    // 学习指导模块
    if (module.id === 'learning-guidance') {
      const learningKeywords = ['学习', '作业', '课程', '考试', '成绩', '教育']
      return learningKeywords.some(keyword => input.includes(keyword))
    }

    // 成长追踪模块
    if (module.id === 'growth-tracking') {
      const growthKeywords = ['成长', '发育', '里程碑', '发展', '进步', '能力']
      return growthKeywords.some(keyword => input.includes(keyword))
    }

    // 语音交互模块
    if (module.id === 'voice-interaction') {
      return request.metadata?.isVoiceRequest === true
    }

    // 对话模块（默认使用）
    if (module.id === 'conversation') {
      return true
    }

    return false
  }

  /**
   * 创建处理管道
   */
  private createPipeline(modules: AIModule[]): AIModule[] {
    // 定义模块处理顺序
    const priorityOrder = ['emotion-analysis', 'voice-interaction', 'learning-guidance', 'growth-tracking', 'conversation']

    const pipeline: AIModule[] = []

    // 按优先级排序
    for (const moduleId of priorityOrder) {
      const module = modules.find(m => m.id === moduleId)
      if (module) {
        pipeline.push(module)
      }
    }

    // 添加其他模块
    for (const module of modules) {
      if (!priorityOrder.includes(module.id)) {
        pipeline.push(module)
      }
    }

    return pipeline
  }

  /**
   * 执行模块
   */
  private async executeModule(module: AIModule, input: unknown): Promise<unknown> {
    if (!module.instance) {
      throw new Error(`模块 ${module.id} 未正确初始化`)
    }

    try {
      return await module.instance.process(input)
    } catch (error) {
      logger.error(`模块执行失败 ${module.id}`, { moduleId: module.id, error }, 'ModularAIManager')
      throw error
    }
  }

  /**
   * 创建模块实例
   */
  private createModuleInstance(module: AIModule): AIModuleInstance {
    switch (module.id) {
      case 'conversation':
        return new ConversationModule(module.config)
      case 'emotion-analysis':
        return new EmotionAnalysisModule(module.config)
      case 'learning-guidance':
        return new LearningGuidanceModule(module.config)
      case 'growth-tracking':
        return new GrowthTrackingModule(module.config)
      case 'voice-interaction':
        return new VoiceInteractionModule(module.config)
      default:
        return new BaseModule(module.config)
    }
  }

  /**
   * 验证模块
   */
  private validateModule(module: AIModule): void {
    if (!module.id || !module.name || !module.version) {
      throw new Error('模块缺少必要信息')
    }

    if (this.modules.has(module.id)) {
      throw new Error(`模块 ${module.id} 已存在`)
    }
  }

  /**
   * 检查依赖
   */
  private checkDependencies(moduleId: string): boolean {
    const module = this.modules.get(moduleId)
    if (!module) return false

    for (const dependency of module.dependencies) {
      const depModule = this.modules.get(dependency)
      if (!depModule || !depModule.isEnabled) {
        logger.error(`依赖模块 ${dependency} 不可用`, { moduleId, dependency }, 'ModularAIManager')
        return false
      }
    }

    return true
  }

  /**
   * 模块优先级排序
   */
  private sortModulesByPriority(modules: AIModule[]): AIModule[] {
    const priorityMap = {
      'emotion-analysis': 1,
      'voice-interaction': 2,
      'learning-guidance': 3,
      'growth-tracking': 4,
      'conversation': 5
    }

    return modules.sort((a, b) => {
      const priorityA = priorityMap[a.id as keyof typeof priorityMap] || 999
      const priorityB = priorityMap[b.id as keyof typeof priorityMap] || 999
      return priorityA - priorityB
    })
  }

  /**
   * 获取模块信息
   */
  getModules(): AIModule[] {
    return Array.from(this.modules.values())
  }

  getModule(moduleId: string): AIModule | undefined {
    return this.modules.get(moduleId)
  }

  /**
   * 获取系统状态
   */
  getSystemStatus() {
    const totalModules = this.modules.size
    const enabledModules = Array.from(this.modules.values()).filter(m => m.isEnabled).length
    const coreModules = Array.from(this.modules.values()).filter(m => m.category === 'core').length
    const extensionModules = Array.from(this.modules.values()).filter(m => m.category === 'extension').length

    return {
      totalModules,
      enabledModules,
      coreModules,
      extensionModules,
      processingQueueLength: this.processingQueue.length,
      isProcessing: this.isProcessing,
      uptime: Date.now()
    }
  }

  /**
   * 事件系统
   */
  on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, [])
    }
    this.eventListeners.get(event)!.push(callback)
  }

  off(event: string, callback: Function): void {
    if (this.eventListeners.has(event)) {
      const callbacks = this.eventListeners.get(event)!
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  private emit(event: string, data?: unknown): void {
    if (this.eventListeners.has(event)) {
      this.eventListeners.get(event)!.forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          logger.error(`事件处理错误 [${event}]`, { event, error }, 'ModularAIManager')
        }
      })
    }
  }
}

/**
 * 基础模块类
 */
class BaseModule {
  constructor(protected config: Record<string, unknown>) {}

  async process(input: unknown): Promise<unknown> {
    return {
      output: input,
      confidence: 0.5,
      metadata: {}
    }
  }

  dispose(): void {
    // 清理资源
  }
}

/**
 * 对话模块
 */
class ConversationModule extends BaseModule {
  async process(input: unknown): Promise<unknown> {
    // 这里应该调用真实的AI对话API
    const responses = [
      "我是AI小语，很高兴为您服务！有什么我可以帮助您的吗？",
      "我理解您的需求，让我为您提供一些建议。",
      "根据我的分析，我认为您可以考虑以下几个方面。"
    ]

    const response = responses[Math.floor(Math.random() * responses.length)]

    return {
      output: response,
      confidence: 0.8,
      metadata: {
        model: this.config.model || 'gpt-4o-mini',
        tokens: Math.floor(Math.random() * 100) + 50
      }
    }
  }
}

/**
 * 情感分析模块
 */
class EmotionAnalysisModule extends BaseModule {
  async process(input: unknown): Promise<unknown> {
    const text = input.input.toLowerCase()

    // 简单的情感分析
    const positiveWords = ['开心', '高兴', '快乐', '好', '棒', '优秀', '喜欢']
    const negativeWords = ['难过', '伤心', '生气', '害怕', '不好', '糟糕', '讨厌']

    const positiveScore = positiveWords.filter(word => text.includes(word)).length
    const negativeScore = negativeWords.filter(word => text.includes(word)).length

    let emotion = 'neutral'
    let confidence = 0.5

    if (positiveScore > negativeScore) {
      emotion = 'positive'
      confidence = Math.min(0.9, 0.5 + positiveScore * 0.1)
    } else if (negativeScore > positiveScore) {
      emotion = 'negative'
      confidence = Math.min(0.9, 0.5 + negativeScore * 0.1)
    }

    return {
      output: input.input,
      confidence,
      metadata: {
        emotion,
        sentiment: emotion === 'positive' ? 1 : emotion === 'negative' ? -1 : 0,
        analysis: '情感分析结果'
      }
    }
  }
}

/**
 * 学习指导模块
 */
class LearningGuidanceModule extends BaseModule {
  async process(input: unknown): Promise<unknown> {
    const guidance = [
      "建议您制定一个详细的学习计划，每天坚持学习30分钟。",
      "学习时要注意劳逸结合，适当休息可以提高学习效率。",
      "遇到困难时不要灰心，可以寻求老师或同学的帮助。"
    ]

    return {
      output: String(input) + '\n\n' + guidance[Math.floor(Math.random() * guidance.length)],
      confidence: 0.75,
      metadata: {
        category: 'learning',
        ageGroup: (this.config.ageGroups as string[] | undefined)?.[0] || '6-9',
        subject: 'general'
      }
    }
  }
}

/**
 * 成长追踪模块
 */
class GrowthTrackingModule extends BaseModule {
  async process(input: unknown): Promise<unknown> {
    return {
      output: String(input) + '\n\n我已经记录了您的成长信息，会持续关注您的发展进度。',
      confidence: 0.7,
      metadata: {
        trackingType: 'milestone',
        ageCategory: 'development',
        assessmentDate: new Date().toISOString()
      }
    }
  }
}

/**
 * 语音交互模块
 */
class VoiceInteractionModule extends BaseModule {
  async process(input: unknown): Promise<unknown> {
    return {
      output: String(input),
      confidence: 0.8,
      metadata: {
        isVoiceResponse: true,
        language: (this.config.language as string | undefined) || 'zh-CN',
        voiceSettings: {
          speed: (this.config.voiceSpeed as number | undefined) || 1.0,
          emotion: (this.config.emotionEnabled as boolean | undefined) || false
        }
      }
    }
  }
}

// 导出单例实例
export const modularAIManager = new ModularAIManager()