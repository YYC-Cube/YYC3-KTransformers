#!/bin/bash

set -e

echo "开始修复架构类文档标题格式..."

COUNTER_FILE=$(mktemp)
echo "0" > "$COUNTER_FILE"

increment_counter() {
    local line_num=$1
    local current=$(sed -n "${line_num}p" "$COUNTER_FILE")
    local new_value=$((current + 1))
    sed -i '' "${line_num}s/.*/$new_value/" "$COUNTER_FILE"
}

add_title_to_file() {
    local file=$1
    local filename=$(basename "$file")
    local title=$(echo "$filename" | sed 's/YYC3-XY-架构类-//' | sed 's/\.md$//')
    
    if ! grep -q "^# " "$file"; then
        local temp_file=$(mktemp)
        
        awk -v title="$title" '
            BEGIN { title_added = 0 }
            /^---$/ && !title_added && NR > 1 {
                print "# " title
                print ""
                title_added = 1
            }
            { print }
        ' "$file" > "$temp_file"
        
        mv "$temp_file" "$file"
        echo "✓ 已添加标题: $title"
        increment_counter 1
    else
        echo "○ 已有标题，跳过: $file"
    fi
}

process_directory() {
    local dir=$1
    if [ -d "$dir" ]; then
        echo "处理目录: $dir"
        while IFS= read -r -d '' file; do
            add_title_to_file "$file"
        done < <(find "$dir" -type f -name "YYC3-XY-架构类-*.md" -print0 | sort -z)
    fi
}

directories=(
    "/Users/yanyu/yyc3-xiaoyu-ai/docs/01-架构设计类"
)

for dir in "${directories[@]}"; do
    process_directory "$dir"
done

total=$(sed -n '1p' "$COUNTER_FILE")
echo ""
echo "=========================================="
echo "标题修复完成！"
echo "总计修复文件数: $total"
echo "=========================================="

rm "$COUNTER_FILE"
