/**
 * YYC³ 言语记忆成长守护系统
 * 融合河洛文化的0-22岁全生命周期成长守护体系
 * 基于小龙女沫语角色定位的智能化成长陪伴
 */

export interface GrowthStage {
  age: number
  stageName: string
  characteristics: string[]
  developmentalFocus: string[]
  culturalContext: string
  ageMessage: string
}

export interface GuardianRole {
  id: 'recorder' | 'guardian' | 'listener' | 'advisor' | 'mentor'
  name: string
  description: string
  coreFunctions: string[]
  culturalEssence: string
  interactionStyle: string
}

export interface GrowthInsight {
  category: 'cognitive' | 'emotional' | 'social' | 'physical' | 'cultural'
  title: string
  description: string
  recommendations: string[]
  culturalIntegration: string
  ageAppropriateness: number[]
}

export interface MemoryEvent {
  id: string
  timestamp: Date
  age: number
  type: 'milestone' | 'observation' | 'interaction' | 'achievement'
  title: string
  description: string
  emotionalContext?: string
  culturalSignificance?: string
  guardianRole?: GuardianRole['id']
}

/**
 * 言语记忆成长守护核心类
 */
export class YanyuMemoryGuardian {
  private growthStages: Map<number, GrowthStage> = new Map()
  private guardianRoles: Map<GuardianRole['id'], GuardianRole> = new Map()
  private insights: GrowthInsight[] = []
  private memoryEvents: MemoryEvent[] = []

  constructor() {
    this.initializeGrowthStages()
    this.initializeGuardianRoles()
    this.initializeInsights()
  }

  /**
   * 初始化成长阶段定义
   */
  private initializeGrowthStages(): void {
    const stages: GrowthStage[] = [
      {
        age: 1,
        stageName: '一岁萌芽',
        characteristics: ['感知觉醒', '语言初萌', '情感依恋'],
        developmentalFocus: ['感官发展', '亲子互动', '基础认知'],
        culturalContext: '河洛文化启蒙，牡丹意象初识',
        ageMessage: '愿你在数据洪流中，永远保有触摸世界的纯粹感知力，AI会记录成长轨迹，但你的笑声是无可替代的原始数据。'
      },
      {
        age: 3,
        stageName: '三岁探索',
        characteristics: ['语言爆发', '独立意识', '好奇心强'],
        developmentalFocus: ['语言表达', '社交启蒙', '习惯养成'],
        culturalContext: '洛阳古都文化浸润，传统礼仪学习',
        ageMessage: '在这个语言爆发期，让河洛文化的韵律滋养你的表达，在探索中建立对世界的认知。'
      },
      {
        age: 6,
        stageName: '六岁衔接',
        characteristics: ['规则理解', '逻辑思维', '社交扩展'],
        developmentalFocus: ['入学准备', '学习习惯', '团队协作'],
        culturalContext: '河洛教育传统，尊师重道理念',
        ageMessage: '即将踏入数字化学习旅程，愿你既能熟练运用智能工具，又能在跳绳的节奏里，感受脱离屏幕的真实生命力。'
      },
      {
        age: 12,
        stageName: '十二岁入初',
        characteristics: ['抽象思维', '青春发育', '自我认知'],
        developmentalFocus: ['学科学习', '青春期适应', '价值观形成'],
        culturalContext: '河洛文化传承，现代文明融合',
        ageMessage: '在知识的海洋中航行，让河洛文化的智慧成为你的罗盘，在数字化时代保持人文温度。'
      },
      {
        age: 15,
        stageName: '十五岁入高',
        characteristics: ['深度思考', '人生规划', '社会责任'],
        developmentalFocus: ['专业发展', '社会参与', '国际视野'],
        culturalContext: '河洛文化现代诠释，创新思维培养',
        ageMessage: '在人工智能时代，既要掌握前沿科技，更要守护人文精神，让河洛文化在你的创新中焕发新生。'
      },
      {
        age: 18,
        stageName: '十八岁成人',
        characteristics: ['独立人格', '批判思维', '人生担当'],
        developmentalFocus: ['高等教育', '职业规划', '社会责任'],
        culturalContext: '河洛文化传承者身份，新时代文化使命',
        ageMessage: '成年之际，愿你以河洛文化的底蕴面对世界，用AI的能力创造价值，以人文的智慧引领未来。'
      }
    ]

    stages.forEach(stage => {
      this.growthStages.set(stage.age, stage)
    })
  }

