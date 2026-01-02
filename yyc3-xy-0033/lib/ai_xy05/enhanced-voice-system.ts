"use client"

import { getVoiceService } from "./voice-services"

/**
 * YYC³ 增强语音系统
 * 支持语音唤醒、多模态情感分析、智能合成
 */

export interface ExtendedWindow extends Window {
  SpeechRecognition?: typeof SpeechRecognition
  webkitSpeechRecognition?: typeof SpeechRecognition
  webkitAudioContext?: typeof AudioContext
}

export interface EmotionAnalysisResult {
  dominant_emotion: string
  confidence: number
  emotions: Record<string, number>
  sentiment: number
}

export interface AudioEmotionResult {
  emotion: string
  confidence: number
}

export class EnhancedVoiceSystem {
  private isListening = false
  private isSpeaking = false
  private recognition: SpeechRecognition | null = null
  private synthesis: SpeechSynthesis | null = null
  private audioContext: AudioContext | null = null
  private wakeWordDetector: WakeWordDetector | null = null

  // 情感分析引擎
  private emotionAnalyzer: EmotionAnalyzer

  // 事件监听器
  private listeners: Map<string, Function[]> = new Map()

  constructor() {
    this.emotionAnalyzer = new EmotionAnalyzer()
    this.initializeVoiceSystem()
  }

  private async initializeVoiceSystem() {
    if (typeof window === "undefined") return

    try {
      // 初始化语音合成
      this.synthesis = window.speechSynthesis

      // 初始化音频上下文
      const extendedWindow = window as ExtendedWindow
      this.audioContext = new (window.AudioContext || extendedWindow.webkitAudioContext)()

      // 初始化唤醒词检测
      this.wakeWordDetector = new WakeWordDetector()

      // 加载语音列表
      this.loadVoices()

      console.log("[EnhancedVoiceSystem] 语音系统初始化完成")
    } catch (error) {
      console.error("[EnhancedVoiceSystem] 语音系统初始化失败:", error)
    }
  }

  private loadVoices() {
    if (!this.synthesis) return

    const updateVoices = () => {
      const voices = this.synthesis!.getVoices()
      console.log(`[EnhancedVoiceSystem] 已加载 ${voices.length} 个语音`)
    }

    updateVoices()
    this.synthesis.addEventListener('voiceschanged', updateVoices)
  }

  /**
   * 开始语音唤醒监听
   */
  async startWakeWordListening(): Promise<void> {
    if (!this.wakeWordDetector) {
      throw new Error("唤醒词检测器未初始化")
    }

    this.isListening = true
    this.emit('wakeWordStart')

    try {
      await this.wakeWordDetector.startListening((detected) => {
        if (detected) {
          this.emit('wakeWordDetected')
          console.log("[EnhancedVoiceSystem] 检测到唤醒词")
        }
      })
    } catch (error) {
      this.isListening = false
      this.emit('wakeWordError', error)
      throw error
    }
  }

  /**
   * 停止语音唤醒监听
   */
  stopWakeWordListening(): void {
    if (this.wakeWordDetector) {
      this.wakeWordDetector.stopListening()
    }
    this.isListening = false
    this.emit('wakeWordStop')
  }

  /**
   * 智能语音识别（带情感分析）
   */
  async recognizeSpeechWithEmotion(audioBlob: Blob): Promise<{
    text: string
    emotion: string
    confidence: number
    sentiment: number
  }> {
    try {
      // 1. 语音转文字
      const voiceService = getVoiceService()
      const text = await voiceService.speechToText(audioBlob)

      // 2. 情感分析
      const emotionResult = await this.emotionAnalyzer.analyzeText(text)

      // 3. 音频情感检测
      const audioEmotion = await this.analyzeAudioEmotion(audioBlob)

      // 4. 融合分析结果
      const fusedResult = this.fuseEmotionResults(emotionResult, audioEmotion)

      return {
        text,
        emotion: fusedResult.emotion,
        confidence: fusedResult.confidence,
        sentiment: fusedResult.sentiment
      }
    } catch (error) {
      console.error("[EnhancedVoiceSystem] 语音识别失败:", error)
      throw error
    }
  }

