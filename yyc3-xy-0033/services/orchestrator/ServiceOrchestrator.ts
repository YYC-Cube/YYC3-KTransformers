/**
 * YYC³ 智能预测系统 - 服务编排器
 * 统一协调和管理所有微服务组件
 */

import { EventEmitter } from 'events'
import { AgenticCore } from '../core/AgenticCore'
import { ToolManager } from '../tools/ToolManager'
import { KnowledgeManager } from '../knowledge/KnowledgeManager'
import { GoalManagementSystem } from '../goals/GoalManagementSystem'
import { MetaLearningSystem } from '../learning/MetaLearningSystem'
import { APIGateway } from '../gateway/APIGateway'
import { ToolAPIService } from '../api/ToolAPIService'
import { KnowledgeAPIService } from '../api/KnowledgeAPIService'
import type {
  OrchestrationConfig,
  ServiceHealth,
  SystemMetrics,
  DeploymentStatus,
  ServiceRegistry,
  ScalingPolicy,
  LoadBalancingConfig
} from '../types/orchestrator/common'

/**
 * 服务编排器
 * 统一管理所有系统组件的生命周期和协调
 */
export class ServiceOrchestrator extends EventEmitter {
  private config: OrchestrationConfig
  private services: Map<string, any> = new Map()
  private apiServices: Map<string, any> = new Map()
  private isInitialized = false
  private healthCheckInterval?: NodeJS.Timeout

  constructor(config: OrchestrationConfig = {}) {
    super()
    this.config = {
      enableAutoScaling: true,
      enableHealthChecks: true,
      enableMetrics: true,
      enableServiceDiscovery: true,
      healthCheckInterval: 30000,
      metricsInterval: 60000,
      scalingCooldown: 300000,
      maxReplicas: 10,
      minReplicas: 1,
      loadBalancingStrategy: 'round_robin',
      serviceRegistry: 'consul',
      ...config
    }
  }

  /**
   * 初始化服务编排器
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return

    try {
      console.log('🎼 初始化服务编排器...')

      // 初始化核心服务
      await this.initializeCoreServices()

      // 初始化API服务
      await this.initializeAPIServices()

      // 初始化API网关
      await this.initializeAPIGateway()

      // 启动健康检查
      if (this.config.enableHealthChecks) {
        this.startHealthChecks()
      }

      // 启动指标收集
      if (this.config.enableMetrics) {
        this.startMetricsCollection()
      }

      this.isInitialized = true
      console.log('✅ 服务编排器初始化完成')
      this.emit('initialized')

    } catch (error) {
      console.error('❌ 服务编排器初始化失败:', error)
      this.emit('initializationError', error)
      throw error
    }
  }

  /**
   * 初始化核心服务
   */
  private async initializeCoreServices(): Promise<void> {
    console.log('🔧 初始化核心服务...')

    // 1. 初始化自治核心引擎
    const agenticCore = new AgenticCore()
    await agenticCore.initialize()
    this.services.set('agenticCore', agenticCore)

    // 2. 初始化工具管理器
    const toolManager = new ToolManager()
    await toolManager.initialize()
    this.services.set('toolManager', toolManager)

    // 3. 初始化知识管理器
    const knowledgeManager = new KnowledgeManager()
    await knowledgeManager.initialize()
    this.services.set('knowledgeManager', knowledgeManager)

    // 4. 初始化目标管理系统
    const goalManager = new GoalManagementSystem()
    await goalManager.initialize()
    this.services.set('goalManager', goalManager)

    // 5. 初始化元学习系统
    const metaLearningSystem = new MetaLearningSystem()
    await metaLearningSystem.initialize()
    this.services.set('metaLearningSystem', metaLearningSystem)

    console.log('✅ 核心服务初始化完成')
  }

  /**
   * 初始化API服务
   */
  private async initializeAPIServices(): Promise<void> {
    console.log('🌐 初始化API服务...')

    // 1. 初始化工具API服务
    const toolAPIService = new ToolAPIService()
    await toolAPIService.initialize()
    this.apiServices.set('toolAPI', toolAPIService)

    // 2. 初始化知识API服务
    const knowledgeAPIService = new KnowledgeAPIService()
    await knowledgeAPIService.initialize()
    this.apiServices.set('knowledgeAPI', knowledgeAPIService)

    console.log('✅ API服务初始化完成')
  }