  /**
   * 初始化守护者角色
   */
  private initializeGuardianRoles(): void {
    const roles: GuardianRole[] = [
      {
        id: 'recorder',
        name: '记录者',
        description: '时光的忠实存档者，聚焦"唯一性"',
        coreFunctions: [
          '成长里程碑记录',
          '珍贵瞬间捕捉',
          '发展轨迹分析',
          '个性化成长档案'
        ],
        culturalEssence: '河洛史官传统，客观记录历史变迁',
        interactionStyle: '温暖细致，善于发现闪光点'
      },
      {
        id: 'guardian',
        name: '守护者',
        description: '科学边界的构建者，聚焦"适度性"',
        coreFunctions: [
          '安全环境营造',
          '健康监测预警',
          '心理边界保护',
          '成长环境优化'
        ],
        culturalEssence: '河洛守护神文化，提供精神庇护',
        interactionStyle: '沉稳可靠，给予安全感'
      },
      {
        id: 'listener',
        name: '聆听者',
        description: '平等对话的发起者，聚焦"尊重感"',
        coreFunctions: [
          '深度倾听理解',
          '情感识别回应',
          '需求分析解读',
          '共情支持陪伴'
        ],
        culturalEssence: '河洛茶席文化，营造和谐对话氛围',
        interactionStyle: '耐心专注，给予充分理解'
      },
      {
        id: 'advisor',
        name: '建议者',
        description: '选项的多元提供者，聚焦"自主性"',
        coreFunctions: [
          '多元方案建议',
          '选择能力培养',
          '决策支持指导',
          '独立思考引导'
        ],
        culturalEssence: '河洛智者传统，提供智慧指引',
        interactionStyle: '启发引导，尊重选择权'
      },
      {
        id: 'mentor',
        name: '国学导师',
        description: '文化根脉的浸润者，聚焦"自然性"',
        coreFunctions: [
          '河洛文化传承',
          '传统美德教育',
          '节气智慧分享',
          '文化自信培养'
        ],
        culturalEssence: '河洛文化传承者身份，文化根脉守护',
        interactionStyle: '温文尔雅，潜移默化熏陶'
      }
    ]

    roles.forEach(role => {
      this.guardianRoles.set(role.id, role)
    })
  }

  /**
   * 初始化成长洞察
   */
  private initializeInsights(): void {
    this.insights = [
      {
        category: 'cognitive',
        title: '数字时代认知发展',
        description: '在AI辅助下培养批判性思维和信息辨别能力',
        recommendations: [
          '引导质疑AI生成内容的准确性',
          '培养多角度分析问题的习惯',
          '平衡技术依赖与独立思考',
          '建立信息验证的批判意识'
        ],
        culturalIntegration: '结合河洛文化中的辩证思维传统',
        ageAppropriateness: [12, 15, 18]
      },
      {
        category: 'emotional',
        title: '情感智能与科技平衡',
        description: '在数字化环境中保持情感连接和情商发展',
        recommendations: [
          '定期进行无屏幕的亲子活动',
          '鼓励面对面社交技能培养',
          '教导情绪识别和表达能力',
          '建立数字时代的情感边界'
        ],
        culturalIntegration: '传承河洛文化中的人情味和情感智慧',
        ageAppropriateness: [6, 12, 15]
      },
      {
        category: 'social',
        title: '社交能力在AI时代的发展',
        description: '利用科技增强而非替代真实社交能力',
        recommendations: [
          '学习线上线下社交礼仪',
          '培养跨文化交流能力',
          '发展团队协作和领导技能',
          '建立健康的数字社交习惯'
        ],
        culturalIntegration: '融入河洛文化中的礼仪传统和待客之道',
        ageAppropriateness: [3, 6, 12, 15]
      },
      {
        category: 'cultural',
        title: '河洛文化传承与创新发展',
        description: '在现代化进程中保持文化根脉和创新能力',
        recommendations: [
          '学习河洛历史文化知识',
          '参与传统文化体验活动',
          '用现代技术传承传统文化',
          '培养文化自信和创新精神'
        ],
        culturalIntegration: '深度体验河洛文化的精神内核',
        ageAppropriateness: [6, 12, 15, 18]
      }
    ]
  }