  /**
   * 智能语音合成（带情感色彩）
   */
  async speakWithEmotion(
    text: string,
    emotion: string = "neutral",
    options: {
      rate?: number
      pitch?: number
      volume?: number
      voice?: string
    } = {}
  ): Promise<void> {
    if (!this.synthesis) {
      throw new Error("语音合成引擎未初始化")
    }

    // 停止当前播放
    this.stopSpeaking()

    const utterance = new SpeechSynthesisUtterance(text)

    // 根据情感调整语音参数
    const emotionSettings = this.getEmotionVoiceSettings(emotion)
    utterance.rate = options.rate || emotionSettings.rate
    utterance.pitch = options.pitch || emotionSettings.pitch
    utterance.volume = options.volume || emotionSettings.volume

    // 选择合适的语音
    if (options.voice) {
      const voices = this.synthesis.getVoices()
      const selectedVoice = voices.find(voice => voice.name.includes(options.voice!))
      if (selectedVoice) {
        utterance.voice = selectedVoice
      }
    } else {
      // 根据情感选择默认语音
      utterance.voice = this.selectVoiceByEmotion(emotion)
    }

    return new Promise((resolve, reject) => {
      utterance.onend = () => {
        this.isSpeaking = false
        this.emit('speakingEnd')
        resolve()
      }

      utterance.onerror = (event) => {
        this.isSpeaking = false
        this.emit('speakingError', event)
        reject(new Error(`语音合成失败: ${event.error}`))
      }

      utterance.onstart = () => {
        this.isSpeaking = true
        this.emit('speakingStart')
      }

      this.synthesis.speak(utterance)
    })
  }

  /**
   * 停止语音播放
   */
  stopSpeaking(): void {
    if (this.synthesis) {
      this.synthesis.cancel()
      this.isSpeaking = false
      this.emit('speakingStop')
    }
  }

  /**
   * 根据情感选择语音
   */
  private selectVoiceByEmotion(emotion: string): SpeechSynthesisVoice | null {
    if (!this.synthesis) return null

    const voices = this.synthesis.getVoices()
    const chineseVoices = voices.filter(voice =>
      voice.lang.includes('zh') || voice.lang.includes('Chinese')
    )

    if (chineseVoices.length === 0) return voices[0] || null

    // 根据情感选择合适的语音
    switch (emotion) {
      case 'happy':
      case 'excited':
        return chineseVoices.find(v => v.name.includes('Xiaoxiao')) || chineseVoices[0]
      case 'gentle':
      case 'calm':
        return chineseVoices.find(v => v.name.includes('Yaoyao')) || chineseVoices[0]
      case 'authoritative':
      case 'serious':
        return chineseVoices.find(v => v.name.includes('Yunyang')) || chineseVoices[0]
      default:
        return chineseVoices[0]
    }
  }

  /**
   * 获取情感语音设置
   */
  private getEmotionVoiceSettings(emotion: string) {
    const settings = {
      neutral: { rate: 1.0, pitch: 1.0, volume: 0.8 },
      happy: { rate: 1.2, pitch: 1.3, volume: 0.9 },
      excited: { rate: 1.3, pitch: 1.4, volume: 1.0 },
      gentle: { rate: 0.9, pitch: 1.1, volume: 0.7 },
      calm: { rate: 0.8, pitch: 1.0, volume: 0.6 },
      sad: { rate: 0.7, pitch: 0.8, volume: 0.5 },
      serious: { rate: 0.9, pitch: 0.9, volume: 0.8 }
    }

    return settings[emotion as keyof typeof settings] || settings.neutral
  }

  /**
   * 音频情感分析
   */
  private async analyzeAudioEmotion(audioBlob: Blob): Promise<{
    emotion: string
    confidence: number
  }> {
    // 这里可以集成更专业的音频情感分析库
    // 目前返回基于音频特征的简单分析
    return {
      emotion: "neutral",
      confidence: 0.5
    }
  }

  /**
   * 融合情感分析结果
   */
  private fuseEmotionResults(textEmotion: EmotionAnalysisResult, audioEmotion: AudioEmotionResult) {
    // 简单的融合算法，可以后续优化
    const weights = {
      text: 0.7,
      audio: 0.3
    }

    return {
      emotion: textEmotion.dominant_emotion,
      confidence: (textEmotion.confidence * weights.text + audioEmotion.confidence * weights.audio),
      sentiment: textEmotion.sentiment || 0
    }
  }

