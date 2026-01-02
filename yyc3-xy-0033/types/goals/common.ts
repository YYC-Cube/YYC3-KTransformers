/**
 * YYC³ 智能预测系统 - 目标管理类型定义
 * 定义目标管理和价值评估相关的类型
 */

/**
 * 目标输入
 */
export interface GoalInput {
  title: string
  description: string
  category: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  type: 'standard' | 'okr' | 'project' | 'initiative'
  valueMetrics?: ValueMetrics[]
  stakeholders?: string[]
  tags?: string[]
  deadline?: Date
  budget?: number
  okrData?: OKRData
  context?: Record<string, any>
}

/**
 * 目标定义
 */
export interface GoalDefinition {
  id: string
  title: string
  description: string
  category: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  type: 'standard' | 'okr' | 'project' | 'initiative'
  smartCriteria: SmartCriteria
  valueMetrics: ValueMetrics[]
  riskAssessment: RiskAssessment
  stakeholders: string[]
  tags: string[]
  deadline?: Date
  budget?: number
  createdAt: Date
  updatedAt: Date
  status: 'created' | 'planned' | 'in_progress' | 'completed' | 'cancelled' | 'paused'
  progress: number // 0-100
  owner?: string
  assignees?: string[]
}

/**
 * SMART标准验证结果
 */
export interface SmartCriteria {
  isValid: boolean
  violations: string[]
  scores: {
    specific: number // 0-10
    measurable: number // 0-10
    achievable: number // 0-10
    relevant: number // 0-10
    timeBound: number // 0-10
  }
  overallScore: number // 0-10
}

/**
 * 价值度量指标
 */
export interface ValueMetrics {
  id: string
  name: string
  type: 'business' | 'technical' | 'user' | 'financial'
  unit: string
  target: number
  current: number
  description: string
  weight: number // 0-1
  kpi?: boolean
}

/**
 * 风险评估
 */
export interface RiskAssessment {
  overallRisk: 'low' | 'medium' | 'high' | 'critical'
  riskFactors: RiskFactor[]
  mitigationStrategies: Array<{
    risk: string
    strategy: string
    probability: number
    impact: number
    owner: string
  }>
  riskScore: number // 0-10
  lastAssessed: Date
}

/**
 * 风险因素
 */
export interface RiskFactor {
  id: string
  name: string
  category: 'technical' | 'business' | 'resource' | 'external'
  probability: number // 0-1
  impact: number // 0-10
  description: string
  mitigation?: string
  owner?: string
}

/**
 * 里程碑
 */
export interface Milestone {
  id: string
  name: string
  description: string
  targetDate: Date
  actualDate?: Date
  status: 'pending' | 'in_progress' | 'completed' | 'missed'
  completionCriteria: string[]
  dependencies: string[]
  deliverables: Deliverable[]
  notes?: string
}

/**
 * 交付物
 */
export interface Deliverable {
  id: string
  name: string
  description: string
  type: 'document' | 'software' | 'feature' | 'report' | 'other'
  status: 'pending' | 'in_progress' | 'completed' | 'rejected'
  quality: number // 0-10
  assignedTo?: string
  dueDate?: Date
  completedAt?: Date
  artifacts?: string[] // 文件路径或URL
}

/**
 * 任务
 */
export interface Task {
  id: string
  name: string
  description: string
  goalId: string
  milestoneId?: string
  assignee: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  estimatedHours: number
  actualHours: number
  status: 'pending' | 'in_progress' | 'completed' | 'blocked' | 'cancelled'
  dependencies: string[]
  tags: string[]
  createdAt: Date
  updatedAt: Date
  dueDate?: Date
  completedAt?: Date
  blockers?: string[]
  notes?: string
}

/**
 * 阻塞因素
 */
export interface Blocker {
  id: string
  taskId?: string
  milestoneId?: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  type: 'technical' | 'resource' | 'dependency' | 'external'
  reportedBy: string
  reportedAt: Date
  resolvedAt?: Date
  resolution?: string
  impact: string
}

/**
 * 目标执行状态
 */
export interface GoalExecution {
  goalId: string
  startTime: Date
  endTime?: Date
  status: 'running' | 'paused' | 'completed' | 'failed'
  completedTasks: string[]
  blockedTasks: string[]
  blockers: Blocker[]
  progressUpdates: ProgressUpdate[]
  resourceUsage: ResourceUsage[]
  timeSpent: number // 小时
  budgetUsed: number
  milestones: {
    completed: string[]
    inProgress: string[]
    pending: number
  }
  qualityMetrics: QualityMetric[]
}

/**
 * 进度更新
 */
export interface ProgressUpdate {
  timestamp: Date
  completionRate: number // 0-100
  healthScore: number // 0-100
  notes: string
  reporter: string
  blockers?: string[]
  achievements?: string[]
}

