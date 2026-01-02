/**
 * 增强版多模态情感融合系统
 * 集成文本、语音、视觉和生理信号的深度情感分析
 */

export interface EmotionFeatures {
  // 基础情感类型
  primary: "joy" | "sadness" | "anger" | "fear" | "surprise" | "disgust" | "neutral"

  // 复合情感
  secondary?: "excitement" | "frustration" | "curiosity" | "comfort" | "anxiety" | "pride"

  // 情感强度 (0-1)
  intensity: number

  // 情感维度 (Russell环状模型)
  valence: number    // 效价：-1 (负面) 到 +1 (正面)
  arousal: number    // 唤醒度：-1 (平静) 到 +1 (兴奋)

  // 置信度
  confidence: number

  // 来源模态权重
  modalityWeights: {
    text: number
    voice: number
    visual: number
    behavioral: number
  }

  // 时间戳
  timestamp: number
}

export interface MultimodalInput {
  text?: string
  audioData?: {
    features: AudioFeatures
    duration: number
  }
  videoData?: {
    facialFeatures: FacialFeatures
    bodyLanguage: BodyLanguageFeatures
  }
  behavioralData?: {
    attention: number
    activity: string
    context: string
  }
  context?: {
    age: number
    previousEmotions: EmotionFeatures[]
    environment: string
  }
}

export interface AudioFeatures {
  // 基础音频特征
  pitch: number              // 基频
  energy: number            // 能量
  spectralCentroid: number  // 频谱重心
  zeroCrossingRate: number  // 过零率

  // 韵律特征
  speechRate: number        // 语速
  pauseRatio: number        // 停顿比例
  volumeVariability: number // 音量变化

  // 声音质量
  harmonics: number         // 谐波度
  breathiness: number       // 呼吸音
  strain: number            // 紧张度
}

export interface FacialFeatures {
  // 基础面部动作单元 (基于FACS)
  actionUnits: {
    [key: string]: number   // AU01, AU02, AU04, etc.
  }

  // 表情特征
  smileIntensity: number    // 微笑强度
  browRaise: number         // 眉毛上扬
  eyeOpenness: number       // 眼睛开合度
  mouthOpenness: number     // 嘴巴开合度

  // 注意力特征
  gazeDirection: { x: number, y: number }  // 注视方向
  eyeContact: boolean                        // 眼神接触
}

export interface BodyLanguageFeatures {
  // 姿态特征
  posture: "upright" | "slumped" | "tense" | "relaxed"
  movementLevel: number    // 活动水平

  // 手势特征
  handGestures: {
    frequency: number     // 手势频率
    expressiveness: number // 表现力
  }

  // 空间特征
  personalSpace: number   // 个人空间使用
  proximity: number       // 与他人距离
}

// 融合上下文接口
export interface FusionContext {
  age?: number
  previousEmotions?: EmotionFeatures[]
  environment?: string
  timestamp?: number
  [key: string]: unknown
}

export class EnhancedEmotionFusion {
  private emotionHistory: EmotionFeatures[] = []
  private maxHistorySize = 50

  private readonly EMOTION_WEIGHTS = {
    text: 0.25,
    voice: 0.35,
    visual: 0.30,
    behavioral: 0.10
  }

