/**
 * @file 动画系统
 * @description 统一的微动画和交互动画配置系统
 * @author YYC³ Development Team
 * @version 1.0.0
 * @created 2024-12-14
 */

import { Variants, Transition } from 'framer-motion'

// 动画持续时间常量
export const DURATIONS = {
  fast: 0.15,
  normal: 0.25,
  slow: 0.4,
  slower: 0.6
} as const

// 动画缓动函数
export const EASINGS = {
  easeIn: [0.4, 0.0, 1, 1],
  easeOut: [0.0, 0.0, 0.2, 1],
  easeInOut: [0.4, 0.0, 0.2, 1],
  bounce: [0.68, -0.55, 0.265, 1.55],
  smooth: [0.25, 0.1, 0.25, 1],
  sharp: [0.4, 0.0, 0.6, 1]
} as const

// 弹簧配置
export const SPRINGS = {
  gentle: {
    type: "spring",
    stiffness: 300,
    damping: 30
  },
  bouncy: {
    type: "spring",
    stiffness: 400,
    damping: 20
  },
  stiff: {
    type: "spring",
    stiffness: 600,
    damping: 40
  },
  wobbly: {
    type: "spring",
    stiffness: 200,
    damping: 15
  }
} as const

// 通用动画变体
export const COMMON_VARIANTS = {
  // 淡入淡出
  fadeInOut: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  },

  // 上下滑动
  slideUpDown: {
    hidden: { y: -20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: 20, opacity: 0 }
  },

  // 左右滑动
  slideLeftRight: {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: 20, opacity: 0 }
  },

  // 缩放
  scale: {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 }
  },

  // 旋转进入
  rotateIn: {
    hidden: { rotate: -180, scale: 0, opacity: 0 },
    visible: { rotate: 0, scale: 1, opacity: 1 },
    exit: { rotate: 180, scale: 0, opacity: 0 }
  }
} as const

// 微交互动画
export const MICRO_INTERACTIONS = {
  // 按钮点击
  buttonTap: {
    whileTap: { scale: 0.95 },
    whileHover: { scale: 1.05 }
  },

  // 悬停提升
  hoverLift: {
    whileHover: {
      y: -4,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  },

  // 悬停阴影
  hoverShadow: {
    whileHover: {
      boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
      transition: {
        duration: 0.2
      }
    }
  },

  // 旋转加载
  spin: {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }
    }
  },

  // 脉冲动画
  pulse: {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  },

  // 弹跳进入
  bounceIn: {
    initial: { scale: 0, opacity: 0 },
    animate: {
      scale: [0, 1.2, 1],
      opacity: 1,
      transition: {
        duration: 0.5,
        times: [0, 0.6, 1],
        ease: "easeOut"
      }
    }
  },

  // 摇摆错误
  shakeError: {
    animate: {
      x: [0, -10, 10, -10, 10, 0],
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    }
  },

  // 成功勾选
  checkSuccess: {
    initial: { pathLength: 0, opacity: 0 },
    animate: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 0.3, ease: "easeInOut" },
        opacity: { duration: 0.1 }
      }
    }
  }
} as const

// 页面过渡动画
export const PAGE_TRANSITIONS = {
  // 淡入淡出
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: DURATIONS.normal }
  },

  // 滑动进入
  slide: {
    initial: { x: 300, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -300, opacity: 0 },
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },

  // 缩放进入
  scale: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 1.2, opacity: 0 },
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 30
    }
  }
} as const

// 列表项动画
export const LIST_ITEM_VARIANTS = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  },
  item: {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: SPRINGS.gentle
    }
  }
} as const

// 模态框动画
export const MODAL_VARIANTS = {
  overlay: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  },
  content: {
    hidden: { scale: 0.8, opacity: 0, y: 20 },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: SPRINGS.bouncy
    },
    exit: {
      scale: 0.8,
      opacity: 0,
      y: 20,
      transition: { duration: 0.2 }
    }
  }
} as const

// 工具提示动画
export const TOOLTIP_VARIANTS = {
  hidden: { opacity: 0, scale: 0.8, y: 5 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30
    }
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 5,
    transition: { duration: 0.15 }
  }
} as const

// 抽屉动画
export const DRAWER_VARIANTS = {
  overlay: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  },
  content: {
    left: {
      hidden: { x: '-100%' },
      visible: { x: 0 },
      exit: { x: '-100%' }
    },
    right: {
      hidden: { x: '100%' },
      visible: { x: 0 },
      exit: { x: '100%' }
    },
    top: {
      hidden: { y: '-100%' },
      visible: { y: 0 },
      exit: { y: '-100%' }
    },
    bottom: {
      hidden: { y: '100%' },
      visible: { y: 0 },
      exit: { y: '100%' }
    }
  }
} as const

// 动画系统类
export class AnimationSystem {
  private static instance: AnimationSystem
  private animationQueue: Array<() => void> = []
  private isProcessingQueue = false

  private constructor() {}

  static getInstance(): AnimationSystem {
    if (!AnimationSystem.instance) {
      AnimationSystem.instance = new AnimationSystem()
    }
    return AnimationSystem.instance
  }

  // 创建自定义动画变体
  createVariants(config: {
    hidden?: any
    visible?: any
    exit?: any
    hover?: any
    tap?: any
    transition?: Transition
  }): Variants {
    return {
      hidden: config.hidden || { opacity: 0 },
      visible: config.visible || { opacity: 1 },
      exit: config.exit || { opacity: 0 },
      ...config.hover && { whileHover: config.hover },
      ...config.tap && { whileTap: config.tap },
      transition: config.transition || { duration: DURATIONS.normal }
    }
  }

  // 创建响应式动画
  createResponsiveAnimation(breakpoints: {
    mobile?: any
    tablet?: any
    desktop?: any
  }) {
    return {
      initial: breakpoints.mobile,
      animate: {
        ...breakpoints.tablet,
        '@media (min-width: 768px)': breakpoints.tablet,
        '@media (min-width: 1024px)': breakpoints.desktop
      }
    }
  }

  // 添加动画到队列
  queueAnimation(animationFn: () => void) {
    this.animationQueue.push(animationFn)
    this.processQueue()
  }

  // 处理动画队列
  private async processQueue() {
    if (this.isProcessingQueue || this.animationQueue.length === 0) return

    this.isProcessingQueue = true

    while (this.animationQueue.length > 0) {
      const animationFn = this.animationQueue.shift()
      if (animationFn) {
        try {
          await new Promise(resolve => {
            animationFn()
            setTimeout(resolve, 16) // 约60fps
          })
        } catch (error) {
          console.warn('Animation queue error:', error)
        }
      }
    }

    this.isProcessingQueue = false
  }

  // 清空队列
  clearQueue() {
    this.animationQueue = []
  }

  // 获取队列状态
  getQueueStatus() {
    return {
      queueLength: this.animationQueue.length,
      isProcessing: this.isProcessingQueue
    }
  }

  // 性能优化的批量动画
  createBatchAnimation(items: Array<{
    animation: () => void
    delay?: number
  }>) {
    return items.map((item, index) => ({
      ...item.animation(),
      transition: {
        delay: item.delay || index * 0.1,
        ...SPRINGS.gentle
      }
    }))
  }
}

// 导出单例实例
export const animationSystem = AnimationSystem.getInstance()

// 便捷函数
export const createVariants = (config: any) =>
  animationSystem.createVariants(config)

export const createResponsiveAnimation = (breakpoints: any) =>
  animationSystem.createResponsiveAnimation(breakpoints)

export const queueAnimation = (animationFn: () => void) =>
  animationSystem.queueAnimation(animationFn)