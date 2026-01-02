/**
 * YYC³ AI小语智能成长守护系统 - 类型守卫工具
 * 提供类型安全的检查和转换函数
 */

import { z } from 'zod'

// ===== 基础类型守卫 =====

/**
 * 检查值是否为字符串
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string'
}

/**
 * 检查值是否为数字
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value)
}

/**
 * 检查值是否为布尔值
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean'
}

/**
 * 检查值是否为对象（且不是null）
 */
export function isObject(value: unknown): value is Record<string, any> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * 检查值是否为数组
 */
export function isArray<T>(value: unknown, guard?: (item: unknown) => item is T): value is T[] {
  if (!Array.isArray(value)) return false
  if (guard) {
    return value.every(guard)
  }
  return true
}

/**
 * 检查值是否为函数
 */
export function isFunction(value: unknown): value is Function {
  return typeof value === 'function'
}

/**
 * 检查值是否为null
 */
export function isNull(value: unknown): value is null {
  return value === null
}

/**
 * 检查值是否为undefined
 */
export function isUndefined(value: unknown): value is undefined {
  return value === undefined
}

/**
 * 检查值是否为null或undefined
 */
export function isNil(value: unknown): value is null | undefined {
  return isNull(value) || isUndefined(value)
}

/**
 * 检查值是否为空（null、undefined、空字符串、空数组、空对象）
 */
export function isEmpty(value: unknown): boolean {
  if (isNil(value)) return true
  if (isString(value)) return value.trim().length === 0
  if (isArray(value)) return value.length === 0
  if (isObject(value)) return Object.keys(value).length === 0
  return false
}

// ===== 日期和时间类型守卫 =====

/**
 * 检查值是否为有效的日期
 */
export function isValidDate(value: unknown): value is Date {
  return value instanceof Date && !isNaN(value.getTime())
}

/**
 * 检查值是否为日期字符串
 */
export function isDateString(value: unknown): value is string {
  if (!isString(value)) return false
  const date = new Date(value)
  return isValidDate(date) && date.toISOString().slice(0, 10) === value
}

/**
 * 转换为安全的日期对象
 */
export function toSafeDate(value: unknown): Date | null {
  if (isValidDate(value)) return value
  if (isDateString(value)) return new Date(value)
  if (isNumber(value)) {
    const date = new Date(value)
    if (isValidDate(date)) return date
  }
  return null
}

// ===== UUID 和 ID 类型守卫 =====

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

/**
 * 检查值是否为有效的UUID
 */
export function isUUID(value: unknown): value is string {
  return isString(value) && UUID_REGEX.test(value)
}

/**
 * 检查值是否为有效的ID（字符串或数字）
 */
export function isValidId(value: unknown): value is string | number {
  return (isString(value) && value.trim().length > 0) || (isNumber(value) && value > 0)
}

// ===== 邮箱和 URL 类型守卫 =====

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const URL_REGEX = /^https?:\/\/.+/

/**
 * 检查值是否为有效的邮箱地址
 */
export function isEmail(value: unknown): value is string {
  return isString(value) && EMAIL_REGEX.test(value)
}

/**
 * 检查值是否为有效的URL
 */
export function isURL(value: unknown): value is string {
  return isString(value) && URL_REGEX.test(value)
}

// ===== 用户相关类型守卫 =====

/**
 * 检查用户对象是否有效
 */
export function isValidUser(value: unknown): value is {
  id: string
  email: string
  name: string
  role: string
} {
  if (!isObject(value)) return false

  const required = ['id', 'email', 'name', 'role']
  return required.every(key => key in value) &&
         isUUID(value.id) &&
         isEmail(value.email) &&
         isString(value.name) &&
         isString(value.role)
}

/**
 * 检查用户偏好是否有效
 */
export function isValidUserPreferences(value: unknown): value is {
  theme: 'light' | 'dark' | 'auto'
  language: 'zh' | 'en'
  notifications: boolean
  voiceEnabled: boolean
  autoPlay: boolean
} {
  if (!isObject(value)) return false

  return ['theme', 'language', 'notifications', 'voiceEnabled', 'autoPlay'].every(key => key in value) &&
         ['light', 'dark', 'auto'].includes(value.theme) &&
         ['zh', 'en'].includes(value.language) &&
         isBoolean(value.notifications) &&
         isBoolean(value.voiceEnabled) &&
         isBoolean(value.autoPlay)
}

// ===== API 相关类型守卫 =====

/**
 * 检查 API 响应是否有效
 */
export function isValidApiResponse<T>(value: unknown): value is {
  success: boolean
  data?: T
  error?: string
  message?: string
} {
  if (!isObject(value)) return false
  return 'success' in value && isBoolean(value.success)
}

/**
 * 检查分页参数是否有效
 */
export function isValidPaginationParams(value: unknown): value is {
  page?: number
  limit?: number
  offset?: number
} {
  if (!isObject(value)) return false

  const keys = Object.keys(value)
  if (keys.length === 0) return true // 空对象是有效的

  return keys.every(key => {
    if (!['page', 'limit', 'offset'].includes(key)) return false
    const val = value[key]
    return isNumber(val) && val >= 0
  })
}

// ===== AI 相关类型守卫 =====

/**
 * 检查 AI 消息是否有效
 */
export function isValidAIMessage(value: unknown): value is {
  id: string
  content: string
  type: 'user' | 'assistant' | 'system'
  timestamp: string
} {
  if (!isObject(value)) return false

  return ['id', 'content', 'type', 'timestamp'].every(key => key in value) &&
         isUUID(value.id) &&
         isString(value.content) &&
         ['user', 'assistant', 'system'].includes(value.type) &&
         (isDateString(value.timestamp) || isValidDate(value.timestamp))
}

