/**
 * @file 角色管理系统
 * @description 统一管理Q版角色的性别、主题、表情和配置
 * @author YYC³ Development Team
 * @version 1.0.0
 * @created 2024-12-14
 */

// 自定义 Child 接口，替代 @prisma/client 依赖
export interface Child {
  id: string
  name?: string
  gender?: 'male' | 'female' | string
  birthday?: Date
  // 移除了 any 类型的索引签名，使用更具体的可选属性
  avatarUrl?: string
  preferences?: Record<string, string | number | boolean | Record<string, unknown>>
}

// 角色配置接口
export interface CharacterConfig {
  id: string
  name: string            // 小语 / 小言
  gender: 'male' | 'female'
  defaultName: string
  defaultImage: string
  age: number             // 年龄
  birthday: {
    lunar: string         // 农历生日
    solar: string         // 阳历生日
  }
  zodiac: string          // 星座
  themes: CharacterTheme[]
  expressions: CharacterExpression[]
  personality: CharacterPersonality
  voiceSettings: VoiceSettings
}

// 角色主题配置
export interface CharacterTheme {
  id: string
  name: string            // 'pink' | 'blue' | 'green' | 'orange'
  displayName: string     // '粉色主题' | '蓝色主题'
  primaryColor: string    // CSS颜色值
  secondaryColor: string
  backgroundColor?: string
  imagePath: string
  gradient: string       // CSS渐变
}

// 角色表情配置
export interface CharacterExpression {
  id: string
  name: string            // 'happy' | 'excited' | 'thinking' | 'cool'
  displayName: string
  imagePath: string
  triggers: string[]      // 触发条件
  animations?: string[]   // 可选的动画效果
}

// 角色个性配置
export interface CharacterPersonality {
  traits: string[]        // ['gentle', 'caring', 'encouraging', 'curious']
  speechStyle: string      // 说话风格
  interactionTone: string  // 交互语气
  catchphrases: string[]   // 经典用语
}

// 语音设置配置
export interface VoiceSettings {
  preferredGender: 'male' | 'female' | 'neutral'
  speechRate: number      // 0.5 - 2.0
  pitch: number          // 0.5 - 2.0
  volume: number         // 0 - 1
}

// 主题颜色映射
export interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background?: string
  text?: string
  border?: string
  glow: string
  gradient?: string
}

// 角色管理器类
export class CharacterManager {
  private static instance: CharacterManager
  private characterCache: Map<string, CharacterConfig> = new Map()
  private currentChild: Child | null = null

  private constructor() {
    this.initializeCharacters()
  }

  static getInstance(): CharacterManager {
    if (!CharacterManager.instance) {
      CharacterManager.instance = new CharacterManager()
    }
    return CharacterManager.instance
  }

