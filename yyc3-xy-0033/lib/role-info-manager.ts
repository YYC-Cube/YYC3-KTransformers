/**
 * @file 角色信息统一管理器
 * @description 统一管理全局角色信息，确保角色形象、头像、档案信息一致准确
 * @author YYC³ Development Team
 * @version 1.0.0
 * @created 2025-01-30
 */

import { characterManager, type CharacterConfig } from "./character-manager"
import { AI_ROLES, type AIRole, type RoleConfig } from "./ai_roles"
import { characterValidator } from "./character-validator"

// 角色信息统一接口
export interface UnifiedRoleInfo {
  // 基础角色信息
  id: string
  name: string
  gender: 'male' | 'female'
  
  // AI角色信息
  aiRole?: AIRole
  aiRoleConfig?: RoleConfig
  
  // 角色形象信息
  avatar: {
    default: string
    aiFloating: string
    growth: string
    settings: string
    expressions: Array<{
      id: string
      name: string
      imagePath: string
      triggers: string[]
    }>
  }
  
  // 角色主题信息
  themes: Array<{
    id: string
    name: string
    displayName: string
    primaryColor: string
    secondaryColor: string
    imagePath: string
    gradient: string
  }>
  
  // 角色档案信息
  profile: {
    age: number
    birthday: {
      lunar: string
      solar: string
    }
    zodiac: string
    personality: {
      traits: string[]
      speechStyle: string
      interactionTone: string
      catchphrases: string[]
    }
    voiceSettings: {
      preferredGender: 'male' | 'female' | 'neutral'
      speechRate: number
      pitch: number
      volume: number
    }
  }
}

// 角色信息管理器类
export class RoleInfoManager {
  private static instance: RoleInfoManager
  private roleInfoCache: Map<string, UnifiedRoleInfo> = new Map()
  private lastValidationTime: number = 0
  private validationInterval: number = 5 * 60 * 1000 // 5分钟验证一次

  private constructor() {
    this.initializeRoleInfo()
  }

  static getInstance(): RoleInfoManager {
    if (!RoleInfoManager.instance) {
      RoleInfoManager.instance = new RoleInfoManager()
    }
    return RoleInfoManager.instance
  }

  // 初始化角色信息
  private initializeRoleInfo(): void {
    // 初始化女性角色信息
    const femaleCharacter = characterManager.getCharacterByGender('female')
    const femaleRoleInfo = this.createUnifiedRoleInfo(femaleCharacter)
    this.roleInfoCache.set('female', femaleRoleInfo)

    // 初始化男性角色信息
    const maleCharacter = characterManager.getCharacterByGender('male')
    const maleRoleInfo = this.createUnifiedRoleInfo(maleCharacter)
    this.roleInfoCache.set('male', maleRoleInfo)

    // 验证角色信息一致性
    this.validateRoleInfoConsistency()
  }

  // 创建统一角色信息
  private createUnifiedRoleInfo(character: CharacterConfig): UnifiedRoleInfo {
    return {
      id: character.id,
      name: character.name,
      gender: character.gender,
      
      // AI角色信息 - 根据角色特点分配默认AI角色
      aiRole: this.getDefaultAIRole(character.gender),
      aiRoleConfig: AI_ROLES[this.getDefaultAIRole(character.gender)],
      
      // 角色形象信息
      avatar: {
        default: character.defaultImage,
        aiFloating: characterManager.getAIFloatingAvatarPath(character),
        growth: characterManager.getGrowthAvatarPath(character),
        settings: characterManager.getSettingAvatarPath(character),
        expressions: character.expressions.map(expr => ({
          id: expr.id,
          name: expr.name,
          imagePath: expr.imagePath,
          triggers: expr.triggers
        }))
      },
      
      // 角色主题信息
      themes: character.themes.map(theme => ({
        id: theme.id,
        name: theme.name,
        displayName: theme.displayName,
        primaryColor: theme.primaryColor,
        secondaryColor: theme.secondaryColor,
        imagePath: theme.imagePath,
        gradient: theme.gradient
      })),
      
      // 角色档案信息
      profile: {
        age: character.age,
        birthday: character.birthday,
        zodiac: character.zodiac,
        personality: character.personality,
        voiceSettings: character.voiceSettings
      }
    }
  }

