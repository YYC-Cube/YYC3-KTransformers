/**
 * TypeScript 错误智能修复脚本
 * 用于批量修复常见的 TypeScript strict mode 错误
 *
 * 使用方法:
 * bun run scripts/smart-fix-typescript.ts
 */

import { readFileSync, writeFileSync } from 'fs'
import { glob } from 'glob'

interface FixPattern {
  test: RegExp
  replace: string
  description: string
}

// 修复模式定义
const FIX_PATTERNS: FixPattern[] = [
  // 1. 未使用的参数 - 添加下划线前缀
  {
    test: /(\s+)(\w+): (\w+)(\[?\]?(?:\|\w+)?)(\s*[,)])/g,
    replace: '$1_$2: $3$4$5',
    description: '未使用的参数添加下划线前缀'
  },

  // 2. 未使用的导入 - 删除行（需要手动处理）
  {
    test: /import.*?(\w+),?\s*from.*?(?=\n)/g,
    replace: '',
    description: '未使用的导入（需手动验证）'
  }
]

// 需要特殊处理的文件
const SPECIAL_FILES = {
  'services/prediction/index.ts': [
    {
      line: 27,
      fix: "private _ensembleEngine: EnsembleEngine",
      reason: 'ensembleEngine 未使用'
    },
    {
      line: 188,
      fix: "const { ensemble: _ensemble } = taskInfo",
      reason: 'ensemble 未使用'
    }
  ],
  'services/prediction/model-selector.ts': [
    {
      line: 240,
      fix: "constraints: _constraints",
      reason: 'constraints 参数未使用'
    },
    {
      line: 273,
      fix: "task: _task",
      reason: 'task 参数未使用'
    },
    {
      line: 485,
      fix: "data: _data",
      reason: 'data 参数未使用'
    }
  ],
  'services/prediction/quality-monitor.ts': [
    {
      line: 304,
      fix: "predictions: _predictions",
      reason: 'predictions 参数未使用'
    },
    {
      line: 305,
      fix: "sensitiveAttributes: _sensitiveAttributes",
      reason: 'sensitiveAttributes 参数未使用'
    },
    {
      line: 356,
      fix: "equalOpportunity: _equalOpportunity",
      reason: 'equalOpportunity 参数未使用'
    },
    {
      line: 408,
      fix: "predictions: _predictions",
      reason: 'predictions 参数未使用'
    },
    {
      line: 418,
      fix: "originalMetrics: _originalMetrics",
      reason: 'originalMetrics 参数未使用'
    }
  ]
}

/**
 * 应用修复到文件
 */
function applyFixesToFile(filePath: string, content: string): string {
  let modified = content

  // 应用通用修复模式
  for (const pattern of FIX_PATTERNS) {
    if (pattern.test.test(modified)) {
      modified = modified.replace(pattern.test, pattern.replace)
      console.log(`  ✓ 应用: ${pattern.description}`)
    }
  }

  return modified
}

/**
 * 检查并修复特定文件的特定行
 */
function fixSpecificLines(filePath: string, content: string): string {
  const lines = content.split('\n')
  const relativePath = filePath.replace(process.cwd(), '')

  // 检查是否是需要特殊处理的文件
  const fixes = SPECIAL_FILES[relativePath]
  if (!fixes) return content

  for (const fix of fixes) {
    if (lines[fix.line - 1]) {
      const oldLine = lines[fix.line - 1]
      // 简单的替换（实际应用中需要更复杂的逻辑）
      lines[fix.line - 1] = lines[fix.line - 1].replace(
        new RegExp(fix.fix.split(':')[0] + '.*'),
        fix.fix
      )
      console.log(`  ✓ 第${fix.line}行: ${fix.reason}`)
    }
  }

  return lines.join('\n')
}

/**
 * 主函数
 */
async function main() {
  console.log('=== TypeScript 错误智能修复工具 ===\n')

  // 查找所有 TypeScript 文件
  const files = await glob('**/*.{ts,tsx}', {
    cwd: process.cwd(),
    ignore: ['node_modules/**', 'dist/**', '.next/**', 'build/**']
  })

  console.log(`找到 ${files.length} 个文件\n`)

  let fixedCount = 0

  for (const file of files) {
    try {
      const content = readFileSync(file, 'utf-8')
      let modified = content

      // 应用修复
      modified = applyFixesToFile(file, modified)
      modified = fixSpecificLines(file, modified)

      // 如果有修改，写回文件
      if (modified !== content) {
        writeFileSync(file, modified, 'utf-8')
        fixedCount++
        console.log(`✓ 已修复: ${file}\n`)
      }
    } catch (error) {
      console.error(`✗ 处理失败: ${file}`)
      console.error(`  错误: ${error}\n`)
    }
  }

  console.log(`\n=== 修复完成 ===`)
  console.log(`共修复 ${fixedCount} 个文件`)
  console.log(`\n注意: 请运行类型检查验证修复结果:`)
  console.log(`  bunx tsc --noEmit`)
}

// 运行主函数
main().catch(console.error)
