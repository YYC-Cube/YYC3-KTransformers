/**
 * YYC³ AI小语智能成长守护系统 - AI助手状态管理
 * 专注0-3岁婴幼儿AI助手交互和情感状态管理
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { EmotionType } from '@/lib/ai/emotion-engine'

// 为EmotionType添加缺少的类型（如果不存在）
const EmotionTypeExtended = {
  ...EmotionType,
  CONFUSION: 'confusion' as const,
  EXCITEMENT: 'excitement' as const
} as const

type ExtendedEmotionType = EmotionType | typeof EmotionTypeExtended.CONFUSION | typeof EmotionTypeExtended.EXCITEMENT

// AI助手消息类型
export interface AIMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  emotion?: ExtendedEmotionType
  attachments?: {
    type: 'image' | 'audio' | 'video'
    url: string
    caption?: string
  }[]
}

// AI助手状态
export interface AIAssistantState {
  // 基础状态
  isVisible: boolean
  position: { x: number; y: number }
  isMinimized: boolean
  isLocked: boolean
  isActive: boolean

  // 情感状态
  currentEmotion: ExtendedEmotionType
  emotionIntensity: number

  // 对话状态
  isTyping: boolean
  currentMessage: string
  messages: AIMessage[]
  conversationId: string

  // 交互状态
  lastInteraction: string
  interactionCount: number
  sessionDuration: number

  // 响应状态
  isProcessing: boolean
  pendingRequests: string[]

  // 个性化设置
  personality: 'gentle' | 'energetic' | 'educational' | 'playful'
  responseStyle: 'simple' | 'detailed' | 'interactive'
  emotionalResponsiveness: number // 0-1
}

// 初始状态
const initialState: AIAssistantState = {
  // 基础状态
  isVisible: true,
  position: { x: 100, y: 100 },
  isMinimized: false,
  isLocked: false,
  isActive: false,

  // 情感状态
  currentEmotion: EmotionType.HAPPINESS,
  emotionIntensity: 0.7,

  // 对话状态
  isTyping: false,
  currentMessage: '',
  messages: [],
  conversationId: '',

  // 交互状态
  lastInteraction: new Date().toISOString(),
  interactionCount: 0,
  sessionDuration: 0,

  // 响应状态
  isProcessing: false,
  pendingRequests: [],

  // 个性化设置
  personality: 'gentle',
  responseStyle: 'interactive',
  emotionalResponsiveness: 0.8
}

// 异步Action - 发送消息给AI
export const sendAIMessage = createAsyncThunk(
  'aiAssistant/sendMessage',
  async (payload: { message: string; childId?: string; context?: string }) => {
    // 模拟AI响应延迟
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

    // 这里应该调用实际的AI服务
    const mockResponse: AIMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: generateAIResponse(payload.message),
      timestamp: new Date(),
      emotion: detectResponseEmotion(payload.message)
    }

    return mockResponse
  }
)

// 异步Action - 分析情感并更新AI状态
export const analyzeAndUpdateEmotion = createAsyncThunk(
  'aiAssistant/analyzeEmotion',
  async (payload: { text: string; childId: string; context?: string }) => {
    // 这里应该调用实际的情感分析服务
    const analyzedEmotion = analyzeTextEmotion(payload.text)

    return {
      emotion: analyzedEmotion.emotion,
      intensity: analyzedEmotion.intensity,
      timestamp: new Date().toISOString()
    }
  }
)

// AI助手Slice
const aiAssistantSlice = createSlice({
  name: 'aiAssistant',
  initialState,
  reducers: {
    // 显示控制
    showAIAssistant: (state) => {
      state.isVisible = true
      state.isActive = true
      state.lastInteraction = new Date().toISOString()
    },

    hideAIAssistant: (state) => {
      state.isVisible = false
      state.isActive = false
    },

    toggleAIAssistant: (state) => {
      state.isVisible = !state.isVisible
      state.isActive = state.isVisible
      state.lastInteraction = new Date().toISOString()
    },

    // 位置控制
    setAIAssistantPosition: (state, action: PayloadAction<{ x: number; y: number }>) => {
      state.position = action.payload
    },

    // 最小化控制
    minimizeAIAssistant: (state) => {
      state.isMinimized = true
    },

    restoreAIAssistant: (state) => {
      state.isMinimized = false
    },

    toggleMinimizeAIAssistant: (state) => {
      state.isMinimized = !state.isMinimized
    },

    // 锁定控制
    lockAIAssistant: (state) => {
      state.isLocked = true
    },

    unlockAIAssistant: (state) => {
      state.isLocked = false
    },

    toggleLockAIAssistant: (state) => {
      state.isLocked = !state.isLocked
    },

    // 情感状态
    setAIEmotion: (state, action: PayloadAction<ExtendedEmotionType>) => {
      state.currentEmotion = action.payload
      state.lastInteraction = new Date().toISOString()
    },

    setAIEmotionIntensity: (state, action: PayloadAction<number>) => {
      state.emotionIntensity = Math.max(0, Math.min(1, action.payload))
    },

    updateEmotionalState: (state, action: PayloadAction<{ emotion: ExtendedEmotionType; intensity: number }>) => {
      state.currentEmotion = action.payload.emotion
      state.emotionIntensity = Math.max(0, Math.min(1, action.payload.intensity))
      state.lastInteraction = new Date().toISOString()
    },

    // 对话管理
    addUserMessage: (state, action: PayloadAction<{ content: string; attachments?: AIMessage['attachments'] }>) => {
      const message: AIMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: action.payload.content,
        timestamp: new Date(),
        attachments: action.payload.attachments
      }
      state.messages.push(message)
      state.interactionCount += 1
      state.lastInteraction = new Date().toISOString()
    },

    addAIMessage: (state, action: PayloadAction<AIMessage>) => {
      state.messages.push(action.payload)
      state.lastInteraction = new Date().toISOString()
    },

    setAIMessages: (state, action: PayloadAction<AIMessage[]>) => {
      state.messages = action.payload
    },

    clearMessages: (state) => {
      state.messages = []
      state.conversationId = Date.now().toString()
    },

    deleteMessage: (state, action: PayloadAction<string>) => {
      state.messages = state.messages.filter(msg => msg.id !== action.payload)
    },

    // 输入状态
    setCurrentMessage: (state, action: PayloadAction<string>) => {
      state.currentMessage = action.payload
    },

    clearCurrentMessage: (state) => {
      state.currentMessage = ''
    },

    setTyping: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload
    },

    // 处理状态
    setProcessing: (state, action: PayloadAction<boolean>) => {
      state.isProcessing = action.payload
    },

    addPendingRequest: (state, action: PayloadAction<string>) => {
      if (!state.pendingRequests.includes(action.payload)) {
        state.pendingRequests.push(action.payload)
      }
    },

    removePendingRequest: (state, action: PayloadAction<string>) => {
      state.pendingRequests = state.pendingRequests.filter(req => req !== action.payload)
    },

    clearPendingRequests: (state) => {
      state.pendingRequests = []
    },

    // 会话管理
    startNewSession: (state) => {
      state.conversationId = Date.now().toString()
      state.sessionDuration = 0
      state.interactionCount = 0
      state.lastInteraction = new Date().toISOString()
    },

    setSessionDuration: (state, action: PayloadAction<number>) => {
      state.sessionDuration = action.payload
    },

    incrementSessionDuration: (state, action: PayloadAction<number>) => {
      state.sessionDuration += action.payload
    },

    // 个性化设置
    setPersonality: (state, action: PayloadAction<'gentle' | 'energetic' | 'educational' | 'playful'>) => {
      state.personality = action.payload
    },

    setResponseStyle: (state, action: PayloadAction<'simple' | 'detailed' | 'interactive'>) => {
      state.responseStyle = action.payload
    },

    setEmotionalResponsiveness: (state, action: PayloadAction<number>) => {
      state.emotionalResponsiveness = Math.max(0, Math.min(1, action.payload))
    },

    // 重置状态
    resetAIAssistant: (state) => {
      Object.assign(state, initialState)
    },

    // 快速情感响应
    expressHappiness: (state) => {
      state.currentEmotion = EmotionType.HAPPINESS
      state.emotionIntensity = 0.9
      state.lastInteraction = new Date().toISOString()
    },

    expressCuriosity: (state) => {
      state.currentEmotion = EmotionType.CURIOSITY
      state.emotionIntensity = 0.8
      state.lastInteraction = new Date().toISOString()
    },

    expressComfort: (state) => {
      state.currentEmotion = EmotionType.COMFORT
      state.emotionIntensity = 0.8
      state.lastInteraction = new Date().toISOString()
    },

    expressAttention: (state) => {
      state.currentEmotion = EmotionType.ATTENTION
      state.emotionIntensity = 0.7
      state.lastInteraction = new Date().toISOString()
    }
  },
  extraReducers: (builder) => {
    builder
      // 发送消息
      .addCase(sendAIMessage.pending, (state, action) => {
        state.isProcessing = true
        state.addPendingRequest(action.meta.requestId)
      })
      .addCase(sendAIMessage.fulfilled, (state, action) => {
        state.isProcessing = false
        state.removePendingRequest(action.meta.requestId)
        state.addAIMessage(action.payload)
        state.currentEmotion = action.payload.emotion || EmotionType.HAPPINESS
      })
      .addCase(sendAIMessage.rejected, (state, action) => {
        state.isProcessing = false
        state.removePendingRequest(action.meta.requestId)
        // 添加错误消息
        state.addAIMessage({
          id: Date.now().toString(),
          role: 'assistant',
          content: '抱歉，我现在有点困惑，能再试一次吗？',
          timestamp: new Date(),
          emotion: EmotionTypeExtended.CONFUSION
        })
      })

      // 情感分析
      .addCase(analyzeAndUpdateEmotion.fulfilled, (state, action) => {
        state.currentEmotion = action.payload.emotion
        state.emotionIntensity = action.payload.intensity
        state.lastInteraction = action.payload.timestamp
      })
  }
})

// 辅助函数 - 生成AI响应
function generateAIResponse(userMessage: string): string {
  const responses = [
    '这是一个很好的问题！让我们一起探索答案吧。',
    '我理解你的想法，让我来帮助你。',
    '哇，这个想法真有趣！我们继续聊聊吧。',
    '我在这里陪着你，一起面对这个问题。',
    '你真是个爱思考的好奇宝宝！'
  ]

  // 基于用户消息内容生成更相关的响应
  if (userMessage.includes('帮助') || userMessage.includes('帮')) {
    return '我很乐意帮助你！告诉我具体需要什么帮助。'
  }

  if (userMessage.includes('为什么')) {
    return '这是个很棒的"为什么"问题！让我来解释一下吧。'
  }

  if (userMessage.includes('学习') || userMessage.includes('教')) {
    return '学习新知识真 exciting！我来做你的学习伙伴。'
  }

  return responses[Math.floor(Math.random() * responses.length)]
}

// 辅助函数 - 检测响应情感
function detectResponseEmotion(userMessage: string): ExtendedEmotionType {
  if (userMessage.includes('开心') || userMessage.includes('高兴') || userMessage.includes('棒')) {
    return EmotionType.HAPPINESS
  }

  if (userMessage.includes('为什么') || userMessage.includes('好奇')) {
    return EmotionType.CURIOSITY
  }

  if (userMessage.includes('帮') || userMessage.includes('陪')) {
    return EmotionType.ATTENTION
  }

  if (userMessage.includes('害怕') || userMessage.includes('担心')) {
    return EmotionType.COMFORT
  }

  return EmotionType.HAPPINESS
}

// 辅助函数 - 分析文本情感
function analyzeTextEmotion(text: string): { emotion: ExtendedEmotionType; intensity: number } {
  // 简单的规则基础情感分析
  const emotionKeywords = {
    [EmotionType.HAPPINESS]: ['开心', '高兴', '快乐', '喜欢', '爱'],
    [EmotionType.SADNESS]: ['难过', '伤心', '哭', '不开心'],
    [EmotionType.ANGER]: ['生气', '讨厌', '烦', '气'],
    [EmotionType.FEAR]: ['害怕', '担心', '紧张'],
    [EmotionType.CURIOSITY]: ['好奇', '为什么', '想知道'],
    [EmotionType.ATTENTION]: ['注意', '看', '听'],
    [EmotionType.COMFORT]: ['舒服', '安心', '温暖'],
    [EmotionTypeExtended.CONFUSION]: ['困惑', '不懂', '迷茫'],
    [EmotionTypeExtended.EXCITEMENT]: ['兴奋', '激动', '太棒了']
  }

  for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return {
        emotion: emotion as ExtendedEmotionType,
        intensity: 0.7 + Math.random() * 0.3
      }
    }
  }

  return {
    emotion: EmotionType.NEUTRAL,
    intensity: 0.5
  }
}

// 导出Actions
export const {
  showAIAssistant,
  hideAIAssistant,
  toggleAIAssistant,
  setAIAssistantPosition,
  minimizeAIAssistant,
  restoreAIAssistant,
  toggleMinimizeAIAssistant,
  lockAIAssistant,
  unlockAIAssistant,
  toggleLockAIAssistant,
  setAIEmotion,
  setAIEmotionIntensity,
  updateEmotionalState,
  addUserMessage,
  addAIMessage,
  setAIMessages,
  clearMessages,
  deleteMessage,
  setCurrentMessage,
  clearCurrentMessage,
  setTyping,
  setProcessing,
  addPendingRequest,
  removePendingRequest,
  clearPendingRequests,
  startNewSession,
  setSessionDuration,
  incrementSessionDuration,
  setPersonality,
  setResponseStyle,
  setEmotionalResponsiveness,
  resetAIAssistant,
  expressHappiness,
  expressCuriosity,
  expressComfort,
  expressAttention
} = aiAssistantSlice.actions

// 为了向后兼容，添加setAIMessage别名
export const setAIMessage = addAIMessage

// 导出Reducer
export default aiAssistantSlice.reducer

// 选择器
export const selectAIAssistantState = (state: { aiAssistant: AIAssistantState }) => state.aiAssistant
export const selectAIAssistantVisible = (state: { aiAssistant: AIAssistantState }) => state.aiAssistant.isVisible
export const selectAIAssistantEmotion = (state: { aiAssistant: AIAssistantState }) => state.aiAssistant.currentEmotion
export const selectAIAssistantMessages = (state: { aiAssistant: AIAssistantState }) => state.aiAssistant.messages
export const selectAIAssistantProcessing = (state: { aiAssistant: AIAssistantState }) => state.aiAssistant.isProcessing
export const selectAIAssistantTyping = (state: { aiAssistant: AIAssistantState }) => state.aiAssistant.isTyping
export const selectAIAssistantPosition = (state: { aiAssistant: AIAssistantState }) => state.aiAssistant.position
export const selectAIAssistantMinimized = (state: { aiAssistant: AIAssistantState }) => state.aiAssistant.isMinimized