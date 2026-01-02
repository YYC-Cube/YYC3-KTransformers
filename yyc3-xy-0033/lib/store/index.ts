/**
 * YYC³ AI小语智能成长守护系统 - Redux状态管理
 * 专注0-3岁婴幼儿成长数据管理
 */

import { configureStore, createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { EmotionResult, EmotionalMemory, EmotionType, AgeGroup } from '@/lib/ai/emotion-engine'
import aiAssistantReducer, {
  AIAssistantState,
  AIMessage,
  sendAIMessage,
  analyzeAndUpdateEmotion
} from './slices/aiAssistantSlice'

// 用户状态
export interface User {
  id: string
  name: string
  email: string
  role: 'parent' | 'guardian' | 'educator'
  avatar?: string
  gender?: 'male' | 'female' | 'other'
  createdAt: string
}

// 儿童状态
export interface Child {
  id: string
  userId: string
  name: string
  nickname: string
  birthDate: string
  age: number // 年龄（月）
  gender: 'male' | 'female'
  avatar?: string
  currentStage: string
  developmentLevel: DevelopmentLevel
  preferences: ChildPreferences
}

// 发展水平
export interface DevelopmentLevel {
  cognitive: number // 0-100
  language: number
  motor: number
  social: number
  emotional: number
}

// 儿童偏好
export interface ChildPreferences {
  favoriteActivities: string[]
  comfortItems: string[]
  fearTriggers: string[]
  learningStyle: 'visual' | 'auditory' | 'kinesthetic'
  sensitivityLevel: 'low' | 'medium' | 'high'
}

// AI助手状态
export interface AIAssistant {
  isVisible: boolean
  position: { x: number; y: number }
  isMinimized: boolean
  isLocked: boolean
  currentEmotion: EmotionType
  isActive: boolean
  lastInteraction: string
}

// 成长记录
export interface GrowthRecord {
  id: string
  childId: string
  type: 'milestone' | 'daily' | 'emotion' | 'learning'
  title: string
  description: string
  date: string
  emotion?: EmotionResult
  media?: {
    photos: string[]
    videos: string[]
    audioNotes: string[]
  }
  tags: string[]
  isImportant: boolean
}

// 应用状态
export interface AppState {
  // 用户相关
  user: User | null
  currentChild: Child | null
  children: Child[]

  // AI助手
  aiAssistant: AIAssistant

  // 成长记录
  growthRecords: GrowthRecord[]
  emotionalMemories: EmotionalMemory[]

  // 应用设置
  settings: AppSettings

  // UI状态
  ui: UIState
}

// 应用设置
export interface AppSettings {
  theme: 'light' | 'dark' | 'auto'
  language: 'zh-CN' | 'en-US'
  notifications: NotificationSettings
  privacy: PrivacySettings
  accessibility: AccessibilitySettings
}

// 通知设置
export interface NotificationSettings {
  milestoneReminders: boolean
  dailyReports: boolean
  emotionAlerts: boolean
  recommendations: boolean
  quietHours: {
    enabled: boolean
    start: string
    end: string
  }
}

// 隐私设置
export interface PrivacySettings {
  dataSharing: boolean
  analytics: boolean
  locationTracking: boolean
  cameraAccess: boolean
  microphoneAccess: boolean
}

// 无障碍设置
export interface AccessibilitySettings {
  highContrast: boolean
  largeText: boolean
  reduceMotion: boolean
  screenReader: boolean
  voiceControl: boolean
}

// UI状态
export interface UIState {
  isLoading: boolean
  currentPage: string
  sidebarOpen: boolean
  modals: {
    emotionAnalysis: boolean
    growthRecord: boolean
    settings: boolean
    help: boolean
  }
  toast: ToastMessage[]
}

// Toast消息
export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration: number
  timestamp: number
}

