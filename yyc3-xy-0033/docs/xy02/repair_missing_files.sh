#!/bin/bash

COUNTER_FILE="/tmp/repair_counter_$(date +%s).txt"
echo "0" > "$COUNTER_FILE"

increment_counter() {
    local line_num=$1
    local current=$(sed -n "${line_num}p" "$COUNTER_FILE")
    local new_value=$((current + 1))
    sed -i '' "${line_num}s/.*/$new_value/" "$COUNTER_FILE"
}

get_counter() {
    sed -n '1p' "$COUNTER_FILE"
}

repair_file_header() {
    local file=$1
    local filename=$(basename "$file")
    local today=$(date '+%Y-%m-%d')
    
    local doc_type="文档"
    if [[ "$file" == *"架构类"* ]]; then
        doc_type="架构类"
    elif [[ "$file" == *"技巧类"* ]]; then
        doc_type="技巧类"
    elif [[ "$file" == *"成长体系"* ]]; then
        doc_type="成长记录类"
    elif [[ "$file" == *"爱之细语类"* ]]; then
        doc_type="成长记录类"
    elif [[ "$file" == *"模版规范类"* ]]; then
        doc_type="模版规范类"
    elif [[ "$file" == *"审核报告类"* ]]; then
        doc_type="审核报告类"
    elif [[ "$file" == *"项目介绍"* ]]; then
        doc_type="项目概述类"
    elif [[ "$file" == *"优化报告"* ]]; then
        doc_type="优化报告类"
    elif [[ "$file" == *"审核报告"* ]]; then
        doc_type="审核报告类"
    elif [[ "$file" == *"年龄记录"* ]]; then
        doc_type="成长记录类"
    fi
    
    local temp_file=$(mktemp)
    
    awk -v doc_type="$doc_type" -v filename="$filename" -v today="$today" '
        BEGIN { header_added = 0; overview_added = 0; toc_added = 0; in_doc_info = 0; doc_info_start = 0 }
        
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
    
    increment_counter 1
    echo "✓ 已修复: $filename"
}

main() {
    echo "开始修复遗漏的文档结构..."
    echo ""
    
    local files=(
        "01-架构设计类/04-开发实施类/YYC3-XY-技巧类-开发效率提升技巧集.md"
        "01-架构设计类/01-架构类/YYC3-XY-架构类-监控架构设计文档.md"
        "01-架构设计类/01-架构类/YYC3-XY-架构类-前端架构设计文档.md"
        "01-架构设计类/01-架构类/YYC3-XY-架构类-部署架构设计文档.md"
        "01-架构设计类/01-架构类/YYC3-XY-架构类-小语AI应用UI-UX全量设计规划文档.md"
        "01-架构设计类/01-架构类/YYC3-XY-架构类-安全架构设计文档.md"
        "01-架构设计类/01-架构类/YYC3-XY-架构类-Figma-UI-UX重构设计使用说明.md"
        "01-架构设计类/02-技巧类/YYC3-XY-技巧类-安全加固实施手册.md"
        "04-成长记录类/03-爱之细语/YYC3-XY-爱之细语类-四岁童趣时代寄语.md"
        "04-成长记录类/03-爱之细语/YYC3-XY-爱之细语类-两岁学步时代寄语.md"
        "04-成长记录类/03-爱之细语/YYC3-XY-爱之细语类-一岁萌芽时代寄语.md"
        "04-成长记录类/03-爱之细语/YYC3-XY-爱之细语类-三岁入园时代寄语.md"
        "04-成长记录类/03-爱之细语/YYC3-XY-爱之细语类-五岁探索时代寄语.md"
        "04-成长记录类/03-爱之细语/YYC3-XY-爱之细语类-六岁衔接时代寄语.md"
    )
    
    for file in "${files[@]}"; do
        if [ -f "$file" ]; then
            repair_file_header "$file"
        else
            echo "✗ 文件不存在: $file"
        fi
    done
    
    echo ""
    local count=$(get_counter)
    echo "修复完成！共修复 $count 个文件。"
    
    rm -f "$COUNTER_FILE"
}

main
