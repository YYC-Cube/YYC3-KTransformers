/**
 * @fileoverview Store模块导出文件
 * @description 统一导出所有store相关的模块和类型
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-30
 * @modified 2025-01-30
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

// 导出store和persistor
export { store, persistor } from './store'

// 导出类型
export type { RootState, AppDispatch } from './store'

// 导出类型化的hooks
export { useAppDispatch, useAppSelector } from './store'

// 导出所有slice
export { default as authSlice } from './slices/authSlice'
export { default as uiSlice } from './slices/uiSlice'
export { default as toolSlice } from './slices/toolSlice'
export { default as knowledgeSlice } from './slices/knowledgeSlice'

// 导出auth slice的actions和类型
export {
  loginUser,
  logoutUser,
  refreshToken,
  clearError as clearAuthError,
  updateUserPreferences,
  resetLoginAttempts,
  setAuthState,
  clearAuthState,
} from './slices/authSlice'
export type { User, AuthState } from './slices/authSlice'

// 导出ui slice的actions和类型
export {
  setTheme,
  setLanguage,
  toggleSidebar,
  setSidebarOpen,
  addNotification,
  removeNotification,
  clearNotifications,
  setGlobalLoading,
  setComponentLoading,
  openModal,
  closeModal,
  setBreadcrumbs,
  setCurrentPage,
  setScreenSize,
} from './slices/uiSlice'
export type { Notification, UIState } from './slices/uiSlice'

// 导出tool slice的actions和类型
export {
  fetchTools,
  activateTool,
  deactivateTool,
  useTool,
  clearError as clearToolError,
  setSearchQuery,
  setSelectedCategory,
  setSortBy,
  setSortOrder,
  updateToolConfig,
  addUsageRecord,
  clearUsageRecords,
} from './slices/toolSlice'
export type { Tool, ToolUsageRecord, ToolState } from './slices/toolSlice'

// 导出knowledge slice的actions和类型
export {
  fetchDocuments,
  fetchDocument,
  searchDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
  clearError as clearKnowledgeError,
  setSearchQuery as setKnowledgeSearchQuery,
  setSelectedCategory as setKnowledgeSelectedCategory,
  setSelectedTags,
  setSortBy as setKnowledgeSortBy,
  setSortOrder as setKnowledgeSortOrder,
  setPagination,
  setFilters,
  clearFilters,
  clearSearchResults,
  clearCurrentDocument,
} from './slices/knowledgeSlice'
export type {
  KnowledgeDocument,
  KnowledgeCategory,
  SearchResult,
  KnowledgeState,
} from './slices/knowledgeSlice'