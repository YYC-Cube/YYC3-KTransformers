"use client"

import { useState, useEffect, useCallback } from 'react'

/**
 * 成长里程碑定义
 */
export interface DevelopmentalMilestone {
  id: string
  category: 'physical' | 'cognitive' | 'emotional' | 'social' | 'language'
  ageRange: {
    min: number
    max: number
  }
  title: string
  description: string
  indicators: string[]
  assessmentCriteria: string[]
  resources: Array<{
    type: 'article' | 'video' | 'exercise' | 'activity'
    title: string
    url?: string
    description: string
  }>
}

/**
 * 成长评估结果
 */
export interface DevelopmentalAssessment {
  id: string
  childId: string
  age: number
  assessmentDate: Date
  categories: {
    physical: {
      score: number
      milestones: Array<{
        milestoneId: string
        achieved: boolean
        notes?: string
        evidence?: string[]
      }>
      recommendations: string[]
    }
    cognitive: {
      score: number
      milestones: Array<{
        milestoneId: string
        achieved: boolean
        notes?: string
        evidence?: string[]
      }>
      recommendations: string[]
    }
    emotional: {
      score: number
      milestones: Array<{
        milestoneId: string
        achieved: boolean
        notes?: string
        evidence?: string[]
      }>
      recommendations: string[]
    }
    social: {
      score: number
      milestones: Array<{
        milestoneId: string
        achieved: boolean
        notes?: string
        evidence?: string[]
      }>
      recommendations: string[]
    }
    language: {
      score: number
      milestones: Array<{
        milestoneId: string
        achieved: boolean
        notes?: string
        evidence?: string[]
      }>
      recommendations: string[]
    }
  }
  overallScore: number
  summary: string
  nextAssessmentDate: Date
  priority: 'low' | 'medium' | 'high'
}

/**
 * 成长预测洞察
 */
export interface GrowthInsight {
  id: string
  type: 'milestone' | 'concern' | 'opportunity' | 'recommendation'
  title: string
  description: string
  confidence: number
  timeframe: string
  actionable: boolean
  suggestedActions: string[]
  resources: Array<{
    type: 'article' | 'video' | 'exercise' | 'specialist'
    title: string
    description: string
  }>
  priority: 'low' | 'medium' | 'high'
}

/**
 * 智能成长守护系统
 */
export class IntelligentGrowthGuardian {
  private milestones: Map<string, DevelopmentalMilestone> = new Map()
  private assessments: Map<string, DevelopmentalAssessment> = new Map()
  private insights: Map<string, GrowthInsight> = new Map()
  private childProfiles: Map<string, any> = new Map()

  constructor() {
    this.initializeMilestones()
  }

