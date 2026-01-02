// Web Vitals 监控
export interface WebVitalsMetric {
  name: "CLS" | "FCP" | "FID" | "INP" | "LCP" | "TTFB"
  value: number
  rating: "good" | "needs-improvement" | "poor"
  delta: number
  id: string
}

const thresholds = {
  CLS: [0.1, 0.25],
  FCP: [1800, 3000],
  FID: [100, 300],
  INP: [200, 500],
  LCP: [2500, 4000],
  TTFB: [800, 1800],
}

function getRating(name: string, value: number): "good" | "needs-improvement" | "poor" {
  const [good, poor] = thresholds[name as keyof typeof thresholds] || [0, 0]
  if (value <= good) return "good"
  if (value <= poor) return "needs-improvement"
  return "poor"
}

export function reportWebVitals(metric: WebVitalsMetric) {
  const rating = getRating(metric.name, metric.value)

  if (process.env.NODE_ENV === "development") {
    const color = rating === "good" ? "32" : rating === "needs-improvement" ? "33" : "31"
    console.log(`\x1b[${color}m[WebVitals] ${metric.name}: ${metric.value.toFixed(2)} (${rating})\x1b[0m`)
  }

  // 生产环境发送到分析服务
  if (process.env.NODE_ENV === "production" && typeof navigator !== "undefined" && "sendBeacon" in navigator) {
    navigator.sendBeacon(
      "/api/analytics/vitals",
      JSON.stringify({
        metric: metric.name,
        value: metric.value,
        rating,
        path: typeof window !== "undefined" ? window.location.pathname : "",
        timestamp: Date.now(),
      }),
    )
  }
}

// 资源预加载管理器
export class ResourcePreloader {
  private loadedResources = new Set<string>()

  // 预连接关键域名
  preconnect(url: string) {
    if (typeof document === "undefined" || this.loadedResources.has(`preconnect:${url}`)) return

    const link = document.createElement("link")
    link.rel = "preconnect"
    link.href = url
    link.crossOrigin = "anonymous"
    document.head.appendChild(link)
    this.loadedResources.add(`preconnect:${url}`)
  }

  // DNS预解析
  dnsPrefetch(url: string) {
    if (typeof document === "undefined" || this.loadedResources.has(`dns:${url}`)) return

    const link = document.createElement("link")
    link.rel = "dns-prefetch"
    link.href = url
    document.head.appendChild(link)
    this.loadedResources.add(`dns:${url}`)
  }

  // 预加载关键资源
  preload(url: string, as: "script" | "style" | "image" | "font") {
    if (typeof document === "undefined" || this.loadedResources.has(`preload:${url}`)) return

    const link = document.createElement("link")
    link.rel = "preload"
    link.href = url
    link.as = as
    if (as === "font") link.crossOrigin = "anonymous"
    document.head.appendChild(link)
    this.loadedResources.add(`preload:${url}`)
  }

  // 预渲染页面
  prefetch(url: string) {
    if (typeof document === "undefined" || this.loadedResources.has(`prefetch:${url}`)) return

    const link = document.createElement("link")
    link.rel = "prefetch"
    link.href = url
    document.head.appendChild(link)
    this.loadedResources.add(`prefetch:${url}`)
  }
}

export const preloader = new ResourcePreloader()

// 图片懒加载优化器
export class ImageLazyLoader {
  private observer: IntersectionObserver | null = null

  init(rootMargin = "100px") {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            if (img.dataset.src) {
              img.src = img.dataset.src
              img.removeAttribute("data-src")
              img.classList.add("loaded")
            }
            if (img.dataset.srcset) {
              img.srcset = img.dataset.srcset
              img.removeAttribute("data-srcset")
            }
            this.observer?.unobserve(img)
          }
        })
      },
      { rootMargin, threshold: 0.01 },
    )
  }

  observe(selector = "img[data-src]") {
    if (!this.observer) this.init()
    document.querySelectorAll(selector).forEach((img) => {
      this.observer?.observe(img)
    })
  }

  disconnect() {
    this.observer?.disconnect()
    this.observer = null
  }
}

export const imageLazyLoader = new ImageLazyLoader()

// 智能缓存管理器
export class CacheManager {
  private cacheKey = "yyc3_cache_v1"

  // 设置缓存
  set<T>(key: string, data: T, ttlMs: number = 5 * 60 * 1000): void {
    if (typeof localStorage === "undefined") return

    const cacheData = {
      data,
      timestamp: Date.now(),
      ttl: ttlMs,
    }

    try {
      localStorage.setItem(`${this.cacheKey}:${key}`, JSON.stringify(cacheData))
    } catch (e) {
      this.clearExpired()
    }
  }

  // 获取缓存
  get<T>(key: string): T | null {
    if (typeof localStorage === "undefined") return null

    try {
      const cached = localStorage.getItem(`${this.cacheKey}:${key}`)
      if (!cached) return null

      const { data, timestamp, ttl } = JSON.parse(cached)
      if (Date.now() - timestamp > ttl) {
        localStorage.removeItem(`${this.cacheKey}:${key}`)
        return null
      }

      return data as T
    } catch {
      return null
    }
  }

  // 清除过期缓存
  clearExpired(): void {
    if (typeof localStorage === "undefined") return

    const keysToRemove: string[] = []

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith(this.cacheKey)) {
        try {
          const cached = localStorage.getItem(key)
          if (cached) {
            const { timestamp, ttl } = JSON.parse(cached)
            if (Date.now() - timestamp > ttl) {
              keysToRemove.push(key)
            }
          }
        } catch {
          keysToRemove.push(key!)
        }
      }
    }

    keysToRemove.forEach((key) => localStorage.removeItem(key))
  }

  // 清除所有缓存
  clearAll(): void {
    if (typeof localStorage === "undefined") return

    const keysToRemove: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith(this.cacheKey)) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key))
  }
}

export const cacheManager = new CacheManager()

// 防抖函数
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), wait)
  }
}

// 节流函数
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle = false

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// 性能标记工具
export const perfMarker = {
  mark(label: string) {
    if (typeof performance !== "undefined" && performance.mark) {
      performance.mark(label)
    }
  },

  measure(name: string, startMark: string, endMark: string): number | null {
    if (typeof performance !== "undefined" && performance.measure) {
      try {
        performance.measure(name, startMark, endMark)
        const measure = performance.getEntriesByName(name)[0]
        return measure.duration
      } catch {
        return null
      }
    }
    return null
  },

  logTiming(label: string, startMark: string) {
    this.mark(`${label}_end`)
    const duration = this.measure(label, startMark, `${label}_end`)
    if (duration !== null && process.env.NODE_ENV === "development") {
      console.log(`[Perf] ${label}: ${duration.toFixed(2)}ms`)
    }
    return duration
  },
}

// 初始化所有性能优化
export function initPerformanceOptimizations() {
  if (typeof window === "undefined") return

  // 预连接关键CDN
  preloader.preconnect("https://cdn.jsdelivr.net")
  preloader.dnsPrefetch("https://fonts.googleapis.com")

  // 初始化图片懒加载
  imageLazyLoader.init("200px")

  // 清理过期缓存
  cacheManager.clearExpired()

  // 监听页面可见性变化
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      cacheManager.clearExpired()
    }
  })
}
