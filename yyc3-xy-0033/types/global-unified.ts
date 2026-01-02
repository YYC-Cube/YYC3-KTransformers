/**
 * YYC³ AI小语智能成长守护系统 - 全局统一类型系统
 *
 * 本文件定义了项目中所有类型的严格定义，完全杜绝 any 类型
 * 所有类型都经过精心设计，确保类型安全和可维护性
 *
 * @version 2.0.0
 * @author YYC³ Team
 * @license MIT
 */

// ============================================================================
// 第一部分：基础原语类型 (Primitive Types)
// ============================================================================

/**
 * 基础JSON值类型 - 替代 any
 */
export type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONObject
  | JSONArray

/**
 * JSON对象类型 - 替代 Record<string, any>
 */
export interface JSONObject {
  [key: string]: JSONValue
}

/**
 * JSON数组类型 - 替代 any[]
 */
export interface JSONArray extends Array<JSONValue> {}

/**
 * 元数据类型 - 用于存储附加信息
 */
export type Metadata = Record<string, string | number | boolean | undefined>

/**
 * 未知但类型安全的值 - 用于运行时确定类型的情况
 * 使用 unknown 而不是 any，强制类型检查
 */
export type SafeUnknown = unknown

/**
 * 字典类型 - 键值对集合
 */
export type Dictionary<T> = Record<string, T>

/**
 * 只读字典类型
 */
export type ReadonlyDictionary<T> = Readonly<Record<string, T>>

/**
 * 异步结果类型 - 包装 Promise 返回值
 */
export type AsyncResult<T> = Promise<{
  success: boolean
  data?: T
  error?: string
}>

// ============================================================================
// 第二部分：通用基础类型 (Common Base Types)
// ============================================================================

/**
 * 基础实体接口 - 所有数据模型的基础
 */
export interface BaseEntity {
  id: string
  createdAt: Date
  updatedAt?: Date
  deletedAt?: Date
}

/**
 * 可分页的基础类型
 */
export interface PaginatedBase {
  page: number
  pageSize: number
  total: number
  totalPages: number
  hasMore: boolean
}

/**
 * 时间戳相关
 */
export interface Timestamps {
  createdAt: Date
  updatedAt: Date
  expiresAt?: Date
  archivedAt?: Date
}

/**
 * 软删除支持
 */
export interface SoftDelete {
  isDeleted: boolean
  deletedAt?: Date
  deletedBy?: string
}

/**
 * 审计字段
 */
export interface AuditFields {
  createdBy: string
  updatedBy?: string
  version: number
}

/**
 * 分页参数
 */
export interface PaginationParams {
  page: number
  pageSize: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  filter?: FilterCondition
}

/**
 * 过滤条件
 */
export interface FilterCondition {
  field: string
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'contains' | 'startsWith' | 'endsWith'
  value: string | number | boolean | Array<string | number | boolean>
}

/**
 * 分页响应
 */
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
    hasMore: boolean
  }
}

/**
 * API响应基础类型
 */
export interface ApiResponseBase<T = JSONValue> {
  success: boolean
  data?: T
  error?: ErrorResponse
  message?: string
  timestamp: Date
  requestId?: string
}

/**
 * API成功响应
 */
export interface ApiSuccessResponse<T> extends ApiResponseBase<T> {
  success: true
  data: T
}

/**
 * API错误响应
 */
export interface ApiErrorResponse extends ApiResponseBase {
  success: false
  error: ErrorResponse
}

/**
 * 错误详情
 */
export interface ErrorResponse {
  code: string
  message: string
  details?: ErrorDetail[]
  stack?: string
}

/**
 * 错误详情项
 */
export interface ErrorDetail {
  field: string
  message: string
  code?: string
}

// ============================================================================
// 第三部分：用户和认证类型 (User & Authentication Types)
// ============================================================================

/**
 * 用户ID类型
 */
export type UserId = string

/**
 * 用户角色枚举
 */
export enum UserRole {
  PARENT = 'parent',
  GUARDIAN = 'guardian',
  EDUCATOR = 'educator',
  CHILD = 'child',
  ADMIN = 'admin',
  SYSTEM = 'system'
}

/**
 * 用户状态
 */
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending',
  DELETED = 'deleted'
}

/**
 * 用户类型
 */
export enum UserType {
  INDIVIDUAL = 'individual',
  ORGANIZATION = 'organization',
  TRIAL = 'trial'
}

/**
 * 性别
 */
export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
  PREFER_NOT_TO_SAY = 'prefer_not_to_say'
}

/**
 * 用户基础信息
 */
export interface User {
  id: UserId
  email: string
  phoneNumber?: string
  name: string
  avatar?: string
  role: UserRole
  status: UserStatus
  type: UserType
  preferences: UserPreferences
  profile: UserProfile
  metadata?: Metadata
}

/**
 * 用户偏好设置
 */
export interface UserPreferences {
  theme: Theme
  language: Language
  timezone: string
  notifications: NotificationSettings
  privacy: PrivacySettings
  accessibility: AccessibilitySettings
}

/**
 * 主题设置
 */
export interface Theme {
  mode: 'light' | 'dark' | 'auto'
  primaryColor: string
  fontSize: 'small' | 'medium' | 'large'
  highContrast: boolean
  reducedMotion: boolean
}

/**
 * 语言设置
 */
export enum Language {
  ZH_CN = 'zh-CN',
  EN_US = 'en-US',
  JA_JP = 'ja-JP',
  KO_KR = 'ko-KR'
}

/**
 * 通知设置
 */
export interface NotificationSettings {
  email: boolean
  push: boolean
  sms: boolean
  categories: NotificationCategory[]
  quietHours?: {
    enabled: boolean
    start: string // HH:mm format
    end: string // HH:mm format
  }
}