  /**
   * 初始化发展里程碑数据
   */
  private initializeMilestones() {
    const defaultMilestones: DevelopmentalMilestone[] = [
      // 身体发展里程碑
      {
        id: 'gross-motor-2-3',
        category: 'physical',
        ageRange: { min: 2, max: 3 },
        title: '大肌肉发展',
        description: '能够跑步、跳跃和攀爬基础设施',
        indicators: [
          '能够独立跑步',
          '能够双脚跳跃',
          '能够上下楼梯',
          '能够踢球'
        ],
        assessmentCriteria: [
          '观察孩子在户外活动时的表现',
          '测试跑步的协调性',
          '评估跳跃和平衡能力'
        ],
        resources: [
          {
            type: 'activity',
            title: '户外运动游戏',
            description: '适合2-3岁儿童的户外活动建议'
          },
          {
            type: 'video',
            title: '大肌肉发展训练',
            description: '专业物理治疗师指导视频'
          }
        ]
      },
      // 认知发展里程碑
      {
        id: 'cognitive-3-4',
        category: 'cognitive',
        ageRange: { min: 3, max: 4 },
        title: '认知能力发展',
        description: '基本概念理解和问题解决能力',
        indicators: [
          '能够识别基本颜色',
          '能够数数到10',
          '能够完成简单拼图',
          '能够理解因果关系'
        ],
        assessmentCriteria: [
          '颜色识别测试',
          '计数能力评估',
          '拼图完成时间测试',
          '简单问题解决情境'
        ],
        resources: [
          {
            type: 'exercise',
            title: '认知训练游戏',
            description: '提升认知能力的互动游戏'
          },
          {
            type: 'article',
            title: '3-4岁认知发展特点',
            description: '专业发展心理学文章'
          }
        ]
      },
      // 情感发展里程碑
      {
        id: 'emotional-4-5',
        category: 'emotional',
        ageRange: { min: 4, max: 5 },
        title: '情感调节能力',
        description: '识别和表达情感，基本情绪调节',
        indicators: [
          '能够说出自己的感受',
          '能够安抚自己',
          '能够理解他人情感',
          '能够控制冲动'
        ],
        assessmentCriteria: [
          '情感词汇使用观察',
          '情绪调节行为评估',
          '共情能力测试',
          '冲动控制情境测试'
        ],
        resources: [
          {
            type: 'article',
            title: '情感教育指南',
            description: '培养孩子情感智力的方法'
          },
          {
            type: 'activity',
            title: '情感识别游戏',
            description: '帮助孩子认识情感的活动'
          }
        ]
      },
      // 社交发展里程碑
      {
        id: 'social-5-6',
        category: 'social',
        ageRange: { min: 5, max: 6 },
        title: '社交技能发展',
        description: '同伴交往和合作能力',
        indicators: [
          '能够分享玩具',
          '能够轮流等待',
          '能够解决简单冲突',
          '能够遵守游戏规则'
        ],
        assessmentCriteria: [
          '同伴互动观察',
          '分享行为评估',
          '冲突解决能力测试',
          '规则遵守情况记录'
        ],
        resources: [
          {
            type: 'activity',
            title: '社交技能训练',
            description: '通过游戏培养社交能力'
          },
          {
            type: 'specialist',
            title: '儿童社交发展咨询',
            description: '专业心理医生建议'
          }
        ]
      },
      // 语言发展里程碑
      {
        id: 'language-3-4',
        category: 'language',
        ageRange: { min: 3, max: 4 },
        title: '语言表达能力',
        description: '复杂句子表达和理解能力',
        indicators: [
          '能够使用完整句子',
          '能够讲述简单故事',
          '能够理解复杂指令',
          '能够提问和回答'
        ],
        assessmentCriteria: [
          '语言样本分析',
          '故事讲述能力测试',
          '指令理解评估',
          '问答互动观察'
        ],
        resources: [
          {
            type: 'video',
            title: '语言发展促进技巧',
            description: '语言治疗师专业指导'
          },
          {
            type: 'exercise',
            title: '亲子对话练习',
            description: '提升语言表达能力的练习'
          }
        ]
      }
    ]

    defaultMilestones.forEach(milestone => {
      this.milestones.set(milestone.id, milestone)
    })
  }

  /**
   * 生成个性化发展评估
   */
  public generateDevelopmentalAssessment(
    childId: string,
    age: number,
    observations: any[],
    parentReports: any[]
  ): DevelopmentalAssessment {
    const assessment: DevelopmentalAssessment = {
      id: `assessment-${Date.now()}`,
      childId,
      age,
      assessmentDate: new Date(),
      categories: {
        physical: this.assessCategory('physical', age, observations, parentReports),
        cognitive: this.assessCategory('cognitive', age, observations, parentReports),
        emotional: this.assessCategory('emotional', age, observations, parentReports),
        social: this.assessCategory('social', age, observations, parentReports),
        language: this.assessCategory('language', age, observations, parentReports)
      },
      overallScore: 0,
      summary: '',
      nextAssessmentDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 3个月后
      priority: 'medium'
    }

    // 计算总分
    const categoryScores = Object.values(assessment.categories).map(cat => cat.score)
    assessment.overallScore = categoryScores.reduce((sum, score) => sum + score, 0) / categoryScores.length

    // 生成总结
    assessment.summary = this.generateAssessmentSummary(assessment)

    // 确定优先级
    assessment.priority = this.determinePriority(assessment.overallScore, assessment.categories)

    // 生成洞察
    this.generateInsights(childId, assessment)

    this.assessments.set(assessment.id, assessment)
    return assessment
  }

