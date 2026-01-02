/**
 * @file 角色信息验证器
 * @description 确保角色信息的准确性和一致性
 * @author YYC³ Development Team
 * @version 1.0.0
 * @created 2025-01-30
 */

import { characterManager, type CharacterConfig, type Child } from "./character-manager"

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
  suggestions: ValidationSuggestion[]
}

export interface ValidationError {
  field: string
  message: string
  severity: "critical" | "high" | "medium" | "low"
  fix?: () => void
}

export interface ValidationWarning {
  field: string
  message: string
  recommendation: string
}

export interface ValidationSuggestion {
  field: string
  message: string
  improvement: string
}

export class CharacterInfoValidator {
  private static instance: CharacterInfoValidator

  private constructor() {}

  static getInstance(): CharacterInfoValidator {
    if (!CharacterInfoValidator.instance) {
      CharacterInfoValidator.instance = new CharacterInfoValidator()
    }
    return CharacterInfoValidator.instance
  }

  // 验证角色配置的完整性和准确性
  validateCharacterConfig(character: CharacterConfig): ValidationResult {
    const errors: ValidationError[] = []
    const warnings: ValidationWarning[] = []
    const suggestions: ValidationSuggestion[] = []

    // 验证基本信息
    this.validateBasicInfo(character, errors, warnings, suggestions)
    
    // 验证主题配置
    this.validateThemes(character, errors, warnings, suggestions)
    
    // 验证表情配置
    this.validateExpressions(character, errors, warnings, suggestions)
    
    // 验证个性配置
    this.validatePersonality(character, errors, warnings, suggestions)
    
    // 验证语音设置
    this.validateVoiceSettings(character, errors, warnings, suggestions)
    
    // 验证图片路径
    this.validateImagePaths(character, errors, warnings, suggestions)

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions
    }
  }

  // 验证用户信息与角色配置的一致性
  validateChildCharacterConsistency(child: Child, character: CharacterConfig): ValidationResult {
    const errors: ValidationError[] = []
    const warnings: ValidationWarning[] = []
    const suggestions: ValidationSuggestion[] = []

    // 验证性别一致性
    if (child.gender && child.gender !== character.gender) {
      errors.push({
        field: "gender",
        message: `用户性别(${child.gender})与角色性别(${character.gender})不一致`,
        severity: "high",
        fix: () => {
          const correctedCharacter = characterManager.getCharacterByGender(child.gender as "male" | "female")
          Object.assign(character, correctedCharacter)
        }
      })
    }

    // 验证姓名一致性
    if (child.name && child.name !== character.name && child.name !== character.defaultName) {
      warnings.push({
        field: "name",
        message: `用户姓名(${child.name})与角色名称(${character.name})不一致`,
        recommendation: "建议更新角色名称以匹配用户姓名"
      })
    }

    // 验证生日一致性
    if (child.birthday) {
      const childAge = this.calculateAge(child.birthday)
      if (Math.abs(childAge - character.age) > 1) {
        errors.push({
          field: "age",
          message: `根据用户生日计算的年龄(${childAge})与角色年龄(${character.age})不一致`,
          severity: "medium",
          fix: () => {
            character.age = childAge
          }
        })
      }

      // 验证星座一致性
      const childZodiac = this.calculateZodiac(child.birthday)
      if (childZodiac !== character.zodiac) {
        errors.push({
          field: "zodiac",
          message: `根据用户生日计算的星座(${childZodiac})与角色星座(${character.zodiac})不一致`,
          severity: "medium",
          fix: () => {
            character.zodiac = childZodiac
          }
        })
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions
    }
  }

  // 自动修复角色配置问题
  autoFixCharacterConfig(character: CharacterConfig): CharacterConfig {
    const fixedCharacter = { ...character }

    // 确保所有必需字段存在
    if (!fixedCharacter.id) {
      fixedCharacter.id = `character_${Date.now()}`
    }

    if (!fixedCharacter.name) {
      fixedCharacter.name = fixedCharacter.defaultName
    }

    if (!fixedCharacter.age || fixedCharacter.age < 0) {
      fixedCharacter.age = 1
    }

    if (!fixedCharacter.zodiac) {
      fixedCharacter.zodiac = "♐ 射手座"
    }

    // 确保主题配置完整
    if (!fixedCharacter.themes || fixedCharacter.themes.length === 0) {
      fixedCharacter.themes = this.getDefaultThemes(fixedCharacter.gender)
    }

    // 确保表情配置完整
    if (!fixedCharacter.expressions || fixedCharacter.expressions.length === 0) {
      fixedCharacter.expressions = this.getDefaultExpressions(fixedCharacter.gender)
    }

    // 确保个性配置完整
    if (!fixedCharacter.personality) {
      fixedCharacter.personality = this.getDefaultPersonality(fixedCharacter.gender)
    }

    // 确保语音设置完整
    if (!fixedCharacter.voiceSettings) {
      fixedCharacter.voiceSettings = this.getDefaultVoiceSettings(fixedCharacter.gender)
    }

    // 确保生日信息完整
    if (!fixedCharacter.birthday) {
      fixedCharacter.birthday = {
        lunar: "正月初一",
        solar: "2024-01-01"
      }
    }

    return fixedCharacter
  }

  // 验证基本信息
  private validateBasicInfo(
    character: CharacterConfig,
    errors: ValidationError[],
    warnings: ValidationWarning[],
    suggestions: ValidationSuggestion[]
  ): void {
    if (!character.id || character.id.trim() === "") {
      errors.push({
        field: "id",
        message: "角色ID不能为空",
        severity: "critical"
      })
    }

    if (!character.name || character.name.trim() === "") {
      errors.push({
        field: "name",
        message: "角色名称不能为空",
        severity: "critical"
      })
    }

    if (!character.gender || !["male", "female"].includes(character.gender)) {
      errors.push({
        field: "gender",
        message: "角色性别必须是'male'或'female'",
        severity: "critical"
      })
    }

    if (!character.defaultName || character.defaultName.trim() === "") {
      errors.push({
        field: "defaultName",
        message: "默认名称不能为空",
        severity: "high"
      })
    }

    if (character.age < 0 || character.age > 150) {
      errors.push({
        field: "age",
        message: "角色年龄必须在0-150之间",
        severity: "high"
      })
    }

    if (!character.defaultImage || character.defaultImage.trim() === "") {
      errors.push({
        field: "defaultImage",
        message: "默认图片路径不能为空",
        severity: "high"
      })
    }
  }

  // 验证主题配置
  private validateThemes(
    character: CharacterConfig,
    errors: ValidationError[],
    warnings: ValidationWarning[],
    suggestions: ValidationSuggestion[]
  ): void {
    if (!character.themes || character.themes.length === 0) {
      errors.push({
        field: "themes",
        message: "角色必须至少有一个主题",
        severity: "high"
      })
      return
    }

    character.themes.forEach((theme, index) => {
      if (!theme.id || theme.id.trim() === "") {
        errors.push({
          field: `themes[${index}].id`,
          message: `主题${index + 1}的ID不能为空`,
          severity: "high"
        })
      }

      if (!theme.name || theme.name.trim() === "") {
        errors.push({
          field: `themes[${index}].name`,
          message: `主题${index + 1}的名称不能为空`,
          severity: "high"
        })
      }

      if (!theme.primaryColor || theme.primaryColor.trim() === "") {
        errors.push({
          field: `themes[${index}].primaryColor`,
          message: `主题${index + 1}的主色调不能为空`,
          severity: "medium"
        })
      }

      if (!theme.imagePath || theme.imagePath.trim() === "") {
        errors.push({
          field: `themes[${index}].imagePath`,
          message: `主题${index + 1}的图片路径不能为空`,
          severity: "medium"
        })
      }
    })

    // 检查是否有重复的主题ID
    const themeIds = character.themes.map(t => t.id).filter(Boolean)
    const duplicateThemeIds = themeIds.filter((id, index) => themeIds.indexOf(id) !== index)
    if (duplicateThemeIds.length > 0) {
      errors.push({
        field: "themes",
        message: `存在重复的主题ID: ${duplicateThemeIds.join(", ")}`,
        severity: "medium"
      })
    }
  }

  // 验证表情配置
  private validateExpressions(
    character: CharacterConfig,
    errors: ValidationError[],
    warnings: ValidationWarning[],
    suggestions: ValidationSuggestion[]
  ): void {
    if (!character.expressions || character.expressions.length === 0) {
      errors.push({
        field: "expressions",
        message: "角色必须至少有一个表情",
        severity: "high"
      })
      return
    }

    character.expressions.forEach((expression, index) => {
      if (!expression.id || expression.id.trim() === "") {
        errors.push({
          field: `expressions[${index}].id`,
          message: `表情${index + 1}的ID不能为空`,
          severity: "high"
        })
      }

      if (!expression.name || expression.name.trim() === "") {
        errors.push({
          field: `expressions[${index}].name`,
          message: `表情${index + 1}的名称不能为空`,
          severity: "high"
        })
      }

      if (!expression.imagePath || expression.imagePath.trim() === "") {
        errors.push({
          field: `expressions[${index}].imagePath`,
          message: `表情${index + 1}的图片路径不能为空`,
          severity: "medium"
        })
      }

      if (!expression.triggers || expression.triggers.length === 0) {
        warnings.push({
          field: `expressions[${index}].triggers`,
          message: `表情${expression.displayName || index + 1}没有触发条件`,
          recommendation: "建议为表情添加触发条件以便自动切换"
        })
      }
    })

    // 检查是否有重复的表情ID
    const expressionIds = character.expressions.map(e => e.id).filter(Boolean)
    const duplicateExpressionIds = expressionIds.filter((id, index) => expressionIds.indexOf(id) !== index)
    if (duplicateExpressionIds.length > 0) {
      errors.push({
        field: "expressions",
        message: `存在重复的表情ID: ${duplicateExpressionIds.join(", ")}`,
        severity: "medium"
      })
    }
  }

  // 验证个性配置
  private validatePersonality(
    character: CharacterConfig,
    errors: ValidationError[],
    warnings: ValidationWarning[],
    suggestions: ValidationSuggestion[]
  ): void {
    if (!character.personality) {
      errors.push({
        field: "personality",
        message: "角色个性配置不能为空",
        severity: "high"
      })
      return
    }

    if (!character.personality.traits || character.personality.traits.length === 0) {
      warnings.push({
        field: "personality.traits",
        message: "角色没有个性特征",
        recommendation: "建议为角色添加至少3个个性特征"
      })
    }

    if (!character.personality.speechStyle || character.personality.speechStyle.trim() === "") {
      warnings.push({
        field: "personality.speechStyle",
        message: "角色没有说话风格",
        recommendation: "建议为角色设置说话风格"
      })
    }

    if (!character.personality.catchphrases || character.personality.catchphrases.length === 0) {
      suggestions.push({
        field: "personality.catchphrases",
        message: "角色没有经典用语",
        improvement: "添加经典用语可以让角色更有个性"
      })
    }
  }

  // 验证语音设置
  private validateVoiceSettings(
    character: CharacterConfig,
    errors: ValidationError[],
    warnings: ValidationWarning[],
    suggestions: ValidationSuggestion[]
  ): void {
    if (!character.voiceSettings) {
      warnings.push({
        field: "voiceSettings",
        message: "角色没有语音设置",
        recommendation: "建议为角色设置语音参数"
      })
      return
    }

    if (character.voiceSettings.speechRate < 0.5 || character.voiceSettings.speechRate > 2.0) {
      errors.push({
        field: "voiceSettings.speechRate",
        message: "语音速率必须在0.5-2.0之间",
        severity: "medium"
      })
    }

    if (character.voiceSettings.pitch < 0.5 || character.voiceSettings.pitch > 2.0) {
      errors.push({
        field: "voiceSettings.pitch",
        message: "音调必须在0.5-2.0之间",
        severity: "medium"
      })
    }

    if (character.voiceSettings.volume < 0 || character.voiceSettings.volume > 1) {
      errors.push({
        field: "voiceSettings.volume",
        message: "音量必须在0-1之间",
        severity: "medium"
      })
    }
  }

  // 验证图片路径
  private validateImagePaths(
    character: CharacterConfig,
    errors: ValidationError[],
    warnings: ValidationWarning[],
    suggestions: ValidationSuggestion[]
  ): void {
    const imagePaths = [
      character.defaultImage,
      ...character.themes.map(t => t.imagePath),
      ...character.expressions.map(e => e.imagePath)
    ]

    imagePaths.forEach((path, index) => {
      if (path && !path.startsWith("/")) {
        warnings.push({
          field: `imagePaths[${index}]`,
          message: `图片路径"${path}"不是绝对路径`,
          recommendation: "建议使用绝对路径，以'/'开头"
        })
      }
    })
  }

  // 计算年龄
  private calculateAge(birthday: Date): number {
    const today = new Date()
    let age = today.getFullYear() - birthday.getFullYear()
    const monthDiff = today.getMonth() - birthday.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthday.getDate())) {
      age--
    }
    
    return age
  }

  // 计算星座
  private calculateZodiac(birthday: Date): string {
    const month = birthday.getMonth() + 1
    const day = birthday.getDate()
    
    const zodiacs = [
      { name: '♑ 摩羯座', startMonth: 12, startDay: 22, endMonth: 1, endDay: 19 },
      { name: '♒ 水瓶座', startMonth: 1, startDay: 20, endMonth: 2, endDay: 18 },
      { name: '♓ 双鱼座', startMonth: 2, startDay: 19, endMonth: 3, endDay: 20 },
      { name: '♈ 白羊座', startMonth: 3, startDay: 21, endMonth: 4, endDay: 19 },
      { name: '♉ 金牛座', startMonth: 4, startDay: 20, endMonth: 5, endDay: 20 },
      { name: '♊ 双子座', startMonth: 5, startDay: 21, endMonth: 6, endDay: 21 },
      { name: '♋ 巨蟹座', startMonth: 6, startDay: 22, endMonth: 7, endDay: 22 },
      { name: '♌ 狮子座', startMonth: 7, startDay: 23, endMonth: 8, endDay: 22 },
      { name: '♍ 处女座', startMonth: 8, startDay: 23, endMonth: 9, endDay: 22 },
      { name: '♎ 天秤座', startMonth: 9, startDay: 23, endMonth: 10, endDay: 23 },
      { name: '♏ 天蝎座', startMonth: 10, startDay: 24, endMonth: 11, endDay: 22 },
      { name: '♐ 射手座', startMonth: 11, startDay: 23, endMonth: 12, endDay: 21 }
    ]
    
    for (const zodiac of zodiacs) {
      if ((month === zodiac.startMonth && day >= zodiac.startDay) || 
          (month === zodiac.endMonth && day <= zodiac.endDay)) {
        return zodiac.name
      }
    }
    
    return '♐ 射手座'
  }

  // 获取默认主题
  private getDefaultThemes(gender: "male" | "female") {
    if (gender === "male") {
      return [
        {
          id: "blue",
          name: "blue",
          displayName: "蓝色主题",
          primaryColor: "#3b82f6",
          secondaryColor: "#93c5fd",
          backgroundColor: "#eff6ff",
          imagePath: "/role-photos/boy/xiaoyan-casual-001.png",
          gradient: "linear-gradient(135deg, #3b82f6, #93c5fd)"
        }
      ]
    } else {
      return [
        {
          id: "pink",
          name: "pink",
          displayName: "粉色主题",
          primaryColor: "#ec4899",
          secondaryColor: "#f9a8d4",
          backgroundColor: "#fdf2f8",
          imagePath: "/role-photos/girl/xiaoyu-lolita-pink-001.png",
          gradient: "linear-gradient(135deg, #ec4899, #f9a8d4)"
        }
      ]
    }
  }

  // 获取默认表情
  private getDefaultExpressions(gender: "male" | "female") {
    if (gender === "male") {
      return [
        {
          id: "happy",
          name: "happy",
          displayName: "开心",
          imagePath: "/role-photos/boy/xiaoyan-casual-002.png",
          triggers: ["success", "praise", "achievement"],
          animations: ["bounce", "jump"]
        }
      ]
    } else {
      return [
        {
          id: "happy",
          name: "happy",
          displayName: "开心",
          imagePath: "/role-photos/girl/xiaoyu-lolita-blue-010.png",
          triggers: ["success", "praise", "achievement"],
          animations: ["bounce", "pulse"]
        }
      ]
    }
  }

  // 获取默认个性
  private getDefaultPersonality(gender: "male" | "female") {
    if (gender === "male") {
      return {
        traits: ["confident", "protective", "adventurous"],
        speechStyle: "energetic_friendly",
        interactionTone: "encouraging",
        catchphrases: ["小言保护你，一起学习！"]
      }
    } else {
      return {
        traits: ["gentle", "caring", "encouraging"],
        speechStyle: "warm_friendly",
        interactionTone: "supportive",
        catchphrases: ["小语最喜欢和你一起学习！"]
      }
    }
  }

  // 获取默认语音设置
  private getDefaultVoiceSettings(gender: "male" | "female") {
    if (gender === "male") {
      return {
        preferredGender: "male" as const,
        speechRate: 1.0,
        pitch: 0.9,
        volume: 0.85
      }
    } else {
      return {
        preferredGender: "female" as const,
        speechRate: 1.2,
        pitch: 1.1,
        volume: 0.8
      }
    }
  }
}

// 导出单例实例
export const characterValidator = CharacterInfoValidator.getInstance()