/**
 * 检查多模态内容是否有效
 */
export function isValidMultimodalContent(value: unknown): value is {
  id: string
  type: string
  content: any
  metadata: Record<string, any>
} {
  if (!isObject(value)) return false

  return ['id', 'type', 'content', 'metadata'].every(key => key in value) &&
         isUUID(value.id) &&
         isString(value.type) &&
         isObject(value.metadata)
}

// ===== 文件和附件类型守卫 =====

/**
 * 检查文件对象是否有效
 */
export function isValidFile(value: unknown): value is {
  name: string
  size: number
  type: string
  lastModified: number
} {
  if (!isObject(value)) return false

  return ['name', 'size', 'type', 'lastModified'].every(key => key in value) &&
         isString(value.name) &&
         isNumber(value.size) && value.size >= 0 &&
         isString(value.type) &&
         isNumber(value.lastModified)
}

/**
 * 检查 MIME 类型是否为图片
 */
export function isImageMimeType(value: unknown): value is string {
  if (!isString(value)) return false
  const imageTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'image/avif'
  ]
  return imageTypes.includes(value)
}

/**
 * 检查 MIME 类型是否为音频
 */
export function isAudioMimeType(value: unknown): value is string {
  if (!isString(value)) return false
  const audioTypes = [
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'audio/ogg',
    'audio/webm'
  ]
  return audioTypes.includes(value)
}

/**
 * 检查 MIME 类型是否为视频
 */
export function isVideoMimeType(value: unknown): value is string {
  if (!isString(value)) return false
  const videoTypes = [
    'video/mp4',
    'video/webm',
    'video/ogg',
    'video/quicktime'
  ]
  return videoTypes.includes(value)
}

// ===== 安全相关类型守卫 =====

/**
 * 检查字符串是否安全（不包含XSS风险）
 */
export function isSafeString(value: unknown): value is string {
  if (!isString(value)) return false

  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /data:text\/html/i
  ]

  return !dangerousPatterns.some(pattern => pattern.test(value))
}

/**
 * 清理HTML字符串，移除潜在的XSS风险
 */
export function sanitizeHtml(value: unknown): string {
  if (!isString(value)) return ''

  return value
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim()
}

// ===== Zod Schema 创建器 =====

/**
 * 创建安全的字符串 schema
 */
export function safeStringSchema(minLength = 0, maxLength = Infinity) {
  return z.string()
    .min(minLength)
    .max(maxLength)
    .transform(value => sanitizeHtml(value))
}

/**
 * 创建邮箱 schema
 */
export function emailSchema() {
  return z.string().email().transform(value => value.toLowerCase().trim())
}

/**
 * 创建 UUID schema
 */
export function uuidSchema() {
  return z.string().uuid()
}

/**
 * 创建分页参数 schema
 */
export function paginationSchema() {
  return z.object({
    page: z.number().int().min(0).optional().default(0),
    limit: z.number().int().min(1).max(100).optional().default(10),
    offset: z.number().int().min(0).optional()
  })
}

/**
 * 创建日期 schema
 */
export function dateSchema() {
  return z.string().datetime().or(z.date()).transform(value => {
    if (typeof value === 'string') {
      const date = new Date(value)
      if (!isValidDate(date)) {
        throw new Error('Invalid date format')
      }
      return date
    }
    return value
  })
}

// ===== 类型断言辅助函数 =====

/**
 * 类型断言包装器，提供更好的错误信息
 */
export function assertType<T>(
  value: unknown,
  guard: (value: unknown) => value is T,
  message?: string
): asserts value is T {
  if (!guard(value)) {
    throw new TypeError(message || `Type assertion failed for value: ${JSON.stringify(value)}`)
  }
}

/**
 * 安全的类型转换
 */
export function safeCast<T>(
  value: unknown,
  guard: (value: unknown) => value is T,
  fallback?: T
): T | undefined {
  try {
    return guard(value) ? value : fallback
  } catch {
    return fallback
  }
}

/**
 * 带默认值的类型转换
 */
export function castWithDefault<T>(
  value: unknown,
  guard: (value: unknown) => value is T,
  defaultValue: T
): T {
  return guard(value) ? value : defaultValue
}

// ===== 联合类型辅助函数 =====

/**
 * 创建类型守卫联合
 */
export function oneOf<T extends readonly unknown[]>(
  values: T,
  guard?: (value: unknown) => value is T[number]
) {
  return (value: unknown): value is T[number] => {
    if (guard) return guard(value)
    return values.includes(value as T[number])
  }
}

/**
 * 创建可空类型守卫
 */
export function nullable<T>(guard: (value: unknown) => value is T) {
  return (value: unknown): value is T | null => {
    return isNull(value) || guard(value)
  }
}

/**
 * 创建可选类型守卫
 */
export function optional<T>(guard: (value: unknown) => value is T) {
  return (value: unknown): value is T | undefined => {
    return isUndefined(value) || guard(value)
  }
}

// ===== 键类型守卫 =====

/**
 * 检查键是否存在于对象中
 */
export function hasKey<T extends Record<string, any>>(
  obj: T,
  key: string | number | symbol
): key is keyof T {
  return key in obj
}

/**
 * 检查对象是否具有指定的键
 */
export function hasKeys<T extends Record<string, any>>(
  obj: unknown,
  keys: (keyof T)[]
): obj is T {
  if (!isObject(obj)) return false
  return keys.every(key => hasKey(obj, key))
}