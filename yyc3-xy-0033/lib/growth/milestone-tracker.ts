/**
 * YYC³ AI小语智能成长守护系统 - 成长里程碑追踪系统
 * 专注0-3岁婴幼儿发展里程碑记录与分析
 */

export interface Milestone {
  id: string
  title: string
  description: string
  category: MilestoneCategory
  ageRange: AgeRange
  importance: 'critical' | 'important' | 'normal'
  indicators: MilestoneIndicator[]
  achievements: Achievement[]
}

export enum MilestoneCategory {
  COGNITIVE = 'cognitive',         // 认知发展
  LANGUAGE = 'language',           // 语言发展
  MOTOR = 'motor',                // 运动发展
  SOCIAL = 'social',              // 社交发展
  EMOTIONAL = 'emotional',         // 情感发展
  SELF_CARE = 'self-care'         // 自理能力
}

export interface AgeRange {
  minMonths: number
  maxMonths: number
  typicalAge: number
}

export interface MilestoneIndicator {
  description: string
  isObservable: boolean
  assessmentMethod: 'parent-observation' | 'interactive-test' | 'expert-evaluation'
  criteria: string[]
}

export interface Achievement {
  childId: string
  milestoneId: string
  achievedDate: string
  evidence: EvidenceData[]
  assessment: AssessmentResult
  notes: string
  isEarly: boolean
  isDelayed: boolean
}

export interface EvidenceData {
  type: 'photo' | 'video' | 'audio' | 'note'
  url?: string
  data?: string
  timestamp: string
  description: string
}

export interface AssessmentResult {
  score: number          // 0-100
  confidence: number     // 0-1
  evaluator: 'parent' | 'ai' | 'expert'
  feedback: string[]
  recommendations: string[]
}

export interface GrowthAssessment {
  childId: string
  assessmentDate: string
  ageInMonths: number
  domainScores: DomainScores
  overallDevelopment: DevelopmentLevel
  strengths: string[]
  areasForGrowth: string[]
  recommendations: Recommendation[]
  nextMilestones: string[]
}

export interface DomainScores {
  cognitive: number      // 认知发展得分
  language: number       // 语言发展得分
  motor: number          // 运动发展得分
  social: number         // 社交发展得分
  emotional: number      // 情感发展得分
  selfCare: number       // 自理能力得分
}

export enum DevelopmentLevel {
  ADVANCED = 'advanced',     // 提前发展
  ON_TRACK = 'on-track',    // 正常发展
  MILD_DELAY = 'mild-delay', // 轻微延迟
  MODERATE_DELAY = 'moderate-delay', // 中度延迟
  SIGNIFICANT_DELAY = 'significant-delay' // 显著延迟
}

export interface Recommendation {
  category: 'activity' | 'exercise' | 'observation' | 'consultation'
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  timeframe: string
  resources: Resource[]
}

export interface Resource {
  type: 'video' | 'article' | 'game' | 'exercise'
  title: string
  url?: string
  description: string
  ageRange: string
}

/**
 * 成长里程碑追踪器主类
 */
export class MilestoneTracker {
  private milestones: Map<string, Milestone> = new Map()
  private achievements: Map<string, Achievement[]> = new Map()
  private assessments: Map<string, GrowthAssessment[]> = new Map()

  constructor() {
    this.initializeMilestones()
  }

