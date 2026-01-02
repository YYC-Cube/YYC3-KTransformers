'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Rocket,
  CheckCircle,
  XCircle,
  Clock,
  Globe,
  RefreshCw,
  AlertTriangle,
  Settings,
  Eye,
  FileCheck,
  Calendar,
  Square,
  Loader2
} from 'lucide-react'

// 部署状态接口
interface DeploymentStatus {
  id: string
  name: string
  status: 'pending' | 'running' | 'completed' | 'failed' | 'warning'
  progress: number
  details?: string
  error?: string
  completedAt?: Date
  logs?: string[]
}

// 环境配置接口
interface Environment {
  id: string
  name: string
  type: 'development' | 'staging' | 'production'
  url?: string
  status: 'active' | 'inactive' | 'maintenance'
  lastDeploy?: Date
}

// 部署步骤配置
const deploymentSteps = [
  {
    id: 'pre-check',
    name: '部署前检查',
    description: '验证系统环境和依赖',
    checks: ['代码检查', '测试通过率', '资源可用性', '权限验证']
  },
  {
    id: 'build',
    name: '构建应用',
    description: '编译和打包应用代码',
    checks: ['TypeScript编译', '资源优化', '依赖解析', '构建产物']
  },
  {
    id: 'database-migration',
    name: '数据库迁移',
    description: '更新数据库结构和数据',
    checks: ['数据备份', '迁移脚本', '数据完整性', '回滚准备']
  },
  {
    id: 'deploy-static',
    name: '静态资源部署',
    description: '部署静态文件到CDN',
    checks: ['文件上传', 'CDN配置', '缓存设置', '访问测试']
  },
  {
    id: 'deploy-api',
    name: 'API服务部署',
    description: '部署后端服务',
    checks: ['容器构建', '服务启动', '健康检查', '负载均衡']
  },
  {
    id: 'verification',
    name: '部署验证',
    description: '验证部署结果和功能',
    checks: ['端点测试', '功能验证', '性能测试', '安全检查']
  },
  {
    id: 'monitoring-setup',
    name: '监控配置',
    description: '配置监控和日志',
    checks: ['监控告警', '日志收集', '指标配置', '通知设置']
  }
]

const environments: Environment[] = [
  {
    id: 'dev',
    name: '开发环境',
    type: 'development',
    url: 'https://dev.yyc3-ai-xiaoyu.com',
    status: 'active'
  },
  {
    id: 'staging',
    name: '测试环境',
    type: 'staging',
    url: 'https://staging.yyc3-ai-xiaoyu.com',
    status: 'active'
  },
  {
    id: 'prod',
    name: '生产环境',
    type: 'production',
    url: 'https://yyc3-ai-xiaoyu.com',
    status: 'maintenance'
  }
]