  private readonly INFANT_EMOTION_PATTERNS = new Map([
    // 0-12个月婴儿情感模式
    ['hunger_cry', { primary: 'sadness', intensity: 0.8, valence: -0.6, arousal: 0.7 }],
    ['pain_cry', { primary: 'sadness', intensity: 0.9, valence: -0.8, arousal: 0.9 }],
    ['attention_cry', { primary: 'anger', intensity: 0.6, valence: -0.3, arousal: 0.8 }],
    ['cooing', { primary: 'joy', intensity: 0.7, valence: 0.8, arousal: 0.4 }],
    ['laughing', { primary: 'joy', intensity: 0.9, valence: 0.9, arousal: 0.8 }],

    // 1-3岁幼儿情感模式
    ['tantrum', { primary: 'anger', secondary: 'frustration', intensity: 0.9, valence: -0.7, arousal: 0.9 }],
    ['excited_play', { primary: 'joy', secondary: 'excitement', intensity: 0.8, valence: 0.8, arousal: 0.9 }],
    ['separation_anxiety', { primary: 'fear', secondary: 'sadness', intensity: 0.8, valence: -0.7, arousal: 0.6 }],
    ['curious_exploration', { primary: 'surprise', secondary: 'curiosity', intensity: 0.7, valence: 0.6, arousal: 0.8 }],
  ])

  // 主要融合算法
  async fuseEmotions(input: MultimodalInput): Promise<EmotionFeatures> {
    const startTime = Date.now()

    try {
      // 1. 各模态独立分析
      const textEmotion = input.text ? await this.analyzeTextEmotion(input.text) : null
      const voiceEmotion = input.audioData ? await this.analyzeVoiceEmotion(input.audioData) : null
      const visualEmotion = input.videoData ? await this.analyzeVisualEmotion(input.videoData) : null
      const behavioralEmotion = input.behavioralData ? await this.analyzeBehavioralEmotion(input.behavioralData) : null

      // 2. 加权融合
      const fusedEmotion = this.performWeightedFusion(
        textEmotion,
        voiceEmotion,
        visualEmotion,
        behavioralEmotion,
        input.context
      )

      // 3. 时间平滑处理
      const smoothedEmotion = this.temporalSmoothing(fusedEmotion)

      // 4. 年龄特化调整
      const ageAdjustedEmotion = this.ageSpecificAdjustment(smoothedEmotion, input.context?.age)

      // 5. 更新历史记录
      this.updateEmotionHistory(ageAdjustedEmotion)

      // 6. 计算处理时间
      console.log(`情感融合完成，耗时: ${Date.now() - startTime}ms`)

      return ageAdjustedEmotion

    } catch (error) {
      console.error('[EnhancedEmotionFusion Error]', error)
      // 返回中性情感作为fallback
      return this.getNeutralEmotion()
    }
  }

  // 文本情感分析（增强版）
  private async analyzeTextEmotion(text: string): Promise<Partial<EmotionFeatures>> {
    // 基础情感词典
    const emotionKeywords = new Map([
      // 积极情感
      ['开心', { primary: 'joy', intensity: 0.8, valence: 0.8, arousal: 0.6 }],
      ['高兴', { primary: 'joy', intensity: 0.7, valence: 0.7, arousal: 0.5 }],
      ['兴奋', { primary: 'joy', secondary: 'excitement', intensity: 0.9, valence: 0.8, arousal: 0.9 }],
      ['好奇', { primary: 'surprise', secondary: 'curiosity', intensity: 0.6, valence: 0.4, arousal: 0.7 }],
      ['喜欢', { primary: 'joy', intensity: 0.6, valence: 0.7, arousal: 0.4 }],

      // 消极情感
      ['哭', { primary: 'sadness', intensity: 0.8, valence: -0.7, arousal: 0.6 }],
      ['难过', { primary: 'sadness', intensity: 0.7, valence: -0.6, arousal: 0.4 }],
      ['生气', { primary: 'anger', intensity: 0.8, valence: -0.6, arousal: 0.7 }],
      ['害怕', { primary: 'fear', intensity: 0.7, valence: -0.7, arousal: 0.8 }],
      ['惊讶', { primary: 'surprise', intensity: 0.6, valence: 0.0, arousal: 0.8 }],

      // 复合情感
      ['不要', { primary: 'anger', secondary: 'frustration', intensity: 0.6, valence: -0.4, arousal: 0.5 }],
      ['要', { primary: 'joy', secondary: 'excitement', intensity: 0.5, valence: 0.4, arousal: 0.6 }],
      ['抱抱', { primary: 'joy', secondary: 'comfort', intensity: 0.7, valence: 0.8, arousal: 0.3 }],
    ])

    // 简单的关键词匹配
    let detectedEmotion = null
    let maxIntensity = 0

    for (const [keyword, emotion] of emotionKeywords) {
      if (text.includes(keyword) && emotion.intensity > maxIntensity) {
        detectedEmotion = emotion
        maxIntensity = emotion.intensity
      }
    }

    return {
      ...detectedEmotion,
      confidence: detectedEmotion ? 0.7 : 0.3,
      timestamp: Date.now()
    }
  }

