/**
 * 情感实时监测引擎
 * 负责跨页面情感状态跟踪、实时分析和智能响应
 */

import { EmotionType } from './emotion-engine'

// Re-export EmotionType for convenience
export { EmotionType } from './emotion-engine'

export interface EmotionEvent {
  id: string
  timestamp: Date
  emotion: EmotionType
  intensity: number // 0-1
  context: string
  source: 'user_input' | 'behavior' | 'system_trigger' | 'voice'
  childId: string
  metadata?: {
    page?: string
    action?: string
    duration?: number
    words?: string[]
  }
}

export interface EmotionPattern {
  id: string
  type: 'time_based' | 'context_based' | 'behavioral'
  description: string
  emotions: EmotionType[]
  triggers: string[]
  frequency: number
  confidence: number
  lastDetected: Date
}

export interface EmotionalState {
  currentEmotion: EmotionType
  intensity: number
  trend: 'improving' | 'declining' | 'stable'
  duration: number // 持续时间（秒）
  triggers: string[]
  patterns: EmotionPattern[]
}

export interface EmotionAlert {
  id: string
  type: 'attention_needed' | 'positive_milestone' | 'emotional_concern'
  severity: 'low' | 'medium' | 'high'
  message: string
  suggestions: string[]
  timestamp: Date
  acknowledged: boolean
}

class EmotionMonitor {
  private eventHistory: EmotionEvent[] = []
  private patterns: Map<string, EmotionPattern> = new Map()
  private currentState: EmotionalState | null = null
  private alertHandlers: ((alert: EmotionAlert) => void)[] = []
  private analysisInterval: NodeJS.Timeout | null = null
  private isActive = false

  constructor() {
    this.initializeDefaultPatterns()
  }

  /**
   * 启动情感监测系统
   */
  start() {
    if (this.isActive) return

    this.isActive = true
    console.log('🎯 情感实时监测系统已启动')

    // 每10秒分析一次情感状态
    this.analysisInterval = setInterval(() => {
      this.analyzeEmotionalState()
    }, 10000)
  }

  /**
   * 停止情感监测系统
   */
  stop() {
    if (!this.isActive) return

    this.isActive = false
    if (this.analysisInterval) {
      clearInterval(this.analysisInterval)
      this.analysisInterval = null
    }
    console.log('🛑 情感实时监测系统已停止')
  }

  /**
   * 记录情感事件
   */
  recordEvent(event: Omit<EmotionEvent, 'id' | 'timestamp'>): string {
    const emotionEvent: EmotionEvent = {
      ...event,
      id: this.generateEventId(),
      timestamp: new Date()
    }

    this.eventHistory.push(emotionEvent)
    this.updateCurrentState(emotionEvent)
    this.detectPatterns(emotionEvent)

    // 保持最近100个事件
    if (this.eventHistory.length > 100) {
      this.eventHistory = this.eventHistory.slice(-100)
    }

    console.log(`📊 情感事件记录: ${event.emotion} (${event.intensity})`)
    return emotionEvent.id
  }

  /**
   * 获取当前情感状态
   */
  getCurrentState(): EmotionalState | null {
    return this.currentState
  }

  /**
   * 获取情感历史
   */
  getEventHistory(limit: number = 20): EmotionEvent[] {
    return this.eventHistory.slice(-limit).reverse()
  }

  /**
   * 获取检测到的模式
   */
  getDetectedPatterns(): EmotionPattern[] {
    return Array.from(this.patterns.values())
      .filter(pattern => pattern.confidence > 0.5)
      .sort((a, b) => b.confidence - a.confidence)
  }

  /**
   * 注册情感警报处理器
   */
  onAlert(handler: (alert: EmotionAlert) => void) {
    this.alertHandlers.push(handler)
  }

  /**
   * 分析用户输入中的情感
   */
  analyzeUserInput(text: string, context: string, childId: string): EmotionType {
    const emotion = this.detectEmotionFromText(text)
    const intensity = this.calculateEmotionIntensity(text, emotion)

    this.recordEvent({
      emotion,
      intensity,
      context,
      source: 'user_input',
      childId,
      metadata: {
        words: text.split(' ').filter(word => word.length > 0)
      }
    })

    return emotion
  }

  /**
   * 分析用户行为
   */
  analyzeBehavior(action: string, page: string, childId: string): EmotionType | null {
    const emotion = this.inferEmotionFromBehavior(action, page)

    if (emotion) {
      this.recordEvent({
        emotion,
        intensity: 0.6,
        context: `行为: ${action}`,
        source: 'behavior',
        childId,
        metadata: { page, action }
      })
    }

    return emotion
  }