  /**
   * 初始化0-3岁发展里程碑
   */
  private initializeMilestones(): void {
    // 0-3个月里程碑
    this.addMilestone({
      id: 'social-smile-0-3',
      title: '社交性微笑',
      description: '对人脸微笑，对熟悉声音有反应',
      category: MilestoneCategory.SOCIAL,
      ageRange: { minMonths: 0, maxMonths: 3, typicalAge: 1.5 },
      importance: 'critical',
      indicators: [
        {
          description: '看到人脸时微笑',
          isObservable: true,
          assessmentMethod: 'parent-observation',
          criteria: ['微笑时眼睛明亮', '对特定人微笑更频繁']
        },
        {
          description: '对熟悉声音反应',
          isObservable: true,
          assessmentMethod: 'parent-observation',
          criteria: ['听到声音时转头', '安静下来倾听']
        }
      ],
      achievements: []
    })

    // 3-6个月里程碑
    this.addMilestone({
      id: 'motor-head-control-3-6',
      title: '头部控制',
      description: '能够稳定抬头，转头追踪物体',
      category: MilestoneCategory.MOTOR,
      ageRange: { minMonths: 3, maxMonths: 6, typicalAge: 4 },
      importance: 'critical',
      indicators: [
        {
          description: '俯卧时抬头',
          isObservable: true,
          assessmentMethod: 'parent-observation',
          criteria: ['抬头能保持30秒以上', '手臂支撑身体']
        },
        {
          description: '转头追踪物体',
          isObservable: true,
          assessmentMethod: 'interactive-test',
          criteria: ['左右转动180度', '追踪移动物体']
        }
      ],
      achievements: []
    })

    // 6-9个月里程碑
    this.addMilestone({
      id: 'cognitive-object-permanence-6-9',
      title: '客体永久性',
      description: '理解物体即使看不见也仍然存在',
      category: MilestoneCategory.COGNITIVE,
      ageRange: { minMonths: 6, maxMonths: 9, typicalAge: 7.5 },
      importance: 'important',
      indicators: [
        {
          description: '寻找被藏起来的玩具',
          isObservable: true,
          assessmentMethod: 'interactive-test',
          criteria: ['主动寻找被遮盖的物体', '有目的的搜索行为']
        }
      ],
      achievements: []
    })

    // 9-12个月里程碑
    this.addMilestone({
      id: 'language-first-words-9-12',
      title: '说出第一个词',
      description: '开始说出有意义的词语',
      category: MilestoneCategory.LANGUAGE,
      ageRange: { minMonths: 9, maxMonths: 12, typicalAge: 10.5 },
      importance: 'critical',
      indicators: [
        {
          description: '说"妈妈"或"爸爸"',
          isObservable: true,
          assessmentMethod: 'parent-observation',
          criteria: ['有意识地称呼', '指向对应的人']
        },
        {
          description: '理解简单指令',
          isObservable: true,
          assessmentMethod: 'interactive-test',
          criteria: ['能执行1步指令', '理解"不"的含义']
        }
      ],
      achievements: []
    })

    // 12-18个月里程碑
    this.addMilestone({
      id: 'motor-walking-12-18',
      title: '独立行走',
      description: '能够独立走路，不依赖支撑',
      category: MilestoneCategory.MOTOR,
      ageRange: { minMonths: 12, maxMonths: 18, typicalAge: 15 },
      importance: 'critical',
      indicators: [
        {
          description: '独立走几步',
          isObservable: true,
          assessmentMethod: 'parent-observation',
          criteria: ['能连续走3步以上', '步伐稳定']
        }
      ],
      achievements: []
    })

    // 18-24个月里程碑
    this.addMilestone({
      id: 'language-simple-sentences-18-24',
      title: '简单句子',
      description: '开始使用2-3个词的简单句子',
      category: MilestoneCategory.LANGUAGE,
      ageRange: { minMonths: 18, maxMonths: 24, typicalAge: 21 },
      importance: 'important',
      indicators: [
        {
          description: '说"我要抱"等短语',
          isObservable: true,
          assessmentMethod: 'parent-observation',
          criteria: ['组合2个以上词语', '表达基本需求']
        }
      ],
      achievements: []
    })

    // 24-36个月里程碑
    this.addMilestone({
      id: 'social-sharing-24-36',
      title: '分享与合作',
      description: '开始分享玩具，参与简单的合作游戏',
      category: MilestoneCategory.SOCIAL,
      ageRange: { minMonths: 24, maxMonths: 36, typicalAge: 30 },
      importance: 'important',
      indicators: [
        {
          description: '主动分享玩具',
          isObservable: true,
          assessmentMethod: 'parent-observation',
          criteria: ['主动给他人玩具', '享受分享过程']
        }
      ],
      achievements: []
    })
  }

