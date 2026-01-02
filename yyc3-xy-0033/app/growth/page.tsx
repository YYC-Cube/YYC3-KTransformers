"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import PageHeader from "@/components/headers/PageHeader"
import Navigation from "@/components/Navigation"
import CreateRecordModal from "@/components/growth/CreateRecordModal"
import GrowthTimeline from "@/components/growth/GrowthTimeline"
import StageIndicator from "@/components/growth/StageIndicator"
import DevelopmentCurveChart from "@/components/growth/DevelopmentCurveChart"
import GrowthCharts from "@/components/growth/GrowthCharts"
import AssessmentReport from "@/components/growth/AssessmentReport"
import ChildSelector from "@/components/ChildSelector"
import { useGrowthStage } from "@/hooks/useGrowthStage"
import { useChildren } from "@/hooks/useChildren"
import { ChildQVersionAvatar } from "@/components/ui/QVersionCharacter"

type TabType = "overview" | "timeline" | "records" | "assessment"

// 模拟发展数据点
const mockDevelopmentData = [
  { age: 72, value: 115, date: "2023-01-15", percentile: 55 },
  { age: 73, value: 116.5, date: "2023-02-15", percentile: 58 },
  { age: 74, value: 117.2, date: "2023-03-15", percentile: 60 },
  { age: 75, value: 118.5, date: "2023-04-15", percentile: 62 },
  { age: 76, value: 119.8, date: "2023-05-15", percentile: 65 },
  { age: 77, value: 120.5, date: "2023-06-15", percentile: 63 },
]

// 模拟评估结果
const mockAssessmentResult = {
  id: "assessment-001",
  childName: "小云",
  childAge: 75, // 6岁3个月 in months
  stageName: "学术奠基期",
  assessmentDate: new Date().toISOString(),
  dimensionScores: {
    academic: { score: 85, level: "良好", percentile: 75, description: "学业基础发展良好" },
    learning_habits: { score: 82, level: "良好", percentile: 70, description: "学习习惯良好" },
    logical_thinking: { score: 90, level: "优秀", percentile: 90, description: "逻辑思维优秀" },
    self_management: { score: 78, level: "良好", percentile: 65, description: "自我管理有待提升" },
    social_skills: { score: 92, level: "优秀", percentile: 92, description: "社交能力优秀" },
  },
  overallLevel: "良好",
  aiAnalysis: "小云整体发展良好，在逻辑思维和社交能力方面表现突出。建议重点关注时间管理和自主学习能力的培养，通过游戏化方式激发学习兴趣。",
  recommendations: [
    "继续培养阅读习惯，每天保持30分钟阅读时间",
    "可以尝试数学思维游戏，如数独、七巧板等",
    "建立固定的作业时间表，培养时间观念",
    "鼓励参与团队活动，发挥社交优势",
  ],
  nextSteps: [
    "定期进行发展评估，追踪成长变化",
    "保持与孩子的高质量陪伴时间",
    "鼓励探索和尝试新事物",
  ],
}

