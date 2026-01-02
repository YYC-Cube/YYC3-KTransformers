# YYC³ AI技术架构与API文档

## 📋 系统架构概览

### 整体架构图
```
┌─────────────────────────────────────────────────────────┐
│                   用户界面层 (Frontend)                      │
├─────────────────────────────────────────────────────────┤
│  React Components  │  State Management  │  Animation      │
│  - XiaoyuAvatar    │  - Redux Toolkit    │  - Framer Motion │
│  - EmotionDisplay  │  - Persist Store     │  - GSAP          │
│  - VoiceInteraction│  - Middleware        │  - Transitions   │
└─────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────┐
│                   AI服务层 (AI Services)                   │
├─────────────────────────────────────────────────────────┤
│  情感智能引擎     │  语音交互系统        │  拖拽AI系统        │
│  - EmotionAI      │  - VoiceAI           │  - DraggableAI   │
│  - MultiModal      │  - SpeechRecognition │  - PhysicsEngine │
│  - MemoryEngine    │  - TextToSpeech      │  - BoundsCheck   │
└─────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────┐
│                   数据层 (Data Layer)                      │
├─────────────────────────────────────────────────────────┤
│  数据库           │  缓存系统            │  实时通信         │
│  - Supabase       │  - Redis Cache       │  - WebSocket     │
│  - PostgreSQL     │  - LocalStorage      │  - SSE Events    │
│  - Vector DB      │  - Session Storage   │  - Push Notifications│
└─────────────────────────────────────────────────────────┘
```

---

## 🧠 情感智能引擎 API

### 核心接口

#### POST /api/emotion/analyze
**功能**：多模态情感分析
```typescript
interface EmotionAnalysisRequest {
  data: {
    text?: string;           // 文本内容
    audio?: Blob;           // 音频数据
    video?: Blob;           // 视频数据
    context?: EmotionContext; // 上下文信息
  };
  userId: string;
  childId: string;
  timestamp: string;
}

interface EmotionAnalysisResponse {
  emotion: {
    primary: EmotionType;     // 主要情感
    secondary?: EmotionType;   // 次要情感
    confidence: number;        // 置信度 0-1
    intensity: number;        // 情感强度 0-1
  };
  multiModal: {
    text: TextEmotionResult;
    audio: AudioEmotionResult;
    visual: VisualEmotionResult;
    behavior: BehaviorEmotionResult;
  };
  suggestions: string[];      // AI建议
  nextActions: ActionPlan[];   // 后续行动
}
```

#### GET /api/emotion/history
**功能**：情感历史记录
```typescript
interface EmotionHistoryRequest {
  childId: string;
  startDate: string;
  endDate: string;
  emotionType?: EmotionType;
  limit?: number;
  offset?: number;
}

interface EmotionHistoryResponse {
  records: EmotionRecord[];
  statistics: {
    emotionDistribution: Record<EmotionType, number>;
    trends: EmotionTrend[];
    insights: string[];
  };
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
}
```

#### POST /api/emotion/memory
**功能**：情感记忆存储
```typescript
interface EmotionMemoryRequest {
  childId: string;
  emotionData: EmotionData;
  interactionData: InteractionData;
  context: InteractionContext;
  learningUpdate?: LearningData;
}

interface EmotionMemoryResponse {
  memoryId: string;
  storageStatus: 'success' | 'partial' | 'failed';
  updatedPatterns: EmotionalPattern[];
  predictionAccuracy: number;
}
```

---

## 🎙️ 语音交互系统 API

### 核心接口

#### POST /api/voice/recognize
**功能**：语音识别（特别优化0-3岁）
```typescript
interface VoiceRecognitionRequest {
  audioData: Blob;
  audioFormat: {
    sampleRate: number;
    channels: number;
    bitDepth: number;
  };
  recognitionMode: 'general' | 'baby-cry' | 'babble' | 'speech';
  childAge: number;        // 年龄段
  context?: string;        // 上下文提示
}

interface VoiceRecognitionResponse {
  recognized: {
    text: string;
    confidence: number;
    alternatives: AlternativeText[];
  };
  audioAnalysis: {
    cryType?: CryType;      // 哭声类型分析
    emotionalTone: string;  // 情感语调
    volume: number;         // 音量分析
    clarity: number;        // 清晰度
  };
  processingTime: number;   // 处理时间（毫秒）
}
```