  /**
   * 生成情感报告
   */
  generateEmotionReport(childId: string, timeRange: 'hour' | 'day' | 'week' = 'hour'): {
    summary: string
    emotions: { [key in EmotionType]?: number }
    trends: string[]
    alerts: EmotionAlert[]
    recommendations: string[]
  } {
    const now = new Date()
    const timeRangeMs = {
      hour: 60 * 60 * 1000,
      day: 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000
    }[timeRange]

    const recentEvents = this.eventHistory.filter(
      event => event.childId === childId &&
      (now.getTime() - event.timestamp.getTime()) <= timeRangeMs
    )

    const emotionCounts: { [key in EmotionType]?: number } = {}
    let totalIntensity = 0

    recentEvents.forEach(event => {
      emotionCounts[event.emotion] = (emotionCounts[event.emotion] || 0) + 1
      totalIntensity += event.intensity
    })

    const dominantEmotion = Object.entries(emotionCounts)
      .sort(([, a], [, b]) => b - a)[0]

    const summary = this.generateSummary(recentEvents, dominantEmotion)
    const trends = this.analyzeTrends(recentEvents)
    const alerts = this.generateAlerts(recentEvents)
    const recommendations = this.generateRecommendations(recentEvents, dominantEmotion?.[0])

    return {
      summary,
      emotions: emotionCounts,
      trends,
      alerts,
      recommendations
    }
  }

  // 私有方法

  private initializeDefaultPatterns() {
    const defaultPatterns: EmotionPattern[] = [
      {
        id: 'frustration_pattern',
        type: 'behavioral',
        description: '连续遇到困难时的挫败感',
        emotions: [EmotionType.ANGER, EmotionType.DISCOMFORT],
        triggers: ['重复尝试', '错误', '失败', '无法解决'],
        frequency: 0,
        confidence: 0,
        lastDetected: new Date()
      },
      {
        id: 'excitement_pattern',
        type: 'context_based',
        description: '成功完成任务的兴奋感',
        emotions: [EmotionType.HAPPINESS, EmotionType.CURIOSITY],
        triggers: ['完成', '成功', '奖励', '表扬'],
        frequency: 0,
        confidence: 0,
        lastDetected: new Date()
      },
      {
        id: 'attention_seeking',
        type: 'time_based',
        description: '需要关注的表现',
        emotions: [EmotionType.ATTENTION],
        triggers: ['打断', '呼叫', '寻求帮助'],
        frequency: 0,
        confidence: 0,
        lastDetected: new Date()
      }
    ]

    defaultPatterns.forEach(pattern => {
      this.patterns.set(pattern.id, pattern)
    })
  }

