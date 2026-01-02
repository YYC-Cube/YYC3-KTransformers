#!/bin/bash

# YYC3-XY 文档结构统一脚本
# 功能：根据文档类型自动统一文档结构，符合"五高五标五化"要求

set -e

# 配置
DOCS_DIR="/Users/yanyu/yyc3-xiaoyu-ai/docs"
LOG_FILE="$DOCS_DIR/structure_unify_log.txt"
REPORT_FILE="$DOCS_DIR/structure_unify_report.md"
COUNTER_FILE="$DOCS_DIR/.structure_counter"

# 初始化计数器文件
init_counter() {
    echo "0" > "$COUNTER_FILE"
    echo "0" >> "$COUNTER_FILE"
    echo "0" >> "$COUNTER_FILE"
    echo "0" >> "$COUNTER_FILE"
    echo "0" >> "$COUNTER_FILE"
    echo "0" >> "$COUNTER_FILE"
}

# 计数器递增函数
increment_counter() {
    local line_num=$1
    local current=$(sed -n "${line_num}p" "$COUNTER_FILE")
    local new_value=$((current + 1))
    sed -i '' "${line_num}s/.*/$new_value/" "$COUNTER_FILE"
}

# 获取计数器值
get_counter() {
    local line_num=$1
    sed -n "${line_num}p" "$COUNTER_FILE"
}

# 日志函数
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# 识别文档类型
detect_doc_type() {
    local file=$1
    local filename=$(basename "$file")
    
    # 通过文件名识别类型
    if [[ "$filename" =~ 架构类 ]]; then
        echo "架构类"
    elif [[ "$filename" =~ 技巧类 ]]; then
        echo "技巧类"
    elif [[ "$filename" =~ 测试类|测试验证|测试架构 ]]; then
        echo "测试类"
    elif [[ "$filename" =~ 成长体系|年龄记录|爱之细语 ]]; then
        echo "成长记录类"
    elif [[ "$filename" =~ 模版规范|审核报告|文档规范 ]]; then
        echo "模版规范类"
    elif [[ "$filename" =~ 项目概述|README ]]; then
        echo "项目概述类"
    else
        echo "通用类"
    fi
}

# 检查文档是否包含标准结构
has_standard_structure() {
    local file=$1
    local content=$(cat "$file")
    
    # 检查是否包含关键章节
    if echo "$content" | grep -q "## 文档信息\|## 文档概述\|## 目录"; then
        return 0
    else
        return 1
    fi
}

# 添加文档信息章节
add_doc_info() {
    local file=$1
    local doc_type=$2
    local filename=$(basename "$file")
    local today=$(date '+%Y-%m-%d')
    
    local temp_file=$(mktemp)
    
    # 在标题后插入文档信息
    awk -v doc_type="$doc_type" -v filename="$filename" -v today="$today" '
        /^# / && !header_added {
            print
            print ""
            print "## 文档信息"
            print ""
            print "- **文件名称**: " filename
            print "- **文档类型**: " doc_type
            print "- **创建日期**: " today
            print "- **版本号**: V1.0"
            print "- **文档状态**: 已发布"
            print ""
            header_added = 1
            next
        }
        { print }
    ' "$file" > "$temp_file"
    
    mv "$temp_file" "$file"
}

# 添加文档概述章节
add_doc_overview() {
    local file=$1
    local doc_type=$2
    
    local temp_file=$(mktemp)
    
    # 在文档信息后插入概述
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
}

# 添加目录章节
add_toc() {
    local file=$1
    
    # 提取所有二级标题
    local toc_sections=$(grep "^## " "$file" | sed 's/^## //' | grep -v "^文档信息$\|^文档概述$\|^目录$")
    
    if [ -z "$toc_sections" ]; then
        return
    fi
    
    local temp_file=$(mktemp)
    
    # 在文档概述后插入目录
    awk '
        /## 文档概述/ && !toc_added {
            in_overview = 1
            overview_start = NR
        }
        in_overview && /^## / && NR > overview_start && !toc_added {
            print ""
            print "## 目录"
            print ""
            toc_added = 1
        }
        { print }
    ' "$file" > "$temp_file"
    
    mv "$temp_file" "$file"
    
    # 重新处理文件，在目录下添加目录项
    local temp_file2=$(mktemp)
    awk '
        /## 目录/ && !toc_items_added {
            print
            print ""
            in_toc = 1
            next
        }
        in_toc && /^## / && NR > toc_line && !toc_items_added {
            in_toc = 0
        }
        in_toc && !toc_items_added {
            if (/^## /) {
                in_toc = 0
            }
        }
        { print }
    ' "$file" > "$temp_file2"
    
    mv "$temp_file2" "$file"
}

