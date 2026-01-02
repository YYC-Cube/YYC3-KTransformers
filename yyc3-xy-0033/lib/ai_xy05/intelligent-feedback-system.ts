// 智能反馈系统 - 基于交互数据的闭环学习和改进
// Intelligent Feedback System - Closed-loop Learning and Improvement Based on Interaction Data

import { getEnhancedVoiceService, type VoiceInteractionSession } from "./enhanced-voice-services"

/**
 * 语音交互反馈数据
 */
export interface VoiceInteractionData {
  sessionId: string
  transcripts: Array<{
    speaker: string
    text: string
    emotion: string
    timestamp: Date
  }>
  metrics: {
    totalDuration: number
    speakingTime: number
    interactionRatio: number
    transcriptCount: number
    emotionDistribution: Record<string, number>
    keywordDensity: Record<string, number>
  }
  participants: Array<{
    id: string
    role: string
    speakingTime: number
    keywords: string[]
  }>
}

/**
 * 情感响应反馈数据
 */
export interface EmotionResponseData {
  detectedEmotion: string
  emotionIntensity: number
  triggers: string[]
  context: {
    activity: string
    participants: string[]
    duration: number
  }
  responseEffectiveness: number
}

/**
 * 活动完成反馈数据
 */
export interface ActivityCompletionData {
  activityId: string
  activityName: string
  completionRate: number
  timeSpent: number
  engagementLevel: number
  challenges: string[]
  achievements: string[]
  parentInvolvement: number
}

/**
 * 学习进展反馈数据
 */
export interface LearningProgressData {
  skillArea: string
  currentLevel: number
  previousLevel: number
  progressRate: number
  milestones: Array<{
    name: string
    achieved: boolean
    date?: Date
  }>
  recommendedNextSteps: string[]
}

/**
 * 行为模式反馈数据
 */
export interface BehaviorPatternData {
  patternType: string
  frequency: number
  contexts: Array<{
    environment: string
    timeOfDay: string
    participants: string[]
  }>
  triggers: string[]
  outcomes: Array<{
    type: string
    effectiveness: number
  }>
}

/**
 * 反馈数据联合类型
 */
export type FeedbackDataType = 
  | VoiceInteractionData
  | EmotionResponseData
  | ActivityCompletionData
  | LearningProgressData
  | BehaviorPatternData

/**
 * 语音语调调整参数
 */
export interface VoiceToneParameters {
  tone: 'gentle' | 'enthusiastic' | 'calm' | 'playful' | 'serious'
  speed: number
  volume: number
}

/**
 * 交互风格调整参数
 */
export interface InteractionStyleParameters {
  style: 'playful' | 'educational' | 'supportive' | 'challenging' | 'relaxed'
  frequency: 'increased' | 'decreased' | 'maintained'
  complexity?: 'simple' | 'moderate' | 'complex'
}

/**
 * 活动建议参数
 */
export interface ActivitySuggestionParameters {
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  duration: string
  participantCount: number
  customizations?: Record<string, unknown>
}

/**
 * 反馈频率调整参数
 */
export interface FeedbackFrequencyParameters {
  frequency: 'immediate' | 'frequent' | 'moderate' | 'sparse' | 'deferred'
  timing: 'during' | 'after' | 'periodic'
  detailLevel: 'minimal' | 'standard' | 'detailed'
}

/**
 * 动作参数联合类型
 */
export type ActionParameters = 
  | VoiceToneParameters
  | InteractionStyleParameters
  | ActivitySuggestionParameters
  | FeedbackFrequencyParameters

/**
 * 自适应策略动作
 */
export interface AdaptiveStrategyAction {
  type: 'modify_voice_tone' | 'adjust_interaction_style' | 'suggest_activities' | 'alter_feedback_frequency'
  parameters: ActionParameters
}

export interface FeedbackData {
  id: string
  timestamp: Date
  sessionId?: string
  type: 'voice_interaction' | 'emotion_response' | 'activity_completion' | 'learning_progress' | 'behavior_pattern'
  data: FeedbackDataType
  context: {
    childAge: number
    environment: string
    participants: string[]
    duration: number
  }
  outcomes: {
    engagement: number
    effectiveness: number
    emotionalResponse: string
    recommendations: string[]
  }
}

export interface LearningPattern {
  id: string
  pattern: string
  frequency: number
  effectiveness: number
  contexts: string[]
  recommendations: string[]
  lastUpdated: Date
}