/**
 * 通知类别
 */
export interface NotificationCategory {
  type: 'system' | 'reminder' | 'promotion' | 'social' | 'security'
  enabled: boolean
  channels: Array<'email' | 'push' | 'sms'>
}

/**
 * 隐私设置
 */
export interface PrivacySettings {
  dataSharing: DataSharingLevel
  analytics: boolean
  personalization: boolean
  thirdPartySharing: boolean
}

/**
 * 数据共享级别
 */
export enum DataSharingLevel {
  NONE = 'none',
  MINIMAL = 'minimal',
  STANDARD = 'standard',
  EXTENSIVE = 'extensive'
}

/**
 * 无障碍设置
 */
export interface AccessibilitySettings {
  screenReader: boolean
  highContrast: boolean
  largeText: boolean
  reducedMotion: boolean
  voiceControl: boolean
  keyboardNavigation: boolean
}

/**
 * 用户详细资料
 */
export interface UserProfile {
  displayName?: string
  bio?: string
  gender?: Gender
  dateOfBirth?: Date
  location?: Location
  interests: string[]
  skills: string[]
  goals: UserGoal[]
}

/**
 * 地理位置
 */
export interface Location {
  country: string
  province?: string
  city?: string
  address?: string
  postalCode?: string
  latitude?: number
  longitude?: number
}

/**
 * 用户目标
 */
export interface UserGoal {
  id: string
  title: string
  description: string
  targetDate?: Date
  progress: number
  status: 'active' | 'completed' | 'paused' | 'cancelled'
}

/**
 * 认证信息
 */
export interface AuthInfo {
  userId: UserId
  token: string
  refreshToken?: string
  expiresAt: Date
  deviceInfo?: DeviceInfo
}

/**
 * 设备信息
 */
export interface DeviceInfo {
  deviceId: string
  deviceType: 'desktop' | 'tablet' | 'mobile' | 'unknown'
  os: string
  browser: string
  ipAddress: string
  userAgent: string
}

// ============================================================================
// 第四部分：儿童成长类型 (Child Growth Types)
// ============================================================================

/**
 * 儿童ID类型
 */
export type ChildId = string

/**
 * 性别（儿童专用）
 */
export type ChildGender = 'male' | 'female'

/**
 * 年龄段
 */
export enum AgeGroup {
  INFANT = 'infant',           // 0-1岁
  TODDLER = 'toddler',         // 1-3岁
  PRESCHOOL = 'preschool',     // 3-6岁
  EARLY_ELEMENTARY = 'early_elementary' // 6-9岁
}

/**
 * 发育领域
 */
export enum DevelopmentDomain {
  PHYSICAL = 'physical',
  COGNITIVE = 'cognitive',
  LANGUAGE = 'language',
  SOCIAL_EMOTIONAL = 'social_emotional',
  SELF_CARE = 'self_care',
  CREATIVE = 'creative'
}

/**
 * 里程碑类型
 */
export enum MilestoneType {
  COGNITIVE = 'cognitive',
  LANGUAGE = 'language',
  MOTOR = 'motor',
  SOCIAL = 'social',
  EMOTIONAL = 'emotional',
  SELF_CARE = 'self_care'
}

/**
 * 儿童档案
 */
export interface Child {
  id: ChildId
  userId: UserId
  name: string
  nickname?: string
  gender: ChildGender
  dateOfBirth: Date
  ageInMonths: number
  ageGroup: AgeGroup
  avatar?: string
  profile: ChildProfile
  health: ChildHealth
  development: ChildDevelopment
  milestones: Milestone[]
  guardians: Guardian[]
  tags: string[]
}

/**
 * 儿童详细资料
 */
export interface ChildProfile {
  personality: PersonalityTraits
  interests: Interest[]
  strengths: string[]
  challenges: string[]
  learningStyle: LearningStyle
  preferences: ChildPreferences
}

/**
 * 性格特质
 */
export interface PersonalityTraits {
  openness: number // 0-1
  conscientiousness: number
  extraversion: number
  agreeableness: number
  neuroticism: number
}

/**
 * 兴趣爱好
 */
export interface Interest {
  id: string
  category: string
  name: string
  description?: string
  proficiency: 'beginner' | 'intermediate' | 'advanced'
}

/**
 * 学习风格
 */
export enum LearningStyle {
  VISUAL = 'visual',
  AUDITORY = 'auditory',
  KINESTHETIC = 'kinesthetic',
  READING_WRITING = 'reading_writing',
  MULTIMODAL = 'multimodal'
}

/**
 * 儿童偏好
 */
export interface ChildPreferences {
  activityTypes: string[]
  subjects: string[]
  difficulty: 'easy' | 'medium' | 'hard'
  groupSize: 'individual' | 'small_group' | 'large_group'
  sessionDuration: number // minutes
}

/**
 * 儿童健康信息
 */
export interface ChildHealth {
  bloodType?: string
  allergies: Allergy[]
  medications: Medication[]
  dietaryRestrictions: string[]
  specialNeeds?: string
  emergencyContacts: EmergencyContact[]
}

/**
 * 过敏信息
 */
export interface Allergy {
  type: 'food' | 'environmental' | 'medication'
  allergen: string
  severity: 'mild' | 'moderate' | 'severe'
  reactions: string[]
}

/**
 * 用药信息
 */
export interface Medication {
  name: string
  dosage: string
  frequency: string
  startDate?: Date
  endDate?: Date
  notes?: string
}

/**
 * 紧急联系人
 */
export interface EmergencyContact {
  name: string
  relationship: string
  phoneNumber: string
  alternativePhone?: string
  email?: string
}

/**
 * 儿童发展信息
 */
