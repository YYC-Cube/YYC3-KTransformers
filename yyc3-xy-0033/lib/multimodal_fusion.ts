// 多模态情感融合系统

export interface TextEmotionData {
  type: string
  confidence: number
  valence: number // -1 到 1，负面到正面
  arousal: number // 0 到 1，平静到激动
}

export interface VoiceEmotionData {
  type: string
  confidence: number
  pitch: number
  energy: number
  variation: number
}

export interface FusedEmotionResult {
  dominantEmotion: string
  confidence: number
  valence: number
  arousal: number
  sources: {
    text?: TextEmotionData
    voice?: VoiceEmotionData
  }
  recommendation: string
  actionSuggestions: string[]
}

// 情感类型映射到valence/arousal
const EMOTION_MAPPING: Record<string, { valence: number; arousal: number }> = {
  happy: { valence: 0.8, arousal: 0.6 },
  excited: { valence: 0.9, arousal: 0.9 },
  calm: { valence: 0.5, arousal: 0.2 },
  neutral: { valence: 0, arousal: 0.3 },
  sad: { valence: -0.7, arousal: 0.3 },
  angry: { valence: -0.8, arousal: 0.9 },
  anxious: { valence: -0.5, arousal: 0.8 },
  tired: { valence: -0.3, arousal: 0.1 },
  curious: { valence: 0.6, arousal: 0.5 },
  frustrated: { valence: -0.6, arousal: 0.7 },
}

// 多模态融合权重配置
const FUSION_WEIGHTS = {
  text: 0.4,
  voice: 0.6, // 语音情感通常更准确
}

export class MultimodalEmotionFusion {
  // 融合文本和语音情感
  fuseEmotions(textEmotion?: TextEmotionData, voiceEmotion?: VoiceEmotionData): FusedEmotionResult {
    // 单模态情况
    if (!textEmotion && !voiceEmotion) {
      return this.createNeutralResult()
    }

    if (!voiceEmotion) {
      return this.createResultFromText(textEmotion!)
    }

    if (!textEmotion) {
      return this.createResultFromVoice(voiceEmotion)
    }

    // 双模态融合
    return this.performFusion(textEmotion, voiceEmotion)
  }

  private performFusion(textEmotion: TextEmotionData, voiceEmotion: VoiceEmotionData): FusedEmotionResult {
    // 加权融合valence和arousal
    const textMapping = EMOTION_MAPPING[textEmotion.type] || EMOTION_MAPPING.neutral
    const voiceMapping = EMOTION_MAPPING[voiceEmotion.type] || EMOTION_MAPPING.neutral

    const fusedValence =
      textMapping.valence * FUSION_WEIGHTS.text * textEmotion.confidence +
      voiceMapping.valence * FUSION_WEIGHTS.voice * voiceEmotion.confidence

    const fusedArousal =
      textMapping.arousal * FUSION_WEIGHTS.text * textEmotion.confidence +
      voiceMapping.arousal * FUSION_WEIGHTS.voice * voiceEmotion.confidence

    // 归一化
    const totalWeight = FUSION_WEIGHTS.text * textEmotion.confidence + FUSION_WEIGHTS.voice * voiceEmotion.confidence

    const normalizedValence = fusedValence / totalWeight
    const normalizedArousal = fusedArousal / totalWeight

    // 从融合后的valence/arousal反推情感类型
    const dominantEmotion = this.classifyFromDimensions(normalizedValence, normalizedArousal)

    // 计算融合置信度
    const confidence = this.calculateFusedConfidence(textEmotion, voiceEmotion)

    // 生成建议
    const { recommendation, actionSuggestions } = this.generateRecommendations(
      dominantEmotion,
      normalizedValence,
      normalizedArousal,
    )

    return {
      dominantEmotion,
      confidence,
      valence: normalizedValence,
      arousal: normalizedArousal,
      sources: {
        text: textEmotion,
        voice: voiceEmotion,
      },
      recommendation,
      actionSuggestions,
    }
  }

  private classifyFromDimensions(valence: number, arousal: number): string {
    // 基于Russell环状模型分类
    if (valence > 0.3) {
      if (arousal > 0.6) return "excited"
      if (arousal > 0.3) return "happy"
      return "calm"
    } else if (valence < -0.3) {
      if (arousal > 0.6) return "angry"
      if (arousal > 0.4) return "anxious"
      return "sad"
    } else {
      if (arousal > 0.5) return "curious"
      return "neutral"
    }
  }

