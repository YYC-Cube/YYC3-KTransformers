/**
 * @fileoverview Redux store配置文件
 * @description 配置Redux store、persistor和中间件
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-30
 * @modified 2025-01-30
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

// 导入reducer
import authReducer from '@/store/slices/authSlice'
import uiReducer from '@/store/slices/uiSlice'
import toolReducer from '@/store/slices/toolSlice'
import knowledgeReducer from '@/store/slices/knowledgeSlice'

// 持久化配置
const persistConfig = {
  key: 'yyc3-xy-ai',
  storage,
  whitelist: ['auth', 'ui'], // 只持久化auth和ui状态
}

// 合并所有reducer
const rootReducer = {
  auth: persistReducer(persistConfig, authReducer),
  ui: persistReducer(persistConfig, uiReducer),
  tools: toolReducer,
  knowledge: knowledgeReducer,
}

// 配置store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
})

// 创建persistor
export const persistor = persistStore(store)

// 导出类型
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// 导出类型化的hooks
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

// 导出默认store
export default store