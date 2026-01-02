/**
 * @file 实时数据处理引擎
 * @description 负责处理实时事件数据，计算实时指标，检测异常模式
 * @module RealtimeProcessor
 * @author YYC³ Team
 * @version 1.0.0
 */

// import { ClickHouseClient } from './clickhouse'
// import { RedisClient } from './redis'
// import { WebSocketManager } from './websocket-manager'
// import { createLogger } from '../utils/logger'

// const log = createLogger('realtime-processor')

// 事件数据接口
export interface EventData {
  eventId: string
  userId: string
  sessionId?: string
  eventType: 'user_action' | 'ai_interaction' | 'growth_update' | 'recommendation_feedback' | 'system_metric'
  eventTimestamp: Date
  properties: Record<string, any>
  source: string
}

// 实时指标接口
export interface RealtimeMetrics {
  timestamp: Date
  activeUsers: number
  totalUsers: number
  aiConversations: number
  averageSatisfaction: number
  learningTime: number
  systemHealth: number
  anomalies: AnomalyEvent[]
}

// 异常事件接口
export interface AnomalyEvent {
  type: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  timestamp: Date
  affectedUsers?: number
  metrics?: Record<string, number>
}

// 用户活动模式
interface UserActivityPattern {
  userId: string
  lastActivity: Date
  sessionDuration: number
  actionsCount: number
  engagementScore: number
  riskLevel: 'low' | 'medium' | 'high'
}

export class RealtimeProcessor {
  private metrics: RealtimeMetrics
  private userPatterns: Map<string, UserActivityPattern> = new Map()
  private eventCounters: Map<string, number> = new Map()
  private anomalyDetector: AnomalyDetector

  constructor(
    private clickhouseClient: ClickHouseClient,
    private redisClient: RedisClient,
    private wsManager: WebSocketManager
  ) {
    this.metrics = this.initializeMetrics()
    this.anomalyDetector = new AnomalyDetector()

    // 启动定期指标计算
    this.startMetricsCalculation()
    this.startAnomalyDetection()
  }

  /**
   * 处理实时事件
   */
  async processEvent(eventData: any): Promise<void> {
    try {
      const event = this.parseEvent(eventData)

      // 更新计数器
      this.updateEventCounters(event)

      // 处理不同类型的事件
      switch (event.eventType) {
        case 'user_action':
          await this.processUserAction(event)
          break
        case 'ai_interaction':
          await this.processAIInteraction(event)
          break
        case 'growth_update':
          await this.processGrowthUpdate(event)
          break
        case 'recommendation_feedback':
          await this.processRecommendationFeedback(event)
          break
        case 'system_metric':
          await this.processSystemMetric(event)
          break
        default:
          log.warn('Unknown event type:', event.eventType)
      }

      // 存储到ClickHouse
      await this.storeEvent(event)

      // 更新实时指标
      await this.updateRealtimeMetrics()

      // 广播到WebSocket客户端
      await this.broadcastRealtimeUpdate(event)

      log.debug('Event processed successfully:', event.eventId)

    } catch (error) {
      log.error('Failed to process event:', error)
      throw error
    }
  }

  /**
   * 获取当前实时指标
   */
  async getRealtimeMetrics(): Promise<RealtimeMetrics> {
    return {
      ...this.metrics,
      timestamp: new Date(),
      activeUsers: await this.getActiveUsersCount(),
      totalUsers: await this.getTotalUsersCount(),
      aiConversations: await this.getAIConversationsCount(),
      averageSatisfaction: await this.getAverageSatisfaction(),
      learningTime: await this.getTotalLearningTime(),
      systemHealth: await this.calculateSystemHealth(),
      anomalies: this.anomalyDetector.getRecentAnomalies()
    }
  }

  /**
   * 解析事件数据
   */
  private parseEvent(rawEvent: any): EventData {
    if (typeof rawEvent === 'string') {
      rawEvent = JSON.parse(rawEvent)
    }

    return {
      eventId: rawEvent.eventId || rawEvent.id || this.generateEventId(),
      userId: rawEvent.userId || rawEvent.user_id || 'anonymous',
      sessionId: rawEvent.sessionId || rawEvent.session_id,
      eventType: rawEvent.eventType || rawEvent.event_type,
      eventTimestamp: new Date(rawEvent.eventTimestamp || rawEvent.timestamp || Date.now()),
      properties: rawEvent.properties || rawEvent.data || {},
      source: rawEvent.source || 'unknown'
    }
  }

