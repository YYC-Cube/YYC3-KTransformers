"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useChildren } from "@/hooks/useChildren"

interface GrowthData {
  date: string
  studyTime: number // 学习时间（分钟）
  mood: number // 心情评分 1-5
  activities: number // 完成的活动数量
}

interface GrowthChartProps {
  childId?: string
}

export default function GrowthChart({ childId: _childId }: GrowthChartProps) {
  const { currentChild } = useChildren()
  const [growthData, setGrowthData] = useState<GrowthData[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month">("week")

  // 模拟成长数据（实际应用中应该从API获取）
  useEffect(() => {
    const generateMockData = (): GrowthData[] => {
      const data: GrowthData[] = []
      const now = new Date()
      const days = selectedPeriod === "week" ? 7 : 30

      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(date.getDate() - i)

        data.push({
          date: date.toLocaleDateString("zh-CN", { month: "short", day: "numeric" }),
          studyTime: Math.floor(Math.random() * 120) + 30, // 30-150分钟
          mood: Math.floor(Math.random() * 3) + 3, // 3-5分
          activities: Math.floor(Math.random() * 5) + 1 // 1-6个活动
        })
      }
      return data
    }

    setGrowthData(generateMockData())
  }, [selectedPeriod])

  const maxStudyTime = Math.max(...growthData.map(d => d.studyTime))
  const averageMood = growthData.length > 0
    ? Number((growthData.reduce((sum, d) => sum + d.mood, 0) / growthData.length).toFixed(1))
    : 0
  const totalActivities = growthData.reduce((sum, d) => sum + d.activities, 0)

  const getAssistantName = () => {
    return currentChild?.gender === "male" ? "沫言" : "沫语"
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 w-full">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white">
            📊
          </div>
          <div>
            <h3 className="font-bold text-slate-700">成长数据</h3>
            <p className="text-xs text-slate-500">{getAssistantName()}记录你的进步</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setSelectedPeriod("week")}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              selectedPeriod === "week"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-slate-600 hover:bg-gray-200"
            }`}
          >
            本周
          </button>
          <button
            onClick={() => setSelectedPeriod("month")}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              selectedPeriod === "month"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-slate-600 hover:bg-gray-200"
            }`}
          >
            本月
          </button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <motion.div
          className="bg-blue-50 rounded-xl p-3 text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="text-2xl font-bold text-blue-600">
            {Math.floor(growthData.reduce((sum, d) => sum + d.studyTime, 0) / 60)}
          </div>
          <div className="text-xs text-blue-500">学习小时</div>
        </motion.div>

        <motion.div
          className="bg-green-50 rounded-xl p-3 text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-2xl font-bold text-green-600">{averageMood}</div>
          <div className="text-xs text-green-500">平均心情</div>
        </motion.div>

        <motion.div
          className="bg-purple-50 rounded-xl p-3 text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-2xl font-bold text-purple-600">{totalActivities}</div>
          <div className="text-xs text-purple-500">完成活动</div>
        </motion.div>
      </div>

      {/* 学习时间图表 */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-slate-600 mb-3">每日学习时间</h4>
        <div className="space-y-2">
          {growthData.slice(-7).map((data, index) => (
            <motion.div
              key={data.date}
              className="flex items-center gap-3"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="text-xs text-slate-500 w-12 text-right">
                {data.date}
              </div>
              <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                <motion.div
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(data.studyTime / maxStudyTime) * 100}%` }}
                  transition={{ delay: index * 0.05 + 0.3, duration: 0.5 }}
                >
                  <div className="h-full flex items-center justify-end pr-2">
                    <span className="text-xs text-white font-medium">
                      {Math.floor(data.studyTime / 60)}h{data.studyTime % 60}m
                    </span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 心情趋势 */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-slate-600 mb-3">心情趋势</h4>
        <div className="flex items-end gap-2 h-20">
          {growthData.slice(-7).map((data, index) => (
            <motion.div
              key={data.date}
              className="flex-1 flex flex-col items-center gap-1"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="text-xs text-slate-500">
                {data.date.split('/')[1] || data.date.slice(-2)}
              </div>
              <motion.div
                className={`w-full rounded-t-md ${
                  data.mood >= 4 ? 'bg-green-400' :
                  data.mood >= 3 ? 'bg-yellow-400' : 'bg-orange-400'
                }`}
                initial={{ height: 0 }}
                animate={{ height: `${(data.mood / 5) * 100}%` }}
                transition={{ delay: index * 0.05 + 0.3, duration: 0.5 }}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* 鼓励信息 */}
      <motion.div
        className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 text-center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <p className="text-sm font-medium text-slate-700">
          {totalActivities > 20 ? "太棒了！你完成了很多活动！" :
           averageMood >= 4 ? "心情不错，继续保持哦！" :
           "继续努力，${getAssistantName()}为你加油！💪"}
        </p>
      </motion.div>
    </div>
  )
}