export interface ChildDevelopment {
  assessments: DevelopmentAssessment[]
  goals: DevelopmentGoal[]
  records: DevelopmentRecord[]
  recommendations: Recommendation[]
}

/**
 * 发育评估
 */
export interface DevelopmentAssessment {
  id: string
  date: Date
  domain: DevelopmentDomain
  score: number // 0-100
  percentile: number
  notes: string
  assessor: string
}

/**
 * 发育目标
 */
export interface DevelopmentGoal {
  id: string
  domain: DevelopmentDomain
  title: string
  description: string
  targetDate: Date
  status: 'planned' | 'in_progress' | 'achieved' | 'delayed'
  progress: number // 0-100
  activities: Activity[]
}

/**
 * 发育记录
 */
export interface DevelopmentRecord {
  id: string
  date: Date
  type: 'observation' | 'achievement' | 'concern' | 'milestone'
  domain: DevelopmentDomain
  title: string
  description: string
  attachments: Attachment[]
  tags: string[]
  createdBy: string
}

/**
 * 里程碑
 */
export interface Milestone {
  id: string
  type: MilestoneType
  title: string
  description: string
  typicalAgeRange: AgeRange
  achievedAt?: Date
  status: 'pending' | 'achieved' | 'delayed'
  evidence: Evidence[]
}

/**
 * 年龄范围
 */
export interface AgeRange {
  min: number // months
  max: number // months
  typical: number // months
}

/**
 * 证据
 */
export interface Evidence {
  type: 'photo' | 'video' | 'audio' | 'note' | 'document'
  url: string
  description?: string
  date: Date
}

/**
 * 监护人信息
 */
export interface Guardian {
  id: string
  userId: UserId
  relationship: 'parent' | 'guardian' | 'grandparent' | 'sibling' | 'other'
  isPrimary: boolean
  custody: 'full' | 'joint' | 'partial'
  permissions: GuardianPermission[]
}

/**
 * 监护人权限
 */
export enum GuardianPermission {
  VIEW_PROFILE = 'view_profile',
  EDIT_PROFILE = 'edit_profile',
  VIEW_HEALTH = 'view_health',
  EDIT_HEALTH = 'edit_health',
  VIEW_DEVELOPMENT = 'view_development',
  EDIT_DEVELOPMENT = 'edit_development',
  VIEW_RECORDS = 'view_records',
  ADD_RECORDS = 'add_records',
  MANAGE_MILESTONES = 'manage_milestones',
  COMMUNICATE = 'communicate'
}

/**
 * 活动类型
 */
export interface Activity {
  id: string
  title: string
  description: string
  domain: DevelopmentDomain
  type: 'exercise' | 'game' | 'project' | 'routine' | 'assessment'
  duration: number // minutes
  difficulty: 'easy' | 'medium' | 'hard'
  materials: Material[]
  instructions: string[]
  objectives: string[]
}

/**
 * 活动材料
 */
export interface Material {
  name: string
  quantity: number
  type: 'physical' | 'digital' | 'consumable'
  optional: boolean
}

/**
 * 推荐建议
 */
export interface Recommendation {
  id: string
  category: 'activity' | 'resource' | 'consultation' | 'milestone'
  priority: 'low' | 'medium' | 'high'
  title: string
  description: string
  actionItems: string[]
  resources: Resource[]
}

/**
 * 资源类型
 */
export interface Resource {
  type: 'article' | 'video' | 'book' | 'game' | 'exercise' | 'tool'
  title: string
  url?: string
  description: string
  ageRange: AgeRange
  domains: DevelopmentDomain[]
}

// ============================================================================
// 第五部分：AI和智能类型 (AI & Intelligence Types)
// ============================================================================

/**
 * AI会话ID
 */
export type ConversationId = string

/**
 * 消息ID
 */
export type MessageId = string

/**
 * 消息角色
 */
export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system',
  FUNCTION = 'function'
}

/**
 * AI消息
 */
export interface AIMessage {
  id: MessageId
  conversationId: ConversationId
  role: MessageRole
  content: string
  timestamp: Date
  metadata: MessageMetadata
  multimodalContent?: MultimodalContent[]
  emotion?: EmotionData
  reasoning?: ReasoningData
}

/**
 * 消息元数据
 */
export interface MessageMetadata {
  model: string
  temperature?: number
  maxTokens?: number
  processingTime: number // milliseconds
  tokenCount: {
    prompt: number
    completion: number
    total: number
  }
  cost?: number
  context?: ConversationContext
}

/**
 * 会话上下文
 */
export interface ConversationContext {
  userId: UserId
  childId?: ChildId
  sessionId: string
  platform: 'web' | 'mobile' | 'api'
  history: MessageSummary[]
}

/**
 * 消息摘要
 */
export interface MessageSummary {
  messageId: MessageId
  role: MessageRole
  preview: string
  timestamp: Date
}

/**
 * 多模态内容
 */
export interface MultimodalContent {
  id: string
  type: 'text' | 'image' | 'audio' | 'video' | 'document' | 'file'
  content: BinaryData | TextData
  metadata: ContentMetadata
  analysis?: ContentAnalysis
}

/**
 * 二进制数据
 */
export interface BinaryData {
  data: ArrayBuffer
  mimeType: string
  size: number
  encoding?: string
}

/**
 * 文本数据
 */
export interface TextData {
  text: string
  language?: Language
  format?: 'plain' | 'markdown' | 'html' | 'richtext'
}

/**
 * 内容元数据
 */
export interface ContentMetadata {
  filename?: string
  mimeType: string
  size: number
  dimensions?: {
    width: number
    height: number
  }
  duration?: number
  thumbnailUrl?: string
  createdAt: Date
}

/**
 * 内容分析结果
 */