  /**
   * 评估特定发展类别
   */
  private assessCategory(
    category: string,
    age: number,
    observations: any[],
    parentReports: any[]
  ): DevelopmentalAssessment['categories'][keyof DevelopmentalAssessment['categories']] {
    const relevantMilestones = Array.from(this.milestones.values()).filter(
      milestone => milestone.category === category &&
      age >= milestone.ageRange.min - 1 &&
      age <= milestone.ageRange.max + 1
    )

    const milestoneResults = relevantMilestones.map(milestone => {
      const achieved = this.evaluateMilestoneAchievement(milestone, observations, parentReports)
      return {
        milestoneId: milestone.id,
        achieved,
        notes: achieved ? '表现良好' : '需要关注',
        evidence: this.extractEvidence(milestone, observations, parentReports)
      }
    })

    const achievementRate = milestoneResults.filter(r => r.achieved).length / milestoneResults.length
    const score = Math.round(achievementRate * 100)

    const recommendations = this.generateCategoryRecommendations(category, score, milestoneResults)

    return {
      score,
      milestones: milestoneResults,
      recommendations
    }
  }

  /**
   * 评估里程碑达成情况
   */
  private evaluateMilestoneAchievement(
    milestone: DevelopmentalMilestone,
    observations: any[],
    parentReports: any[]
  ): boolean {
    // 简化的评估逻辑
    const relevantObservations = observations.filter(obs =>
      obs.category === milestone.category ||
      milestone.indicators.some(indicator => obs.description?.includes(indicator))
    )

    const relevantParentReports = parentReports.filter(report =>
      report.category === milestone.category ||
      milestone.indicators.some(indicator => report.description?.includes(indicator))
    )

    // 如果有足够的正面证据，认为达成
    const positiveEvidence = relevantObservations.filter(obs => obs.positive).length +
                            relevantParentReports.filter(report => report.positive).length

    const totalEvidence = relevantObservations.length + relevantParentReports.length

    if (totalEvidence === 0) return false

    return positiveEvidence / totalEvidence >= 0.6 // 60%以上达成率
  }

  /**
   * 提取证据
   */
  private extractEvidence(
    milestone: DevelopmentalMilestone,
    observations: any[],
    parentReports: any[]
  ): string[] {
    const evidence: string[] = []

    observations.forEach(obs => {
      if (milestone.indicators.some(indicator => obs.description?.includes(indicator))) {
        evidence.push(`观察记录: ${obs.description}`)
      }
    })

    parentReports.forEach(report => {
      if (milestone.indicators.some(indicator => report.description?.includes(indicator))) {
        evidence.push(`家长报告: ${report.description}`)
      }
    })

    return evidence.slice(0, 3) // 最多返回3条证据
  }

  /**
   * 生成类别建议
   */
  private generateCategoryRecommendations(
    category: string,
    score: number,
    milestoneResults: any[]
  ): string[] {
    const recommendations: string[] = []

    if (score < 60) {
      recommendations.push(`建议加强${this.getCategoryName(category)}方面的培养和练习`)
      recommendations.push('考虑寻求专业指导和建议')
    } else if (score < 80) {
      recommendations.push(`${this.getCategoryName(category)}发展正常，继续保持`)
      recommendations.push('可以适当增加相关活动')
    } else {
      recommendations.push(`${this.getCategoryName(category)}发展优秀，可以尝试更高阶的挑战`)
    }

    // 基于未达成的里程碑添加具体建议
    const unachievedMilestones = milestoneResults.filter(r => !r.achieved)
    unachievedMilestones.slice(0, 2).forEach(result => {
      const milestone = this.milestones.get(result.milestoneId)
      if (milestone) {
        recommendations.push(`重点关注: ${milestone.title}`)
      }
    })

    return recommendations
  }

  /**
   * 获取类别名称
   */
  private getCategoryName(category: string): string {
    const names = {
      physical: '大肌肉发展',
      cognitive: '认知能力',
      emotional: '情感发展',
      social: '社交技能',
      language: '语言表达'
    }
    return names[category as keyof typeof names] || category
  }

