#!/bin/bash

# TypeScript 错误诊断脚本
# 用于诊断 yyc3-xy-0033 项目的 TypeScript 编译问题

echo "=== TypeScript 错误诊断脚本 ==="
echo ""

# 1. 检查当前目录
echo "1. 当前工作目录:"
pwd
echo ""

# 2. 检查项目目录是否存在
echo "2. 检查项目目录:"
if [ -d "/Users/yanyu/yyc3-xy-0033" ]; then
    echo "✓ 目录存在: /Users/yanyu/yyc3-xy-0033"
else
    echo "✗ 目录不存在: /Users/yanyu/yyc3-xy-0033"
    echo ""
    echo "尝试查找实际路径:"
    find /Users/yanyu -maxdepth 3 -type d -name "*yyc3*" 2>/dev/null
    exit 1
fi
echo ""

# 3. 检查 package.json
echo "3. 检查 package.json:"
if [ -f "/Users/yanyu/yyc3-xy-0033/package.json" ]; then
    echo "✓ package.json 存在"
    echo "项目名称:"
    grep '"name"' /Users/yanyu/yyc3-xy-0033/package.json
else
    echo "✗ package.json 不存在"
fi
echo ""

# 4. 检查 tsconfig.json
echo "4. 检查 tsconfig.json:"
if [ -f "/Users/yanyu/yyc3-xy-0033/tsconfig.json" ]; then
    echo "✓ tsconfig.json 存在"
else
    echo "✗ tsconfig.json 不存在"
fi
echo ""

# 5. 检查 Bun 是否安装
echo "5. 检查 Bun 安装:"
if command -v bun &> /dev/null; then
    echo "✓ Bun 已安装"
    bun --version
else
    echo "✗ Bun 未安装"
    echo "  请运行: curl -fsSL https://bun.sh/install | bash"
fi
echo ""

# 6. 运行 TypeScript 类型检查
echo "6. 运行 TypeScript 类型检查:"
cd /Users/yanyu/yyc3-xy-0033 || exit 1

# 保存错误到文件
echo "正在运行类型检查..."
bunx tsc --noEmit 2>&1 | tee /tmp/tsc_errors.log

TSC_EXIT_CODE=${?}

if [ $TSC_EXIT_CODE -eq 0 ]; then
    echo ""
    echo "✓ TypeScript 类型检查通过！没有错误。"
else
    echo ""
    echo "✗ 发现 TypeScript 错误 (退出码: $TSC_EXIT_CODE)"
    echo ""
    echo "错误摘要:"
    echo "----------"
    head -100 /tmp/tsc_errors.log
    echo ""
    echo "完整错误已保存到: /tmp/tsc_errors.log"
    echo "查看完整错误: cat /tmp/tsc_errors.log"
fi

# 7. 统计错误数量
if [ -f /tmp/tsc_errors.log ]; then
    ERROR_COUNT=$(grep -c "error TS" /tmp/tsc_errors.log 2>/dev/null || echo "0")
    echo ""
    echo "7. 错误统计:"
    echo "   共发现 $ERROR_COUNT 个 TypeScript 错误"
fi

echo ""
echo "=== 诊断完成 ==="
