/**
 * YYC³ 智能预测系统 - 服务编排器类型定义
 * 定义服务编排和系统管理相关的类型
 */

/**
 * 编排配置
 */
export interface OrchestrationConfig {
  enableAutoScaling?: boolean
  enableHealthChecks?: boolean
  enableMetrics?: boolean
  enableServiceDiscovery?: boolean
  healthCheckInterval?: number
  metricsInterval?: number
  scalingCooldown?: number
  maxReplicas?: number
  minReplicas?: number
  loadBalancingStrategy?: LoadBalancingStrategy
  serviceRegistry?: string
  gatewayPort?: number
  enableCircuitBreaker?: boolean
  enableRateLimiting?: boolean
  enableRetry?: boolean
  retryAttempts?: number
  retryDelay?: number
}

/**
 * 负载均衡策略
 */
export type LoadBalancingStrategy =
  | 'round_robin'
  | 'weighted_round_robin'
  | 'least_connections'
  | 'least_response_time'
  | 'random'
  | 'consistent_hash'
  | 'ip_hash'
  | 'session_affinity'

/**
 * 服务健康状态
 */
export interface ServiceHealth {
  status: 'healthy' | 'unhealthy' | 'degraded'
  uptime?: number
  lastCheck: Date
  details?: string
  metrics?: ServiceMetrics
  error?: string
  warnings?: string[]
  lastRestart?: Date
  restartCount?: number
}

/**
 * 服务指标
 */
export interface ServiceMetrics {
  requests: {
    total: number
    successful: number
    failed: number
    averageResponseTime: number
    minResponseTime: number
    maxResponseTime: number
    p95ResponseTime: number
    p99ResponseTime: number
  }
  resources: {
    memory: {
      used: number
      total: number
      percentage: number
    }
    cpu: {
      usage: number
      load: number
    }
  }
  connections: {
    active: number
    total: number
    rejected: number
  }
  cache?: {
    hits: number
    misses: number
    hitRate: number
    size: number
  }
  errors: {
    total: number
    byType: Record<string, number>
    recent: Array<{
      error: string
      timestamp: Date
      count: number
    }>
  }
}

/**
 * 系统指标
 */
export interface SystemMetrics {
  timestamp: Date
  uptime: number
  memory: {
    used: number
    total: number
    external: number
    rss: number
  }
  cpu: {
    user: number
    system: number
    idle: number
  }
  services: {
    total: number
    healthy: number
    unhealthy: number
    degraded: number
  }
  requests: {
    total: number
    successful: number
    failed: number
    averageResponseTime: number
  }
  collectionTime: number
  serviceMetrics?: Map<string, any>
  apiMetrics?: Map<string, any>
  network?: {
    bytesIn: number
    bytesOut: number
    connections: number
  }
  disk?: {
    used: number
    total: number
    percentage: number
  }
}

/**
 * 部署状态
 */
export interface DeploymentStatus {
  environment: string
  version: string
  deployedAt: Date
  services: {
    total: number
    healthy: number
    unhealthy: number
    degraded: number
  }
  health: 'healthy' | 'degraded' | 'unhealthy'
  uptime: number
  memory: {
    used: number
    total: number
  }
  cpu: {
    user: number
    system: number
  }
  lastHealthCheck: Date
  features?: Record<string, boolean>
  configuration?: Record<string, any>
  scaling?: ScalingStatus
}

/**
 * 扩展状态
 */
export interface ScalingStatus {
  currentReplicas: number
  desiredReplicas: number
  minReplicas: number
  maxReplicas: number
  lastScale?: Date
  scalingEvents: Array<{
    timestamp: Date
    from: number
    to: number
    reason: string
    triggeredBy: string
  }>
  policies: ScalingPolicy[]
}

/**
 * 扩展策略
 */
export interface ScalingPolicy {
  id: string
  name: string
  description: string
  serviceId: string
  enabled: boolean
  metrics: ScalingMetric[]
  minReplicas: number
  maxReplicas: number
  cooldownPeriod: number
  behavior: 'scale_up' | 'scale_down' | 'both'
  thresholds: {
    scaleUpThreshold: number
    scaleDownThreshold: number
    evaluationWindow: number
  }
}