export interface ContentAnalysis {
  summary?: string
  sentiment?: SentimentAnalysis
  categories: string[]
  entities: Entity[]
  moderation: ModerationResult
  quality: QualityScore
}

/**
 * 情感分析
 */
export interface SentimentAnalysis {
  polarity: 'positive' | 'neutral' | 'negative'
  score: number // -1 to 1
  confidence: number // 0 to 1
}

/**
 * 实体
 */
export interface Entity {
  type: string
  text: string
  confidence: number
  startIndex: number
  endIndex: number
}

/**
 * 内容审核结果
 */
export interface ModerationResult {
  safe: boolean
  categories: ModerationCategory[]
  action: 'allow' | 'flag' | 'block'
  explanation?: string
}

/**
 * 审核类别
 */
export interface ModerationCategory {
  category: string
  detected: boolean
  severity: 'low' | 'medium' | 'high'
  confidence: number
}

/**
 * 质量评分
 */
export interface QualityScore {
  overall: number // 0-100
  clarity: number
  completeness: number
  relevance: number
  accuracy?: number
}

/**
 * 情感数据
 */
export interface EmotionData {
  primary: EmotionType
  secondary?: EmotionType
  intensity: number // 0-1
  confidence: number // 0-1
  valence?: number // -1 to 1 (negative to positive)
  arousal?: number // 0-1 (calm to excited)
}

/**
 * 情感类型
 */
export enum EmotionType {
  HAPPINESS = 'happiness',
  SADNESS = 'sadness',
  ANGER = 'anger',
  FEAR = 'fear',
  SURPRISE = 'surprise',
  DISGUST = 'disgust',
  NEUTRAL = 'neutral',
  EXCITEMENT = 'excitement',
  CURIOSITY = 'curiosity',
  COMFORT = 'comfort',
  DISCOMFORT = 'discomfort',
  ATTENTION = 'attention',
  PRIDE = 'pride',
  SHAME = 'shame',
  INTEREST = 'interest'
}

/**
 * 推理数据
 */
export interface ReasoningData {
  chainOfThought?: string[]
  confidence: number
  alternatives?: Alternative[]
  sources?: Source[]
}

/**
 * 替代方案
 */
export interface Alternative {
  solution: string
  confidence: number
  pros: string[]
  cons: string[]
}

/**
 * 信息来源
 */
export interface Source {
  type: 'knowledge' | 'web' | 'database' | 'user_provided'
  url?: string
  title: string
  author?: string
  date?: Date
  credibility: number // 0-1
}

/**
 * AI配置
 */
export interface AIConfig {
  model: string
  temperature: number
  maxTokens: number
  topP: number
  frequencyPenalty: number
  presencePenalty: number
  systemPrompt: string
  capabilities: AICapability[]
}

/**
 * AI能力
 */
export enum AICapability {
  TEXT_GENERATION = 'text_generation',
  IMAGE_GENERATION = 'image_generation',
  SPEECH_SYNTHESIS = 'speech_synthesis',
  SPEECH_RECOGNITION = 'speech_recognition',
  EMOTION_RECOGNITION = 'emotion_recognition',
  CONTENT_ANALYSIS = 'content_analysis',
  CODE_GENERATION = 'code_generation',
  TRANSLATION = 'translation',
  SUMMARIZATION = 'summarization',
  REASONING = 'reasoning'
}

/**
 * AI个人角色（Persona）
 */
export interface AIPersona {
  id: string
  name: string
  role: AIRole
  personality: PersonalityProfile
  knowledge: KnowledgeBase
  style: CommunicationStyle
  capabilities: AICapability[]
  targetAge: AgeGroup
  avatar?: string
}

/**
 * AI角色
 */
export enum AIRole {
  COMPANION = 'companion',
  MENTOR = 'mentor',
  TUTOR = 'tutor',
  GUARDIAN = 'guardian',
  STORYTELLER = 'storyteller',
  COACH = 'coach',
  ASSESSOR = 'assessor',
  ADVISOR = 'advisor'
}

/**
 * 性格档案
 */
export interface PersonalityProfile {
  friendliness: number // 0-1
  enthusiasm: number // 0-1
  patience: number // 0-1
  humor: number // 0-1
  formality: number // 0-1
  creativity: number // 0-1
}

/**
 * 沟通风格
 */
export interface CommunicationStyle {
  tone: 'formal' | 'casual' | 'friendly' | 'playful'
  complexity: 'simple' | 'moderate' | 'advanced'
  verbosity: 'concise' | 'balanced' 'detailed'
  language: Language
  useEmojis: boolean
  useStories: boolean
}

/**
 * 知识库
 */
export interface KnowledgeBase {
  domains: string[]
  topics: string[]
  expertise: string[]
  limitations: string[]
  lastUpdated: Date
}

// ============================================================================
// 第六部分：预测和分析类型 (Prediction & Analytics Types)
// ============================================================================

/**
 * 预测ID
 */
export type PredictionId = string

/**
 * 预测类型
 */
export enum PredictionType {
  FORECASTING = 'forecasting',
  CLASSIFICATION = 'classification',
  ANOMALY_DETECTION = 'anomaly_detection',
  REGRESSION = 'regression',
  RECOMMENDATION = 'recommendation'
}

/**
 * 预测结果
 */
export interface Prediction {
  id: PredictionId
  type: PredictionType
  target: string
  value: number | number[] | string | CategoricalPrediction
  confidence: number // 0-1
  timestamp: Date
  horizon?: number // prediction time steps
  modelInfo: ModelInfo
  features?: PredictionFeatures
  explanation?: PredictionExplanation
}

/**
 * 分类预测
 */
export interface CategoricalPrediction {
  category: string
  probability: number
  alternatives: Array<{
    category: string
    probability: number
  }>
}