export default function GrowthPage() {
  const [activeTab, setActiveTab] = useState<TabType>("overview")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const { currentChild } = useChildren()

  const childBirthDate = currentChild?.birth_date ? new Date(currentChild.birth_date) : new Date("2018-09-15")
  const childName = currentChild?.name || "小云"

  const growthStageData = useGrowthStage(childBirthDate)
  const { stage, milestoneProgress, stageTransition, recommendations } = growthStageData as any

  const tabs = [
    { id: "overview" as const, label: "总览", icon: "ri-dashboard-line" },
    { id: "timeline" as const, label: "时间线", icon: "ri-time-line" },
    { id: "records" as const, label: "成长记录", icon: "ri-file-list-3-line" },
    { id: "assessment" as const, label: "智能评估", icon: "ri-bar-chart-box-line" },
  ]

  const handleCreateRecord = (_record: Record<string, unknown>) => {
    setIsCreateModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50 pb-24">
      <PageHeader title="成长记录" showBack />

      <main className="px-4 py-4 space-y-6">
        {currentChild && (
          <div className="bg-white/70 rounded-2xl p-4 flex items-center gap-4">
            <ChildQVersionAvatar child={currentChild as any} size="md" />
            <div className="flex-1">
              <h3 className="font-bold text-slate-800">{currentChild.name}的成长记录</h3>
              <p className="text-sm text-slate-500">
                {stage?.name} · {(currentChild as any).age_years || 0}岁{(currentChild as any).age_months || 0}个月
              </p>
            </div>
            <ChildSelector />
          </div>
        )}

        {!currentChild && (
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-center">
            <p className="text-amber-700">请先在设置中添加孩子档案</p>
            <a href="/children" className="text-blue-600 underline text-sm mt-2 inline-block">
              去添加
            </a>
          </div>
        )}

        {/* Tab导航 */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap ${
                activeTab === tab.id ? "bg-blue-500 text-white" : "bg-white text-slate-600 hover:bg-slate-100"
              }`}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className={tab.icon} />
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Tab内容 */}
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <OverviewTab
              key="overview"
              stage={stage}
              milestoneProgress={milestoneProgress}
              stageTransition={stageTransition}
              recommendations={recommendations}
              childName={childName}
              childBirthDate={childBirthDate}
            />
          )}
          {activeTab === "timeline" && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <GrowthTimeline childName={childName} />
            </motion.div>
          )}
          {activeTab === "records" && <RecordsTab key="records" onOpenCreateModal={() => setIsCreateModalOpen(true)} />}
          {activeTab === "assessment" && <AssessmentTab key="assessment" childName={childName} />}
        </AnimatePresence>
      </main>

      <Navigation />

      <CreateRecordModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateRecord}
      />
    </div>
  )
}

interface OverviewTabProps {
  stage: any
  milestoneProgress: any
  stageTransition: any
  recommendations: any
  childName: string
  childBirthDate: Date
}

function OverviewTab({
  stage,
  milestoneProgress,
  stageTransition,
  recommendations,
  childName,
  childBirthDate,
}: OverviewTabProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* 阶段指示器 */}
      <StageIndicator birthDate={childBirthDate} childName={childName} showMilestones showRecommendations />

      {/* 成长概览卡片 */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl p-6 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">
            {stage?.icon || "👧"}
          </div>
          <div>
            <h2 className="text-xl font-bold">{childName}</h2>
            <p className="text-white/80">
              {stage?.name || "成长中"} · {stage?.ageRange || ""}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold">156</div>
            <div className="text-xs text-white/70">成长记录</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold">{milestoneProgress?.completed || 0}</div>
            <div className="text-xs text-white/70">已达里程碑</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold">89%</div>
            <div className="text-xs text-white/70">发展达标</div>
          </div>
        </div>
      </div>

      {/* 阶段转换提醒 */}
      {stageTransition && stageTransition.daysUntilTransition <= 90 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-200">
          <h3 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
            <i className="ri-calendar-event-line" />
            阶段转换提醒
          </h3>
          <p className="text-sm text-amber-700">
            还有 <span className="font-bold">{stageTransition.daysUntilTransition}</span> 天将进入
            <span className="font-bold">「{stageTransition.nextStage?.name}」</span>
            阶段
          </p>
          <p className="text-xs text-amber-600 mt-2">{stageTransition.nextStage?.description}</p>
        </div>
      )}

      {/* 发展曲线预览 */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <i className="ri-line-chart-line text-blue-500" />
          发展曲线
        </h3>
        <DevelopmentCurveChart dataPoints={mockDevelopmentData} metricName="身高" unit="cm" childName={childName} />
      </div>

      {/* 最近里程碑 */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <i className="ri-trophy-line text-yellow-500" />
          最近里程碑
        </h3>
        <div className="space-y-3">
          {[
            { icon: "📚", title: "独立完成作业", date: "3天前", color: "bg-blue-50" },
            { icon: "🎨", title: "第一幅完整画作", date: "1周前", color: "bg-pink-50" },
            { icon: "🤝", title: "主动帮助同学", date: "2周前", color: "bg-green-50" },
          ].map((item, i) => (
            <div key={i} className={`flex items-center gap-3 p-3 ${item.color} rounded-xl`}>
              <span className="text-2xl">{item.icon}</span>
              <div className="flex-1">
                <h4 className="font-medium text-slate-800">{item.title}</h4>
                <p className="text-xs text-slate-500">{item.date}</p>
              </div>
              <i className="ri-arrow-right-s-line text-slate-400" />
            </div>
          ))}
        </div>
      </div>

      {/* 本周发展建议 */}
      {recommendations && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-5 border border-green-100">
          <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
            <i className="ri-lightbulb-line text-green-500" />
            阶段发展建议
          </h3>
          <div className="space-y-4">
            {recommendations.activities.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-2">推荐活动</h4>
                <ul className="space-y-1">
                  {recommendations.activities.slice(0, 3).map((activity: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <i className="ri-play-circle-line text-green-500 mt-0.5" />
                      {activity}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {recommendations.books.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-2">推荐阅读</h4>
                <ul className="space-y-1">
                  {recommendations.books.slice(0, 2).map((book: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <i className="ri-book-line text-blue-500 mt-0.5" />
                      {book}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  )
}

interface RecordsTabProps {
  onOpenCreateModal: () => void
}

function RecordsTab({ onOpenCreateModal }: RecordsTabProps) {
  const [recordType, setRecordType] = useState<"all" | "milestone" | "observation" | "emotion">("all")

  const records = [
    {
      type: "milestone",
      title: "第一次独立完成数学作业",
      content: "今天小云不需要任何帮助，独立完成了所有数学题！",
      date: "2025-01-15",
      tags: ["学习", "独立性"],
      emoji: "🎯",
      color: "yellow",
    },
    {
      type: "observation",
      title: "观察记录：社交能力发展",
      content: "今天在公园主动邀请其他小朋友一起玩耍，表现出良好的社交意愿",
      date: "2025-01-10",
      tags: ["社交", "友谊"],
      emoji: "👥",
      color: "purple",
    },
    {
      type: "emotion",
      title: "情绪记录：开心快乐",
      content: "收到老师表扬后非常开心，主动分享给家人",
      date: "2025-01-08",
      tags: ["情绪", "快乐"],
      emoji: "😊",
      color: "pink",
    },
  ]

  const filteredRecords = recordType === "all" ? records : records.filter((r) => r.type === recordType)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* 筛选器 */}
      <div className="flex gap-2 flex-wrap">
        {[
          { id: "all" as const, label: "全部记录", icon: "ri-list-check" },
          { id: "milestone" as const, label: "里程碑", icon: "ri-flag-line" },
          { id: "observation" as const, label: "观察日志", icon: "ri-eye-line" },
          { id: "emotion" as const, label: "情感记录", icon: "ri-heart-line" },
        ].map((filter) => (
          <motion.button
            key={filter.id}
            className={`px-4 py-2 rounded-full flex items-center gap-2 ${
              recordType === filter.id ? "bg-blue-500 text-white" : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
            onClick={() => setRecordType(filter.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className={filter.icon} />
            <span>{filter.label}</span>
          </motion.button>
        ))}
      </div>

      {/* 添加记录按钮 */}
      <motion.button
        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl p-4 flex items-center justify-center gap-2 font-bold"
        onClick={onOpenCreateModal}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <i className="ri-add-circle-line text-2xl" />
        <span>添加新记录</span>
      </motion.button>

      {/* 记录列表 */}
      <div className="space-y-4">
        {filteredRecords.map((record, i) => (
          <motion.div
            key={i}
            className="bg-white rounded-2xl p-5 shadow-sm"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.02, x: 5 }}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                {record.emoji}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-800 mb-1">{record.title}</h4>
                <p className="text-slate-600 text-sm mb-2">{record.content}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {record.tags.map((tag, j) => (
                    <span key={j} className="px-2 py-1 bg-slate-100 rounded-full text-xs text-slate-600">
                      #{tag}
                    </span>
                  ))}
                  <span className="text-xs text-slate-400 ml-auto">{record.date}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

function AssessmentTab({ childName }: { childName: string }) {
  const [showFullReport, setShowFullReport] = useState(false)

  const dimensions = [
    { name: "认知发展", score: 85, icon: "ri-brain-line", color: "text-blue-500", bgColor: "bg-blue-400" },
    { name: "语言能力", score: 92, icon: "ri-chat-1-line", color: "text-green-500", bgColor: "bg-green-400" },
    { name: "运动发展", score: 78, icon: "ri-run-line", color: "text-orange-500", bgColor: "bg-orange-400" },
    { name: "社会情感", score: 88, icon: "ri-heart-line", color: "text-pink-500", bgColor: "bg-pink-400" },
    { name: "自理能力", score: 90, icon: "ri-user-line", color: "text-purple-500", bgColor: "bg-purple-400" },
  ]

  // 图表数据
  const chartData = [
    { date: "2023-01-15", dimension: "认知发展", score: 85 },
    { date: "2023-01-15", dimension: "语言能力", score: 92 },
    { date: "2023-01-15", dimension: "运动发展", score: 78 },
    { date: "2023-01-15", dimension: "社会情感", score: 88 },
    { date: "2023-01-15", dimension: "自理能力", score: 90 },
  ]

  const mockAssessmentResultWithName = {
    ...mockAssessmentResult,
    childName: childName,
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* 综合评估卡片 */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <i className="ri-bar-chart-box-line text-blue-500" />
          发展评估概览
        </h3>
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-white">
            <div>
              <div className="text-3xl font-bold">87</div>
              <div className="text-xs">综合分</div>
            </div>
          </div>
          <p className="text-slate-500 text-sm mt-2">发展状况良好，继续保持！</p>
        </div>

        <div className="space-y-4">
          {dimensions.map((dim, i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2">
                  <i className={`${dim.icon} ${dim.color}`} />
                  {dim.name}
                </span>
                <span className="font-medium">{dim.score}分</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${dim.bgColor} rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${dim.score}%` }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 数据图表 */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <i className="ri-pie-chart-line text-purple-500" />
          能力分布图
        </h3>
        <GrowthCharts data={chartData} />
      </div>

      {/* 查看完整报告按钮 */}
      <motion.button
        className="w-full bg-white border-2 border-blue-500 text-blue-500 rounded-2xl p-4 font-bold flex items-center justify-center gap-2"
        onClick={() => setShowFullReport(!showFullReport)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <i className={showFullReport ? "ri-eye-off-line" : "ri-eye-line"} />
        {showFullReport ? "收起完整报告" : "查看完整AI评估报告"}
      </motion.button>

      {/* 完整评估报告 */}
      <AnimatePresence>
        {showFullReport && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <AssessmentReport result={mockAssessmentResultWithName} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 开始评估按钮 */}
      <motion.a
        href="/growth/assessment"
        className="block w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl p-4 text-center font-bold"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <i className="ri-file-list-3-line mr-2" />
        开始新的发展评估
      </motion.a>

      {/* AI洞察 */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-5 border border-purple-100">
        <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
          <i className="ri-sparkling-line text-purple-500" />
          AI小语洞察
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          根据最近的评估数据，{childName}在语言表达和社会情感方面表现出色。建议在运动发展方面增加更多户外活动，
          特别是球类运动和平衡训练，可以帮助提升大运动协调能力。继续保持亲子阅读时间，这对语言发展非常有益。
        </p>
      </div>
    </motion.div>
  )
}
