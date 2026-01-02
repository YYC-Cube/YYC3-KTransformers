/**
 * @fileoverview 分析模块类型定义
 * @description 用于实时活动流和核心指标概览
 * @author YYC³
 * @version 1.0.0
 */

export interface AlertData {
  id: string
  type: 'error' | 'warning' | 'info' | 'success'
  severity: 'critical' | 'high' | 'medium' | 'low'
  title: string
  message: string
  timestamp: string
  source: string
  acknowledged: boolean
  resolved?: boolean
  metadata?: Record<string, unknown>
  actions?: Array<{ id: string; label: string; type: string }>
}

export interface RealtimeActivity {
  id: string
  type: 'user_action' | 'system_event' | 'ai_interaction' | 'business_event'
  timestamp: string
  description: string
  details: {
    duration: number
    success: boolean
    userId?: string
    sessionId: string
  }
  impact: 'low' | 'medium' | 'high'
  metadata: {
    ip: string
    userAgent: string
    location: string
    device: string
  }
}

export interface RealtimeMetrics {
  activeUsers: number
  newUsers: number
  aiConversations: number
  averageSatisfaction: number
  systemHealth: number
  responseTime: number
  errorRate: number
  lastUpdated: string
  totalUsers: number
}

export interface TrendChartData {
  timestamp: string
  time: string
  activeUsers: number
  aiConversations: number
  satisfaction: number
  systemHealth: number
  responseTime: number
  pageViews: number
}

export interface BusinessInsights {
  keyFindings: Array<{
    id: string
    type: 'opportunity' | 'risk' | 'trend'
    title: string
    description: string
    impact: 'high' | 'medium' | 'low'
    confidence: number
    metrics: string[]
    recommendations: string[]
    data: {
      current: number
      previous: number
      change: string
    }
  }>
  predictions: Array<{
    id: string
    type: 'growth' | 'performance' | 'risk'
    title: string
    description: string
    confidence: number
    timeframe: string
    keyDrivers: string[]
    scenarios: {
      optimistic: string
      realistic: string
      pessimistic: string
    }
  }>
  recommendations: Array<{
    id: string
    priority: 'high' | 'medium' | 'low'
    category: 'optimization' | 'growth' | 'risk'
    title: string
    description: string
    expectedImpact: string
    effort: 'high' | 'medium' | 'low'
    timeline: string
    dependencies: string[]
    successMetrics: string[]
  }>
  generatedAt: string
  confidence: number
  dataQuality: 'high' | 'medium' | 'low'
}
