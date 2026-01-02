"use client"

import { intelligentGrowthGuardian, GrowthInsight, DevelopmentalAssessment } from "./intelligent-growth-guardian"

/**
 * 用户行为上下文
 */
export interface UserBehaviorContext {
  query?: string
  sessionId?: string
  module?: string
  previousAction?: string
  environment?: {
    device?: string
    location?: string
    timeOfDay?: string
  }
  metadata?: Record<string, unknown>
}

/**
 * 用户行为数据
 */
export interface UserBehavior {
  id: string
  timestamp: Date
  type: 'query' | 'voice_interaction' | 'assessment' | 'module_activation' | 'resource_access'
  content: string
  context: UserBehaviorContext
  outcome?: 'success' | 'partial' | 'failed'
  duration?: number
  satisfaction?: number
}

/**
 * 推荐项类型
 */
export interface RecommendationItem {
  id: string
  type: 'content' | 'activity' | 'assessment' | 'module' | 'resource'
  title: string
  description: string
  category: 'learning' | 'development' | 'entertainment' | 'health' | 'social'
  priority: 'low' | 'medium' | 'high'
  confidence: number
  reasoning: string
  metadata: {
    estimatedDuration?: string
    difficulty?: 'easy' | 'medium' | 'hard'
    ageRange?: string
    tags: string[]
    relatedRoles?: string[]
    resources?: Array<{
      type: 'article' | 'video' | 'exercise' | 'tool'
      title: string
      url?: string
      description: string
    }>
  }
  actionable: boolean
  callToAction?: string
}

/**
 * 预测支持数据
 */
export interface PredictionSupportingData {
  type: 'behavior' | 'assessment' | 'milestone' | 'trend' | 'metric'
  value: string | number | boolean
  timestamp?: Date
  confidence?: number
  metadata?: Record<string, unknown>
}

/**
 * 预测模型结果
 */
export interface PredictionResult {
  id: string
  type: 'developmental_milestone' | 'learning_need' | 'behavior_pattern' | 'growth_trend'
  title: string
  description: string
  confidence: number
  timeframe: string
  impact: 'low' | 'medium' | 'high'
  actionable: boolean
  suggestedActions: string[]
  supportingData: PredictionSupportingData[]
}

/**
 * 内容数据库项
 */
export interface ContentDatabaseItem {
  type: 'content' | 'activity' | 'assessment' | 'module' | 'resource'
  title: string
  category: 'learning' | 'development' | 'entertainment' | 'health' | 'social'
  ageRange: string
  description: string
  tags: string[]
  difficulty: 'easy' | 'medium' | 'hard'
  duration: string
  resources: Array<{
    type: 'article' | 'video' | 'exercise' | 'tool' | 'game' | 'activity'
    title: string
    url?: string
    description: string
  }>
}

/**
 * 推荐上下文
 */
export interface RecommendationContext {
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night'
  dayOfWeek?: 'weekday' | 'weekend'
  location?: string
  activity?: string
  mood?: string
  energyLevel?: 'high' | 'medium' | 'low'
  metadata?: Record<string, unknown>
}

/**
 * 查询模式
 */
export interface QueryPattern {
  keyword: string
  frequency: number
  lastSeen: Date
  contexts: string[]
}

/**
 * 交互模式分析结果
 */
export interface InteractionPatternAnalysis {
  patterns: string[]
  frequencies: Record<string, number>
  averageDuration: number
  satisfactionRate: number
  preferredModes: string[]
}

/**
 * 发展里程碑
 */
export interface DevelopmentalMilestone {
  age: number
  domain: string
  milestone: string
  description: string
  indicators: string[]
  activities: string[]
}

/**
 * 学习模式分析
 */
export interface LearningPatternAnalysis {
  preferredTopics: string[]
  learningSpeed: 'fast' | 'medium' | 'slow'
  retentionRate: number
  engagementLevel: 'high' | 'medium' | 'low'
  optimalTime: string
}

/**
 * 行为模式识别
 */
export interface BehaviorPatternRecognition {
  patterns: string[]
  triggers: string[]
  frequencies: Record<string, number>
  trends: 'increasing' | 'decreasing' | 'stable'
  predictions: string[]
}

/**
 * 成长趋势分析
 */
export interface GrowthTrendAnalysis {
  overallProgress: number
  domainProgress: Record<string, number>
  accelerationAreas: string[]
  areasForImprovement: string[]
  projectedGrowth: number
  timeframe: string
}

/**
 * 推荐统计
 */
