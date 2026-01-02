"use client"

import { AIRole, AI_ROLES, ChildContext, selectRoleByContext, analyzeQueryComplexity, getCoordinatedPrompt } from "@/lib/ai_roles"

/**
 * 角色协同状态
 */
interface RoleCoordinationState {
  activeRoles: Set<AIRole>
  primaryRole: AIRole
  supportingRoles: AIRole[]
  coordinationMode: 'single' | 'dual' | 'multi'
  lastCoordination: number
}

/**
 * 协同响应结果
 */
interface CoordinatedResponse {
  primaryRole: AIRole
  primaryResponse: string
  supportingInsights: Array<{
    role: AIRole
    insight: string
    confidence: number
    priority: 'high' | 'medium' | 'low'
  }>
  suggestedActions: string[]
  coordinationSummary: string
  confidence: number
  processingTime: number
}

/**
 * 角色权重配置
 */
interface RoleWeightConfig {
  role: AIRole
  weight: number
  expertise: string[]
  collaborationPreferences: AIRole[]
  synergies: {
    role: AIRole
    boost: number
    description: string
  }[]
}

/**
 * AI角色协同管理器
 * 负责协调多个AI角色，实现智能角色切换和协同工作
 */
export class RoleCoordinator {
  private state: RoleCoordinationState
  private roleWeights: Map<AIRole, RoleWeightConfig>
  private coordinationHistory: Array<{
    timestamp: number
    query: string
    roles: AIRole[]
    response: CoordinatedResponse
    effectiveness: number
  }>
  private contextMemory: Map<string, any>

  constructor() {
    this.state = {
      activeRoles: new Set(['advisor']),
      primaryRole: 'advisor',
      supportingRoles: [],
      coordinationMode: 'single',
      lastCoordination: Date.now()
    }

    this.coordinationHistory = []
    this.contextMemory = new Map()
    this.initializeRoleWeights()
  }

  /**
   * 初始化角色权重配置
   */
  private initializeRoleWeights() {
    this.roleWeights = new Map([
      ['recorder', {
        role: 'recorder',
        weight: 1.0,
        expertise: ['记录', '拍照', '保存', '里程碑', '回忆', '照片', '视频', '时刻', '瞬间'],
        collaborationPreferences: ['listener', 'guardian'],
        synergies: [
          { role: 'listener', boost: 1.2, description: '记录者与聆听者协同，更好地理解记录的情感意义' },
          { role: 'guardian', boost: 1.1, description: '记录者与守护者协同，确保记录符合发展标准' }
        ]
      }],
      ['guardian', {
        role: 'guardian',
        weight: 1.0,
        expertise: ['健康', '安全', '发展', '标准', '正常吗', '评估', '规则', '边界', '睡眠', '饮食'],
        collaborationPreferences: ['advisor', 'listener'],
        synergies: [
          { role: 'advisor', boost: 1.3, description: '守护者与建议者协同，提供科学的行动建议' },
          { role: 'listener', boost: 1.2, description: '守护者与聆听者协同，理解行为背后的需求' }
        ]
      }],
      ['listener', {
        role: 'listener',
        weight: 1.0,
        expertise: ['心情', '感觉', '情绪', '发脾气', '哭闹', '不听话', '沟通', '理解', '为什么'],
        collaborationPreferences: ['guardian', 'cultural'],
        synergies: [
          { role: 'guardian', boost: 1.1, description: '聆听者与守护者协同，区分正常行为与发展问题' },
          { role: 'cultural', boost: 1.1, description: '聆听者与国粹导师协同，理解文化背景下的行为' }
        ]
      }],
      ['advisor', {
        role: 'advisor',
        weight: 1.0,
        expertise: ['学习', '课程', '兴趣班', '规划', '建议', '选择', '怎么办', '应该', '推荐'],
        collaborationPreferences: ['guardian', 'cultural'],
        synergies: [
          { role: 'guardian', boost: 1.2, description: '建议者与守护者协同，确保建议符合发展阶段' },
          { role: 'cultural', boost: 1.1, description: '建议者与国粹导师协同，融合传统文化元素' }
        ]
      }],
      ['cultural', {
        role: 'cultural',
        weight: 1.0,
        expertise: ['古诗', '诗词', '文化', '国学', '传统', '节日', '礼仪', '故事', '成语', '典故'],
        collaborationPreferences: ['advisor', 'listener'],
        synergies: [
          { role: 'advisor', boost: 1.1, description: '国粹导师与建议者协同，传统文化融入现代教育' },
          { role: 'listener', boost: 1.1, description: '国粹导师与聆听者协同，理解文化背景下的情感' }
        ]
      }]
    ])
  }

