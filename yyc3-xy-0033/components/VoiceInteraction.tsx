"use client"

import { useState, useRef, useCallback } from "react"
import { motion } from "framer-motion"
import { reportError } from "@/lib/global-error-handler"

interface VoiceInteractionProps {
  onTranscript: (text: string) => void
  onEmotionDetected: (emotion: string) => void
  className?: string
}

export default function VoiceInteraction({
  onTranscript,
  onEmotionDetected,
  className = ""
}: VoiceInteractionProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [audioLevel, setAudioLevel] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  // 检查浏览器支持
  const isSupported = () => {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.SpeechRecognition || (window as any).webkitSpeechRecognition)
  }

  // 语音识别
  const startSpeechRecognition = useCallback(() => {
    if (!isSupported()) {
      console.warn("浏览器不支持语音识别功能")
      return
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) return

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = "zh-CN"

    recognition.onresult = (event: any) => {
      let finalTranscript = ""
      let interimTranscript = ""

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript + " "
        } else {
          interimTranscript += transcript
        }
      }

      const fullTranscript = finalTranscript + interimTranscript
      setTranscript(fullTranscript)

      if (finalTranscript.trim()) {
        onTranscript(finalTranscript.trim())
        detectEmotion(finalTranscript.trim())
      }
    }

    recognition.onerror = (event: any) => {
      reportError(new Error(event.error), { component: 'VoiceInteraction', action: 'speechRecognition', errorType: event.error })
      if (event.error === "no-speech") {
        setIsRecording(false)
      }
    }

    recognition.onend = () => {
      setIsRecording(false)
    }

    recognition.start()
    return recognition
  }, [onTranscript])

  // 情感检测（简化版）
  const detectEmotion = (text: string) => {
    const emotionKeywords = {
      happy: ["开心", "高兴", "快乐", "笑", "哈哈", "棒", "好", "喜欢", "爱"],
      sad: ["难过", "伤心", "哭", "不舒服", "痛", "怕"],
      excited: ["兴奋", "激动", "太棒了", "哇", "惊喜"],
      calm: ["平静", "安静", "舒服", "放松"]
    }

    let detectedEmotion = "neutral"
    let maxScore = 0

    Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
      const score = keywords.reduce((count, keyword) => {
        return count + (text.includes(keyword) ? 1 : 0)
      }, 0)

      if (score > maxScore) {
        maxScore = score
        detectedEmotion = emotion
      }
    })

    if (maxScore > 0) {
      onEmotionDetected(detectedEmotion)
    }
  }

  // 音频可视化
  const startAudioVisualization = useCallback((stream: MediaStream) => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    analyserRef.current = audioContextRef.current.createAnalyser()
    const source = audioContextRef.current.createMediaStreamSource(stream)
    source.connect(analyserRef.current)
    analyserRef.current.fftSize = 256

    const updateAudioLevel = () => {
      if (!analyserRef.current) return

      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
      analyserRef.current.getByteFrequencyData(dataArray)

      const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length
      setAudioLevel(average / 255)

      animationFrameRef.current = requestAnimationFrame(updateAudioLevel)
    }

    updateAudioLevel()
  }, [])

  // 开始录音
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      })

      // 开始语音识别
      startSpeechRecognition()

      // 音频可视化
      startAudioVisualization(stream)

      // 设置录音器（备用）
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()

      setIsRecording(true)
      setIsProcessing(false)
    } catch (error) {
      reportError(error as Error, { component: 'VoiceInteraction', action: 'microphoneAccess' })
      alert("请允许访问麦克风以使用语音功能")
    }
  }

  // 停止录音
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop()
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }

    if (audioContextRef.current) {
      audioContextRef.current.close()
    }

    setIsRecording(false)
    setIsProcessing(true)

    // 模拟处理延迟
    setTimeout(() => {
      setIsProcessing(false)
      setAudioLevel(0)
    }, 1000)
  }

  // 清理资源
  const cleanup = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    if (audioContextRef.current) {
      audioContextRef.current.close()
    }
  }

  // 组件卸载时清理
  const handleUnmount = useCallback(() => {
    cleanup()
  }, [])

  if (!isSupported()) {
    return (
      <div className={`text-center p-4 bg-gray-50 rounded-lg ${className}`}>
        <p className="text-gray-600 text-sm">
          您的浏览器不支持语音交互功能
        </p>
      </div>
    )
  }

  return (
    <div className={`voice-interaction ${className}`}>
      {/* 交互按钮 */}
      <div className="flex flex-col items-center space-y-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
          className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all ${
            isRecording
              ? "bg-red-500 hover:bg-red-600 shadow-red-200"
              : isProcessing
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
          } shadow-lg`}
        >
          {isProcessing ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          ) : isRecording ? (
            <div className="relative">
              <div className="w-8 h-8 bg-white rounded-full"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          ) : (
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
            </svg>
          )}
        </motion.button>

        <div className="text-center">
          <p className="text-sm font-medium text-gray-700">
            {isProcessing
              ? "正在处理..."
              : isRecording
              ? "正在录音..."
              : "点击开始语音输入"
            }
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {isRecording && "说出您想对小语说的话"}
          </p>
        </div>
      </div>

      {/* 音频可视化 */}
      {isRecording && (
        <div className="mt-4 flex justify-center space-x-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-1 bg-blue-500 rounded-full"
              style={{ height: `${20 + audioLevel * 40 * Math.random()}px` }}
              animate={{
                scaleY: [1, 1 + audioLevel, 1]
              }}
              transition={{
                duration: 0.2,
                repeat: Infinity,
                delay: i * 0.1
              }}
            />
          ))}
        </div>
      )}

      {/* 实时转录显示 */}
      {transcript && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-sky-50 rounded-lg"
        >
          <p className="text-sm text-gray-700">
            <span className="font-medium">识别结果：</span> {transcript}
          </p>
        </motion.div>
      )}

      {/* 功能提示 */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          🔊 语音识别支持中文，可以与小语进行自然对话
        </p>
      </div>
    </div>
  )
}