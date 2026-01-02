"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Navigation from "@/components/Navigation"
import PageHeader from "@/components/headers/PageHeader"
import { useSchedule } from "@/hooks/useSchedule"
import { useChildren } from "@/hooks/useChildren"
import ChildSelector from "@/components/ChildSelector"
import {
  type Schedule,
  type ScheduleType,
  type ScheduleFormData,
  SCHEDULE_TYPE_CONFIG,
  getScheduleColor,
  getScheduleIcon,
  getScheduleLabel,
} from "@/types/schedule"

type ViewMode = "day" | "week" | "timeline"

export default function SchedulePage() {
  const [viewMode, setViewMode] = useState<ViewMode>("day")
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showEditor, setShowEditor] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null)
  const [showAIGenerator, setShowAIGenerator] = useState(false)

  const { currentChild } = useChildren()
  const {
    schedules: _schedules,
    isLoading: _isLoading,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    toggleComplete,
    getSchedulesByDate,
    generateAISchedule,
  } = useSchedule()

  const todaySchedules = useMemo(() => {
    return getSchedulesByDate(selectedDate).sort(
      (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
    )
  }, [getSchedulesByDate, selectedDate])

  const completedCount = todaySchedules.filter((s) => s.completed).length
  const totalCount = todaySchedules.length

  const handleAddSchedule = () => {
    setEditingSchedule(null)
    setShowEditor(true)
  }

  const handleEditSchedule = (schedule: Schedule) => {
    setEditingSchedule(schedule)
    setShowEditor(true)
  }

  const handleSaveSchedule = async (data: ScheduleFormData) => {
    if (editingSchedule) {
      await updateSchedule(editingSchedule.id, data)
    } else {
      await addSchedule(data, currentChild?.id || "default")
    }
    setShowEditor(false)
    setEditingSchedule(null)
  }

  const handleGenerateAI = async () => {
    if (!currentChild) return

    await generateAISchedule(currentChild.id, {
      wakeUpTime: "07:00",
      sleepTime: "21:30",
      studyFocus: ["语文", "数学", "英语"],
      breakFrequency: 15,
    })

    setShowAIGenerator(false)
  }

  const formatDate = (date: Date) => {
    const d = new Date(date)
    const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]
    return `${d.getMonth() + 1}月${d.getDate()}日 ${weekdays[d.getDay()]}`
  }

  const navigateDate = (delta: number) => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + delta)
    setSelectedDate(newDate)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-24">
      <PageHeader title="智能日程" showBack />

      <div className="px-4 py-4 space-y-4">
        {currentChild && (
          <motion.div
            className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                  {currentChild.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{currentChild.name}的日程</h3>
                  <p className="text-xs text-slate-500">
                    今日完成 {completedCount}/{totalCount} 项
                  </p>
                </div>
              </div>
              <ChildSelector />
            </div>
          </motion.div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.button
              className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-600 hover:bg-slate-50"
              onClick={() => navigateDate(-1)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <i className="ri-arrow-left-s-line" />
            </motion.button>
            <span className="font-bold text-slate-800 min-w-[140px] text-center">{formatDate(selectedDate)}</span>
            <motion.button
              className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-600 hover:bg-slate-50"
              onClick={() => navigateDate(1)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <i className="ri-arrow-right-s-line" />
            </motion.button>
          </div>

          <div className="flex gap-1 bg-white rounded-full p-1 shadow-sm">
            {[
              { id: "day" as ViewMode, icon: "ri-calendar-line", label: "日" },
              { id: "week" as ViewMode, icon: "ri-calendar-2-line", label: "周" },
              { id: "timeline" as ViewMode, icon: "ri-time-line", label: "线" },
            ].map((mode) => (
              <motion.button
                key={mode.id}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                  viewMode === mode.id ? "bg-blue-500 text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
                onClick={() => setViewMode(mode.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {mode.label}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <motion.button
            className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold flex items-center justify-center gap-2"
            onClick={handleAddSchedule}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <i className="ri-add-line" />
            添加日程
          </motion.button>
          <motion.button
            className="px-4 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-bold flex items-center justify-center gap-2"
            onClick={() => setShowAIGenerator(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <i className="ri-magic-line" />
            AI排程
          </motion.button>
        </div>

        {_isLoading ? (
          <div className="flex items-center justify-center py-12">
            <motion.div
              className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />
          </div>
        ) : viewMode === "timeline" ? (
          <TimelineView
            schedules={todaySchedules}
            onToggleComplete={toggleComplete}
            onEdit={handleEditSchedule}
            onDelete={deleteSchedule}
          />
        ) : (
          <DayView
            schedules={todaySchedules}
            onToggleComplete={toggleComplete}
            onEdit={handleEditSchedule}
            onDelete={deleteSchedule}
          />
        )}
      </div>

      <AnimatePresence>
        {showEditor && (
          <ScheduleEditorModal
            schedule={editingSchedule}
            onSave={handleSaveSchedule}
            onClose={() => {
              setShowEditor(false)
              setEditingSchedule(null)
            }}
          />
        )}

        {showAIGenerator && (
          <AIScheduleGeneratorModal onGenerate={handleGenerateAI} onClose={() => setShowAIGenerator(false)} />
        )}
      </AnimatePresence>

      <Navigation />
    </div>
  )
}

function DayView({
  schedules,
  onToggleComplete,
  onEdit,
  onDelete,
}: {
  schedules: Schedule[]
  onToggleComplete: (id: string) => void
  onEdit: (schedule: Schedule) => void
  onDelete: (id: string) => void
}) {
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })
  }

  if (schedules.length === 0) {
    return (
      <motion.div className="text-center py-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-5xl mb-4">📅</div>
        <h3 className="font-bold text-slate-700 mb-2">今天还没有日程</h3>
        <p className="text-sm text-slate-500">点击上方按钮添加日程或让AI帮你安排</p>
      </motion.div>
    )
  }

  return (
    <div className="space-y-3">
      {schedules.map((schedule, index) => (
        <motion.div
          key={schedule.id}
          className={`bg-white rounded-2xl p-4 shadow-sm border-l-4 ${schedule.completed ? "opacity-60" : ""}`}
          style={{ borderLeftColor: schedule.color }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <div className="flex items-start gap-3">
            <motion.button
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                schedule.completed ? "bg-green-500 border-green-500 text-white" : "border-slate-300"
              }`}
              onClick={() => onToggleComplete(schedule.id)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {schedule.completed && <i className="ri-check-line text-sm" />}
            </motion.button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
                  style={{ backgroundColor: schedule.color }}
                >
                  <i className={getScheduleIcon(schedule.type)} />
                </span>
                <span className="text-xs text-slate-500">{getScheduleLabel(schedule.type)}</span>
                {schedule.aiGenerated && (
                  <span className="px-1.5 py-0.5 bg-purple-100 text-purple-600 text-xs rounded">AI</span>
                )}
              </div>

              <h4 className={`font-bold text-slate-800 ${schedule.completed ? "line-through" : ""}`}>
                {schedule.title}
              </h4>

              <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                <i className="ri-time-line" />
                <span>
                  {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                </span>
              </div>

              {schedule.description && <p className="text-xs text-slate-500 mt-1">{schedule.description}</p>}
            </div>

            <div className="flex gap-1">
              <motion.button
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200"
                onClick={() => onEdit(schedule)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <i className="ri-edit-line text-sm" />
              </motion.button>
              <motion.button
                className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-100"
                onClick={() => onDelete(schedule.id)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <i className="ri-delete-bin-line text-sm" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function TimelineView({
  schedules,
  onEdit,
  onDelete: _onDelete,
}: {
  schedules: Schedule[]
  onToggleComplete: (id: string) => void
  onEdit: (schedule: Schedule) => void
  onDelete: (id: string) => void
}) {
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })
  }

  const hours = Array.from({ length: 17 }, (_, i) => i + 6)

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="relative">
        {hours.map((hour) => (
          <div key={hour} className="flex items-start h-16 border-b border-slate-100 last:border-0">
            <span className="w-12 text-xs text-slate-400 flex-shrink-0">{hour}:00</span>
            <div className="flex-1 relative">
              {schedules
                .filter((s) => new Date(s.startTime).getHours() === hour)
                .map((schedule) => (
                  <motion.div
                    key={schedule.id}
                    className="absolute left-0 right-0 mx-1 px-2 py-1 rounded-lg text-white text-xs cursor-pointer"
                    style={{
                      backgroundColor: schedule.color,
                      opacity: schedule.completed ? 0.6 : 1,
                    }}
                    onClick={() => onEdit(schedule)}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center gap-1">
                      <i className={getScheduleIcon(schedule.type)} />
                      <span className="font-medium truncate">{schedule.title}</span>
                    </div>
                    <span className="text-white/80">
                      {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                    </span>
                  </motion.div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ScheduleEditorModal({
  schedule,
  onSave,
  onClose,
}: {
  schedule: Schedule | null
  onSave: (data: ScheduleFormData) => void
  onClose: () => void
}) {
  const [formData, setFormData] = useState<ScheduleFormData>({
    title: schedule?.title || "",
    description: schedule?.description || "",
    type: schedule?.type || "custom",
    startTime: schedule ? new Date(schedule.startTime).toISOString().slice(0, 16) : "",
    endTime: schedule ? new Date(schedule.endTime).toISOString().slice(0, 16) : "",
    repeat: schedule?.repeat || { type: "none", interval: 1 },
    reminder: schedule?.reminder || { enabled: false, beforeMinutes: [15], methods: ["toast"] },
    color: schedule?.color || getScheduleColor("custom"),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white w-full max-w-lg rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">{schedule ? "编辑日程" : "添加日程"}</h2>
          <motion.button
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <i className="ri-close-line" />
          </motion.button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">标题</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-blue-400"
              placeholder="输入日程标题"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">类型</label>
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(SCHEDULE_TYPE_CONFIG).map(([type, config]) => (
                <motion.button
                  key={type}
                  type="button"
                  className={`p-2 rounded-xl text-center transition ${
                    formData.type === type ? "ring-2 ring-blue-500" : "bg-slate-50"
                  }`}
                  style={{
                    backgroundColor: formData.type === type ? `${config.color}20` : undefined,
                  }}
                  onClick={() => setFormData({ ...formData, type: type as ScheduleType, color: config.color })}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <i className={`${config.icon} text-lg`} style={{ color: config.color }} />
                  <p className="text-xs mt-1">{config.label}</p>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">开始时间</label>
              <input
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-blue-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">结束时间</label>
              <input
                type="datetime-local"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-blue-400"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">描述 (可选)</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-blue-400 resize-none"
              rows={2}
              placeholder="添加描述..."
            />
          </div>

          <motion.button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {schedule ? "保存修改" : "创建日程"}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  )
}

function AIScheduleGeneratorModal({
  onGenerate,
  onClose,
}: {
  onGenerate: () => void
  onClose: () => void
}) {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    setIsGenerating(true)
    await onGenerate()
    setIsGenerating(false)
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white w-full max-w-md rounded-3xl p-6"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <motion.div
            className="w-16 h-16 mx-auto bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center text-white text-2xl mb-4"
            animate={{ rotate: isGenerating ? 360 : 0 }}
            transition={{ duration: 2, repeat: isGenerating ? Number.POSITIVE_INFINITY : 0, ease: "linear" }}
          >
            <i className="ri-magic-line" />
          </motion.div>
          <h2 className="text-xl font-bold text-slate-800">AI智能排程</h2>
          <p className="text-sm text-slate-500 mt-2">AI将根据孩子的年龄和学习习惯，自动生成科学的每日日程安排</p>
        </div>

        <div className="bg-slate-50 rounded-2xl p-4 mb-6">
          <h4 className="font-medium text-slate-700 mb-3">生成内容包含:</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {[
              { icon: "ri-sun-line", label: "起床时间" },
              { icon: "ri-book-open-line", label: "学习安排" },
              { icon: "ri-restaurant-line", label: "用餐时间" },
              { icon: "ri-run-line", label: "运动时间" },
              { icon: "ri-gamepad-line", label: "休闲娱乐" },
              { icon: "ri-moon-line", label: "睡眠时间" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-slate-600">
                <i className={`${item.icon} text-blue-500`} />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <motion.button
            className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium"
            onClick={onClose}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            取消
          </motion.button>
          <motion.button
            className="flex-1 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-bold flex items-center justify-center gap-2"
            onClick={handleGenerate}
            disabled={isGenerating}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isGenerating ? (
              <>
                <motion.div
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                />
                生成中...
              </>
            ) : (
              <>
                <i className="ri-magic-line" />
                开始生成
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}
