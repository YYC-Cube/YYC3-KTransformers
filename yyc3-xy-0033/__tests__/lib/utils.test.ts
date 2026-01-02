/**
 * YYC³ AI小语智能成长守护系统 - 工具函数测试
 * @file utils.test.ts
 * @description 工具函数的单元测试
 * @author YYC³团队 <admin@0379.email>
 * @version 1.0.0
 */

import { describe, it, expect, beforeEach } from 'bun:test'
import { cn } from '../../lib/utils'

describe('Utils', () => {
  describe('cn函数', () => {
    it('应该正确合并类名', () => {
      const result = cn('bg-red-500', 'text-white')
      expect(result).toBe('bg-red-500 text-white')
    })

    it('应该正确处理条件类名', () => {
      const result = cn('bg-red-500', false && 'text-white', 'p-4')
      expect(result).toBe('bg-red-500 p-4')
    })

    it('应该正确处理对象形式的类名', () => {
      const result = cn({
        'bg-red-500': true,
        'text-white': false,
        'p-4': true
      })
      expect(result).toBe('bg-red-500 p-4')
    })

    it('应该正确处理数组形式的类名', () => {
      const result = cn(['bg-red-500', 'text-white'])
      expect(result).toBe('bg-red-500 text-white')
    })

    it('应该正确处理Tailwind类名冲突', () => {
      const result = cn('bg-red-500', 'bg-blue-500')
      expect(result).toBe('bg-blue-500')
    })

    it('应该正确处理空值', () => {
      const result = cn(null, undefined, '', 'bg-red-500')
      expect(result).toBe('bg-red-500')
    })

    it('应该正确处理复杂类名组合', () => {
      const result = cn(
        'bg-red-500',
        {
          'text-white': true,
          'p-4': false
        },
        ['rounded', 'shadow-lg'],
        false && 'hidden'
      )
      expect(result).toBe('bg-red-500 text-white rounded shadow-lg')
    })
  })
})