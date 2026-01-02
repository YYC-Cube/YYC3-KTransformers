/**
 * YYC³ AI小语智能成长守护系统 - 全局错误处理工具
 * 统一错误报告和处理机制
 */

interface ErrorContext {
  component?: string
  action?: string
  userId?: string
  childId?: string
  endpoint?: string
  additionalData?: Record<string, any>
}

interface ErrorReport {
  error: Error
  context?: ErrorContext
  timestamp: string
  userAgent: string
  url: string
}

class GlobalErrorHandler {
  private static instance: GlobalErrorHandler
  private errorQueue: ErrorReport[] = []
  private isOnline: boolean = true
  private maxQueueSize: number = 50

  private constructor() {
    // 监听网络状态
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnline = true
        this.flushErrorQueue()
      })
      
      window.addEventListener('offline', () => {
        this.isOnline = false
      })
      
      // 页面卸载时尝试发送剩余错误
      window.addEventListener('beforeunload', () => {
        this.flushErrorQueue()
      })
    }
  }

  static getInstance(): GlobalErrorHandler {
    if (!GlobalErrorHandler.instance) {
      GlobalErrorHandler.instance = new GlobalErrorHandler()
    }
    return GlobalErrorHandler.instance
  }

  /**
   * 报告错误
   */
  reportError(error: Error, context?: ErrorContext): void {
    const errorReport: ErrorReport = {
      error,
      context,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'Server',
      url: typeof window !== 'undefined' ? window.location.href : 'Unknown'
    }

    if (this.isOnline) {
      this.sendErrorReport(errorReport)
    } else {
      this.queueErrorReport(errorReport)
    }
  }

  /**
   * 发送错误报告到服务器
   */
  private async sendErrorReport(errorReport: ErrorReport): Promise<void> {
    try {
      // 构建完整的API URL
      const baseUrl = typeof window !== 'undefined'
        ? window.location.origin
        : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:1228'

      const response = await fetch(`${baseUrl}/api/error-report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: {
            message: errorReport.error.message,
            stack: errorReport.error.stack,
            name: errorReport.error.name
          },
          context: errorReport.context,
          userAgent: errorReport.userAgent,
          url: errorReport.url,
          timestamp: errorReport.timestamp
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      console.log('Error report sent successfully')
    } catch (err) {
      console.warn('Failed to send error report, queuing for later:', err)
      this.queueErrorReport(errorReport)
    }
  }

  /**
   * 将错误报告加入队列
   */
  private queueErrorReport(errorReport: ErrorReport): void {
    this.errorQueue.push(errorReport)
    
    // 限制队列大小
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue.shift()
    }

    // 尝试保存到localStorage
    this.saveErrorQueueToStorage()
  }

  /**
   * 刷新错误队列（网络恢复时调用）
   */
  private async flushErrorQueue(): Promise<void> {
    if (this.errorQueue.length === 0) return

    const queuedErrors = [...this.errorQueue]
    this.errorQueue = []

    for (const errorReport of queuedErrors) {
      try {
        await this.sendErrorReport(errorReport)
      } catch (err) {
        console.warn('Failed to send queued error report:', err)
        // 重新加入队列
        this.errorQueue.push(errorReport)
      }
    }

    // 清除localStorage中的错误队列
    if (this.errorQueue.length === 0) {
      this.clearErrorQueueFromStorage()
    }
  }

  /**
   * 保存错误队列到localStorage
   */
  private saveErrorQueueToStorage(): void {
    try {
      localStorage.setItem('yyc3_error_queue', JSON.stringify(this.errorQueue))
    } catch (err) {
      console.warn('Failed to save error queue to localStorage:', err)
    }
  }

  /**
   * 从localStorage清除错误队列
   */
  private clearErrorQueueFromStorage(): void {
    try {
      localStorage.removeItem('yyc3_error_queue')
    } catch (err) {
      console.warn('Failed to clear error queue from localStorage:', err)
    }
  }

  /**
   * 从localStorage加载错误队列
   */
  loadErrorQueueFromStorage(): void {
    try {
      const savedQueue = localStorage.getItem('yyc3_error_queue')
      if (savedQueue) {
        this.errorQueue = JSON.parse(savedQueue)
      }
    } catch (err) {
      console.warn('Failed to load error queue from localStorage:', err)
    }
  }

  /**
   * 获取错误统计信息
   */
  getErrorStats(): { totalErrors: number; queuedErrors: number; isOnline: boolean } {
    return {
      totalErrors: this.errorQueue.length,
      queuedErrors: this.errorQueue.length,
      isOnline: this.isOnline
    }
  }

  /**
   * 清除所有错误
   */
  clearErrors(): void {
    this.errorQueue = []
    this.clearErrorQueueFromStorage()
  }
}

// 导出单例实例
export const globalErrorHandler = GlobalErrorHandler.getInstance()

// 初始化时加载错误队列
if (typeof window !== 'undefined') {
  globalErrorHandler.loadErrorQueueFromStorage()
}

// 便捷函数
export const reportError = (error: Error, context?: ErrorContext) => {
  globalErrorHandler.reportError(error, context)
}

// React Hook
export const useGlobalErrorHandler = () => {
  const handleError = (error: Error, context?: ErrorContext) => {
    reportError(error, context)
  }

  return {
    handleError,
    getErrorStats: () => globalErrorHandler.getErrorStats(),
    clearErrors: () => globalErrorHandler.clearErrors()
  }
}

// 装饰器函数（可用于类方法）
export const withErrorHandling = (context?: ErrorContext) => {
  return (target: any, propertyName: string, descriptor: PropertyDescriptor) => {
    const method = descriptor.value

    descriptor.value = function (...args: any[]) {
      try {
        const result = method.apply(this, args)
        
        // 处理异步方法
        if (result && typeof result.catch === 'function') {
          return result.catch((error: Error) => {
            reportError(error, {
              ...context,
              component: target.constructor.name,
              action: propertyName
            })
            throw error
          })
        }
        
        return result
      } catch (error) {
        reportError(error as Error, {
          ...context,
          component: target.constructor.name,
          action: propertyName
        })
        throw error
      }
    }

    return descriptor
  }
}

// 导出GlobalErrorHandler类以供测试使用
export { GlobalErrorHandler }