// 初始状态
const initialState: AppState = {
  user: null,
  currentChild: null,
  children: [],
  aiAssistant: {
    isVisible: true,
    position: { x: 100, y: 100 },
    isMinimized: false,
    isLocked: false,
    currentEmotion: EmotionType.HAPPINESS,
    isActive: false,
    lastInteraction: new Date().toISOString()
  },
  growthRecords: [],
  emotionalMemories: [],
  settings: {
    theme: 'light',
    language: 'zh-CN',
    notifications: {
      milestoneReminders: true,
      dailyReports: true,
      emotionAlerts: true,
      recommendations: true,
      quietHours: {
        enabled: false,
        start: '21:00',
        end: '07:00'
      }
    },
    privacy: {
      dataSharing: false,
      analytics: true,
      locationTracking: false,
      cameraAccess: false,
      microphoneAccess: true
    },
    accessibility: {
      highContrast: false,
      largeText: false,
      reduceMotion: false,
      screenReader: false,
      voiceControl: false
    }
  },
  ui: {
    isLoading: false,
    currentPage: '/',
    sidebarOpen: false,
    modals: {
      emotionAnalysis: false,
      growthRecord: false,
      settings: false,
      help: false
    },
    toast: []
  }
}

// 异步Action - 情感分析
export const analyzeEmotion = createAsyncThunk(
  'emotion/analyze',
  async (input: { text?: string; audio?: Blob; childId: string }) => {
    // 功能规划: 情感分析集成
    // 实现要求:
    // 1. 调用 /api/ai/emotion 端点
    // 2. 传递文本或音频数据
    // 3. 接收情感分析结果
    //
    // API端点: POST /api/ai/emotion
    // 请求体: { text?: string, audio?: Blob, childId: string }
    // 返回: EmotionResult
    //
    // 当前: 返回模拟数据用于测试
    const mockResult: EmotionResult = {
      primary: EmotionType.HAPPINESS,
      confidence: 0.8,
      intensity: 0.7,
      ageGroup: AgeGroup.TODDLER,
      timestamp: new Date()
    }
    return mockResult
  }
)

// 异步Action - 保存成长记录
export const saveGrowthRecord = createAsyncThunk(
  'growth/saveRecord',
  async (record: Omit<GrowthRecord, 'id'>) => {
    const newRecord: GrowthRecord = {
      ...record,
      id: Date.now().toString()
    }
    // 功能规划: 保存成长记录到数据库
    // 实现要求:
    // 1. 调用 /api/growth-records POST 端点
    // 2. 传递完整的成长记录数据
    // 3. 接收服务器确认
    //
    // API端点: POST /api/growth-records
    // 请求体: Omit<GrowthRecord, 'id'>
    // 返回: GrowthRecord (含服务器生成的ID)
    //
    // 当前: 直接返回记录（前端保存到Redux store）
    return newRecord
  }
)

// 异步Action - 加载儿童数据
export const loadChildren = createAsyncThunk(
  'children/load',
  async (userId: string) => {
    // 功能规划: 从后端加载儿童数据
    // 实现要求:
    // 1. 调用 /api/children?userId={userId} GET 端点
    // 2. 接收儿童列表数据
    // 3. 缓存到Redux store
    //
    // API端点: GET /api/children?userId={userId}
    // 返回: Child[]
    //
    // 当前: 返回空数组（需要从API加载）
    return []
  }
)