  /**
   * 分析查询并确定最佳角色组合
   */
  public analyzeAndCoordinateRoles(
    query: string,
    childContext?: ChildContext
  ): CoordinatedResponse {
    const startTime = Date.now()

    // 1. 分析查询复杂度
    const { complexity, involvedRoles } = analyzeQueryComplexity(query)

    // 2. 更新角色激活状态
    this.updateRoleActivation(involvedRoles, query)

    // 3. 确定协同模式
    const coordinationMode = this.determineCoordinationMode(complexity, involvedRoles)

    // 4. 选择主角色和支持角色
    const { primaryRole, supportingRoles } = this.selectOptimalRoleCombination(
      involvedRoles,
      query,
      coordinationMode
    )

    // 5. 生成协同响应
    const response = this.generateCoordinatedResponse(
      primaryRole,
      supportingRoles,
      query,
      childContext
    )

    // 6. 更新状态和历史
    this.updateCoordinationState(primaryRole, supportingRoles, coordinationMode)
    this.recordCoordination(query, [primaryRole, ...supportingRoles], response)

    response.processingTime = Date.now() - startTime
    return response
  }

  /**
   * 更新角色激活状态
   */
  private updateRoleActivation(involvedRoles: AIRole[], query: string) {
    // 基于查询内容更新角色权重
    for (const [role, config] of this.roleWeights) {
      const relevanceScore = this.calculateRoleRelevance(role, query)
      const activated = relevanceScore > 0.3 || involvedRoles.includes(role)

      if (activated) {
        this.state.activeRoles.add(role)
      } else {
        this.state.activeRoles.delete(role)
      }
    }
  }

  /**
   * 计算角色相关性
   */
  private calculateRoleRelevance(role: AIRole, query: string): number {
    const config = this.roleWeights.get(role)
    if (!config) return 0

    const lowerQuery = query.toLowerCase()
    let score = 0

    // 基于专业词汇计算基础分数
    for (const keyword of config.expertise) {
      if (lowerQuery.includes(keyword)) {
        score += 0.2
      }
    }

    // 考虑协同效应
    for (const activeRole of this.state.activeRoles) {
      if (activeRole !== role) {
        const synergy = config.synergies.find(s => s.role === activeRole)
        if (synergy) {
          score += synergy.boost * 0.1
        }
      }
    }

    return Math.min(score, 1.0)
  }

  /**
   * 确定协同模式
   */
  private determineCoordinationMode(
    complexity: 'simple' | 'medium' | 'complex',
    involvedRoles: AIRole[]
  ): 'single' | 'dual' | 'multi' {
    if (complexity === 'simple' || involvedRoles.length <= 1) {
      return 'single'
    } else if (complexity === 'medium' || involvedRoles.length <= 2) {
      return 'dual'
    } else {
      return 'multi'
    }
  }

  /**
   * 选择最优角色组合
   */
  private selectOptimalRoleCombination(
    involvedRoles: AIRole[],
    query: string,
    coordinationMode: 'single' | 'dual' | 'multi'
  ): { primaryRole: AIRole; supportingRoles: AIRole[] } {
    // 计算每个角色的综合得分
    const roleScores = new Map<AIRole, number>()

    for (const role of involvedRoles) {
      const baseScore = this.calculateRoleRelevance(role, query)
      const weight = this.roleWeights.get(role)?.weight || 1.0
      roleScores.set(role, baseScore * weight)
    }

    // 按得分排序
    const sortedRoles = Array.from(roleScores.entries())
      .sort(([, a], [, b]) => b - a)
      .map(([role]) => role)

    if (coordinationMode === 'single') {
      return {
        primaryRole: sortedRoles[0] || 'advisor',
        supportingRoles: []
      }
    } else if (coordinationMode === 'dual') {
      return {
        primaryRole: sortedRoles[0] || 'advisor',
        supportingRoles: sortedRoles.slice(1, 2)
      }
    } else {
      return {
        primaryRole: sortedRoles[0] || 'advisor',
        supportingRoles: sortedRoles.slice(1, 3)
      }
    }
  }