  // 获取默认AI角色
  private getDefaultAIRole(gender: 'male' | 'female'): AIRole {
    // 根据性别特点分配默认AI角色
    if (gender === 'male') {
      return 'guardian' // 男孩默认为守护者
    } else {
      return 'companion' // 女孩默认为陪伴者
    }
  }

  // 获取角色信息
  getRoleInfo(gender: 'male' | 'female'): UnifiedRoleInfo {
    const roleInfo = this.roleInfoCache.get(gender)
    if (!roleInfo) {
      throw new Error(`Role information not found for gender: ${gender}`)
    }

    // 定期验证角色信息一致性
    const now = Date.now()
    if (now - this.lastValidationTime > this.validationInterval) {
      this.validateRoleInfoConsistency()
      this.lastValidationTime = now
    }

    return roleInfo
  }

  // 更新角色信息
  updateRoleInfo(gender: 'male' | 'female', updates: Partial<UnifiedRoleInfo>): void {
    const currentRoleInfo = this.getRoleInfo(gender)
    const updatedRoleInfo = { ...currentRoleInfo, ...updates }
    
    // 验证更新后的角色信息
    const character = characterManager.getCharacterByGender(gender)
    const validation = characterValidator.validateCharacterConfig(character)
    
    if (!validation.isValid) {
      console.error('Role info validation failed:', validation.errors)
      throw new Error('Invalid role info update')
    }

    // 更新缓存
    this.roleInfoCache.set(gender, updatedRoleInfo)
    
    // 同步更新角色配置
    this.syncRoleInfoToCharacter(gender, updatedRoleInfo)
  }

  // 同步角色信息到角色配置
  private syncRoleInfoToCharacter(gender: 'male' | 'female', roleInfo: UnifiedRoleInfo): void {
    const character = characterManager.getCharacterByGender(gender)
    
    // 更新基础信息
    character.name = roleInfo.name
    character.age = roleInfo.profile.age
    character.birthday = roleInfo.profile.birthday
    character.zodiac = roleInfo.profile.zodiac
    character.personality = roleInfo.profile.personality
    character.voiceSettings = roleInfo.profile.voiceSettings
    
    // 更新头像和表情
    character.defaultImage = roleInfo.avatar.default
    character.expressions = roleInfo.avatar.expressions.map(expr => ({
      id: expr.id,
      name: expr.name,
      displayName: expr.name,
      imagePath: expr.imagePath,
      triggers: expr.triggers,
      animations: ['bounce', 'pulse'] // 默认动画
    }))
    
    // 更新主题
    character.themes = roleInfo.themes.map(theme => ({
      id: theme.id,
      name: theme.name,
      displayName: theme.displayName,
      primaryColor: theme.primaryColor,
      secondaryColor: theme.secondaryColor,
      backgroundColor: theme.primaryColor + '20', // 生成背景色
      imagePath: theme.imagePath,
      gradient: theme.gradient
    }))
  }

