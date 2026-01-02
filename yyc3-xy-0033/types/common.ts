/**
 * 通用类型定义文件
 * 用于解决TypeScript类型报错
 */

// 消息类型
export interface Message {
  id: number
  role: string
  content: string
  avatar?: string
  name?: string
  timestamp: number
}

// AI角色类型
export interface AIRoleConfig {
  id: string
  name: string
  avatar?: string
  description?: string
}

// 子童类型
export interface Child {
  user_id: string
  id?: string
  name?: string
  nickname?: string
  birth_date?: string
  gender?: 'male' | 'female' | 'other'
  avatar_url?: string
  current_stage?: string
  created_at?: string
  updated_at?: string
  age_years?: number
}

// MockChild类型（用于兼容）
export interface MockChild {
  user_id: string
  name: string
  nickname: string
}

// PageHeader组件Props类型
export interface PageHeaderProps {
  icon?: string
  title: string
  subtitle?: string
  showBack?: boolean
  actions?: Array<{
    icon: string
    label: string
  }>
  children?: React.ReactNode
}

// UseGrowthStageResult类型
export interface UseGrowthStageResult {
  stage?: string
  stageTransition?: string
  [key: string]: any
}

// 课程类型映射
export interface CourseTypes {
  语文: string
  科学: string
  素质拓展: string
  [key: string]: string
}