  /**
   * 初始化API网关
   */
  private async initializeAPIGateway(): Promise<void> {
    console.log('🚪 初始化API网关...')

    const apiGateway = new APIGateway({
      port: this.config.gatewayPort || 1229,
      host: 'localhost',
      enableMetrics: this.config.enableMetrics,
      enableCircuitBreaker: true,
      enableRateLimit: true,
      enableAuth: true,
      healthCheckInterval: this.config.healthCheckInterval,
      loadBalancingStrategy: this.config.loadBalancingStrategy,
      authentication: {
        enabled: true,
        type: 'jwt',
        secret: process.env.JWT_SECRET || 'your-secret-key'
      },
      serviceDiscovery: {
        enabled: true,
        discoveryInterval: 30000,
        healthCheckTimeout: 5000
      }
    })

    await apiGateway.initialize()
    this.services.set('apiGateway', apiGateway)

    // 初始化服务发现系统
    if (this.config.enableServiceDiscovery) {
      await this.initializeServiceDiscovery(apiGateway)
    }

    // 注册API服务到网关
    await this.registerAPIServicesToGateway(apiGateway)

    console.log('✅ API网关初始化完成')
  }

  /**
   * 初始化服务发现系统
   */
  private async initializeServiceDiscovery(apiGateway: APIGateway): Promise<void> {
    try {
      console.log('🔍 初始化服务发现系统...')
      
      // 获取服务发现实例
      const serviceDiscovery = apiGateway.getServiceDiscovery()
      
      // 启动服务发现
      await serviceDiscovery.initialize()
      
      // 设置服务发现事件监听
      serviceDiscovery.on('serviceRegistered', (service) => {
        console.log(`📝 服务注册: ${service.name} (${service.id})`)
        this.emit('serviceRegistered', service)
      })
      
      serviceDiscovery.on('serviceUnregistered', (serviceId) => {
        console.log(`🗑️ 服务注销: ${serviceId}`)
        this.emit('serviceUnregistered', serviceId)
      })
      
      serviceDiscovery.on('serviceHealthChanged', (serviceId, status) => {
        console.log(`🏥 服务健康状态变化: ${serviceId} -> ${status}`)
        this.emit('serviceHealthChanged', { serviceId, status })
      })
      
      // 注册核心服务到服务发现系统
      await this.registerCoreServicesToDiscovery(serviceDiscovery)
      
      console.log('✅ 服务发现系统初始化完成')
      
    } catch (error) {
      console.error('❌ 服务发现系统初始化失败:', error)
      throw error
    }
  }

  /**
   * 注册核心服务到服务发现系统
   */
  private async registerCoreServicesToDiscovery(serviceDiscovery: any): Promise<void> {
    try {
      console.log('📋 注册核心服务到服务发现系统...')
      
      // 注册自治核心引擎
      const agenticCore = this.services.get('agenticCore')
      if (agenticCore) {
        await serviceDiscovery.register({
          id: 'agentic-core',
          name: 'Agentic Core Engine',
          version: '1.0.0',
          host: 'localhost',
          port: process.env.AGENTIC_CORE_PORT || 3003,
          protocol: 'http',
          basePath: '/api/core',
          healthCheckPath: '/health',
          metadata: {
            type: 'core',
            description: '自治核心引擎，负责目标驱动和事件驱动的混合架构'
          }
        })
      }
      
      // 注册工具管理器
      const toolManager = this.services.get('toolManager')
      if (toolManager) {
        await serviceDiscovery.register({
          id: 'tool-manager',
          name: 'Tool Manager',
          version: '1.0.0',
          host: 'localhost',
          port: process.env.TOOL_MANAGER_PORT || 3004,
          protocol: 'http',
          basePath: '/api/tools',
          healthCheckPath: '/health',
          metadata: {
            type: 'management',
            description: '工具管理器，负责工具注册、发现和编排'
          }
        })
      }
      
      // 注册知识管理器
      const knowledgeManager = this.services.get('knowledgeManager')
      if (knowledgeManager) {
        await serviceDiscovery.register({
          id: 'knowledge-manager',
          name: 'Knowledge Manager',
          version: '1.0.0',
          host: 'localhost',
          port: process.env.KNOWLEDGE_MANAGER_PORT || 3005,
          protocol: 'http',
          basePath: '/api/knowledge',
          healthCheckPath: '/health',
          metadata: {
            type: 'management',
            description: '知识管理器，负责知识图谱和语义搜索'
          }
        })
      }
      
      // 注册目标管理系统
      const goalManager = this.services.get('goalManager')
      if (goalManager) {
        await serviceDiscovery.register({
          id: 'goal-manager',
          name: 'Goal Management System',
          version: '1.0.0',
          host: 'localhost',
          port: process.env.GOAL_MANAGER_PORT || 3006,
          protocol: 'http',
          basePath: '/api/goals',
          healthCheckPath: '/health',
          metadata: {
            type: 'management',
            description: '目标管理系统，负责目标设定和跟踪'
          }
        })
      }
      
      // 注册元学习系统
      const metaLearningSystem = this.services.get('metaLearningSystem')
      if (metaLearningSystem) {
        await serviceDiscovery.register({
          id: 'meta-learning-system',
          name: 'Meta Learning System',
          version: '1.0.0',
          host: 'localhost',
          port: process.env.META_LEARNING_PORT || 3007,
          protocol: 'http',
          basePath: '/api/learning',
          healthCheckPath: '/health',
          metadata: {
            type: 'learning',
            description: '元学习系统，负责学习和适应'
          }
        })
      }
      
      console.log('✅ 核心服务注册到服务发现系统完成')
      
    } catch (error) {
      console.error('❌ 核心服务注册失败:', error)
      throw error
    }
  }

