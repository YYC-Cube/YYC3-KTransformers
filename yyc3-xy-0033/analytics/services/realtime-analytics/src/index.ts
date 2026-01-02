/**
 * @file 实时分析服务主入口
 * @description YYC³实时分析微服务 - 负责实时数据处理、流式计算和实时指标计算
 * @module realtime-analytics
 * @author YYC³ Team
 * @version 1.0.0
 * @created 2025-12-14
 */

import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'

// 导入路由
// import { healthRoutes } from './routes/health'
// import { analyticsRoutes } from './routes/analytics'
// import { realtimeRoutes } from './routes/realtime'
// import { metricsMiddleware } from './middleware/metrics'

// 导入服务
// import { KafkaEventConsumer } from './services/kafka-consumer'
// import { ClickHouseClient } from './services/clickhouse'
// import { RedisClient } from './services/redis'
// import { RealtimeProcessor } from './services/realtime-processor'
// import { WebSocketManager } from './services/websocket-manager'
// import { consulServiceRegistry } from './services/consul'
// import { createLogger } from './utils/logger'

const app = new Hono()
// const log = createLogger('realtime-analytics')

// 基础中间件
app.use('*', cors({
  origin: ['http://localhost:3100', 'http://localhost:1229', 'https://yyc3.app'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

app.use('*', logger())
app.use('*', prettyJSON())
// app.use('*', metricsMiddleware)

// 健康检查端点
// app.route('/health', healthRoutes)

// API路由
// app.route('/api/v1/analytics', analyticsRoutes)
// app.route('/api/v1/realtime', realtimeRoutes)

// WebSocket路由
app.get('/ws', async (c) => {
  const upgradeHeader = c.req.header('Upgrade')
  if (upgradeHeader !== 'websocket') {
    return c.text('Expected websocket', 400)
  }

  // 这里应该使用Hono的WebSocket升级，但由于简化示例，返回成功
  return c.text('WebSocket endpoint available')
})

// 服务启动
const PORT = Number(process.env.PORT) || 8101
const HOST = process.env.HOST || '0.0.0.0'
// const SERVICE_NAME = 'realtime-analytics'
// const SERVICE_ID = `${SERVICE_NAME}-${Date.now()}`

// 服务实例
// let kafkaConsumer: KafkaEventConsumer
// let clickhouseClient: ClickHouseClient
// let redisClient: RedisClient
// let realtimeProcessor: RealtimeProcessor
// let wsManager: WebSocketManager

async function startServer() {
  try {
    // log.info(`Starting ${SERVICE_NAME}...`)

    // 初始化服务
    // clickhouseClient = new ClickHouseClient({
    //   host: process.env.CLICKHOUSE_URL || 'http://localhost:8123',
    //   username: process.env.CLICKHOUSE_USER || 'yyc3',
    //   password: process.env.CLICKHOUSE_PASSWORD || 'analytics_password',
    //   database: 'yyc3_analytics'
    // })

    // redisClient = new RedisClient({
    //   url: process.env.REDIS_URL || 'redis://localhost:6379'
    // })

    // kafkaConsumer = new KafkaEventConsumer({
    //   brokers: (process.env.KAFKA_BOOTSTRAP_SERVERS || 'localhost:9092').split(','),
    //   groupId: 'realtime-analytics-group',
    //   topics: ['user-events', 'ai-interactions', 'growth-updates', 'recommendation-feedback']
    // })

    // wsManager = WebSocketManager.getInstance()
    // realtimeProcessor = new RealtimeProcessor(clickhouseClient, redisClient, wsManager)

    // 连接数据库
    // await clickhouseClient.connect()
    // await redisClient.connect()

    // 注册到Consul
    // await consulServiceRegistry.register({
    //   id: SERVICE_ID,
    //   name: SERVICE_NAME,
    //   address: HOST,
    //   port: PORT,
    //   tags: ['v1', 'analytics', 'realtime', 'yyc3'],
    //   check: {
    //     http: `http://${HOST}:${PORT}/health`,
    //     interval: '10s',
    //     timeout: '3s'
    //   }
    // })

    // log.info(`Service registered with Consul: ${SERVICE_ID}`)

    // 启动Kafka消费者
    // await kafkaConsumer.start()

    // 设置数据处理回调
    // kafkaConsumer.on('message', async (message) => {
    //   try {
    //     await realtimeProcessor.processEvent(message)
    //   } catch (error) {
    //     log.error('Failed to process message:', error)
    //   }
    // })

    // 启动WebSocket服务器
    // wsManager.start(PORT + 1) // 使用下一个端口

    // 启动HTTP服务器
    const server = serve({
      fetch: app.fetch,
      port: PORT,
      hostname: HOST,
    }, () => {
      // log.info(`🚀 Realtime Analytics service started on ${info.hostname}:${info.port}`)
      // log.info(`📊 Metrics available at http://${info.hostname}:${info.port}/metrics`)
      // log.info(`🔌 WebSocket available at ws://${info.hostname}:${info.port + 1}`)
      console.log(`🚀 Realtime Analytics service started on ${HOST}:${PORT}`)
    })

    // 优雅关闭处理
    const gracefulShutdown = async (signal: string) => {
      // log.info(`Received ${signal}, starting graceful shutdown...`)
      console.log(`Received ${signal}, starting graceful shutdown...`)

      try {
        // 停止Kafka消费者
        // await kafkaConsumer.stop()
        // log.info('Kafka consumer stopped')

        // 关闭WebSocket服务器
        // wsManager.stop()
        // log.info('WebSocket server stopped')

        // 关闭数据库连接
        // await clickhouseClient.disconnect()
        // await redisClient.disconnect()
        // log.info('Database connections closed')

        // 从Consul注销服务
        // await consulServiceRegistry.deregister(SERVICE_ID)
        // log.info('Service deregistered from Consul')

        // 关闭HTTP服务器
        server.close(async () => {
          // log.info('HTTP server closed')
          console.log('HTTP server closed')
          process.exit(0)
        })

        // 强制退出超时
        setTimeout(() => {
          // log.error('Forced shutdown due to timeout')
          console.error('Forced shutdown due to timeout')
          process.exit(1)
        }, 30000)

      } catch (error) {
        // log.error('Error during shutdown:', error)
        console.error('Error during shutdown:', error)
        process.exit(1)
      }
    }

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
    process.on('SIGINT', () => gracefulShutdown('SIGINT'))

  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

// 未捕获异常处理
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error)
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
})

// 启动服务
startServer()