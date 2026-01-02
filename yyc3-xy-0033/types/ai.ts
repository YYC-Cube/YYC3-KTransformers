export interface AIContext {
  currentPage: string
  userActivity: string
  recentActions: string[]
  emotionState?: EmotionState
}

export interface EmotionState {
  primary: "happy" | "calm" | "excited" | "frustrated" | "sad"
  intensity: number
  valence: number
  arousal: number
}

export interface AITool {
  name: string
  description: string
  parameters: Record<string, any>
  execute: (params: any) => Promise<any>
}

export interface AIResponse {
  content: string
  actions?: AIAction[]
  suggestions?: string[]
  emotionFeedback?: EmotionState
}

export interface AIAction {
  type: "navigate" | "execute" | "notify"
  target: string
  params?: Record<string, any>
}
