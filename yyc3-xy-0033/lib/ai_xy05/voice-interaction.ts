/**
 * @file YYC³ AI小语智能成长守护系统 - 语音交互控制系统
 * @description 专注0-3岁婴幼儿语音识别和情感化语音合成
 * @module lib/ai
 * @author YYC³
 * @version 1.0.0
 * @created 2025-12-28
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

import logger from '@/lib/logger'

export interface VoiceInteractionConfig {
  recognitionMode: 'general' | 'baby-cry' | 'babble' | 'speech'
  childAge: number        // 年龄（月）
  emotion: EmotionType
  sensitivity: 'low' | 'medium' | 'high'
  language: 'zh-CN' | 'en-US'
}

export interface VoiceRecognitionResult {
  transcript: string
  confidence: number
  alternatives: AlternativeText[]
  audioAnalysis: {
    volume: number
    clarity: number
    duration: number
    isCry: boolean
    cryType?: CryType
  }
  emotionalTone: EmotionalTone
}

export interface VoiceSynthesisRequest {
  text: string
  voiceProfile: {
    type: 'gentle-mother' | 'playful-friend' | 'calm-teacher'
    age: 'infant' | 'toddler' | 'preschooler'
    emotion: EmotionType
    intensity: number
  }
  audioSettings: {
    rate: number
    pitch: number
    volume: number
    clarity: number
  }
}

interface VoiceContentAnalysis {
  hasContent: boolean
  wordCount: number
  ageAppropriate: boolean
  needsAttention: boolean
}

interface ExtendedWindow extends Window {
  SpeechRecognition?: typeof SpeechRecognition
  webkitSpeechRecognition?: typeof SpeechRecognition
  AudioContext?: typeof AudioContext
  webkitAudioContext?: typeof AudioContext
}

export interface EmotionalTone {
  happiness: number
  sadness: number
  fear: number
  anger: number
  excitement: number
  calmness: number
}

export enum EmotionType {
  HAPPINESS = 'happiness',
  SADNESS = 'sadness',
  FEAR = 'fear',
  ANGER = 'anger',
  SURPRISE = 'surprise',
  DISGUST = 'disgust',
  CURIOSITY = 'curiosity',
  COMFORT = 'comfort',
  HUNGER = 'hunger',
  DISCOMFORT = 'discomfort',
  ATTENTION = 'attention',
  COLIC = 'colic'
}

export enum CryType {
  HUNGER = 'hunger',
  DISCOMFORT = 'discomfort',
  ATTENTION = 'attention',
  PAIN = 'pain',
  SLEEPY = 'sleepy',
  COLIC = 'colic'
}

interface VoiceContentAnalysis {
  hasContent: boolean
  wordCount: number
  ageAppropriate: boolean
  needsAttention: boolean
}

interface ExtendedWindow extends Window {
  SpeechRecognition?: typeof SpeechRecognition
  webkitSpeechRecognition?: typeof SpeechRecognition
  AudioContext?: typeof AudioContext
  webkitAudioContext?: typeof AudioContext
}

export interface AlternativeText {
  text: string
  confidence: number
}

/**
 * 语音交互控制主类
 */
export class VoiceInteractionController {
  private recognition: SpeechRecognition | null = null
  private synthesis: SpeechSynthesis
  private isInitialized = false
  private isRecording = false
  private audioContext: AudioContext | null = null
  private mediaRecorder: MediaRecorder | null = null
  private audioChunks: Blob[] = []

  // 0-3岁特化语音特征库
  private readonly infantCryPatterns = new Map<CryType, CryPattern>([
    [CryType.HUNGER, {
      frequencyRange: { min: 300, max: 800 },
      pattern: 'rhythmic-short',
      intensity: 'medium',
      typicalDuration: { min: 2, max: 10 }
    }],
    [CryType.DISCOMFORT, {
      frequencyRange: { min: 400, max: 1000 },
      pattern: 'continuous',
      intensity: 'high',
      typicalDuration: { min: 5, max: 30 }
    }],
    [CryType.ATTENTION, {
      frequencyRange: { min: 200, max: 600 },
      pattern: 'intermittent',
      intensity: 'low-to-medium',
      typicalDuration: { min: 1, max: 5 }
    }],
    [CryType.PAIN, {
      frequencyRange: { min: 600, max: 1500 },
      pattern: 'sudden-sharp',
      intensity: 'high',
      typicalDuration: { min: 3, max: 15 }
    }]
  ])