/**
 * 模型信息
 */
export interface ModelInfo {
  modelId: string
  modelName: string
  modelType: string
  version: string
  trainedAt: Date
  accuracy?: number
}

/**
 * 预测特征
 */
export interface PredictionFeatures {
  names: string[]
  values: number[]
  importance?: number[] // feature importance scores
}

/**
 * 预测解释
 */
export interface PredictionExplanation {
  method: string
  factors: ExplanationFactor[]
  visualization?: VisualizationData
}

/**
 * 解释因素
 */
export interface ExplanationFactor {
  feature: string
  value: number
  contribution: number
  direction: 'positive' | 'negative'
}

/**
 * 可视化数据
 */
export interface VisualizationData {
  type: 'chart' | 'graph' | 'table' | 'heatmap'
  data: JSONValue
  config?: JSONValue
}

// ============================================================================
// 第七部分：媒体和附件类型 (Media & Attachment Types)
// ============================================================================

/**
 * 附件ID
 */
export type AttachmentId = string

/**
 * 附件类型
 */
export enum AttachmentType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  FILE = 'file'
}

/**
 * 附件
 */
export interface Attachment {
  id: AttachmentId
  type: AttachmentType
  filename: string
  originalName: string
  mimeType: string
  size: number // bytes
  url: string
  thumbnailUrl?: string
  metadata: AttachmentMetadata
  uploadedBy: string
  createdAt: Date
}

/**
 * 附件元数据
 */
export interface AttachmentMetadata {
  dimensions?: {
    width: number
    height: number
  }
  duration?: number // seconds (for audio/video)
  format?: string
  quality?: string
  location?: string
  tags: string[]
  description?: string
}

// ============================================================================
// 第八部分：通知和消息类型 (Notification & Message Types)
// ============================================================================

/**
 * 通知ID
 */
export type NotificationId = string

/**
 * 通知类型
 */
export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  REMINDER = 'reminder',
  MILESTONE = 'milestone',
  RECOMMENDATION = 'recommendation'
}

/**
 * 通知优先级
 */
export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

/**
 * 通知
 */
export interface Notification {
  id: NotificationId
  userId: UserId
  type: NotificationType
  priority: NotificationPriority
  title: string
  message: string
  data?: NotificationData
  isRead: boolean
  readAt?: Date
  expiresAt?: Date
  createdAt: Date
}

/**
 * 通知数据
 */
export interface NotificationData {
  actionUrl?: string
  actionLabel?: string
  entityId?: string
  entityType?: string
  metadata?: Metadata
}

// ============================================================================
// 第九部分：配置和设置类型 (Configuration & Settings Types)
// ============================================================================

/**
 * 系统配置类型
 */
export enum ConfigType {
  FEATURE = 'feature',
  AUTHENTICATION = 'authentication',
  DATABASE = 'database',
  STORAGE = 'storage',
  LOGGING = 'logging',
  MONITORING = 'monitoring',
  AI = 'ai'
}

/**
 * 系统配置
 */
export interface SystemConfig {
  id: string
  type: ConfigType
  key: string
  value: JSONValue
  description: string
  isPublic: boolean
  isEncrypted: boolean
  validation?: ConfigValidation
}

/**
 * 配置验证规则
 */
export interface ConfigValidation {
  type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'enum'
  required: boolean
  min?: number
  max?: number
  pattern?: RegExp
  enumValues?: JSONValue[]
  customValidation?: string
}

// ============================================================================
// 第十部分：错误和异常类型 (Error & Exception Types)
// ============================================================================

/**
 * 应用错误基类
 */
export interface AppError {
  code: ErrorCode
  message: string
  details?: ErrorDetails
  timestamp: Date
  userId?: UserId
  requestId?: string
}

/**
 * 错误代码枚举
 */
export enum ErrorCode {
  // 通用错误
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  UNAUTHORIZED = 'UNAUTHORIZED',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',

  // 业务错误
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  CHILD_NOT_FOUND = 'CHILD_NOT_FOUND',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',

  // AI相关错误
  AI_SERVICE_UNAVAILABLE = 'AI_SERVICE_UNAVAILABLE',
  AI_RATE_LIMIT_EXCEEDED = 'AI_RATE_LIMIT_EXCEEDED',
  AI_MODEL_ERROR = 'AI_MODEL_ERROR',
  AI_CONTENT_MODERATED = 'AI_CONTENT_MODERATED',

  // 文件错误
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  FILE_TYPE_NOT_ALLOWED = 'FILE_TYPE_NOT_ALLOWED',
  FILE_NOT_FOUND = 'FILE_NOT_FOUND',

  // 系统错误
  DATABASE_ERROR = 'DATABASE_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE'
}

/**
 * 错误详情
 */
export interface ErrorDetails {
  field?: string
  value?: JSONValue
  constraint?: string
  suggestions?: string[]
  stack?: string
}

// ============================================================================
// 第十一部分：日志和监控类型 (Logging & Monitoring Types)
// ============================================================================

/**
 * 日志级别
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal'
}

/**
 * 日志条目
 */
export interface LogEntry {
  timestamp: Date
  level: LogLevel
  category: string
  message: string
  data?: JSONValue
  userId?: UserId
  requestId?: string
  stack?: string
}

/**
 * 性能指标
 */
export interface PerformanceMetric {
  name: string
  value: number
  unit: string
  timestamp: Date
  tags?: Dictionary<string>
  metadata?: Metadata
}

// ============================================================================
// 第十二部分：工具类型 (Utility Types)
// ============================================================================

/**
 * 深度只读类型
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>
}

/**
 * 深度可选类型
 */
export type DeepOptional<T> = {
  [P in keyof T]?: DeepOptional<T[P]>
}