#### POST /api/voice/speak
**功能**：语音合成（情感化）
```typescript
interface VoiceSynthesisRequest {
  text: string;
  voiceProfile: {
    type: 'gentle-mother' | 'playful-friend' | 'calm-teacher';
    age: 'infant' | 'toddler' | 'preschooler';
    emotion: EmotionType;
    intensity: number;      // 情感强度
  };
  audioSettings: {
    rate: number;           // 语速
    pitch: number;          // 音调
    volume: number;         // 音量
    clarity: number;        // 清晰度
  };
}

interface VoiceSynthesisResponse {
  audioData: Blob;          // 合成音频
  audioFormat: string;      // 音频格式
  duration: number;         // 音频时长
  metadata: {
    synthesisTime: number;
    voiceModel: string;
    emotionProfile: string;
  };
}
```

#### POST /api/voice/cry-analysis
**功能**：哭声分析（0-1岁特化）
```typescript
interface CryAnalysisRequest {
  audioData: Blob;
  infantAge: number;        // 婴儿年龄（月）
  contextTime: string;      // 时间上下文
  recentEvents: string[];   // 最近事件
}

interface CryAnalysisResponse {
  analysis: {
    cryType: CryType;       // 哭声类型
    urgencyLevel: number;   // 紧急程度
    possibleNeeds: NeedType[];
    confidence: number;      // 分析置信度
  };
  recommendations: {
    immediate: string[];     // 立即行动
    soothing: string[];      // 安抚建议
    monitoring: string[];    // 监控要点
  };
  learning: {
    patternUpdate: boolean;  // 模式更新
    preferenceUpdate: boolean; // 偏好更新
  };
}
```

---

## 🖱️ 拖拽AI系统 API

### 核心接口

#### POST /api/draggable/position
**功能**：拖拽位置管理
```typescript
interface PositionRequest {
  userId: string;
  componentId: string;
  position: {
    x: number;
    y: number;
    container: 'main' | 'sidebar' | 'floating';
  };
  state: {
    isMinimized: boolean;
    isLocked: boolean;
    zIndex: number;
  };
}

interface PositionResponse {
  success: boolean;
  savedPosition: Position;
  bounds: {
    container: Rectangle;
    screen: Rectangle;
    safeZone: Rectangle;
  };
  suggestions: PositionSuggestion[];
}
```

#### GET /api/draggable/config
**功能**：拖拽配置获取
```typescript
interface DraggableConfigRequest {
  userId: string;
  childId?: string;
  deviceType: 'desktop' | 'tablet' | 'mobile';
  userRole: 'parent' | 'child' | 'guest';
}

interface DraggableConfigResponse {
  config: {
    enabled: boolean;
    constraints: DraggableConstraints;
    animations: AnimationConfig;
    safeMode: boolean;
  };
  presets: PositionPreset[];
  behaviorPatterns: BehaviorPattern[];
}
```

---

## 👶 婴幼儿特化 API

### 0-3岁成长里程碑 API

#### GET /api/milestones/age-appropriate
**功能**：获取适龄里程碑
```typescript
interface MilestoneRequest {
  childAge: number;         // 年龄（月）
  developmentArea: DevelopmentArea;
  includeCompleted: boolean;
}

interface MilestoneResponse {
  currentMilestones: Milestone[];
  upcomingMilestones: Milestone[];
  completedMilestones: Milestone[];
  assessment: {
    developmentLevel: string;
    strengths: string[];
    areasForGrowth: string[];
    recommendations: string[];
  };
}
```

#### POST /api/milestones/record
**功能**：记录里程碑达成
```typescript
interface MilestoneRecordRequest {
  childId: string;
  milestoneId: string;
  achievement: {
    date: string;
    context: string;
    evidence?: EvidenceData[];
    adultObservations: string[];
  };
  media?: {
    photos: string[];
    videos: string[];
    audioNotes: string[];
  };
}

interface MilestoneRecordResponse {
  success: boolean;
  recordId: string;
  aiInsights: {
    significance: string;
    nextSteps: string[];
    celebrationSuggestions: string[];
  };
  sharing: {
    familyShare: ShareConfig;
    pediatricianShare: ShareConfig;
  };
}
```

---

## 🎨 形象动画 API

### 表情和动画系统