  /**
   * 事件监听
   */
  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event)!.push(callback)
  }

  /**
   * 移除事件监听
   */
  off(event: string, callback: Function): void {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event)!
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  /**
   * 触发事件
   */
  private emit(event: string, data?: unknown): void {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error(`[EnhancedVoiceSystem] 事件处理错误 [${event}]:`, error)
        }
      })
    }
  }

  /**
   * 获取系统状态
   */
  getStatus() {
    return {
      isListening: this.isListening,
      isSpeaking: this.isSpeaking,
      hasWakeWordDetector: !!this.wakeWordDetector,
      hasSynthesis: !!this.synthesis,
      audioContextState: this.audioContext?.state || 'closed'
    }
  }

  /**
   * 清理资源
   */
  dispose(): void {
    this.stopWakeWordListening()
    this.stopSpeaking()

    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close()
    }

    this.listeners.clear()
    console.log("[EnhancedVoiceSystem] 语音系统已清理")
  }
}

/**
 * 唤醒词检测器（简化实现）
 */
class WakeWordDetector {
  private isListening = false
  private mediaRecorder: MediaRecorder | null = null
  private audioStream: MediaStream | null = null

  async startListening(onDetected: (detected: boolean) => void): Promise<void> {
    try {
      this.audioStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      })

      this.mediaRecorder = new MediaRecorder(this.audioStream)

      this.mediaRecorder.ondataavailable = async (event) => {
        if (event.data.size > 0) {
          // 这里应该调用真正的唤醒词检测API
          // 目前使用简化的模拟检测
          const isWakeWord = await this.detectWakeWord(event.data)
          onDetected(isWakeWord)
        }
      }

      this.isListening = true
      this.mediaRecorder.start(100) // 每100ms检测一次

    } catch (error) {
      throw new Error(`唤醒词检测启动失败: ${error}`)
    }
  }

  stopListening(): void {
    if (this.mediaRecorder && this.isListening) {
      this.mediaRecorder.stop()
    }
    if (this.audioStream) {
      this.audioStream.getTracks().forEach(track => track.stop())
    }
    this.isListening = false
  }

  private async detectWakeWord(audioBlob: Blob): Promise<boolean> {
    // 简化的唤醒词检测模拟
    // 实际应用中应该使用专业的唤醒词检测服务
    return Math.random() > 0.95 // 5%的模拟检测率
  }
}

/**
 * 情感分析器
 */
class EmotionAnalyzer {
  async analyzeText(text: string): Promise<{
    dominant_emotion: string
    confidence: number
    emotions: Record<string, number>
    sentiment: number
  }> {
    // 这里应该调用真实的情感分析API
    // 目前使用简化的关键词检测
    const emotionKeywords = {
      happy: ['开心', '高兴', '快乐', '愉快', '欢乐', '喜悦', '兴奋'],
      sad: ['难过', '伤心', '悲伤', '沮丧', '失落', '郁闷', '哭泣'],
      angry: ['生气', '愤怒', '恼火', '气愤', '暴躁', '不满'],
      fear: ['害怕', '恐惧', '担心', '焦虑', '紧张', '不安'],
      surprise: ['惊讶', '意外', '吃惊', '震惊', '没想到'],
      disgust: ['讨厌', '恶心', '反感', '厌烦']
    }

    const emotions: Record<string, number> = {}
    let maxScore = 0
    let dominantEmotion = 'neutral'

    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      const score = keywords.reduce((count, keyword) => {
        return count + (text.includes(keyword) ? 1 : 0)
      }, 0)

      emotions[emotion] = score
      if (score > maxScore) {
        maxScore = score
        dominantEmotion = emotion
      }
    }

    // 计算置信度
    const totalKeywords = Object.values(emotionKeywords).flat().length
    const confidence = maxScore / Math.max(totalKeywords, 1)

    // 计算情感倾向 (-1 到 1)
    const positiveEmotions = ['happy', 'surprise']
    const negativeEmotions = ['sad', 'angry', 'fear', 'disgust']

    let sentiment = 0
    positiveEmotions.forEach(emotion => {
      sentiment += emotions[emotion] || 0
    })
    negativeEmotions.forEach(emotion => {
      sentiment -= emotions[emotion] || 0
    })
    sentiment = sentiment / Math.max(totalKeywords, 1)

    return {
      dominant_emotion: maxScore > 0 ? dominantEmotion : 'neutral',
      confidence: Math.min(confidence * 2, 1), // 放大置信度
      emotions,
      sentiment: Math.max(-1, Math.min(1, sentiment))
    }
  }
}

// 导出单例实例
export const enhancedVoiceSystem = new EnhancedVoiceSystem()