/**
 * 深度必需类型
 */
export type DeepRequired<T> = {
  [P in keyof T]-?: DeepRequired<T[P]>
}

/**
 * 提取特定属性
 */
export type PickByType<T, U> = {
  [P in keyof T as T[P] extends U ? P : never]: T[P]
}

/**
 * 排除特定属性
 */
export type OmitByType<T, U> = {
  [P in keyof T as T[P] extends U ? never : P]: T[P]
}

/**
 * 可空类型
 */
export type Nullable<T> = T | null

/**
 * 可能未定义类型
 */
export type Maybe<T> = T | undefined

/**
 * 创建对象类型（替代 Record<string, any>）
 */
export type TypedObject<T extends Record<string, unknown>> = T

/**
 * 严格函数类型
 */
export type StrictFunction<TArgs extends unknown[], TReturn> = (...args: TArgs) => TReturn

/**
 * 异步函数类型
 */
export type AsyncFunction<TArgs extends unknown[], TReturn> = (...args: TArgs) => Promise<TReturn>

/**
 * 事件处理器类型
 */
export type EventHandler<TEvent = unknown> = (event: TEvent) => void

/**
 * 组件Props类型
 */
export type ComponentProps<TComponent> = TComponent extends React.ComponentType<infer P> ? P : never

/**
 * 类型提取辅助
 */
export type ValuesOf<T> = T[keyof T]

/**
 * 枚举值类型
 */
export type EnumValues<T> = T[keyof T]

// ============================================================================
// 导出汇总
// ============================================================================

/**
 * 常用类型别名
 */
export type {
  // Next.js类型
  NextRequest,
  NextResponse,
  Metadata,
  NextPage
} from 'next/server'

export type {
  // React类型
  ComponentType,
  FC,
  PropsWithChildren,
  ReactNode,
  ReactElement,
  CSSProperties,
  MouseEvent,
  ChangeEvent,
  FormEvent
} from 'react'

/**
 * 实用工具类型
 */
export type {
  // 常用工具类型
  Partial,
  Required,
  Readonly,
  Pick,
  Omit,
  Exclude,
  Extract,
  ReturnType,
  Parameters,
  InstanceType,
  ThisType,
  OmitThisParameter
} from 'typescript'

/**
 * 全局类型常量
 */
export const GLOBAL_CONSTANTS = {
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
  MAX_UPLOAD_FILES: 10,
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  DEFAULT_TIMEOUT: 30000, // 30 seconds
  SESSION_DURATION: 24 * 60 * 60 * 1000, // 24 hours
  TOKEN_REFRESH_THRESHOLD: 5 * 60 * 1000 // 5 minutes
} as const

export type GlobalConstants = typeof GLOBAL_CONSTANTS

/**
 * 类型守卫
 */
export const TypeGuards = {
  isString: (value: unknown): value is string => typeof value === 'string',
  isNumber: (value: unknown): value is number => typeof value === 'number' && !isNaN(value),
  isBoolean: (value: unknown): value is boolean => typeof value === 'boolean',
  isObject: (value: unknown): value is JSONObject => typeof value === 'object' && value !== null && !Array.isArray(value),
  isArray: (value: unknown): value is JSONArray => Array.isArray(value),
  isNull: (value: unknown): value is null => value === null,
  isUndefined: (value: unknown): value is undefined => value === undefined,
  isFunction: (value: unknown): value is Function => typeof value === 'function',
  isDate: (value: unknown): value is Date => value instanceof Date,
  isEmpty: (value: unknown): boolean => {
    if (value === null || value === undefined) return true
    if (typeof value === 'string' || Array.isArray(value)) return value.length === 0
    if (typeof value === 'object') return Object.keys(value).length === 0
    return false
  }
}

/**
 * 断言工具
 */
export const Assertions = {
  assertDefined: <T>(value: T | undefined | null, message?: string): T => {
    if (value === undefined || value === null) {
      throw new Error(message || 'Value is undefined or null')
    }
    return value
  },
  assertString: (value: unknown, message?: string): string => {
    if (!TypeGuards.isString(value)) {
      throw new Error(message || 'Value is not a string')
    }
    return value
  },
  assertNumber: (value: unknown, message?: string): number => {
    if (!TypeGuards.isNumber(value)) {
      throw new Error(message || 'Value is not a number')
    }
    return value
  },
  assertObject: (value: unknown, message?: string): JSONObject => {
    if (!TypeGuards.isObject(value)) {
      throw new Error(message || 'Value is not an object')
    }
    return value
  },
  assertArray: (value: unknown, message?: string): JSONArray => {
    if (!TypeGuards.isArray(value)) {
      throw new Error(message || 'Value is not an array')
    }
    return value
  },
  assertNever: (value: never, message?: string): never => {
    throw new Error(message || `Unexpected value: ${value}`)
  }
}

/**
 * 类型转换工具
 */
export const TypeConverters = {
  toString: (value: unknown): string => String(value),
  toNumber: (value: unknown): number => Number(value),
  toBoolean: (value: unknown): boolean => Boolean(value),
  toJSON: (value: unknown): JSONValue => {
    try {
      return JSON.parse(JSON.stringify(value))
    } catch {
      throw new Error('Cannot convert to JSON')
    }
  }
}

/**
 * 默认值工具
 */
export const DefaultValues = {
  forString: (defaultValue: string = '') => (value: unknown): string => {
    return TypeGuards.isString(value) ? value : defaultValue
  },
  forNumber: (defaultValue: number = 0) => (value: unknown): number => {
    return TypeGuards.isNumber(value) ? value : defaultValue
  },
  forBoolean: (defaultValue: boolean = false) => (value: unknown): boolean => {
    return TypeGuards.isBoolean(value) ? value : defaultValue
  },
  forObject: <T extends JSONObject>(defaultValue: T) => (value: unknown): T => {
    return TypeGuards.isObject(value) ? value as T : defaultValue
  },
  forArray: <T extends unknown[]>(defaultValue: T) => (value: unknown): T => {
    return TypeGuards.isArray(value) ? value as T : defaultValue
  }
}