  private calculateFusedConfidence(textEmotion: TextEmotionData, voiceEmotion: VoiceEmotionData): number {
    // 如果两个模态一致，置信度更高
    const isSameEmotion = textEmotion.type === voiceEmotion.type
    const baseConfidence = (textEmotion.confidence + voiceEmotion.confidence) / 2

    if (isSameEmotion) {
      return Math.min(1, baseConfidence * 1.2)
    }

    // 不一致时降低置信度
    return baseConfidence * 0.8
  }

  private generateRecommendations(
    emotion: string,
    valence: number,
    arousal: number,
  ): { recommendation: string; actionSuggestions: string[] } {
    const recommendations: Record<string, { recommendation: string; actionSuggestions: string[] }> = {
      happy: {
        recommendation: "宝贝现在心情很好，这是学习新知识的好时机！",
        actionSuggestions: ["尝试有挑战性的任务", "记录这个开心时刻", "分享快乐给家人"],
      },
      excited: {
        recommendation: "宝贝非常兴奋！可以引导这份热情到有意义的活动中。",
        actionSuggestions: ["进行创意活动", "户外运动释放能量", "分享兴奋的原因"],
      },
      calm: {
        recommendation: "宝贝状态平和稳定，适合进行需要专注的活动。",
        actionSuggestions: ["阅读或学习", "安静的手工活动", "亲子对话时光"],
      },
      neutral: {
        recommendation: "宝贝情绪平稳，可以根据计划进行日常活动。",
        actionSuggestions: ["按计划完成任务", "尝试新的兴趣", "户外活动放松"],
      },
      sad: {
        recommendation: "宝贝似乎有些不开心，需要更多的关心和陪伴。",
        actionSuggestions: ["倾听孩子的想法", "给一个温暖的拥抱", "一起做喜欢的事情"],
      },
      angry: {
        recommendation: "宝贝情绪有些激动，先帮助Ta平复情绪。",
        actionSuggestions: ["深呼吸练习", "给予冷静空间", "等平静后再沟通"],
      },
      anxious: {
        recommendation: "宝贝可能感到焦虑，需要安抚和支持。",
        actionSuggestions: ["陪伴和倾听", "帮助分析担心的事", "制定小步骤计划"],
      },
      curious: {
        recommendation: "宝贝充满好奇心，这是探索学习的好时机！",
        actionSuggestions: ["鼓励提问", "一起寻找答案", "进行科学小实验"],
      },
    }

    return recommendations[emotion] || recommendations.neutral
  }

  private createNeutralResult(): FusedEmotionResult {
    return {
      dominantEmotion: "neutral",
      confidence: 0.5,
      valence: 0,
      arousal: 0.3,
      sources: {},
      recommendation: "暂时无法检测到明确的情绪信号。",
      actionSuggestions: ["继续观察", "主动询问感受"],
    }
  }

  private createResultFromText(textEmotion: TextEmotionData): FusedEmotionResult {
    const mapping = EMOTION_MAPPING[textEmotion.type] || EMOTION_MAPPING.neutral
    const { recommendation, actionSuggestions } = this.generateRecommendations(
      textEmotion.type,
      mapping.valence,
      mapping.arousal,
    )

    return {
      dominantEmotion: textEmotion.type,
      confidence: textEmotion.confidence * 0.8, // 单模态置信度降低
      valence: mapping.valence,
      arousal: mapping.arousal,
      sources: { text: textEmotion },
      recommendation,
      actionSuggestions,
    }
  }

  private createResultFromVoice(voiceEmotion: VoiceEmotionData): FusedEmotionResult {
    const mapping = EMOTION_MAPPING[voiceEmotion.type] || EMOTION_MAPPING.neutral
    const { recommendation, actionSuggestions } = this.generateRecommendations(
      voiceEmotion.type,
      mapping.valence,
      mapping.arousal,
    )

    return {
      dominantEmotion: voiceEmotion.type,
      confidence: voiceEmotion.confidence * 0.9, // 语音单模态置信度略高
      valence: mapping.valence,
      arousal: mapping.arousal,
      sources: { voice: voiceEmotion },
      recommendation,
      actionSuggestions,
    }
  }
}

// 单例实例
let fusionInstance: MultimodalEmotionFusion | null = null

export function getEmotionFusion(): MultimodalEmotionFusion {
  if (!fusionInstance) {
    fusionInstance = new MultimodalEmotionFusion()
  }
  return fusionInstance
}
