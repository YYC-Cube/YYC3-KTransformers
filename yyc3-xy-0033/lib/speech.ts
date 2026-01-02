// 语音服务工具类

export class SpeechService {
  private recognition: any = null
  private synthesis: SpeechSynthesis | null = null
  private isInitialized = false

  constructor() {
    if (typeof window !== "undefined") {
      this.initializeSpeech()
    }
  }

  private initializeSpeech() {
    // 初始化语音识别
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      this.recognition = new SpeechRecognition()
      this.recognition.continuous = false
      this.recognition.interimResults = false
      this.recognition.lang = "zh-CN"
    }

    // 初始化语音合成
    if ("speechSynthesis" in window) {
      this.synthesis = window.speechSynthesis
    }

    this.isInitialized = true
  }

  // 语音识别
  async startListening(onResult: (transcript: string) => void, onError?: (error: any) => void): Promise<void> {
    if (!this.recognition) {
      console.warn("[v0] 浏览器不支持语音识别")
      return
    }

    return new Promise((resolve, reject) => {
      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        console.log("[v0] 语音识别结果:", transcript)
        onResult(transcript)
        resolve()
      }

      this.recognition.onerror = (event: any) => {
        console.error("[v0] 语音识别错误:", event.error)
        if (onError) onError(event.error)
        reject(event.error)
      }

      this.recognition.start()
    })
  }

  stopListening() {
    if (this.recognition) {
      this.recognition.stop()
    }
  }

  // 语音合成
  speak(text: string, options?: { rate?: number; pitch?: number; volume?: number }): void {
    if (!this.synthesis) {
      console.warn("[v0] 浏览器不支持语音合成")
      return
    }

    // 停止当前播放
    this.synthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = "zh-CN"
    utterance.rate = options?.rate || 1
    utterance.pitch = options?.pitch || 1
    utterance.volume = options?.volume || 1

    // 尝试使用中文语音
    const voices = this.synthesis.getVoices()
    const chineseVoice = voices.find((voice) => voice.lang.includes("zh"))
    if (chineseVoice) {
      utterance.voice = chineseVoice
    }

    console.log("[v0] 语音播放:", text)
    this.synthesis.speak(utterance)
  }

  stopSpeaking() {
    if (this.synthesis) {
      this.synthesis.cancel()
    }
  }

  // 检查语音支持
  isSupported() {
    return {
      recognition: !!this.recognition,
      synthesis: !!this.synthesis,
    }
  }
}

// 单例模式
let speechServiceInstance: SpeechService | null = null

export function getSpeechService(): SpeechService {
  if (!speechServiceInstance) {
    speechServiceInstance = new SpeechService()
  }
  return speechServiceInstance
}