  /**
   * 处理用户行为事件
   */
  private async processUserAction(event: EventData): Promise<void> {
    const pattern = this.userPatterns.get(event.userId) || {
      userId: event.userId,
      lastActivity: new Date(),
      sessionDuration: 0,
      actionsCount: 0,
      engagementScore: 0,
      riskLevel: 'low'
    }

    // 更新用户活动模式
    pattern.lastActivity = event.eventTimestamp
    pattern.actionsCount++

    // 计算参与度分数
    pattern.engagementScore = this.calculateEngagementScore(pattern)

    // 评估流失风险
    pattern.riskLevel = this.assessChurnRisk(pattern)

    this.userPatterns.set(event.userId, pattern)

    // 缓存到Redis
    await this.redisClient.setex(
      `user_pattern:${event.userId}`,
      3600, // 1小时过期
      JSON.stringify(pattern)
    )

    // 检测异常行为
    await this.anomalyDetector.analyzeUserAction(event, pattern)
  }

  /**
   * 处理AI对话事件
   */
  private async processAIInteraction(event: EventData): Promise<void> {
    const interaction = {
      conversationId: event.properties.conversationId,
      userId: event.userId,
      messageLength: event.properties.messageLength || 0,
      responseTime: event.properties.responseTime || 0,
      satisfaction: event.properties.satisfaction || 0,
      timestamp: event.eventTimestamp
    }

    // 实时计算对话质量指标
    const qualityScore = this.calculateConversationQuality(interaction)

    // 缓存最近的对话质量
    await this.redisClient.zadd(
      'conversation_quality',
      qualityScore,
      `${interaction.userId}:${interaction.conversationId}`
    )

    // 保持最近1000条对话记录
    await this.redisClient.zremrangebyrank('conversation_quality', 0, -1001)

    // 检测对话质量异常
    if (qualityScore < 0.3) {
      this.anomalyDetector.addAnomaly({
        type: 'low_conversation_quality',
        severity: 'medium',
        description: `AI对话质量异常低: ${qualityScore.toFixed(2)}`,
        timestamp: new Date(),
        affectedUsers: 1,
        metrics: { qualityScore }
      })
    }
  }

  /**
   * 处理成长更新事件
   */
  private async processGrowthUpdate(event: EventData): Promise<void> {
    const update = {
      userId: event.userId,
      growthType: event.properties.growthType,
      improvement: event.properties.improvement || 0,
      timestamp: event.eventTimestamp
    }

    // 更新学习时间统计
    if (update.growthType === 'learning_time') {
      await this.redisClient.incrbyfloat(
        `daily_learning:${event.userId}`,
        update.improvement
      )
    }

    // 计算成长趋势
    await this.updateGrowthTrend(update)
  }

  /**
   * 处理推荐反馈事件
   */
  private async processRecommendationFeedback(event: EventData): Promise<void> {
    const feedback = {
      userId: event.userId,
      recommendationId: event.properties.recommendationId,
      rating: event.properties.rating || 0,
      timestamp: event.eventTimestamp
    }

    // 更新推荐效果统计
    await this.redisClient.zadd(
      'recommendation_ratings',
      feedback.rating,
      `${feedback.recommendationId}:${feedback.userId}`
    )

    // 计算实时推荐CTR
    const ctr = await this.calculateRecommendationCTR()
    await this.redisClient.setex('recommendation_ctr', 300, ctr) // 5分钟缓存

    log.debug('Recommendation feedback processed:', feedback)
  }

  /**
   * 处理系统指标事件
   */
  private async processSystemMetric(event: EventData): Promise<void> {
    const metric = {
      name: event.properties.metricName,
      value: event.properties.value,
      threshold: event.properties.threshold,
      timestamp: event.eventTimestamp
    }

    // 检查系统健康状态
    if (metric.threshold && metric.value > metric.threshold) {
      this.anomalyDetector.addAnomaly({
        type: 'system_metric_exceeded',
        severity: 'high',
        description: `系统指标 ${metric.name} 超过阈值: ${metric.value} > ${metric.threshold}`,
        timestamp: new Date(),
        metrics: { [metric.name]: metric.value, threshold: metric.threshold }
      })
    }

    // 更新系统健康分数
    await this.updateSystemHealth(metric)
  }

  /**
   * 存储事件到ClickHouse
   */
  private async storeEvent(event: EventData): Promise<void> {
    const tableName = this.getTableNameForEvent(event.eventType)
    const query = `
      INSERT INTO ${tableName} (
        event_id, user_id, session_id, event_type, event_timestamp,
        properties, source, created_date
      ) VALUES (
        '${event.eventId}', '${event.userId}', '${event.sessionId || ''}',
        '${event.eventType}', '${event.eventTimestamp.toISOString()}',
        '${JSON.stringify(event.properties)}', '${event.source}',
        toDate('${event.eventTimestamp.toISOString()}')
      )
    `

    try {
      await this.clickhouseClient.query(query)
    } catch (error) {
      log.error('Failed to store event to ClickHouse:', error)
      // 不抛出错误，避免影响实时处理
    }
  }

