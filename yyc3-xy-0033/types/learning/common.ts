/**
 * YYC³ 智能预测系统 - 元学习系统类型定义
 * 定义多层次学习和自适应能力相关的类型
 */

/**
 * 学习级别
 */
export type LearningLevel = 'behavioral' | 'strategic' | 'knowledge'

/**
 * 学习配置
 */
export interface LearningConfig {
  levels: LearningLevel[]
  adaptationRate: number
  experienceBufferSize: number
  learningRate: number
  explorationRate: number
  transferThreshold: number
  curriculumStages: number
  ensembleSize: number
  updateFrequency: number
  persistLearning?: boolean
  enableTransfer?: boolean
  enableCurriculum?: boolean
  enableEnsemble?: boolean
}

/**
 * 学习经验
 */
export interface LearningExperience {
  id: string
  taskType: string
  context: Record<string, any>
  action: string
  outcome: any
  reward: number
  timestamp: Date
  processed: boolean
  metadata?: Record<string, any>
  tags?: string[]
  complexity?: number
  success?: boolean
  duration?: number
}

/**
 * 学习策略
 */
export interface LearningStrategy {
  id: string
  name: string
  description: string
  taskType: string
  level: LearningLevel
  algorithm: string
  parameters: Record<string, any>
  performance: number
  confidence: number
  lastUsed: Date
  usageCount: number
  successRate: number
  adaptationHistory: Array<{
    timestamp: Date
    changes: Record<string, any>
    reason: string
  }>
  metaParameters: {
    learningRate: number
    explorationRate: number
    discountFactor: number
    batchSize?: number
  }
}

/**
 * 元学习者
 */
export interface MetaLearner {
  id: string
  level: LearningLevel
  strategies: string[]
  performance: number
  adaptationRate: number
  lastUpdate: Date
  learningHistory: Array<{
    timestamp: Date
    experience: string
    strategy: string
    outcome: any
    improvement: number
  }>
  metaKnowledge: Record<string, any>
  capabilities: string[]
}

/**
 * 学习指标
 */
export interface LearningMetrics {
  totalExperiences: number
  strategiesLearned: number
  adaptationsPerformed: number
  transferLearningSuccess: number
  averageLearningRate: number
  knowledgeGraphNodes: number
  knowledgeGraphEdges: number
  lastUpdated: Date
  performanceMetrics: Map<string, number>
  learningEfficiency: number
  convergenceRate?: number
  generalizationAbility?: number
}

/**
 * 知识图谱
 */
export interface KnowledgeGraph {
  nodes: Map<string, KnowledgeNode>
  edges: Map<string, KnowledgeEdge>
  embeddings?: Map<string, number[]>
  clusters?: Map<string, string[]>
  metadata: {
    nodeCount: number
    edgeCount: number
    lastUpdated: Date
    version: string
  }
}

/**
 * 知识节点
 */
export interface KnowledgeNode {
  id: string
  type: 'concept' | 'skill' | 'strategy' | 'experience' | 'pattern'
  label: string
  description: string
  attributes: Record<string, any>
  confidence: number
  frequency: number
  lastAccessed: Date
  relatedNodes: string[]
  embeddings?: number[]
  metadata?: Record<string, any>
}

/**
 * 知识边
 */
export interface KnowledgeEdge {
  id: string
  source: string
  target: string
  type: 'causal' | 'correlational' | 'hierarchical' | 'sequential' | 'similarity'
  weight: number
  strength: number
  direction: 'directed' | 'undirected'
  metadata?: Record<string, any>
}

/**
 * 经验回放
 */
export interface ExperienceReplay {
  experiences: LearningExperience[]
  bufferSize: number
  currentSize: number
  lastUpdated: Date
  priorityScores: Map<string, number>
  samplingStrategy: 'uniform' | 'prioritized' | 'ranked' | 'stochastic'
  importanceWeights: Map<string, number>
}

/**
 * 适应策略
 */
export interface AdaptationStrategy {
  id: string
  name: string
  description: string
  needs: string[]
  actions: AdaptationAction[]
  priority: 'low' | 'medium' | 'high' | 'critical'
  estimatedImpact: number
  complexity: number
  resources: Array<{
    type: string
    quantity: number
    cost?: number
  }>
  timeline: {
    estimated: number
    actual?: number
  }
  success?: boolean
  effectiveness?: number
}

/**
 * 适应行动
 */