// 应用Slice
const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    // 用户相关
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
    },
    logout: (state) => {
      state.user = null
      state.currentChild = null
      state.children = []
    },

    // 儿童相关
    setCurrentChild: (state, action: PayloadAction<Child>) => {
      state.currentChild = action.payload
    },
    addChild: (state, action: PayloadAction<Child>) => {
      state.children.push(action.payload)
      if (!state.currentChild) {
        state.currentChild = action.payload
      }
    },
    updateChild: (state, action: PayloadAction<{ id: string; updates: Partial<Child> }>) => {
      const { id, updates } = action.payload
      const childIndex = state.children.findIndex(child => child.id === id)
      if (childIndex !== -1) {
        state.children[childIndex] = { ...state.children[childIndex], ...updates }
        if (state.currentChild?.id === id) {
          state.currentChild = { ...state.currentChild, ...updates }
        }
      }
    },

    // AI助手相关
    updateAIAssistant: (state, action: PayloadAction<Partial<AIAssistant>>) => {
      state.aiAssistant = { ...state.aiAssistant, ...action.payload }
    },
    setAIAssistantPosition: (state, action: PayloadAction<{ x: number; y: number }>) => {
      state.aiAssistant.position = action.payload
    },
    toggleAIAssistant: (state) => {
      state.aiAssistant.isVisible = !state.aiAssistant.isVisible
    },
    minimizeAIAssistant: (state) => {
      state.aiAssistant.isMinimized = !state.aiAssistant.isMinimized
    },
    lockAIAssistant: (state) => {
      state.aiAssistant.isLocked = !state.aiAssistant.isLocked
    },
    setAIEmotion: (state, action: PayloadAction<EmotionType>) => {
      state.aiAssistant.currentEmotion = action.payload
      state.aiAssistant.lastInteraction = new Date().toISOString()
    },

    // 成长记录相关
    addGrowthRecord: (state, action: PayloadAction<GrowthRecord>) => {
      state.growthRecords.unshift(action.payload)
    },
    updateGrowthRecord: (state, action: PayloadAction<{ id: string; updates: Partial<GrowthRecord> }>) => {
      const { id, updates } = action.payload
      const recordIndex = state.growthRecords.findIndex(record => record.id === id)
      if (recordIndex !== -1) {
        state.growthRecords[recordIndex] = { ...state.growthRecords[recordIndex], ...updates }
      }
    },
    deleteGrowthRecord: (state, action: PayloadAction<string>) => {
      state.growthRecords = state.growthRecords.filter(record => record.id !== action.payload)
    },

    // 情感记忆相关
    addEmotionalMemory: (state, action: PayloadAction<EmotionalMemory>) => {
      state.emotionalMemories.unshift(action.payload)
    },

    // 设置相关
    updateSettings: (state, action: PayloadAction<Partial<AppSettings>>) => {
      state.settings = { ...state.settings, ...action.payload }
    },
    updateNotificationSettings: (state, action: PayloadAction<Partial<NotificationSettings>>) => {
      state.settings.notifications = { ...state.settings.notifications, ...action.payload }
    },
    updatePrivacySettings: (state, action: PayloadAction<Partial<PrivacySettings>>) => {
      state.settings.privacy = { ...state.settings.privacy, ...action.payload }
    },
    updateAccessibilitySettings: (state, action: PayloadAction<Partial<AccessibilitySettings>>) => {
      state.settings.accessibility = { ...state.settings.accessibility, ...action.payload }
    },

    // UI状态相关
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.ui.isLoading = action.payload
    },
    setCurrentPage: (state, action: PayloadAction<string>) => {
      state.ui.currentPage = action.payload
    },
    toggleSidebar: (state) => {
      state.ui.sidebarOpen = !state.ui.sidebarOpen
    },
    openModal: (state, action: PayloadAction<keyof AppState['ui']['modals']>) => {
      state.ui.modals[action.payload] = true
    },
    closeModal: (state, action: PayloadAction<keyof AppState['ui']['modals']>) => {
      state.ui.modals[action.payload] = false
    },
    addToast: (state, action: PayloadAction<Omit<ToastMessage, 'id' | 'timestamp'>>) => {
      const toast: ToastMessage = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: Date.now()
      }
      state.ui.toast.push(toast)
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.ui.toast = state.ui.toast.filter(toast => toast.id !== action.payload)
    },
    clearToast: (state) => {
      state.ui.toast = []
    }
  },
  extraReducers: (builder) => {
    builder
      // 情感分析
      .addCase(analyzeEmotion.pending, (state) => {
        state.ui.isLoading = true
      })
      .addCase(analyzeEmotion.fulfilled, (state, action) => {
        state.ui.isLoading = false
        state.aiAssistant.currentEmotion = action.payload.primary
        state.aiAssistant.lastInteraction = new Date().toISOString()
      })
      .addCase(analyzeEmotion.rejected, (state) => {
        state.ui.isLoading = false
        state.ui.toast.push({
          id: Date.now().toString(),
          type: 'error',
          title: '情感分析失败',
          message: '请稍后重试',
          duration: 3000,
          timestamp: Date.now()
        })
      })
      // 保存成长记录
      .addCase(saveGrowthRecord.pending, (state) => {
        state.ui.isLoading = true
      })
      .addCase(saveGrowthRecord.fulfilled, (state, action) => {
        state.ui.isLoading = false
        state.growthRecords.unshift(action.payload)
        state.ui.toast.push({
          id: Date.now().toString(),
          type: 'success',
          title: '保存成功',
          message: '成长记录已保存',
          duration: 3000,
          timestamp: Date.now()
        })
      })
      .addCase(saveGrowthRecord.rejected, (state) => {
        state.ui.isLoading = false
        state.ui.toast.push({
          id: Date.now().toString(),
          type: 'error',
          title: '保存失败',
          message: '请检查网络连接',
          duration: 3000,
          timestamp: Date.now()
        })
      })
      // 加载儿童数据
      .addCase(loadChildren.fulfilled, (state, action) => {
        state.children = action.payload
        if (action.payload.length > 0 && !state.currentChild) {
          state.currentChild = action.payload[0]
        }
      })
  }
})

