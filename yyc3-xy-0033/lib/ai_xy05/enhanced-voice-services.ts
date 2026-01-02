// 增强型语音交互服务 - 支持实时语音识别和闭环反馈
// Enhanced Voice Interaction Service - Real-time Speech Recognition & Closed-loop Feedback

export interface ExtendedWindow extends Window {
  SpeechRecognition?: typeof SpeechRecognition
  webkitSpeechRecognition?: typeof SpeechRecognition
  webkitAudioContext?: typeof AudioContext
}

export interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number
  readonly results: SpeechRecognitionResultList
}

export interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string
  readonly message?: string
}

export interface VoiceInteractionSession {
  id: string
  startTime: Date
  endTime?: Date
  participants: Array<{
    role: 'parent' | 'child' | 'ai'
    speakingTime: number
    emotions: string[]
    keywords: string[]
  }>
  transcripts: Array<{
    speaker: 'parent' | 'child' | 'ai'
    text: string
    timestamp: Date
    confidence: number
    emotion: string
    duration: number
  }>
  insights: {
    emotionalState: string
    engagementLevel: number
    interactionQuality: number
    suggestions: string[]
    concerns: string[]
  }
  feedback: {
    positiveReinforcement: string[]
    improvementAreas: string[]
    nextSteps: string[]
  }
}

export interface VoiceInteractionConfig {
  enableRealTimeRecognition: boolean
  enableEmotionAnalysis: boolean
  enableSpeakerDiarization: boolean
  enableKeywordExtraction: boolean
  enableEngagementMonitoring: boolean
  language: string
  sensitivity: number
  feedbackDelay: number
  autoSummary: boolean
}

export interface VoiceMetrics {
  speakingTime: {
    parent: number
    child: number
    ai: number
  }
  emotionDistribution: Record<string, number>
  keywordFrequency: Record<string, number>
  engagementScore: number
  interactionQuality: number
  responseTime: number[]
  clarityScore: number
}

export class EnhancedVoiceService {
  private mediaRecorder: MediaRecorder | null = null
  private recognition: SpeechRecognition | null = null
  private isRecording = false
  private currentSession: VoiceInteractionSession | null = null
  private audioContext: AudioContext | null = null
  private analyser: AnalyserNode | null = null
  private config: VoiceInteractionConfig
  private eventListeners: Map<string, Function[]> = new Map()

  constructor(config: Partial<VoiceInteractionConfig> = {}) {
    this.config = {
      enableRealTimeRecognition: true,
      enableEmotionAnalysis: true,
      enableSpeakerDiarization: true,
      enableKeywordExtraction: true,
      enableEngagementMonitoring: true,
      language: 'zh-CN',
      sensitivity: 0.7,
      feedbackDelay: 2000,
      autoSummary: true,
      ...config
    }

    // 只在客户端初始化
    if (typeof window !== 'undefined') {
      this.initializeAudioContext()
      this.setupSpeechRecognition()
    }
  }

  /**
   * 初始化音频上下文
   */
  private async initializeAudioContext(): Promise<void> {
    try {
      const extendedWindow = window as ExtendedWindow
      this.audioContext = new (window.AudioContext || extendedWindow.webkitAudioContext)()
      this.analyser = this.audioContext.createAnalyser()
      this.analyser.fftSize = 2048
    } catch (error) {
      console.error('初始化音频上下文失败:', error)
    }
  }

  /**
   * 设置语音识别
   */
  private setupSpeechRecognition(): void {
    if (!this.config.enableRealTimeRecognition) return

    const extendedWindow = window as ExtendedWindow
    const SpeechRecognition = extendedWindow.SpeechRecognition || extendedWindow.webkitSpeechRecognition

    if (!SpeechRecognition) {
      console.warn('浏览器不支持语音识别')
      return
    }

    this.recognition = new SpeechRecognition()
    this.recognition.continuous = true
    this.recognition.interimResults = true
    this.recognition.lang = this.config.language
    this.recognition.maxAlternatives = 1

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      const current = event.resultIndex
      const transcript = event.results[current][0].transcript
      const confidence = event.results[current][0].confidence

      if (event.results[current].isFinal) {
        this.handleFinalTranscript(transcript, confidence)
      } else {
        this.handleInterimTranscript(transcript, confidence)
      }
    }