export interface AdaptiveStrategy {
  id: string
  name: string
  description: string
  conditions: string[]
  actions: AdaptiveStrategyAction[]
  successRate: number
  usageCount: number
}

export interface FeedbackInsight {
  id: string
  category: 'communication' | 'emotional' | 'cognitive' | 'behavioral' | 'social'
  title: string
  description: string
  evidence: string[]
  recommendations: string[]
  priority: 'high' | 'medium' | 'low'
  confidence: number
  createdAt: Date
}

/**
 * 语音指标
 */
export interface VoiceMetrics {
  totalDuration: number
  speakingTime: number
  interactionRatio: number
  transcriptCount: number
  emotionDistribution: Record<string, number>
  keywordDensity: Record<string, number>
}

/**
 * 模式分析结果
 */
export interface PatternAnalysisResult {
  frequentPatterns: LearningPattern[]
  effectivePatterns: LearningPattern[]
  totalPatterns: number
}

/**
 * 事件数据联合类型
 */
export type EventData = 
  | VoiceToneParameters
  | InteractionStyleParameters
  | ActivitySuggestionParameters
  | FeedbackFrequencyParameters
  | LearningPattern[]
  | AdaptiveStrategy[]
  | PatternAnalysisResult

export class IntelligentFeedbackSystem {
  private feedbackHistory: FeedbackData[] = []
  private learningPatterns: Map<string, LearningPattern> = new Map()
  private adaptiveStrategies: Map<string, AdaptiveStrategy> = new Map()
  private insights: FeedbackInsight[] = []
  private analysisCallbacks: Map<string, Function[]> = new Map()

  constructor() {
    this.initializeDefaultStrategies()
    this.setupPeriodicAnalysis()
  }

  /**
   * 初始化默认的自适应策略
   */
  private initializeDefaultStrategies(): void {
    const defaultStrategies: AdaptiveStrategy[] = [
      {
        id: 'voice-tone-adjustment',
        name: '语音语调自适应',
        description: '根据宝宝的情感反应调整AI语音的语调',
        conditions: ['negative_emotion_detected', 'low_engagement'],
        actions: [
          {
            type: 'modify_voice_tone',
            parameters: { tone: 'gentle', speed: 0.8, volume: 0.7 }
          }
        ],
        successRate: 0.0,
        usageCount: 0
      },
      {
        id: 'interaction-style-adaptation',
        name: '交互风格调整',
        description: '根据参与度水平调整交互风格',
        conditions: ['low_participation', 'short_responses'],
        actions: [
          {
            type: 'adjust_interaction_style',
            parameters: { style: 'playful', frequency: 'increased' }
          }
        ],
        successRate: 0.0,
        usageCount: 0
      },
      {
        id: 'activity-recommendation',
        name: '智能活动推荐',
        description: '基于历史数据推荐适合的活动',
        conditions: ['activity_completion', 'high_engagement'],
        actions: [
          {
            type: 'suggest_activities',
            parameters: { similar: true, difficulty: 'adaptive' }
          }
        ],
        successRate: 0.0,
        usageCount: 0
      },
      {
        id: 'feedback-frequency-optimization',
        name: '反馈频率优化',
        description: '根据响应情况调整反馈频率',
        conditions: ['feedback_overload', 'ignoring_feedback'],
        actions: [
          {
            type: 'alter_feedback_frequency',
            parameters: { frequency: 'reduced', importance: 'critical_only' }
          }
        ],
        successRate: 0.0,
        usageCount: 0
      }
    ]

    defaultStrategies.forEach(strategy => {
      this.adaptiveStrategies.set(strategy.id, strategy)
    })
  }

  /**
   * 设置定期分析
   */
  private setupPeriodicAnalysis(): void {
    // 每小时执行一次模式分析
    setInterval(() => {
      this.analyzePatterns()
      this.updateInsights()
    }, 60 * 60 * 1000)

    // 每30分钟更新策略效果
    setInterval(() => {
      this.evaluateStrategies()
    }, 30 * 60 * 1000)
  }