  // 初始化角色配置
  private initializeCharacters(): void {
    const femaleCharacter: CharacterConfig = {
      id: 'xiaoyu',
      name: '小语',
      gender: 'female',
      defaultName: '沫语',
      defaultImage: '/role-photos/girl/xiaoyu-lolita-blue-008.png',
      age: 1,
      birthday: {
        lunar: '十一月初十',
        solar: '24.12.10'
      },
      zodiac: '♐ 射手座',
      themes: [
        {
          id: 'pink',
          name: 'pink',
          displayName: '粉色主题',
          primaryColor: '#ec4899',
          secondaryColor: '#f9a8d4',
          backgroundColor: '#fdf2f8',
          imagePath: '/role-photos/girl/xiaoyu-lolita-pink-001.png',
          gradient: 'linear-gradient(135deg, #ec4899, #f9a8d4)'
        },
        {
          id: 'blue',
          name: 'blue',
          displayName: '蓝色主题',
          primaryColor: '#3b82f6',
          secondaryColor: '#93c5fd',
          backgroundColor: '#eff6ff',
          imagePath: '/role-photos/girl/xiaoyu-lolita-blue-008.png',
          gradient: 'linear-gradient(135deg, #3b82f6, #93c5fd)'
        },
        {          id: 'purple',          name: 'purple',          displayName: '紫色主题',          primaryColor: '#a855f7',          secondaryColor: '#c4b5fd',          backgroundColor: '#faf5ff',          imagePath: '/role-photos/girl/xiaoyu-lolita-blue-009.png',          gradient: 'linear-gradient(135deg, #a855f7, #c4b5fd)'        }
      ],
      expressions: [
        {
          id: 'happy',
          name: 'happy',
          displayName: '开心',
          imagePath: '/role-photos/girl/xiaoyu-lolita-blue-010.png',
          triggers: ['success', 'praise', 'achievement', 'welcome'],
          animations: ['bounce', 'pulse']
        },
        {
          id: 'thinking',
          name: 'thinking',
          displayName: '思考',
          imagePath: '/role-photos/girl/xiaoyu-lolita-blue-011.png',
          triggers: ['question', 'problem', 'learning'],
          animations: ['pulse', 'float']
        },
        {
          id: 'sad',
          name: 'sad',
          displayName: '伤心',
          imagePath: '/role-photos/girl/xiaoyu-lolita-blue-013.png',
          triggers: ['error', 'failure', 'mistake'],
          animations: ['shake', 'fade']
        }
      ],
      personality: {
        traits: ['gentle', 'caring', 'encouraging', 'curious', 'warm', 'friendly'],
        speechStyle: 'warm_friendly',
        interactionTone: 'supportive',
        catchphrases: [
          '小语最喜欢和你一起学习！',
          '小语陪着你一起成长！',
          '今天你想学什么呢？',
          '你真棒，继续加油！',
          '小语在这里陪着你哦！',
          '让我们一起快乐学习吧！'
        ]
      },
      voiceSettings: {
        preferredGender: 'female',
        speechRate: 1.2,
        pitch: 1.1,
        volume: 0.8
      }
    }

    const maleCharacter: CharacterConfig = {
      id: 'xiaoyan',
      name: '小言',
      gender: 'male',
      defaultName: '沫言',
      defaultImage: '/role-photos/boy/xiaoyan-casual-001.png',
      age: 10,
      birthday: {
        lunar: '八月十九',
        solar: '15.10.01'
      },
      zodiac: '♎ 天秤座',
      themes: [
        {
          id: 'blue',
          name: 'blue',
          displayName: '蓝色主题',
          primaryColor: '#3b82f6',
          secondaryColor: '#93c5fd',
          backgroundColor: '#eff6ff',
          imagePath: '/role-photos/boy/xiaoyan-casual-001.png',
          gradient: 'linear-gradient(135deg, #3b82f6, #93c5fd)'
        },
        {
          id: 'green',
          name: 'green',
          displayName: '绿色主题',
          primaryColor: '#10b981',
          secondaryColor: '#6ee7b7',
          backgroundColor: '#f0fdf4',
          imagePath: '/role-photos/boy/xiaoyan-casual-002.png',
          gradient: 'linear-gradient(135deg, #10b981, #6ee7b7)'
        },
        {
          id: 'orange',
          name: 'orange',
          displayName: '橙色主题',
          primaryColor: '#f97316',
          secondaryColor: '#fed7aa',
          backgroundColor: '#fff7ed',
          imagePath: '/role-photos/boy/xiaoyan-casual-003.png',
          gradient: 'linear-gradient(135deg, #f97316, #fed7aa)'
        }
      ],
      expressions: [
        {
          id: 'happy',
          name: 'happy',
          displayName: '开心',
          imagePath: '/role-photos/boy/xiaoyan-casual-002.png',
          triggers: ['success', 'praise', 'achievement', 'victory'],
          animations: ['bounce', 'jump']
        },
        {
          id: 'excited',
          name: 'excited',
          displayName: '兴奋',
          imagePath: '/role-photos/boy/xiaoyan-casual-003.png',
          triggers: ['challenge', 'adventure', 'discovery', 'new_skill'],
          animations: ['shake', 'spin']
        },
        {
          id: 'thinking',
          name: 'thinking',
          displayName: '思考',
          imagePath: '/role-photos/boy/xiaoyan-casual-001.png',
          triggers: ['strategy', 'analysis', 'planning', 'investigation'],
          animations: ['pulse', 'tilt']
        },
        {
          id: 'cool',
          name: 'cool',
          displayName: '酷酷',
          imagePath: '/role-photos/boy/xiaoyan-cool-001.png',
          triggers: ['achievement', 'mastery', 'expertise', 'leadership'],
          animations: ['flip', 'rotate']
        },
        {
          id: 'brave',
          name: 'brave',
          displayName: '勇敢',
          imagePath: '/role-photos/boy/xiaoyan-cool-002.png',
          triggers: ['courage', 'protection', 'challenge', 'overcome'],
          animations: ['shield', 'pulse']
        }
      ],
      personality: {
        traits: ['confident', 'protective', 'adventurous', 'helpful', 'energetic', 'brave'],
        speechStyle: 'energetic_friendly',
        interactionTone: 'encouraging',
        catchphrases: [
          '小言保护你，一起学习！',
          '小言和你一起进步！',
          '今天想挑战什么呢？',
          '你很厉害，继续努力！',
          '小言为你加油打气！',
          '让我们一起突破极限！'
        ]
      },
      voiceSettings: {
        preferredGender: 'male',
        speechRate: 1.0,
        pitch: 0.9,
        volume: 0.85
      }
    }

    this.characterCache.set('female', femaleCharacter)
    this.characterCache.set('male', maleCharacter)
  }

