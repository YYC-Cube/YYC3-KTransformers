/**
 * @file YYC³ 智能预测系统 - API网关类型定义
 * @description 定义API网关相关的类型接口
 * @module types/gateway
 * @author YYC³
 * @version 1.0.0
 * @created 2025-12-29
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

/**
 * 负载均衡策略
 */
export type LoadBalancingStrategy = 'round_robin' | 'least_connections' | 'random' | 'weighted'

/**
 * 熔断器状态
 */
export type CircuitBreakerState = 'closed' | 'open' | 'half_open'

/**
 * 健康检查状态
 */
export type HealthStatus = 'healthy' | 'unhealthy' | 'degraded'

/**
 * HTTP方法
 */
export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS' | 'ALL'

/**
 * API网关配置
 */
export interface GatewayConfig {
  port?: number | string
  host?: string
  maxConnections?: number
  requestTimeout?: number
  enableMetrics?: boolean
  enableCircuitBreaker?: boolean
  enableRateLimit?: boolean
  enableAuth?: boolean
  healthCheckInterval?: number
  retryAttempts?: number
  retryDelay?: number
  loadBalancingStrategy?: LoadBalancingStrategy
  authentication?: AuthenticationConfig
}

/**
 * 服务定义
 */
export interface ServiceDefinition {
  id: string
  name: string
  host: string
  port: number
  protocol?: string
  basePath?: string
  timeout?: number
  weight?: number
  authentication?: boolean
  rateLimit?: RateLimit
  circuitBreaker?: boolean
  tags?: string[]
  metadata?: Record<string, unknown>
}

/**
 * 服务实例
 */
export interface ServiceInstance {
  protocol: string
  host: string
  port: number
  weight?: number
  metadata?: Record<string, unknown>
}

/**
 * 路由定义
 */
export interface RouteDefinition {
  path: string
  method: HTTPMethod
  serviceId: string
  handler: RouteHandler
  middleware?: string[]
  timeout?: number
  cache?: boolean
  rateLimit?: RateLimit
  authentication?: boolean
}

/**
 * 路由处理器
 */
export type RouteHandler = (request: Request, metadata: RequestMetadata) => Promise<Response>

/**
 * 请求元数据
 */
export interface RequestMetadata {
  requestId: string
  path: string
  method: string
  startTime: number
  userAgent: string
  ip: string
  headers: Record<string, string>
  userId?: string
  sessionId?: string
}

/**
 * 响应元数据
 */
export interface ResponseMetadata {
  requestId: string
  duration: number
  statusCode: number
  serviceId: string
  cacheHit: boolean
  error: string | null
}

/**
 * 健康检查
 */
export interface HealthCheck {
  serviceId: string
  status: HealthStatus
  lastCheck: Date
  responseTime?: number
  error?: string
  details?: string
}

/**
 * 熔断器
 */
export interface CircuitBreaker {
  serviceId: string
  state: CircuitBreakerState
  failureCount: number
  successCount: number
  lastFailureTime: Date | null
  timeout?: number
  threshold?: number
}

/**
 * 速率限制
 */
export interface RateLimit {
  maxRequests: number
  windowMs: number
  burstLimit?: number
}

/**
 * 速率限制结果
 */
export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetTime: Date
  retryAfter?: number
}

/**
 * 认证配置
 */
export interface AuthenticationConfig {
  type: 'jwt' | 'api_key' | 'oauth2' | 'basic'
  secret?: string
  publicKey?: string
  issuer?: string
  audience?: string
  expiresIn?: number
}

/**
 * 指标
 */
export interface Metrics {
  totalRequests: number
  successfulRequests: number
  failedRequests: number
  averageResponseTime: number
  requestsPerSecond: number
  errorRate: number
  serviceMetrics: Map<string, ServiceMetrics>
  recordRequest(metadata: RequestMetadata): void
  recordResponse(metadata: ResponseMetadata): void
  getMetrics(): Metrics
}

/**
 * 服务指标
 */
export interface ServiceMetrics {
  serviceId: string
  totalRequests: number
  successfulRequests: number
  failedRequests: number
  averageResponseTime: number
  lastRequestTime: Date
}

/**
 * 服务发现
 */
export interface ServiceDiscovery {
  register(service: ServiceDefinition): Promise<void>
  unregister(serviceId: string): Promise<void>
  discover(): Promise<ServiceDefinition[]>
  getService(serviceId: string): Promise<ServiceDefinition | undefined>
  cleanup(): Promise<void>
}

/**
 * 负载均衡器
 */
export interface LoadBalancer {
  selectInstance(service: ServiceDefinition): Promise<ServiceInstance>
}

/**
 * 熔断器管理器
 */
export interface CircuitBreakerManager {
  registerService(serviceId: string): Promise<void>
  unregisterService(serviceId: string): Promise<void>
  getState(serviceId: string): Promise<CircuitBreaker>
  recordSuccess(serviceId: string): Promise<void>
  recordFailure(serviceId: string): Promise<void>
}

/**
 * 速率限制器
 */
export interface RateLimiter {
  registerService(serviceId: string, rateLimit?: RateLimit): Promise<void>
  checkLimit(identifier: string, serviceId: string): Promise<RateLimitResult>
}

/**
 * 认证器
 */
export interface Authenticator {
  authenticate(request: Request, metadata: RequestMetadata): Promise<void>
}

/**
 * 路由映射
 */
export type RouteMap = Record<string, Record<string, RouteHandler>>

/**
 * 服务器实例
 */
export type ServerInstance = {
  stop: () => void
  port: number
  hostname: string
}
