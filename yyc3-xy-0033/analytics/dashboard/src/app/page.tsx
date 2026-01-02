/**
 * YYC³ 数据分析仪表板主页面
 * 实时数据可视化和业务洞察展示
 */

'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, BotMessageSquare, Activity, Brain, BarChart3, Download, RefreshCw } from 'lucide-react'

// 导入组件
import { MetricsOverview } from '@/components/analytics/MetricsOverview'
import { RealtimeActivityStream } from '@/components/analytics/RealtimeActivityStream'
import { TrendAnalysisCharts } from '@/components/analytics/TrendAnalysisCharts'
import { IntelligentInsightsPanel } from '@/components/analytics/IntelligentInsightsPanel'
import { AlertNotificationSystem } from '@/components/analytics/AlertNotificationSystem'
import { WebSocketConnection } from '@/components/analytics/WebSocketConnection'

// 导入类型
import { RealtimeMetrics } from '@/types/analytics'

export default function AnalyticsDashboard() {
  const [realtimeMetrics, setRealtimeMetrics] = useState<RealtimeMetrics | null>(null)
  const [isConnected, setIsConnected] = useState<'connected' | 'disconnected' | 'connecting' | 'error'>('disconnected')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h')

  // WebSocket连接处理
  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8102'

    const connectWebSocket = () => {
      try {
        const ws = new WebSocket(wsUrl)

        ws.onopen = () => {
          console.log('WebSocket connected')
          setIsConnected('connected')
        }

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)

            switch (data.type) {
              case 'realtime_metrics':
                setRealtimeMetrics(data.payload)
                break
              case 'event_update':
                // 处理实时事件更新
                break
              default:
                console.log('Unknown message type:', data.type)
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error)
          }
        }

        ws.onclose = () => {
          console.log('WebSocket disconnected')
          setIsConnected('disconnected')
          // 自动重连
          setTimeout(connectWebSocket, 5000)
        }

        ws.onerror = (error) => {
          console.error('WebSocket error:', error)
          setIsConnected('error')
        }

        return ws
      } catch (error) {
        console.error('Failed to connect WebSocket:', error)
        return null
      }
    }

    const ws = connectWebSocket()

    // 初始数据加载
    loadInitialData()

    return () => {
      if (ws) {
        ws.close()
      }
    }
  }, [])

  // 加载初始数据
  const loadInitialData = async () => {
    setIsLoading(true)
    try {
      // 加载初始数据
      const metricsResponse = await fetch(`${process.env.NEXT_PUBLIC_ANALYTICS_API}/api/v1/realtime/metrics`)

      if (metricsResponse.ok) {
        const metricsData = await metricsResponse.json()
        setRealtimeMetrics(metricsData.data)
      }
    } catch (error) {
      console.error('Failed to load initial data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // 手动刷新数据
  const refreshData = () => {
    loadInitialData()
  }

  // 下载报表
  const downloadReport = async (format: 'pdf' | 'excel') => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_REPORT_API}/api/v1/reports/generate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            timeRange: selectedTimeRange,
            format: format,
            includeCharts: true,
            includeInsights: true
          })
        }
      )

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `yyc3-analytics-report-${new Date().toISOString().split('T')[0]}.${format}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Failed to download report:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"
        />
        <span className="ml-4 text-lg text-gray-600">加载分析数据中...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* 顶部导航栏 */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* 左侧标题 */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  YYC³ 数据分析中心
                </h1>
              </div>

              {/* WebSocket连接状态 */}
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isConnected === 'connected' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                <span className="text-sm text-gray-600">
                  {isConnected === 'connected' ? '实时连接' : '连接断开'}
                </span>
              </div>
            </div>

            {/* 右侧操作按钮 */}
            <div className="flex items-center space-x-4">
              {/* 时间范围选择 */}
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1h">过去1小时</option>
                <option value="24h">过去24小时</option>
                <option value="7d">过去7天</option>
                <option value="30d">过去30天</option>
              </select>

              {/* 刷新按钮 */}
              <button
                onClick={refreshData}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <RefreshCw className="h-5 w-5" />
              </button>

              {/* 下载报表按钮 */}
              <div className="flex space-x-2">
                <button
                  onClick={() => downloadReport('pdf')}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>PDF报表</span>
                </button>
                <button
                  onClick={() => downloadReport('excel')}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Excel报表</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容区域 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* 左侧面板 - 核心指标和活动流 */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {/* 核心指标概览 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <MetricsOverview
                metrics={realtimeMetrics}
                timeRange={selectedTimeRange}
              />
            </motion.div>

            {/* 趋势分析图表 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <TrendAnalysisCharts
                timeRange={selectedTimeRange}
                metrics={realtimeMetrics}
              />
            </motion.div>

            {/* 实时活动流 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <RealtimeActivityStream />
            </motion.div>
          </div>

          {/* 右侧面板 - 智能洞察和告警 */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* 智能洞察面板 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <IntelligentInsightsPanel
                metrics={realtimeMetrics}
                timeRange={selectedTimeRange}
              />
            </motion.div>

            {/* 告警通知系统 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <AlertNotificationSystem />
            </motion.div>

            {/* 快速统计卡片 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="grid grid-cols-2 gap-4"
            >
              {/* 用户活跃度 */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <Users className="h-8 w-8 text-blue-600" />
                  <span className="text-sm text-green-600 font-medium">
                    +{realtimeMetrics?.activeUsers ? Math.round(realtimeMetrics.activeUsers * 0.12) : 0}
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {realtimeMetrics?.activeUsers || 0}
                </div>
                <div className="text-sm text-gray-500">活跃用户</div>
              </div>

              {/* AI对话 */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <BotMessageSquare className="h-8 w-8 text-purple-600" />
                  <span className="text-sm text-green-600 font-medium">
                    +{realtimeMetrics?.aiConversations ? Math.round(realtimeMetrics.aiConversations * 0.08) : 0}
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {realtimeMetrics?.aiConversations || 0}
                </div>
                <div className="text-sm text-gray-500">AI对话</div>
              </div>

              {/* 满意度 */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <Brain className="h-8 w-8 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">
                    +{Math.round((realtimeMetrics?.averageSatisfaction || 0) * 0.05 * 100)}%
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {((realtimeMetrics?.averageSatisfaction || 0) * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-500">满意度</div>
              </div>

              {/* 系统健康 */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <Activity className="h-8 w-8 text-orange-600" />
                  <span className={`text-sm font-medium ${
                    (realtimeMetrics?.systemHealth || 0) >= 90 ? 'text-green-600' :
                    (realtimeMetrics?.systemHealth || 0) >= 70 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {(realtimeMetrics?.systemHealth || 0).toFixed(1)}%
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {(realtimeMetrics?.systemHealth || 0).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-500">系统健康</div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* WebSocket连接管理 */}
      <WebSocketConnection onConnectionChange={setIsConnected} />
    </div>
  )
}