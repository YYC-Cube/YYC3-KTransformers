/**
 * YYC³ AI小语智能成长守护系统 - 日期格式化测试
 * 第六阶段：高级特性与生产准备
 */

import { formatDate } from '@/lib/utils/formatDate'

describe('formatDate', () => {
  it('formats date correctly for Chinese locale', () => {
    const date = new Date('2024-01-01')
    const formatted = formatDate(date, 'zh-CN')
    expect(formatted).toBe('2024年1月1日')
  })

  it('formats date correctly for English locale', () => {
    const date = new Date('2024-01-01')
    const formatted = formatDate(date, 'en-US')
    expect(formatted).toMatch(/January 1, 2024/)
  })

  it('handles invalid dates', () => {
    const date = new Date('invalid')
    const formatted = formatDate(date, 'zh-CN')
    expect(formatted).toBe('--')
  })

  it('handles null/undefined dates', () => {
    expect(formatDate(null as any, 'zh-CN')).toBe('--')
    expect(formatDate(undefined as any, 'zh-CN')).toBe('--')
  })
})

