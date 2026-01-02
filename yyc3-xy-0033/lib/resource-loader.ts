/**
 * @file 资源加载器
 * @description 专门处理角色资源的异步加载、进度跟踪和错误处理
 * @author YYC³ Development Team
 * @version 1.0.0
 * @created 2024-12-14
 */

import { CharacterConfig } from './character-manager'

// 加载状态枚举
export enum LoadingStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error',
  PARTIAL = 'partial'
}

// 加载进度接口
export interface LoadingProgress {
  total: number
  loaded: number
  failed: number
  percentage: number
  status: LoadingStatus
  currentFile?: string
}

// 加载选项接口
interface LoadingOptions {
  timeout?: number
  retryAttempts?: number
  retryDelay?: number
  onProgress?: (progress: LoadingProgress) => void
  onSuccess?: (results: LoadingResult) => void
  onError?: (error: Error, results: LoadingResult) => void
}

// 加载结果接口
export interface LoadingResult {
  successful: Array<{
    path: string
    type: 'default' | 'theme' | 'expression'
    loadTime: number
  }>
  failed: Array<{
    path: string
    error: string
    type: 'default' | 'theme' | 'expression'
  }>
  totalTime: number
  cacheHits: number
}

// 资源加载器类
export class ResourceLoader {
  private static instance: ResourceLoader
  private loadingPromises: Map<string, Promise<void>> = new Map()
  private retryQueues: Map<string, number> = new Map()

  private constructor() {}

  static getInstance(): ResourceLoader {
    if (!ResourceLoader.instance) {
      ResourceLoader.instance = new ResourceLoader()
    }
    return ResourceLoader.instance
  }

  // 加载角色资源
  async loadCharacterResources(
    character: CharacterConfig,
    options: LoadingOptions = {}
  ): Promise<LoadingResult> {
    const {
      timeout = 10000,
      retryAttempts = 3,
      retryDelay = 1000,
      onProgress,
      onSuccess,
      onError
    } = options

    const startTime = Date.now()
    const assetPaths = this.collectAssetPaths(character)

    const progress: LoadingProgress = {
      total: assetPaths.length,
      loaded: 0,
      failed: 0,
      percentage: 0,
      status: LoadingStatus.LOADING
    }

    onProgress?.(progress)

    const result: LoadingResult = {
      successful: [],
      failed: [],
      totalTime: 0,
      cacheHits: 0
    }

    // 并行加载所有资源
    const loadingPromises = assetPaths.map(async ({ path, type }) => {
      try {
        const loadStartTime = Date.now()

        // 检查是否已在加载中
        if (this.loadingPromises.has(path)) {
          await this.loadingPromises.get(path)
          result.cacheHits++
          return
        }

        // 创建加载 Promise
        const loadPromise = this.loadSingleAsset(path, timeout)
        this.loadingPromises.set(path, loadPromise)

        await loadPromise
        const loadTime = Date.now() - loadStartTime

        result.successful.push({ path, type, loadTime })
        progress.loaded++

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'

        // 重试逻辑
        if (this.shouldRetry(path, retryAttempts)) {
          await this.delay(retryDelay)
          return this.loadSingleAsset(path, timeout)
        }

        result.failed.push({ path, error: errorMessage, type })
        progress.failed++
      } finally {
        this.loadingPromises.delete(path)
        this.retryQueues.delete(path)

        progress.percentage = Math.round((progress.loaded / progress.total) * 100)
        onProgress?.(progress)
      }
    })

    await Promise.allSettled(loadingPromises)

    // 更新最终状态
    result.totalTime = Date.now() - startTime
    progress.status = this.determineFinalStatus(progress)

    // 触发回调
    if (progress.status === LoadingStatus.SUCCESS) {
      onSuccess?.(result)
    } else if (progress.status === LoadingStatus.ERROR) {
      onError?.(new Error('Resource loading failed'), result)
    } else if (onProgress) {
      onProgress(progress) // 部分成功状态
    }

    return result
  }

  // 收集所有资源路径
  private collectAssetPaths(character: CharacterConfig): Array<{ path: string; type: 'default' | 'theme' | 'expression' }> {
    const paths: Array<{ path: string; type: 'default' | 'theme' | 'expression' }> = []

    // 添加默认图片
    paths.push({ path: character.defaultImage, type: 'default' })

    // 添加主题图片
    character.themes.forEach(theme => {
      paths.push({ path: theme.imagePath, type: 'theme' })
    })

    // 添加表情图片
    character.expressions.forEach(expression => {
      paths.push({ path: expression.imagePath, type: 'expression' })
    })

    return paths
  }

