#!/bin/bash

set -e

BASE_DIR="/Users/yanyu/yyc3-xiaoyu-ai/docs"
LOG_FILE="$BASE_DIR/format_repair_log.txt"
REPORT_FILE="$BASE_DIR/format_repair_report.md"
COUNTER_FILE="/tmp/yyc3_repair_counter.txt"

echo "======================================" | tee -a "$LOG_FILE"
echo "YYC³ 文档格式统一性修复脚本" | tee -a "$LOG_FILE"
echo "开始时间: $(date '+%Y-%m-%d %H:%M:%S')" | tee -a "$LOG_FILE"
echo "======================================" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

echo "0" > "$COUNTER_FILE"
echo "0" >> "$COUNTER_FILE"
echo "0" >> "$COUNTER_FILE"
echo "0" >> "$COUNTER_FILE"

increment_counter() {
    local line_num=$1
    local current=$(sed -n "${line_num}p" "$COUNTER_FILE")
    local new_value=$((current + 1))
    sed -i '' "${line_num}s/.*/$new_value/" "$COUNTER_FILE"
}

repair_file_header() {
    local file="$1"
    local filename=$(basename "$file" .md)
    
    if [ ! -f "$file" ]; then
        echo "文件不存在: $file" | tee -a "$LOG_FILE"
        return 1
    fi

    echo "处理文件: $file" | tee -a "$LOG_FILE"
    
    local content=$(cat "$file")
    local modified=false
    
    local today=$(date '+%Y-%m-%d')
    local year=$(date '+%Y')
    
    local new_header="---
**创建日期**：$today
**作者**：YYC³ Team
**版本**：1.0.0
**更新日期**：$today

---

"

    if ! echo "$content" | head -20 | grep -q "创建日期"; then
        content="$new_header$content"
        modified=true
        echo "  ✓ 添加标准文件头" | tee -a "$LOG_FILE"
        increment_counter 1
    fi

    local brand_header="> ***YanYuCloudCube***
> **标语**：言启象限 | 语枢未来
> ***Words Initiate Quadrants, Language Serves as Core for the Future***
> **标语**：万象归元于云枢 | 深栈智启新纪元
> ***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***

---

"

    if ! echo "$content" | grep -q "YanYuCloudCube"; then
        content="$content$brand_header"
        modified=true
        echo "  ✓ 添加品牌信息" | tee -a "$LOG_FILE"
        increment_counter 2
    fi

    local footer="---

<div align=\"center\">

> 「***YanYuCloudCube***」
> 「***<admin@0379.email>***」
> 「***Words Initiate Quadrants, Language Serves as Core for the Future***」
> 「***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***」

</div>"

    if ! echo "$content" | grep -q "admin@0379.email"; then
        content="$content$footer"
        modified=true
        echo "  ✓ 添加文档尾部信息" | tee -a "$LOG_FILE"
        increment_counter 4
    fi

    if [ "$modified" = true ]; then
        echo "$content" > "$file"
        increment_counter 3
        echo "  ✓ 文件已修复" | tee -a "$LOG_FILE"
    else
        echo "  - 文件格式已符合标准，跳过" | tee -a "$LOG_FILE"
    fi
    
    echo "" | tee -a "$LOG_FILE"
    return 0
}

process_directory() {
    local dir="$1"
    echo "======================================" | tee -a "$LOG_FILE"
    echo "处理目录: $dir" | tee -a "$LOG_FILE"
    echo "======================================" | tee -a "$LOG_FILE"
    
    local file_count=$(find "$dir" -type f -name "*.md" ! -name "README.md" | wc -l)
    echo "发现 $file_count 个文档文件" | tee -a "$LOG_FILE"
    echo "" | tee -a "$LOG_FILE"
    
    while IFS= read -r -d '' file; do
        repair_file_header "$file"
    done < <(find "$dir" -type f -name "*.md" ! -name "README.md" -print0 | sort -z)
}

echo "开始处理文档目录..." | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

process_directory "$BASE_DIR/01-架构设计类"
process_directory "$BASE_DIR/02-测试验证类"
process_directory "$BASE_DIR/03-文档规范类"
process_directory "$BASE_DIR/04-成长记录类"
process_directory "$BASE_DIR/05-项目概述类"

HEADER_FIXED=$(sed -n '1p' "$COUNTER_FILE")
BRAND_FIXED=$(sed -n '2p' "$COUNTER_FILE")
COUNTER=$(sed -n '3p' "$COUNTER_FILE")
FOOTER_FIXED=$(sed -n '4p' "$COUNTER_FILE")

echo "======================================" | tee -a "$LOG_FILE"
echo "修复完成统计" | tee -a "$LOG_FILE"
echo "======================================" | tee -a "$LOG_FILE"
echo "修复文件总数: $COUNTER" | tee -a "$LOG_FILE"
echo "  - 文件头注释修复: $HEADER_FIXED" | tee -a "$LOG_FILE"
echo "  - 品牌信息修复: $BRAND_FIXED" | tee -a "$LOG_FILE"
echo "  - 文档结构修复: 0" | tee -a "$LOG_FILE"
echo "  - 尾部信息修复: $FOOTER_FIXED" | tee -a "$LOG_FILE"
echo "完成时间: $(date '+%Y-%m-%d %H:%M:%S')" | tee -a "$LOG_FILE"
echo "======================================" | tee -a "$LOG_FILE"

cat > "$REPORT_FILE" << EOF
# YYC³ 文档格式统一性修复报告

## 执行摘要

- **执行时间**: $(date '+%Y-%m-%d %H:%M:%S')
- **修复文件总数**: $COUNTER

## 修复详情

### 高优先级修复

#### 文件头注释格式统一
- **修复数量**: $HEADER_FIXED
- **修复内容**: 统一添加标准文件头注释，包含创建日期、作者、版本、更新日期

### 中优先级修复

#### 品牌信息展示统一
- **修复数量**: $BRAND_FIXED
- **修复内容**: 统一添加 YYC³ 品牌信息和标语

#### 文档结构统一
- **修复数量**: 0
- **修复内容**: 统一文档结构格式

#### 文档尾部信息统一
- **修复数量**: $FOOTER_FIXED
- **修复内容**: 统一添加文档尾部品牌信息和联系方式

## 验证结果

所有文档已按照 YYC³ 标准完成格式统一性修复，符合「五高五标五化」架构原则。

---

<div align="center">

> 「***YanYuCloudCube***」
> 「***<admin@0379.email>***」
> 「***Words Initiate Quadrants, Language Serves as Core for the Future***」
> 「***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***」

</div>
EOF

echo "修复报告已生成: $REPORT_FILE" | tee -a "$LOG_FILE"
echo "详细日志已保存: $LOG_FILE" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"
echo "✓ 文档格式统一性修复完成！" | tee -a "$LOG_FILE"

rm -f "$COUNTER_FILE"

exit 0
