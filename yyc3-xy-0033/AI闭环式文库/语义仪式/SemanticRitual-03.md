# YanYu Cloud Cube SemanticRitual  API 接口文档

> ***YanYuCloudCube***
> **标语**：言启象限 | 语枢未来
> ***Words Initiate Quadrants, Language Serves as Core for the Future***
> **标语**：万象归元于云枢 | 深栈智启新纪元
> ***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***

---

## 🧠 每个模块的 API 接口文档（函数签名 + 参数说明）

### 1. ExpressionSynthesizer.ts

ts

```plaintext
/**
 * 生成表达内容
 * @param tag 哲学标签，如 '克制'
 * @returns 表达句式，如 '表达是结构中的温度'
 */
function generate(tag: string): string

/**
 * 表达评分
 * @param expression 表达文本
 * @returns 评分对象，包含结构性、情感性、哲学性
 */
function score(expression: string): {
  structure: number
  emotion: number
  philosophy: number
}
```

### 2. PhilosophyMappingTable.ts

ts

```plaintext
/**
 * 获取标签对应的动效结构
 * @param tag 哲学标签
 * @returns 动效 DSL 数组，如 ['fadeIn', 'float']
 */
function getMotion(tag: string): string[]

/**
 * 获取标签对应的品牌色
 * @param tag 哲学标签
 * @returns 色彩值，如 '#F5CBA7'
 */
function getColor(tag: string): string
```

### 3. TeamEvolutionMotionDSL.ts

ts

```plaintext
/**
 * 添加演化帧
 * @param frame 成员演化帧对象
 */
function addFrame(frame: EvolutionMotionFrame): void

/**
 * 导出为 SVG 图谱
 * @returns SVG 字符串
 */
function exportToSvg(): string
```

### 4. CulturePipeline.ts

ts

```plaintext
/**
 * 一键发布表达 → 镜像 → 启动页 → 官网 → 年鉴
 * @param expression 表达文本
 */
function publish(expression: string): void
```

### 5. AlmanacVisualExporter.ts

ts

```plaintext
/**
 * 生成 `.mdx` 年鉴章节
 * @returns `.mdx` 字符串
 */
function generateMdx(): string

/**
 * 导出为 PDF
 * @returns PDF Buffer
 */
function exportToPdf(): Buffer

/**
 * 导出为 SVG
 * @returns SVG 字符串
 */
function exportToSvg(): string
```

---

> 「***YanYuCloudCube***」
> 「***<admin@0379.email>***」
> 「***Words Initiate Quadrants, Language Serves as Core for the Future***」
> 「***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***」
