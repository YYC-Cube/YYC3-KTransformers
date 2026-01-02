/**
 * @file 响应式系统
 * @description 统一的断点管理和响应式交互系统
 * @author YYC³ Development Team
 * @version 1.0.0
 * @created 2024-12-14
 */

import { useState, useEffect, useCallback } from 'react'

// 断点定义
export const BREAKPOINTS = {
  xs: 0,      // 超小屏幕 (手机竖屏)
  sm: 640,    // 小屏幕 (手机横屏)
  md: 768,    // 中等屏幕 (平板竖屏)
  lg: 1024,   // 大屏幕 (平板横屏/小型笔记本)
  xl: 1280,   // 超大屏幕 (桌面)
  '2xl': 1536 // 超超大屏幕 (大桌面)
} as const

// 响应式值类型
export type ResponsiveValue<T> = {
  xs?: T
  sm?: T
  md?: T
  lg?: T
  xl?: T
  '2xl'?: T
} | T

// 屏幕尺寸接口
export interface ScreenSize {
  width: number
  height: number
  orientation: 'portrait' | 'landscape'
  devicePixelRatio: number
}

// 断点状态接口
export interface BreakpointState {
  isXs: boolean
  isSm: boolean
  isMd: boolean
  isLg: boolean
  isXl: boolean
  is2Xl: boolean
  current: keyof typeof BREAKPOINTS
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
}

// 响应式系统类
export class ResponsiveSystem {
  private static instance: ResponsiveSystem
  private listeners: Set<(screenSize: ScreenSize) => void> = new Set()
  private currentScreenSize: ScreenSize | null = null
  private mediaQueries: Record<keyof typeof BREAKPOINTS, MediaQueryList> = {} as any

  private constructor() {
    this.setupMediaQueries()
    this.startScreenSizeTracking()
  }

  static getInstance(): ResponsiveSystem {
    if (!ResponsiveSystem.instance) {
      ResponsiveSystem.instance = new ResponsiveSystem()
    }
    return ResponsiveSystem.instance
  }

  // 设置媒体查询监听
  private setupMediaQueries() {
    Object.entries(BREAKPOINTS).forEach(([key, value]) => {
      this.mediaQueries[key as keyof typeof BREAKPOINTS] = window.matchMedia(
        `(min-width: ${value}px)`
      )
    })
  }

  // 开始屏幕尺寸跟踪
  private startScreenSizeTracking() {
    this.updateScreenSize()

    // 监听窗口大小变化
    window.addEventListener('resize', this.handleResize)
    window.addEventListener('orientationchange', this.handleResize)
  }

  // 处理尺寸变化
  private handleResize = useCallback(() => {
    this.updateScreenSize()
    this.notifyListeners()
  }, [])

  // 更新屏幕尺寸
  private updateScreenSize() {
    this.currentScreenSize = {
      width: window.innerWidth,
      height: window.innerHeight,
      orientation: window.innerHeight > window.innerWidth ? 'portrait' : 'landscape',
      devicePixelRatio: window.devicePixelRatio || 1
    }
  }

  // 通知监听器
  private notifyListeners() {
    if (this.currentScreenSize) {
      this.listeners.forEach(listener => listener(this.currentScreenSize!))
    }
  }

  // 添加监听器
  addListener(listener: (screenSize: ScreenSize) => void) {
    this.listeners.add(listener)

    // 立即调用一次
    if (this.currentScreenSize) {
      listener(this.currentScreenSize)
    }
  }

  // 移除监听器
  removeListener(listener: (screenSize: ScreenSize) => void) {
    this.listeners.delete(listener)
  }

  // 获取当前屏幕尺寸
  getScreenSize(): ScreenSize | null {
    return this.currentScreenSize
  }

  // 获取断点状态
  getBreakpointState(): BreakpointState {
    if (!this.currentScreenSize) {
      return {
        isXs: true,
        isSm: false,
        isMd: false,
        isLg: false,
        isXl: false,
        is2Xl: false,
        current: 'xs',
        isMobile: true,
        isTablet: false,
        isDesktop: false
      }
    }

    const { width } = this.currentScreenSize

    return {
      isXs: width >= BREAKPOINTS.xs,
      isSm: width >= BREAKPOINTS.sm,
      isMd: width >= BREAKPOINTS.md,
      isLg: width >= BREAKPOINTS.lg,
      isXl: width >= BREAKPOINTS.xl,
      is2Xl: width >= BREAKPOINTS['2xl'],
      current: this.getCurrentBreakpoint(width),
      isMobile: width < BREAKPOINTS.md,
      isTablet: width >= BREAKPOINTS.md && width < BREAKPOINTS.lg,
      isDesktop: width >= BREAKPOINTS.lg
    }
  }

  // 获取当前断点
  private getCurrentBreakpoint(width: number): keyof typeof BREAKPOINTS {
    const breakpoints = Object.entries(BREAKPOINTS).reverse()

    for (const [key, value] of breakpoints) {
      if (width >= value) {
        return key as keyof typeof BREAKPOINTS
      }
    }

    return 'xs'
  }