/**
 * 扩展指标
 */
export interface ScalingMetric {
  name: string
  type: 'cpu' | 'memory' | 'requests_per_second' | 'response_time' | 'custom'
  targetValue: number
  currentValue?: number
  weight: number
  aggregation: 'average' | 'max' | 'sum' | 'p95'
}

/**
 * 服务注册表
 */
export interface ServiceRegistry {
  services: ServiceInfo[]
  lastUpdated: Date
  totalServices: number
}

/**
 * 服务信息
 */
export interface ServiceInfo {
  name: string
  id: string
  version: string
  host: string
  port: number
  protocol: 'http' | 'https' | 'ws' | 'wss'
  status: 'running' | 'stopped' | 'error'
  health: 'healthy' | 'unhealthy' | 'degraded'
  metadata: Record<string, any>
  tags?: string[]
  dependencies?: string[]
  loadBalancer?: LoadBalancerInfo
}

/**
 * 负载均衡器信息
 */
export interface LoadBalancerInfo {
  strategy: LoadBalancingStrategy
  instances: LoadBalancerInstance[]
  healthStatus: Record<string, 'healthy' | 'unhealthy'>
  stats: LoadBalancerStats
}

/**
 * 负载均衡器实例
 */
export interface LoadBalancerInstance {
  id: string
  host: string
  port: number
  weight: number
  status: 'healthy' | 'unhealthy' | 'draining'
  connections: number
  responseTime: number
  lastHealthCheck: Date
}

/**
 * 负载均衡器统计
 */
export interface LoadBalancerStats {
  totalRequests: number
  activeConnections: number
  averageResponseTime: number
  requestDistribution: Record<string, number>
  errorRate: number
  throughput: number
}

/**
 * 服务依赖
 */
export interface ServiceDependency {
  serviceId: string
  dependsOn: string[]
  type: 'hard' | 'soft'
  healthImpact: 'critical' | 'major' | 'minor'
  timeout?: number
  retries?: number
  circuitBreaker?: boolean
}

/**
 * 服务拓扑
 */
export interface ServiceTopology {
  nodes: TopologyNode[]
  edges: TopologyEdge[]
  metadata: {
    generatedAt: Date
    version: string
    totalNodes: number
    totalEdges: number
  }
}

/**
 * 拓扑节点
 */
export interface TopologyNode {
  id: string
  name: string
  type: 'service' | 'gateway' | 'database' | 'cache' | 'queue'
  status: 'healthy' | 'unhealthy' | 'degraded'
  metadata: Record<string, any>
  position?: {
    x: number
    y: number
  }
  metrics?: {
    requests: number
    errors: number
    responseTime: number
  }
}

/**
 * 拓扑边
 */
export interface TopologyEdge {
  source: string
  target: string
  type: 'synchronous' | 'asynchronous' | 'data_flow' | 'dependency'
  weight: number
  metadata: Record<string, any>
  metrics?: {
    requestCount: number
    errorCount: number
    averageLatency: number
  }
}

/**
 * 服务配置
 */
export interface ServiceConfiguration {
  id: string
  name: string
  version: string
  environment: 'development' | 'staging' | 'production'
  replicas: number
  resources: ResourceRequirements
  envVars: Record<string, string>
  healthCheck: HealthCheckConfig
  scaling?: ScalingPolicy
  dependencies?: ServiceDependency[]
  limits?: ServiceLimits
}

/**
 * 资源需求
 */
export interface ResourceRequirements {
  cpu: {
    request: string
    limit: string
  }
  memory: {
    request: string
    limit: string
  }
  storage?: {
    size: string
    class: string
  }
  gpu?: {
    count: number
    type: string
  }
}

/**
 * 健康检查配置
 */
export interface HealthCheckConfig {
  path: string
  port: number
  protocol: 'http' | 'https' | 'tcp'
  interval: number
  timeout: number
  retries: number
  successThreshold: number
  failureThreshold: number
  expectedStatus?: number
  command?: string
}