/**
 * 严格的不可变类型创建工具
 */
export const Immutable = {
  freeze: <T>(obj: T): DeepReadonly<T> => {
    return Object.freeze(obj) as DeepReadonly<T>
  },
  merge: <T extends object, U extends object>(obj1: T, obj2: U): T & U => {
    return Object.freeze({ ...obj1, ...obj2 }) as T & U
  }
}

/**
 * 日期工具
 */
export const DateUtils = {
  now: (): Date => new Date(),
  addDays: (date: Date, days: number): Date => {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
  },
  addMonths: (date: Date, months: number): Date => {
    const result = new Date(date)
    result.setMonth(result.getMonth() + months)
    return result
  },
  addYears: (date: Date, years: number): Date => {
    const result = new Date(date)
    result.setFullYear(result.getFullYear() + years)
    return result
  },
  diffInDays: (date1: Date, date2: Date): number => {
    const msPerDay = 1000 * 60 * 60 * 24
    return Math.floor((date2.getTime() - date1.getTime()) / msPerDay)
  },
  diffInMonths: (date1: Date, date2: Date): number => {
    const months1 = date1.getFullYear() * 12 + date1.getMonth()
    const months2 = date2.getFullYear() * 12 + date2.getMonth()
    return months2 - months1
  },
  diffInYears: (date1: Date, date2: Date): number => {
    return date2.getFullYear() - date1.getFullYear()
  },
  format: (date: Date, format: 'ISO' | 'DATE' | 'TIME' | 'DATETIME' | 'CUSTOM', customFormat?: string): string => {
    switch (format) {
      case 'ISO':
        return date.toISOString()
      case 'DATE':
        return date.toISOString().split('T')[0]
      case 'TIME':
        return date.toISOString().split('T')[1].split('.')[0]
      case 'DATETIME':
        return date.toISOString().split('.')[0].replace('T', ' ')
      case 'CUSTOM':
        return customFormat ? customFormat : date.toISOString()
      default:
        return date.toISOString()
    }
  },
  parse: (dateString: string): Date => {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date string')
    }
    return date
  },
  isValid: (date: unknown): boolean => {
    if (!(date instanceof Date)) return false
    return !isNaN(date.getTime())
  }
}

/**
 * 字符串工具
 */
export const StringUtils = {
  isEmpty: (str: unknown): boolean => {
    return !TypeGuards.isString(str) || str.trim().length === 0
  },
  isNotEmpty: (str: unknown): boolean => {
    return TypeGuards.isString(str) && str.trim().length > 0
  },
  truncate: (str: string, maxLength: number, suffix: string = '...'): string => {
    if (str.length <= maxLength) return str
    return str.substring(0, maxLength - suffix.length) + suffix
  },
  capitalize: (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1)
  },
  slugify: (str: string): string => {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  },
  random: (length: number = 10): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  },
  uuid: (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }
}

/**
 * 数值工具
 */
export const NumberUtils = {
  isInteger: (value: unknown): value is number => {
    return TypeGuards.isNumber(value) && Number.isInteger(value)
  },
  isFloat: (value: unknown): value is number => {
    return TypeGuards.isNumber(value) && !Number.isInteger(value)
  },
  isPositive: (value: unknown): boolean => {
    return TypeGuards.isNumber(value) && value > 0
  },
  isNegative: (value: unknown): boolean => {
    return TypeGuards.isNumber(value) && value < 0
  },
  isBetween: (value: unknown, min: number, max: number): boolean => {
    return TypeGuards.isNumber(value) && value >= min && value <= max
  },
  clamp: (value: number, min: number, max: number): number => {
    return Math.min(Math.max(value, min), max)
  },
  round: (value: number, precision: number = 0): number => {
    const multiplier = Math.pow(10, precision)
    return Math.round(value * multiplier) / multiplier
  },
  random: (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min
  },
  percentage: (value: number, total: number): number => {
    if (total === 0) return 0
    return (value / total) * 100
  }
}

/**
 * 集合工具
 */
export const CollectionUtils = {
  chunk: <T>(array: T[], size: number): T[][] => {
    const chunks: T[][] = []
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size))
    }
    return chunks
  },
  unique: <T>(array: T[]): T[] => {
    return Array.from(new Set(array))
  },
  shuffle: <T>(array: T[]): T[] => {
    const result = [...array]
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[result[i], result[j]] = [result[j], result[i]]
    }
    return result
  },
  groupBy: <T, K extends string | number>(
    array: T[],
    keyFn: (item: T) => K
  ): Record<K, T[]> => {
    return array.reduce((result, item) => {
      const key = keyFn(item)
      if (!result[key]) {
        result[key] = []
      }
      result[key].push(item)
      return result
    }, {} as Record<K, T[]>)
  },
  partition: <T>(array: T[], predicate: (item: T) => boolean): [T[], T[]] => {
    return array.reduce(
      ([pass, fail], item) => {
        return predicate(item) ? [[...pass, item], fail] : [pass, [...fail, item]]
      },
      [[], []] as [T[], T[]]
    )
  }
}

/**
 * 对象工具
 */