  // 语音情感分析（增强版）
  private async analyzeVoiceEmotion(audioData: { features: AudioFeatures }): Promise<Partial<EmotionFeatures>> {
    const { features } = audioData

    // 基于音频特征的情感映射
    const emotionMapping = {
      // 高音调 + 高能量 = 兴奋/激动
      highPitchHighEnergy: features.pitch > 300 && features.energy > 0.7 ? {
        primary: 'joy' as const,
        secondary: 'excitement' as const,
        intensity: 0.8,
        valence: 0.7,
        arousal: 0.9
      } : null,

      // 低音调 + 低能量 = 悲伤/困倦
      lowPitchLowEnergy: features.pitch < 200 && features.energy < 0.3 ? {
        primary: 'sadness' as const,
        intensity: 0.6,
        valence: -0.6,
        arousal: -0.3
      } : null,

      // 高变化率 = 生气/沮丧
      highVariability: features.volumeVariability > 0.8 ? {
        primary: 'anger' as const,
        secondary: 'frustration' as const,
        intensity: 0.7,
        valence: -0.5,
        arousal: 0.8
      } : null,

      // 高呼吸音 = 害怕/焦虑
      highBreathiness: features.breathiness > 0.6 ? {
        primary: 'fear' as const,
        secondary: 'anxiety' as const,
        intensity: 0.6,
        valence: -0.6,
        arousal: 0.7
      } : null,
    }

    // 找到最匹配的情感
    let detectedEmotion = null
    let maxScore = 0

    for (const [key, emotion] of Object.entries(emotionMapping)) {
      if (emotion && this.calculateEmotionScore(features, key) > maxScore) {
        detectedEmotion = emotion
        maxScore = this.calculateEmotionScore(features, key)
      }
    }

    return {
      ...detectedEmotion,
      confidence: detectedEmotion ? 0.6 : 0.2,
      timestamp: Date.now()
    }
  }

  // 视觉情感分析（面部表情）
  private async analyzeVisualEmotion(videoData: {
    facialFeatures: FacialFeatures,
    bodyLanguage: BodyLanguageFeatures
  }): Promise<Partial<EmotionFeatures>> {
    const { facialFeatures, bodyLanguage } = videoData

    // 面部表情分析
    const facialEmotion = this.analyzeFacialExpression(facialFeatures)

    // 身体语言分析
    const bodyEmotion = this.analyzeBodyLanguage(bodyLanguage)

    // 融合面部和身体语言
    const visualEmotion = this.fuseVisualEmotions(facialEmotion, bodyEmotion)

    return {
      ...visualEmotion,
      confidence: visualEmotion ? 0.5 : 0.1,
      timestamp: Date.now()
    }
  }

