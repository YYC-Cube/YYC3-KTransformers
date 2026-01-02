/**
 * @file 资源管理器
 * @description 统一管理角色资源的加载、缓存和路径映射
 * @author YYC³ Development Team
 * @version 1.0.0
 * @created 2024-12-14
 */

import { CharacterConfig, CharacterTheme, CharacterExpression } from './character-manager'

// 资源清单接口
interface AssetManifest {
  version: string
  createdAt: string
  characters: {
    [characterId: string]: {
      themes: Array<{
        name: string
        path: string
      }>
      expressions: Array<{
        name: string
        path: string
      }>
      defaultTheme: string
      defaultExpression: string
    }
  }
}

// 资源缓存接口
interface AssetCache {
  images: Map<string, HTMLImageElement>
  manifest: AssetManifest | null
  lastUpdated: number
}

// 资源管理器类
export class AssetManager {
  private static instance: AssetManager
  private cache: AssetCache = {
    images: new Map(),
    manifest: null,
    lastUpdated: 0
  }
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5分钟缓存
  private readonly BASE_PATH = '/characters'

  private constructor() {
    this.loadManifest()
  }

  static getInstance(): AssetManager {
    if (!AssetManager.instance) {
      AssetManager.instance = new AssetManager()
    }
    return AssetManager.instance
  }

  // 加载资源清单
  private async loadManifest(): Promise<void> {
    try {
      const response = await fetch(`${this.BASE_PATH}/manifest.json`)
      if (response.ok) {
        const manifest: AssetManifest = await response.json()
        this.cache.manifest = manifest
        this.cache.lastUpdated = Date.now()
        console.log('✅ 资源清单加载成功')
      }
    } catch (error) {
      console.warn('⚠️ 无法加载资源清单，使用默认配置:', error)
      this.createFallbackManifest()
    }
  }

  // 创建备用清单
  private createFallbackManifest(): void {
    this.cache.manifest = {
      version: '1.0.0',
      createdAt: new Date().toISOString(),
      characters: {
        xiaoyu: {
          themes: [
            { name: 'pink', path: '/Q-MM/xiaoyu_fen.png' },
            { name: 'blue', path: '/Q-MM/xiaoyu_lan.png' },
            { name: 'purple', path: '/Q-MM/Q版MM-6.png' }
          ],
          expressions: [
            { name: 'happy', path: '/Q-MM/Q版MM-3.png' },
            { name: 'excited', path: '/Q-MM/Q版MM-5.png' },
            { name: 'thinking', path: '/Q-MM/Q版MM-2.png' },
            { name: 'cool', path: '/Q-MM/Q版MM-7.png' },
            { name: 'loving', path: '/Q-MM/Q版MM-8.png' }
          ],
          defaultTheme: 'blue',
          defaultExpression: 'happy'
        },
        xiaoyan: {
          themes: [
            { name: 'blue', path: '/Q-GG/Q版GG-2.png' },
            { name: 'green', path: '/Q-GG/Q版GG-3.png' },
            { name: 'orange', path: '/Q-GGMM/Q版GGMM-1.png' }
          ],
          expressions: [
            { name: 'happy', path: '/Q-GG/Q版GG-4.png' },
            { name: 'excited', path: '/Q-GG/Q版GG-5.png' },
            { name: 'thinking', path: '/Q-GG/Q版GG-6.png' },
            { name: 'cool', path: '/Q-GG/Q版GG-7.png' },
            { name: 'brave', path: '/Q-GGMM/Q版GGMM-2.png' }
          ],
          defaultTheme: 'blue',
          defaultExpression: 'happy'
        }
      }
    }
  }

  // 检查缓存是否过期
  private isCacheExpired(): boolean {
    return Date.now() - this.cache.lastUpdated > this.CACHE_DURATION
  }

  // 刷新缓存
  async refreshCache(): Promise<void> {
    this.cache.images.clear()
    await this.loadManifest()
  }

  // 获取角色主题路径
  getThemeAssetPath(character: CharacterConfig, themeName: string): string {
    if (!this.cache.manifest) {
      return this.getLegacyAssetPath(character, themeName, 'theme')
    }

    const characterId = character.id
    const characterManifest = this.cache.manifest.characters[characterId]

    if (!characterManifest) {
      return this.getLegacyAssetPath(character, themeName, 'theme')
    }

    const theme = characterManifest.themes.find(t => t.name === themeName)
    return theme ? theme.path : character.defaultImage
  }

  // 获取角色表情路径
  getExpressionAssetPath(character: CharacterConfig, expressionName: string): string {
    if (!this.cache.manifest) {
      return this.getLegacyAssetPath(character, expressionName, 'expression')
    }

    const characterId = character.id
    const characterManifest = this.cache.manifest.characters[characterId]

    if (!characterManifest) {
      return this.getLegacyAssetPath(character, expressionName, 'expression')
    }

    const expression = characterManifest.expressions.find(e => e.name === expressionName)
    return expression ? expression.path : character.defaultImage
  }

