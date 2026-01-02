"use client"

import { useState, useCallback } from "react"

interface EmotionData {
  emotion: string
  confidence: number
  valence: number
  arousal: number
  keywords: string[]
  advice?: string
}

export function useEmotionAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [currentEmotion, setCurrentEmotion] = useState<EmotionData | null>(null)

  const analyzeEmotion = useCallback(async (text: string, includeAdvice = true): Promise<EmotionData | null> => {
    if (!text || text.length < 2) return null

    setIsAnalyzing(true)

    try {
      const response = await fetch("/api/ai/emotion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, includeAdvice }),
      })

      if (!response.ok) {
        throw new Error("情感分析失败")
      }

      const data: EmotionData = await response.json()
      setCurrentEmotion(data)
      return data
    } catch (error) {
      console.error("[v0] 情感分析错误:", error)
      return null
    } finally {
      setIsAnalyzing(false)
    }
  }, [])

  const getEmotionEmoji = (emotion: string): string => {
    const emojiMap: Record<string, string> = {
      happy: "😊",
      sad: "😢",
      angry: "😠",
      excited: "🤩",
      calm: "😌",
      anxious: "😰",
      neutral: "😐",
    }
    return emojiMap[emotion] || "🙂"
  }

  const getEmotionColor = (emotion: string): string => {
    const colorMap: Record<string, string> = {
      happy: "yellow",
      sad: "blue",
      angry: "red",
      excited: "orange",
      calm: "green",
      anxious: "purple",
      neutral: "slate",
    }
    return colorMap[emotion] || "slate"
  }

  return {
    analyzeEmotion,
    isAnalyzing,
    currentEmotion,
    getEmotionEmoji,
    getEmotionColor,
  }
}