  /**
   * 生成评估总结
   */
  private generateAssessmentSummary(assessment: DevelopmentalAssessment): string {
    const { overallScore, categories } = assessment

    let summary = `本次评估显示孩子整体发展得分为${overallScore}分。`

    if (overallScore >= 80) {
      summary += '整体发展状况良好，各领域发展均衡。'
    } else if (overallScore >= 60) {
      summary += '整体发展正常，部分领域有提升空间。'
    } else {
      summary += '建议关注多个发展领域，可能需要专业支持。'
    }

    // 找出最弱和最强的领域
    const categoryScores = Object.entries(categories).map(([key, value]) => ({
      category: key,
      score: value.score,
      name: this.getCategoryName(key)
    }))

    categoryScores.sort((a, b) => a.score - b.score)

    const weakest = categoryScores[0]
    const strongest = categoryScores[categoryScores.length - 1]

    summary += `${weakest.name}是当前最需要关注的领域（${weakest.score}分），`
    summary += `而${strongest.name}表现相对突出（${strongest.score}分）。`

    return summary
  }

  /**
   * 确定优先级
   */
  private determinePriority(
    overallScore: number,
    categories: DevelopmentalAssessment['categories']
  ): 'low' | 'medium' | 'high' {
    const categoryScores = Object.values(categories).map(cat => cat.score)
    const minScore = Math.min(...categoryScores)

    if (overallScore < 60 || minScore < 40) return 'high'
    if (overallScore < 80 || minScore < 60) return 'medium'
    return 'low'
  }

  /**
   * 生成成长洞察
   */
  public generateInsights(childId: string, assessment: DevelopmentalAssessment): GrowthInsight[] {
    const insights: GrowthInsight[] = []

    // 分析评估结果生成洞察
    Object.entries(assessment.categories).forEach(([category, data]) => {
      if (data.score < 60) {
        insights.push({
          id: `concern-${category}-${Date.now()}`,
          type: 'concern',
          title: `${this.getCategoryName(category)}发展关注`,
          description: `${this.getCategoryName(category)}方面的得分偏低，建议增加相关活动和练习`,
          confidence: 0.8,
          timeframe: '未来2-3个月',
          actionable: true,
          suggestedActions: data.recommendations.slice(0, 3),
          resources: this.getRelevantResources(category),
          priority: data.score < 40 ? 'high' : 'medium'
        })
      } else if (data.score > 85) {
        insights.push({
          id: `opportunity-${category}-${Date.now()}`,
          type: 'opportunity',
          title: `${this.getCategoryName(category)}发展优势`,
          description: `${this.getCategoryName(category)}方面表现优秀，可以进一步发展潜能`,
          confidence: 0.9,
          timeframe: '未来1-2个月',
          actionable: true,
          suggestedActions: [
            `提供更高阶的${this.getCategoryName(category)}挑战`,
            `考虑相关的兴趣班或活动`,
            `鼓励在${this.getCategoryName(category)}方面展示才能`
          ],
          resources: this.getAdvancedResources(category),
          priority: 'low'
        })
      }
    })

    // 整体发展洞察
    if (assessment.overallScore > 85) {
      insights.push({
        id: `overall-positive-${Date.now()}`,
        type: 'milestone',
        title: '综合发展优秀',
        description: '孩子各方面发展都很出色，继续保持良好的成长环境',
        confidence: 0.95,
        timeframe: '持续',
        actionable: true,
        suggestedActions: [
          '保持现有的教育方式',
          '适当增加挑战性活动',
          '记录孩子的成长历程'
        ],
        resources: [],
        priority: 'low'
      })
    }

    this.insights.set(childId, insights[0]) // 存储主要洞察
    return insights
  }

  /**
   * 获取相关资源
   */
  private getRelevantResources(category: string): GrowthInsight['resources'] {
    const categoryMilestones = Array.from(this.milestones.values())
      .filter(milestone => milestone.category === category)

    const resources: GrowthInsight['resources'] = []

    categoryMilestones.forEach(milestone => {
      milestone.resources.slice(0, 2).forEach(resource => {
        if (!resources.find(r => r.title === resource.title)) {
          resources.push(resource)
        }
      })
    })

    return resources.slice(0, 3)
  }

  /**
   * 获取进阶资源
   */
  private getAdvancedResources(category: string): GrowthInsight['resources'] {
    return [
      {
        type: 'specialist',
        title: '专业发展评估',
        description: '寻求专家对孩子天赋的专业评估和指导'
      },
      {
        type: 'article',
        title: '天赋培养指南',
        description: '如何发现和培养孩子的特殊才能'
      }
    ]
  }