  /**
   * 注册API服务到网关
   */
  private async registerAPIServicesToGateway(apiGateway: APIGateway): Promise<void> {
    try {
      // 注册工具服务
      const toolService = {
        id: 'tool-service',
        name: 'Tool Service',
        version: '1.0.0',
        host: 'localhost',
        port: process.env.TOOL_SERVICE_PORT || 3001,
        protocol: 'http' as const,
        basePath: '/api/tools',
        healthCheckPath: '/health',
        authentication: true,
        rateLimit: {
          windowMs: 60000,
          maxRequests: 1000
        },
        circuitBreaker: true
      }
      await apiGateway.registerService(toolService)

      // 注册知识服务
      const knowledgeService = {
        id: 'knowledge-service',
        name: 'Knowledge Service',
        version: '1.0.0',
        host: 'localhost',
        port: process.env.KNOWLEDGE_SERVICE_PORT || 3002,
        protocol: 'http' as const,
        basePath: '/api/knowledge',
        healthCheckPath: '/health',
        authentication: true,
        rateLimit: {
          windowMs: 60000,
          maxRequests: 500
        },
        circuitBreaker: true
      }
      await apiGateway.registerService(knowledgeService)

      console.log('✅ API服务注册到网关完成')

    } catch (error) {
      console.error('❌ API服务注册失败:', error)
      throw error
    }
  }

  /**
   * 获取服务健康状态
   */
  async getServiceHealth(): Promise<Map<string, ServiceHealth>> {
    const healthStatus = new Map<string, ServiceHealth>()

    // 检查核心服务健康状态
    for (const [serviceName, service] of this.services) {
      try {
        let status: 'healthy' | 'unhealthy' | 'degraded' = 'healthy'
        let details = ''
        let uptime = 0

        // 根据服务类型进行健康检查
        if (serviceName === 'apiGateway') {
          const gatewayHealth = await (service as APIGateway).getServiceHealth()
          status = Object.values(gatewayHealth).every(h => h.status === 'healthy') ? 'healthy' : 'degraded'
          details = `检查了 ${Object.keys(gatewayHealth).length} 个服务`
        } else if (service.getStatus) {
          // 通用健康检查
          const serviceStatus = service.getStatus()
          status = serviceStatus === 'running' ? 'healthy' : 'unhealthy'
          uptime = service.uptime || 0
        }

        healthStatus.set(serviceName, {
          status,
          uptime,
          lastCheck: new Date(),
          details,
          metrics: await this.getServiceMetrics(serviceName)
        })

      } catch (error) {
        healthStatus.set(serviceName, {
          status: 'unhealthy',
          uptime: 0,
          lastCheck: new Date(),
          details: error instanceof Error ? error.message : String(error),
          error: error instanceof Error ? error.stack : String(error)
        })
      }
    }

    return healthStatus
  }