  // 获取传统资源路径（向后兼容）
  private getLegacyAssetPath(character: CharacterConfig, assetName: string, assetType: 'theme' | 'expression'): string {
    if (assetType === 'theme') {
      const theme = character.themes.find(t => t.name === assetName)
      return theme ? theme.imagePath : character.defaultImage
    } else {
      const expression = character.expressions.find(e => e.name === assetName)
      return expression ? expression.imagePath : character.defaultImage
    }
  }

  // 预加载资源
  async preloadAssets(character: CharacterConfig): Promise<void> {
    const assetPaths: string[] = []

    // 添加默认图片
    assetPaths.push(character.defaultImage)

    // 添加主题图片
    character.themes.forEach(theme => {
      const path = this.getThemeAssetPath(character, theme.name)
      if (path && !assetPaths.includes(path)) {
        assetPaths.push(path)
      }
    })

    // 添加表情图片
    character.expressions.forEach(expression => {
      const path = this.getExpressionAssetPath(character, expression.name)
      if (path && !assetPaths.includes(path)) {
        assetPaths.push(path)
      }
    })

    // 并行预加载所有图片
    const preloadPromises = assetPaths.map(path => this.preloadImage(path))
    await Promise.allSettled(preloadPromises)

    console.log(`✅ 完成 ${character.name} 的资源预加载，共 ${assetPaths.length} 个文件`)
  }

  // 预加载单个图片
  private preloadImage(path: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // 检查缓存
      if (this.cache.images.has(path)) {
        resolve()
        return
      }

      const img = new Image()

      img.onload = () => {
        this.cache.images.set(path, img)
        resolve()
      }

      img.onerror = () => {
        console.warn(`⚠️ 图片加载失败: ${path}`)
        resolve() // 继续执行，不阻塞其他资源
      }

      img.src = path
    })
  }

  // 获取缓存的图片
  getCachedImage(path: string): HTMLImageElement | null {
    return this.cache.images.get(path) || null
  }

  // 批量获取角色资源信息
  getCharacterAssets(character: CharacterConfig): {
    default: string
    themes: Array<{ name: string; displayName: string; path: string }>
    expressions: Array<{ name: string; displayName: string; path: string }>
  } {
    const themes = character.themes.map(theme => ({
      name: theme.name,
      displayName: theme.displayName,
      path: this.getThemeAssetPath(character, theme.name)
    }))

    const expressions = character.expressions.map(expression => ({
      name: expression.name,
      displayName: expression.displayName,
      path: this.getExpressionAssetPath(character, expression.name)
    }))

    return {
      default: character.defaultImage,
      themes,
      expressions
    }
  }

  // 资源验证
  async validateAsset(path: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image()

      img.onload = () => resolve(true)
      img.onerror = () => resolve(false)

      img.src = path
    })
  }

  // 批量验证角色资源
  async validateCharacterAssets(character: CharacterConfig): Promise<{
    total: number
    valid: number
    invalid: string[]
  }> {
    const assetPaths = [
      character.defaultImage,
      ...character.themes.map(t => this.getThemeAssetPath(character, t.name)),
      ...character.expressions.map(e => this.getExpressionAssetPath(character, e.name))
    ]

    const uniquePaths = Array.from(new Set(assetPaths))
    const results = await Promise.allSettled(
      uniquePaths.map(path => this.validateAsset(path))
    )

    const valid = results.filter(r =>
      r.status === 'fulfilled' && r.value === true
    ).length

    const invalid = uniquePaths.filter((_, index) =>
      results[index].status === 'fulfilled' &&
      results[index].value === false
    )

    return {
      total: uniquePaths.length,
      valid,
      invalid
    }
  }

  // 清理缓存
  clearCache(): void {
    this.cache.images.clear()
    this.cache.manifest = null
    this.cache.lastUpdated = 0
  }

  // 获取缓存统计
  getCacheStats(): {
    imageCount: number
    manifestLoaded: boolean
    lastUpdated: string
  } {
    return {
      imageCount: this.cache.images.size,
      manifestLoaded: this.cache.manifest !== null,
      lastUpdated: new Date(this.cache.lastUpdated).toISOString()
    }
  }
}

// 导出单例实例
export const assetManager = AssetManager.getInstance()

// 导出便捷函数
export const getThemeAssetPath = (character: CharacterConfig, themeName: string) =>
  assetManager.getThemeAssetPath(character, themeName)

export const getExpressionAssetPath = (character: CharacterConfig, expressionName: string) =>
  assetManager.getExpressionAssetPath(character, expressionName)

export const preloadCharacterAssets = (character: CharacterConfig) =>
  assetManager.preloadAssets(character)

export const getCharacterAssets = (character: CharacterConfig) =>
  assetManager.getCharacterAssets(character)