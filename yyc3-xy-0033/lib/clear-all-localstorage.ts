/**
 * 紧急清理所有localStorage数据
 * 用于解决ByteString错误
 */
export function emergencyClearAllLocalStorage(): void {
  try {
    if (typeof window === "undefined") return

    // 获取所有localStorage键
    const keys: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key) keys.push(key)
    }

    // 删除所有项
    keys.forEach(key => {
      try {
        localStorage.removeItem(key)
        console.log(`Removed localStorage key: ${key}`)
      } catch (error) {
        console.warn(`Failed to remove key: ${key}`, error)
      }
    })

    console.log(`Cleared ${keys.length} localStorage entries`)
  } catch (error) {
    console.error("Failed to clear localStorage:", error)
  }
}