#### POST /api/avatar/expression
**功能**：表情设置和动画
```typescript
interface ExpressionRequest {
  emotion: EmotionType;
  intensity: number;
  duration: number;
  context: InteractionContext;
  childAge: number;
}

interface ExpressionResponse {
  animationData: {
    keyframes: Keyframe[];
    duration: number;
    easing: string;
  };
  facialExpression: {
    eyeExpression: EyeExpression;
    mouthExpression: MouthExpression;
    eyebrowExpression: EyebrowExpression;
  };
  bodyLanguage: BodyLanguageData;
  voiceTone: VoiceToneData;
}
```

#### GET /api/avatar/animations
**功能**：获取动画库
```typescript
interface AnimationLibraryRequest {
  category: 'emotions' | 'actions' | 'reactions' | 'learning';
  ageGroup: 'infant' | 'toddler' | 'preschooler';
  emotionType?: EmotionType;
}

interface AnimationLibraryResponse {
  animations: AnimationItem[];
  customAnimations: CustomAnimation[];
  favorites: string[];
  recentlyUsed: string[];
}
```

---

## 🔧 系统配置 API

### 个性化设置

#### GET /api/config/personalization
**功能**：获取个性化配置
```typescript
interface PersonalizationConfigResponse {
  child: {
    name: string;
    age: number;
    interests: string[];
    learningStyle: LearningStyle;
    sensitivityLevel: SensitivityLevel;
  };
  ai: {
    personality: AIPersonality;
    responseStyle: ResponseStyle;
    interactionMode: InteractionMode;
    learningAdaptation: LearningAdaptation;
  };
  interface: {
    theme: ThemeConfig;
    animations: AnimationConfig;
    voiceSettings: VoiceConfig;
    accessibility: AccessibilityConfig;
  };
}
```

#### POST /api/config/personalization
**功能**：更新个性化配置
```typescript
interface PersonalizationUpdateRequest {
  updates: {
    child?: Partial<ChildConfig>;
    ai?: Partial<AIConfig>;
    interface?: Partial<InterfaceConfig>;
  };
  applyToAllSessions: boolean;
  reason: string;
}
```

---

## 📊 数据分析 API

### 成长分析报告

#### GET /api/analytics/growth-report
**功能**：生成成长分析报告
```typescript
interface GrowthReportRequest {
  childId: string;
  reportType: 'weekly' | 'monthly' | 'quarterly';
  dateRange: {
    startDate: string;
    endDate: string;
  };
  includeMetrics: ReportMetric[];
}

interface GrowthReportResponse {
  overview: {
    summary: string;
    keyAchievements: string[];
    areasOfProgress: string[];
    recommendations: string[];
  };
  detailedMetrics: {
    emotionalDevelopment: EmotionMetrics;
    cognitiveDevelopment: CognitiveMetrics;
    languageDevelopment: LanguageMetrics;
    socialDevelopment: SocialMetrics;
    motorDevelopment: MotorMetrics;
  };
  visualizations: {
    charts: ChartData[];
    trends: TrendData[];
    comparisons: ComparisonData[];
  };
  insights: AIInsight[];
}
```

---

## 🔐 安全与隐私 API

### 数据保护

#### GET /api/privacy/data-export
**功能**：数据导出（GDPR合规）
```typescript
interface DataExportRequest {
  userId: string;
  dataTypes: ('profile' | 'interactions' | 'media' | 'analytics')[];
  format: 'json' | 'csv' | 'pdf';
  dateRange?: {
    startDate: string;
    endDate: string;
  };
}

interface DataExportResponse {
  exportId: string;
  status: 'processing' | 'completed' | 'failed';
  downloadUrl?: string;
  expiration: string;
  includedDataTypes: string[];
}
```

#### DELETE /api/privacy/data-delete
**功能**：数据删除（被遗忘权）
```typescript
interface DataDeleteRequest {
  userId: string;
  confirmationCode: string;
  deleteTypes: ('all' | 'interactions' | 'media' | 'analytics')[];
  reason?: string;
}

interface DataDeleteResponse {
  deletionId: string;
  status: 'processing' | 'completed' | 'failed';
  deletedItems: string[];
  retentionPeriod: string;
}
```

---

## 🔄 实时通信 API

### WebSocket 消息格式