  // 解析响应式值
  resolveResponsiveValue<T>(value: ResponsiveValue<T>): T | undefined {
    if (typeof value !== 'object' || value === null) {
      return value
    }

    const breakpointState = this.getBreakpointState()
    const responsiveValue = value as Record<string, T>

    // 按断点优先级从高到低查找值
    const priorities: Array<keyof typeof BREAKPOINTS> = ['2xl', 'xl', 'lg', 'md', 'sm', 'xs']

    for (const breakpoint of priorities) {
      if (responsiveValue[breakpoint] !== undefined) {
        // 检查当前断点是否匹配
        if (breakpoint === 'xs' || breakpointState[`is${breakpoint.charAt(0).toUpperCase()}${breakpoint.slice(1)}` as keyof BreakpointState]) {
          return responsiveValue[breakpoint]
        }
      }
    }

    return undefined
  }

  // 生成响应式类名
  generateResponsiveClasses(classes: ResponsiveValue<string>): string {
    const resolvedValue = this.resolveResponsiveValue(classes)
    return resolvedValue || ''
  }

  // 销毁系统
  destroy() {
    window.removeEventListener('resize', this.handleResize)
    window.removeEventListener('orientationchange', this.handleResize)
    this.listeners.clear()
  }
}

// 导出单例实例
export const responsiveSystem = ResponsiveSystem.getInstance()

// React Hook: 使用屏幕尺寸
export function useScreenSize() {
  const [screenSize, setScreenSize] = useState<ScreenSize>(() =>
    responsiveSystem.getScreenSize() || {
      width: 0,
      height: 0,
      orientation: 'portrait',
      devicePixelRatio: 1
    }
  )

  useEffect(() => {
    const handleScreenSizeChange = (newScreenSize: ScreenSize) => {
      setScreenSize(newScreenSize)
    }

    responsiveSystem.addListener(handleScreenSizeChange)

    return () => {
      responsiveSystem.removeListener(handleScreenSizeChange)
    }
  }, [])

  return screenSize
}

// React Hook: 使用断点状态
export function useBreakpoints() {
  const [breakpointState, setBreakpointState] = useState<BreakpointState>(() =>
    responsiveSystem.getBreakpointState()
  )

  useEffect(() => {
    const handleScreenSizeChange = () => {
      setBreakpointState(responsiveSystem.getBreakpointState())
    }

    responsiveSystem.addListener(handleScreenSizeChange)

    return () => {
      responsiveSystem.removeListener(handleScreenSizeChange)
    }
  }, [])

  return breakpointState
}

// React Hook: 使用响应式值
export function useResponsiveValue<T>(value: ResponsiveValue<T>): T | undefined {
  const [resolvedValue, setResolvedValue] = useState<T | undefined>(() =>
    responsiveSystem.resolveResponsiveValue(value)
  )

  useEffect(() => {
    const handleScreenSizeChange = () => {
      setResolvedValue(responsiveSystem.resolveResponsiveValue(value))
    }

    responsiveSystem.addListener(handleScreenSizeChange)

    return () => {
      responsiveSystem.removeListener(handleScreenSizeChange)
    }
  }, [value])

  return resolvedValue
}

// 便捷函数
export const getBreakpointState = () => responsiveSystem.getBreakpointState()
export const resolveResponsiveValue = <T>(value: ResponsiveValue<T>) =>
  responsiveSystem.resolveResponsiveValue(value)
export const generateResponsiveClasses = (classes: ResponsiveValue<string>) =>
  responsiveSystem.generateResponsiveClasses(classes)

// 响应式配置预设
export const RESPONSIVE_PRESETS = {
  // 容器最大宽度
  containerMaxWidths: {
    xs: '100%',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  } as const,

  // 字体大小
  fontSizes: {
    xs: ['text-xs', 'text-sm'],
    sm: ['text-sm', 'text-base'],
    md: ['text-base', 'text-lg'],
    lg: ['text-lg', 'text-xl'],
    xl: ['text-xl', 'text-2xl']
  } as const,

  // 间距
  spacing: {
    xs: ['p-2', 'm-2'],
    sm: ['p-3', 'm-3'],
    md: ['p-4', 'm-4'],
    lg: ['p-6', 'm-6'],
    xl: ['p-8', 'm-8']
  } as const,

  // 网格列数
  gridColumns: {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5
  } as const
} as const

// 媒体查询工具函数
export const mediaQuery = {
  min: (breakpoint: keyof typeof BREAKPOINTS) =>
    `@media (min-width: ${BREAKPOINTS[breakpoint]}px)`,

  max: (breakpoint: keyof typeof BREAKPOINTS) =>
    `@media (max-width: ${BREAKPOINTS[breakpoint] - 1}px)`,

  between: (min: keyof typeof BREAKPOINTS, max: keyof typeof BREAKPOINTS) =>
    `@media (min-width: ${BREAKPOINTS[min]}px) and (max-width: ${BREAKPOINTS[max] - 1}px)`,

  orientation: (orientation: 'portrait' | 'landscape') =>
    `@media (orientation: ${orientation})`,

  retina: '@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)'
} as const