export const ObjectUtils = {
  omit: <T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
    const result = { ...obj }
    keys.forEach(key => delete result[key])
    return result
  },
  pick: <T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
    const result = {} as Pick<T, K>
    keys.forEach(key => {
      if (key in obj) {
        result[key] = obj[key]
      }
    })
    return result
  },
  merge: <T extends object, U extends object>(obj1: T, obj2: U): T & U => {
    return { ...obj1, ...obj2 } as T & U
  },
  deepMerge: <T extends object, U extends object>(obj1: T, obj2: U): T & U => {
    const result = { ...obj1 } as T & U

    for (const key in obj2) {
      if (Object.prototype.hasOwnProperty.call(obj2, key)) {
        const value1 = (result as any)[key]
        const value2 = (obj2 as any)[key]

        if (TypeGuards.isObject(value1) && TypeGuards.isObject(value2)) {
          (result as any)[key] = ObjectUtils.deepMerge(value1, value2)
        } else {
          (result as any)[key] = value2
        }
      }
    }

    return result
  },
  clone: <T extends object>(obj: T): T => {
    return JSON.parse(JSON.stringify(obj))
  },
  isEmpty: (obj: unknown): boolean => {
    if (!TypeGuards.isObject(obj)) return true
    return Object.keys(obj).length === 0
  }
}

/**
 * 函数工具
 */
export const FunctionUtils = {
  debounce: <T extends unknown[]>(
    func: (...args: T) => void,
    wait: number
  ): ((...args: T) => void) => {
    let timeout: ReturnType<typeof setTimeout> | null = null
    return (...args: T) => {
      if (timeout !== null) {
        clearTimeout(timeout)
      }
      timeout = setTimeout(() => func(...args), wait)
    }
  },
  throttle: <T extends unknown[]>(
    func: (...args: T) => void,
    limit: number
  ): ((...args: T) => void) => {
    let inThrottle: boolean
    return (...args: T) => {
      if (!inThrottle) {
        func(...args)
        inThrottle = true
        setTimeout(() => (inThrottle = false), limit)
      }
    }
  },
  memoize: <T extends unknown[], R>(
    func: (...args: T) => R
  ): ((...args: T) => R) => {
    const cache = new Map<string, R>()
    return (...args: T) => {
      const key = JSON.stringify(args)
      if (!cache.has(key)) {
        cache.set(key, func(...args))
      }
      return cache.get(key)!
    }
  },
  once: <T extends unknown[]>(
    func: (...args: T) => void
  ): ((...args: T) => void) => {
    let called = false
    let result: void
    return (...args: T) => {
      if (!called) {
        called = true
        result = func(...args)
      }
      return result
    }
  }
}

/**
 * 验证工具
 */
export const ValidationUtils = {
  email: (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  },
  phone: (phone: string, countryCode: string = 'CN'): boolean => {
    if (countryCode === 'CN') {
      return /^1[3-9]\d{9}$/.test(phone)
    }
    return /^\+?[\d\s-]+$/.test(phone)
  },
  url: (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  },
  uuid: (uuid: string): boolean => {
    const re = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    return re.test(uuid)
  },
  date: (date: string): boolean => {
    const parsed = new Date(date)
    return !isNaN(parsed.getTime())
  },
  strength: {
    password: (password: string): {
      score: number
      level: 'weak' | 'medium' | 'strong'
    } => {
      let score = 0

      if (password.length >= 8) score++
      if (password.length >= 12) score++
      if (/[a-z]/.test(password)) score++
      if (/[A-Z]/.test(password)) score++
      if (/[0-9]/.test(password)) score++
      if (/[^a-zA-Z0-9]/.test(password)) score++

      let level: 'weak' | 'medium' | 'strong' = 'weak'
      if (score >= 4) level = 'medium'
      if (score >= 6) level = 'strong'

      return { score, level }
    }
  }
}

/**
 * 类型断言 - 严格类型安全的断言
 */
export const TypeAssertion = {
  isArray: <T>(value: unknown, guard: (item: unknown) => item is T): value is T[] => {
    return Array.isArray(value) && value.every(guard)
  },
  isRecord: <T extends Record<string, unknown>>(
    value: unknown,
    guard: (item: unknown) => item is T
  ): value is T => {
    return TypeGuards.isObject(value) &&
      Object.entries(value).every(([k, v]) =>
        typeof k === 'string' && guard(v)
      )
  }
}

/**
 * 错误工厂
 */
export const ErrorFactory = {
  create: (code: ErrorCode, message: string, details?: ErrorDetails): AppError => ({
    code,
    message,
    details,
    timestamp: new Date()
  }),

  notFound: (entity: string, id: string): AppError => ({
    code: ErrorCode.NOT_FOUND,
    message: `${entity} with id '${id}' not found`,
    timestamp: new Date()
  }),

  unauthorized: (message: string = 'Unauthorized'): AppError => ({
    code: ErrorCode.UNAUTHORIZED,
    message,
    timestamp: new Date()
  }),

  forbidden: (message: string = 'Forbidden'): AppError => ({
    code: ErrorCode.PERMISSION_DENIED,
    message,
    timestamp: new Date()
  }),

  validation: (field: string, value: JSONValue, constraint: string): AppError => ({
    code: ErrorCode.VALIDATION_ERROR,
    message: `Validation failed for field '${field}'`,
    details: { field, value, constraint },
    timestamp: new Date()
  }),

  internal: (message: string, originalError?: Error): AppError => ({
    code: ErrorCode.INTERNAL_SERVER_ERROR,
    message,
    details: {
      suggestions: ['Please try again later', 'Contact support if issue persists'],
      stack: originalError?.stack
    },
    timestamp: new Date()
  })
}

// ============================================================================
// 最终导出
// ============================================================================

export * from './prediction/common'
export * from './ai'
export * from './orchestrator/common'
export * from './gateway/common'
export * from './knowledge/common'
export * from './learning/common'
export * from './goals/common'
export * from './tools/common'
export * from './database'