  /**
   * 获取系统指标
   */
  async getSystemMetrics(): Promise<SystemMetrics> {
    const startTime = Date.now()

    try {
      // 收集各服务指标
      const serviceMetrics = new Map<string, any>()
      for (const [serviceName, service] of this.services) {
        if (service.getMetrics) {
          serviceMetrics.set(serviceName, service.getMetrics())
        }
      }

      // 收集API服务指标
      const apiMetrics = new Map<string, any>()
      for (const [serviceName, apiService] of this.apiServices) {
        if (apiService.getMetrics) {
          apiMetrics.set(serviceName, apiService.getMetrics())
        }
      }

      // 系统级指标
      const memoryUsage = process.memoryUsage()
      const cpuUsage = process.cpuUsage()

      const metrics: SystemMetrics = {
        timestamp: new Date(),
        uptime: process.uptime(),
        memory: {
          used: memoryUsage.heapUsed,
          total: memoryUsage.heapTotal,
          external: memoryUsage.external,
          rss: memoryUsage.rss
        },
        cpu: {
          user: cpuUsage.user,
          system: cpuUsage.system
        },
        services: {
          total: this.services.size + this.apiServices.size,
          healthy: Array.from((await this.getServiceHealth()).values())
            .filter(h => h.status === 'healthy').length,
          unhealthy: Array.from((await this.getServiceHealth()).values())
            .filter(h => h.status === 'unhealthy').length,
          degraded: Array.from((await this.getServiceHealth()).values())
            .filter(h => h.status === 'degraded').length
        },
        requests: {
          total: 0,
          successful: 0,
          failed: 0,
          averageResponseTime: 0
        },
        collectionTime: Date.now() - startTime,
        serviceMetrics,
        apiMetrics
      }

      return metrics

    } catch (error) {
      console.error('❌ 收集系统指标失败:', error)
      throw error
    }
  }

  /**
   * 扩展服务
   */
  async scaleService(serviceName: string, replicas: number): Promise<void> {
    if (!this.config.enableAutoScaling) {
      throw new Error('自动扩展未启用')
    }

    try {
      console.log(`📈 扩展服务 ${serviceName} 到 ${replicas} 个实例`)

      const service = this.services.get(serviceName)
      if (!service) {
        throw new Error(`服务 ${serviceName} 不存在`)
      }

      // 执行扩展逻辑
      await this.performScaling(serviceName, replicas)

      this.emit('serviceScaled', { serviceName, replicas })
      console.log(`✅ 服务 ${serviceName} 扩展完成`)

    } catch (error) {
      console.error(`❌ 扩展服务 ${serviceName} 失败:`, error)
      this.emit('scalingError', { serviceName, error })
      throw error
    }
  }

  /**
   * 重新加载服务
   */
  async reloadService(serviceName: string): Promise<void> {
    try {
      console.log(`🔄 重新加载服务 ${serviceName}`)

      const service = this.services.get(serviceName)
      if (!service) {
        throw new Error(`服务 ${serviceName} 不存在`)
      }

      // 停止服务
      if (service.stop) {
        await service.stop()
      }

      // 重新初始化服务
      if (service.initialize) {
        await service.initialize()
      }

      this.emit('serviceReloaded', { serviceName })
      console.log(`✅ 服务 ${serviceName} 重新加载完成`)

    } catch (error) {
      console.error(`❌ 重新加载服务 ${serviceName} 失败:`, error)
      this.emit('serviceReloadError', { serviceName, error })
      throw error
    }
  }

  /**
   * 获取服务注册表
   */
  getServiceRegistry(): ServiceRegistry {
    return {
      services: Array.from(this.services.entries()).map(([name, service]) => ({
        name,
        id: service.id || name,
        version: service.version || '1.0.0',
        host: service.host || 'localhost',
        port: service.port || 3000,
        protocol: service.protocol || 'http',
        status: 'running',
        health: 'healthy',
        metadata: service.metadata || {}
      })),
      lastUpdated: new Date(),
      totalServices: this.services.size
    }
  }

  /**
   * 启动服务
   */
  async startService(serviceName: string): Promise<void> {
    const service = this.services.get(serviceName)
    if (!service) {
      throw new Error(`服务 ${serviceName} 不存在`)
    }

    if (service.start) {
      await service.start()
    }

    this.emit('serviceStarted', { serviceName })
    console.log(`✅ 服务 ${serviceName} 已启动`)
  }

  /**
   * 停止服务
   */
  async stopService(serviceName: string): Promise<void> {
    const service = this.services.get(serviceName)
    if (!service) {
      throw new Error(`服务 ${serviceName} 不存在`)
    }

    if (service.stop) {
      await service.stop()
    }

    this.emit('serviceStopped', { serviceName })
    console.log(`✅ 服务 ${serviceName} 已停止`)
  }

