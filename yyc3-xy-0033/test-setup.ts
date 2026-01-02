/**
 * @fileoverview 测试环境设置 - JSDOM环境配置
 * @description 为所有测试文件提供JSDOM环境和必要的全局变量
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-19
 * @modified 2025-01-19
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

// 设置测试环境
process.env.NODE_ENV = 'test'

// 设置React Testing Library的默认配置
import '@testing-library/jest-dom'

// 导出设置函数供测试文件使用
export const setupTestEnvironment = () => {
  console.log('Test environment setup complete')
}

// 自动执行设置
setupTestEnvironment()