  // 加载单个资源
  private async loadSingleAsset(path: string, timeout: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      const timeoutId = setTimeout(() => {
        reject(new Error(`Loading timeout: ${path}`))
      }, timeout)

      img.onload = () => {
        clearTimeout(timeoutId)
        resolve()
      }

      img.onerror = () => {
        clearTimeout(timeoutId)
        reject(new Error(`Failed to load image: ${path}`))
      }

      // 开始加载
      img.src = path
    })
  }

  // 判断是否应该重试
  private shouldRetry(path: string, maxAttempts: number): boolean {
    const currentAttempts = this.retryQueues.get(path) || 0
    if (currentAttempts < maxAttempts) {
      this.retryQueues.set(path, currentAttempts + 1)
      return true
    }
    return false
  }

  // 延迟函数
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // 确定最终状态
  private determineFinalStatus(progress: LoadingProgress): LoadingStatus {
    if (progress.failed === 0) {
      return LoadingStatus.SUCCESS
    }
    if (progress.loaded === 0) {
      return LoadingStatus.ERROR
    }
    return LoadingStatus.PARTIAL
  }

  // 预加载多个角色资源
  async preloadMultipleCharacters(
    characters: CharacterConfig[],
    options: LoadingOptions & { concurrent?: boolean } = {}
  ): Promise<Map<string, LoadingResult>> {
    const { concurrent = true, ...loadOptions } = options
    const results = new Map<string, LoadingResult>()

    if (concurrent) {
      // 并行加载
      const loadingPromises = characters.map(async character => {
        try {
          const result = await this.loadCharacterResources(character, loadOptions)
          results.set(character.id, result)
        } catch (error) {
          const errorResult: LoadingResult = {
            successful: [],
            failed: [{ path: character.id, error: 'Failed to load character', type: 'default' }],
            totalTime: 0,
            cacheHits: 0
          }
          results.set(character.id, errorResult)
        }
      })

      await Promise.allSettled(loadingPromises)
    } else {
      // 串行加载
      for (const character of characters) {
        try {
          const result = await this.loadCharacterResources(character, loadOptions)
          results.set(character.id, result)
        } catch (error) {
          const errorResult: LoadingResult = {
            successful: [],
            failed: [{ path: character.id, error: 'Failed to load character', type: 'default' }],
            totalTime: 0,
            cacheHits: 0
          }
          results.set(character.id, errorResult)
        }
      }
    }

    return results
  }

  // 验证资源完整性
  async validateResourceIntegrity(character: CharacterConfig): Promise<{
    isValid: boolean
    missingAssets: string[]
    totalAssets: number
  }> {
    const assetPaths = this.collectAssetPaths(character)
    const validationPromises = assetPaths.map(({ path }) =>
      this.validateSingleAsset(path)
    )

    const results = await Promise.allSettled(validationPromises)
    const missingAssets: string[] = []

    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && !result.value) {
        missingAssets.push(assetPaths[index].path)
      } else if (result.status === 'rejected') {
        missingAssets.push(assetPaths[index].path)
      }
    })

    return {
      isValid: missingAssets.length === 0,
      missingAssets,
      totalAssets: assetPaths.length
    }
  }

  // 验证单个资源
  private async validateSingleAsset(path: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image()

      img.onload = () => resolve(true)
      img.onerror = () => resolve(false)

      img.src = path
    })
  }

  // 清理加载缓存
  clearLoadingCache(): void {
    this.loadingPromises.clear()
    this.retryQueues.clear()
  }

  // 获取加载统计
  getLoadingStats(): {
    activeLoading: number
    retryQueueSize: number
  } {
    return {
      activeLoading: this.loadingPromises.size,
      retryQueueSize: this.retryQueues.size
    }
  }
}

// 导出单例实例
export const resourceLoader = ResourceLoader.getInstance()

// 导出便捷函数
export const loadCharacterResources = (character: CharacterConfig, options?: LoadingOptions) =>
  resourceLoader.loadCharacterResources(character, options)

export const preloadMultipleCharacters = (characters: CharacterConfig[], options?: LoadingOptions & { concurrent?: boolean }) =>
  resourceLoader.preloadMultipleCharacters(characters, options)

export const validateResourceIntegrity = (character: CharacterConfig) =>
  resourceLoader.validateResourceIntegrity(character)