  // 面部表情分析
  private analyzeFacialExpression(features: FacialFeatures): Partial<EmotionFeatures> {
    const { actionUnits, smileIntensity, browRaise, eyeOpenness, mouthOpenness } = features

    // 基于FACS动作单元的情感识别
    if (actionUnits['AU06'] + actionUnits['AU12'] > 0.5) { // 嘴角上扬
      return {
        primary: 'joy',
        intensity: smileIntensity,
        valence: 0.8,
        arousal: 0.6
      }
    }

    if (actionUnits['AU04'] > 0.5) { // 眉毛下压
      return {
        primary: 'anger',
        intensity: browRaise,
        valence: -0.6,
        arousal: 0.7
      }
    }

    if (actionUnits['AU01'] + actionUnits['AU02'] > 0.5) { // 眉毛上扬
      return {
        primary: 'surprise',
        intensity: browRaise,
        valence: 0.1,
        arousal: 0.8
      }
    }

    if (eyeOpenness < 0.3 && mouthOpenness > 0.7) { // 哭泣表情
      return {
        primary: 'sadness',
        intensity: 0.8,
        valence: -0.7,
        arousal: 0.6
      }
    }

    return { primary: 'neutral', intensity: 0.1, valence: 0, arousal: 0 }
  }

  // 身体语言分析
  private analyzeBodyLanguage(features: BodyLanguageFeatures): Partial<EmotionFeatures> {
    const { posture, movementLevel, handGestures, personalSpace } = features

    if (movementLevel > 0.8 && handGestures.frequency > 0.7) {
      return {
        primary: 'joy',
        secondary: 'excitement',
        intensity: 0.7,
        valence: 0.8,
        arousal: 0.9
      }
    }

    if (posture === 'slumped' && movementLevel < 0.2) {
      return {
        primary: 'sadness',
        intensity: 0.5,
        valence: -0.5,
        arousal: -0.4
      }
    }

    if (posture === 'tense' && personalSpace > 0.8) {
      return {
        primary: 'fear',
        secondary: 'anxiety',
        intensity: 0.6,
        valence: -0.6,
        arousal: 0.7
      }
    }

    return { primary: 'neutral', intensity: 0.1, valence: 0, arousal: 0 }
  }

  // 行为情感分析
  private async analyzeBehavioralEmotion(behavioralData: {
    attention: number
    activity: string
    context: string
  }): Promise<Partial<EmotionFeatures>> {
    const { attention, activity, context } = behavioralData

    // 注意力水平映射
    const attentionEmotion = attention > 0.8 ? {
      primary: 'surprise' as const,
      secondary: 'curiosity' as const,
      intensity: 0.6,
      valence: 0.4,
      arousal: 0.7
    } : attention < 0.2 ? {
      primary: 'sadness' as const,
      intensity: 0.4,
      valence: -0.3,
      arousal: -0.5
    } : {
      primary: 'neutral' as const,
      intensity: 0.2,
      valence: 0,
      arousal: 0
    }

    // 活动类型映射
    const activityEmotionMap = new Map([
      ['playing', { valence: 0.7, arousal: 0.8 }],
      ['crying', { valence: -0.7, arousal: 0.6 }],
      ['sleeping', { valence: 0.2, arousal: -0.8 }],
      ['eating', { valence: 0.6, arousal: 0.3 }],
      ['exploring', { valence: 0.5, arousal: 0.9 }],
    ])

    const activityEmotion = activityEmotionMap.get(activity) || { valence: 0, arousal: 0 }

    return {
      primary: attentionEmotion.primary,
      secondary: attentionEmotion.secondary,
      intensity: Math.max(attentionEmotion.intensity, 0.3),
      valence: (attentionEmotion.valence + activityEmotion.valence) / 2,
      arousal: (attentionEmotion.arousal + activityEmotion.arousal) / 2,
      confidence: 0.4,
      timestamp: Date.now()
    }
  }

