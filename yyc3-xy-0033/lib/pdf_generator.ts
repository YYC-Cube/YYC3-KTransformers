// PDF报告生成器
// 使用Canvas API生成可打印的成长报告

export interface ReportData {
  childName: string
  childAge: number
  stageName: string
  assessmentDate: string
  overallLevel: string
  aiAnalysis: string
  dimensionScores: Record<
    string,
    {
      score: number
      level: string
      description: string
    }
  >
  recommendations: string[]
  growthRecords?: {
    title: string
    date: string
    type: string
  }[]
}

export class PDFGenerator {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private width = 595 // A4 宽度 (pt)
  private height = 842 // A4 高度 (pt)
  private margin = 40
  private lineHeight = 20
  private currentY = 0
  private pageNumber = 1
  private pages: string[] = []

  constructor() {
    this.currentY = this.margin
    this.pageNumber = 1
    this.pages = []
  }

  // 私有方法确保客户端环境
  private ensureClientEnvironment() {
    if (typeof window === 'undefined') {
      throw new Error('PDFGenerator requires client-side environment')
    }
    if (!this.canvas) {
      this.canvas = document.createElement("canvas")
      this.canvas.width = this.width * 2 // 2x for retina
      this.canvas.height = this.height * 2
      this.ctx = this.canvas.getContext("2d")!
      this.ctx.scale(2, 2)
    }
  }

  private newPage() {
    this.ensureClientEnvironment()

    // 保存当前页
    this.pages.push(this.canvas.toDataURL("image/png"))

    // 重置画布
    this.ctx.fillStyle = "#ffffff"
    this.ctx.fillRect(0, 0, this.width, this.height)
    this.currentY = this.margin
    this.pageNumber++

    // 添加页眉
    this.drawHeader()
  }

  private drawHeader() {
    this.ensureClientEnvironment()

    this.ctx.fillStyle = "#3b82f6"
    this.ctx.fillRect(0, 0, this.width, 60)

    this.ctx.fillStyle = "#ffffff"
    this.ctx.font = "bold 16px system-ui"
    this.ctx.fillText("YYC³ AI小语智能成长守护系统", this.margin, 35)

    this.ctx.font = "12px system-ui"
    this.ctx.fillText(`第 ${this.pageNumber} 页`, this.width - this.margin - 40, 35)

    this.currentY = 80
  }

  private drawText(
    text: string,
    options?: {
      fontSize?: number
      fontWeight?: string
      color?: string
      align?: CanvasTextAlign
      maxWidth?: number
    },
  ) {
    this.ensureClientEnvironment()

    const {
      fontSize = 12,
      fontWeight = "normal",
      color = "#1e293b",
      align = "left",
      maxWidth = this.width - this.margin * 2,
    } = options || {}

    this.ctx.font = `${fontWeight} ${fontSize}px system-ui`
    this.ctx.fillStyle = color
    this.ctx.textAlign = align

    // 文本换行处理
    const words = text.split("")
    let line = ""
    const x = align === "center" ? this.width / 2 : this.margin

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i]
      const metrics = this.ctx.measureText(testLine)

