/**
 * YYC³ 智能预测系统 - 通用类型定义
 * 智能预测与集成学习系统核心类型
 */

// 基础数据结构
export interface DataPoint {
  timestamp: number
  value: number
  features?: Record<string, number>
  metadata?: Record<string, any>
}

export interface PredictionData {
  data: DataPoint[]
  target: string
  features?: string[]
  dataType: 'timeseries' | 'cross_sectional' | 'panel'
  frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'realtime'
}

// 预测器配置
export interface PredictorConfig {
  name: string
  algorithm: string
  parameters: Record<string, any>
  preprocessing?: {
    scaling?: boolean
    imputation?: string
    featureSelection?: boolean
  }
  validation?: {
    method: 'train_test_split' | 'cross_validation' | 'time_series_split'
    testSize?: number
    cvFolds?: number
  }
}

// 训练结果
export interface TrainingResult {
  modelId: string
  algorithm: string
  parameters: Record<string, any>
  trainingTime: number
  trainingScore: number
  validationScore: number
  featureImportance?: Record<string, number>
  trainingMetrics: Record<string, number>
  timestamp: number
}

// 预测结果
export interface PredictionResult {
  id: string
  prediction: number | number[]
  confidence: number
  timestamp: number
  horizon: number
  modelId: string
  methodology: string
  confidenceInterval?: {
    lower: number | number[]
    upper: number | number[]
  }
  features?: Record<string, number>
  explanation?: string
}

// 特征集
export interface FeatureSet {
  features: string[]
  importance: Record<string, number>
  selectedFeatures: string[]
  engineeredFeatures: Record<string, number>
  statistics: Record<string, FeatureStatistics>
}

export interface FeatureStatistics {
  mean: number
  std: number
  min: number
  max: number
  missing: number
  type: 'numeric' | 'categorical' | 'datetime'
}

// 超参数优化
export interface OptimizedParams {
  parameters: Record<string, any>
  score: number
  optimizationTime: number
  searchSpace: Record<string, any>
  bestIteration: number
}

// 预测任务类型
export interface PredictionTask {
  id: string
  name: string
  type: 'regression' | 'classification' | 'forecasting' | 'anomaly_detection'
  description: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  constraints: ModelConstraints
  requirements: TaskRequirements
}

export interface ModelConstraints {
  maxTrainingTime?: number
  maxPredictionTime?: number
  memoryLimit?: number
  accuracyThreshold?: number
  interpretabilityRequired?: boolean
  updateFrequency?: 'realtime' | 'batch' | 'scheduled'
  realTimeCapability?: boolean
}

export interface TaskRequirements {
  features: string[]
  horizon?: number
  confidenceLevel?: number
  explanationRequired?: boolean
  realTimeCapability?: boolean
  uncertaintyQuantification?: boolean
}

// 模型选择
export interface ModelSelection {
  selectedModel: string
  alternativeModels: string[]
  selectionReason: string
  expectedPerformance: number
  confidence: number
  fittingTime: number
}

export interface ModelFitAssessment {
  modelId: string
  goodnessOfFit: number
  residualAnalysis: ResidualAnalysis
  stabilityMetrics: StabilityMetrics
  biasVarianceTradeoff: BiasVarianceAnalysis
  recommendations: string[]
}

export interface ResidualAnalysis {
  meanError: number
  stdError: number
  skewness: number
  kurtosis: number
  autocorrelation: number
  heteroscedasticity: boolean
}

export interface StabilityMetrics {
  parameterStability: number
  predictionStability: number
  temporalStability: number
  sensitivity: Record<string, number>
}

export interface BiasVarianceAnalysis {
  bias: number
  variance: number
  irreducibleError: number
  totalError: number
  decomposition: 'bias2' | 'variance' | 'noise'
}

// 性能历史
export interface PerformanceHistory {
  timestamp: number
  accuracy: number
  precision: number
  recall: number
  f1Score: number
  auc: number
  latency: number
  throughput: number
  errorRate: number
}

// 数据漂移
export interface DataDriftMetrics {
  featureDrift: Record<string, number>
  distributionShift: DistributionShift
  conceptDrift: ConceptDrift
  driftDetectionTime: number
  severity: 'low' | 'medium' | 'high' | 'critical'
}

export interface DistributionShift {
  kolmogorovSmirnov: number
  wasserstein: number
  hellinger: number
  jensenShannon: number
}