  /**
   * 添加里程碑
   */
  private addMilestone(milestone: Milestone): void {
    this.milestones.set(milestone.id, milestone)
  }

  /**
   * 获取适龄里程碑
   */
  getAgeAppropriateMilestones(ageInMonths: number): Milestone[] {
    const ageAppropriate: Milestone[] = []

    for (const milestone of this.milestones.values()) {
      if (ageInMonths >= milestone.ageRange.minMonths - 2 &&
          ageInMonths <= milestone.ageRange.maxMonths + 2) {
        ageAppropriate.push(milestone)
      }
    }

    return ageAppropriate.sort((a, b) => a.ageRange.typicalAge - b.ageRange.typicalAge)
  }

  /**
   * 记录里程碑达成
   */
  recordAchievement(achievement: Achievement): void {
    const childAchievements = this.achievements.get(achievement.childId) || []

    // 检查是否已经记录过
    const existingIndex = childAchievements.findIndex(
      a => a.milestoneId === achievement.milestoneId
    )

    if (existingIndex >= 0) {
      // 更新现有记录
      childAchievements[existingIndex] = achievement
    } else {
      // 添加新记录
      childAchievements.push(achievement)
    }

    this.achievements.set(achievement.childId, childAchievements)
  }

  /**
   * 获取儿童的成长记录
   */
  getChildAchievements(childId: string): Achievement[] {
    return this.achievements.get(childId) || []
  }

  /**
   * 生成成长评估报告
   */
  generateGrowthAssessment(childId: string, ageInMonths: number): GrowthAssessment {
    const achievements = this.getChildAchievements(childId)
    const ageAppropriateMilestones = this.getAgeAppropriateMilestones(ageInMonths)

    // 计算各领域得分
    const domainScores = this.calculateDomainScores(achievements, ageInMonths)

    // 评估整体发展水平
    const overallDevelopment = this.assessOverallDevelopment(domainScores, ageInMonths)

    // 识别优势和需要发展的领域
    const { strengths, areasForGrowth } = this.identifyStrengthsAndGrowthAreas(domainScores)

    // 生成个性化建议
    const recommendations = this.generateRecommendations(domainScores, ageInMonths)

    // 确定下一个阶段的里程碑
    const nextMilestones = this.getNextMilestones(achievements, ageInMonths)

    return {
      childId,
      assessmentDate: new Date().toISOString(),
      ageInMonths,
      domainScores,
      overallDevelopment,
      strengths,
      areasForGrowth,
      recommendations,
      nextMilestones
    }
  }

  /**
   * 计算各领域得分
   */
  private calculateDomainScores(achievements: Achievement[], ageInMonths: number): DomainScores {
    const categories = [
      MilestoneCategory.COGNITIVE,
      MilestoneCategory.LANGUAGE,
      MilestoneCategory.MOTOR,
      MilestoneCategory.SOCIAL,
      MilestoneCategory.EMOTIONAL,
      MilestoneCategory.SELF_CARE
    ]

    const scores: DomainScores = {
      cognitive: 0,
      language: 0,
      motor: 0,
      social: 0,
      emotional: 0,
      selfCare: 0
    }

    categories.forEach(category => {
      const categoryMilestones = Array.from(this.milestones.values())
        .filter(m => m.category === category)
        .filter(m => ageInMonths >= m.ageRange.minMonths - 1)

      const categoryAchievements = achievements.filter(a => {
        const milestone = this.milestones.get(a.milestoneId)
        return milestone && milestone.category === category
      })

      if (categoryMilestones.length > 0) {
        const score = (categoryAchievements.length / categoryMilestones.length) * 100
        scores[category as keyof DomainScores] = Math.min(100, score)
      }
    })

    return scores
  }

