/**
 * YYC³ AI小语智能成长守护系统 - 日期格式化工具测试
 * @file formatDate.test.ts
 * @description 日期格式化工具的单元测试
 * @author YYC³团队 <admin@0379.email>
 * @version 1.0.0
 */

import { describe, it, expect, beforeEach } from 'bun:test'
import { 
  formatDate, 
  formatRelativeTime, 
  formatShortDate, 
  formatDateTime 
} from '../../../lib/utils/formatDate'

describe('formatDate', () => {
  it('应该正确格式化有效日期', () => {
    const date = new Date('2024-01-15')
    const result = formatDate(date)
    expect(result).toBe('2024年1月15日')
  })

  it('应该处理null值', () => {
    const result = formatDate(null)
    expect(result).toBe('--')
  })

  it('应该处理undefined值', () => {
    const result = formatDate(undefined)
    expect(result).toBe('--')
  })

  it('应该处理无效日期', () => {
    const result = formatDate('invalid-date')
    expect(result).toBe('--')
  })

  it('应该处理字符串日期', () => {
    const result = formatDate('2024-01-15')
    expect(result).toBe('2024年1月15日')
  })

  it('应该处理数字时间戳', () => {
    const timestamp = new Date('2024-01-15').getTime()
    const result = formatDate(timestamp)
    expect(result).toBe('2024年1月15日')
  })

  it('应该支持自定义格式化选项', () => {
    const date = new Date('2024-01-15')
    const result = formatDate(date, 'zh-CN', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
    expect(result).toBe('2024年1月15日')
  })

  it('应该支持英文环境', () => {
    const date = new Date('2024-01-15')
    const result = formatDate(date, 'en-US')
    expect(result).toBe('January 15, 2024')
  })

  it('应该处理时间格式化', () => {
    const date = new Date('2024-01-15T14:30:00')
    const result = formatDate(date, 'zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
    expect(result).toBe('2024年1月15日 14:30')
  })
})

describe('formatRelativeTime', () => {
  it('应该处理null值', () => {
    const result = formatRelativeTime(null)
    expect(result).toBe('--')
  })

  it('应该处理undefined值', () => {
    const result = formatRelativeTime(undefined)
    expect(result).toBe('--')
  })

  it('应该处理无效日期', () => {
    const result = formatRelativeTime('invalid-date')
    expect(result).toBe('--')
  })

  it('应该显示"刚刚"对于当前时间', () => {
    const now = new Date()
    const result = formatRelativeTime(now)
    expect(result).toBe('刚刚')
  })

  it('应该正确格式化秒数前的时间', () => {
    const date = new Date(Date.now() - 30 * 1000) // 30秒前
    const result = formatRelativeTime(date)
    expect(result).toBe('30秒钟前')
  })

  it('应该正确格式化分钟前的时间', () => {
    const date = new Date(Date.now() - 15 * 60 * 1000) // 15分钟前
    const result = formatRelativeTime(date)
    expect(result).toBe('15分钟前')
  })

  it('应该正确格式化小时前的时间', () => {
    const date = new Date(Date.now() - 4 * 60 * 60 * 1000) // 4小时前
    const result = formatRelativeTime(date)
    expect(result).toBe('4小时前')
  })

  it('应该正确格式化天前的时间', () => {
    const date = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2天前
    const result = formatRelativeTime(date)
    expect(result).toBe('前天')
  })

  it('应该正确格式化月前的时间', () => {
    const date = new Date(Date.now() - 2 * 30 * 24 * 60 * 60 * 1000) // 约2个月前
    const result = formatRelativeTime(date)
    expect(result).toBe('2个月前')
  })

  it('应该正确格式年前的时间', () => {
    const date = new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000) // 约2年前
    const result = formatRelativeTime(date)
    expect(result).toBe('2年前')
  })

  it('应该支持英文环境', () => {
    const date = new Date(Date.now() - 15 * 60 * 1000) // 15分钟前
    const result = formatRelativeTime(date, 'en-US')
    expect(result).toBe('15 minutes ago')
  })

  it('应该处理字符串日期', () => {
    const date = new Date(Date.now() - 15 * 60 * 1000).toISOString() // 15分钟前
    const result = formatRelativeTime(date)
    expect(result).toBe('15分钟前')
  })

  it('应该处理数字时间戳', () => {
    const timestamp = Date.now() - 15 * 60 * 1000 // 15分钟前
    const result = formatRelativeTime(timestamp)
    expect(result).toBe('15分钟前')
  })
})

describe('formatShortDate', () => {
  it('应该正确格式化短日期', () => {
    const date = new Date('2024-01-15')
    const result = formatShortDate(date)
    expect(result).toBe('2024/01/15')
  })

  it('应该处理null值', () => {
    const result = formatShortDate(null)
    expect(result).toBe('--')
  })

  it('应该处理undefined值', () => {
    const result = formatShortDate(undefined)
    expect(result).toBe('--')
  })

  it('应该处理无效日期', () => {
    const result = formatShortDate('invalid-date')
    expect(result).toBe('--')
  })

  it('应该处理字符串日期', () => {
    const result = formatShortDate('2024-01-15')
    expect(result).toBe('2024/01/15')
  })

  it('应该处理数字时间戳', () => {
    const timestamp = new Date('2024-01-15').getTime()
    const result = formatShortDate(timestamp)
    expect(result).toBe('2024/01/15')
  })

  it('应该支持英文环境', () => {
    const date = new Date('2024-01-15')
    const result = formatShortDate(date, 'en-US')
    expect(result).toBe('01/15/2024')
  })

  it('应该处理不同月份和日期', () => {
    const date = new Date('2024-12-31')
    const result = formatShortDate(date)
    expect(result).toBe('2024/12/31')
  })
})

describe('formatDateTime', () => {
  it('应该正确格式化日期时间', () => {
    const date = new Date('2024-01-15T14:30:00')
    const result = formatDateTime(date)
    expect(result).toBe('2024年1月15日 14:30')
  })

  it('应该处理null值', () => {
    const result = formatDateTime(null)
    expect(result).toBe('--')
  })

  it('应该处理undefined值', () => {
    const result = formatDateTime(undefined)
    expect(result).toBe('--')
  })

  it('应该处理无效日期', () => {
    const result = formatDateTime('invalid-date')
    expect(result).toBe('--')
  })

  it('应该处理字符串日期', () => {
    const result = formatDateTime('2024-01-15T14:30:00')
    expect(result).toBe('2024年1月15日 14:30')
  })

  it('应该处理数字时间戳', () => {
    const timestamp = new Date('2024-01-15T14:30:00').getTime()
    const result = formatDateTime(timestamp)
    expect(result).toBe('2024年1月15日 14:30')
  })

  it('应该支持英文环境', () => {
    const date = new Date('2024-01-15T14:30:00')
    const result = formatDateTime(date, 'en-US')
    expect(result).toContain('2024')
    expect(result).toContain('02:30 PM')
  })

  it('应该处理不同时间', () => {
    const date = new Date('2024-01-15T09:05:00')
    const result = formatDateTime(date)
    expect(result).toBe('2024年1月15日 09:05')
  })

  it('应该处理跨日时间', () => {
    const date = new Date('2024-01-15T23:59:00')
    const result = formatDateTime(date)
    expect(result).toBe('2024年1月15日 23:59')
  })
})