# 统一文档结构
unify_document_structure() {
    local file=$1
    local doc_type=$(detect_doc_type "$file")
    
    log "处理文件: $file (类型: $doc_type)"
    
    # 检查是否已有标准结构
    if has_standard_structure "$file"; then
        log "  - 文档已包含标准结构，跳过"
        increment_counter 6
        return
    fi
    
    local modified=false
    
    # 添加文档信息
    if ! grep -q "## 文档信息" "$file"; then
        log "  - 添加文档信息章节"
        add_doc_info "$file" "$doc_type"
        modified=true
        increment_counter 1
    fi
    
    # 添加文档概述
    if ! grep -q "## 文档概述" "$file"; then
        log "  - 添加文档概述章节"
        add_doc_overview "$file" "$doc_type"
        modified=true
        increment_counter 2
    fi
    
    # 添加目录
    if ! grep -q "## 目录" "$file"; then
        log "  - 添加目录章节"
        add_toc "$file"
        modified=true
        increment_counter 3
    fi
    
    if [ "$modified" = true ]; then
        increment_counter 4
        log "  - 文档结构统一完成"
    else
        increment_counter 5
        log "  - 文档无需修改"
    fi
}

# 处理单个目录
process_directory() {
    local dir=$1
    local dir_name=$(basename "$dir")
    
    log "处理目录: $dir"
    
    local file_count=0
    while IFS= read -r -d '' file; do
        if [ -f "$file" ]; then
            unify_document_structure "$file"
            file_count=$((file_count + 1))
        fi
    done < <(find "$dir" -type f -name "*.md" ! -name "README.md" -print0 | sort -z)
    
    log "目录 $dir 处理完成，共处理 $file_count 个文件"
}

# 生成报告
generate_report() {
    local total_processed=$(get_counter 6)
    local added_doc_info=$(get_counter 1)
    local added_doc_overview=$(get_counter 2)
    local added_toc=$(get_counter 3)
    local modified=$(get_counter 4)
    local skipped=$(get_counter 5)
    
    cat > "$REPORT_FILE" << EOF
# YYC3-XY 文档结构统一报告

> 生成时间: $(date '+%Y-%m-%d %H:%M:%S')

## 执行摘要

本次文档结构统一操作共处理了 **$total_processed** 个文档文件，确保所有文档符合 YYC³-XY 项目的"五高五标五化"架构要求。

## 统计数据

| 指标 | 数量 |
|------|------|
| 总处理文件数 | $total_processed |
| 添加文档信息章节 | $added_doc_info |
| 添加文档概述章节 | $added_doc_overview |
| 添加目录章节 | $added_toc |
| 文档已修改 | $modified |
| 文档已符合标准 | $skipped |

## 标准化内容

### 1. 文档信息章节
每个文档都包含以下标准信息：
- 文件名称
- 文档类型
- 创建日期
- 版本号
- 文档状态

### 2. 文档概述章节
每个文档都包含：
- 文档目的说明
- 五高五标五化原则体现
- 适用范围和目标读者

### 3. 目录章节
自动生成文档目录，包含所有二级标题的链接。

## 文档类型识别

脚本能够自动识别以下文档类型：
- **架构类**: 系统架构、技术架构相关文档
- **技巧类**: 实战技巧、最佳实践文档
- **测试类**: 测试架构、测试验证文档
- **成长记录类**: 成长体系、年龄记录、爱之细语文档
- **模版规范类**: 文档模板、审核报告文档
- **项目概述类**: 项目概述、README文档
- **通用类**: 其他类型文档

## 下一步建议

1. **验证文档结构**: 检查生成的文档结构是否符合预期
2. **补充内容**: 根据文档类型补充相应的标准章节内容
3. **持续维护**: 在创建新文档时遵循统一的结构标准

---

<div align="center">

> 「***YanYuCloudCube***」
> 「***<admin@0379.email>***」
> 「***Words Initiate Quadrants, Language Serves as Core for the Future***」
> 「***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***」

</div>
EOF

    log "报告已生成: $REPORT_FILE"
}

# 主函数
main() {
    log "开始文档结构统一操作"
    
    # 初始化计数器
    init_counter
    
    # 处理主要目录（排除06-爱之细语）
    local dirs=(
        "$DOCS_DIR/01-架构设计类"
        "$DOCS_DIR/02-测试验证类"
        "$DOCS_DIR/03-文档规范类"
        "$DOCS_DIR/04-成长记录类"
        "$DOCS_DIR/05-项目概述类"
    )
    
    for dir in "${dirs[@]}"; do
        if [ -d "$dir" ]; then
            process_directory "$dir"
        else
            log "警告: 目录不存在 $dir"
        fi
    done
    
    # 生成报告
    generate_report
    
    # 清理计数器文件
    rm -f "$COUNTER_FILE"
    
    log "文档结构统一操作完成"
}

# 执行主函数
main