  // 加权融合算法
  private performWeightedFusion(
    textEmotion: Partial<EmotionFeatures> | null,
    voiceEmotion: Partial<EmotionFeatures> | null,
    visualEmotion: Partial<EmotionFeatures> | null,
    behavioralEmotion: Partial<EmotionFeatures> | null,
    context?: FusionContext
  ): EmotionFeatures {
    const emotions = [textEmotion, voiceEmotion, visualEmotion, behavioralEmotion].filter(Boolean)
    const weights = [this.EMOTION_WEIGHTS.text, this.EMOTION_WEIGHTS.voice,
                     this.EMOTION_WEIGHTS.visual, this.EMOTION_WEIGHTS.behavioral]

    if (emotions.length === 0) {
      return this.getNeutralEmotion()
    }

    // 计算加权平均
    let totalWeight = 0
    let weightedValence = 0
    let weightedArousal = 0
    let weightedIntensity = 0
    let maxConfidence = 0

    let primaryEmotion: EmotionFeatures['primary'] = 'neutral'
    let secondaryEmotion: EmotionFeatures['secondary'] | undefined
    let primaryCount = 0

    emotions.forEach((emotion, index) => {
      if (!emotion) return

      const weight = weights[index] || 0
      totalWeight += weight

      weightedValence += (emotion.valence || 0) * weight
      weightedArousal += (emotion.arousal || 0) * weight
      weightedIntensity += (emotion.intensity || 0) * weight

      if (emotion.confidence && emotion.confidence > maxConfidence) {
        maxConfidence = emotion.confidence
        primaryEmotion = emotion.primary || 'neutral'
        secondaryEmotion = emotion.secondary
      }

      // 统计主要情感
      if (emotion.primary === primaryEmotion) {
        primaryCount++
      }
    })

    // 如果一致性高，提高置信度
    if (primaryCount >= Math.ceil(emotions.length / 2)) {
      maxConfidence = Math.min(maxConfidence + 0.2, 0.9)
    }

    return {
      primary: primaryEmotion,
      secondary: secondaryEmotion,
      intensity: totalWeight > 0 ? weightedIntensity / totalWeight : 0.3,
      valence: totalWeight > 0 ? weightedValence / totalWeight : 0,
      arousal: totalWeight > 0 ? weightedArousal / totalWeight : 0,
      confidence: maxConfidence,
      modalityWeights: {
        text: textEmotion ? this.EMOTION_WEIGHTS.text : 0,
        voice: voiceEmotion ? this.EMOTION_WEIGHTS.voice : 0,
        visual: visualEmotion ? this.EMOTION_WEIGHTS.visual : 0,
        behavioral: behavioralEmotion ? this.EMOTION_WEIGHTS.behavioral : 0
      },
      timestamp: Date.now()
    }
  }

  // 时间平滑处理
  private temporalSmoothing(emotion: EmotionFeatures): EmotionFeatures {
    if (this.emotionHistory.length === 0) {
      return emotion
    }

    // 获取最近的情感记录
    const recentEmotions = this.emotionHistory.slice(-3)
    const weights = [0.5, 0.3, 0.2] // 当前、前一个、前两个的权重

    let smoothedValence = emotion.valence * weights[0]
    let smoothedArousal = emotion.arousal * weights[0]
    let totalWeight = weights[0]

    recentEmotions.forEach((recentEmotion, index) => {
      const weight = weights[index + 1] || 0
      smoothedValence += recentEmotion.valence * weight
      smoothedArousal += recentEmotion.arousal * weight
      totalWeight += weight
    })

    return {
      ...emotion,
      valence: smoothedValence / totalWeight,
      arousal: smoothedArousal / totalWeight,
      confidence: Math.min(emotion.confidence + 0.1, 0.9) // 平滑后略微提高置信度
    }
  }

  // 年龄特化调整
  private ageSpecificAdjustment(emotion: EmotionFeatures, age?: number): EmotionFeatures {
    if (!age) return emotion

    // 0-12个月婴儿特化
    if (age <= 1) {
      return this.adjustForInfant(emotion)
    }

    // 1-3岁幼儿特化
    if (age <= 3) {
      return this.adjustForToddler(emotion)
    }

    return emotion
  }