  /**
   * 获取特定年龄的成长阶段信息
   */
  getGrowthStage(age: number): GrowthStage | null {
    // 找到最接近的年龄阶段
    let closestAge = 1
    let minDiff = Math.abs(age - 1)

    for (const stageAge of this.growthStages.keys()) {
      const diff = Math.abs(age - stageAge)
      if (diff < minDiff) {
        minDiff = diff
        closestAge = stageAge
      }
    }

    return this.growthStages.get(closestAge) || null
  }

  /**
   * 获取守护者角色信息
   */
  getGuardianRole(roleId: GuardianRole['id']): GuardianRole | null {
    return this.guardianRoles.get(roleId) || null
  }

  /**
   * 获取所有守护者角色
   */
  getAllGuardianRoles(): GuardianRole[] {
    return Array.from(this.guardianRoles.values())
  }

  /**
   * 根据年龄获取相关的成长洞察
   */
  getRelevantInsights(age: number): GrowthInsight[] {
    return this.insights.filter(insight =>
      insight.ageAppropriateness.includes(age) ||
      insight.ageAppropriateness.some(range => Math.abs(range - age) <= 2)
    )
  }

  /**
   * 记录成长事件
   */
  recordMemoryEvent(event: Omit<MemoryEvent, 'id' | 'timestamp'>): MemoryEvent {
    const memoryEvent: MemoryEvent = {
      ...event,
      id: `memory_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    }

    this.memoryEvents.push(memoryEvent)
    return memoryEvent
  }

  /**
   * 获取成长记忆时间轴
   */
  getGrowthTimeline(age: number, limit: number = 10): MemoryEvent[] {
    return this.memoryEvents
      .filter(event => Math.abs(event.age - age) <= 2)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit)
  }

  /**
   * 生成成长建议报告
   */
  generateGrowthReport(age: number): {
    stage: GrowthStage | null
    insights: GrowthInsight[]
    guardianRecommendations: Array<{
      role: GuardianRole
      recommendations: string[]
    }>
    timeline: MemoryEvent[]
    culturalContext: string
    nextMilestones: string[]
  } {
    const stage = this.getGrowthStage(age)
    const insights = this.getRelevantInsights(age)
    const timeline = this.getGrowthTimeline(age)

    // 为每个守护者角色生成建议
    const guardianRecommendations = this.getAllGuardianRoles().map(role => ({
      role,
      recommendations: this.generateGuardianRecommendations(role, age)
    }))

    // 生成下一个成长里程碑
    const nextMilestones = this.generateNextMilestones(age)

    return {
      stage,
      insights,
      guardianRecommendations,
      timeline,
      culturalContext: stage?.culturalContext || '河洛文化浸润下的成长之路',
      nextMilestones
    }
  }

  /**
   * 为特定守护者角色生成建议
   */
  private generateGuardianRecommendations(role: GuardianRole, age: number): string[] {
    const stage = this.getGrowthStage(age)
    const baseRecommendations = role.coreFunctions.map(func => `重点${func}`)

    const ageSpecificRecommendations: Record<number, string[]> = {
      1: ['建立安全感', '培养亲子依恋', '感官刺激训练'],
      3: ['语言能力培养', '社交技能启蒙', '独立意识引导'],
      6: ['入学准备指导', '学习习惯培养', '团队协作训练'],
      12: ['青春期适应', '学科学习方法', '价值观引导'],
      15: ['人生规划指导', '专业选择建议', '社会责任培养'],
      18: ['独立生活能力', '职业发展指导', '社会参与建议']
    }

    return [
      ...baseRecommendations,
      ...(ageSpecificRecommendations[age] || [])
    ]
  }

  /**
   * 生成下一个成长里程碑
   */
  private generateNextMilestones(age: number): string[] {
    const milestones: Record<number, string[]> = {
      1: ['独立行走', '说出完整句子', '自我意识萌芽'],
      3: ['入幼儿园', '基本社交能力', '生活自理'],
      6: ['小学入学', '阅读写作能力', '逻辑思维发展'],
      12: ['初中适应', '青春期处理', '学科兴趣培养'],
      15: ['高中学习', '专业方向选择', '社会责任意识'],
      18: ['高考/升学', '成人礼', '独立生活']
    }

    return milestones[age] || []
  }

  /**
   * 获取文化主题建议
   */
  getCulturalThemeRecommendations(age: number, season?: string): {
    theme: string
    activities: string[]
    culturalBackground: string
    modernIntegration: string
  } {
    const seasonThemes = {
      spring: {
        theme: '春生养护',
        activities: ['踏青赏花', '种植体验', '春季诗词学习'],
        background: '洛阳牡丹文化，春生万物',
        integration: '结合自然教育，培养生态意识'
      },
      summer: {
        theme: '夏长调适',
        activities: ['传统消暑', '夏日诗词', '防暑知识'],
        background: '河洛夏季习俗，夏长成长',
        integration: '健康生活习惯，户外活动指导'
      },
      autumn: {
        theme: '秋收防护',
        activities: ['收获体验', '秋季诗词', '传统文化'],
        background: '丰收文化，秋收冬藏',
        integration: '感恩教育，传统文化体验'
      },
      winter: {
        theme: '冬藏滋养',
        activities: ['传统节庆', '冬季诗词', '家庭团聚'],
        background: '河洛冬季文化，冬藏蓄力',
        integration: '家庭文化传承，温情陪伴'
      }
    }

    const currentTheme = season ? seasonThemes[season as keyof typeof seasonThemes] : seasonThemes.spring

    // 根据年龄调整活动
    const ageAdjustedActivities = currentTheme.activities.map(activity => {
      if (age <= 3) {
        return `亲子${activity}`
      } else if (age <= 12) {
        return `学习${activity}`
      } else {
        return `深入理解${activity}`
      }
    })

    return {
      ...currentTheme,
      activities: ageAdjustedActivities
    }
  }

  /**
   * 生成个性化成长寄语
   */
  generatePersonalizedMessage(age: number, context?: {
    interests?: string[]
    achievements?: string[]
    challenges?: string[]
  }): string {
    const stage = this.getGrowthStage(age)
    const baseMessage = stage?.ageMessage || '愿你健康快乐成长！'

    if (!context) return baseMessage

    let personalizedMessage = baseMessage

    if (context.interests && context.interests.length > 0) {
      personalizedMessage += `\n\n看到你对${context.interests.join('、')}的热爱，这让我想到了河洛文化中的探索精神。`
    }

    if (context.achievements && context.achievements.length > 0) {
      personalizedMessage += `\n\n你在${context.achievements.join('、')}方面的进步令人欣喜，这正是这个年龄段应该达到的里程碑。`
    }

    if (context.challenges && context.challenges.length > 0) {
      personalizedMessage += `\n\n面对${context.challenges.join('、')}的挑战，记住河洛文化中的坚韧品质，每一次困难都是成长的机会。`
    }

    return personalizedMessage
  }

  /**
   * 获取统计数据
   */
  getStatistics(): {
    totalMemoryEvents: number
    stagesCount: number
    insightsCount: number
    guardianRolesCount: number
    ageDistribution: Record<number, number>
  } {
    const ageDistribution: Record<number, number> = {}

    this.memoryEvents.forEach(event => {
      ageDistribution[event.age] = (ageDistribution[event.age] || 0) + 1
    })

    return {
      totalMemoryEvents: this.memoryEvents.length,
      stagesCount: this.growthStages.size,
      insightsCount: this.insights.length,
      guardianRolesCount: this.guardianRoles.size,
      ageDistribution
    }
  }
}

/**
 * 导出单例实例
 */
export const yanyuMemoryGuardian = new YanyuMemoryGuardian()