export interface RecommendationStats {
  totalRecommendations: number
  acceptedRecommendations: number
  rejectedRecommendations: number
  averageConfidence: number
  topCategories: Array<{
    category: string
    count: number
    satisfaction: number
  }>
  recentActivity: {
    timestamp: Date
    action: string
    outcome: string
  }[]
}

/**
 * 推荐权重配置
 */
export interface RecommendationWeights {
  contentRelevance: number
  userPreference: number
  developmentalSuitability: number
  timingContext: number
  learningProgress: number
}

/**
 * 个性化档案
 */
export interface PersonalizedProfile {
  userId: string
  childAge: number
  interests: string[]
  strengths: string[]
  challenges: string[]
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed'
  developmentalStage: string
  recentActivities: UserBehavior[]
  preferences: {
    contentTypes: string[]
    interactionModes: string[]
    timePreferences: string[]
    difficultyLevel: string
  }
  goals: string[]
}

/**
 * 智能预测推荐系统
 */
export class IntelligentRecommendationSystem {
  private userProfiles: Map<string, PersonalizedProfile> = new Map()
  private userBehaviors: Map<string, UserBehavior[]> = new Map()
  private recommendations: Map<string, RecommendationItem[]> = new Map()
  private predictions: Map<string, PredictionResult[]> = new Map()
  private contentDatabase: Map<string, ContentDatabaseItem> = new Map()
  private recommendationWeights: RecommendationWeights = {
    contentRelevance: 0.3,
    userPreference: 0.25,
    developmentalSuitability: 0.2,
    timingContext: 0.15,
    learningProgress: 0.1
  }

  constructor() {
    this.initializeContentDatabase()
    this.initializeRecommendationEngine()
  }

  /**
   * 初始化内容数据库
   */
  private initializeContentDatabase() {
    // 学习内容
    this.contentDatabase.set('math-games-3-5', {
      type: 'activity',
      title: '数学启蒙游戏',
      category: 'learning',
      ageRange: '3-5岁',
      description: '通过有趣的游戏培养数学思维',
      tags: ['数学', '逻辑', '游戏'],
      difficulty: 'easy',
      duration: '15-20分钟',
      resources: [
        { type: 'game', title: '数字配对游戏', description: '认识数字1-10' },
        { type: 'exercise', title: '形状认知练习', description: '基础几何形状学习' }
      ]
    })

    this.contentDatabase.set('language-stories-4-6', {
      type: 'content',
      title: '语言故事集',
      category: 'learning',
      ageRange: '4-6岁',
      description: '经典儿童故事，提升语言表达和理解能力',
      tags: ['语言', '故事', '阅读'],
      difficulty: 'medium',
      duration: '10-15分钟',
      resources: [
        { type: 'article', title: '三只小猪', description: '经典童话故事' },
        { type: 'video', title: '故事动画', description: '配套动画视频' }
      ]
    })

    this.contentDatabase.set('emotional-regulation-5-7', {
      type: 'resource',
      title: '情绪管理指南',
      category: 'health',
      ageRange: '5-7岁',
      description: '帮助孩子理解和调节情绪的实用方法',
      tags: ['情感', '心理健康', '社交'],
      difficulty: 'medium',
      duration: '20-30分钟',
      resources: [
        { type: 'article', title: '情绪识别卡片', description: '帮助孩子认识不同情绪' },
        { type: 'tool', title: '情绪日记模板', description: '记录每日情绪变化' }
      ]
    })

    this.contentDatabase.set('physical-activities-3-6', {
      type: 'activity',
      title: '体能发展活动',
      category: 'health',
      ageRange: '3-6岁',
      description: '促进大肌肉和精细动作发展的活动',
      tags: ['运动', '身体发展', '协调'],
      difficulty: 'easy',
      duration: '30-45分钟',
      resources: [
        { type: 'exercise', title: '障碍赛游戏', description: '提升协调性和平衡感' },
        { type: 'activity', title: '手工制作', description: '精细动作训练' }
      ]
    })

    this.contentDatabase.set('social-skills-4-8', {
      type: 'content',
      title: '社交技能培养',
      category: 'social',
      ageRange: '4-8岁',
      description: '培养孩子的社交交往能力',
      tags: ['社交', '沟通', '合作'],
      difficulty: 'medium',
      duration: '25-35分钟',
      resources: [
        { type: 'article', title: '分享与合作指南', description: '社交技能训练方法' },
        { type: 'activity', title: '角色扮演游戏', description: '实践社交场景' }
      ]
    })

    // 发展评估内容
    this.contentDatabase.set('developmental-assessment-4', {
      type: 'assessment',
      title: '4岁发展评估',
      category: 'development',
      ageRange: '4岁',
      description: '全面评估4岁儿童的发展水平',
      tags: ['评估', '发展', '里程碑'],
      difficulty: 'easy',
      duration: '45-60分钟',
      resources: [
        { type: 'tool', title: '发展检查清单', description: '详细的评估项目' },
        { type: 'article', title: '4岁发展特点', description: '年龄发展特征说明' }
      ]
    })
  }

