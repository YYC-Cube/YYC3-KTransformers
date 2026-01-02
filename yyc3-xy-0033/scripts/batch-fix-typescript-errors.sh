#!/bin/bash

# TypeScript 批量错误修复脚本
# 用于处理 yyc3-xy-0033 项目中的常见 TypeScript strict mode 错误

PROJECT_DIR="/Users/yanyu/yyc3-xy-0033"
BACKUP_DIR="/tmp/yyc3-typescript-fix-backup-$(date +%s)"

echo "=== TypeScript 批量错误修复脚本 ==="
echo "项目目录: $PROJECT_DIR"
echo "备份目录: $BACKUP_DIR"
echo ""

# 创建备份目录
mkdir -p "$BACKUP_DIR"

# 函数: 备份文件
backup_file() {
    local file=$1
    local relative_path=${file#$PROJECT_DIR/}
    mkdir -p "$BACKUP_DIR/$(dirname "$relative_path")"
    cp "$file" "$BACKUP_DIR/$relative_path"
    echo "  已备份: $relative_path"
}

# 函数: 修复未使用的变量声明
fix_unused_declarations() {
    echo "1. 修复未使用的变量/参数..."

    # 查找所有包含 TS6133 或 TS6196 错误的文件
    # 注意: 这需要实际的 tsc 输出来处理，这里只是一个框架

    # 示例: 修复 services/prediction/model-selector.ts
    local file="$PROJECT_DIR/services/prediction/model-selector.ts"
    if [ -f "$file" ]; then
        backup_file "$file"

        # 修复 ensemble 变量 (第188行)
        sed -i '' 's/const { ensemble } = taskInfo/const { ensemble: _ensemble } = taskInfo/' "$file"

        # 修复 metrics 参数 (第481行)
        sed -i '' 's/metrics: any/metrics: _metrics/' "$file"

        # 修复 constraints 参数 (第240行)
        sed -i '' 's/constraints: ModelConstraints/constraints: _constraints/' "$file"

        # 修复 task 参数 (第273行)
        sed -i '' 's/task: PredictionTask/task: _task/' "$file"

        # 修复 data 参数 (第485行)
        sed -i '' 's/data: PredictionData/data: _data/' "$file"

        echo "  ✓ 已修复 model-selector.ts"
    fi

    # 修复 services/prediction/index.ts
    local file="$PROJECT_DIR/services/prediction/index.ts"
    if [ -f "$file" ]; then
        backup_file "$file"

        # 修复 ModelConstraints 未使用导入
        sed -i '' '/ModelConstraints,/d' "$file"

        # 修复 ensembleEngine 未使用变量
        sed -i '' 's/private ensembleEngine: EnsembleEngine/private ensembleEngine?: EnsembleEngine/' "$file"

        # 修复 ensemble 未使用变量
        sed -i '' 's/const { ensemble } = taskInfo/const { ensemble: _ensemble } = taskInfo/' "$file"

        echo "  ✓ 已修复 prediction/index.ts"
    fi

    # 修复 services/prediction/quality-monitor.ts
    local file="$PROJECT_DIR/services/prediction/quality-monitor.ts"
    if [ -f "$file" ]; then
        backup_file "$file"

        # 修复 metrics 参数 (第481行)
        sed -i '' 's/metrics: any/metrics: _metrics/' "$file"

        # 修复 predictions 参数 (第304行)
        sed -i '' 's/predictions: PredictionResult\[\],/predictions: _PredictionResult[],/' "$file"

        # 修复 sensitiveAttributes 参数 (第305行)
        sed -i '' 's/sensitiveAttributes: SensitiveData/sensitiveAttributes: _SensitiveData/' "$file"

        # 修复 equalOpportunity 参数 (第356行)
        sed -i '' 's/equalOpportunity: number/equalOpportunity: _equalOpportunity/' "$file"

        # 修复 predictions 参数 (第408行)
        sed -i '' 's/predictions: PredictionResult\[\],/predictions: _PredictionResult[],/' "$file"

        # 修复 originalMetrics 参数 (第418行)
        sed -i '' 's/originalMetrics: any/originalMetrics: _originalMetrics/' "$file"

        echo "  ✓ 已修复 quality-monitor.ts"
    fi

    # 修复 services/tools/ToolManager.ts
    local file="$PROJECT_DIR/services/tools/ToolManager.ts"
    if [ -f "$file" ]; then
        backup_file "$file"

        # 修复 ToolOrchestrationPlan 未使用导入
        sed -i '' '/ToolOrchestrationPlan,/d' "$file"

        # 修复 context 参数 (第565行)
        sed -i '' 's/context\?: Record<string, any>/context?: _context/' "$file"

        echo "  ✓ 已修复 ToolManager.ts"
    fi

    # 修复 services/tools/ToolOrchestrator.ts
    local file="$PROJECT_DIR/services/tools/ToolOrchestrator.ts"
    if [ -f "$file" ]; then
        backup_file "$file"

        # 修复 ToolOrchestrationRequest 未使用导入
        sed -i '' '/ToolOrchestrationRequest,/d' "$file"

        # 修复 sessionId 参数 (第43行)
        sed -i '' 's/sessionId\?: string/sessionId?: _sessionId/' "$file"

        echo "  ✓ 已修复 ToolOrchestrator.ts"
    fi

    # 修复 services/tools/ToolRegistry.ts
    local file="$PROJECT_DIR/services/tools/ToolRegistry.ts"
    if [ -f "$file" ]; then
        backup_file "$file"

        # 修复 createHash 未使用导入
        sed -i '' "/import { createHash } from 'crypto'/d" "$file"

        # 修复 ToolCapability 未使用导入
        sed -i '' '/ToolCapability,/d' "$file"

        # 修复 isInitialized 未使用变量
        sed -i '' 's/private isInitialized = false/private _isInitialized = false/' "$file"

        # 修复 query 参数 (第469行)
        sed -i '' 's/query: string/query: _query/' "$file"

        # 修复 goal 参数 (第519行)
        sed -i '' 's/goal: string,/goal: _goal,/' "$file"

        # 修复 tool 参数 (第571行)
        sed -i '' 's/tool: ToolDefinition/tool: _ToolDefinition/' "$file"

        echo "  ✓ 已修复 ToolRegistry.ts"
    fi
}

# 函数: 修复数组访问问题
fix_array_access() {
    echo "2. 修复数组访问可能为 undefined 的问题..."

    # 修复 services/prediction/index.ts 第222行
    local file="$PROJECT_DIR/services/prediction/index.ts"
    if [ -f "$file" ]; then
        backup_file "$file"
        # 使用 filter 移除 undefined 值
        # 这需要手动处理，因为涉及复杂逻辑
        echo "  ⚠ 需要手动修复: prediction/index.ts:222 (数组访问)"
    fi

    # 修复 services/prediction/quality-monitor.ts 中的数组访问
    # 这些需要过滤 undefined 值
    local file="$PROJECT_DIR/services/prediction/quality-monitor.ts"
    if [ -f "$file" ]; then
        backup_file "$file"
        echo "  ⚠ 需要手动修复: quality-monitor.ts (多处数组访问)"
    fi
}

# 函数: 修复索引签名访问
fix_index_signature_access() {
    echo "3. 修复索引签名访问错误..."

    local file="$PROJECT_DIR/services/prediction/model-selector.ts"
    if [ -f "$file" ]; then
        backup_file "$file"

        # 第254行: 使用括号表示法访问索引签名
        sed -i '' 's/assessment\.stabilityMetrics\.sensitivity\.complexity/assessment.stabilityMetrics.sensitivity['\''complexity'\'']/g' "$file"

        echo "  ✓ 已修复索引签名访问"
    fi
}