export interface AdaptationAction {
  id: string
  type: 'parameter_adjustment' | 'strategy_update' | 'model_retrain' | 'knowledge_update'
  target: string
  parameters: Record<string, any>
  expectedOutcome: string
  dependencies?: string[]
  risk?: number
}

/**
 * 学习反馈
 */
export interface LearningFeedback {
  taskId: string
  action: string
  outcome: any
  timestamp: Date
  immediateReward: number
  longTermValue: number
  analysis: {
    success: boolean
    efficiency: number
    quality: number
    novelty: number
    difficulty: number
  }
  improvements: string[]
  confidence: number
  recommendations: string[]
  contextualFactors: Record<string, any>
}

/**
 * 模型集成
 */
export interface ModelEnsemble {
  id: string
  models: Array<{
    id: string
    type: string
    performance: number
    weight: number
    contribution?: number
  }>
  strategy: EnsembleStrategy
  weights: number[]
  performance: EnsemblePerformance
  diversity: ModelDiversity
  taskType: string
  createdAt: Date
  lastUpdated: Date
  metadata?: Record<string, any>
}

/**
 * 集成策略
 */
export type EnsembleStrategy =
  | 'weighted_average'
  | 'majority_voting'
  | 'stacking'
  | 'boosting'
  | 'bagging'
  | 'dynamic_selection'
  | 'adaptive_weighting'

/**
 * 集成性能
 */
export interface EnsemblePerformance {
  accuracy: number
  precision: number
  recall: number
  f1Score: number
  improvement: number
  robustness: number
  stability: number
  generalization: number
  trainingTime: number
  inferenceTime: number
}

/**
 * 模型多样性
 */
export interface ModelDiversity {
  diversity: number
  correlations: Array<{
    modelA: string
    modelB: string
    correlation: number
  }>
  complementarity: number
  redundancy: number
  coverage: number
}

/**
 * 迁移学习
 */
export interface TransferLearning {
  id: string
  sourceDomain: string
  targetDomain: string
  domainSimilarity: {
    score: number
    sharedFeatures: string[]
    differences: string[]
    confidence: number
  }
  transferableKnowledge: {
    knowledge: any[]
    confidence: number
    adaptability: number
  }
  transferredKnowledge: any
  validationResults: {
    successRate: number
    improvementRate: number
    transferEfficiency: number
    adaptationCost: number
  }
  success: boolean
  improvementRate: number
  timestamp: Date
  transferMethod: 'fine_tuning' | 'feature_extraction' | 'domain_adaptation' | 'multi_task'
}

/**
 * 课程学习
 */
export interface CurriculumLearning {
  id: string
  objectives: string[]
  sequence: CurriculumStage[]
  progress: Record<string, number>
  evaluation: CurriculumEvaluation
  completionTime: number
  success: boolean
  difficulty: 'linear' | 'adaptive' | 'self_paced'
}

/**
 * 课程阶段
 */
export interface CurriculumStage {
  level: number
  objective: string
  description: string
  prerequisites: string[]
  learningOutcomes: string[]
  requiredMastery: number
  assessmentCriteria: string[]
  resources: CurriculumResource[]
  duration: number
  difficulty: number
}

/**
 * 课程资源
 */
export interface CurriculumResource {
  type: 'text' | 'video' | 'exercise' | 'project' | 'simulation'
  title: string
  description: string
  url?: string
  content?: string
  difficulty: number
  estimatedTime: number
  prerequisites?: string[]
  learningObjectives: string[]
}

/**
 * 课程评估
 */
export interface CurriculumEvaluation {
  overallMastery: number
  stageResults: Record<string, {
    mastery: number
    timeSpent: number
    attempts: number
    feedback: string
  }>
  learningEfficiency: number
  retentionRate: number
  transferability: number
  engagement: number
  recommendations: string[]
}

/**
 * 模式识别
 */
export interface PatternRecognition {
  patterns: LearningPattern[]
  clusters: PatternCluster[]
  anomalies: PatternAnomaly[]
  trends: PatternTrend[]
  confidence: number
}

/**
 * 学习模式
 */
export interface LearningPattern {
  id: string
  name: string
  description: string
  category: 'behavioral' | 'strategic' | 'knowledge'
  frequency: number
  strength: number
  predictability: number
  context: Record<string, any>
  outcomes: Array<{
    action: string
    result: any
    probability: number
  }>
  confidence: number
  lastObserved: Date
}

/**
 * 模式聚类
 */