  /**
   * 生成协同响应
   */
  private generateCoordinatedResponse(
    primaryRole: AIRole,
    supportingRoles: AIRole[],
    query: string,
    childContext?: ChildContext
  ): CoordinatedResponse {
    const allRoles = [primaryRole, ...supportingRoles]

    // 生成主响应
    const primaryPrompt = getCoordinatedPrompt(query, allRoles)
    const primaryResponse = this.simulateRoleResponse(primaryRole, primaryPrompt, childContext)

    // 生成支持性见解
    const supportingInsights = supportingRoles.map(role => {
      const insightPrompt = `作为${AI_ROLES[role].name}，针对"${query}"这个问题，从你的专业角度提供关键见解。`
      const insight = this.simulateRoleResponse(role, insightPrompt, childContext)

      return {
        role,
        insight,
        confidence: 0.7 + Math.random() * 0.3,
        priority: this.determineInsightPriority(role, query)
      }
    })

    // 生成建议行动
    const suggestedActions = this.generateSuggestedActions(allRoles, query)

    // 生成协同总结
    const coordinationSummary = this.generateCoordinationSummary(primaryRole, supportingRoles, query)

    // 计算整体置信度
    const confidence = this.calculateCoordinationConfidence(primaryRole, supportingRoles, query)

    return {
      primaryRole,
      primaryResponse,
      supportingInsights,
      suggestedActions,
      coordinationSummary,
      confidence,
      processingTime: 0 // 会在上层方法中设置
    }
  }

  /**
   * 模拟角色响应
   */
  private simulateRoleResponse(role: AIRole, prompt: string, childContext?: ChildContext): string {
    const roleConfig = AI_ROLES[role]

    // 基于角色特征生成响应
    let response = ''

    if (role === 'recorder') {
      response = `作为记录者，我建议将这个重要的时刻详细记录下来。${prompt.includes('记录') ? '这正是记录的好时机！' : '让我们为这个美好的瞬间创建一份珍贵的记忆。'}`
    } else if (role === 'guardian') {
      response = `从守护的角度来看，${prompt.includes('安全') ? '这个问题涉及重要的安全考虑。' : '我建议从发展和健康的角度来分析。'}`
    } else if (role === 'listener') {
      response = `我理解您的感受。${prompt.includes('情绪') ? '情绪没有对错，重要的是理解和接纳。' : '让我们一起深入探讨这个行为背后的需求。'}`
    } else if (role === 'advisor') {
      response = `基于我的专业分析，${prompt.includes('学习') ? '这个年龄段的学习特点需要特别关注。' : '我建议从多个角度来考虑这个问题。'}`
    } else if (role === 'cultural') {
      response = `从传统文化角度来看，${prompt.includes('诗词') ? '这个诗词有着深厚的文化底蕴。' : '我们可以从传统智慧中寻找答案。'}`
    } else {
      response = `我会尽力为您提供专业的建议和指导。`
    }

    return response
  }

  /**
   * 确定见解优先级
   */
  private determineInsightPriority(role: AIRole, query: string): 'high' | 'medium' | 'low' {
    const roleConfig = AI_ROLES[role]
    const lowerQuery = query.toLowerCase()

    // 检查是否匹配主要关键词
    for (const keyword of roleConfig.triggerKeywords) {
      if (lowerQuery.includes(keyword)) {
        return 'high'
      }
    }

    // 基于角色特性判断优先级
    if (role === 'guardian' && (lowerQuery.includes('安全') || lowerQuery.includes('健康'))) {
      return 'high'
    }

    return 'medium'
  }

  /**
   * 生成建议行动
   */
  private generateSuggestedActions(roles: AIRole[], query: string): string[] {
    const actions: string[] = []

    if (roles.includes('recorder')) {
      actions.push('📝 记录这个重要时刻', '📸 拍摄照片或视频')
    }

    if (roles.includes('guardian')) {
      actions.push('🔍 观察并评估发展状况', '📋 建立日常记录表')
    }

    if (roles.includes('listener')) {
      actions.push('💬 坦诚地交流感受', '🤝 给予理解和支持')
    }

    if (roles.includes('advisor')) {
      actions.push('📚 制定具体行动计划', '🎯 设定可达成的小目标')
    }

    if (roles.includes('cultural')) {
      actions.push('📖 结合传统文化元素', '🎨 开展相关的文化活动')
    }

    return actions.slice(0, 4) // 最多返回4个建议
  }

