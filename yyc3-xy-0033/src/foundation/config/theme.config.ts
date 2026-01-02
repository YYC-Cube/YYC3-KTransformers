// @file src/foundation/config/theme.config.ts
// @description YYC³ 主题配置
// @author YYC³团队
// @version 1.0.0

import { config } from '../../../lib/config';

// 从统一配置获取UI配置
const uiConfig = config.getUIConfig();

export const themeConfig = {
  // 主题类型
  type: uiConfig.theme,
  
  // 主色调
  primaryColor: uiConfig.primaryColor,
  
  // 辅助色调
  secondaryColor: uiConfig.secondaryColor,
  
  // 布局配置
  layout: {
    // 头部高度
    headerHeight: uiConfig.layout.headerHeight,
    
    // 侧边栏宽度
    sidebarWidth: uiConfig.layout.sidebarWidth,
    
    // 内容区域间距
    contentPadding: uiConfig.layout.contentPadding,
    
    // 最大内容宽度
    maxContentWidth: uiConfig.layout.maxContentWidth,
  },
  
  // 动画配置
  animation: {
    // 过渡时长
    transitionDuration: uiConfig.animation.transitionDuration,
    
    // 过渡曲线
    transitionTimingFunction: uiConfig.animation.transitionTimingFunction,
    
    // 是否启用动画
    enabled: uiConfig.animation.enabled,
  },
  
  // 响应式断点
  breakpoints: uiConfig.breakpoints,
  
  // 组件默认配置
  components: uiConfig.components,
};