# 函数: 修复 PredictionTask 缺少 name 属性
fix_prediction_task() {
    echo "4. 修复 PredictionTask 缺少 name 属性..."

    local file="$PROJECT_DIR/services/prediction/index.ts"
    if [ -f "$file" ]; then
        backup_file "$file"

        # 第65行: 添加 name 属性
        # 这需要手动修复
        echo "  ⚠ 需要手动修复: prediction/index.ts:65 (添加 name 属性)"
    fi
}

# 函数: 修复 dataFeatures 访问
fix_data_features_access() {
    echo "5. 修复 data.features 访问..."

    local file="$PROJECT_DIR/services/prediction/model-selector.ts"
    if [ -f "$file" ]; then
        backup_file "$file"

        # 第409行: 添加空值检查
        # 这需要手动修复
        echo "  ⚠ 需要手动修复: model-selector.ts:409 (data.features 访问)"
    fi
}

# 主执行流程
main() {
    echo "开始修复..."
    echo ""

    fix_unused_declarations
    echo ""

    fix_array_access
    echo ""

    fix_index_signature_access
    echo ""

    fix_prediction_task
    echo ""

    fix_data_features_access
    echo ""

    echo "=== 修复完成 ==="
    echo ""
    echo "备份保存在: $BACKUP_DIR"
    echo ""
    echo "下一步: 运行类型检查以验证修复"
    echo "  cd $PROJECT_DIR"
    echo "  bunx tsc --noEmit"
}

# 运行主函数
main