/**
 * 资源使用情况
 */
export interface ResourceUsage {
  timestamp: Date
  type: string
  used: number
  allocated: number
  unit: string
  cost?: number
}

/**
 * 质量指标
 */
export interface QualityMetric {
  name: string
  value: number
  target: number
  unit: string
  measuredAt: Date
  trend: 'improving' | 'stable' | 'declining'
}

/**
 * 目标进度
 */
export interface GoalProgress {
  goalId: string
  timestamp: Date
  completionRate: number // 0-100
  healthScore: number // 0-100
  blockers: Blocker[]
  milestonesProgress: Record<string, {
    status: string
    completion: number
    healthScore: number
  }>
  resourceUtilization: Record<string, {
    used: number
    allocated: number
    efficiency: number
  }>
  riskIndicators: Record<string, {
    level: number
    trend: 'increasing' | 'stable' | 'decreasing'
    mitigation?: string
  }>
  stakeholderSatisfaction: number // 0-100
  predictedCompletion: Date
  recommendations: string[]
  warnings?: string[]
  achievements?: string[]
}

/**
 * 目标生命周期
 */
export interface GoalLifecycle {
  id: string
  goalId: string
  creation: { goal: GoalDefinition; validation: SmartCriteria }
  planning: any
  execution: GoalExecution
  monitoring: GoalProgress[]
  adjustment: any
  completion: any
  evaluation: GoalEvaluation
  learning: GoalLearning
  startTime: Date
  endTime?: Date
  status: 'active' | 'completed' | 'cancelled'
}

/**
 * 目标评估
 */
export interface GoalEvaluation {
  goalId: string
  evaluationDate: Date
  overallValue: number // 0-10
  roi: number
  businessImpact: {
    score: number // 0-10
    description: string
    metrics: Record<string, number>
    achievements: string[]
  }
  userSatisfaction: {
    score: number // 0-100
    feedback: Array<{
      user: string
      rating: number
      comment: string
      timestamp: Date
    }>
    sentiment: 'positive' | 'neutral' | 'negative'
  }
  technicalOutcomes: {
    quality: number // 0-10
    performance: number // 0-10
    maintainability: number // 0-10
    scalability: number // 0-10
    security: number // 0-10
  }
  financialBenefits: {
    costSavings: number
    revenueIncrease: number
    efficiencyGain: number
    paybackPeriod: number // 月
  }
  unexpectedBenefits: string[]
  improvementOpportunities: string[]
  stakeholderFeedback: Array<{
    stakeholder: string
    feedback: string
    rating: number
    timestamp: Date
  }>
}

/**
 * 目标学习
 */
export interface GoalLearning {
  goalId: string
  completedAt: Date
  patterns: Pattern[]
  bestPractices: string[]
  failureAnalysis: {
    failures: Failure[]
    rootCauses: string[]
    lessons: string[]
  }
  improvementRecommendations: Recommendation[]
  knowledgeBaseUpdates: Array<{
    type: 'pattern' | 'practice' | 'lesson' | 'recommendation'
    content: string
    tags: string[]
    applicableGoals: string[]
  }>
}

/**
 * 模式
 */
export interface Pattern {
  id: string
  name: string
  description: string
  category: 'success' | 'failure' | 'process' | 'communication'
  frequency: number
  confidence: number // 0-1
  conditions: string[]
  outcomes: string[]
  tags: string[]
}

/**
 * 失败分析
 */
export interface Failure {
  id: string
  name: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  category: 'planning' | 'execution' | 'technical' | 'communication' | 'resource'
  rootCauses: string[]
  impact: string
  prevention: string
  recovery: string
  timeline: Array<{
    phase: string
    event: string
    timestamp: Date
  }>
}

/**
 * 改进建议
 */
export interface Recommendation {
  id: string
  title: string
  description: string
  category: 'process' | 'technical' | 'resource' | 'communication' | 'strategy'
  priority: 'low' | 'medium' | 'high'
  impact: 'low' | 'medium' | 'high'
  effort: 'low' | 'medium' | 'high'
  actionItems: Array<{
    description: string
    owner: string
    dueDate?: Date
    status: 'pending' | 'in_progress' | 'completed'
  }>
  expectedBenefit: string
  implementationCost?: number
  roi?: number
}

/**
 * 协作
 */
export interface Collaboration {
  id: string
  goalId: string
  participants: Participant[]
  communications: Communication[]
  decisions: Decision[]
  conflicts: Conflict[]
  knowledgeSharing: KnowledgeShare[]
  effectiveness: {
    participationRate: number
    communicationQuality: number
    decisionSpeed: number
    conflictResolution: number
  }
}

/**
 * 参与者
 */
export interface Participant {
  id: string
  name: string
  role: string
  responsibilities: string[]
  availability: 'full' | 'part' | 'limited'
  contribution: {
    tasksCompleted: number
    hoursContributed: number
    qualityRating: number
    collaborationRating: number
  }
}