  // 验证角色信息一致性
  validateRoleInfoConsistency(): void {
    for (const [gender, roleInfo] of this.roleInfoCache.entries()) {
      const character = characterManager.getCharacterByGender(gender as 'male' | 'female')
      
      // 验证基础信息一致性
      if (character.name !== roleInfo.name) {
        console.warn(`Name inconsistency detected for ${gender}: character=${character.name}, roleInfo=${roleInfo.name}`)
        this.fixInconsistency(gender as 'male' | 'female', 'name', character.name)
      }
      
      if (character.gender !== roleInfo.gender) {
        console.warn(`Gender inconsistency detected for ${gender}: character=${character.gender}, roleInfo=${roleInfo.gender}`)
        this.fixInconsistency(gender as 'male' | 'female', 'gender', character.gender)
      }
      
      // 验证头像路径一致性
      if (character.defaultImage !== roleInfo.avatar.default) {
        console.warn(`Avatar inconsistency detected for ${gender}: character=${character.defaultImage}, roleInfo=${roleInfo.avatar.default}`)
        this.fixInconsistency(gender as 'male' | 'female', 'avatar.default', character.defaultImage)
      }
      
      // 验证AI浮窗头像路径一致性
      const aiFloatingPath = characterManager.getAIFloatingAvatarPath(character)
      if (aiFloatingPath !== roleInfo.avatar.aiFloating) {
        console.warn(`AI floating avatar inconsistency detected for ${gender}: expected=${aiFloatingPath}, actual=${roleInfo.avatar.aiFloating}`)
        this.fixInconsistency(gender as 'male' | 'female', 'avatar.aiFloating', aiFloatingPath)
      }
      
      // 验证成长页面头像路径一致性
      const growthPath = characterManager.getGrowthAvatarPath(character)
      if (growthPath !== roleInfo.avatar.growth) {
        console.warn(`Growth avatar inconsistency detected for ${gender}: expected=${growthPath}, actual=${roleInfo.avatar.growth}`)
        this.fixInconsistency(gender as 'male' | 'female', 'avatar.growth', growthPath)
      }
      
      // 验证设置页面头像路径一致性
      const settingPath = characterManager.getSettingAvatarPath(character)
      if (settingPath !== roleInfo.avatar.settings) {
        console.warn(`Setting avatar inconsistency detected for ${gender}: expected=${settingPath}, actual=${roleInfo.avatar.settings}`)
        this.fixInconsistency(gender as 'male' | 'female', 'avatar.settings', settingPath)
      }
      
      // 验证主题信息一致性
      const characterThemeIds = character.themes.map(t => t.id).sort()
      const roleInfoThemeIds = roleInfo.themes.map(t => t.id).sort()
      if (JSON.stringify(characterThemeIds) !== JSON.stringify(roleInfoThemeIds)) {
        console.warn(`Theme inconsistency detected for ${gender}`)
        this.fixInconsistency(gender as 'male' | 'female', 'themes', character.themes)
      }
      
      // 验证表情信息一致性
      const characterExpressionIds = character.expressions.map(e => e.id).sort()
      const roleInfoExpressionIds = roleInfo.avatar.expressions.map(e => e.id).sort()
      if (JSON.stringify(characterExpressionIds) !== JSON.stringify(roleInfoExpressionIds)) {
        console.warn(`Expression inconsistency detected for ${gender}`)
        this.fixInconsistency(gender as 'male' | 'female', 'expressions', character.expressions)
      }
      
      // 验证档案信息一致性
      if (character.age !== roleInfo.profile.age) {
        console.warn(`Age inconsistency detected for ${gender}: character=${character.age}, roleInfo=${roleInfo.profile.age}`)
        this.fixInconsistency(gender as 'male' | 'female', 'profile.age', character.age)
      }
      
      if (JSON.stringify(character.birthday) !== JSON.stringify(roleInfo.profile.birthday)) {
        console.warn(`Birthday inconsistency detected for ${gender}`)
        this.fixInconsistency(gender as 'male' | 'female', 'profile.birthday', character.birthday)
      }
      
      if (character.zodiac !== roleInfo.profile.zodiac) {
        console.warn(`Zodiac inconsistency detected for ${gender}: character=${character.zodiac}, roleInfo=${roleInfo.profile.zodiac}`)
        this.fixInconsistency(gender as 'male' | 'female', 'profile.zodiac', character.zodiac)
      }
      
      // 验证语音设置一致性
      if (JSON.stringify(character.voiceSettings) !== JSON.stringify(roleInfo.profile.voiceSettings)) {
        console.warn(`Voice settings inconsistency detected for ${gender}`)
        this.fixInconsistency(gender as 'male' | 'female', 'profile.voiceSettings', character.voiceSettings)
      }
    }
  }

