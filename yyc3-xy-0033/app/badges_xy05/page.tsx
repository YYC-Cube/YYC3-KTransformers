"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import PageHeader from "@/components/headers/PageHeader"
import Navigation from "@/components/Navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useChildren } from "@/hooks/useChildren"

type BadgeLevel = "bronze" | "silver" | "gold" | "platinum"

interface AchievementBadge {
  id: string
  title: string
  description: string
  icon: string
  level: BadgeLevel
  unlocked: boolean
  progress?: number
  unlockedDate?: string
  conditions: string[]
  category: string
}

const mockBadges: AchievementBadge[] = [
  {
    id: "badge-001",
    title: "初学者",
    description: "完成第一次成长记录",
    icon: "🌱",
    level: "bronze",
    unlocked: true,
    unlockedDate: "2025-01-15",
    conditions: ["完成1条成长记录"],
    category: "成长记录"
  },
  {
    id: "badge-002",
    title: "观察家",
    description: "记录10次观察日志",
    icon: "👁️",
    level: "bronze",
    unlocked: true,
    progress: 100,
    unlockedDate: "2025-01-20",
    conditions: ["完成10条观察日志"],
    category: "观察记录"
  },
  {
    id: "badge-003",
    title: "情绪捕捉者",
    description: "记录20次情绪变化",
    icon: "💭",
    level: "silver",
    unlocked: true,
    progress: 100,
    unlockedDate: "2025-01-25",
    conditions: ["完成20条情绪记录"],
    category: "情绪记录"
  },
  {
    id: "badge-004",
    title: "里程碑达人",
    description: "解锁5个成长里程碑",
    icon: "🏆",
    level: "silver",
    unlocked: false,
    progress: 60,
    conditions: ["解锁5个成长里程碑", "当前进度: 3/5"],
    category: "里程碑"
  },
  {
    id: "badge-005",
    title: "文化探索者",
    description: "体验10个河洛文化场景",
    icon: "🏛️",
    level: "gold",
    unlocked: false,
    progress: 30,
    conditions: ["体验10个河洛文化场景", "当前进度: 3/10"],
    category: "文化体验"
  },
  {
    id: "badge-006",
    title: "智慧导师",
    description: "获得AI建议100次",
    icon: "🎓",
    level: "gold",
    unlocked: false,
    progress: 45,
    conditions: ["获得AI建议100次", "当前进度: 45/100"],
    category: "AI互动"
  },
  {
    id: "badge-007",
    title: "全能家长",
    description: "完成所有基础功能体验",
    icon: "⭐",
    level: "platinum",
    unlocked: false,
    progress: 70,
    conditions: ["完成成长记录", "完成观察日志", "完成情绪记录", "体验文化场景", "获得AI建议"],
    category: "综合成就"
  },
  {
    id: "badge-008",
    title: "陪伴之星",
    description: "连续记录30天",
    icon: "🌟",
    level: "gold",
    unlocked: false,
    progress: 50,
    conditions: ["连续记录30天", "当前进度: 15/30天"],
    category: "坚持记录"
  },
  {
    id: "badge-009",
    title: "创意工坊",
    description: "使用AI创意功能50次",
    icon: "🎨",
    level: "silver",
    unlocked: false,
    progress: 20,
    conditions: ["使用AI创意功能50次", "当前进度: 10/50"],
    category: "AI创意"
  },
  {
    id: "badge-010",
    title: "作业助手",
    description: "完成作业辅导20次",
    icon: "📚",
    level: "bronze",
    unlocked: false,
    progress: 80,
    conditions: ["完成作业辅导20次", "当前进度: 16/20"],
    category: "作业辅导"
  }
]

const levelColors: Record<BadgeLevel, { bg: string; border: string; text: string; shadow: string }> = {
  bronze: { bg: "from-amber-100 to-orange-100", border: "border-amber-300", text: "text-amber-700", shadow: "shadow-amber-200" },
  silver: { bg: "from-slate-100 to-gray-100", border: "border-slate-300", text: "text-slate-700", shadow: "shadow-slate-200" },
  gold: { bg: "from-yellow-100 to-amber-100", border: "border-yellow-300", text: "text-yellow-700", shadow: "shadow-yellow-200" },
  platinum: { bg: "from-purple-50 to-pink-50", border: "border-purple-300", text: "text-purple-700", shadow: "shadow-purple-200" }
}

const levelIcons: Record<BadgeLevel, string> = {
  bronze: "🥉",
  silver: "🥈",
  gold: "🥇",
  platinum: "💎"
}

