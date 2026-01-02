/**
 * localStorage安全操作工具
 * 解决 ByteString 转换错误（字符值 > 255）
 */

// 清理数据中的非ASCII字符
export function cleanLocalStorageData(data: string): string {
  return data.replace(/[^\x00-\x7F]/g, "")
}

// 安全保存到localStorage
export function safeLocalStorageSetItem(key: string, value: any): void {
  try {
    if (typeof window === "undefined") return

    const stringValue = typeof value === "string" ? value : JSON.stringify(value)
    const cleanedValue = cleanLocalStorageData(stringValue)
    localStorage.setItem(key, cleanedValue)
  } catch (error) {
    console.warn(`Failed to save to localStorage (key: ${key}):`, error)
  }
}

// 安全从localStorage读取
export function safeLocalStorageGetItem(key: string): string | null {
  try {
    if (typeof window === "undefined") return null

    const value = localStorage.getItem(key)
    if (value === null) return null

    // 清理读取的数据
    return cleanLocalStorageData(value)
  } catch (error) {
    console.warn(`Failed to read from localStorage (key: ${key}):`, error)
    return null
  }
}

// 安全解析JSON
export function safeLocalStorageParse<T>(key: string, defaultValue: T): T {
  try {
    const value = safeLocalStorageGetItem(key)
    if (!value) return defaultValue

    return JSON.parse(value)
  } catch (error) {
    console.warn(`Failed to parse localStorage data (key: ${key}):`, error)
    // 清理损坏的数据
    safeLocalStorageRemoveItem(key)
    return defaultValue
  }
}

// 安全删除localStorage项
export function safeLocalStorageRemoveItem(key: string): void {
  try {
    if (typeof window === "undefined") return
    localStorage.removeItem(key)
  } catch (error) {
    console.warn(`Failed to remove from localStorage (key: ${key}):`, error)
  }
}

// 清理所有损坏的localStorage数据
export function cleanCorruptedLocalStorageData(): void {
  try {
    if (typeof window === "undefined") return

    const keysToRemove: string[] = []

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (!key) continue

      try {
        const value = localStorage.getItem(key)
        if (value && /[^\x00-\x7F]/.test(value)) {
          keysToRemove.push(key)
        }
      } catch (error) {
        keysToRemove.push(key)
      }
    }

    keysToRemove.forEach(key => {
      try {
        localStorage.removeItem(key)
        console.log(`Removed corrupted localStorage key: ${key}`)
      } catch (error) {
        console.warn(`Failed to remove corrupted key: ${key}`, error)
      }
    })

    console.log(`Cleaned ${keysToRemove.length} corrupted localStorage entries`)
  } catch (error) {
    console.warn("Failed to clean corrupted localStorage data:", error)
  }
}