  // 婴儿情感调整
  private adjustForInfant(emotion: EmotionFeatures): EmotionFeatures {
    // 婴儿情感表达更直接，强度更高
    return {
      ...emotion,
      intensity: Math.min(emotion.intensity * 1.2, 1.0),
      confidence: emotion.confidence * 0.9 // 婴儿情感识别难度较高
    }
  }

  // 幼儿情感调整
  private adjustForToddler(emotion: EmotionFeatures): EmotionFeatures {
    // 幼儿开始有复合情感
    return {
      ...emotion,
      confidence: emotion.confidence * 1.1 // 幼儿情感表达更明确
    }
  }

  // 更新情感历史
  private updateEmotionHistory(emotion: EmotionFeatures): void {
    this.emotionHistory.push(emotion)

    // 保持历史记录大小
    if (this.emotionHistory.length > this.maxHistorySize) {
      this.emotionHistory.shift()
    }
  }

  // 辅助方法
  private calculateEmotionScore(features: AudioFeatures, pattern: string): number {
    // 简化的评分算法
    switch (pattern) {
      case 'highPitchHighEnergy':
        return (features.pitch / 500) * features.energy
      case 'lowPitchLowEnergy':
        return (1 - features.pitch / 500) * (1 - features.energy)
      case 'highVariability':
        return features.volumeVariability
      case 'highBreathiness':
        return features.breathiness
      default:
        return 0
    }
  }

  private fuseVisualEmotions(facial: Partial<EmotionFeatures>, body: Partial<EmotionFeatures>): Partial<EmotionFeatures> | null {
    if (!facial && !body) return null

    if (!facial) return body
    if (!body) return facial

    // 面部表情权重更高
    const facialWeight = 0.7
    const bodyWeight = 0.3

    return {
      primary: facial.primary || body.primary || 'neutral',
      intensity: (facial.intensity! * facialWeight + body.intensity! * bodyWeight),
      valence: (facial.valence! * facialWeight + body.valence! * bodyWeight),
      arousal: (facial.arousal! * facialWeight + body.arousal! * bodyWeight)
    }
  }

  private getNeutralEmotion(): EmotionFeatures {
    return {
      primary: 'neutral',
      intensity: 0.1,
      valence: 0,
      arousal: 0,
      confidence: 0.5,
      modalityWeights: {
        text: 0,
        voice: 0,
        visual: 0,
        behavioral: 0
      },
      timestamp: Date.now()
    }
  }

  // 获取情感历史趋势
  getEmotionTrends(windowSize: number = 10): {
    averageValence: number
    averageArousal: number
    primaryEmotion: string
    emotionalStability: number
  } {
    const recentEmotions = this.emotionHistory.slice(-windowSize)

    if (recentEmotions.length === 0) {
      return {
        averageValence: 0,
        averageArousal: 0,
        primaryEmotion: 'neutral',
        emotionalStability: 0
      }
    }

    const avgValence = recentEmotions.reduce((sum, e) => sum + e.valence, 0) / recentEmotions.length
    const avgArousal = recentEmotions.reduce((sum, e) => sum + e.arousal, 0) / recentEmotions.length

    // 计算主要情感
    const emotionCounts = new Map<string, number>()
    recentEmotions.forEach(e => {
      const count = emotionCounts.get(e.primary) || 0
      emotionCounts.set(e.primary, count + 1)
    })

    const primaryEmotion = [...emotionCounts.entries()]
      .sort((a, b) => b[1] - a[1])[0][0]

    // 计算情感稳定性
    const valenceVariance = recentEmotions.reduce((sum, e) => {
      return sum + Math.pow(e.valence - avgValence, 2)
    }, 0) / recentEmotions.length

    const emotionalStability = Math.max(0, 1 - Math.sqrt(valenceVariance))

    return {
      averageValence: avgValence,
      averageArousal: avgArousal,
      primaryEmotion,
      emotionalStability
    }
  }
}

// 导出单例
export const enhancedEmotionFusion = new EnhancedEmotionFusion()