  // 修复不一致性
  private fixInconsistency(gender: 'male' | 'female', field: string, correctValue: any): void {
    const roleInfo = this.roleInfoCache.get(gender)
    if (!roleInfo) return

    switch (field) {
      case 'name':
        roleInfo.name = correctValue
        break
      case 'gender':
        roleInfo.gender = correctValue
        break
      case 'avatar.default':
        roleInfo.avatar.default = correctValue
        break
      case 'avatar.aiFloating':
        roleInfo.avatar.aiFloating = correctValue
        break
      case 'avatar.growth':
        roleInfo.avatar.growth = correctValue
        break
      case 'avatar.settings':
        roleInfo.avatar.settings = correctValue
        break
      case 'themes':
        roleInfo.themes = correctValue.map((theme: any) => ({
          id: theme.id,
          name: theme.name,
          displayName: theme.displayName,
          primaryColor: theme.primaryColor,
          secondaryColor: theme.secondaryColor,
          imagePath: theme.imagePath,
          gradient: theme.gradient
        }))
        break
      case 'expressions':
        roleInfo.avatar.expressions = correctValue.map((expr: any) => ({
          id: expr.id,
          name: expr.name,
          imagePath: expr.imagePath,
          triggers: expr.triggers
        }))
        break
      case 'profile.age':
        roleInfo.profile.age = correctValue
        break
      case 'profile.birthday':
        roleInfo.profile.birthday = correctValue
        break
      case 'profile.zodiac':
        roleInfo.profile.zodiac = correctValue
        break
      case 'profile.voiceSettings':
        roleInfo.profile.voiceSettings = correctValue
        break
    }

    // 更新缓存
    this.roleInfoCache.set(gender, roleInfo)
    
    // 记录修复操作
    console.log(`Fixed inconsistency for ${gender}.${field}: ${JSON.stringify(correctValue)}`)
  }

  // 获取角色头像路径
  getRoleAvatarPath(gender: 'male' | 'female', type: 'default' | 'aiFloating' | 'growth' | 'settings'): string {
    const roleInfo = this.getRoleInfo(gender)
    return roleInfo.avatar[type]
  }

  // 获取角色表情路径
  getRoleExpressionPath(gender: 'male' | 'female', expressionId: string): string | null {
    const roleInfo = this.getRoleInfo(gender)
    const expression = roleInfo.avatar.expressions.find(expr => expr.id === expressionId)
    return expression ? expression.imagePath : null
  }

  // 获取角色主题信息
  getRoleTheme(gender: 'male' | 'female', themeId: string): any | null {
    const roleInfo = this.getRoleInfo(gender)
    return roleInfo.themes.find(theme => theme.id === themeId) || null
  }

  // 获取角色AI配置
  getRoleAIConfig(gender: 'male' | 'female', aiRole?: AIRole): RoleConfig {
    const roleInfo = this.getRoleInfo(gender)
    const targetRole = aiRole || roleInfo.aiRole || 'companion'
    return AI_ROLES[targetRole]
  }

  // 刷新角色信息缓存
  refreshRoleInfoCache(): void {
    this.roleInfoCache.clear()
    this.initializeRoleInfo()
  }

  // 导出角色信息配置
  exportRoleInfoConfig(): Record<string, UnifiedRoleInfo> {
    const config: Record<string, UnifiedRoleInfo> = {}
    for (const [gender, roleInfo] of this.roleInfoCache.entries()) {
      config[gender] = JSON.parse(JSON.stringify(roleInfo)) // 深拷贝
    }
    return config
  }

  // 导入角色信息配置
  importRoleInfoConfig(config: Record<string, UnifiedRoleInfo>): void {
    for (const [gender, roleInfo] of Object.entries(config)) {
      if (gender === 'male' || gender === 'female') {
        // 验证配置
        const character = characterManager.getCharacterByGender(gender)
        const validation = characterValidator.validateCharacterConfig(character)
        
        if (validation.isValid) {
          this.roleInfoCache.set(gender, roleInfo)
          this.syncRoleInfoToCharacter(gender, roleInfo)
        } else {
          console.error(`Invalid role info config for ${gender}:`, validation.errors)
          throw new Error(`Invalid role info config for ${gender}`)
        }
      }
    }
  }

  // 全局角色信息同步 - 确保所有组件获得最新角色信息
  globalSyncRoleInfo(gender?: 'male' | 'female'): void {
    if (gender) {
      // 同步指定性别的角色信息
      const character = characterManager.getCharacterByGender(gender)
      const updatedRoleInfo = this.createUnifiedRoleInfo(character)
      this.roleInfoCache.set(gender, updatedRoleInfo)
      
      console.log(`Global sync completed for ${gender} role info`)
    } else {
      // 同步所有角色信息
      this.roleInfoCache.clear()
      this.initializeRoleInfo()
      
      console.log('Global sync completed for all role info')
    }
    
    // 触发全局角色信息更新事件
    this.notifyRoleInfoUpdate(gender)
  }