/**
 * 服务限制
 */
export interface ServiceLimits {
  maxConnections?: number
  maxRequestsPerSecond?: number
  maxRequestSize?: number
  maxResponseSize?: number
  timeout?: number
  rateLimit?: RateLimit
}

/**
 * 速率限制
 */
export interface RateLimit {
  windowMs: number
  maxRequests: number
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
  keyGenerator?: string
}

/**
 * 服务监控
 */
export interface ServiceMonitoring {
  id: string
  name: string
  type: 'prometheus' | 'datadog' | 'custom'
  config: Record<string, any>
  enabled: boolean
  alerts: MonitoringAlert[]
  dashboards: MonitoringDashboard[]
}

/**
 * 监控告警
 */
export interface MonitoringAlert {
  id: string
  name: string
  condition: string
  threshold: number
  duration: number
  severity: 'low' | 'medium' | 'high' | 'critical'
  enabled: boolean
  channels: AlertChannel[]
  labels?: Record<string, string>
}

/**
 * 告警渠道
 */
export interface AlertChannel {
  type: 'email' | 'slack' | 'webhook' | 'sms' | 'pagerduty'
  config: Record<string, any>
  enabled: boolean
  filters?: Record<string, any>
}

/**
 * 监控仪表板
 */
export interface MonitoringDashboard {
  id: string
  name: string
  url?: string
  widgets: DashboardWidget[]
  refreshInterval?: number
  timeRange?: string
}

/**
 * 仪表板组件
 */
export interface DashboardWidget {
  id: string
  type: 'graph' | 'stat' | 'table' | 'heatmap' | 'gauge'
  title: string
  query: string
  visualization: Record<string, any>
  position: {
    x: number
    y: number
    width: number
    height: number
  }
}

/**
 * 服务日志
 */
export interface ServiceLogging {
  enabled: boolean
  level: 'debug' | 'info' | 'warn' | 'error'
  format: 'json' | 'text'
  outputs: LogOutput[]
  structured: boolean
  includeRequestContext: boolean
  includeResponseContext: boolean
  sampling?: number
}

/**
 * 日志输出
 */
export interface LogOutput {
  type: 'console' | 'file' | 'elasticsearch' | 'splunk' | 'syslog'
  config: Record<string, any>
  enabled: boolean
  level?: string
  format?: string
}

/**
 * 服务安全
 */
export interface ServiceSecurity {
  authentication: AuthenticationConfig
  authorization: AuthorizationConfig
  encryption: EncryptionConfig
  network: NetworkSecurityConfig
  audit: AuditConfig
}

/**
 * 认证配置
 */
export interface AuthenticationConfig {
  enabled: boolean
  type: 'jwt' | 'oauth2' | 'basic' | 'apikey' | 'custom'
  providers: AuthProvider[]
  sessionConfig?: SessionConfig
}

/**
 * 授权配置
 */
export interface AuthorizationConfig {
  enabled: boolean
  type: 'rbac' | 'abac' | 'custom'
  policies: AuthorizationPolicy[]
  defaultPolicy: 'allow' | 'deny'
}

/**
 * 加密配置
 */
export interface EncryptionConfig {
  enabled: boolean
  tls: {
    version: string
    ciphers: string[]
    certificates: CertificateConfig
  }
  dataEncryption?: {
    algorithm: string
    keySize: number
    rotationInterval: number
  }
}

/**
 * 网络安全配置
 */
export interface NetworkSecurityConfig {
  firewall: FirewallConfig
  cors: CORSConfig
  rateLimiting: RateLimitConfig
  ddosProtection: DDoSProtectionConfig
}

/**
 * 审计配置
 */
export interface AuditConfig {
  enabled: boolean
  events: AuditEvent[]
  storage: AuditStorage
  retentionPeriod: number
}

/**
 * 服务备份
 */
export interface ServiceBackup {
  enabled: boolean
  schedule: string
  retention: number
  storage: BackupStorage
  datasets: BackupDataset[]
  encryption?: boolean
}

/**
 * 服务灾难恢复
 */
