"use client"

export type CommandType = "navigation" | "create" | "query" | "play" | "control" | "chat"

export interface AICommand {
  type: CommandType
  action: string
  params: Record<string, string | number | boolean>
  confidence: number
  rawInput: string
}

export interface CommandResult {
  success: boolean
  message: string
  data?: Record<string, unknown>
  action?: () => void
}

interface CommandPattern {
  pattern: RegExp
  type: CommandType
  action: string
  extractParams?: (match: RegExpMatchArray) => Record<string, string>
}

const NAVIGATION_TARGETS: Record<string, string> = {
  首页: "/",
  主页: "/",
  作业: "/homework",
  课程: "/courses",
  公益: "/activities",
  活动: "/activities",
  消息: "/messages",
  成长: "/growth",
  设置: "/settings",
  档案: "/children",
  日程: "/schedule",
  课程表: "/curriculum",
  绘本: "/books",
  故事: "/story-writing",
  评估: "/growth/assessment",
}

const CREATE_TARGETS: Record<string, string> = {
  日程: "schedule",
  任务: "task",
  记录: "record",
  成长记录: "growth-record",
  故事: "story",
  绘本: "book",
}

const QUERY_TARGETS: Record<string, { api: string; filter?: string }> = {
  作业: { api: "/api/homework", filter: "today" },
  日程: { api: "/api/schedule", filter: "today" },
  课程: { api: "/api/courses", filter: "today" },
  消息: { api: "/api/messages", filter: "unread" },
  成长记录: { api: "/api/growth-records", filter: "recent" },
}

const COMMAND_PATTERNS: CommandPattern[] = [
  {
    pattern: /^(打开|去|进入|查看|看看)(.+?)(页面|页)?$/,
    type: "navigation",
    action: "navigate",
    extractParams: (match) => ({ target: match[2].trim() }),
  },
  {
    pattern: /^(创建|新建|添加|写)(一个)?(.+)$/,
    type: "create",
    action: "create",
    extractParams: (match) => ({ type: match[3].trim() }),
  },
  {
    pattern: /^今天有(什么|哪些)(.+)$/,
    type: "query",
    action: "query-today",
    extractParams: (match) => ({ type: match[2].trim() }),
  },
  {
    pattern: /^(查询|查看|看看)(.+)$/,
    type: "query",
    action: "query",
    extractParams: (match) => ({ type: match[2].trim() }),
  },
  {
    pattern: /^(播放|听|读|朗读)(.+)$/,
    type: "play",
    action: "play",
    extractParams: (match) => ({ content: match[2].trim() }),
  },
  {
    pattern: /^(停止|暂停)(播放|朗读)?$/,
    type: "control",
    action: "stop",
    extractParams: () => ({}),
  },
  {
    pattern: /^(放大|缩小|最小化|关闭)(窗口|浮窗)?$/,
    type: "control",
    action: "resize",
    extractParams: (match) => ({ mode: match[1] }),
  },
  {
    pattern: /^(帮我|请|麻烦)(.+)$/,
    type: "chat",
    action: "assist",
    extractParams: (match) => ({ request: match[2].trim() }),
  },
]

export class AICommandParser {
  private static instance: AICommandParser | null = null

  static getInstance(): AICommandParser {
    if (!AICommandParser.instance) {
      AICommandParser.instance = new AICommandParser()
    }
    return AICommandParser.instance
  }

  parseIntent(input: string): AICommand[] {
    const trimmedInput = input.trim()
    const commands: AICommand[] = []

    for (const pattern of COMMAND_PATTERNS) {
      const match = trimmedInput.match(pattern.pattern)
      if (match) {
        const params = pattern.extractParams ? pattern.extractParams(match) : {}
        commands.push({
          type: pattern.type,
          action: pattern.action,
          params,
          confidence: 0.9,
          rawInput: trimmedInput,
        })
        break
      }
    }

    if (commands.length === 0) {
      commands.push({
        type: "chat",
        action: "conversation",
        params: { message: trimmedInput },
        confidence: 1.0,
        rawInput: trimmedInput,
      })
    }

    return commands
  }

