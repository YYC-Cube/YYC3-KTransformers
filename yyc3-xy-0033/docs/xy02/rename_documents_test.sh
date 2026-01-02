#!/bin/bash

# YYC3-XY 文档重命名脚本 - 通用版
# 用于统一沫语成长守护体系测试文档的命名格式

BASE_DIR="/Users/yanyu/yyc3-xiaoyu-ai/docs/06-爱之细语/04-沫语成长守护体系测试/沫语成长守护体系测试AI"
COUNTER=1

echo "开始重命名沫语成长守护体系测试文档..."
echo "基础目录: $BASE_DIR"
echo ""

# 处理年度成长志文件
find "$BASE_DIR" -maxdepth 2 -type f -name "*岁_年度成长志.md" ! -name "YYC3-XY-*.md" | sort | while read -r file; do
    dirname=$(dirname "$file")
    basename=$(basename "$file" .md)
    
    # 提取年龄信息
    age=$(echo "$basename" | sed 's/岁_年度成长志//')
    
    # 构造新文件名
    new_name="YYC3-XY-沫语守护测试-${age}岁-年度成长志.md"
    new_path="$dirname/$new_name"
    
    # 重命名文件
    mv "$file" "$new_path"
    echo "[$COUNTER] 重命名: $basename -> $new_name"
    COUNTER=$((COUNTER + 1))
done

# 处理生日纪念文件
find "$BASE_DIR" -maxdepth 2 -type f -name "*岁生日纪念.md" ! -name "YYC3-XY-*.md" | sort | while read -r file; do
    dirname=$(dirname "$file")
    basename=$(basename "$file" .md)
    
    # 提取年龄信息
    age=$(echo "$basename" | sed 's/岁生日纪念//')
    
    # 构造新文件名
    new_name="YYC3-XY-沫语守护测试-${age}岁-生日纪念.md"
    new_path="$dirname/$new_name"
    
    # 重命名文件
    mv "$file" "$new_path"
    echo "[$COUNTER] 重命名: $basename -> $new_name"
    COUNTER=$((COUNTER + 1))
done

# 处理月度记录文件
find "$BASE_DIR" -type f -name "*月记录.md" ! -name "YYC3-XY-*.md" | sort | while read -r file; do
    dirname=$(dirname "$file")
    basename=$(basename "$file" .md)
    
    # 提取月份信息
    month=$(echo "$basename" | sed 's/月记录//')
    
    # 构造新文件名
    new_name="YYC3-XY-沫语守护测试-${month}月-记录.md"
    new_path="$dirname/$new_name"
    
    # 重命名文件
    mv "$file" "$new_path"
    echo "[$COUNTER] 重命名: $basename -> $new_name"
    COUNTER=$((COUNTER + 1))
done

# 处理学习记录文件
find "$BASE_DIR" -type f -name "*学习记录.md" ! -name "YYC3-XY-*.md" | sort | while read -r file; do
    dirname=$(dirname "$file")
    basename=$(basename "$file" .md)
    
    # 提取学科信息
    subject=$(echo "$basename" | sed 's/学习记录//')
    
    # 构造新文件名
    new_name="YYC3-XY-沫语守护测试-${subject}学习记录.md"
    new_path="$dirname/$new_name"
    
    # 重命名文件
    mv "$file" "$new_path"
    echo "[$COUNTER] 重命名: $basename -> $new_name"
    COUNTER=$((COUNTER + 1))
done

# 处理社团活动文件
find "$BASE_DIR" -type f -name "社团活动.md" ! -name "YYC3-XY-*.md" | sort | while read -r file; do
    dirname=$(dirname "$file")
    basename=$(basename "$file" .md)
    
    # 构造新文件名
    new_name="YYC3-XY-沫语守护测试-社团活动.md"
    new_path="$dirname/$new_name"
    
    # 重命名文件
    mv "$file" "$new_path"
    echo "[$COUNTER] 重命名: $basename -> $new_name"
    COUNTER=$((COUNTER + 1))
done

# 处理初中生活相关文件
find "$BASE_DIR" -type f -name "兴趣发展.md" ! -name "YYC3-XY-*.md" | sort | while read -r file; do
    dirname=$(dirname "$file")
    basename=$(basename "$file" .md)
    
    # 构造新文件名
    new_name="YYC3-XY-沫语守护测试-兴趣发展.md"
    new_path="$dirname/$new_name"
    
    # 重命名文件
    mv "$file" "$new_path"
    echo "[$COUNTER] 重命名: $basename -> $new_name"
    COUNTER=$((COUNTER + 1))
done

find "$BASE_DIR" -type f -name "学科学习.md" ! -name "YYC3-XY-*.md" | sort | while read -r file; do
    dirname=$(dirname "$file")
    basename=$(basename "$file" .md)
    
    # 构造新文件名
    new_name="YYC3-XY-沫语守护测试-学科学习.md"
    new_path="$dirname/$new_name"
    
    # 重命名文件
    mv "$file" "$new_path"
    echo "[$COUNTER] 重命名: $basename -> $new_name"
    COUNTER=$((COUNTER + 1))
done

find "$BASE_DIR" -type f -name "社会实践.md" ! -name "YYC3-XY-*.md" | sort | while read -r file; do
    dirname=$(dirname "$file")
    basename=$(basename "$file" .md)
    
    # 构造新文件名
    new_name="YYC3-XY-沫语守护测试-社会实践.md"
    new_path="$dirname/$new_name"
    
    # 重命名文件
    mv "$file" "$new_path"
    echo "[$COUNTER] 重命名: $basename -> $new_name"
    COUNTER=$((COUNTER + 1))
done

echo ""
echo "重命名完成！"
