// 语音交互系统核心实现

export interface VoiceConfig {
  lang: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
}

export interface SpeechRecognitionResult {
  transcript: string
  confidence: number
  isFinal: boolean
}

export interface EmotionData {
  type: "happy" | "sad" | "angry" | "neutral" | "excited" | "calm"
  confidence: number
}

export interface VoiceEmotionResult {
  emotion: "happy" | "sad" | "angry" | "neutral" | "excited" | "anxious" | "calm"
  confidence: number
  features: {
    pitch: number
    energy: number
    tempo: number
    variation: number
  }
  suggestion: string
}

export class VoiceInteractionSystem {
  private recognition: any = null
  private synthesis: SpeechSynthesis | null = null
  private isInitialized = false
  private isListening = false
  private wakeWordDetected = false
  private wakeWordCallback: (() => void) | null = null
  private wakeWordEnabled = false
  private retryCount = 0
  private maxRetries = 3
  private audioContext: AudioContext | null = null
  private analyser: AnalyserNode | null = null
  private mediaStream: MediaStream | null = null

  constructor() {
    if (typeof window !== "undefined") {
      this.initialize()
    }
  }

  private initialize() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition()
      this.recognition.lang = "zh-CN"
      this.recognition.continuous = false // 改为非持续模式避免网络错误
      this.recognition.interimResults = true
      this.recognition.maxAlternatives = 1
      this.isInitialized = true
    }

    if (window.speechSynthesis) {
      this.synthesis = window.speechSynthesis
    }
  }

  isSupported(): boolean {
    return this.isInitialized && this.synthesis !== null
  }

  private isRestrictedEnvironment(): boolean {
    if (typeof window === "undefined") return true
    try {
      // v0预览环境或iframe中可能有限制
      return window.self !== window.top
    } catch {
      return true
    }
  }

  startListening(onResult: (result: SpeechRecognitionResult) => void, onError?: (error: Error) => void): void {
    if (!this.recognition || this.isListening) return

    if (this.isRestrictedEnvironment()) {
      console.log("[v0] 语音识别在当前环境不可用，请使用文字输入")
      return
    }

    this.isListening = true
    this.retryCount = 0

    this.recognition.onresult = (event: any) => {
      const last = event.results.length - 1
      const result = event.results[last]
      const transcript = result[0].transcript.trim()
      const confidence = result[0].confidence

      if (transcript.includes("小语") || transcript.includes("小雨")) {
        this.wakeWordDetected = true
        return
      }

      if (this.wakeWordDetected || result.isFinal) {
        onResult({
          transcript,
          confidence,
          isFinal: result.isFinal,
        })

        if (result.isFinal) {
          this.wakeWordDetected = false
        }
      }
    }

    this.recognition.onerror = (event: any) => {
      if (event.error === "network") {
        console.log("[v0] 语音服务暂时不可用")
        this.isListening = false
        return
      }
      if (event.error !== "no-speech" && event.error !== "aborted") {
        console.error("[v0] 语音识别错误:", event.error)
      }
      this.isListening = false
      if (onError) {
        onError(new Error(event.error))
      }
    }

    this.recognition.onend = () => {
      this.isListening = false
    }

    try {
      this.recognition.start()
    } catch (error) {
      this.isListening = false
      if (onError) {
        onError(error as Error)
      }
    }
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop()
      } catch {
        // 忽略停止错误
      }
      this.isListening = false
      this.wakeWordDetected = false
    }
  }

  async speak(
    text: string,
    options?: {
      rate?: number
      pitch?: number
      volume?: number
      voice?: string
    },
  ): Promise<void> {
    if (!this.synthesis) return

    return new Promise((resolve, reject) => {
      this.synthesis!.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = "zh-CN"
      utterance.rate = options?.rate || 1.0
      utterance.pitch = options?.pitch || 1.0
      utterance.volume = options?.volume || 1.0

      const voices = this.synthesis!.getVoices()
      const chineseVoice = voices.find((v) => v.lang.includes("zh"))
      if (chineseVoice) {
        utterance.voice = chineseVoice
      }

      utterance.onend = () => resolve()
      utterance.onerror = () => resolve() // 语音合成失败时也resolve，避免阻塞

      this.synthesis!.speak(utterance)
    })
  }

  stopSpeaking(): void {
    if (this.synthesis) {
      this.synthesis.cancel()
    }
  }

  async speakWithEmotion(text: string, emotion: "cheerful" | "sad" | "excited" | "calm"): Promise<void> {
    const emotionSettings = {
      cheerful: { rate: 1.1, pitch: 1.2 },
      sad: { rate: 0.9, pitch: 0.8 },
      excited: { rate: 1.3, pitch: 1.3 },
      calm: { rate: 0.95, pitch: 1.0 },
    }

    const settings = emotionSettings[emotion]
    await this.speak(text, settings)
  }

  detectTextEmotion(text: string): EmotionData {
    const happyWords = ["开心", "高兴", "快乐", "哈哈", "棒", "好"]
    const sadWords = ["难过", "伤心", "哭", "失望", "不开心"]
    const angryWords = ["生气", "愤怒", "讨厌", "烦"]
    const excitedWords = ["兴奋", "激动", "太好了", "耶"]

    let happyScore = 0
    let sadScore = 0
    let angryScore = 0
    let excitedScore = 0

    happyWords.forEach((word) => {
      if (text.includes(word)) happyScore++
    })
    sadWords.forEach((word) => {
      if (text.includes(word)) sadScore++
    })
    angryWords.forEach((word) => {
      if (text.includes(word)) angryScore++
    })
    excitedWords.forEach((word) => {
      if (text.includes(word)) excitedScore++
    })

    const scores = [
      { type: "happy" as const, score: happyScore },
      { type: "sad" as const, score: sadScore },
      { type: "angry" as const, score: angryScore },
      { type: "excited" as const, score: excitedScore },
    ]

    const maxScore = Math.max(...scores.map((s) => s.score))
    const detected = scores.find((s) => s.score === maxScore) || { type: "neutral" as const, score: 0 }

    return {
      type: maxScore > 0 ? detected.type : "neutral",
      confidence: maxScore > 0 ? Math.min(maxScore * 0.3, 0.9) : 0.5,
    }
  }

  startWakeWordListening(onWakeWord: () => void): void {
    // 在预览环境中完全跳过，避免网络错误
    if (typeof window === "undefined") return

    // 检测是否在iframe中运行（v0预览环境）
    try {
      if (window.self !== window.top) {
        // 静默跳过，不输出日志
        return
      }
    } catch {
      return
    }

    if (!this.recognition) return

    this.wakeWordCallback = onWakeWord
    this.wakeWordEnabled = true
    this.wakeWordDetected = false
    this.retryCount = 0

    this.startSingleRecognition()
  }

  private startSingleRecognition(): void {
    if (!this.recognition || !this.wakeWordEnabled) return

    try {
      if (typeof window !== "undefined" && window.self !== window.top) {
        this.wakeWordEnabled = false
        return
      }
    } catch {
      this.wakeWordEnabled = false
      return
    }

    this.recognition.continuous = false
    this.recognition.interimResults = true

    this.recognition.onresult = (event: any) => {
      const last = event.results.length - 1
      const result = event.results[last]
      const transcript = result[0].transcript.trim().toLowerCase()

      if (
        transcript.includes("小语") ||
        transcript.includes("小雨") ||
        transcript.includes("hey xiaoyu") ||
        transcript.includes("你好小语")
      ) {
        this.wakeWordDetected = true
        this.wakeWordCallback?.()
        this.playWakeSound()
      }
    }

    this.recognition.onend = () => {
      if (this.wakeWordEnabled && !this.wakeWordDetected && this.retryCount < this.maxRetries) {
        this.retryCount++
        setTimeout(() => {
          this.startSingleRecognition()
        }, 2000) // 增加延迟到2秒
      }
    }

    this.recognition.onerror = (event: any) => {
      this.wakeWordEnabled = false
      this.retryCount = this.maxRetries
    }

    try {
      this.recognition.start()
    } catch {
      this.wakeWordEnabled = false
    }
  }

  stopWakeWordListening(): void {
    this.wakeWordEnabled = false
    this.wakeWordDetected = false
    this.wakeWordCallback = null
    this.retryCount = 0
    if (this.recognition) {
      try {
        this.recognition.stop()
      } catch {
        // 忽略停止错误
      }
    }
  }

  private playWakeSound(): void {
    // 永久禁用唤醒音效 - 避免产生鸣叫声干扰用户体验
    console.log("唤醒音效已禁用 - 避免鸣叫声")
    return

    // 以下代码已永久禁用以避免AudioContext产生的800-1000Hz鸣叫声
    // try {
    //   const audioContext = new AudioContext()
    //   const oscillator = audioContext.createOscillator()
    //   const gainNode = audioContext.createGain()

    //   oscillator.connect(gainNode)
    //   gainNode.connect(audioContext.destination)

    //   oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
    //   oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1)

    //   gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    //   gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)

    //   oscillator.start(audioContext.currentTime)
    //   oscillator.stop(audioContext.currentTime + 0.2)
    // } catch {
    //   // 静默处理音效播放失败
    // }
  }

  async speakWithRole(
    text: string,
    roleStyle: "cheerful" | "calm" | "gentle" | "professional" | "warm",
  ): Promise<void> {
    const styleSettings = {
      cheerful: { rate: 1.1, pitch: 1.15, volume: 1.0 },
      calm: { rate: 0.95, pitch: 1.0, volume: 0.9 },
      gentle: { rate: 0.9, pitch: 1.05, volume: 0.85 },
      professional: { rate: 1.0, pitch: 0.95, volume: 1.0 },
      warm: { rate: 0.95, pitch: 1.1, volume: 0.95 },
    }

    const settings = styleSettings[roleStyle]
    await this.speak(text, settings)
  }

  async initAudioAnalyser(): Promise<boolean> {
    if (typeof window === "undefined") return false
    if (this.isRestrictedEnvironment()) return false

    try {
      this.audioContext = new AudioContext()
      this.analyser = this.audioContext.createAnalyser()
      this.analyser.fftSize = 2048
      this.analyser.smoothingTimeConstant = 0.8

      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const source = this.audioContext.createMediaStreamSource(this.mediaStream)
      source.connect(this.analyser)

      return true
    } catch {
      return false
    }
  }

  getAudioFeatures(): { pitch: number; energy: number; variation: number } | null {
    if (!this.analyser) return null

    const bufferLength = this.analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    const timeData = new Uint8Array(bufferLength)

    this.analyser.getByteFrequencyData(dataArray)
    this.analyser.getByteTimeDomainData(timeData)

    let sum = 0
    for (let i = 0; i < timeData.length; i++) {
      const val = (timeData[i] - 128) / 128
      sum += val * val
    }
    const energy = Math.sqrt(sum / timeData.length) * 100

    let maxIndex = 0
    let maxValue = 0
    for (let i = 0; i < dataArray.length / 2; i++) {
      if (dataArray[i] > maxValue) {
        maxValue = dataArray[i]
        maxIndex = i
      }
    }
    const sampleRate = this.audioContext?.sampleRate || 44100
    const pitch = (maxIndex * sampleRate) / this.analyser.fftSize

    let variation = 0
    for (let i = 1; i < dataArray.length; i++) {
      variation += Math.abs(dataArray[i] - dataArray[i - 1])
    }
    variation = variation / dataArray.length

    return { pitch, energy, variation }
  }

  async analyzeVoiceEmotion(durationMs = 3000): Promise<VoiceEmotionResult> {
    if (this.isRestrictedEnvironment()) {
      return {
        emotion: "neutral",
        confidence: 0.5,
        features: { pitch: 0, energy: 0, tempo: 0, variation: 0 },
        suggestion: "语音分析在预览环境不可用",
      }
    }

    const samples: { pitch: number; energy: number; variation: number }[] = []
    const startTime = Date.now()

    if (!this.analyser) {
      await this.initAudioAnalyser()
    }

    while (Date.now() - startTime < durationMs) {
      const features = this.getAudioFeatures()
      if (features && features.energy > 5) {
        samples.push(features)
      }
      await new Promise((resolve) => setTimeout(resolve, 50))
    }

    if (samples.length === 0) {
      return {
        emotion: "neutral",
        confidence: 0.5,
        features: { pitch: 0, energy: 0, tempo: 0, variation: 0 },
        suggestion: "未检测到有效语音输入",
      }
    }

    const avgPitch = samples.reduce((a, b) => a + b.pitch, 0) / samples.length
    const avgEnergy = samples.reduce((a, b) => a + b.energy, 0) / samples.length
    const avgVariation = samples.reduce((a, b) => a + b.variation, 0) / samples.length
    const tempo = (samples.length / (durationMs / 1000)) * 60

    const result = this.classifyVoiceEmotion(avgPitch, avgEnergy, avgVariation, tempo)

    return {
      ...result,
      features: {
        pitch: Math.round(avgPitch),
        energy: Math.round(avgEnergy * 10) / 10,
        tempo: Math.round(tempo),
        variation: Math.round(avgVariation * 10) / 10,
      },
    }
  }

  private classifyVoiceEmotion(
    pitch: number,
    energy: number,
    variation: number,
    tempo: number,
  ): { emotion: VoiceEmotionResult["emotion"]; confidence: number; suggestion: string } {
    let emotion: VoiceEmotionResult["emotion"] = "neutral"
    let confidence = 0.6
    let suggestion = ""

    if (pitch > 250 && energy > 30 && variation > 15) {
      emotion = "excited"
      confidence = 0.85
      suggestion = "检测到兴奋情绪，孩子可能有开心的事情想分享"
    } else if (pitch > 200 && energy > 20 && variation > 10) {
      emotion = "happy"
      confidence = 0.8
      suggestion = "孩子心情不错，这是交流的好时机"
    } else if (pitch < 150 && energy < 15 && variation < 8) {
      emotion = "sad"
      confidence = 0.75
      suggestion = "检测到低落情绪，建议给予更多关注和倾听"
    } else if (energy > 35 && tempo > 180) {
      emotion = "angry"
      confidence = 0.7
      suggestion = "情绪有些激动，建议先让孩子冷静下来再沟通"
    } else if (energy > 25 && variation > 20 && tempo > 150) {
      emotion = "anxious"
      confidence = 0.7
      suggestion = "可能有些焦虑，尝试用平静的语气安抚"
    } else if (energy < 20 && variation < 10 && tempo < 100) {
      emotion = "calm"
      confidence = 0.75
      suggestion = "状态平静，适合进行学习或认真对话"
    } else {
      emotion = "neutral"
      confidence = 0.6
      suggestion = "情绪状态正常"
    }

    return { emotion, confidence, suggestion }
  }

  releaseAudioAnalyser(): void {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop())
      this.mediaStream = null
    }
    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }
    this.analyser = null
  }
}

let voiceSystemInstance: VoiceInteractionSystem | null = null

export function getVoiceSystem(): VoiceInteractionSystem {
  if (!voiceSystemInstance) {
    voiceSystemInstance = new VoiceInteractionSystem()
  }
  return voiceSystemInstance
}