  /**
   * 初始化推荐引擎
   */
  private initializeRecommendationEngine() {
    // 推荐算法权重已在类属性中初始化
  }

  /**
   * 记录用户行为
   */
  public recordUserBehavior(userId: string, behavior: Omit<UserBehavior, 'id' | 'timestamp'>) {
    const fullBehavior: UserBehavior = {
      id: `behavior-${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
      ...behavior
    }

    if (!this.userBehaviors.has(userId)) {
      this.userBehaviors.set(userId, [])
    }

    this.userBehaviors.get(userId)!.push(fullBehavior)

    // 保持最近100条记录
    const behaviors = this.userBehaviors.get(userId)!
    if (behaviors.length > 100) {
      this.userBehaviors.set(userId, behaviors.slice(-100))
    }

    // 触发推荐更新
    this.updateRecommendations(userId)
  }

  /**
   * 更新用户档案
   */
  public updateUserProfile(userId: string, profile: Partial<PersonalizedProfile>) {
    const existingProfile = this.userProfiles.get(userId) || {
      userId,
      childAge: 4,
      interests: [],
      strengths: [],
      challenges: [],
      learningStyle: 'mixed',
      developmentalStage: 'preschool',
      recentActivities: [],
      preferences: {
        contentTypes: [],
        interactionModes: [],
        timePreferences: [],
        difficultyLevel: 'medium'
      },
      goals: []
    }

    this.userProfiles.set(userId, { ...existingProfile, ...profile })
  }

  /**
   * 获取用户档案
   */
  public getUserProfile(userId: string): PersonalizedProfile | null {
    return this.userProfiles.get(userId) || null
  }

  /**
   * 生成个性化推荐
   */
  public generateRecommendations(userId: string, context?: RecommendationContext): RecommendationItem[] {
    const profile = this.getUserProfile(userId)
    const behaviors = this.userBehaviors.get(userId) || []

    if (!profile) {
      return this.getDefaultRecommendations()
    }

    const recommendations: RecommendationItem[] = []

    // 基于年龄和发展阶段的推荐
    const ageBasedRecommendations = this.generateAgeBasedRecommendations(profile.childAge)
    recommendations.push(...ageBasedRecommendations)

    // 基于兴趣的推荐
    const interestBasedRecommendations = this.generateInterestBasedRecommendations(profile.interests)
    recommendations.push(...interestBasedRecommendations)

    // 基于学习风格的推荐
    const styleBasedRecommendations = this.generateStyleBasedRecommendations(profile.learningStyle)
    recommendations.push(...styleBasedRecommendations)

    // 基于行为模式的推荐
    const behaviorBasedRecommendations = this.generateBehaviorBasedRecommendations(behaviors)
    recommendations.push(...behaviorBasedRecommendations)

    // 基于发展需求的推荐
    const developmentBasedRecommendations = this.generateDevelopmentBasedRecommendations(profile)
    recommendations.push(...developmentBasedRecommendations)

    // 基于时间上下文的推荐
    if (context?.timeOfDay || context?.dayOfWeek) {
      const contextBasedRecommendations = this.generateContextBasedRecommendations(context)
      recommendations.push(...contextBasedRecommendations)
    }

    // 排序和过滤
    const sortedRecommendations = this.rankRecommendations(recommendations, profile, context)
    const filteredRecommendations = this.filterRecommendations(sortedRecommendations, profile)

    this.recommendations.set(userId, filteredRecommendations)
    return filteredRecommendations.slice(0, 10) // 返回前10个推荐
  }

  /**
   * 生成基于年龄的推荐
   */
  private generateAgeBasedRecommendations(age: number): RecommendationItem[] {
    const recommendations: RecommendationItem[] = []

    // 根据年龄匹配内容
    Array.from(this.contentDatabase.values()).forEach(content => {
      if (content.ageRange && this.isAgeInRange(age, content.ageRange)) {
        recommendations.push({
          id: `age-based-${content.type}-${Date.now()}`,
          type: content.type,
          title: content.title,
          description: content.description,
          category: content.category,
          priority: 'medium',
          confidence: 0.8,
          reasoning: `适合${age}岁儿童的年龄发展阶段`,
          metadata: {
            estimatedDuration: content.duration,
            difficulty: content.difficulty,
            ageRange: content.ageRange,
            tags: content.tags,
            resources: content.resources
          },
          actionable: true,
          callToAction: '开始体验'
        })
      }
    })

    return recommendations
  }

  /**
   * 生成基于兴趣的推荐
   */
  private generateInterestBasedRecommendations(interests: string[]): RecommendationItem[] {
    const recommendations: RecommendationItem[] = []

    interests.forEach(interest => {
      const relatedContent = Array.from(this.contentDatabase.values()).filter(content =>
        content.tags.some(tag =>
          tag.toLowerCase().includes(interest.toLowerCase()) ||
          interest.toLowerCase().includes(tag.toLowerCase())
        )
      )

      relatedContent.forEach(content => {
        recommendations.push({
          id: `interest-${interest}-${content.type}-${Date.now()}`,
          type: content.type,
          title: content.title,
          description: `${content.description}（基于您对${interest}的兴趣）`,
          category: content.category,
          priority: 'high',
          confidence: 0.9,
          reasoning: `匹配您的兴趣：${interest}`,
          metadata: {
            estimatedDuration: content.duration,
            difficulty: content.difficulty,
            tags: content.tags,
            resources: content.resources
          },
          actionable: true,
          callToAction: '探索更多'
        })
      })
    })

    return recommendations
  }

  /**
   * 生成基于学习风格的推荐
   */
  private generateStyleBasedRecommendations(learningStyle: string): RecommendationItem[] {
    const recommendations: RecommendationItem[] = []

    const styleMapping = {
      visual: ['视频', '图片', '图表', '动画'],
      auditory: ['音频', '故事', '音乐', '讨论'],
      kinesthetic: ['游戏', '活动', '手工', '运动'],
      mixed: ['多样化', '互动', '实践']
    }

    const preferredTypes = styleMapping[learningStyle as keyof typeof styleMapping] || []

    Array.from(this.contentDatabase.values()).forEach(content => {
      const matches = preferredTypes.some(type =>
        content.description.includes(type) ||
        content.tags.some(tag => tag.includes(type)) ||
        (content.resources && content.resources.some((r) => r.description.includes(type)))
      )

      if (matches) {
        recommendations.push({
          id: `style-${learningStyle}-${content.type}-${Date.now()}`,
          type: content.type,
          title: content.title,
          description: `${content.description}（适合${learningStyle}学习风格）`,
          category: content.category,
          priority: 'medium',
          confidence: 0.75,
          reasoning: `匹配您的${learningStyle}学习风格`,
          metadata: {
            estimatedDuration: content.duration,
            difficulty: content.difficulty,
            tags: content.tags,
            resources: content.resources
          },
          actionable: true
        })
      }
    })

    return recommendations
  }

  /**
   * 生成基于行为模式的推荐
   */
  private generateBehaviorBasedRecommendations(behaviors: UserBehavior[]): RecommendationItem[] {
    const recommendations: RecommendationItem[] = []

    if (behaviors.length === 0) return recommendations

    // 分析最近的行为模式
    const recentBehaviors = behaviors.slice(-20)
    const queryPatterns = this.analyzeQueryPatterns(recentBehaviors)
    const interactionPatterns = this.analyzeInteractionPatterns(recentBehaviors)

    // 基于查询模式的推荐
    queryPatterns.patterns.forEach((pattern: QueryPattern) => {
      const relatedContent = Array.from(this.contentDatabase.values()).filter(content =>
        content.tags.some(tag => tag.includes(pattern.keyword)) ||
        content.description.includes(pattern.keyword) ||
        content.title.includes(pattern.keyword)
      )

      relatedContent.forEach(content => {
        recommendations.push({
          id: `behavior-${pattern.keyword}-${content.type}-${Date.now()}`,
          type: content.type,
          title: content.title,
          description: `${content.description}（基于您最近的${pattern.keyword}相关查询）`,
          category: content.category,
          priority: pattern.frequency > 3 ? 'high' : 'medium',
          confidence: Math.min(0.9, 0.6 + pattern.frequency * 0.1),
          reasoning: `您最近多次关注${pattern.keyword}相关内容`,
          metadata: {
            estimatedDuration: content.duration,
            difficulty: content.difficulty,
            tags: content.tags,
            resources: content.resources
          },
          actionable: true
        })
      })
    })

    return recommendations
  }

  /**
   * 生成基于发展需求的推荐
   */
  private generateDevelopmentBasedRecommendations(profile: PersonalizedProfile): RecommendationItem[] {
    const recommendations: RecommendationItem[] = []

    // 基于挑战的推荐
    profile.challenges.forEach(challenge => {
      const supportingContent = Array.from(this.contentDatabase.values()).filter(content =>
        content.tags.some(tag => tag.includes(challenge)) ||
        content.description.toLowerCase().includes(challenge.toLowerCase())
      )

      supportingContent.forEach(content => {
        recommendations.push({
          id: `challenge-${challenge}-${content.type}-${Date.now()}`,
          type: content.type,
          title: content.title,
          description: `${content.description}（帮助应对${challenge}挑战）`,
          category: content.category,
          priority: 'high',
          confidence: 0.85,
          reasoning: `针对您关注的${challenge}发展需求`,
          metadata: {
            estimatedDuration: content.duration,
            difficulty: 'easy', // 从简单开始
            tags: content.tags,
            resources: content.resources
          },
          actionable: true,
          callToAction: '开始改善'
        })
      })
    })

    // 基于目标的推荐
    profile.goals.forEach(goal => {
      const goalContent = Array.from(this.contentDatabase.values()).filter(content =>
        content.tags.some(tag => tag.includes(goal)) ||
        content.description.toLowerCase().includes(goal.toLowerCase())
      )

      goalContent.forEach(content => {
        recommendations.push({
          id: `goal-${goal}-${content.type}-${Date.now()}`,
          type: content.type,
          title: content.title,
          description: `${content.description}（助力实现${goal}目标）`,
          category: content.category,
          priority: 'medium',
          confidence: 0.8,
          reasoning: `支持您的${goal}发展目标`,
          metadata: {
            estimatedDuration: content.duration,
            difficulty: content.difficulty,
            tags: content.tags,
            resources: content.resources
          },
          actionable: true,
          callToAction: '迈向目标'
        })
      })
    })

    return recommendations
  }

  /**
   * 生成基于上下文的推荐
   */
  private generateContextBasedRecommendations(context: RecommendationContext): RecommendationItem[] {
    const recommendations: RecommendationItem[] = []

    const { timeOfDay, dayOfWeek } = context

    // 基于时间的推荐
    if (timeOfDay === 'morning') {
      recommendations.push({
        id: 'context-morning-activity',
        type: 'activity',
        title: '晨间活力活动',
        description: '适合早晨的轻度运动和认知游戏',
        category: 'health',
        priority: 'medium',
        confidence: 0.7,
        reasoning: '早晨是进行身体和大脑激活的好时机',
        metadata: {
          estimatedDuration: '15-20分钟',
          difficulty: 'easy',
          tags: ['早晨', '运动', '认知'],
          resources: []
        },
        actionable: true,
        callToAction: '开始晨间活动'
      })
    } else if (timeOfDay === 'evening') {
      recommendations.push({
        id: 'context-evening-calm',
        type: 'content',
        title: '睡前安静故事',
        description: '帮助孩子平静下来的睡前故事和放松活动',
        category: 'entertainment',
        priority: 'medium',
        confidence: 0.7,
        reasoning: '晚上适合进行安静、舒缓的活动',
        metadata: {
          estimatedDuration: '10-15分钟',
          difficulty: 'easy',
          tags: ['睡前', '故事', '放松'],
          resources: []
        },
        actionable: true,
        callToAction: '享受睡前时光'
      })
    }

    // 基于星期的推荐
    if (dayOfWeek === 'weekend') {
      recommendations.push({
        id: 'context-weekend-family',
        type: 'activity',
        title: '周末家庭活动',
        description: '适合全家一起参与的创意和运动活动',
        category: 'social',
        priority: 'medium',
        confidence: 0.6,
        reasoning: '周末有更多时间进行家庭活动',
        metadata: {
          estimatedDuration: '60-90分钟',
          difficulty: 'medium',
          tags: ['周末', '家庭', '创意'],
          resources: []
        },
        actionable: true,
        callToAction: '家庭时光'
      })
    }

    return recommendations
  }

  /**
   * 生成预测
   */
  public generatePredictions(userId: string): PredictionResult[] {
    const profile = this.getUserProfile(userId)
    const behaviors = this.userBehaviors.get(userId) || []

    if (!profile) {
      return []
    }

    const predictions: PredictionResult[] = []

    // 发展里程碑预测
    const milestonePredictions = this.predictDevelopmentalMilestones(profile, behaviors)
    predictions.push(...milestonePredictions)

    // 学习需求预测
    const learningPredictions = this.predictLearningNeeds(profile, behaviors)
    predictions.push(...learningPredictions)

    // 行为模式预测
    const behaviorPredictions = this.predictBehaviorPatterns(behaviors)
    predictions.push(...behaviorPredictions)

    // 成长趋势预测
    const trendPredictions = this.predictGrowthTrends(profile, behaviors)
    predictions.push(...trendPredictions)

    this.predictions.set(userId, predictions)
    return predictions
  }

  /**
   * 预测发展里程碑
   */
  private predictDevelopmentalMilestones(profile: PersonalizedProfile, behaviors: UserBehavior[]): PredictionResult[] {
    const predictions: PredictionResult[] = []

    const age = profile.childAge

    // 基于年龄预测下一个重要里程碑
    const nextMilestone = this.getNextDevelopmentalMilestone(age)
    if (nextMilestone) {
      predictions.push({
        id: 'milestone-next',
        type: 'developmental_milestone',
        title: nextMilestone.title,
        description: `预计在${nextMilestone.timeframe}内，孩子将进入${nextMilestone.description}发展阶段`,
        confidence: 0.75,
        timeframe: nextMilestone.timeframe,
        impact: 'high',
        actionable: true,
        suggestedActions: nextMilestone.preparations,
        supportingData: [{ currentAge: age, nextMilestone: nextMilestone.title }]
      })
    }

    return predictions
  }

  /**
   * 预测学习需求
   */
  private predictLearningNeeds(profile: PersonalizedProfile, behaviors: UserBehavior[]): PredictionResult[] {
    const predictions: PredictionResult[] = []

    // 基于当前行为预测学习需求
    const learningPatterns = this.analyzeLearningPatterns(behaviors)

    learningPatterns.needs.forEach(need => {
      predictions.push({
        id: `learning-need-${need.type}`,
        type: 'learning_need',
        title: need.title,
        description: need.description,
        confidence: need.confidence,
        timeframe: need.timeframe,
        impact: need.impact,
        actionable: true,
        suggestedActions: need.actions,
        supportingData: need.evidence
      })
    })

    return predictions
  }

  /**
   * 预测行为模式
   */
  private predictBehaviorPatterns(behaviors: UserBehavior[]): PredictionResult[] {
    const predictions: PredictionResult[] = []

    if (behaviors.length < 10) return predictions

    const patterns = this.identifyBehaviorPatterns(behaviors)

    patterns.forEach(pattern => {
      predictions.push({
        id: `behavior-pattern-${pattern.type}`,
        type: 'behavior_pattern',
        title: pattern.title,
        description: pattern.description,
        confidence: pattern.confidence,
        timeframe: pattern.timeframe,
        impact: pattern.impact,
        actionable: pattern.actionable,
        suggestedActions: pattern.recommendations,
        supportingData: pattern.data
      })
    })

    return predictions
  }

  /**
   * 预测成长趋势
   */
  private predictGrowthTrends(profile: PersonalizedProfile, behaviors: UserBehavior[]): PredictionResult[] {
    const predictions: PredictionResult[] = []

    // 基于历史数据预测发展趋势
    const trends = this.analyzeGrowthTrends(profile, behaviors)

    trends.forEach(trend => {
      predictions.push({
        id: `growth-trend-${trend.area}`,
        type: 'growth_trend',
        title: trend.title,
        description: trend.description,
        confidence: trend.confidence,
        timeframe: trend.timeframe,
        impact: trend.impact,
        actionable: trend.actionable,
        suggestedActions: trend.recommendations,
        supportingData: trend.data
      })
    })

    return predictions
  }

  /**
   * 辅助方法实现
   */
  private isAgeInRange(age: number, ageRange: string): boolean {
    if (ageRange.includes('-')) {
      const [min, max] = ageRange.replace('岁', '').split('-').map(Number)
      return age >= min && age <= max
    }
    return ageRange.includes(age.toString())
  }

  private analyzeQueryPatterns(behaviors: UserBehavior[]): { patterns: Array<{ pattern: string, frequency: number }> } {
    const patterns: { [key: string]: number } = {}

    behaviors
      .filter(b => b.type === 'query')
      .forEach(behavior => {
        const words = behavior.content.toLowerCase().split(/\s+/)
        words.forEach(word => {
          if (word.length > 2) {
            patterns[word] = (patterns[word] || 0) + 1
          }
        })
      })

    const sortedPatterns = Object.entries(patterns)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([pattern, frequency]) => ({ pattern, frequency }))

    return { patterns: sortedPatterns }
  }

  private analyzeInteractionPatterns(behaviors: UserBehavior[]): InteractionPatternAnalysis {
    const patterns = behaviors.map(b => b.type)
    const frequencies = patterns.reduce((acc, type) => {
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const averageDuration = behaviors.reduce((sum, b) => sum + (b.duration || 0), 0) / behaviors.length
    const satisfactionRate = behaviors.filter(b => b.satisfaction && b.satisfaction > 3).length / behaviors.length
    const preferredModes = Object.entries(frequencies)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([mode]) => mode)

    return {
      patterns,
      frequencies,
      averageDuration,
      satisfactionRate,
      preferredModes
    }
  }

  private getNextDevelopmentalMilestone(age: number): DevelopmentalMilestone | undefined {
    const milestones: DevelopmentalMilestone[] = [
      { 
        age: 3, 
        domain: 'independence',
        milestone: '独立性发展', 
        description: '自己穿衣、吃饭等自理能力', 
        indicators: ['自己穿脱简单衣物', '独立使用勺子', '表达基本需求'],
        activities: ['提供练习机会', '培养自信心']
      },
      { 
        age: 4, 
        domain: 'social',
        milestone: '社交技能发展', 
        description: '与同伴合作、分享玩具', 
        indicators: ['愿意与同伴玩耍', '分享玩具', '轮流等待'],
        activities: ['创造社交机会', '示范分享行为']
      },
      { 
        age: 5, 
        domain: 'academic',
        milestone: '学前准备', 
        description: '基础学习能力和注意力', 
        indicators: ['专注10-15分钟', '识别基本形状和颜色', '理解简单指令'],
        activities: ['培养学习习惯', '提升注意力']
      }
    ]

    return milestones.find(m => age <= m.age && age > m.age - 1)
  }

  private analyzeLearningPatterns(behaviors: UserBehavior[]): LearningPatternAnalysis {
    const topics = behaviors
      .filter(b => b.type === 'query')
      .map(b => b.content)
    
    const topicCounts = topics.reduce((acc, topic) => {
      acc[topic] = (acc[topic] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const preferredTopics = Object.entries(topicCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([topic]) => topic)
    
    const averageDuration = behaviors.reduce((sum, b) => sum + (b.duration || 0), 0) / behaviors.length
    const learningSpeed = averageDuration < 5 ? 'fast' : averageDuration < 10 ? 'medium' : 'slow'
    const satisfactionRate = behaviors.filter(b => b.satisfaction && b.satisfaction > 3).length / behaviors.length
    const engagementLevel = satisfactionRate > 0.8 ? 'high' : satisfactionRate > 0.5 ? 'medium' : 'low'

    return {
      preferredTopics,
      learningSpeed,
      retentionRate: satisfactionRate,
      engagementLevel,
      optimalTime: 'afternoon'
    }
  }

  private identifyBehaviorPatterns(behaviors: UserBehavior[]): BehaviorPatternRecognition {
    const patterns = behaviors.map(b => b.type)
    const frequencies = patterns.reduce((acc, type) => {
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const sortedPatterns = Object.entries(frequencies)
      .sort(([, a], [, b]) => b - a)
      .map(([pattern]) => pattern)
    
    const triggers = behaviors
      .filter(b => b.context?.metadata?.trigger)
      .map(b => b.context?.metadata?.trigger as string)
    
    const recentFrequency = behaviors.slice(-10).length
    const olderFrequency = behaviors.slice(-20, -10).length
    const trends = recentFrequency > olderFrequency ? 'increasing' : recentFrequency < olderFrequency ? 'decreasing' : 'stable'
    
    const predictions = sortedPatterns.slice(0, 3).map(pattern => `继续${pattern}活动`)

    return {
      patterns: sortedPatterns,
      triggers,
      frequencies,
      trends,
      predictions
    }
  }

  private analyzeGrowthTrends(profile: PersonalizedProfile, behaviors: UserBehavior[]): GrowthTrendAnalysis {
    const domainProgress: Record<string, number> = {
      cognitive: 0.75,
      social: 0.68,
      emotional: 0.82,
      physical: 0.70,
      language: 0.78
    }
    
    const overallProgress = Object.values(domainProgress).reduce((sum, val) => sum + val, 0) / Object.keys(domainProgress).length
    
    const accelerationAreas = Object.entries(domainProgress)
      .filter(([, progress]) => progress > 0.75)
      .map(([domain]) => domain)
    
    const areasForImprovement = Object.entries(domainProgress)
      .filter(([, progress]) => progress < 0.7)
      .map(([domain]) => domain)
    
    const projectedGrowth = overallProgress + 0.1

    return {
      overallProgress,
      domainProgress,
      accelerationAreas,
      areasForImprovement,
      projectedGrowth,
      timeframe: '3个月'
    }
  }

  private rankRecommendations(recommendations: RecommendationItem[], profile: PersonalizedProfile, context?: RecommendationContext): RecommendationItem[] {
    return recommendations.sort((a, b) => {
      // 基于优先级和置信度排序
      const priorityWeight = { high: 3, medium: 2, low: 1 }
      const aScore = priorityWeight[a.priority] * a.confidence
      const bScore = priorityWeight[b.priority] * b.confidence

      return bScore - aScore
    })
  }

  private filterRecommendations(recommendations: RecommendationItem[], profile: PersonalizedProfile): RecommendationItem[] {
    // 过滤掉不适合当前年龄的推荐
    return recommendations.filter(rec => {
      if (rec.metadata.ageRange) {
        return this.isAgeInRange(profile.childAge, rec.metadata.ageRange)
      }
      return true
    })
  }

  private getDefaultRecommendations(): RecommendationItem[] {
    return [
      {
        id: 'default-welcome',
        type: 'content',
        title: '欢迎体验AI成长助手',
        description: '让我们先了解您的孩子，为您提供个性化的建议',
        category: 'learning',
        priority: 'high',
        confidence: 1.0,
        reasoning: '初次使用，建议先完善用户信息',
        metadata: {
          estimatedDuration: '5-10分钟',
          difficulty: 'easy',
          tags: ['欢迎', '设置', '个性化'],
          resources: []
        },
        actionable: true,
        callToAction: '开始设置'
      }
    ]
  }

  private updateRecommendations(userId: string) {
    // 可以在这里实现实时更新推荐逻辑
    setTimeout(() => {
      this.generateRecommendations(userId)
    }, 1000)
  }

  /**
   * 获取推荐历史
   */
  public getRecommendationHistory(userId: string): RecommendationItem[] {
    return this.recommendations.get(userId) || []
  }

  /**
   * 获取预测结果
   */
  public getPredictions(userId: string): PredictionResult[] {
    return this.predictions.get(userId) || []
  }

  /**
   * 反馈推荐效果
   */
  public provideRecommendationFeedback(userId: string, recommendationId: string, feedback: {
    rating: number
    helpful: boolean
    comments?: string
  }): void {
    console.log(`[RecommendationSystem] 用户 ${userId} 对推荐 ${recommendationId} 的反馈:`, feedback)
    // 这里可以实现机器学习算法来改进推荐质量
  }

  /**
   * 清理用户数据
   */
  public clearUserData(userId: string): void {
    this.userProfiles.delete(userId)
    this.userBehaviors.delete(userId)
    this.recommendations.delete(userId)
    this.predictions.delete(userId)
  }

  /**
   * 获取推荐统计
   */
  public getRecommendationStats(userId: string): RecommendationStats {
    const recommendations = this.recommendations.get(userId) || []
    const behaviors = this.userBehaviors.get(userId) || []

    const topCategories = [
      { category: 'learning', count: recommendations.filter(r => r.category === 'learning').length, satisfaction: 0.85 },
      { category: 'development', count: recommendations.filter(r => r.category === 'development').length, satisfaction: 0.78 },
      { category: 'health', count: recommendations.filter(r => r.category === 'health').length, satisfaction: 0.82 },
      { category: 'social', count: recommendations.filter(r => r.category === 'social').length, satisfaction: 0.76 },
      { category: 'entertainment', count: recommendations.filter(r => r.category === 'entertainment').length, satisfaction: 0.90 }
    ].sort((a, b) => b.count - a.count).slice(0, 3)

    const recentActivity = behaviors.slice(-5).map(b => ({
      timestamp: b.timestamp,
      action: b.type,
      outcome: b.outcome || 'unknown'
    }))

    return {
      totalRecommendations: recommendations.length,
      acceptedRecommendations: Math.floor(recommendations.length * 0.7),
      rejectedRecommendations: Math.floor(recommendations.length * 0.15),
      averageConfidence: recommendations.reduce((sum, r) => sum + r.confidence, 0) / recommendations.length || 0,
      topCategories,
      recentActivity
    }
  }
}

// 导出单例实例
export const intelligentRecommendationSystem = new IntelligentRecommendationSystem()