export interface ConceptDrift {
  accuracyDecline: number
  errorPatternChange: number
  featureImportanceChange: Record<string, number>
  predictionDistributionChange: number
}

// 集成权重
export interface UpdatedWeights {
  weights: Record<string, number>
  adaptationReason: string
  performanceGain: number
  timestamp: number
}

// 概念漂移检测
export interface DriftDetection {
  detected: boolean
  driftType: 'sudden' | 'gradual' | 'incremental' | 'recurring'
  driftMagnitude: number
  pValue: number
  detectionMethod: string
  confidenceInterval: number[]
}

// 数据流
export interface DataStream {
  id: string
  data: DataPoint[]
  isRealTime: boolean
  updateFrequency: number
  bufferSize: number
  qualityMetrics: StreamQualityMetrics
}

export interface StreamQualityMetrics {
  completeness: number
  accuracy: number
  timeliness: number
  consistency: number
  validity: number
}

// 流式预测
export interface StreamingPrediction {
  timestamp: number
  prediction: number
  confidence: number
  processingTime: number
  dataQuality: StreamQualityMetrics
  modelVersion: string
  anomalies?: AnomalyReport[]
}

// 预测洞察
export interface PredictionInsights {
  summary: string
  keyPoints: InsightPoint[]
  performanceMetrics: PerformanceMetrics
  driftAlerts: DriftAlert[]
  recommendations: Recommendation[]
  riskAssessment: RiskAssessment
  confidence: number
}

export interface InsightPoint {
  type: 'trend' | 'pattern' | 'anomaly' | 'opportunity' | 'risk'
  description: string
  severity: 'low' | 'medium' | 'high'
  confidence: number
  actionability: 'immediate' | 'short_term' | 'long_term' | 'monitor'
}

export interface PerformanceMetrics {
  accuracy: number
  precision: number
  recall: number
  f1Score: number
  rmse: number
  mae: number
  r2Score: number
  customMetrics?: Record<string, number>
}

export interface DriftAlert {
  type: 'data' | 'concept' | 'performance'
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  affectedFeatures: string[]
  recommendedAction: string
  timestamp: number
}

export interface Recommendation {
  category: 'model_update' | 'data_refresh' | 'parameter_tuning' | 'feature_engineering'
  priority: 'low' | 'medium' | 'high'
  description: string
  expectedImpact: string
  effort: 'low' | 'medium' | 'high'
}

export interface RiskAssessment {
  overall: 'low' | 'medium' | 'high'
  factors: RiskFactor[]
  mitigation: string[]
  monitoringRequired: string[]
}

export interface RiskFactor {
  type: 'data_quality' | 'model_drift' | 'overfitting' | 'underfitting' | 'bias'
  severity: 'low' | 'medium' | 'high'
  description: string
  impact: string
}

// ========== 额外的类型定义 ==========

// 基础模型接口
export interface BaseModel {
  id: string
  name: string
  type: string
  version: string
  createdAt: number
  updatedAt: number
}

// 校准结果
export interface CalibrationResult {
  modelId: string
  calibrationDate: number
  originalBias: number
  calibratedBias: number
  improvement: number
  reliabilityScore: number
  confidenceIntervals: Record<string, [number, number]>
}

// 质量指标
export interface QualityMetrics {
  accuracy: number
  precision: number
  recall: number
  f1Score: number
  specificity: number
  sensitivity: number
  matthewsCorrelationCoefficient: number
  balancedAccuracy: number
}

// 偏差报告
export interface BiasReport {
  detectedBias: boolean
  biasTypes: ('selection' | 'measurement' | 'confirmation' | 'publication')[]
  severity: 'low' | 'medium' | 'high'
  affectedGroups: string[]
  mitigationStrategies: string[]
  reportDate: number
}

// 敏感数据
export interface SensitiveData {
  attribute: string
  values: string[]
  distribution: Record<string, number>
  isProtected: boolean
  protectionLevel: 'public' | 'internal' | 'confidential' | 'restricted'
}

// 异常报告
export interface AnomalyReport {
  id: string
  timestamp: number
  severity: 'low' | 'medium' | 'high' | 'critical'
  type: 'point' | 'contextual' | 'collective' | 'trend'
  description: string
  value: number
  expectedRange: [number, number]
  confidence: number
  contributingFactors?: string[]
}