/**
 * 沟通记录
 */
export interface Communication {
  id: string
  type: 'meeting' | 'email' | 'chat' | 'document' | 'presentation'
  participants: string[]
  subject: string
  summary: string
  date: Date
  duration?: number
  artifacts?: string[]
  actionItems?: string[]
  decisions?: string[]
}

/**
 * 决策记录
 */
export interface Decision {
  id: string
  title: string
  description: string
  alternatives: Array<{
    name: string
    pros: string[]
    cons: string[]
    score: number
  }>
  selectedAlternative: string
  rationale: string
  decisionMaker: string
  date: Date
  impact: string
  status: 'proposed' | 'approved' | 'rejected' | 'implemented'
  followUpItems?: string[]
}

/**
 * 冲突
 */
export interface Conflict {
  id: string
  type: 'resource' | 'priority' | 'technical' | 'process' | 'personality'
  parties: string[]
  description: string
  severity: 'low' | 'medium' | 'high'
  reportedAt: Date
  resolvedAt?: Date
  resolution?: string
  mediator?: string
  outcome: 'pending' | 'resolved' | 'escalated' | 'compromise'
}

/**
 * 知识分享
 */
export interface KnowledgeShare {
  id: string
  type: 'lesson' | 'best_practice' | 'template' | 'tool' | 'process'
  title: string
  description: string
  content: string
  author: string
  sharedAt: Date
  tags: string[]
  rating: number
  feedback: Array<{
    user: string
    rating: number
    comment: string
    timestamp: Date
  }>
  usage: number
  applicability: string[]
}

/**
 * 经验教训
 */
export interface LessonsLearned {
  id: string
  goalId: string
  category: 'success' | 'failure' | 'process' | 'technical' | 'management'
  title: string
  description: string
  context: string
  outcome: string
  lessons: string[]
  recommendations: string[]
  applicableSituations: string[]
  evidence: string[]
  createdAt: Date
  author: string
  reviewers: string[]
  status: 'draft' | 'reviewed' | 'approved' | 'published'
}

/**
 * OKR数据
 */
export interface OKRData {
  objective: string
  keyResults: Array<{
    description: string
    target: number
    current: number
    unit: string
    milestone?: string
  }>
  quarter: string
  year: number
  department?: string
  alignedWith?: string[]
}

/**
 * OKR框架
 */
export interface OKRFramework {
  objectives: Array<{
    id: string
    title: string
    description: string
    keyResults: OKRKeyResult[]
    progress: number
    status: 'on_track' | 'at_risk' | 'behind' | 'achieved'
    owner: string
    quarter: string
    year: number
  }>
  cascades: Array<{
    parentId: string
    childId: string
    alignmentScore: number
  }>
}

/**
 * OKR关键结果
 */
export interface OKRKeyResult {
  id: string
  description: string
  target: number
  current: number
  unit: string
  initialValue: number
  progress: number
  status: 'on_track' | 'at_risk' | 'behind' | 'achieved'
  dueDate?: Date
  milestones?: Array<{
    date: Date
    target: number
    achieved: boolean
  }>
  confidence: number // 0-10
  notes?: string
}

/**
 * 价值框架
 */
export interface BusinessValueFramework {
  valueStreams: ValueStream[]
  valueMetrics: BusinessValueMetric[]
  valueFlows: ValueFlow[]
  kpiMappings: KPIMapping[]
}

/**
 * 价值流
 */
export interface ValueStream {
  id: string
  name: string
  description: string
  stages: ValueStage[]
  valueMetrics: string[]
  stakeholders: string[]
  averageCycleTime: number
  efficiency: number
  quality: number
}

/**
 * 价值阶段
 */
export interface ValueStage {
  name: string
  description: string
  inputs: string[]
  outputs: string[]
  activities: string[]
  metrics: string[]
  bottlenecks?: string[]
  improvementOpportunities?: string[]
}

/**
 * 业务价值指标
 */
export interface BusinessValueMetric {
  id: string
  name: string
  description: string
  category: 'financial' | 'customer' | 'process' | 'learning' | 'growth'
  type: 'leading' | 'lagging'
  calculation: string
  target: number
  current: number
  trend: 'up' | 'down' | 'stable'
  dataSources: string[]
  updateFrequency: string
  owner: string
}

/**
 * 价值流图
 */
export interface ValueFlow {
  id: string
  from: string
  to: string
  type: 'data' | 'material' | 'information' | 'decision'
  value: number
  unit: string
  description: string
  efficiency: number
  bottlenecks?: string[]
}

/**
 * KPI映射
 */
export interface KPIMapping {
  kpi: string
  goalId: string
  weight: number
  target: number
  current: number
  contribution: number
  status: 'on_track' | 'at_risk' | 'behind'
}