/**
 * @fileoverview Bun测试类型声明
 * @description 为Bun测试框架提供TypeScript类型声明
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-20
 * @modified 2025-01-20
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

declare module 'bun:test' {
  export interface Mock<T extends (...args: any[]) => any> {
    (...args: Parameters<T>): ReturnType<T>
    mock: {
      calls: Array<Parameters<T>>
      results: Array<{ type: 'return'; value: ReturnType<T> } | { type: 'throw'; value: unknown }>
    }
    mockImplementation: (impl: T) => void
    mockRestore: () => void
    mockReturnValue: (value: ReturnType<T>) => void
    mockResolvedValue: (value: ReturnType<T>) => void
    mockRejectedValue: (value: unknown) => void
  }

  export function mock<T extends (...args: any[]) => any>(fn: T): Mock<T>
  export function mock(module: string, factory: () => any, options?: { global?: boolean }): void
  
  export const describe: {
    (name: string, fn: () => void): void
    skip: (name: string, fn: () => void) => void
    only: (name: string, fn: () => void) => void
  }
  
  export const it: {
    (name: string, fn: () => void | Promise<void>): void
    skip: (name: string, fn: () => void | Promise<void>) => void
    only: (name: string, fn: () => void | Promise<void>) => void
    todo: (name: string) => void
  }
  
  export const test: {
    (name: string, fn: () => void | Promise<void>): void
    skip: (name: string, fn: () => void | Promise<void>) => void
    only: (name: string, fn: () => void | Promise<void>) => void
    todo: (name: string) => void
  }
  
  export const expect: {
    <T>(value: T): {
      toBe: (expected: T) => void
      toEqual: (expected: T) => void
      toMatch: (pattern: RegExp | string) => void
      toContain: (expected: T) => void
      toHaveLength: (length: number) => void
      toThrow: (expected?: RegExp | string) => void
      toBeDefined: () => void
      toBeUndefined: () => void
      toBeNull: () => void
      toBeTruthy: () => void
      toBeFalsy: () => void
      toBeGreaterThan: (expected: number) => void
      toBeLessThan: (expected: number) => void
      toBeGreaterThanOrEqual: (expected: number) => void
      toBeLessThanOrEqual: (expected: number) => void
      toBeCloseTo: (expected: number, precision?: number) => void
      toMatchObject: (expected: Partial<T>) => void
      toHaveProperty: (path: string, value?: any) => void
      toHaveBeenCalled: () => void
      toHaveBeenCalledTimes: (count: number) => void
      toHaveBeenCalledWith: (...args: any[]) => void
      lastReturnedWith: (...args: any[]) => void
      nthReturnedWith: (n: number, ...args: any[]) => void
      not: {
        toBe: (expected: T) => void
        toEqual: (expected: T) => void
        toMatch: (pattern: RegExp | string) => void
        toContain: (expected: T) => void
        toHaveLength: (length: number) => void
        toThrow: (expected?: RegExp | string) => void
        toBeDefined: () => void
        toBeUndefined: () => void
        toBeNull: () => void
        toBeTruthy: () => void
        toBeFalsy: () => void
        toBeGreaterThan: (expected: number) => void
        toBeLessThan: (expected: number) => void
        toBeGreaterThanOrEqual: (expected: number) => void
        toBeLessThanOrEqual: (expected: number) => void
        toBeCloseTo: (expected: number, precision?: number) => void
        toMatchObject: (expected: Partial<T>) => void
        toHaveProperty: (path: string, value?: any) => void
        toHaveBeenCalled: () => void
        toHaveBeenCalledTimes: (count: number) => void
        toHaveBeenCalledWith: (...args: any[]) => void
        lastReturnedWith: (...args: any[]) => void
        nthReturnedWith: (n: number, ...args: any[]) => void
      }
    }
  }
  
  export const beforeEach: (fn: () => void | Promise<void>) => void
  export const afterEach: (fn: () => void | Promise<void>) => void
  export const beforeAll: (fn: () => void | Promise<void>) => void
  export const afterAll: (fn: () => void | Promise<void>) => void
  
  export const spyOn: (obj: any, method: string) => {
    mockReturnValue: (value: any) => void
    mockResolvedValue: (value: any) => void
    mockRejectedValue: (value: any) => void
    mockImplementation: (fn: Function) => void
    restore: () => void
  }
}