  /**
   * 生成协同总结
   */
  private generateCoordinationSummary(
    primaryRole: AIRole,
    supportingRoles: AIRole[],
    query: string
  ): string {
    const primaryName = AI_ROLES[primaryRole].name
    const supportingNames = supportingRoles.map(role => AI_ROLES[role].name)

    if (supportingRoles.length === 0) {
      return `${primaryName}为主角，从专业角度分析您的问题。`
    } else {
      return `由${primaryName}主导，${supportingNames.join('、')}协同合作，为您提供全面的解决方案。`
    }
  }

  /**
   * 计算协同置信度
   */
  private calculateCoordinationConfidence(
    primaryRole: AIRole,
    supportingRoles: AIRole[],
    query: string
  ): number {
    let confidence = 0.8 // 基础置信度

    // 主角色相关性
    confidence += this.calculateRoleRelevance(primaryRole, query) * 0.3

    // 支持角色的加成
    for (const role of supportingRoles) {
      confidence += this.calculateRoleRelevance(role, query) * 0.1

      // 协同效应加成
      const primaryConfig = this.roleWeights.get(primaryRole)
      const synergy = primaryConfig?.synergies.find(s => s.role === role)
      if (synergy) {
        confidence += synergy.boost * 0.05
      }
    }

    return Math.min(confidence, 0.95)
  }

  /**
   * 更新协同状态
   */
  private updateCoordinationState(
    primaryRole: AIRole,
    supportingRoles: AIRole[],
    coordinationMode: 'single' | 'dual' | 'multi'
  ) {
    this.state.primaryRole = primaryRole
    this.state.supportingRoles = supportingRoles
    this.state.coordinationMode = coordinationMode
    this.state.lastCoordination = Date.now()
  }

  /**
   * 记录协同历史
   */
  private recordCoordination(
    query: string,
    roles: AIRole[],
    response: CoordinatedResponse
  ) {
    // 计算有效性（简化版）
    const effectiveness = response.confidence

    this.coordinationHistory.push({
      timestamp: Date.now(),
      query,
      roles,
      response,
      effectiveness
    })

    // 保持历史记录在合理范围内
    if (this.coordinationHistory.length > 100) {
      this.coordinationHistory.shift()
    }
  }

  /**
   * 获取当前协同状态
   */
  public getCurrentState(): RoleCoordinationState {
    return { ...this.state }
  }

  /**
   * 获取角色协同统计
   */
  public getCoordinationStats() {
    const roleUsage = new Map<AIRole, number>()
    const coordinationPatterns = new Map<string, number>()

    for (const record of this.coordinationHistory) {
      // 统计角色使用频率
      for (const role of record.roles) {
        roleUsage.set(role, (roleUsage.get(role) || 0) + 1)
      }

      // 统计协同模式
      const pattern = `${record.roles[0]}-${record.roles.length > 1 ? 'multi' : 'single'}`
      coordinationPatterns.set(pattern, (coordinationPatterns.get(pattern) || 0) + 1)
    }

    return {
      totalCoordinations: this.coordinationHistory.length,
      averageEffectiveness: this.coordinationHistory.reduce((sum, r) => sum + r.effectiveness, 0) / this.coordinationHistory.length || 0,
      roleUsage: Object.fromEntries(roleUsage),
      coordinationPatterns: Object.fromEntries(coordinationPatterns),
      activeRoles: Array.from(this.state.activeRoles),
      currentPrimaryRole: this.state.primaryRole
    }
  }

  /**
   * 更新上下文记忆
   */
  public updateContext(key: string, value: any) {
    this.contextMemory.set(key, value)
  }

  /**
   * 获取上下文记忆
   */
  public getContext(key: string): any {
    return this.contextMemory.get(key)
  }
}

// 导出单例实例
export const roleCoordinator = new RoleCoordinator()