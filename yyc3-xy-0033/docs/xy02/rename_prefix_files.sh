#!/bin/bash

set -e

BASE_DIR="/Users/yanyu/yyc3-xiaoyu-ai/docs"
COUNTER=0

echo "开始重命名文件..."
echo "=========================================="

# 处理01-架构设计类目录
find "$BASE_DIR/01-架构设计类" -type f -name "*-YYC3-XY-*.md" ! -name "YYC3-XY-*.md" ! -name "README.md" | sort | while read -r file; do
    dirname=$(dirname "$file")
    basename=$(basename "$file" .md)
    
    # 提取YYC3-XY之后的部分
    new_name=$(echo "$basename" | sed 's/^[0-9][0-9]-//')
    new_path="$dirname/$new_name.md"
    
    # 重命名文件
    mv "$file" "$new_path"
    COUNTER=$((COUNTER + 1))
    echo "[$COUNTER] 重命名: $basename -> $new_name"
done

# 处理02-测试验证类目录
find "$BASE_DIR/02-测试验证类" -type f -name "*-YYC3-XY-*.md" ! -name "YYC3-XY-*.md" ! -name "README.md" | sort | while read -r file; do
    dirname=$(dirname "$file")
    basename=$(basename "$file" .md)
    
    # 提取YYC3-XY之后的部分
    new_name=$(echo "$basename" | sed 's/^[0-9][0-9]-//')
    new_path="$dirname/$new_name.md"
    
    # 重命名文件
    mv "$file" "$new_path"
    COUNTER=$((COUNTER + 1))
    echo "[$COUNTER] 重命名: $basename -> $new_name"
done

# 处理03-文档规范类目录
find "$BASE_DIR/03-文档规范类" -type f -name "*-YYC3-XY-*.md" ! -name "YYC3-XY-*.md" ! -name "README.md" | sort | while read -r file; do
    dirname=$(dirname "$file")
    basename=$(basename "$file" .md)
    
    # 提取YYC3-XY之后的部分
    new_name=$(echo "$basename" | sed 's/^[0-9][0-9]-//')
    new_path="$dirname/$new_name.md"
    
    # 重命名文件
    mv "$file" "$new_path"
    COUNTER=$((COUNTER + 1))
    echo "[$COUNTER] 重命名: $basename -> $new_name"
done

# 处理04-成长记录类目录
find "$BASE_DIR/04-成长记录类" -type f -name "*-YYC3-XY-*.md" ! -name "YYC3-XY-*.md" ! -name "README.md" | sort | while read -r file; do
    dirname=$(dirname "$file")
    basename=$(basename "$file" .md)
    
    # 提取YYC3-XY之后的部分
    new_name=$(echo "$basename" | sed 's/^[0-9][0-9]-//')
    new_path="$dirname/$new_name.md"
    
    # 重命名文件
    mv "$file" "$new_path"
    COUNTER=$((COUNTER + 1))
    echo "[$COUNTER] 重命名: $basename -> $new_name"
done

# 处理05-项目概述类目录
find "$BASE_DIR/05-项目概述类" -type f -name "*-YYC3-XY-*.md" ! -name "YYC3-XY-*.md" ! -name "README.md" | sort | while read -r file; do
    dirname=$(dirname "$file")
    basename=$(basename "$file" .md)
    
    # 提取YYC3-XY之后的部分
    new_name=$(echo "$basename" | sed 's/^[0-9][0-9]-//')
    new_path="$dirname/$new_name.md"
    
    # 重命名文件
    mv "$file" "$new_path"
    COUNTER=$((COUNTER + 1))
    echo "[$COUNTER] 重命名: $basename -> $new_name"
done

echo "=========================================="
echo "文件重命名完成！"