#### 连接建立
```typescript
// 连接URL
const wsUrl = `wss://api.yyc3.ai/ws?token=${authToken}&childId=${childId}`;

// 连接消息
interface ConnectionMessage {
  type: 'connect';
  payload: {
    userId: string;
    childId: string;
    deviceInfo: DeviceInfo;
    capabilities: string[];
  };
}
```

#### 实时事件
```typescript
interface RealTimeEvent {
  type: 'emotion_detected' | 'milestone_achieved' | 'ai_response' | 'system_alert';
  timestamp: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  payload: {
    eventId: string;
    data: any;
    requiresAction: boolean;
    actionUrl?: string;
  };
}
```

---

## 📱 SDK 集成指南

### JavaScript SDK
```typescript
// 初始化SDK
import { YYC3SDK } from '@yyc3/sdk';

const sdk = new YYC3SDK({
  apiKey: process.env.NEXT_PUBLIC_YYC3_API_KEY,
  environment: 'development',
  childId: 'child-001'
});

// 情感分析
const emotionResult = await sdk.emotion.analyze({
  text: "宝宝今天很开心",
  audio: audioBlob,
  childAge: 24
});

// 语音合成
const audioBuffer = await sdk.voice.speak({
  text: "你好呀，小语陪你玩耍！",
  voiceProfile: 'gentle-mother',
  emotion: 'happiness'
});

// 拖拽AI
const draggableAI = sdk.draggable.create({
  component: 'xiaoyu-avatar',
  position: { x: 100, y: 100 },
  constraints: { within: 'parent' }
});
```

### React Hook
```typescript
import { useEmotionAnalysis, useVoiceInteraction } from '@yyc3/react-hooks';

function EmotionDisplay({ childId }: { childId: string }) {
  const { emotion, isLoading, analyze } = useEmotionAnalysis(childId);

  const handleVoiceInput = async (audioData: Blob) => {
    const result = await analyze({ audio: audioData });
    console.log('情感分析结果:', result);
  };

  return (
    <div>
      <p>当前情感: {emotion?.primary}</p>
      <button onClick={() => startRecording()}>
        开始录音
      </button>
    </div>
  );
}
```

---

## 🔍 错误处理和状态码

### 标准错误格式
```typescript
interface APIError {
  error: {
    code: string;             // 错误代码
    message: string;          // 错误信息
    details?: any;            // 详细信息
    timestamp: string;        // 错误时间
    requestId: string;        // 请求ID
  };
  meta: {
    endpoint: string;         // API端点
    method: string;           // HTTP方法
    statusCode: number;       // HTTP状态码
  };
}
```

### 常见错误码
- `EMOTION_ANALYSIS_FAILED` (4001): 情感分析失败
- `VOICE_RECOGNITION_ERROR` (5001): 语音识别错误
- `DRAG_CONSTRAINT_VIOLATION` (3001): 拖拽约束违规
- `CHILD_NOT_FOUND` (2001): 儿童信息未找到
- `RATE_LIMIT_EXCEEDED` (9001): 请求频率超限
- `SERVICE_UNAVAILABLE` (5000): 服务不可用

---

## 📈 性能监控

### 监控指标
```typescript
interface PerformanceMetrics {
  api: {
    responseTime: number;      // 响应时间
    throughput: number;        // 吞吐量
    errorRate: number;         // 错误率
    availability: number;      // 可用性
  };
  ai: {
    modelInferenceTime: number; // 模型推理时间
    accuracyMetrics: Record<string, number>; // 准确率指标
    resourceUsage: ResourceUsage; // 资源使用
  };
  user: {
    sessionDuration: number;   // 会话时长
    interactionRate: number;   // 交互频率
    satisfactionScore: number; // 满意度评分
  };
}
```

---

## 📚 更新日志

### v1.0.0 (2024-12-04)
- ✅ 初始API架构设计
- ✅ 情感智能引擎API
- ✅ 语音交互系统API
- ✅ 拖拽AI系统API
- ✅ 婴幼儿特化API
- ✅ 实时通信API

### v1.1.0 (计划中)
- 🔄 多语言支持API
- 🔄 高级情感分析API
- 🔄 家长协作API
- 🔄 数据导出API

---

*文档版本：v1.0.0*
*最后更新：2024-12-04*
*API版本：v1*
*下次更新：根据开发进度实时更新*