  /**
   * 评估整体发展水平
   */
  private assessOverallDevelopment(scores: DomainScores, ageInMonths: number): DevelopmentLevel {
    const averageScore = Object.values(scores).reduce((sum, score) => sum + score, 0) / 6

    if (averageScore >= 85) return DevelopmentLevel.ADVANCED
    if (averageScore >= 70) return DevelopmentLevel.ON_TRACK
    if (averageScore >= 55) return DevelopmentLevel.MILD_DELAY
    if (averageScore >= 40) return DevelopmentLevel.MODERATE_DELAY
    return DevelopmentLevel.SIGNIFICANT_DELAY
  }

  /**
   * 识别优势和需要发展的领域
   */
  private identifyStrengthsAndGrowthAreas(scores: DomainScores): {
    strengths: string[]
    areasForGrowth: string[]
  } {
    const strengths: string[] = []
    const areasForGrowth: string[] = []

    const categoryNames = {
      cognitive: '认知发展',
      language: '语言发展',
      motor: '运动发展',
      social: '社交发展',
      emotional: '情感发展',
      selfCare: '自理能力'
    }

    Object.entries(scores).forEach(([category, score]) => {
      const categoryName = categoryNames[category as keyof typeof categoryNames]
      if (score >= 80) {
        strengths.push(categoryName)
      } else if (score < 60) {
        areasForGrowth.push(categoryName)
      }
    })

    return { strengths, areasForGrowth }
  }

  /**
   * 生成个性化建议
   */
  private generateRecommendations(scores: DomainScores, ageInMonths: number): Recommendation[] {
    const recommendations: Recommendation[] = []

    // 根据年龄和得分生成建议
    if (scores.language < 60) {
      recommendations.push({
        category: 'activity',
        title: '加强语言互动',
        description: '多与孩子对话，阅读绘本，唱儿歌',
        priority: 'high',
        timeframe: '每日',
        resources: [
          {
            type: 'article',
            title: '0-3岁语言发展指南',
            description: '专业的语言发展指导',
            ageRange: '0-3岁'
          }
        ]
      })
    }

    if (scores.motor < 60) {
      recommendations.push({
        category: 'exercise',
        title: '运动技能训练',
        description: '进行适合年龄的大运动和精细运动练习',
        priority: 'medium',
        timeframe: '每日',
        resources: [
          {
            type: 'game',
            title: '宝宝运动游戏',
            description: '有趣的运动技能训练游戏',
            ageRange: '0-3岁'
          }
        ]
      })
    }

    if (scores.social < 60) {
      recommendations.push({
        category: 'activity',
        title: '社交技能培养',
        description: '创造社交机会，教孩子基本社交规则',
        priority: 'medium',
        timeframe: '每周',
        resources: [
          {
            type: 'article',
            title: '婴幼儿社交发展',
            description: '社交技能培养方法',
            ageRange: '0-3岁'
          }
        ]
      })
    }

    return recommendations
  }

  /**
   * 获取下一个阶段的里程碑
   */
  private getNextMilestones(achievements: Achievement[], ageInMonths: number): string[] {
    const achievedMilestoneIds = new Set(achievements.map(a => a.milestoneId))
    const upcomingMilestones = this.getAgeAppropriateMilestones(ageInMonths + 3)

    return upcomingMilestones
      .filter(m => !achievedMilestoneIds.has(m.id))
      .slice(0, 5)
      .map(m => m.id)
  }

  /**
   * 获取里程碑详情
   */
  getMilestone(milestoneId: string): Milestone | undefined {
    return this.milestones.get(milestoneId)
  }

  /**
   * 获取所有里程碑
   */
  getAllMilestones(): Milestone[] {
    return Array.from(this.milestones.values())
  }
}

// 导出单例实例
export const milestoneTracker = new MilestoneTracker()