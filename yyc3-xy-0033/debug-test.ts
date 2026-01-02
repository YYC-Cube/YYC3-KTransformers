// 临时调试脚本
import { renderWithDOM } from './test-utils'

// Mock modules
const { mock } = await import('bun:test')

mock.module('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: {
      id: 'user-001',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User'
    },
    logout: async () => {}
  })
}))

mock.module('@/hooks/useChildren-mock', () => ({
  useChildrenMock: () => ({
    currentChild: {
      id: 'child-001',
      name: '小明',
      nickname: '小明'
    }
  })
}))

mock.module('next/font', () => ({
  Inter: () => ({ className: 'inter-font' })
}))

mock.module('@/components/Navigation', () => ({
  default: () => null
}))

// Import after mocking
const { SettingsPage } = await import('../app/settings/page')

async function debugTest() {
  console.log('开始调试测试...')
  
  const { queries } = renderWithDOM(SettingsPage({}))
  
  // 查找所有包含"昵称"的文本
  const allTexts = Array.from(document.body.querySelectorAll('*')).map(el => el.textContent).filter(Boolean)
  console.log('页面所有文本内容:')
  allTexts.forEach(text => console.log(`- ${text}`))
  
  // 查找包含"当前昵称"的元素
  try {
    const nicknameElement = queries.getByText(/当前昵称：/)
    console.log('找到昵称元素:', nicknameElement.textContent)
  } catch (error) {
    console.log('未找到包含"当前昵称"的元素')
  }
  
  process.exit(0)
}

debugTest().catch(console.error)