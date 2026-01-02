#!/bin/bash

# YYC3-XY 文档重命名脚本 - 第二批
# 用于统一沫语成长守护体系测试AI文档的命名格式

BASE_DIR="/Users/yanyu/yyc3-xiaoyu-ai/docs/06-爱之细语/05-沫语成长守护体系测试AI/沫语成长守护体系测试AI"
COUNTER=1

echo "开始重命名剩余文档..."
echo "基础目录: $BASE_DIR"
echo ""

# 处理初中生活相关文件
find "$BASE_DIR" -type f -name "兴趣发展.md" ! -name "YYC3-XY-*.md" | sort | while read -r file; do
    dirname=$(dirname "$file")
    basename=$(basename "$file" .md)
    
    # 构造新文件名
    new_name="YYC3-XY-沫语守护-兴趣发展.md"
    new_path="$dirname/$new_name"
    
    # 重命名文件
    mv "$file" "$new_path"
    echo "[$COUNTER] 重命名: $basename -> $new_name"
    COUNTER=$((COUNTER + 1))
done

# 处理学科学习文件
find "$BASE_DIR" -type f -name "学科学习.md" ! -name "YYC3-XY-*.md" | sort | while read -r file; do
    dirname=$(dirname "$file")
    basename=$(basename "$file" .md)
    
    # 构造新文件名
    new_name="YYC3-XY-沫语守护-学科学习.md"
    new_path="$dirname/$new_name"
    
    # 重命名文件
    mv "$file" "$new_path"
    echo "[$COUNTER] 重命名: $basename -> $new_name"
    COUNTER=$((COUNTER + 1))
done

# 处理社会实践文件
find "$BASE_DIR" -type f -name "社会实践.md" ! -name "YYC3-XY-*.md" | sort | while read -r file; do
    dirname=$(dirname "$file")
    basename=$(basename "$file" .md)
    
    # 构造新文件名
    new_name="YYC3-XY-沫语守护-社会实践.md"
    new_path="$dirname/$new_name"
    
    # 重命名文件
    mv "$file" "$new_path"
    echo "[$COUNTER] 重命名: $basename -> $new_name"
    COUNTER=$((COUNTER + 1))
done

echo ""
echo "重命名完成！"
