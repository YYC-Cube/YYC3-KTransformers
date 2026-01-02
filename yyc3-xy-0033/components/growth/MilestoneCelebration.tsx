"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface MilestoneCelebrationProps {
  isVisible: boolean
  milestone: {
    title: string
    description: string
    age: string
    category: string
  } | null
  onClose: () => void
}

// 彩带粒子配置
const confettiColors = ["#FF6B6B", "#4ECDC4", "#FFE66D", "#95E1D3", "#F38181", "#AA96DA", "#FCBAD3", "#A8D8EA"]

function ConfettiParticle({ delay, color }: { delay: number; color: string }) {
  const randomX = Math.random() * 100
  const randomRotation = Math.random() * 360
  const duration = 2 + Math.random() * 2

  return (
    <motion.div
      className="absolute w-3 h-3 rounded-sm"
      style={{
        backgroundColor: color,
        left: `${randomX}%`,
        top: -20,
      }}
      initial={{ y: 0, rotate: 0, opacity: 1 }}
      animate={{
        y: [0, 600],
        rotate: [0, randomRotation + 360],
        opacity: [1, 1, 0],
      }}
      transition={{
        duration,
        delay,
        ease: "easeIn",
      }}
    />
  )
}

function StarBurst({ delay }: { delay: number }) {
  return (
    <motion.div
      className="absolute"
      style={{
        left: `${20 + Math.random() * 60}%`,
        top: `${20 + Math.random() * 40}%`,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: [0, 1.5, 0],
        opacity: [0, 1, 0],
        rotate: [0, 180],
      }}
      transition={{
        duration: 0.8,
        delay,
        ease: "easeOut",
      }}
    >
      <svg width="40" height="40" viewBox="0 0 40 40">
        <path d="M20 0 L23 15 L40 20 L23 25 L20 40 L17 25 L0 20 L17 15 Z" fill="#FFD700" />
      </svg>
    </motion.div>
  )
}

export default function MilestoneCelebration({ isVisible, milestone, onClose }: MilestoneCelebrationProps) {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setShowConfetti(true)
      // 5秒后自动关闭
      const timer = setTimeout(() => {
        onClose()
      }, 5000)
      return () => clearTimeout(timer)
    } else {
      setShowConfetti(false)
      return undefined
    }
  }, [isVisible, onClose])

  if (!milestone) return null

  const categoryEmoji: Record<string, string> = {
    motor: "🏃",
    language: "💬",
    cognitive: "🧠",
    social: "👋",
    emotional: "❤️",
    selfcare: "🌟",
    academic: "📚",
    creative: "🎨",
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* 背景遮罩 */}
          <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

          {/* 彩带效果 */}
          {showConfetti && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 50 }).map((_, i) => (
                <ConfettiParticle
                  key={i}
                  delay={Math.random() * 0.5}
                  color={confettiColors[i % confettiColors.length]!}
                />
              ))}
              {Array.from({ length: 8 }).map((_, i) => (
                <StarBurst key={`star-${i}`} delay={0.2 + i * 0.15} />
              ))}
            </div>
          )}

          {/* 庆祝卡片 */}
          <motion.div
            className="relative z-10 bg-white rounded-3xl p-8 mx-4 max-w-md w-full shadow-2xl"
            initial={{ scale: 0.5, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.5, y: 50, opacity: 0 }}
            transition={{ type: "spring", damping: 15 }}
          >
            {/* 顶部装饰 */}
            <motion.div
              className="absolute -top-12 left-1/2 -translate-x-1/2"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-5xl shadow-lg">
                🎉
              </div>
            </motion.div>

            {/* 内容 */}
            <div className="text-center pt-14">
              <motion.h2
                className="text-2xl font-bold text-slate-800 mb-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                里程碑达成!
              </motion.h2>

              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                <span className="text-xl">{categoryEmoji[milestone.category] || "⭐"}</span>
                <span className="text-sm font-medium text-purple-700">{milestone.age}</span>
              </motion.div>

              <motion.h3
                className="text-xl font-semibold text-slate-700 mb-3"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {milestone.title}
              </motion.h3>

              <motion.p
                className="text-slate-500 mb-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                {milestone.description}
              </motion.p>

              {/* 祝福语 */}
              <motion.div
                className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 mb-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <p className="text-sm text-slate-600 italic">
                  "每一个小小的进步，都是成长路上的闪光时刻。
                  <br />
                  恭喜宝贝，继续加油!"
                </p>
              </motion.div>

              {/* 按钮 */}
              <motion.div
                className="flex gap-3 justify-center"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-shadow"
                >
                  记录这一刻
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-medium hover:bg-slate-200 transition-colors"
                >
                  关闭
                </button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