export default function BadgesPage() {
  const [filter, setFilter] = useState<"all" | "unlocked" | "locked">("all")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedBadge, setSelectedBadge] = useState<AchievementBadge | null>(null)
  const { currentChild } = useChildren()

  const categories = ["all", ...Array.from(new Set(mockBadges.map(b => b.category)))]

  const filteredBadges = mockBadges.filter(badge => {
    const filterMatch = filter === "all" || (filter === "unlocked" ? badge.unlocked : !badge.unlocked)
    const categoryMatch = selectedCategory === "all" || badge.category === selectedCategory
    return filterMatch && categoryMatch
  })

  const unlockedCount = mockBadges.filter(b => b.unlocked).length
  const totalCount = mockBadges.length
  const completionRate = Math.round((unlockedCount / totalCount) * 100)

  const handleShare = async (badge: AchievementBadge) => {
    if ("share" in navigator) {
      try {
        await navigator.share({
          title: `我获得了${badge.title}勋章！`,
          text: `我在YYC³成长陪伴系统中获得了${badge.title}勋章！${badge.description}`,
          url: window.location.href
        })
      } catch (err) {
        console.log("分享失败:", err)
      }
    } else {
      alert("您的浏览器不支持分享功能")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-yellow-50 pb-24">
      <PageHeader title="勋章殿堂" showBack />

      <main className="px-4 py-4 space-y-6">
        {currentChild && (
          <Card className="bg-gradient-to-r from-amber-500 to-orange-500 border-amber-600">
            <CardContent className="p-6 text-white">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">
                  🏆
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{currentChild.name}的成就</h3>
                  <p className="text-white/80 text-sm">已获得 {unlockedCount} 个勋章</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{completionRate}%</div>
                  <div className="text-xs text-white/70">完成率</div>
                </div>
              </div>
              <Progress value={completionRate} className="mt-4 bg-white/20" />
            </CardContent>
          </Card>
        )}

        {!currentChild && (
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-6 text-center">
              <p className="text-amber-700">请先在设置中添加孩子档案</p>
              <Link href="/children" className="text-blue-600 underline text-sm mt-2 inline-block">
                去添加
              </Link>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">筛选条件</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {[
                { id: "all" as const, label: "全部", icon: "ri-apps-line" },
                { id: "unlocked" as const, label: "已获得", icon: "ri-check-line" },
                { id: "locked" as const, label: "未获得", icon: "ri-lock-line" }
              ].map((item) => (
                <motion.button
                  key={item.id}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap ${
                    filter === item.id
                      ? "bg-amber-500 text-white"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                  onClick={() => { setFilter(item.id); }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <i className={item.icon} />
                  <span>{item.label}</span>
                </motion.button>
              ))}
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
                    selectedCategory === category
                      ? "bg-blue-500 text-white"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                  onClick={() => { setSelectedCategory(category); }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category === "all" ? "全部分类" : category}
                </motion.button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredBadges.map((badge, index) => {
              const levelColor = levelColors[badge.level]
              return (
                <motion.div
                  key={badge.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  onClick={() => { setSelectedBadge(badge); }}
                  className="cursor-pointer"
                >
                  <Card className={`h-full ${levelColor.bg} ${levelColor.border} ${levelColor.shadow} shadow-lg`}>
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="relative">
                          <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${levelColor.bg} flex items-center justify-center text-4xl shadow-inner ${badge.unlocked ? '' : 'opacity-50'}`}>
                            {badge.icon}
                          </div>
                          {!badge.unlocked && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <i className="ri-lock-line text-2xl text-slate-400" />
                            </div>
                          )}
                          {badge.unlocked && (
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs shadow-md">
                              {levelIcons[badge.level]}
                            </div>
                          )}
                        </div>

                        <div className="flex-1 w-full">
                          <h4 className={`font-bold ${levelColor.text} text-sm mb-1`}>
                            {badge.title}
                          </h4>
                          <p className="text-xs text-slate-600 line-clamp-2">
                            {badge.description}
                          </p>
                          <Badge variant="secondary" className="mt-2 text-xs">
                            {badge.category}
                          </Badge>
                        </div>

                        {badge.progress !== undefined && badge.progress < 100 && (
                          <div className="w-full">
                            <Progress value={badge.progress} className="h-2" />
                            <p className="text-xs text-slate-500 mt-1">{badge.progress}%</p>
                          </div>
                        )}

                        {badge.unlocked && badge.unlockedDate && (
                          <p className="text-xs text-slate-500">
                            {badge.unlockedDate} 获得
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {filteredBadges.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <i className="ri-trophy-line text-6xl text-slate-300 mb-4" />
              <p className="text-slate-500">暂无符合条件的勋章</p>
            </CardContent>
          </Card>
        )}
      </main>

      <Navigation />

      <Dialog open={!!selectedBadge} onOpenChange={() => { setSelectedBadge(null); }}>
        <DialogContent className="max-w-md">
          {selectedBadge && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <span className="text-4xl">{selectedBadge.icon}</span>
                  <div>
                    <div className="text-lg">{selectedBadge.title}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary">{levelIcons[selectedBadge.level]}</Badge>
                      <Badge variant="outline">{selectedBadge.category}</Badge>
                    </div>
                  </div>
                </DialogTitle>
                <DialogDescription className="text-base">
                  {selectedBadge.description}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                {selectedBadge.unlocked && selectedBadge.unlockedDate && (
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <p className="text-green-700 font-medium flex items-center gap-2">
                      <i className="ri-check-circle-line" />
                      已于 {selectedBadge.unlockedDate} 获得
                    </p>
                  </div>
                )}

                {!selectedBadge.unlocked && (
                  <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                    <p className="text-amber-700 font-medium mb-2">获得条件：</p>
                    <ul className="space-y-1 text-sm text-amber-600">
                      {selectedBadge.conditions.map((condition, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <i className="ri-arrow-right-line mt-0.5" />
                          {condition}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedBadge.progress !== undefined && selectedBadge.progress < 100 && (
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-600">完成进度</span>
                      <span className="font-medium">{selectedBadge.progress}%</span>
                    </div>
                    <Progress value={selectedBadge.progress} />
                  </div>
                )}

                {selectedBadge.unlocked && (
                  <Button
                    onClick={() => {
                      handleShare(selectedBadge).catch((err: unknown) => {
                        console.log("分享失败:", err);
                      });
                    }}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  >
                    <i className="ri-share-line mr-2" />
                    分享成就
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