  // 根据性别获取角色配置
  getCharacterByGender(gender: 'male' | 'female'): CharacterConfig {
    const character = this.characterCache.get(gender)
    if (!character) {
      throw new Error(`Character configuration not found for gender: ${gender}`)
    }
    return character
  }

  // 根据用户信息自动选择角色
  getCharacterForUser(child?: Child | null): CharacterConfig {
    if (!child) {
      // 默认返回女性角色
      return this.characterCache.get('female')!
    }

    const gender = child.gender === 'male' || child.gender === 'female'
      ? child.gender
      : 'female' // 默认女性

    const character = this.characterCache.get(gender)!

    // 创建角色配置副本
    const updatedCharacter = {
      ...character,
      name: child.name || character.defaultName
    }

    // 如果用户有生日信息，更新年龄、生日和星座
    if (child.birthday) {
      const age = this.calculateAge(child.birthday)
      const zodiac = this.calculateZodiac(child.birthday)
      const lunarBirthday = this.convertToLunar(child.birthday)
      
      updatedCharacter.age = age
      updatedCharacter.birthday = {
        lunar: lunarBirthday,
        solar: child.birthday.toISOString().split('T')[0]
      }
      updatedCharacter.zodiac = zodiac
    }

    return updatedCharacter
  }

  // 根据生日计算年龄
  private calculateAge(birthday: Date): number {
    const today = new Date()
    let age = today.getFullYear() - birthday.getFullYear()
    const monthDiff = today.getMonth() - birthday.getMonth()
    
    // 如果今年还没过生日，年龄减1
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthday.getDate())) {
      age--
    }
    
    return age
  }

  // 根据生日计算星座
  private calculateZodiac(birthday: Date): string {
    const month = birthday.getMonth() + 1
    const day = birthday.getDate()
    
    // 星座日期范围
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
    
    // 查找对应星座
    for (const zodiac of zodiacs) {
      if ((month === zodiac.startMonth && day >= zodiac.startDay) || 
          (month === zodiac.endMonth && day <= zodiac.endDay)) {
        return zodiac.name
      }
    }
    
    // 默认返回射手座
    return '♐ 射手座'
  }

  // 将阳历生日转换为农历（简化实现）
  private convertToLunar(solarDate: Date): string {
    // 这里使用简化实现，实际项目中应该使用更精确的农历转换库
    const lunarMonths = ['正月', '二月', '三月', '四月', '五月', '六月', 
                       '七月', '八月', '九月', '十月', '十一月', '十二月']
    const lunarDays = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
                      '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
                      '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十']
    
    const month = solarDate.getMonth()
    const day = solarDate.getDate() - 1 // 调整为0索引
    
    return `${lunarMonths[month]}${lunarDays[Math.min(day, lunarDays.length - 1)]}`
  }

  // 获取角色图片路径
  getCharacterImagePath(character: CharacterConfig, expression?: string, theme?: string): string {
    // 优先级：表达 > 主题 > 默认
    if (expression) {
      const expressionConfig = character.expressions.find(e => e.name === expression)
      if (expressionConfig && this.imageExists(expressionConfig.imagePath)) {
        return expressionConfig.imagePath
      }
    }

    if (theme) {
      const themeConfig = character.themes.find(t => t.name === theme)
      if (themeConfig && this.imageExists(themeConfig.imagePath)) {
        return themeConfig.imagePath
      }
    }

    // 检查默认图片是否存在，不存在则使用备用图片
    if (this.imageExists(character.defaultImage)) {
      return character.defaultImage
    }

    // 使用新的备用图片路径
    if (character.gender === 'male') {
      return '/role-photos/boy/xiaoyan-casual-001.png' // 男孩备用图片
    } else {
      return '/role-photos/girl/xiaoyu-lolita-blue-008.png' // 女孩备用图片
    }
  }

  // 检查图片是否存在
  private imageExists(_imagePath: string): boolean {
    // 在实际应用中，这里可以通过预加载图片或检查文件系统来验证
    // 为了性能考虑，这里返回true，假设图片存在
    // 在生产环境中，可以使用图片预加载技术
    return true
  }

  // 获取AI浮窗头像路径
  getAIFloatingAvatarPath(character: CharacterConfig): string {
    if (character.gender === 'male') {
      return '/role-photos/boy/ai-avatars/boy-xiaoyan-cool-001.png'
    } else {
      return '/role-photos/girl/ai-avatars/girl-xiaoyu-lolita-pink-001.png'
    }
  }

  // 获取成长记录角色头像路径
  getGrowthAvatarPath(character: CharacterConfig): string {
    if (character.gender === 'male') {
      return '/role-photos/boy/ai-avatars/boy-xiaoyan-casual-002.png'
    } else {
      return '/role-photos/girl/ai-avatars/girl-xiaoyu-lolita-blue-002.png'
    }
  }

  // 获取设置页面角色头像路径
  getSettingAvatarPath(character: CharacterConfig): string {
    if (character.gender === 'male') {
      return '/role-photos/boy/ai-avatars/boy-xiaoyan-casual-003.png'
    } else {
      return '/role-photos/girl/ai-avatars/girl-xiaoyu-lolita-blue-002.png'
    }
  }

  // 获取角色主题颜色
  getCharacterThemeColors(character: CharacterConfig, theme?: string): ThemeColors {
    const selectedTheme = theme
      ? character.themes.find(t => t.name === theme)
      : character.themes[0]

    const baseColors: ThemeColors = character.gender === 'male' ? {
      primary: '#3b82f6',
      secondary: '#93c5fd',
      accent: '#dbeafe',
      background: '#eff6ff',
      text: '#1e3a8a',
      border: '#93c5fd',
      glow: 'rgba(59, 130, 246, 0.3)',
      gradient: 'linear-gradient(135deg, #3b82f6, #93c5fd)'
    } : {
      primary: '#ec4899',
      secondary: '#f9a8d4',
      accent: '#fce7f3',
      background: '#fdf2f8',
      text: '#831843',
      border: '#f9a8d4',
      glow: 'rgba(236, 72, 153, 0.3)',
      gradient: 'linear-gradient(135deg, #ec4899, #f9a8d4)'
    }

    if (selectedTheme) {
      return {
        primary: selectedTheme.primaryColor,
        secondary: selectedTheme.secondaryColor,
        accent: selectedTheme.backgroundColor || baseColors.accent,
        background: selectedTheme.backgroundColor,
        text: baseColors.text,
        border: baseColors.border,
        glow: baseColors.glow,
        gradient: selectedTheme.gradient
      }
    }

    return baseColors
  }

  // 获取角色表情配置
  getCharacterExpression(character: CharacterConfig, expressionName: string): CharacterExpression | null {
    const expression = character.expressions.find(e => e.name === expressionName)
    return expression || null
  }

  // 获取随机表情
  getRandomExpression(character: CharacterConfig): CharacterExpression {
    const expressions = character.expressions
    return expressions[Math.floor(Math.random() * expressions.length)]
  }

  // 获取适合当前情境的表情
  getContextualExpression(character: CharacterConfig, context: string): CharacterExpression | null {
    // 根据上下文找到最合适的表情
    for (const expression of character.expressions) {
      if (expression.triggers.includes(context)) {
        return expression
      }
    }

    // 如果没有找到匹配的表情，返回开心表情
    return character.expressions.find(e => e.name === 'happy') || null
  }

  // 获取角色的经典用语
  getCatchphrase(character: CharacterConfig): string {
    const catchphrases = character.personality.catchphrases
    return catchphrases[Math.floor(Math.random() * catchphrases.length)]
  }

  // 获取角色语音设置
  getVoiceSettings(character: CharacterConfig): VoiceSettings {
    return character.voiceSettings
  }

  // 设置当前用户
  setCurrentChild(child: Child | null): void {
    this.currentChild = child
  }

  // 获取当前用户
  getCurrentChild(): Child | null {
    return this.currentChild
  }

  // 预加载角色图片
  preloadCharacterImages(): Promise<void> {
    const imagePaths: string[] = []

    for (const character of Array.from(this.characterCache.values())) {
      // 添加默认图片
      imagePaths.push(character.defaultImage)

      // 添加主题图片
      character.themes.forEach(theme => {
        imagePaths.push(theme.imagePath)
      })

      // 添加表情图片
      character.expressions.forEach(expression => {
        imagePaths.push(expression.imagePath)
      })
    }

    // 去重
    const uniquePaths = Array.from(new Set(imagePaths))

    // 预加载图片
    const preloadPromises: Promise<void>[] = uniquePaths.map(path => {
      return new Promise<void>((resolve) => {
        const img = new Image()
        img.onload = () => resolve()
        img.onerror = () => {
          console.warn(`Failed to preload image: ${path}`)
          resolve() // 继续执行，不阻塞
        }
        img.src = path
      })
    })

    return Promise.all(preloadPromises).then(() => {})
  }

  // 获取AI头像路径
  getAIAvatarPath(gender: 'male' | 'female'): string {
    if (gender === 'male') {
      return '/role-photos/boy/ai-avatars/boy-xiaoyan-casual-001.png'
    } else {
      return '/role-photos/girl/ai-avatars/girl-xiaoyu-lolita-blue-001.png'
    }
  }

  // 创建动态CSS样式
  createDynamicThemeCSS(character: CharacterConfig, themeName?: string): string {
    const themeColors = this.getCharacterThemeColors(character, themeName)

    return `
      :root {
        --character-primary: ${themeColors.primary};
        --character-secondary: ${themeColors.secondary};
        --character-accent: ${themeColors.accent};
        --character-background: ${themeColors.background};
        --character-text: ${themeColors.text};
        --character-border: ${themeColors.border};
        --character-glow: ${themeColors.glow};
        --character-gradient: ${themeColors.gradient};
      }

      .character-theme {
        color: var(--character-text);
        background: var(--character-background);
        border-color: var(--character-border);
      }

      .character-primary {
        background: var(--character-gradient);
        color: white;
      }

      .character-accent {
        background: var(--character-accent);
        color: var(--character-primary);
        border: 1px solid var(--character-border);
      }

      .character-glow {
        box-shadow: 0 0 20px var(--character-glow);
      }
    `
  }
}

// 导出单例实例
export const characterManager = CharacterManager.getInstance()

// 导出工具函数
export const getCharacterByGender = (gender: 'male' | 'female') =>
  characterManager.getCharacterByGender(gender)

export const getCharacterForUser = (child?: Child | null) =>
  characterManager.getCharacterForUser(child)

export const getCharacterThemeColors = (character: CharacterConfig, theme?: string): ThemeColors =>
  characterManager.getCharacterThemeColors(character, theme)

export const getAIAvatarPath = (gender: 'male' | 'female') =>
  characterManager.getAIAvatarPath(gender)

export const preloadCharacterImages = (): Promise<void> => characterManager.preloadCharacterImages()