  /**
   * 获取孩子发展报告
   */
  public getChildDevelopmentReport(childId: string): {
    assessments: DevelopmentalAssessment[]
    insights: GrowthInsight[]
    trends: any[]
    recommendations: string[]
  } {
    const childAssessments = Array.from(this.assessments.values())
      .filter(assessment => assessment.childId === childId)
      .sort((a, b) => b.assessmentDate.getTime() - a.assessmentDate.getTime())

    const childInsights = Array.from(this.insights.values())
      .filter(insight => insight.id.includes(childId))

    const trends = this.analyzeDevelopmentTrends(childAssessments)
    const recommendations = this.generateOverallRecommendations(childAssessments, childInsights)

    return {
      assessments: childAssessments,
      insights: childInsights,
      trends,
      recommendations
    }
  }

  /**
   * 分析发展趋势
   */
  private analyzeDevelopmentTrends(assessments: DevelopmentalAssessment[]): any[] {
    if (assessments.length < 2) return []

    const trends = []
    const categories = ['physical', 'cognitive', 'emotional', 'social', 'language']

    categories.forEach(category => {
      const recent = assessments.slice(0, 3).map(a => a.categories[category as keyof typeof a.categories].score)

      if (recent.length >= 2) {
        const trend = recent[recent.length - 1] - recent[0]
        const direction = trend > 5 ? 'improving' : trend < -5 ? 'declining' : 'stable'

        trends.push({
          category: this.getCategoryName(category),
          direction,
          change: trend,
          currentScore: recent[recent.length - 1]
        })
      }
    })

    return trends
  }

  /**
   * 生成整体建议
   */
  private generateOverallRecommendations(
    assessments: DevelopmentalAssessment[],
    insights: GrowthInsight[]
  ): string[] {
    const recommendations: string[] = []

    if (assessments.length > 0) {
      const latestAssessment = assessments[0]

      // 基于最新评估的建议
      Object.values(latestAssessment.categories).forEach(category => {
        if (category.score < 60) {
          recommendations.push(...category.recommendations.slice(0, 1))
        }
      })
    }

    // 基于洞察的建议
    insights
      .filter(insight => insight.priority === 'high')
      .slice(0, 2)
      .forEach(insight => {
        recommendations.push(...insight.suggestedActions.slice(0, 1))
      })

    // 通用建议
    if (recommendations.length === 0) {
      recommendations.push(
        '继续保持良好的养育环境',
        '定期观察和记录孩子的成长变化',
        '与孩子保持良好的沟通和互动'
      )
    }

    return [...new Set(recommendations)].slice(0, 5) // 去重并限制数量
  }

  /**
   * 更新孩子档案
   */
  public updateChildProfile(childId: string, profile: any): void {
    this.childProfiles.set(childId, {
      ...this.childProfiles.get(childId),
      ...profile,
      lastUpdated: new Date()
    })
  }

  /**
   * 获取孩子档案
   */
  public getChildProfile(childId: string): any {
    return this.childProfiles.get(childId)
  }

  /**
   * 获取下一个评估建议时间
   */
  public getNextAssessmentRecommendation(childId: string): {
    recommended: boolean
    timeframe: string
    reasons: string[]
  } {
    const assessments = Array.from(this.assessments.values())
      .filter(assessment => assessment.childId === childId)
      .sort((a, b) => b.assessmentDate.getTime() - a.assessmentDate.getTime())

    if (assessments.length === 0) {
      return {
        recommended: true,
        timeframe: '尽快',
        reasons: ['还没有基础评估数据', '需要建立发展基线']
      }
    }

    const latestAssessment = assessments[0]
    const daysSinceLastAssessment = Math.floor(
      (Date.now() - latestAssessment.assessmentDate.getTime()) / (24 * 60 * 60 * 1000)
    )

    const reasons: string[] = []
    let recommended = false
    let timeframe = ''

    if (daysSinceLastAssessment > 90) {
      recommended = true
      timeframe = '现在'
      reasons.push('距离上次评估已超过3个月')
    } else if (latestAssessment.priority === 'high') {
      recommended = true
      timeframe = '1个月内'
      reasons.push('上次评估发现有需要关注的领域')
    } else if (daysSinceLastAssessment > 60) {
      recommended = true
      timeframe = '1个月内'
      reasons.push('建议定期追踪发展变化')
    }

    return { recommended, timeframe, reasons }
  }
}

// 导出单例实例
export const intelligentGrowthGuardian = new IntelligentGrowthGuardian()