  /**
   * 添加反馈数据
   */
  async addFeedbackData(data: Omit<FeedbackData, 'id' | 'timestamp'>): Promise<string> {
    const feedbackId = `feedback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const feedbackData: FeedbackData = {
      id: feedbackId,
      timestamp: new Date(),
      ...data
    }

    this.feedbackHistory.push(feedbackData)

    // 实时分析新数据
    await this.analyzeFeedbackData(feedbackData)

    // 触发自适应策略
    await this.triggerAdaptiveStrategies(feedbackData)

    this.emit('feedbackAdded', feedbackData)

    return feedbackId
  }

  /**
   * 分析语音交互会话
   */
  async analyzeVoiceSession(session: VoiceInteractionSession): Promise<void> {
    const feedbackData: Omit<FeedbackData, 'id' | 'timestamp'> = {
      type: 'voice_interaction',
      sessionId: session.id,
      data: {
        transcripts: session.transcripts,
        insights: session.insights,
        metrics: this.calculateVoiceMetrics(session)
      },
      context: {
        childAge: 12, // 应该从实际数据获取
        environment: 'home',
        participants: session.participants.map(p => p.role),
        duration: session.endTime!.getTime() - session.startTime.getTime()
      },
      outcomes: {
        engagement: session.insights.engagementLevel,
        effectiveness: session.insights.interactionQuality / 10,
        emotionalResponse: session.insights.emotionalState,
        recommendations: session.feedback.positiveReinforcement
      }
    }

    await this.addFeedbackData(feedbackData)
  }

  /**
   * 计算语音指标
   */
  private calculateVoiceMetrics(session: VoiceInteractionSession): VoiceMetrics {
    const totalDuration = session.endTime!.getTime() - session.startTime.getTime()
    const speakingTime = session.participants.reduce((sum, p) => sum + p.speakingTime, 0)
    const interactionRatio = speakingTime / (totalDuration / 1000)

    return {
      totalDuration,
      speakingTime,
      interactionRatio,
      transcriptCount: session.transcripts.length,
      emotionDistribution: this.calculateEmotionDistribution(session),
      keywordDensity: this.calculateKeywordDensity(session)
    }
  }

  /**
   * 计算情感分布
   */
  private calculateEmotionDistribution(session: VoiceInteractionSession): Record<string, number> {
    const emotions: Record<string, number> = {}

    session.transcripts.forEach(transcript => {
      emotions[transcript.emotion] = (emotions[transcript.emotion] || 0) + 1
    })

    const total = Object.values(emotions).reduce((sum, count) => sum + count, 0)
    Object.keys(emotions).forEach(emotion => {
      emotions[emotion] = emotions[emotion] / total
    })

    return emotions
  }

  /**
   * 计算关键词密度
   */
  private calculateKeywordDensity(session: VoiceInteractionSession): Record<string, number> {
    const keywords: Record<string, number> = {}

    session.participants.forEach(participant => {
      participant.keywords.forEach(keyword => {
        keywords[keyword] = (keywords[keyword] || 0) + 1
      })
    })

    return keywords
  }

  /**
   * 分析反馈数据
   */
  private async analyzeFeedbackData(feedback: FeedbackData): Promise<void> {
    // 识别模式
    const patterns = this.identifyPatterns(feedback)

    patterns.forEach(pattern => {
      const existingPattern = this.learningPatterns.get(pattern.id)

      if (existingPattern) {
        // 更新现有模式
        existingPattern.frequency += 1
        existingPattern.effectiveness = (existingPattern.effectiveness + pattern.effectiveness) / 2
        existingPattern.lastUpdated = new Date()
      } else {
        // 添加新模式
        this.learningPatterns.set(pattern.id, pattern)
      }
    })

    this.emit('patternsUpdated', Array.from(this.learningPatterns.values()))
  }

  /**
   * 识别模式
   */
  private identifyPatterns(feedback: FeedbackData): LearningPattern[] {
    const patterns: LearningPattern[] = []

    // 分析时间模式
    const hour = feedback.timestamp.getHours()
    if (hour >= 19 || hour <= 7) {
      patterns.push({
        id: 'evening_night_interaction',
        pattern: '晚间/夜间互动',
        frequency: 1,
        effectiveness: feedback.outcomes.engagement,
        contexts: [feedback.context.environment],
        recommendations: ['使用更柔和的语音语调', '减少刺激性内容', '增加安抚性互动'],
        lastUpdated: new Date()
      })
    }

    // 分析参与度模式
    if (feedback.outcomes.engagement < 0.5) {
      patterns.push({
        id: 'low_engagement_pattern',
        pattern: '低参与度互动',
        frequency: 1,
        effectiveness: feedback.outcomes.effectiveness,
        contexts: [feedback.context.environment],
        recommendations: ['增加游戏性元素', '简化交互内容', '提供更多积极反馈'],
        lastUpdated: new Date()
      })
    }

    // 分析情感模式
    if (feedback.outcomes.emotionalResponse === 'sad' || feedback.outcomes.emotionalResponse === 'angry') {
      patterns.push({
        id: 'negative_emotion_pattern',
        pattern: '负面情感反应',
        frequency: 1,
        effectiveness: feedback.outcomes.effectiveness,
        contexts: [feedback.context.environment],
        recommendations: ['调整交互策略', '提供情感支持', '改变活动类型'],
        lastUpdated: new Date()
      })
    }

    return patterns
  }

  /**
   * 触发自适应策略
   */
  private async triggerAdaptiveStrategies(feedback: FeedbackData): Promise<void> {
    for (const strategy of this.adaptiveStrategies.values()) {
      if (this.shouldTriggerStrategy(strategy, feedback)) {
        await this.executeStrategy(strategy, feedback)
      }
    }
  }

  /**
   * 判断是否应该触发策略
   */
  private shouldTriggerStrategy(strategy: AdaptiveStrategy, feedback: FeedbackData): boolean {
    return strategy.conditions.some(condition => {
      switch (condition) {
        case 'negative_emotion_detected':
          return ['sad', 'angry', 'fearful'].includes(feedback.outcomes.emotionalResponse)
        case 'low_engagement':
          return feedback.outcomes.engagement < 0.4
        case 'low_participation':
          return feedback.context.duration < 60000 // 少于1分钟
        case 'high_engagement':
          return feedback.outcomes.engagement > 0.8
        case 'activity_completion':
          return feedback.type === 'activity_completion'
        case 'feedback_overload':
          return this.getRecentFeedbackCount() > 10 // 最近反馈过多
        case 'ignoring_feedback':
          return this.getIgnoredFeedbackRate() > 0.3
        default:
          return false
      }
    })
  }

  /**
   * 执行策略
   */
  private async executeStrategy(strategy: AdaptiveStrategy, feedback: FeedbackData): Promise<void> {
    strategy.usageCount += 1

    // 记录策略执行
    this.emit('strategyExecuted', {
      strategyId: strategy.id,
      feedbackId: feedback.id,
      timestamp: new Date()
    })

    // 根据策略类型执行具体动作
    for (const action of strategy.actions) {
      await this.executeAction(action, feedback)
    }
  }

  /**
   * 执行具体动作
   */
  private async executeAction(action: AdaptiveStrategyAction, feedback: FeedbackData): Promise<void> {
    switch (action.type) {
      case 'modify_voice_tone':
        this.emit('voiceToneAdjustment', action.parameters)
        break
      case 'adjust_interaction_style':
        this.emit('interactionStyleAdjustment', action.parameters)
        break
      case 'suggest_activities':
        this.emit('activitySuggestion', action.parameters)
        break
      case 'alter_feedback_frequency':
        this.emit('feedbackFrequencyAdjustment', action.parameters)
        break
    }
  }

  /**
   * 评估策略效果
   */
  private evaluateStrategies(): void {
    for (const strategy of this.adaptiveStrategies.values()) {
      if (strategy.usageCount > 0) {
        // 计算成功率
        const recentFeedback = this.feedbackHistory.slice(-20) // 最近20个反馈
        const strategyFeedback = recentFeedback.filter(f =>
          f.type === 'strategy_execution' &&
          f.data.strategyId === strategy.id
        )

        if (strategyFeedback.length > 0) {
          const successCount = strategyFeedback.filter(f =>
            f.outcomes.effectiveness > 0.7
          ).length

          strategy.successRate = successCount / strategyFeedback.length
        }
      }
    }

    this.emit('strategiesEvaluated', Array.from(this.adaptiveStrategies.values()))
  }

  /**
   * 分析模式
   */
  private analyzePatterns(): void {
    // 识别趋势和关联
    const patterns = Array.from(this.learningPatterns.values())

    // 按频率排序
    const frequentPatterns = patterns
      .filter(p => p.frequency > 3)
      .sort((a, b) => b.frequency - a.frequency)

    // 识别高效模式
    const effectivePatterns = patterns
      .filter(p => p.effectiveness > 0.8)
      .sort((a, b) => b.effectiveness - a.effectiveness)

    this.emit('patternsAnalyzed', {
      frequentPatterns,
      effectivePatterns,
      totalPatterns: patterns.length
    })
  }

  /**
   * 更新洞察
   */
  private updateInsights(): void {
    const newInsights: FeedbackInsight[] = []

    // 分析参与度趋势
    const engagementTrend = this.analyzeEngagementTrend()
    if (engagementTrend) {
      newInsights.push(engagementTrend)
    }

    // 分析情感趋势
    const emotionTrend = this.analyzeEmotionTrend()
    if (emotionTrend) {
      newInsights.push(emotionTrend)
    }

    // 分析学习进展
    const learningInsight = this.analyzeLearningProgress()
    if (learningInsight) {
      newInsights.push(learningInsight)
    }

    // 合并新洞察
    this.insights = [...this.insights.slice(-20), ...newInsights]
      .sort((a, b) => b.confidence - a.confidence)

    this.emit('insightsUpdated', this.insights)
  }

  /**
   * 分析参与度趋势
   */
  private analyzeEngagementTrend(): FeedbackInsight | null {
    const recentFeedback = this.feedbackHistory.slice(-10)
    const engagementScores = recentFeedback.map(f => f.outcomes.engagement)

    if (engagementScores.length < 5) return null

    const averageEngagement = engagementScores.reduce((sum, score) => sum + score, 0) / engagementScores.length
    const trend = this.calculateTrend(engagementScores)

    if (trend < -0.1) {
      return {
        id: `engagement-decline-${Date.now()}`,
        category: 'behavioral',
        title: '参与度下降趋势',
        description: `最近参与度呈下降趋势，平均参与度为${(averageEngagement * 100).toFixed(1)}%`,
        evidence: [`最近${engagementScores.length}次交互参与度下降${Math.abs(trend * 100).toFixed(1)}%`],
        recommendations: [
          '增加互动游戏性',
          '调整交互内容复杂度',
          '提供更多积极反馈',
          '考虑调整交互时间'
        ],
        priority: averageEngagement < 0.5 ? 'high' : 'medium',
        confidence: Math.abs(trend),
        createdAt: new Date()
      }
    }

    return null
  }

  /**
   * 分析情感趋势
   */
  private analyzeEmotionTrend(): FeedbackInsight | null {
    const recentFeedback = this.feedbackHistory.slice(-15)
    const emotionCounts: Record<string, number> = {}

    recentFeedback.forEach(feedback => {
      emotionCounts[feedback.outcomes.emotionalResponse] =
        (emotionCounts[feedback.outcomes.emotionalResponse] || 0) + 1
    })

    const total = Object.values(emotionCounts).reduce((sum, count) => sum + count, 0)
    const negativeRatio = (emotionCounts.sad + emotionCounts.angry + emotionCounts.fearful || 0) / total

    if (negativeRatio > 0.4) {
      return {
        id: `negative-emotion-trend-${Date.now()}`,
        category: 'emotional',
        title: '负面情感倾向',
        description: `最近交互中出现较多负面情感，占比${(negativeRatio * 100).toFixed(1)}%`,
        evidence: [`最近${total}次交互中负面情感出现${emotionCounts.sad + emotionCounts.angry + emotionCounts.fearful || 0}次`],
        recommendations: [
          '增加安抚性互动',
          '调整语音语调更柔和',
          '减少可能引起负面情绪的内容',
          '提供更多情感支持'
        ],
        priority: negativeRatio > 0.6 ? 'high' : 'medium',
        confidence: negativeRatio,
        createdAt: new Date()
      }
    }

    return null
  }

  /**
   * 分析学习进展
   */
  private analyzeLearningProgress(): FeedbackInsight | null {
    const learningFeedback = this.feedbackHistory.filter(f => f.type === 'learning_progress')

    if (learningFeedback.length < 3) return null

    const progressScores = learningFeedback.map(f => f.outcomes.effectiveness)
    const averageProgress = progressScores.reduce((sum, score) => sum + score, 0) / progressScores.length

    if (averageProgress > 0.8) {
      return {
        id: `learning-progress-${Date.now()}`,
        category: 'cognitive',
        title: '学习进展良好',
        description: `学习活动效果显著，平均有效率达${(averageProgress * 100).toFixed(1)}%`,
        evidence: [`${learningFeedback.length}次学习活动中${progressScores.filter(s => s > 0.8).length}次表现优秀`],
        recommendations: [
          '保持当前学习策略',
          '可以适当增加学习内容难度',
          '记录成功的学习模式',
          '尝试将成功策略应用到其他领域'
        ],
        priority: 'medium',
        confidence: averageProgress,
        createdAt: new Date()
      }
    }

    return null
  }

  /**
   * 计算趋势
   */
  private calculateTrend(values: number[]): number {
    if (values.length < 2) return 0

    let trend = 0
    for (let i = 1; i < values.length; i++) {
      trend += (values[i] - values[i - 1]) / values.length
    }

    return trend
  }

  /**
   * 获取最近反馈数量
   */
  private getRecentFeedbackCount(): number {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    return this.feedbackHistory.filter(f => f.timestamp > oneHourAgo).length
  }

  /**
   * 获取被忽略的反馈率
   */
  private getIgnoredFeedbackRate(): number {
    // 简化实现，实际应该基于用户行为分析
    return Math.random() * 0.2
  }

  /**
   * 获取智能建议
   */
  getIntelligentRecommendations(limit: number = 5): FeedbackInsight[] {
    return this.insights
      .filter(insight => insight.priority === 'high' || insight.confidence > 0.7)
      .sort((a, b) => {
        const priorityWeight = { high: 3, medium: 2, low: 1 }
        return (priorityWeight[b.priority] * b.confidence) - (priorityWeight[a.priority] * a.confidence)
      })
      .slice(0, limit)
  }

  /**
   * 获取自适应策略建议
   */
  getAdaptiveStrategyRecommendations(): AdaptiveStrategy[] {
    return Array.from(this.adaptiveStrategies.values())
      .filter(strategy => strategy.successRate > 0.7 && strategy.usageCount > 5)
      .sort((a, b) => b.successRate - a.successRate)
  }

  /**
   * 事件监听
   */
  on(event: string, callback: Function): void {
    if (!this.analysisCallbacks.has(event)) {
      this.analysisCallbacks.set(event, [])
    }
    this.analysisCallbacks.get(event)!.push(callback)
  }

  /**
   * 移除事件监听
   */
  off(event: string, callback: Function): void {
    const listeners = this.analysisCallbacks.get(event)
    if (listeners) {
      const index = listeners.indexOf(callback)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }

  /**
   * 触发事件
   */
  private emit(event: string, data: EventData): void {
    const listeners = this.analysisCallbacks.get(event)
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error(`Error in feedback system event listener for ${event}:`, error)
        }
      })
    }
  }

  /**
   * 导出数据
   */
  exportData(): {
    feedbackHistory: FeedbackData[]
    learningPatterns: LearningPattern[]
    adaptiveStrategies: AdaptiveStrategy[]
    insights: FeedbackInsight[]
  } {
    return {
      feedbackHistory: this.feedbackHistory,
      learningPatterns: Array.from(this.learningPatterns.values()),
      adaptiveStrategies: Array.from(this.adaptiveStrategies.values()),
      insights: this.insights
    }
  }

  /**
   * 导入数据
   */
  importData(data: {
    feedbackHistory?: FeedbackData[]
    learningPatterns?: LearningPattern[]
    adaptiveStrategies?: AdaptiveStrategy[]
    insights?: FeedbackInsight[]
  }): void {
    if (data.feedbackHistory) {
      this.feedbackHistory = [...this.feedbackHistory, ...data.feedbackHistory]
    }

    if (data.learningPatterns) {
      data.learningPatterns.forEach(pattern => {
        this.learningPatterns.set(pattern.id, pattern)
      })
    }

    if (data.adaptiveStrategies) {
      data.adaptiveStrategies.forEach(strategy => {
        this.adaptiveStrategies.set(strategy.id, strategy)
      })
    }

    if (data.insights) {
      this.insights = [...this.insights, ...data.insights]
    }
  }

  /**
   * 清理旧数据
   */
  cleanupOldData(daysToKeep: number = 30): void {
    const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000)

    this.feedbackHistory = this.feedbackHistory.filter(f => f.timestamp > cutoffDate)
    this.insights = this.insights.filter(i => i.createdAt > cutoffDate)

    // 清理低效模式
    for (const [id, pattern] of this.learningPatterns.entries()) {
      if (pattern.lastUpdated < cutoffDate && pattern.effectiveness < 0.5) {
        this.learningPatterns.delete(id)
      }
    }
  }
}

// 导出单例实例
let intelligentFeedbackSystem: IntelligentFeedbackSystem | null = null

export function getIntelligentFeedbackSystem(): IntelligentFeedbackSystem {
  if (!intelligentFeedbackSystem) {
    intelligentFeedbackSystem = new IntelligentFeedbackSystem()
  }
  return intelligentFeedbackSystem
}