// 导出Actions
export const {
  setUser,
  logout,
  setCurrentChild,
  addChild,
  updateChild,
  updateAIAssistant,
  setAIAssistantPosition,
  toggleAIAssistant,
  minimizeAIAssistant,
  lockAIAssistant,
  setAIEmotion,
  addGrowthRecord,
  updateGrowthRecord,
  deleteGrowthRecord,
  addEmotionalMemory,
  updateSettings,
  updateNotificationSettings,
  updatePrivacySettings,
  updateAccessibilitySettings,
  setLoading,
  setCurrentPage,
  toggleSidebar,
  openModal,
  closeModal,
  addToast,
  removeToast,
  clearToast
} = appSlice.actions

// 持久化配置
const persistConfig = {
  key: 'yyc3-root',
  version: 1,
  storage,
  whitelist: [
    'user',
    'currentChild',
    'children',
    'aiAssistant',
    'growthRecords',
    'emotionalMemories',
    'settings'
  ]
}

// 创建持久化Reducer
const persistedReducer = persistReducer(persistConfig, appSlice.reducer)

// 创建Store
export const store = configureStore({
  reducer: {
    app: persistedReducer,
    aiAssistant: aiAssistantReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    }),
  devTools: process.env.NODE_ENV !== 'production'
})

// 创建持久化Store
export const persistor = persistStore(store)

// 类型定义
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// 重新导出AI助手相关类型
export type { AIAssistantState, AIMessage } from './slices/aiAssistantSlice'

// 选择器
export const selectCurrentUser = (state: RootState) => state.app.user
export const selectCurrentChild = (state: RootState) => state.app.currentChild
export const selectChildren = (state: RootState) => state.app.children
export const selectAIAssistant = (state: RootState) => state.aiAssistant
export const selectGrowthRecords = (state: RootState) => state.app.growthRecords
export const selectEmotionalMemories = (state: RootState) => state.app.emotionalMemories
export const selectSettings = (state: RootState) => state.app.settings
export const selectUIState = (state: RootState) => state.app.ui
export const selectIsLoading = (state: RootState) => state.app.ui.isLoading
export const selectCurrentPage = (state: RootState) => state.app.ui.currentPage
export const selectToastMessages = (state: RootState) => state.app.ui.toast

export default store