  private detectEmotionFromText(text: string): EmotionType {
    const emotionKeywords = {
      [EmotionType.HAPPINESS]: ['开心', '高兴', '太好了', '棒', '喜欢', '爱', '快乐', '满意'],
      [EmotionType.SADNESS]: ['难过', '伤心', '想哭', '不开心', '失落', '沮丧', '失望'],
      [EmotionType.ANGER]: ['生气', '讨厌', '烦', '气', '恼火', '不公平', '不要'],
      [EmotionType.FEAR]: ['害怕', '担心', '紧张', '恐惧', '不安', '焦虑'],
      [EmotionType.SURPRISE]: ['惊讶', '意外', '哇', '真没想到', '吓一跳'],
      [EmotionType.CURIOSITY]: ['为什么', '怎么', '想知道', '好奇', '是什么', '为什么'],
      [EmotionType.COMFORT]: ['舒服', '安心', '温暖', '放心', '安全'],
      [EmotionType.HUNGER]: ['饿', '想吃', '食物', '吃饭', '零食'],
      [EmotionType.DISCOMFORT]: ['不舒服', '难受', '疼', '痛', '不舒服'],
      [EmotionType.ATTENTION]: ['看看我', '快来', '帮帮我', '陪我', '注意我']
    }

    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        return emotion as EmotionType
      }
    }

    return EmotionType.NEUTRAL || EmotionType.HAPPINESS // 默认返回中性或开心
  }

  private calculateEmotionIntensity(text: string, emotion: EmotionType): number {
    const intensityModifiers = {
      very: 0.3,
      really: 0.25,
      so: 0.2,
      太: 0.25,
      很: 0.2,
      非常: 0.3,
      特别: 0.25,
      有点: -0.1,
      一些: -0.1,
      稍微: -0.15
    }

    let intensity = 0.5 // 基础强度

    for (const [modifier, value] of Object.entries(intensityModifiers)) {
      if (text.includes(modifier)) {
        intensity += value
      }
    }

    // 检查感叹号数量
    const exclamationCount = (text.match(/!/g) || []).length
    intensity += exclamationCount * 0.1

    return Math.max(0.1, Math.min(1.0, intensity))
  }

  private inferEmotionFromBehavior(action: string, page: string): EmotionType | null {
    const behaviorEmotions: { [key: string]: EmotionType } = {
      '长时间停留': EmotionType.CURIOSITY,
      '快速点击': EmotionType.EXCITEMENT,
      '重复操作': EmotionType.ATTENTION,
      '放弃操作': EmotionType.DISCOMFORT,
      '寻求帮助': EmotionType.ATTENTION,
      '完成任务': EmotionType.HAPPINESS,
      '错误操作': EmotionType.ANGER
    }

    for (const [behavior, emotion] of Object.entries(behaviorEmotions)) {
      if (action.includes(behavior)) {
        return emotion
      }
    }

    return null
  }

  private updateCurrentState(event: EmotionEvent) {
    const recentEvents = this.eventHistory.slice(-5)

    if (recentEvents.length === 0) return

    const dominantEmotion = event.emotion
    const avgIntensity = recentEvents.reduce((sum, e) => sum + e.intensity, 0) / recentEvents.length

    // 分析趋势
    const trend = this.analyzeTrend(recentEvents)

    this.currentState = {
      currentEmotion: dominantEmotion,
      intensity: avgIntensity,
      trend,
      duration: this.calculateEmotionDuration(dominantEmotion),
      triggers: [...new Set(recentEvents.map(e => e.context))],
      patterns: this.getDetectedPatterns()
    }
  }

  private analyzeTrend(events: EmotionEvent[]): 'improving' | 'declining' | 'stable' {
    if (events.length < 3) return 'stable'

    const recent = events.slice(-3)
    const avgIntensity = recent.reduce((sum, e) => sum + e.intensity, 0) / recent.length
    const olderAvg = events.slice(0, -3).reduce((sum, e) => sum + e.intensity, 0) / Math.max(1, events.length - 3)

    if (avgIntensity > olderAvg + 0.1) return 'improving'
    if (avgIntensity < olderAvg - 0.1) return 'declining'
    return 'stable'
  }

  private calculateEmotionDuration(emotion: EmotionType): number {
    const emotionEvents = this.eventHistory.filter(e => e.emotion === emotion)
    if (emotionEvents.length === 0) return 0

    const latestEvent = emotionEvents[emotionEvents.length - 1]
    return Math.floor((Date.now() - latestEvent.timestamp.getTime()) / 1000)
  }

  private detectPatterns(event: EmotionEvent) {
    this.patterns.forEach(pattern => {
      if (this.patternMatches(pattern, event)) {
        pattern.frequency += 1
        pattern.confidence = Math.min(1.0, pattern.confidence + 0.1)
        pattern.lastDetected = new Date()

        if (pattern.confidence > 0.7) {
          this.createPatternAlert(pattern)
        }
      }
    })
  }

  private patternMatches(pattern: EmotionPattern, event: EmotionEvent): boolean {
    return pattern.emotions.includes(event.emotion) &&
           pattern.triggers.some(trigger =>
             event.context.includes(trigger) ||
             event.metadata?.words?.some(word => word.includes(trigger))
           )
  }

  private createPatternAlert(pattern: EmotionPattern) {
    const alert: EmotionAlert = {
      id: this.generateEventId(),
      type: pattern.emotions.includes(EmotionType.HAPPINESS) ? 'positive_milestone' : 'emotional_concern',
      severity: pattern.confidence > 0.8 ? 'high' : pattern.confidence > 0.6 ? 'medium' : 'low',
      message: `检测到情感模式: ${pattern.description}`,
      suggestions: this.generateSuggestionsForPattern(pattern),
      timestamp: new Date(),
      acknowledged: false
    }

    this.alertHandlers.forEach(handler => handler(alert))
  }

  private generateSuggestionsForPattern(pattern: EmotionPattern): string[] {
    const suggestions: { [key: string]: string[] } = {
      frustration_pattern: ['提供额外帮助', '简化任务难度', '给予鼓励和支持'],
      excitement_pattern: ['给予表扬', '设置新挑战', '记录成就时刻'],
      attention_seeking: ['给予专注陪伴', '安排互动时间', '肯定存在感']
    }

    return suggestions[pattern.id] || ['关注情感变化', '提供适当支持']
  }

  private analyzeEmotionalState() {
    if (this.eventHistory.length === 0) return

    const recentEvents = this.eventHistory.slice(-10)
    const negativeEmotions = recentEvents.filter(e =>
      [EmotionType.SADNESS, EmotionType.ANGER, EmotionType.FEAR, EmotionType.DISCOMFORT].includes(e.emotion)
    )

    // 检查是否需要关注
    if (negativeEmotions.length >= 5) {
      this.createAlert({
        type: 'attention_needed',
        severity: 'medium',
        message: '检测到持续的负面情绪，建议给予关注和支持',
        suggestions: ['主动关心', '询问感受', '提供安慰', '转移注意力']
      })
    }
  }

  private createAlert(alertData: Omit<EmotionAlert, 'id' | 'timestamp' | 'acknowledged'>) {
    const alert: EmotionAlert = {
      ...alertData,
      id: this.generateEventId(),
      timestamp: new Date(),
      acknowledged: false
    }

    this.alertHandlers.forEach(handler => handler(alert))
  }

  private generateSummary(events: EmotionEvent[], dominantEmotion?: [string, number]): string {
    if (events.length === 0) return '暂无情感数据'

    const avgIntensity = events.reduce((sum, e) => sum + e.intensity, 0) / events.length
    const emotion = dominantEmotion?.[0] || '中性'

    return `在观察期间，主要表现为${emotion}状态，平均强度为${(avgIntensity * 100).toFixed(0)}%，总体情感状态${avgIntensity > 0.6 ? '积极' : '平稳'}。`
  }

  private analyzeTrends(events: EmotionEvent[]): string[] {
    const trends: string[] = []

    if (events.length < 3) return trends

    // 分析情感变化趋势
    const emotions = events.map(e => e.emotion)
    const uniqueEmotions = [...new Set(emotions)]

    if (uniqueEmotions.length > 3) {
      trends.push('情感变化较为丰富，情绪活跃')
    } else if (uniqueEmotions.length === 1) {
      trends.push('情感状态相对稳定')
    }

    // 分析时间模式
    const hourlyGroups = this.groupEventsByHour(events)
    const mostActiveHour = Object.entries(hourlyGroups)
      .sort(([, a], [, b]) => b.length - a.length)[0]

    if (mostActiveHour) {
      trends.push(`${mostActiveHour[0]}点时段情感表达最为活跃`)
    }

    return trends
  }

  private groupEventsByHour(events: EmotionEvent[]): { [hour: string]: EmotionEvent[] } {
    const groups: { [hour: string]: EmotionEvent[] } = {}

    events.forEach(event => {
      const hour = event.timestamp.getHours().toString()
      if (!groups[hour]) groups[hour] = []
      groups[hour].push(event)
    })

    return groups
  }

  private generateAlerts(events: EmotionEvent[]): EmotionAlert[] {
    const alerts: EmotionAlert[] = []

    // 检查高强度负面情绪
    const highIntensityNegative = events.filter(e =>
      e.intensity > 0.8 &&
      [EmotionType.SADNESS, EmotionType.ANGER, EmotionType.FEAR].includes(e.emotion)
    )

    if (highIntensityNegative.length > 0) {
      alerts.push({
        id: this.generateEventId(),
        type: 'emotional_concern',
        severity: 'high',
        message: '检测到高强度负面情绪',
        suggestions: ['立即关注', '提供安慰', '了解原因'],
        timestamp: new Date(),
        acknowledged: false
      })
    }

    return alerts
  }

  private generateRecommendations(events: EmotionEvent[], dominantEmotion?: EmotionType): string[] {
    const recommendations: string[] = []

    if (events.length === 0) return ['继续观察情感表现']

    // 基于主要情感推荐
    if (dominantEmotion) {
      const emotionRecommendations: { [key in EmotionType]?: string[] } = {
        [EmotionType.HAPPINESS]: ['继续保持积极状态', '记录快乐时刻', '分享成功经验'],
        [EmotionType.CURIOSITY]: ['满足好奇心', '提供探索机会', '鼓励学习新知识'],
        [EmotionType.ATTENTION]: ['给予专注陪伴', '安排互动时间', '积极响应需求'],
        [EmotionType.DISCOMFORT]: ['了解不适原因', '提供安慰和支持', '创造安全感'],
        [EmotionType.ANGER]: ['帮助表达情绪', '教授情绪管理', '提供冷静空间']
      }

      recommendations.push(...(emotionRecommendations[dominantEmotion] || []))
    }

    // 基于情感多样性推荐
    const uniqueEmotions = [...new Set(events.map(e => e.emotion))]
    if (uniqueEmotions.length < 2) {
      recommendations.push('鼓励情感表达的多样性')
    }

    return recommendations
  }

  private generateEventId(): string {
    return `emotion_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}

// 添加 NEUTRAL 情感类型（如果不存在）
if (typeof EmotionType !== 'undefined' && !EmotionType.NEUTRAL) {
  (EmotionType as Record<string, string>).NEUTRAL = 'NEUTRAL'
}

// 全局情感监测实例
export const emotionMonitor = new EmotionMonitor()

// 自动启动监测
if (typeof window !== 'undefined') {
  // 浏览器环境下延迟启动，避免阻塞页面加载
  setTimeout(() => {
    emotionMonitor.start()
  }, 2000)
}

export default EmotionMonitor