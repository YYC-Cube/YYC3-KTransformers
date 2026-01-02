#!/usr/bin/env bun
/**
 * YYC³ 全局类型修复脚本 - 消除所有 any 类型
 *
 * 本脚本将系统地替换所有 any 类型为具体的安全类型
 * 运行前请确保已提交代码到 Git
 *
 * 使用方法:
 * bun run scripts/fix-all-any-types.ts
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { glob } from 'glob'
import { join } from 'path'

// ============================================================================
// 配置
// ============================================================================

const PROJECT_ROOT = process.cwd()
const TYPES_FILE = join(PROJECT_ROOT, 'types/global-unified.ts')
const BACKUP_DIR = join(PROJECT_ROOT, '.type-fix-backup')

// ============================================================================
// 类型映射表 - 将 any 替换为具体类型
// ============================================================================

const TYPE_REPLACEMENTS: Array<{
  pattern: RegExp
  replacement: string
  description: string
  priority: number
}> = [
  // 1. Record<string, any> -> TypedObject or specific types
  {
    pattern: /Record<string,\s*any>/g,
    replacement: 'TypedObject<JSONObject>',
    description: 'Record<string, any> -> TypedObject<JSONObject>',
    priority: 1
  },

  // 2. : any[] -> JSONValue[]
  {
    pattern: /:\s*any\[\]/g,
    replacement: ': JSONValue[]',
    description: 'any[] -> JSONValue[]',
    priority: 1
  },

  // 3. | any -> | JSONValue
  {
    pattern: /\|\s*any/g,
    replacement: '| JSONValue',
    description: '| any -> | JSONValue',
    priority: 1
  },

  // 4. Function returning any
  {
    pattern: /:\s*any\s*[,\)]/g,
    replacement: ': JSONValue$1',
    description: ': any -> : JSONValue',
    priority: 2
  },

  // 5. metadata?: any -> metadata?: Metadata
  {
    pattern: /metadata\?:\s*any/g,
    replacement: 'metadata?: Metadata',
    description: 'metadata?: any -> metadata?: Metadata',
    priority: 2
  },

  // 6. data?: any -> data?: JSONValue
  {
    pattern: /data\?:\s*any/g,
    replacement: 'data?: JSONValue',
    description: 'data?: any -> data?: JSONValue',
    priority: 2
  },

  // 7. params?: any -> params?: RequestParams
  {
    pattern: /params\?:\s*any/g,
    replacement: 'params?: RequestParams',
    description: 'params?: any -> params?: RequestParams',
    priority: 2
  },

  // 8. value: any -> value: JSONValue
  {
    pattern: /value:\s*any/g,
    replacement: 'value: JSONValue',
    description: 'value: any -> value: JSONValue',
    priority: 2
  },

  // 9. body?: any -> body?: RequestBody
  {
    pattern: /body\?:\s*any/g,
    replacement: 'body?: RequestBody',
    description: 'body?: any -> body?: RequestBody',
    priority: 3
  },

  // 10. context?: any -> context?: ExecutionContext
  {
    pattern: /context\?:\s*any/g,
    replacement: 'context?: ExecutionContext',
    description: 'context?: any -> context?: ExecutionContext',
    priority: 3
  },

  // 11. options?: any -> options?: Options
  {
    pattern: /options\?:\s*any/g,
    replacement: 'options?: Options',
    description: 'options?: any -> options?: Options',
    priority: 3
  },

  // 12. config?: any -> config?: Config
  {
    pattern: /config\?:\s*any/g,
    replacement: 'config?: Config',
    description: 'config?: any -> config?: Config',
    priority: 3
  },

  // 13. ...args: any[] -> ...args: unknown[]
  {
    pattern: /\.\.\.(\w+):\s*any\[\]/g,
    replacement: '...$1: unknown[]',
    description: '...args: any[] -> ...args: unknown[]',
    priority: 2
  },

  // 14. (error: any) -> (error: Error)
  {
    pattern: /\(error:\s*any\)/g,
    replacement: '(error: Error)',
    description: '(error: any) -> (error: Error)',
    priority: 2
  },

  // 15. (result: any) -> (result: unknown)
  {
    pattern: /\(result:\s*any\)/g,
    replacement: '(result: unknown)',
    description: '(result: any) -> (result: unknown)',
    priority: 2
  }
]

// ============================================================================
// 文件排除列表
// ============================================================================

const EXCLUDE_PATTERNS = [
  'node_modules/**',
  '.next/**',
  'dist/**',
  'build/**',
  'coverage/**',
  '.git/**',
  '**/*.d.ts',
  '**/*.test.ts',
  '**/*.spec.ts',
  '**/types/**', // 已经是类型定义文件
  'scripts/**', // 脚本文件
  '.vscode/**',
  '.idea/**'
]