  /**
   * 广播实时更新到WebSocket客户端
   */
  private async broadcastRealtimeUpdate(event: EventData): Promise<void> {
    const update = {
      type: 'event_update',
      timestamp: new Date(),
      event: {
        id: event.eventId,
        type: event.eventType,
        userId: event.userId,
        timestamp: event.eventTimestamp
      },
      metrics: await this.getRealtimeMetrics()
    }

    this.wsManager.broadcast(update)
  }

  /**
   * 启动定期指标计算
   */
  private startMetricsCalculation(): void {
    setInterval(async () => {
      try {
        await this.updateRealtimeMetrics()
        await this.cleanupOldData()
      } catch (error) {
        log.error('Error in metrics calculation:', error)
      }
    }, 30000) // 每30秒计算一次指标
  }

  /**
   * 启动异常检测
   */
  private startAnomalyDetection(): void {
    setInterval(async () => {
      try {
        await this.anomalyDetector.runDetection()
      } catch (error) {
        log.error('Error in anomaly detection:', error)
      }
    }, 60000) // 每分钟运行异常检测
  }

  /**
   * 更新实时指标
   */
  private async updateRealtimeMetrics(): Promise<void> {
    this.metrics = {
      timestamp: new Date(),
      activeUsers: await this.getActiveUsersCount(),
      totalUsers: await this.getTotalUsersCount(),
      aiConversations: await this.getAIConversationsCount(),
      averageSatisfaction: await this.getAverageSatisfaction(),
      learningTime: await this.getTotalLearningTime(),
      systemHealth: await this.calculateSystemHealth(),
      anomalies: this.anomalyDetector.getRecentAnomalies()
    }

    // 缓存指标到Redis
    await this.redisClient.setex(
      'realtime_metrics',
      60, // 1分钟缓存
      JSON.stringify(this.metrics)
    )
  }

  // 辅助方法实现
  private initializeMetrics(): RealtimeMetrics {
    return {
      timestamp: new Date(),
      activeUsers: 0,
      totalUsers: 0,
      aiConversations: 0,
      averageSatisfaction: 0,
      learningTime: 0,
      systemHealth: 100,
      anomalies: []
    }
  }

  private generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private updateEventCounters(event: EventData): void {
    const key = `${event.eventType}:${new Date(event.eventTimestamp).getHours()}`
    this.eventCounters.set(key, (this.eventCounters.get(key) || 0) + 1)
  }

  private calculateEngagementScore(pattern: UserActivityPattern): number {
    const timeSinceLastActivity = Date.now() - pattern.lastActivity.getTime()
    const recencyScore = Math.max(0, 1 - timeSinceLastActivity / (24 * 60 * 60 * 1000)) // 24小时内的活动
    const frequencyScore = Math.min(1, pattern.actionsCount / 100) // 行为频率
    const durationScore = Math.min(1, pattern.sessionDuration / (60 * 60 * 1000)) // 会话时长

    return (recencyScore + frequencyScore + durationScore) / 3
  }

  private assessChurnRisk(pattern: UserActivityPattern): 'low' | 'medium' | 'high' {
    const timeSinceLastActivity = Date.now() - pattern.lastActivity.getTime()
    const daysSinceLastActivity = timeSinceLastActivity / (24 * 60 * 60 * 1000)

    if (daysSinceLastActivity > 7 || pattern.engagementScore < 0.2) {
      return 'high'
    } else if (daysSinceLastActivity > 3 || pattern.engagementScore < 0.5) {
      return 'medium'
    }
    return 'low'
  }

  private calculateConversationQuality(interaction: any): number {
    const satisfactionWeight = 0.4
    const responseTimeWeight = 0.3
    const messageLengthWeight = 0.3

    const satisfactionScore = interaction.satisfaction / 5 // 假设满意度是1-5分
    const responseTimeScore = Math.max(0, 1 - interaction.responseTime / 5000) // 5秒内响应为满分
    const messageLengthScore = Math.min(1, interaction.messageLength / 100) // 100字符为满分

    return satisfactionScore * satisfactionWeight +
           responseTimeScore * responseTimeWeight +
           messageLengthScore * messageLengthWeight
  }

  private async updateGrowthTrend(update: any): Promise<void> {
    const trendKey = `growth_trend:${update.userId}:${update.growthType}`
    await this.redisClient.zadd(
      trendKey,
      update.improvement,
      update.timestamp.getTime()
    )
  }

  private async calculateRecommendationCTR(): Promise<number> {
    // 简化的CTR计算，实际应该基于点击数/展示数
    const ratings = await this.redisClient.zrange('recommendation_ratings', 0, -1, 'WITHSCORES')
    if (ratings.length === 0) return 0

    const totalRatings = ratings.length / 2
    const positiveRatings = ratings.filter((_, i) => i % 2 === 1).filter(score => parseFloat(score) >= 4).length

    return positiveRatings / totalRatings
  }

