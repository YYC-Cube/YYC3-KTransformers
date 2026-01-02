/**
 * YYC³ AI小语智能成长守护系统 - 可访问性包装器
 * 第六阶段：高级特性与生产准备
 */

'use client'

import { useState, useEffect } from 'react'
import AccessibilityPanel from '@/components/accessibility/AccessibilityPanel'

interface AccessibilityWrapperProps {
  children: React.ReactNode
}

export default function AccessibilityWrapper({ children }: AccessibilityWrapperProps) {
  const [isPanelOpen, setIsPanelOpen] = useState(false)

  // 监听打开面板事件
  useEffect(() => {
    const handleOpenPanel = () => setIsPanelOpen(true)

    document.addEventListener('open-accessibility-panel', handleOpenPanel)

    return () => {
      document.removeEventListener('open-accessibility-panel', handleOpenPanel)
    }
  }, [])

  return (
    <>
      {children}
      <AccessibilityPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
      />
    </>
  )
}