// ============================================================================
// 辅助函数
// ============================================================================

interface FixResult {
  file: string
  originalCount: number
  fixedCount: number
  errors: string[]
}

interface Summary {
  totalFiles: number
  totalFilesWithAny: number
  totalAnyCount: number
  totalFixed: number
  results: FixResult[]
}

/**
 * 统计文件中的 any 使用情况
 */
function countAnyOccurrences(content: string): number {
  const matches = content.match(/:\s*any/g)
  return matches ? matches.length : 0
}

/**
 * 应用类型修复
 */
function applyTypeFixes(filePath: string, content: string): string {
  let modified = content
  let fixedCount = 0

  for (const rule of TYPE_REPLACEMENTS) {
    const beforeCount = (modified.match(rule.pattern) || []).length
    if (beforeCount > 0) {
      modified = modified.replace(rule.pattern, rule.replacement)
      const afterCount = (modified.match(rule.pattern) || []).length
      fixedCount += beforeCount - afterCount
    }
  }

  return { content: modified, fixedCount }
}

/**
 * 添加必要的类型导入
 */
function addTypeImports(filePath: string, content: string): string {
  // 检查是否需要导入类型
  const needsJSONValue = content.includes('JSONValue') && !content.includes('from "@/types/global-unified"')
  const needsJSONObject = content.includes('JSONObject') && !content.includes('from "@/types/global-unified"')
  const needsMetadata = content.includes('Metadata') && !content.includes('from "@/types/global-unified"')
  const needsTypedObject = content.includes('TypedObject') && !content.includes('from "@/types/global-unified"')

  if (!needsJSONValue && !needsJSONObject && !needsMetadata && !needsTypedObject) {
    return content
  }

  // 构建导入语句
  const imports: string[] = []
  if (needsJSONValue) imports.push('JSONValue')
  if (needsJSONObject) imports.push('JSONObject')
  if (needsMetadata) imports.push('Metadata')
  if (needsTypedObject) imports.push('TypedObject')

  const importStatement = `import type { ${imports.join(', ')} } from '@/types/global-unified'\n`

  // 找到最后一个 import 语句，在其后插入
  const lines = content.split('\n')
  let lastImportIndex = -1

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('import ')) {
      lastImportIndex = i
    } else if (lines[i].trim().startsWith('export ') && lastImportIndex >= 0) {
      break
    }
  }

  if (lastImportIndex >= 0) {
    lines.splice(lastImportIndex + 1, 0, importStatement)
    return lines.join('\n')
  }

  // 如果没有 import，在文件开头添加
  return importStatement + content
}

/**
 * 处理单个文件
 */
function processFile(filePath: string): FixResult {
  try {
    const content = readFileSync(filePath, 'utf-8')
    const originalCount = countAnyOccurrences(content)

    if (originalCount === 0) {
      return {
        file: filePath,
        originalCount,
        fixedCount: 0,
        errors: []
      }
    }

    // 应用类型修复
    const { content: fixedContent, fixedCount } = applyTypeFixes(filePath, content)

    // 添加必要的导入
    const withImports = addTypeImports(filePath, fixedContent)

    // 写回文件
    writeFileSync(filePath, withImports, 'utf-8')

    return {
      file: filePath,
      originalCount,
      fixedCount,
      errors: []
    }
  } catch (error) {
    return {
      file: filePath,
      originalCount: 0,
      fixedCount: 0,
      errors: [String(error)]
    }
  }
}