  async executeCommand(
    command: AICommand,
    context: {
      router?: { push: (path: string) => void }
      openModal?: (type: string) => void
      speak?: (text: string) => void
      setWidgetSize?: (size: "mini" | "normal" | "expanded") => void
    },
  ): Promise<CommandResult> {
    switch (command.type) {
      case "navigation":
        return this.executeNavigation(command, context)
      case "create":
        return this.executeCreate(command, context)
      case "query":
        return this.executeQuery(command, context)
      case "play":
        return this.executePlay(command, context)
      case "control":
        return this.executeControl(command, context)
      default:
        return { success: false, message: "未识别的命令类型" }
    }
  }

  private executeNavigation(command: AICommand, context: { router?: { push: (path: string) => void } }): CommandResult {
    const target = command.params.target as string
    const path = NAVIGATION_TARGETS[target]

    if (path && context.router) {
      return {
        success: true,
        message: `正在打开${target}页面`,
        action: () => context.router?.push(path),
      }
    }

    return { success: false, message: `找不到"${target}"页面` }
  }

  private executeCreate(command: AICommand, context: { openModal?: (type: string) => void }): CommandResult {
    const type = command.params.type as string
    const modalType = CREATE_TARGETS[type]

    if (modalType && context.openModal) {
      return {
        success: true,
        message: `正在打开${type}创建界面`,
        action: () => context.openModal?.(modalType),
      }
    }

    return { success: false, message: `不支持创建"${type}"` }
  }

  private async executeQuery(command: AICommand, context: Record<string, unknown>): Promise<CommandResult> {
    const type = command.params.type as string
    const queryConfig = QUERY_TARGETS[type]

    if (queryConfig) {
      try {
        const url = new URL(queryConfig.api, window.location.origin)
        if (queryConfig.filter) {
          url.searchParams.set("filter", queryConfig.filter)
        }

        const response = await fetch(url.toString())
        if (response.ok) {
          const data = await response.json()
          return {
            success: true,
            message: `查询到${type}数据`,
            data: { items: data, type },
          }
        }
      } catch (error) {
        console.error("[AICommand] 查询失败:", error)
      }
    }

    return { success: false, message: `无法查询"${type}"` }
  }

  private executePlay(command: AICommand, context: { speak?: (text: string) => void }): CommandResult {
    const content = command.params.content as string

    if (context.speak) {
      return {
        success: true,
        message: `正在播放: ${content}`,
        action: () => context.speak?.(content),
      }
    }

    return { success: false, message: "语音播放功能不可用" }
  }

  private executeControl(
    command: AICommand,
    context: { setWidgetSize?: (size: "mini" | "normal" | "expanded") => void },
  ): CommandResult {
    const action = command.action
    const mode = command.params.mode as string

    if (action === "stop") {
      return {
        success: true,
        message: "已停止播放",
        action: () => {
          if (typeof window !== "undefined") {
            window.speechSynthesis?.cancel()
          }
        },
      }
    }

    if (action === "resize" && context.setWidgetSize) {
      const sizeMap: Record<string, "mini" | "normal" | "expanded"> = {
        放大: "expanded",
        缩小: "mini",
        最小化: "mini",
      }

      const size = sizeMap[mode]
      if (size) {
        return {
          success: true,
          message: `窗口已${mode}`,
          action: () => context.setWidgetSize?.(size),
        }
      }
    }

    return { success: false, message: "控制命令执行失败" }
  }

  formatQueryResult(result: CommandResult): string {
    if (!result.success || !result.data) {
      return result.message
    }

    const { items, type } = result.data as { items: unknown[]; type: string }

    if (!Array.isArray(items) || items.length === 0) {
      return `今天没有${type}哦~`
    }

    const itemDescriptions = items.slice(0, 5).map((item: Record<string, unknown>, index: number) => {
      const title = (item.title || item.name || item.content || `第${index + 1}项`) as string
      return `${index + 1}. ${title}`
    })

    return `今天有${items.length}个${type}:\n${itemDescriptions.join("\n")}`
  }
}

export const aiCommandParser = AICommandParser.getInstance()
