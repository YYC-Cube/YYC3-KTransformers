/**
 * YYC³ 智能预测与集成学习系统 - 主入口文件
 * 提供完整的智能预测系统服务和API接口
 */

import { ServerWebSocket } from 'bun'
import { IntelligentPredictionService } from './services/prediction/index'
import type {
  PredictionData,
  PredictionConfig
} from './types/prediction/common'

// 创建全局预测服务实例
const predictionService = new IntelligentPredictionService()

// API路由处理器
const handlers = {
  // 创建预测任务
  async '/api/prediction/tasks/create'(request: Request): Promise<Response> {
    try {
      const config = await request.json() as PredictionConfig
      const data = await request.json() as PredictionData

      const task = await predictionService.createPredictionTask(config, data)

      return Response.json({
        success: true,
        task,
        message: '预测任务创建成功'
      })
    } catch (error) {
      return Response.json({
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      }, { status: 400 })
    }
  },

  // 执行预测
  async '/api/prediction/execute'(request: Request): Promise<Response> {
    try {
      const { taskId, data, horizon } = await request.json()

      const result = await predictionService.executePrediction(taskId, data, horizon)

      return Response.json({
        success: true,
        result,
        message: '预测执行成功'
      })
    } catch (error) {
      return Response.json({
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      }, { status: 400 })
    }
  },

  // 实时预测
  async '/api/prediction/realtime'(request: Request): Promise<Response> {
    try {
      const stream = await request.json()

      const result = await predictionService.executeRealTimePrediction(stream)

      return Response.json({
        success: true,
        result,
        message: '实时预测完成'
      })
    } catch (error) {
      return Response.json({
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      }, { status: 400 })
    }
  },

  // 生成预测洞察
  async '/api/prediction/insights'(request: Request): Promise<Response> {
    try {
      const { taskId, results } = await request.json()

      const insights = await predictionService.generatePredictionInsights(taskId, results)

      return Response.json({
        success: true,
        insights,
        message: '洞察生成成功'
      })
    } catch (error) {
      return Response.json({
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      }, { status: 400 })
    }
  },

  // 监控预测质量
  async '/api/prediction/quality'(request: Request): Promise<Response> {
    try {
      const results = await request.json()

      const metrics = await predictionService.monitorPredictionQuality(results)

      return Response.json({
        success: true,
        metrics,
        message: '质量监控完成'
      })
    } catch (error) {
      return Response.json({
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      }, { status: 400 })
    }
  },

  // 更新模型
  async '/api/prediction/update'(request: Request): Promise<Response> {
    try {
      const { taskId, newData } = await request.json()

      await predictionService.updateModel(taskId, newData)

      return Response.json({
        success: true,
        message: '模型更新成功'
      })
    } catch (error) {
      return Response.json({
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      }, { status: 400 })
    }
  },

  // 获取任务状态
  async '/api/prediction/status/:taskId'(request: Request): Promise<Response> {
    try {
      const url = new URL(request.url)
      const taskId = url.pathname.split('/').pop()

      if (!taskId) {
        return Response.json({
          success: false,
          error: '任务ID不能为空'
        }, { status: 400 })
      }

      const status = predictionService.getTaskStatus(taskId)

      return Response.json({
        success: true,
        status,
        message: '状态获取成功'
      })
    } catch (error) {
      return Response.json({
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      }, { status: 400 })
    }
  },

  // 列出所有活动任务
  async '/api/prediction/tasks'(): Promise<Response> {
    try {
      const tasks = predictionService.listActiveTasks()

      return Response.json({
        success: true,
        tasks,
        message: '任务列表获取成功'
      })
    } catch (error) {
      return Response.json({
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      }, { status: 500 })
    }
  },

  // 删除任务
  async '/api/prediction/tasks/:taskId'(request: Request): Promise<Response> {
    try {
      const url = new URL(request.url)
      const taskId = url.pathname.split('/').pop()

      if (!taskId) {
        return Response.json({
          success: false,
          error: '任务ID不能为空'
        }, { status: 400 })
      }

      await predictionService.deleteTask(taskId)

      return Response.json({
        success: true,
        message: '任务删除成功'
      })
    } catch (error) {
      return Response.json({
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      }, { status: 400 })
    }
  }
}

// WebSocket处理流式预测
const handleWebSocketOpen = () => {
  console.log('WebSocket连接已建立')
}

const handleWebSocketMessage = async (ws: ServerWebSocket, message: string | Buffer) => {
  try {
    const data = typeof message === 'string' ? JSON.parse(message) : JSON.parse(message.toString())

    switch (data.type) {
      case 'stream_prediction':
        const streamResult = await predictionService.executeRealTimePrediction(data.data)
        ws.send(JSON.stringify({
          type: 'prediction_result',
          data: streamResult,
          timestamp: Date.now()
        }))
        break

      case 'subscribe_monitoring':
        ws.send(JSON.stringify({
          type: 'monitoring_subscribed',
          message: '已订阅实时监控'
        }))
        break

      default:
        ws.send(JSON.stringify({
          type: 'error',
          message: '未知消息类型'
        }))
    }
  } catch (error) {
    ws.send(JSON.stringify({
      type: 'error',
      message: error instanceof Error ? error.message : '处理消息时发生错误'
    }))
  }
}

const handleWebSocketClose = () => {
  console.log('WebSocket连接已关闭')
}

// 导出前端HTML
const frontendHtml = await Bun.file('./components/prediction/dashboard.html').text()

// 启动服务器
const server = Bun.serve({
  port: process.env.PORT || 1229,
  hostname: process.env.HOST || 'localhost',

  // 静态文件服务
  routes: {
    '/': () => new Response(frontendHtml, { headers: { 'Content-Type': 'text/html' } }),

    // API路由
    '/api/prediction/tasks': {
      POST: handlers['/api/prediction/tasks/create'],
      GET: handlers['/api/prediction/tasks']
    },

    '/api/prediction/execute': {
      POST: handlers['/api/prediction/execute']
    },

    '/api/prediction/realtime': {
      POST: handlers['/api/prediction/realtime']
    },

    '/api/prediction/insights': {
      POST: handlers['/api/prediction/insights']
    },

    '/api/prediction/quality': {
      POST: handlers['/api/prediction/quality']
    },

    '/api/prediction/update': {
      PUT: handlers['/api/prediction/update']
    },

    '/api/prediction/status/*': {
      GET: handlers['/api/prediction/status/:taskId'],
      DELETE: handlers['/api/prediction/tasks/:taskId']
    }
  },

  // WebSocket支持
  websocket: {
    open: handleWebSocketOpen,
    message: handleWebSocketMessage,
    close: handleWebSocketClose
  },

  // 错误处理
  error(error: Error) {
    console.error('服务器错误:', error)
  },

  // 开发模式配置
  development: {
    hmr: true,
    console: true
  }
})

// 启动信息
console.log(`🚀 YYC³ 智能预测系统已启动`)
console.log(`📍 服务地址: http://${server.hostname}:${server.port}`)
console.log(`🔌 WebSocket: ws://${server.hostname}:${server.port}`)
console.log(`📊 预测仪表板: http://${server.hostname}:${server.port}/dashboard`)
console.log(`⚙️  配置面板: http://${server.hostname}:${server.port}/config`)
console.log(`📈 实时监控: http://${server.hostname}:${server.port}/monitor`)

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n🛑 正在关闭服务器...')
  server.stop()
  console.log('✅ 服务器已关闭')
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('\n🛑 正在关闭服务器...')
  server.stop()
  console.log('✅ 服务器已关闭')
  process.exit(0)
})

// 导出服务实例供外部使用
export { predictionService }
export default server