export default function DeploymentManager() {
  const [deploymentStatus, setDeploymentStatus] = useState<DeploymentStatus[]>([])
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>('prod')
  const [isDeploying, setIsDeploying] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [deployStartTime, setDeployStartTime] = useState<Date | null>(null)
  const [overallProgress, setOverallProgress] = useState(0)

  // 初始化部署状态
  useEffect(() => {
    const initialStatus = deploymentSteps.map(step => ({
      id: step.id,
      name: step.name,
      status: 'pending' as const,
      progress: 0,
      details: ''
    }))
    setDeploymentStatus(initialStatus)
  }, [])

  // 获取当前环境
  const currentEnvironment = environments.find(env => env.id === selectedEnvironment)

  // 更新部署状态
  const updateStepStatus = (stepId: string, updates: Partial<DeploymentStatus>) => {
    setDeploymentStatus(prev => prev.map(step =>
      step.id === stepId ? { ...step, ...updates } : step
    ))
  }

  // 模拟部署执行
  const executeStep = async (step: typeof deploymentSteps[0], _index: number): Promise<boolean> => {
    updateStepStatus(step.id, { status: 'running', details: '正在执行...' })

    // 模拟检查项执行
    for (let i = 0; i < step.checks.length; i++) {
      const check = step.checks[i]
      updateStepStatus(step.id, {
        details: `执行检查: ${check} (${i + 1}/${step.checks.length})`,
        progress: ((i + 1) / step.checks.length) * 80
      })
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1500))

      // 模拟90%成功率
      if (Math.random() < 0.1) {
        updateStepStatus(step.id, {
          status: 'warning',
          details: `检查警告: ${check} - 建议手动验证`,
          progress: 100
        })
        return true // 继续部署
      }
    }

    updateStepStatus(step.id, {
      status: 'completed',
      details: '执行完成',
      progress: 100,
      completedAt: new Date()
    })
    return true
  }

  // 执行完整部署
  const executeDeployment = async () => {
    if (isDeploying) return

    setIsDeploying(true)
    setDeployStartTime(new Date())

    // 重置状态
    setDeploymentStatus(prev => prev.map(step => ({
      id: step.id,
      name: step.name,
      status: 'pending' as const,
      progress: 0,
      details: ''
    })))

    try {
      // 依次执行所有步骤
      for (let i = 0; i < deploymentSteps.length; i++) {
        const step = deploymentSteps[i]!
        setOverallProgress((i / deploymentSteps.length) * 100)

        const success = await executeStep(step, i)
        if (!success) {
          throw new Error(`步骤失败: ${step.name}`)
        }

        // 步骤间短暂延迟
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      setOverallProgress(100)

    } catch (error) {
      console.error('部署失败:', error)
      // 更新失败状态
      const failedStep = deploymentSteps.find(step =>
        deploymentStatus.find(status => status.id === step.id && status.status === 'running')
      )
      if (failedStep) {
        updateStepStatus(failedStep.id, {
          status: 'failed',
          details: '部署失败',
          error: error instanceof Error ? error.message : '未知错误'
        })
      }
    } finally {
      setIsDeploying(false)
    }
  }

  // 取消部署
  const cancelDeployment = () => {
    setIsDeploying(false)
    setDeploymentStatus(prev => prev.map(step =>
      step.status === 'running' ? { ...step, status: 'pending', progress: 0 } : step
    ))
  }

  // 重新部署
  const redeploy = () => {
    executeDeployment()
  }

  // 获取状态图标
  const getStatusIcon = (status: DeploymentStatus['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'failed': return <XCircle className="w-5 h-5 text-red-500" />
      case 'running': return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'pending': return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  // 获取状态颜色
  const getStatusColor = (status: DeploymentStatus['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700'
      case 'failed': return 'bg-red-100 text-red-700'
      case 'running': return 'bg-blue-100 text-blue-700'
      case 'warning': return 'bg-yellow-100 text-yellow-700'
      case 'pending': return 'bg-gray-100 text-gray-700'
    }
  }

  // 获取环境状态颜色
  const getEnvironmentStatusColor = (status: Environment['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700'
      case 'inactive': return 'bg-gray-100 text-gray-700'
      case 'maintenance': return 'bg-yellow-100 text-yellow-700'
    }
  }

  // 生成部署报告
  const generateReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      environment: currentEnvironment?.name,
      duration: deployStartTime ? Date.now() - deployStartTime.getTime() : 0,
      status: deploymentStatus.every(s => s.status === 'completed' || s.status === 'warning') ? 'success' : 'failed',
      steps: deploymentStatus.map(step => ({
        name: step.name,
        status: step.status,
        progress: step.progress,
        details: step.details,
        error: step.error
      }))
    }

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `部署报告_${currentEnvironment?.name}_${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* 标题区域 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4">
            🚀 YYC³ AI小语系统部署管理
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            为小语的1岁生日准备完美的生产环境部署
          </p>
        </div>

        {/* 环境选择 */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">部署环境</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {environments.map(env => (
              <div
                key={env.id}
                onClick={() => !isDeploying && setSelectedEnvironment(env.id)}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  selectedEnvironment === env.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${isDeploying ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-800">{env.name}</h3>
                  <div className={`px-2 py-1 rounded-full text-xs ${getEnvironmentStatusColor(env.status)}`}>
                    {env.status === 'active' ? '活跃' :
                     env.status === 'inactive' ? '非活跃' : '维护中'}
                  </div>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>类型: {env.type === 'development' ? '开发' : env.type === 'staging' ? '测试' : '生产'}</div>
                  {env.url && (
                    <div className="flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      <span>{env.url}</span>
                    </div>
                  )}
                  {env.lastDeploy && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>上次部署: {env.lastDeploy.toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 部署控制面板 */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                部署控制面板 - {currentEnvironment?.name}
              </h2>
              <p className="text-gray-600">
                {isDeploying ? '部署正在进行中...' : '准备就绪，可以开始部署'}
              </p>
            </div>
            <div className="flex gap-3">
              {!isDeploying ? (
                <button
                  onClick={executeDeployment}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                >
                  <Rocket className="w-5 h-5" />
                  开始部署
                </button>
              ) : (
                <button
                  onClick={cancelDeployment}
                  className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                >
                  <Square className="w-5 h-5" />
                  取消部署
                </button>
              )}

              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
              >
                <Settings className="w-5 h-5" />
                {showAdvanced ? '隐藏' : '显示'}高级选项
              </button>

              <button
                onClick={generateReport}
                className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
              >
                <FileCheck className="w-5 h-5" />
                生成报告
              </button>
            </div>
          </div>

          {/* 进度条 */}
          {(isDeploying || overallProgress > 0) && (
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>整体进度</span>
                <span>{overallProgress.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${overallProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}

          {/* 部署步骤 */}
          <div className="space-y-4">
            {deploymentStatus.map((step, index) => (
              <motion.div
                key={step.id}
                className={`border rounded-lg p-4 transition-all ${
                  step.status === 'running' ? 'border-blue-300 bg-blue-50' :
                  step.status === 'completed' ? 'border-green-300 bg-green-50' :
                  step.status === 'failed' ? 'border-red-300 bg-red-50' :
                  step.status === 'warning' ? 'border-yellow-300 bg-yellow-50' :
                  'border-gray-200'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white">
                      {getStatusIcon(step.status)}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{step.name}</h4>
                      {step.details && (
                        <p className="text-xs text-gray-500 mt-1">{step.details}</p>
                      )}
                      {step.error && (
                        <p className="text-xs text-red-600 mt-1">错误: {step.error}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {step.progress > 0 && (
                      <div className="w-32">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-full rounded-full ${
                              step.status === 'completed' ? 'bg-green-500' :
                              step.status === 'failed' ? 'bg-red-500' :
                              'bg-blue-500'
                            }`}
                            style={{ width: `${step.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className={`px-3 py-1 rounded-full text-sm ${getStatusColor(step.status)}`}>
                      {step.status === 'completed' ? '已完成' :
                       step.status === 'failed' ? '失败' :
                       step.status === 'running' ? '进行中' :
                       step.status === 'warning' ? '警告' : '待执行'}
                    </div>

                    {step.completedAt && (
                      <div className="text-sm text-gray-500">
                        {step.completedAt.toLocaleTimeString()}
                      </div>
                    )}
                  </div>
                </div>

                {/* 检查项 */}
                {showAdvanced && (() => {
                  const stepConfig = deploymentSteps.find(s => s.id === step.id)
                  return stepConfig?.checks && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="text-sm text-gray-600 mb-2">检查项:</div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {stepConfig.checks.map((check, checkIndex) => (
                        <div
                          key={checkIndex}
                          className={`flex items-center gap-2 text-xs p-2 rounded ${
                            step.status === 'completed' ? 'bg-green-100 text-green-700' :
                            step.status === 'running' && checkIndex < Math.floor(step.progress / 100 * stepConfig.checks.length)
                              ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {step.status === 'completed' ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : step.status === 'running' && checkIndex < Math.floor(step.progress / 100 * stepConfig.checks.length) ? (
                            <Loader2 />
                          ) : (
                            <Square className="w-3 h-3" />
                          )}
                          {check}
                        </div>
                      ))}
                    </div>
                  </div>
                  )
                })()}
              </motion.div>
            ))}
          </div>
        </div>

        {/* 部署后状态 */}
        {!isDeploying && overallProgress === 100 && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
            {deploymentStatus.every(s => s.status === 'completed' || s.status === 'warning') ? (
              <>
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                  部署成功完成！
                </h3>
                <p className="text-gray-600 mb-6">
                  YYC³ AI小语系统已成功部署到{currentEnvironment?.name}
                </p>
              </>
            ) : (
              <>
                <AlertTriangle className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                  部署完成，但有警告
                </h3>
                <p className="text-gray-600 mb-6">
                  部署基本完成，但建议检查警告项并手动验证
                </p>
              </>
            )}

            <div className="flex justify-center gap-4">
              <button
                onClick={redeploy}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                重新部署
              </button>

              <button
                onClick={generateReport}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all flex items-center gap-2"
              >
                <FileCheck className="w-4 h-4" />
                下载报告
              </button>

              {currentEnvironment?.url && (
                <a
                  href={currentEnvironment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center gap-2 inline-flex"
                >
                  <Eye className="w-4 h-4" />
                  访问应用
                </a>
              )}
            </div>

            {/* 部署统计 */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{deploymentStatus.filter(s => s.status === 'completed').length}</div>
                <div className="text-sm text-gray-600">成功步骤</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">{deploymentStatus.filter(s => s.status === 'warning').length}</div>
                <div className="text-sm text-gray-600">警告步骤</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{deploymentStatus.filter(s => s.status === 'failed').length}</div>
                <div className="text-sm text-gray-600">失败步骤</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {deployStartTime ? ((Date.now() - deployStartTime.getTime()) / 1000).toFixed(1) + 's' : '0s'}
                </div>
                <div className="text-sm text-gray-600">总耗时</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}