  private async updateSystemHealth(metric: any): Promise<void> {
    // 系统健康分数计算逻辑
    const healthKey = `system_health:${metric.name}`
    await this.redisClient.setex(healthKey, 300, metric.value)
  }

  private async getActiveUsersCount(): Promise<number> {
    // 从Redis获取5分钟内活跃用户数
    const activeUsers = await this.redisClient.scard('active_users_5m')
    return activeUsers || 0
  }

  private async getTotalUsersCount(): Promise<number> {
    // 从ClickHouse或Redis获取总用户数
    const totalUsers = await this.redisClient.get('total_users')
    return parseInt(totalUsers || '0')
  }

  private async getAIConversationsCount(): Promise<number> {
    const conversations = await this.redisClient.get('daily_ai_conversations')
    return parseInt(conversations || '0')
  }

  private async getAverageSatisfaction(): Promise<number> {
    const avgSatisfaction = await this.redisClient.get('average_satisfaction')
    return parseFloat(avgSatisfaction || '0')
  }

  private async getTotalLearningTime(): Promise<number> {
    const learningTime = await this.redisClient.get('daily_learning_time')
    return parseInt(learningTime || '0')
  }

  private async calculateSystemHealth(): Promise<number> {
    // 综合多个指标计算系统健康分数
    const metrics = ['cpu_usage', 'memory_usage', 'disk_usage', 'response_time']
    let totalScore = 0
    let validMetrics = 0

    for (const metric of metrics) {
      const value = await this.redisClient.get(`system_health:${metric}`)
      if (value) {
        totalScore += parseFloat(value)
        validMetrics++
      }
    }

    return validMetrics > 0 ? (totalScore / validMetrics) * 100 : 100
  }

  private async cleanupOldData(): Promise<void> {
    // 清理过期的用户模式数据
    const cutoffTime = Date.now() - (24 * 60 * 60 * 1000) // 24小时前
    for (const [userId, pattern] of this.userPatterns) {
      if (pattern.lastActivity.getTime() < cutoffTime) {
        this.userPatterns.delete(userId)
      }
    }
  }

  private getTableNameForEvent(eventType: string): string {
    const tableMap = {
      'user_action': 'user_events_local',
      'ai_interaction': 'ai_conversations_local',
      'growth_update': 'growth_updates_local',
      'recommendation_feedback': 'recommendation_feedback_local',
      'system_metric': 'system_metrics_local'
    }
    return tableMap[eventType] || 'events_local'
  }
}

/**
 * 异常检测器类
 */
class AnomalyDetector {
  private anomalies: AnomalyEvent[] = []
  private thresholds = {
    // 定义各种异常检测的阈值
    responseTime: 5000, // 5秒
    errorRate: 0.05, // 5%
    resourceUsage: 0.8, // 80%
    churnRiskScore: 0.7 // 70%
  }

  async analyzeUserAction(event: EventData, pattern: UserActivityPattern): Promise<void> {
    // 检测用户行为异常
    if (pattern.riskLevel === 'high') {
      this.addAnomaly({
        type: 'high_churn_risk',
        severity: 'medium',
        description: `用户 ${event.userId} 流失风险高`,
        timestamp: new Date(),
        affectedUsers: 1
      })
    }

    // 检测异常活跃度
    if (pattern.actionsCount > 1000) { // 单个用户短时间内行为过于频繁
      this.addAnomaly({
        type: 'abnormal_activity',
        severity: 'low',
        description: `用户 ${event.userId} 活动异常频繁`,
        timestamp: new Date(),
        affectedUsers: 1
      })
    }
  }

  async runDetection(): Promise<void> {
    // 运行综合异常检测
    await this.detectTrafficAnomalies()
    await this.detectPerformanceAnomalies()
    await this.detectBusinessAnomalies()
  }

  addAnomaly(anomaly: AnomalyEvent): void {
    this.anomalies.push(anomaly)

    // 保持最近100个异常记录
    if (this.anomalies.length > 100) {
      this.anomalies = this.anomalies.slice(-100)
    }
  }

  getRecentAnomalies(): AnomalyEvent[] {
    const oneHourAgo = Date.now() - (60 * 60 * 1000)
    return this.anomalies.filter(anomaly =>
      anomaly.timestamp.getTime() > oneHourAgo
    )
  }

  private async detectTrafficAnomalies(): Promise<void> {
    // 流量异常检测逻辑
    // 实现流量突增或突降检测
  }

  private async detectPerformanceAnomalies(): Promise<void> {
    // 性能异常检测逻辑
    // 实现响应时间、错误率等指标异常检测
  }

  private async detectBusinessAnomalies(): Promise<void> {
    // 业务异常检测逻辑
    // 实现用户流失、转化率等业务指标异常检测
  }
}