#!/bin/bash

set -e

echo "开始为测试验证类文档添加文档概述章节..."

COUNTER_FILE=$(mktemp)
echo "0" > "$COUNTER_FILE"

increment_counter() {
    local line_num=$1
    local current=$(sed -n "${line_num}p" "$COUNTER_FILE")
    local new_value=$((current + 1))
    sed -i '' "${line_num}s/.*/$new_value/" "$COUNTER_FILE"
}

add_doc_overview() {
    local file=$1
    local filename=$(basename "$file")
    local doc_type=$(echo "$filename" | sed 's/YYC3-XY-[^-]*-//' | sed 's/\.md$//' | sed 's/-.*//')
    
    if ! grep -q "## 文档概述" "$file"; then
        local temp_file=$(mktemp)
        
        awk -v doc_type="$doc_type" '
            /## 文档信息/ && !overview_added {
                in_doc_info = 1
                doc_info_start = NR
            }
            in_doc_info && /^## / && NR > doc_info_start && !overview_added {
                print ""
                print "## 文档概述"
                print ""
                print "本文档遵循 YYC³-XY 项目\"五高五标五化\"架构原则，提供" doc_type "相关的详细说明和指导。"
                print ""
                print "### 五高五标五化原则体现"
                print ""
                print "**五高原则：**"
                print "- **高可用性** - 确保系统稳定可靠运行"
                print "- **高性能** - 优化系统响应速度和吞吐量"
                print "- **高安全** - 保障数据和系统安全"
                print "- **高扩展** - 支持系统水平扩展"
                print "- **高可维护** - 提高代码和系统可维护性"
                print ""
                print "**五标体系：**"
                print "- **数据标准化** - 统一数据格式和接口标准"
                print "- **流程标准化** - 建立标准化工作流程"
                print "- **文档标准化** - 遵循统一的文档规范"
                print "- **测试标准化** - 实施标准化测试流程"
                print "- **部署标准化** - 采用标准化部署方案"
                print ""
                print "**五化架构：**"
                print "- **流程化** - 将工作转化为可执行流程"
                print "- **文档化** - 完整记录技术方案和实施细节"
                print "- **工具化** - 提供自动化工具支持"
                print "- **数字化** - 基于数据进行决策"
                print "- **生态化** - 构建完整的技术生态"
                print ""
                overview_added = 1
            }
            { print }
        ' "$file" > "$temp_file"
        
        mv "$temp_file" "$file"
        echo "✓ 已添加文档概述: $filename"
        increment_counter 1
    else
        echo "○ 已有文档概述，跳过: $filename"
    fi
}

process_directory() {
    local dir=$1
    if [ -d "$dir" ]; then
        echo "处理目录: $dir"
        while IFS= read -r -d '' file; do
            add_doc_overview "$file"
        done < <(find "$dir" -type f -name "YYC3-XY-*.md" ! -name "README.md" -print0 | sort -z)
    fi
}

directories=(
    "/Users/yanyu/yyc3-xiaoyu-ai/docs/02-测试验证类"
)

for dir in "${directories[@]}"; do
    process_directory "$dir"
done

total=$(sed -n '1p' "$COUNTER_FILE")
echo ""
echo "=========================================="
echo "文档概述添加完成！"
echo "总计添加文档数: $total"
echo "=========================================="

rm "$COUNTER_FILE"