  // 通知角色信息更新
  private notifyRoleInfoUpdate(gender?: 'male' | 'female'): void {
    // 创建自定义事件
    const event = new CustomEvent('roleInfoUpdate', {
      detail: {
        gender,
        timestamp: Date.now(),
        roleInfo: gender ? this.roleInfoCache.get(gender) : null
      }
    })
    
    // 在浏览器环境中触发事件
    if (typeof window !== 'undefined') {
      window.dispatchEvent(event)
    }
    
    // 在Node.js环境中触发事件（如果需要）
    if (typeof process !== 'undefined' && process.emit) {
      process.emit('roleInfoUpdate', {
        gender,
        timestamp: Date.now(),
        roleInfo: gender ? this.roleInfoCache.get(gender) : null
      })
    }
  }

  // 获取角色信息完整度报告
  getRoleInfoCompletenessReport(gender: 'male' | 'female'): {
    completeness: number
    missingItems: string[]
    warnings: string[]
  } {
    const roleInfo = this.getRoleInfo(gender)
    const missingItems: string[] = []
    const warnings: string[] = []
    
    // 检查头像路径
    if (!roleInfo.avatar.default) missingItems.push('默认头像')
    if (!roleInfo.avatar.aiFloating) missingItems.push('AI浮窗头像')
    if (!roleInfo.avatar.growth) missingItems.push('成长页面头像')
    if (!roleInfo.avatar.settings) missingItems.push('设置页面头像')
    
    // 检查表情
    if (roleInfo.avatar.expressions.length === 0) {
      missingItems.push('表情配置')
    } else if (roleInfo.avatar.expressions.length < 3) {
      warnings.push('表情配置较少，建议增加更多表情')
    }
    
    // 检查主题
    if (roleInfo.themes.length === 0) {
      missingItems.push('主题配置')
    } else if (roleInfo.themes.length < 2) {
      warnings.push('主题配置较少，建议增加更多主题')
    }
    
    // 检查档案信息
    if (!roleInfo.profile.age) missingItems.push('年龄信息')
    if (!roleInfo.profile.birthday) missingItems.push('生日信息')
    if (!roleInfo.profile.zodiac) missingItems.push('星座信息')
    
    // 检查语音设置
    if (!roleInfo.profile.voiceSettings) missingItems.push('语音设置')
    
    // 计算完整度
    const totalItems = 12 // 总共12个检查项
    const completedItems = totalItems - missingItems.length
    const completeness = Math.round((completedItems / totalItems) * 100)
    
    return {
      completeness,
      missingItems,
      warnings
    }
  }
}

// 导出单例实例
export const roleInfoManager = RoleInfoManager.getInstance()

// 便捷函数
export function getRoleInfo(gender: 'male' | 'female'): UnifiedRoleInfo {
  return roleInfoManager.getRoleInfo(gender)
}

export function getRoleAvatarPath(gender: 'male' | 'female', type: 'default' | 'aiFloating' | 'growth' | 'settings' = 'default'): string {
  return roleInfoManager.getRoleAvatarPath(gender, type)
}

export function getRoleAIConfig(gender: 'male' | 'female', aiRole?: AIRole): RoleConfig {
  return roleInfoManager.getRoleAIConfig(gender, aiRole)
}

export function syncGlobalRoleInfo(gender?: 'male' | 'female'): void {
  return roleInfoManager.globalSyncRoleInfo(gender)
}

export function getRoleInfoCompletenessReport(gender: 'male' | 'female'): {
  completeness: number
  missingItems: string[]
  warnings: string[]
} {
  return roleInfoManager.getRoleInfoCompletenessReport(gender)
}

// 监听角色信息更新事件的便捷函数
export function onRoleInfoUpdate(callback: (detail: {
  gender?: 'male' | 'female'
  timestamp: number
  roleInfo: UnifiedRoleInfo | null
}) => void): () => void {
  const handler = (event: any) => callback(event.detail)
  
  // 在浏览器环境中添加监听器
  if (typeof window !== 'undefined') {
    window.addEventListener('roleInfoUpdate', handler)
  }
  
  // 在Node.js环境中添加监听器
  if (typeof process !== 'undefined' && process.on) {
    process.on('roleInfoUpdate', handler)
  }
  
  // 返回清理函数
  return () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('roleInfoUpdate', handler)
    }
    if (typeof process !== 'undefined' && process.off) {
      process.off('roleInfoUpdate', handler)
    }
  }
}