/**
 * 创建备份
 */
function createBackup() {
  const { execSync } = require('child_process')

  try {
    execSync(`mkdir -p ${BACKUP_DIR}`)
    execSync(`git -C ${PROJECT_ROOT} add -A`)
    execSync(`git -C ${PROJECT_ROOT} commit -m "备份: 全局类型修复前 (自动生成)" || echo "No git changes to commit"`)
    console.log('✓ 已创建 Git 备份')
  } catch (error) {
    console.warn('⚠ Git 备份失败，继续处理...')
  }
}

// ============================================================================
// 主函数
// ============================================================================

async function main() {
  console.log('='.repeat(80))
  console.log('YYC³ 全局类型修复工具 - 消除所有 any 类型')
  console.log('='.repeat(80))
  console.log()

  // 1. 检查项目结构
  console.log('1️⃣  检查项目结构...')

  if (!existsSync(TYPES_FILE)) {
    console.error('❌ 错误: 全局类型定义文件不存在')
    console.log(`   请确保文件存在: ${TYPES_FILE}`)
    process.exit(1)
  }
  console.log(`✓ 找到全局类型定义文件: ${TYPES_FILE}`)
  console.log()

  // 2. 创建备份
  console.log('2️⃣  创建备份...')
  createBackup()
  console.log()

  // 3. 扫描所有 TypeScript 文件
  console.log('3️⃣  扫描 TypeScript 文件...')

  const files = await glob('**/*.{ts,tsx}', {
    cwd: PROJECT_ROOT,
    ignore: EXCLUDE_PATTERNS,
    absolute: false
  })

  console.log(`✓ 找到 ${files.length} 个 TypeScript 文件`)
  console.log()

  // 4. 分析 any 类型使用情况
  console.log('4️⃣  分析 any 类型使用情况...')

  let totalAnyCount = 0
  let filesWithAny = 0

  for (const file of files) {
    try {
      const content = readFileSync(join(PROJECT_ROOT, file), 'utf-8')
      const count = countAnyOccurrences(content)
      if (count > 0) {
        totalAnyCount += count
        filesWithAny++
      }
    } catch (error) {
      // 忽略无法读取的文件
    }
  }

  console.log(`✓ 发现 ${filesWithAny} 个文件包含 any 类型`)
  console.log(`✓ 共有 ${totalAnyCount} 处 any 使用`)
  console.log()

  // 5. 应用修复
  console.log('5️⃣  应用类型修复...')
  console.log()

  const summary: Summary = {
    totalFiles: files.length,
    totalFilesWithAny: filesWithAny,
    totalAnyCount,
    totalFixed: 0,
    results: []
  }

  let processedCount = 0
  const maxShow = 20 // 只显示前20个文件的详情

  for (const file of files) {
    const result = processFile(join(PROJECT_ROOT, file))

    if (result.fixedCount > 0 || result.errors.length > 0) {
      summary.results.push(result)
      summary.totalFixed += result.fixedCount

      if (processedCount < maxShow) {
        const status = result.errors.length > 0 ? '❌' : '✓'
        console.log(`${status} ${file}`)
        console.log(`   原始: ${result.originalCount} -> 修复后: ${result.fixedCount} 处理`)
        if (result.errors.length > 0) {
          console.log(`   错误: ${result.errors.join(', ')}`)
        }
        processedCount++
      }
    }
  }

  if (summary.results.length > maxShow) {
    console.log(`   ... 还有 ${summary.results.length - maxShow} 个文件`)
  }

  console.log()
  console.log('6️⃣  修复汇总')
  console.log('='.repeat(80))
  console.log(`总文件数:           ${summary.totalFiles}`)
  console.log(`包含 any 的文件:     ${summary.totalFilesWithAny}`)
  console.log(`原始 any 数量:      ${summary.totalAnyCount}`)
  console.log(`已修复数量:         ${summary.totalFixed}`)
  console.log(`剩余 any 数量:       ${summary.totalAnyCount - summary.totalFixed}`)
  console.log()

  // 7. 生成报告
  console.log('7️⃣  生成修复报告...')

  const reportPath = join(PROJECT_ROOT, 'TYPE_FIX_REPORT.md')
  const report = generateReport(summary)
  writeFileSync(reportPath, report, 'utf-8')
  console.log(`✓ 报告已生成: ${reportPath}`)
  console.log()

  // 8. 后续步骤
  console.log('8️⃣  后续步骤')
  console.log('='.repeat(80))
  console.log()
  console.log('📋 请按以下步骤完成修复:')
  console.log()
  console.log('1️⃣  检查修复结果:')
  console.log('   bunx tsc --noEmit')
  console.log()
  console.log('2️⃣ 如果仍有错误，查看报告:')
  console.log(`   cat ${reportPath}`)
  console.log()
  console.log('3️⃣ 手动修复复杂类型:')
  console.log('   - 某些 any 可能需要根据具体业务逻辑定义特定类型')
  console.log('   - 使用 @ts-ignore 或 @ts-expect-error 临时绕过(不推荐)')
  console.log()
  console.log('4️⃣ 运行测试确保功能正常:')
  console.log('   bun test')
  console.log()
  console.log('5️⃣ 提交修复:')
  console.log('   git add .')
  console.log('   git commit -m "fix: 全局类型修复 - 消除所有 any 类型"')
  console.log()

  if (summary.totalFixed < summary.totalAnyCount) {
    console.log('⚠️  注意: 仍有未修复的 any 类型')
    console.log('   可能需要手动处理或运行多次脚本')
  } else {
    console.log('✨ 所有 any 类型已成功修复!')
  }

  console.log()
  console.log('='.repeat(80))
  console.log('修复完成!')
  console.log('='.repeat(80))
}