      if (metrics.width > maxWidth && line !== "") {
        this.ctx.fillText(line, x, this.currentY)
        line = words[i]
        this.currentY += this.lineHeight

        // 检查是否需要新页
        if (this.currentY > this.height - this.margin) {
          this.newPage()
        }
      } else {
        line = testLine
      }
    }

    if (line) {
      this.ctx.fillText(line, x, this.currentY)
      this.currentY += this.lineHeight
    }

    this.ctx.textAlign = "left"
  }

  private drawProgressBar(label: string, score: number, level: string) {
    this.ensureClientEnvironment()

    const barWidth = 200
    const barHeight = 12
    const x = this.margin
    const y = this.currentY

    // 标签
    this.ctx.font = "12px system-ui"
    this.ctx.fillStyle = "#475569"
    this.ctx.fillText(label, x, y)

    // 背景条
    this.ctx.fillStyle = "#e2e8f0"
    this.ctx.fillRect(x + 120, y - 10, barWidth, barHeight)

    // 进度条
    const color = score >= 85 ? "#22c55e" : score >= 70 ? "#3b82f6" : score >= 55 ? "#eab308" : "#f97316"
    this.ctx.fillStyle = color
    this.ctx.fillRect(x + 120, y - 10, barWidth * (score / 100), barHeight)

    // 分数和等级
    this.ctx.fillStyle = "#64748b"
    this.ctx.fillText(`${score}分`, x + 330, y)
    this.ctx.fillStyle = color
    this.ctx.fillText(level, x + 380, y)

    this.currentY += 25
  }

  private drawSection(title: string) {
    this.ensureClientEnvironment()

    this.currentY += 10

    // 分节线
    this.ctx.fillStyle = "#3b82f6"
    this.ctx.fillRect(this.margin, this.currentY, 4, 20)

    // 标题
    this.ctx.font = "bold 14px system-ui"
    this.ctx.fillStyle = "#1e293b"
    this.ctx.fillText(title, this.margin + 12, this.currentY + 15)

    this.currentY += 35
  }

  async generateReport(data: ReportData): Promise<Blob> {
    this.ensureClientEnvironment()

    // 初始化第一页
    this.ctx.fillStyle = "#ffffff"
    this.ctx.fillRect(0, 0, this.width, this.height)

    // 封面标题
    this.ctx.fillStyle = "#3b82f6"
    this.ctx.fillRect(0, 0, this.width, 120)

    this.ctx.fillStyle = "#ffffff"
    this.ctx.font = "bold 24px system-ui"
    this.ctx.textAlign = "center"
    this.ctx.fillText("儿童发展评估报告", this.width / 2, 60)

    this.ctx.font = "14px system-ui"
    this.ctx.fillText("YYC³ AI小语智能成长守护系统", this.width / 2, 90)
    this.ctx.textAlign = "left"

    this.currentY = 150

    // 基本信息
    this.drawSection("基本信息")
    this.drawText(`儿童姓名：${data.childName}`)
    this.drawText(`年龄月龄：${data.childAge}个月`)
    this.drawText(`发展阶段：${data.stageName}`)
    this.drawText(`评估日期：${new Date(data.assessmentDate).toLocaleDateString("zh-CN")}`)
    this.drawText(`总体评级：${data.overallLevel}`, { fontWeight: "bold", color: "#3b82f6" })

    // 维度评分
    this.drawSection("发展维度评估")
    for (const [dimension, score] of Object.entries(data.dimensionScores)) {
      this.drawProgressBar(dimension, score.score, score.level)
    }

    // AI综合分析
    this.drawSection("AI综合分析")
    const paragraphs = data.aiAnalysis.split("\n").filter((p) => p.trim())
    for (const p of paragraphs) {
      this.drawText(p, { color: "#475569" })
      this.currentY += 5
    }

    // 成长建议
    this.drawSection("专家建议")
    data.recommendations.forEach((rec, i) => {
      this.drawText(`${i + 1}. ${rec}`, { color: "#475569" })
    })

    // 成长记录摘要
    if (data.growthRecords && data.growthRecords.length > 0) {
      this.drawSection("近期成长记录")
      data.growthRecords.slice(0, 5).forEach((record) => {
        this.drawText(`• ${record.title}`, { color: "#475569" })
        this.drawText(`  ${record.date} · ${record.type}`, { fontSize: 10, color: "#94a3b8" })
      })
    }

    // 页脚
    this.currentY = this.height - 60
    this.ctx.fillStyle = "#e2e8f0"
    this.ctx.fillRect(this.margin, this.currentY, this.width - this.margin * 2, 1)

    this.ctx.font = "10px system-ui"
    this.ctx.fillStyle = "#94a3b8"
    this.ctx.textAlign = "center"
    this.ctx.fillText("本报告由YYC³ AI小语智能成长守护系统自动生成，仅供参考", this.width / 2, this.currentY + 20)
    this.ctx.fillText(`生成时间：${new Date().toLocaleString("zh-CN")}`, this.width / 2, this.currentY + 35)

    // 保存最后一页
    this.pages.push(this.canvas.toDataURL("image/png"))

    // 转换为Blob
    return new Promise((resolve) => {
      this.canvas.toBlob((blob) => {
        resolve(blob!)
      }, "image/png")
    })
  }

  // 下载报告
  async downloadReport(data: ReportData, filename?: string) {
    this.ensureClientEnvironment()
    await this.generateReport(data)

    const link = document.createElement("a")
    link.download = filename || `${data.childName}_发展评估报告_${new Date().toISOString().split("T")[0]}.png`
    link.href = this.canvas.toDataURL("image/png")
    link.click()
  }

  // 获取预览图片
  async getPreviewImage(data: ReportData): Promise<string> {
    this.ensureClientEnvironment()
    await this.generateReport(data)
    return this.canvas.toDataURL("image/png")
  }
}

export const pdfGenerator = new PDFGenerator()