  // 情感化语音参数
  private readonly emotionVoiceParams = new Map<EmotionType, VoiceParameters>([
    [EmotionType.HAPPINESS, {
      pitch: 1.2,
      rate: 1.1,
      volume: 0.9,
      intonation: 'uplifted',
      warmth: 0.9
    }],
    [EmotionType.COMFORT, {
      pitch: 0.9,
      rate: 0.8,
      volume: 0.7,
      intonation: 'gentle',
      warmth: 1.0
    }],
    [EmotionType.CURIOSITY, {
      pitch: 1.1,
      rate: 1.0,
      volume: 0.8,
      intonation: 'questioning',
      warmth: 0.8
    }],
    [EmotionType.CALMNESS, {
      pitch: 1.0,
      rate: 0.9,
      volume: 0.7,
      intonation: 'steady',
      warmth: 0.9
    }]
  ])

  constructor() {
    this.synthesis = window.speechSynthesis
  }

  /**
   * 初始化语音交互系统
   */
  async initialize(config: VoiceInteractionConfig): Promise<void> {
    try {
      // 检查浏览器支持
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        throw new Error('浏览器不支持语音识别')
      }

      // 初始化语音识别
      const extendedWindow = window as ExtendedWindow
      const SpeechRecognition = extendedWindow.SpeechRecognition || extendedWindow.webkitSpeechRecognition
      this.recognition = new SpeechRecognition()

      // 配置识别参数（针对0-3岁优化）
      this.recognition.continuous = true
      this.recognition.interimResults = true
      this.recognition.maxAlternatives = 3
      this.recognition.lang = config.language

      // 初始化音频上下文
      this.audioContext = new (extendedWindow.AudioContext || extendedWindow.webkitAudioContext)()

      this.isInitialized = true
      logger.info('语音交互控制系统初始化完成', {}, 'VoiceInteraction')
    } catch (error) {
      logger.error('语音交互控制系统初始化失败', { error }, 'VoiceInteraction')
      throw new Error('语音交互控制系统初始化失败')
    }
  }

  /**
   * 开始语音识别
   */
  async startRecognition(config: VoiceInteractionConfig): Promise<VoiceRecognitionResult> {
    return new Promise((resolve, reject) => {
      if (!this.isInitialized || !this.recognition) {
        reject(new Error('语音识别系统未初始化'))
        return
      }

      if (this.isRecording) {
        reject(new Error('正在录音中'))
        return
      }

      this.isRecording = true
      let finalTranscript = ''
      let audioData: Float32Array[] = []

      // 配置识别事件
      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i]
          if (result.isFinal) {
            finalTranscript += result[0].transcript
          } else {
            interimTranscript += result[0].transcript
          }
        }

        // 实时处理结果
        if (interimTranscript) {
          logger.debug('临时识别结果', { interimTranscript }, 'VoiceInteraction')
        }
      }

      this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        this.isRecording = false
        console.error('语音识别错误:', event.error)
        reject(new Error(`语音识别错误: ${event.error}`))
      }

      this.recognition.onend = () => {
        this.isRecording = false

        // 分析识别结果
        const analysis = this.analyzeVoiceContent(finalTranscript, config)

        resolve({
          transcript: finalTranscript,
          confidence: 0.8, // 简化值
          alternatives: [],
          audioAnalysis: {
            volume: 0.7,
            clarity: 0.9,
            duration: finalTranscript.length * 0.1,
            isCry: this.detectCryPattern(finalTranscript, config),
            cryType: this.detectCryType(finalTranscript, config)
          },
          emotionalTone: this.analyzeEmotionalTone(finalTranscript, config)
        })
      }

      // 开始识别
      try {
        this.recognition.start()
      } catch (error) {
        this.isRecording = false
        reject(error)
      }
    })
  }

  /**
   * 停止语音识别
   */
  stopRecognition(): void {
    if (this.recognition && this.isRecording) {
      this.recognition.stop()
      this.isRecording = false
    }
  }

  /**
   * 情感化语音合成
   */
  async synthesizeSpeech(request: VoiceSynthesisRequest): Promise<Blob> {
    return new Promise((resolve, reject) => {
      try {
        const utterance = new SpeechSynthesisUtterance(request.text)

        // 应用情感化语音参数
        const emotionParams = this.emotionVoiceParams.get(request.voiceProfile.emotion)
        if (emotionParams) {
          utterance.pitch = emotionParams.pitch * request.audioSettings.pitch
          utterance.rate = emotionParams.rate * request.audioSettings.rate
          utterance.volume = emotionParams.volume * request.audioSettings.volume
        }

        // 选择合适的语音
        const voices = this.synthesis.getVoices()
        const selectedVoice = this.selectVoiceForProfile(voices, request.voiceProfile)
        if (selectedVoice) {
          utterance.voice = selectedVoice
        }

        // 处理合成完成
        utterance.onend = () => {
          resolve(new Blob()) // 简化返回
        }

        utterance.onerror = (event) => {
          reject(new Error(`语音合成错误: ${event.error}`))
        }

        // 开始合成
        this.synthesis.speak(utterance)

        // 简化处理，立即返回
        resolve(new Blob())
      } catch (error) {
        reject(error)
      }
    })
  }

  /**
   * 检测哭声模式
   */
  private detectCryPattern(transcript: string, config: VoiceInteractionConfig): boolean {
    // 简化的哭声检测逻辑
    const cryIndicators = ['哇', '呜', '哭', '哼', '嗯嗯']
    return cryIndicators.some(indicator => transcript.includes(indicator))
  }

  /**
   * 检测哭声类型
   */
  private detectCryType(transcript: string, config: VoiceInteractionConfig): CryType | undefined {
    if (!this.detectCryPattern(transcript, config)) {
      return undefined
    }

    // 简化的哭声类型判断
    if (transcript.includes('饿') || transcript.includes('吃')) {
      return CryType.HUNGER
    }
    if (transcript.includes('抱') || transcript.includes('要')) {
      return CryType.ATTENTION
    }
    if (transcript.includes('不舒服') || transcript.includes('疼')) {
      return CryType.DISCOMFORT
    }

    return CryType.ATTENTION
  }

  /**
   * 分析情感语调
   */
  private analyzeEmotionalTone(transcript: string, config: VoiceInteractionConfig): EmotionalTone {
    // 简化的情感分析
    const positiveWords = ['开心', '高兴', '笑', '喜欢', '爱']
    const negativeWords = ['哭', '怕', '痛', '难过', '生气']

    let positiveScore = 0
    let negativeScore = 0

    positiveWords.forEach(word => {
      if (transcript.includes(word)) positiveScore++
    })

    negativeWords.forEach(word => {
      if (transcript.includes(word)) negativeScore++
    })

    const totalScore = positiveScore + negativeScore || 1

    return {
      happiness: positiveScore / totalScore,
      sadness: negativeScore / totalScore * 0.5,
      fear: 0.2,
      anger: negativeScore / totalScore * 0.3,
      excitement: positiveScore / totalScore * 0.8,
      calmness: 0.5
    }
  }

  /**
   * 分析语音内容
   */
  private analyzeVoiceContent(transcript: string, config: VoiceInteractionConfig): VoiceContentAnalysis {
    return {
      hasContent: transcript.length > 0,
      wordCount: transcript.split(/\s+/).length,
      ageAppropriate: this.isAgeAppropriateSpeech(transcript, config.childAge),
      needsAttention: this.detectAttentionNeeds(transcript)
    }
  }

  /**
   * 判断是否为适龄语音
   */
  private isAgeAppropriateSpeech(transcript: string, ageMonths: number): boolean {
    if (ageMonths <= 12) {
      // 0-1岁：主要关注哭声和简单声音
      return transcript.length <= 10
    } else if (ageMonths <= 24) {
      // 1-2岁：单词和简单短语
      return transcript.length <= 20
    } else {
      // 2-3岁：简单句子
      return transcript.length <= 50
    }
  }

  /**
   * 检测注意力需求
   */
  private detectAttentionNeeds(transcript: string): boolean {
    const attentionWords = ['妈妈', '爸爸', '抱', '要', '看', '来']
    return attentionWords.some(word => transcript.includes(word))
  }

  /**
   * 根据配置选择语音
   */
  private selectVoiceForProfile(voices: SpeechSynthesisVoice[], profile: VoiceSynthesisRequest['voiceProfile']): SpeechSynthesisVoice | null {
    // 简化的语音选择逻辑
    const chineseVoices = voices.filter(voice => voice.lang.includes('zh'))
    const femaleVoices = chineseVoices.filter(voice => voice.name.includes('Female') || voice.name.includes('女'))

    return femaleVoices[0] || chineseVoices[0] || voices[0]
  }

  /**
   * 获取录音状态
   */
  get isRecognitionActive(): boolean {
    return this.isRecording
  }

  /**
   * 清理资源
   */
  dispose(): void {
    if (this.recognition) {
      this.recognition.abort()
      this.recognition = null
    }
    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop()
      this.mediaRecorder = null
    }
    this.isRecording = false
  }
}

// 辅助类型定义
interface CryPattern {
  frequencyRange: { min: number; max: number }
  pattern: string
  intensity: string
  typicalDuration: { min: number; max: number }
}

interface VoiceParameters {
  pitch: number
  rate: number
  volume: number
  intonation: string
  warmth: number
}

// 导出单例实例
export const voiceController = new VoiceInteractionController()