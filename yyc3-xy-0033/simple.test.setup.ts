/**
 * YYC³ AI小语智能成长守护系统 - 简化测试运行脚本
 */

// 设置测试环境
import { beforeEach, afterEach, describe, it, expect, jest } from 'bun:test'
import { cleanup, render, screen } from '@testing-library/react'
import { JSDOM } from 'jsdom'
import React, { ReactNode } from 'react'

// 设置 jsdom 环境
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost:3000',
  pretendToBeVisual: true,
  resources: 'usable',
})

// 将 jsdom 的全局对象设置为全局
global.window = dom.window as any
global.document = dom.window.document
global.navigator = dom.window.navigator
global.HTMLElement = dom.window.HTMLElement
global.Element = dom.window.Element
global.Node = dom.window.Node
global.NodeList = dom.window.NodeList
global.HTMLCollection = dom.window.HTMLCollection

// Mock fetch API
global.fetch = jest.fn()

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.sessionStorage = sessionStorageMock

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// 简单的测试包装器，只提供基本的React上下文
const SimpleTestWrapper = ({ children }: { children: ReactNode }) => {
  return React.createElement('div', { 'data-testid': 'test-wrapper' }, children)
}

// 自定义渲染函数，使用简单包装器
const customRender = (ui: React.ReactElement, options = {}) => {
  return render(ui, { wrapper: SimpleTestWrapper, ...options })
}

// Mock Next.js router - 简化版本
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: '',
      asPath: '',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    }
  },
}))

// Mock Next.js navigation - 简化版本
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      refresh: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      prefetch: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Mock Next.js app router context
jest.mock('next/dist/client/components/app-router-context', () => ({
  AppRouterContext: {
    Provider: ({ children }: { children: ReactNode }) => children,
  },
  LayoutRouterContext: {
    Provider: ({ children }: { children: ReactNode }) => children,
  },
  TemplateContext: {
    Provider: ({ children }: { children: ReactNode }) => children,
  },
  GlobalLayoutRouterContext: {
    Provider: ({ children }: { children: ReactNode }) => children,
  },
  CacheRoutesContext: {
    Provider: ({ children }: { children: ReactNode }) => children,
  },
  PathnameContext: {
    Provider: ({ children }: { children: ReactNode }) => children,
  },
  ParamsContext: {
    Provider: ({ children }: { children: ReactNode }) => children,
  },
}))

// Global test utilities
global.createMockUser = (overrides = {}) => ({
  id: 'user-123',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  role: 'parent',
  emailVerified: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
})

global.createMockChild = (overrides = {}) => ({
  id: 'child-123',
  name: 'Test Child',
  birthDate: '2020-01-01',
  gender: 'male',
  parentId: 'user-123',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
})

global.createMockAIMessage = (overrides = {}) => ({
  id: 'message-123',
  sessionId: 'session-123',
  userMessage: 'Hello',
  aiResponse: 'Hi there!',
  aiRole: 'listener',
  aiRoleName: '聆听者',
  emotion: 'happy',
  createdAt: new Date().toISOString(),
  ...overrides,
})

global.createMockGrowthRecord = (overrides = {}) => ({
  id: 'record-123',
  childId: 'child-123',
  childName: 'Test Child',
  title: 'First Steps',
  description: 'Took first steps today',
  category: 'milestone',
  mediaUrls: [],
  tags: ['milestone', 'development'],
  location: 'Home',
  isPublic: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
})

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks()
  localStorageMock.clear()
  sessionStorageMock.clear()
  (global.fetch as jest.Mock).mockReset()
})

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Export testing utilities
export { render, screen, fireEvent, waitFor } from '@testing-library/react'
export { userEvent } from '@testing-library/user-event'
export { customRender }