/**
 * 生成修复报告
 */
function generateReport(summary: Summary): string {
  const timestamp = new Date().toISOString()

  let report = `# 全局类型修复报告\n\n`
  report += `**生成时间**: ${timestamp}\n`
  report += `**项目**: YYC³ AI小语智能成长守护系统\n\n`

  report += `## 修复摘要\n\n`
  report += `- **总文件数**: ${summary.totalFiles}\n`
  report += `- **包含 any 的文件**: ${summary.totalFilesWithAny}\n`
  report += `- **原始 any 数量**: ${summary.totalAnyCount}\n`
  report += `- **已修复数量**: ${summary.totalFixed}\n`
  report += `- **修复成功率**: ${((summary.totalFixed / summary.totalAnyCount) * 100).toFixed(2)}%\n\n`

  report += `## 已修复文件列表\n\n`

  for (const result of summary.results) {
    if (result.fixedCount > 0) {
      report += `### ${result.file}\n`
      report += `- 原始 any 数: ${result.originalCount}\n`
      report += `- 已修复数: ${result.fixedCount}\n`
      if (result.errors.length > 0) {
        report += `- 错误: ${result.errors.join(', ')}\n`
      }
      report += `\n`
    }
  }

  report += `## 类型映射说明\n\n`
  report += `本脚本使用以下映射规则将 any 替换为具体类型:\n\n`

  for (const rule of TYPE_REPLACEMENTS) {
    report += `- **${rule.description}**\n`
    report += `  - 模式: \`${rule.pattern.source}\`\n`
    report += `  - 优先级: ${rule.priority}\n\n`
  }

  report += `## 后续步骤\n\n`
  report += `1. 运行类型检查: \`bunx tsc --noEmit\`\n`
  report += `2. 查看详细错误报告\n`
  report += `3. 手动修复无法自动转换的类型\n`
  report += `4. 运行测试套件验证功能\n`
  report += `5. 提交修复到版本控制\n`

  return report
}

// 运行主函数
main().catch((error) => {
  console.error('❌ 修复过程出错:', error)
  process.exit(1)
})