  /**
   * 获取部署状态
   */
  async getDeploymentStatus(): Promise<DeploymentStatus> {
    const healthStatus = await this.getServiceHealth()
    const metrics = await this.getSystemMetrics()

    return {
      environment: process.env.NODE_ENV || 'development',
      version: process.env.APP_VERSION || '1.0.0',
      deployedAt: new Date(),
      services: {
        total: this.services.size + this.apiServices.size,
        healthy: Array.from(healthStatus.values()).filter(h => h.status === 'healthy').length,
        unhealthy: Array.from(healthStatus.values()).filter(h => h.status === 'unhealthy').length,
        degraded: Array.from(healthStatus.values()).filter(h => h.status === 'degraded').length
      },
      health: Array.from(healthStatus.values()).every(h => h.status === 'healthy') ? 'healthy' : 'degraded',
      uptime: process.uptime(),
      memory: metrics.memory,
      cpu: metrics.cpu,
      lastHealthCheck: new Date()
    }
  }

  /**
   * 关闭服务编排器
   */
  async shutdown(): Promise<void> {
    if (!this.isInitialized) return

    try {
      console.log('🛑 关闭服务编排器...')

      // 停止健康检查
      if (this.healthCheckInterval) {
        clearInterval(this.healthCheckInterval)
      }

      // 关闭所有服务
      for (const [serviceName, service] of this.services) {
        try {
          console.log(`🔄 关闭服务: ${serviceName}`)
          if (service.shutdown) {
            await service.shutdown()
          }
        } catch (error) {
          console.error(`❌ 关闭服务 ${serviceName} 失败:`, error)
        }
      }

      // 关闭API服务
      for (const [serviceName, apiService] of this.apiServices) {
        try {
          console.log(`🔄 关闭API服务: ${serviceName}`)
          if (apiService.shutdown) {
            await apiService.shutdown()
          }
        } catch (error) {
          console.error(`❌ 关闭API服务 ${serviceName} 失败:`, error)
        }
      }

      // 清理资源
      this.services.clear()
      this.apiServices.clear()

      this.isInitialized = false
      console.log('✅ 服务编排器已关闭')
      this.emit('shutdown')

    } catch (error) {
      console.error('❌ 关闭服务编排器时出错:', error)
      throw error
    }
  }

  // 私有方法实现
  private startHealthChecks(): void {
    if (this.config.healthCheckInterval > 0) {
      this.healthCheckInterval = setInterval(async () => {
        try {
          const healthStatus = await this.getServiceHealth()
          this.emit('healthCheck', healthStatus)

          // 检查是否需要自动恢复
          for (const [serviceName, health] of healthStatus) {
            if (health.status === 'unhealthy') {
              console.warn(`⚠️ 服务 ${serviceName} 状态异常，尝试自动恢复...`)
              await this.attemptServiceRecovery(serviceName)
            }
          }
        } catch (error) {
          console.error('❌ 健康检查失败:', error)
        }
      }, this.config.healthCheckInterval)
    }
  }

  private startMetricsCollection(): void {
    if (this.config.metricsInterval > 0) {
      setInterval(async () => {
        try {
          const metrics = await this.getSystemMetrics()
          this.emit('metrics', metrics)
        } catch (error) {
          console.error('❌ 收集指标失败:', error)
        }
      }, this.config.metricsInterval)
    }
  }

  private async attemptServiceRecovery(serviceName: string): Promise<void> {
    try {
      console.log(`🔄 尝试恢复服务 ${serviceName}`)
      await this.reloadService(serviceName)
      this.emit('serviceRecovered', { serviceName })
    } catch (error) {
      console.error(`❌ 服务 ${serviceName} 恢复失败:`, error)
    }
  }

  private async performScaling(serviceName: string, replicas: number): Promise<void> {
    // 简化的扩展实现
    console.log(`📈 扩展 ${serviceName} 到 ${replicas} 个实例`)
  }

  private async getServiceMetrics(serviceName: string): Promise<any> {
    const service = this.services.get(serviceName)
    if (service && service.getMetrics) {
      return service.getMetrics()
    }
    return {}
  }
}

// 默认配置导出
export const defaultOrchestrationConfig: OrchestrationConfig = {
  enableAutoScaling: true,
  enableHealthChecks: true,
  enableMetrics: true,
  enableServiceDiscovery: true,
  healthCheckInterval: 30000,
  metricsInterval: 60000,
  scalingCooldown: 300000,
  maxReplicas: 10,
  minReplicas: 1,
  loadBalancingStrategy: 'round_robin',
  serviceRegistry: 'consul',
  gatewayPort: process.env.API_GATEWAY_PORT || 1229
}