    this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('语音识别错误:', event.error)
      this.emit('recognitionError', { error: event.error })
    }

    this.recognition.onend = () => {
      if (this.isRecording) {
        // 自动重启识别
        setTimeout(() => {
          if (this.isRecording && this.recognition) {
            this.recognition.start()
          }
        }, 100)
      }
    }
  }

  /**
   * 开始语音交互会话
   */
  async startSession(sessionId: string): Promise<VoiceInteractionSession> {
    try {
      // 获取麦克风权限
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000
        }
      })

      // 设置录音器
      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
      })

      // 创建会话
      this.currentSession = {
        id: sessionId,
        startTime: new Date(),
        participants: [
          { role: 'parent', speakingTime: 0, emotions: [], keywords: [] },
          { role: 'child', speakingTime: 0, emotions: [], keywords: [] },
          { role: 'ai', speakingTime: 0, emotions: [], keywords: [] }
        ],
        transcripts: [],
        insights: {
          emotionalState: 'neutral',
          engagementLevel: 0,
          interactionQuality: 0,
          suggestions: [],
          concerns: []
        },
        feedback: {
          positiveReinforcement: [],
          improvementAreas: [],
          nextSteps: []
        }
      }

      // 开始录音
      this.mediaRecorder.start(1000) // 每秒收集数据
      this.isRecording = true

      // 开始语音识别
      if (this.recognition) {
        this.recognition.start()
      }

      // 设置音频分析
      if (this.audioContext && this.analyser) {
        const source = this.audioContext.createMediaStreamSource(stream)
        source.connect(this.analyser)
      }

      // 开始监控参与度
      if (this.config.enableEngagementMonitoring) {
        this.startEngagementMonitoring()
      }

      this.emit('sessionStarted', { sessionId, session: this.currentSession })
      return this.currentSession

    } catch (error) {
      console.error('启动语音会话失败:', error)
      throw new Error('无法访问麦克风或启动录音')
    }
  }

  /**
   * 结束语音交互会话
   */
  async endSession(): Promise<VoiceInteractionSession | null> {
    if (!this.currentSession) return null

    try {
      // 停止录音
      if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
        this.mediaRecorder.stop()
        this.mediaRecorder.stream.getTracks().forEach(track => track.stop())
      }

      // 停止语音识别
      if (this.recognition) {
        this.recognition.stop()
      }

      // 设置结束时间
      this.currentSession.endTime = new Date()

      // 生成会话洞察
      await this.generateSessionInsights()

      // 停止监控
      this.stopEngagementMonitoring()

      this.isRecording = false
      this.emit('sessionEnded', { session: this.currentSession })

      const session = this.currentSession
      this.currentSession = null
      return session

    } catch (error) {
      console.error('结束语音会话失败:', error)
      throw new Error('结束会话时出现错误')
    }
  }

  /**
   * 处理最终转录结果
   */
  private handleFinalTranscript(transcript: string, confidence: number): void {
    if (!this.currentSession) return

    // 检测说话人
    const speaker = this.detectSpeaker(transcript)

    // 情感分析
    const emotion = this.config.enableEmotionAnalysis ?
      this.analyzeEmotion(transcript) : 'neutral'

    // 关键词提取
    const keywords = this.config.enableKeywordExtraction ?
      this.extractKeywords(transcript) : []

    // 添加到转录记录
    const transcriptEntry = {
      speaker,
      text: transcript,
      timestamp: new Date(),
      confidence,
      emotion,
      duration: this.estimateSpeakingDuration(transcript)
    }

    this.currentSession.transcripts.push(transcriptEntry)

    // 更新参与者信息
    const participant = this.currentSession.participants.find(p => p.role === speaker)
    if (participant) {
      participant.speakingTime += transcriptEntry.duration
      participant.emotions.push(emotion)
      keywords.forEach(keyword => {
        if (!participant.keywords.includes(keyword)) {
          participant.keywords.push(keyword)
        }
      })
    }

    // 发送实时反馈
    this.provideRealTimeFeedback(transcript, speaker, emotion)

    this.emit('transcriptFinal', {
      speaker,
      transcript,
      confidence,
      emotion,
      keywords
    })
  }

  /**
   * 处理临时转录结果
   */
  private handleInterimTranscript(transcript: string, confidence: number): void {
    this.emit('transcriptInterim', {
      transcript,
      confidence
    })
  }

  /**
   * 检测说话人
   */
  private detectSpeaker(transcript: string): 'parent' | 'child' | 'ai' {
    // 简单的规则检测说话人
    const childKeywords = ['宝宝', '不要', '我要', '妈妈', '爸爸', '玩', '吃', '睡觉']
    const parentKeywords = ['宝宝', '乖', '听话', '来', '我们', '吃饭', '睡觉', '小心']

    const lowerTranscript = transcript.toLowerCase()

    if (childKeywords.some(keyword => lowerTranscript.includes(keyword))) {
      return 'child'
    } else if (parentKeywords.some(keyword => lowerTranscript.includes(keyword))) {
      return 'parent'
    } else {
      // 默认认为是家长（更复杂的场景可以使用声纹识别）
      return 'parent'
    }
  }

  /**
   * 分析情感
   */
  private analyzeEmotion(text: string): string {
    const emotionPatterns = {
      happy: ['开心', '高兴', '哈哈', '笑', '好玩', '喜欢', '爱'],
      excited: ['太好了', '棒', '厉害', '哇', '耶', '太棒了'],
      calm: ['安静', '平静', '舒服', '好', '可以'],
      sad: ['难过', '伤心', '哭', '不好', '不要'],
      angry: ['生气', '讨厌', '坏', '走开', '不要'],
      fearful: ['害怕', '恐惧', '不敢', '紧张', '担心']
    }

    const lowerText = text.toLowerCase()

    for (const [emotion, patterns] of Object.entries(emotionPatterns)) {
      if (patterns.some(pattern => lowerText.includes(pattern))) {
        return emotion
      }
    }

    return 'neutral'
  }

  /**
   * 提取关键词
   */
  private extractKeywords(text: string): string[] {
    // 简单的关键词提取
    const keywords = text.match(/[\u4e00-\u9fa5]+/g) || []
    return keywords.filter(word => word.length >= 2).slice(0, 5)
  }

  /**
   * 估算说话时长
   */
  private estimateSpeakingDuration(text: string): number {
    // 中文语速约 200-250 字/分钟
    const charactersPerSecond = 4
    return text.length / charactersPerSecond
  }

  /**
   * 提供实时反馈
   */
  private provideRealTimeFeedback(transcript: string, speaker: string, emotion: string): void {
    if (!this.config.autoSummary) return

    setTimeout(() => {
      const feedback = this.generateFeedback(transcript, speaker, emotion)
      if (feedback) {
        this.emit('realTimeFeedback', feedback)
        this.speakFeedback(feedback.message)
      }
    }, this.config.feedbackDelay)
  }

  /**
   * 生成反馈
   */
  private generateFeedback(transcript: string, speaker: string, emotion: string): { type: string; message: string } | null {
    if (speaker === 'child') {
      if (emotion === 'happy' || emotion === 'excited') {
        return {
          type: 'positive',
          message: '宝宝看起来很开心呢！继续这样愉快的交流吧～'
        }
      } else if (emotion === 'sad' || emotion === 'angry') {
        return {
          type: 'comfort',
          message: '宝宝有些情绪，让我们耐心陪伴和安抚一下吧。'
        }
      }
    } else if (speaker === 'parent') {
      if (transcript.includes('乖') || transcript.includes('棒')) {
        return {
          type: 'encouragement',
          message: '说得很棒！积极的鼓励有助于宝宝的成长。'
        }
      }
    }

    return null
  }

  /**
   * 语音播报反馈
   */
  private async speakFeedback(message: string): Promise<void> {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return
    }

    try {
      const utterance = new SpeechSynthesisUtterance(message)
      utterance.lang = 'zh-CN'
      utterance.rate = 0.9
      utterance.pitch = 1.1
      utterance.volume = 0.8

      window.speechSynthesis.speak(utterance)
    } catch (error) {
      console.error('语音播报失败:', error)
    }
  }

  /**
   * 开始参与度监控
   */
  private startEngagementMonitoring(): void {
    if (!this.analyser) return

    const checkEngagement = () => {
      if (!this.isRecording || !this.currentSession) return

      const dataArray = new Uint8Array(this.analyser.frequencyBinCount)
      this.analyser.getByteFrequencyData(dataArray)

      // 计算音频强度
      const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length

      // 更新参与度分数
      const engagementScore = Math.min(average / 50, 1) // 简化的参与度计算
      this.currentSession.insights.engagementLevel =
        (this.currentSession.insights.engagementLevel + engagementScore) / 2

      setTimeout(checkEngagement, 1000) // 每秒检查一次
    }

    checkEngagement()
  }

  /**
   * 停止参与度监控
   */
  private stopEngagementMonitoring(): void {
    // 监控会在 isRecording = false 时自动停止
  }

  /**
   * 生成会话洞察
   */
  private async generateSessionInsights(): Promise<void> {
    if (!this.currentSession) return

    const session = this.currentSession

    // 计算情感分布
    const emotionCounts: Record<string, number> = {}
    session.transcripts.forEach(t => {
      emotionCounts[t.emotion] = (emotionCounts[t.emotion] || 0) + 1
    })

    // 确定主要情感状态
    const dominantEmotion = Object.entries(emotionCounts)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || 'neutral'

    session.insights.emotionalState = dominantEmotion

    // 计算交互质量
    const totalDuration = session.endTime!.getTime() - session.startTime.getTime()
    const speakingRatio = session.participants
      .reduce((sum, p) => sum + p.speakingTime, 0) / (totalDuration / 1000)

    session.insights.interactionQuality = Math.min(speakingRatio * 10, 10)

    // 生成建议
    session.insights.suggestions = this.generateSuggestions(session)
    session.insights.concerns = this.identifyConcerns(session)

    // 生成反馈
    session.feedback = this.generateSessionFeedback(session)
  }

  /**
   * 生成建议
   */
  private generateSuggestions(session: VoiceInteractionSession): string[] {
    const suggestions: string[] = []

    const childEmotions = session.participants.find(p => p.role === 'child')?.emotions || []
    const happyRatio = childEmotions.filter(e => e === 'happy' || e === 'excited').length /
                       Math.max(childEmotions.length, 1)

    if (happyRatio < 0.3) {
      suggestions.push('尝试增加游戏和趣味性活动来提升宝宝的愉快情绪')
    }

    const parentSpeakingTime = session.participants.find(p => p.role === 'parent')?.speakingTime || 0
    const childSpeakingTime = session.participants.find(p => p.role === 'child')?.speakingTime || 0

    if (parentSpeakingTime > childSpeakingTime * 3) {
      suggestions.push('给宝宝更多的表达机会，耐心倾听他们的想法')
    }

    if (session.insights.engagementLevel < 0.5) {
      suggestions.push('可以尝试使用更多的肢体语言和互动游戏来提升参与度')
    }

    return suggestions
  }

  /**
   * 识别关注点
   */
  private identifyConcerns(session: VoiceInteractionSession): string[] {
    const concerns: string[] = []

    const negativeEmotions = ['sad', 'angry', 'fearful']
    const childNegativeCount = session.transcripts
      .filter(t => t.speaker === 'child' && negativeEmotions.includes(t.emotion))
      .length

    if (childNegativeCount > 3) {
      concerns.push('宝宝出现了较多负面情绪，需要额外的关注和安抚')
    }

    const veryShortInteractions = session.transcripts
      .filter(t => t.duration < 1)
      .length

    if (veryShortInteractions > session.transcripts.length * 0.5) {
      concerns.push('交互时长偏短，可能影响深度交流的效果')
    }

    return concerns
  }

  /**
   * 生成会话反馈
   */
  private generateSessionFeedback(session: VoiceInteractionSession): VoiceInteractionSession['feedback'] {
    const feedback: VoiceInteractionSession['feedback'] = {
      positiveReinforcement: [],
      improvementAreas: [],
      nextSteps: []
    }

    // 正面强化
    if (session.insights.interactionQuality > 7) {
      feedback.positiveReinforcement.push('这次交流质量很高，互动充分！')
    }

    if (session.insights.engagementLevel > 0.7) {
      feedback.positiveReinforcement.push('参与度很高，宝宝很投入！')
    }

    // 改进建议
    if (session.insights.emotionalState === 'neutral') {
      feedback.improvementAreas.push('可以增加更多情感丰富的互动')
    }

    // 下一步
    feedback.nextSteps.push('继续保持积极的交流氛围')
    feedback.nextSteps.push('观察宝宝的情绪变化并及时回应')

    return feedback
  }

  /**
   * 获取语音指标
   */
  getVoiceMetrics(): VoiceMetrics {
    if (!this.currentSession) {
      return {
        speakingTime: { parent: 0, child: 0, ai: 0 },
        emotionDistribution: {},
        keywordFrequency: {},
        engagementScore: 0,
        interactionQuality: 0,
        responseTime: [],
        clarityScore: 0
      }
    }

    const session = this.currentSession
    const speakingTime = session.participants.reduce((acc, p) => {
      acc[p.role] = p.speakingTime
      return acc
    }, {} as VoiceMetrics['speakingTime'])

    // 计算情感分布
    const emotionDistribution: Record<string, number> = {}
    session.transcripts.forEach(t => {
      emotionDistribution[t.emotion] = (emotionDistribution[t.emotion] || 0) + 1
    })

    // 计算关键词频率
    const keywordFrequency: Record<string, number> = {}
    session.participants.forEach(p => {
      p.keywords.forEach(keyword => {
        keywordFrequency[keyword] = (keywordFrequency[keyword] || 0) + 1
      })
    })

    return {
      speakingTime,
      emotionDistribution,
      keywordFrequency,
      engagementScore: session.insights.engagementLevel,
      interactionQuality: session.insights.interactionQuality,
      responseTime: [], // 可以进一步实现
      clarityScore: session.insights.interactionQuality
    }
  }

  /**
   * 事件监听
   */
  on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, [])
    }
    this.eventListeners.get(event)!.push(callback)
  }

  /**
   * 移除事件监听
   */
  off(event: string, callback: Function): void {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      const index = listeners.indexOf(callback)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }

  /**
   * 触发事件
   */
  private emit(event: string, data?: unknown): void {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      listeners.forEach(callback => callback(data))
    }
  }

  /**
   * 销毁服务
   */
  destroy(): void {
    this.endSession()

    if (this.audioContext) {
      this.audioContext.close()
    }

    this.eventListeners.clear()
  }
}

// 导出单例实例
let enhancedVoiceService: EnhancedVoiceService | null = null

export function getEnhancedVoiceService(config?: Partial<VoiceInteractionConfig>): EnhancedVoiceService {
  if (!enhancedVoiceService) {
    enhancedVoiceService = new EnhancedVoiceService(config)
  }
  return enhancedVoiceService
}