export interface PatternCluster {
  id: string
  center: number[]
  members: string[]
  cohesion: number
  separation: number
  label: string
  description: string
  characteristics: Record<string, any>
}

/**
 * 模式异常
 */
export interface PatternAnomaly {
  id: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  pattern: string
  deviation: number
  context: Record<string, any>
  detectedAt: Date
  resolved?: boolean
}

/**
 * 模式趋势
 */
export interface PatternTrend {
  metric: string
  direction: 'increasing' | 'decreasing' | 'stable' | 'oscillating'
  slope: number
  confidence: number
  period: number
  seasonality?: number
  forecast: Array<{
    timestamp: Date
    value: number
    confidence: number
  }>
}

/**
 * 强化学习组件
 */
export interface ReinforcementLearning {
  agent: RLAgent
  environment: RLEnvironment
  policy: RLPolicy
  valueFunction: RLValueFunction
  experienceReplay: RLExperienceReplay
  exploration: RLExploration
}

/**
 * 强化学习代理
 */
export interface RLAgent {
  id: string
  type: 'q_learning' | 'policy_gradient' | 'actor_critic' | 'ddpg' | 'sac'
  state: RLState
  action: RLAction
  reward: number
  done: boolean
  episode: number
  step: number
  totalReward: number
  performance: number
}

/**
 * 强化学习状态
 */
export interface RLState {
  features: number[]
  discrete?: string[]
  continuous?: number[]
  context?: Record<string, any>
  timestamp: Date
  terminal: boolean
}

/**
 * 强化学习动作
 */
export interface RLAction {
  type: 'discrete' | 'continuous' | 'mixed'
  value: any
  probability?: number
  qValue?: number
  confidence?: number
}

/**
 * 强化学习环境
 */
export interface RLEnvironment {
  id: string
  stateSpace: RLStateSpace
  actionSpace: RLActionSpace
  dynamics: Record<string, any>
  transitionFunction: (state: RLState, action: RLAction) => RLState
  rewardFunction: (state: RLState, action: RLAction, nextState: RLState) => number
  doneFunction: (state: RLState) => boolean
  resetFunction: () => RLState
}

/**
 * 强化学习状态空间
 */
export interface RLStateSpace {
  type: 'discrete' | 'continuous' | 'mixed'
  dimensions: number
  bounds?: Array<[number, number]>
  shape?: number[]
  dtype?: string
}

/**
 * 强化学习动作空间
 */
export interface RLActionSpace {
  type: 'discrete' | 'continuous' | 'mixed'
  dimensions: number
  bounds?: Array<[number, number]>
  actions?: any[]
  dtype?: string
}

/**
 * 强化学习策略
 */
export interface RLPolicy {
  id: string
  type: 'stochastic' | 'deterministic' | 'epsilon_greedy'
  parameters: Record<string, any>
  network?: any
  weights?: number[]
  performance: number
  convergence: boolean
  lastUpdate: Date
}

/**
 * 强化学习价值函数
 */
export interface RLValueFunction {
  type: 'state_value' | 'action_value' | 'advantage'
  parameters: Record<string, any>
  network?: any
  weights?: number[]
  learningRate: number
  discountFactor: number
  target: number[]
  predictions: number[]
  errors: number[]
}

/**
 * 强化学习经验回放
 */
export interface RLExperienceReplay {
  capacity: number
  experiences: RLExperience[]
  priorities: number[]
  samplingStrategy: 'uniform' | 'prioritized' | 'ranked'
  beta: number
  alpha: number
}

/**
 * 强化学习经验
 */
export interface RLExperience {
  state: RLState
  action: RLAction
  reward: number
  nextState: RLState
  done: boolean
  priority?: number
  tdError?: number
}

/**
 * 强化学习探索
 */
export interface RLExploration {
  strategy: 'epsilon_greedy' | 'boltzmann' | 'ucb' | 'thompson_sampling'
  parameters: Record<string, any>
  explorationRate: number
  decayRate: number
  minExplorationRate: number
  totalSteps: number
}

/**
 * 自适应学习
 */
export interface AdaptiveLearning {
  adaptability: number
  plasticity: number
  stability: number
  forgettingRate: number
  consolidationRate: number
  transferAbility: number
  generalization: number
  robustness: number
  efficiency: number
  lastAdaptation: Date
  adaptationHistory: Array<{
    timestamp: Date
    trigger: string
    adaptation: string
    effectiveness: number
  }>
}