export interface ServiceDisasterRecovery {
  enabled: boolean
  rpo: number // Recovery Point Objective in seconds
  rto: number // Recovery Time Objective in seconds
  backupLocations: string[]
  failoverStrategy: FailoverStrategy
  recoveryProcedures: RecoveryProcedure[]
  testing: {
    enabled: boolean
    frequency: string
    lastTest?: Date
  }
}

/**
 * 故障转移策略
 */
export interface FailoverStrategy {
  type: 'active_passive' | 'active_active' | 'multi_region'
  failoverTrigger: string
  automaticFailover: boolean
  healthCheckInterval: number
  maxFailures: number
  cooldownPeriod: number
}

/**
 * 恢复程序
 */
export interface RecoveryProcedure {
  id: string
  name: string
  description: string
  steps: RecoveryStep[]
  estimatedTime: number
  dependencies: string[]
  rollbackProcedure?: RecoveryProcedure
}

/**
 * 恢复步骤
 */
export interface RecoveryStep {
  id: string
  name: string
  description: string
  command: string
  timeout: number
  retries: number
  expectedOutcome: string
  rollback?: string
}

// ========== 额外的安全与配置类型定义 ==========

/**
 * 认证提供者
 */
export interface AuthProvider {
  name: string
  type: 'jwt' | 'oauth2' | 'saml' | 'ldap' | 'custom'
  config: Record<string, any>
  enabled: boolean
}

/**
 * 会话配置
 */
export interface SessionConfig {
  timeout: number
  refreshThreshold: number
  cookieName?: string
  secure: boolean
  httpOnly: boolean
  sameSite: 'strict' | 'lax' | 'none'
}

/**
 * 授权策略
 */
export interface AuthorizationPolicy {
  id: string
  name: string
  effect: 'allow' | 'deny'
  principals: string[]
  actions: string[]
  resources: string[]
  conditions?: Record<string, any>
}

/**
 * 证书配置
 */
export interface CertificateConfig {
  cert: string
  key: string
  ca?: string[]
  passphrase?: string
}

/**
 * 防火墙配置
 */
export interface FirewallConfig {
  enabled: boolean
  rules: FirewallRule[]
  defaultPolicy: 'allow' | 'deny'
  logLevel: 'none' | 'basic' | 'detailed'
}

/**
 * 防火墙规则
 */
export interface FirewallRule {
  id: string
  name: string
  direction: 'inbound' | 'outbound'
  protocol: 'tcp' | 'udp' | 'icmp' | 'any'
  ports?: string
  source?: string
  destination?: string
  action: 'allow' | 'deny'
  priority: number
}

/**
 * CORS 配置
 */
export interface CORSConfig {
  enabled: boolean
  origins: string[]
  methods: string[]
  allowedHeaders: string[]
  exposedHeaders: string[]
  credentials: boolean
  maxAge: number
}

/**
 * 速率限制配置
 */
export interface RateLimitConfig {
  enabled: boolean
  windowMs: number
  maxRequests: number
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
}

/**
 * DDoS 保护配置
 */
export interface DDoSProtectionConfig {
  enabled: boolean
  threshold: number
  windowSeconds: number
  banDuration: number
  whitelist: string[]
  blacklist: string[]
}

/**
 * 审计事件
 */
export interface AuditEvent {
  type: string
  severity: 'info' | 'warning' | 'error' | 'critical'
  category: string
  enabled: boolean
  notify: boolean
}

/**
 * 审计存储
 */
export interface AuditStorage {
  type: 'file' | 'database' | 's3' | 'syslog'
  config: Record<string, any>
  retentionDays: number
  compression: boolean
  encryption: boolean
}

/**
 * 备份存储
 */
export interface BackupStorage {
  type: 'local' | 's3' | 'gcs' | 'azure' | 'sftp'
  path: string
  credentials?: Record<string, any>
  encryption: boolean
  compression: boolean
}

/**
 * 备份数据集
 */
export interface BackupDataset {
  name: string
  path: string
  type: 'database' | 'files' | 'config' | 'logs'
  schedule: string
  retention: number
  priority: 'low' | 'medium' | 'high'
  enabled: boolean
}