/**
 * @file YYC³ 智能预测系统 - 工具类型定义
 * @description 定义工具系统相关的类型接口
 * @module types/tools
 * @author YYC³
 * @version 1.0.0
 * @created 2025-12-29
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

/**
 * 工具能力
 */
export interface ToolCapability {
  name: string
  description: string
  parameters?: Record<string, unknown>
  returnType?: string
}

/**
 * 工具状态
 */
export enum ToolStatus {
  REGISTERED = 'registered',
  READY = 'ready',
  BUSY = 'busy',
  ERROR = 'error',
  DISABLED = 'disabled',
  STOPPED = 'stopped'
}

/**
 * 工具定义
 */
export interface ToolDefinition {
  name: string
  version: string
  description: string
  category: string
  capabilities?: ToolCapability[]
  tags?: string[]
  timeout?: number
  status?: ToolStatus
  registeredAt?: Date
  updatedAt?: Date
  entryPoint?: string
  dependencies?: string[]
}

/**
 * 工具上下文
 */
export interface ToolContext {
  sessionId: string
  userId?: string
  parameters?: Record<string, unknown>
  metadata?: Record<string, unknown>
  toolName?: string
}

/**
 * 工具指标
 */
export interface ToolMetrics {
  executionCount: number
  successCount: number
  failureCount: number
  errorCount: number
  averageExecutionTime: number
  lastExecutionTime?: Date
  lastExecutedAt?: Date
  lastStatus?: string
  qualityScore: number
}

/**
 * 工具注册表配置
 */
export interface ToolRegistryConfig {
  maxConcurrentExecutions?: number
  healthCheckInterval?: number
  metricsRetentionDays?: number
  enableSemanticSearch?: boolean
  enableAutoOptimization?: boolean
  enableDependencyResolution?: boolean
}

/**
 * 工具执行请求
 */
export interface ToolExecutionRequest {
  toolName: string
  context: ToolContext
  parameters?: Record<string, unknown>
  userId?: string
  sessionId?: string
  metadata?: Record<string, unknown>
  timeout?: number
}

/**
 * 工具执行结果
 */
export interface ToolExecutionResult {
  success: boolean
  data?: unknown
  error?: string
  executionTime: number
  timestamp: Date
  metadata?: Record<string, unknown>
}

/**
 * 工具编排请求
 */
export interface ToolOrchestrationRequest {
  goal: string
  context?: ToolContext
  constraints?: Record<string, unknown>
  requiredCapabilities?: string[]
  preferredTools?: string[]
}

/**
 * 工具执行步骤
 */
export interface ToolExecutionStep {
  id: string
  toolName: string
  description: string
  estimatedDuration: number
  dependencies: string[]
}

/**
 * 工具编排计划
 */
export interface ToolOrchestrationPlan {
  id: string
  goal: string
  requiredTools: string[]
  steps: ToolExecutionStep[]
  estimatedDuration: number
  createdAt: Date
  dependencies?: string[]
}

/**
 * 工具执行响应
 */
export interface ToolExecutionResponse {
  message: string
  parameters?: Record<string, unknown>
  timestamp: Date
}

/**
 * 编排步骤
 */
export interface OrchestrationStep {
  id: string
  toolName: string
  description: string
  estimatedDuration: number
  dependencies: string[]
  parameters?: Record<string, unknown>
  retryPolicy?: {
    maxRetries: number
    backoffMs: number
  }
}

/**
 * 编排执行状态
 */
export interface OrchestrationExecutionStatus {
  planId: string
  completedSteps: string[]
  failedSteps: string[]
  startTime: Date
  endTime?: Date
  progress: number
  results: Map<string, ToolExecutionResult>
  errors: Array<{
    step: string
    error: string
    timestamp: Date
  }>
  userId?: string
}
