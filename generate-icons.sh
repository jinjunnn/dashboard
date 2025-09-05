#!/bin/bash

# 生成 PWA 图标脚本
# 需要安装 ImageMagick: brew install imagemagick

ICON_DIR="public/icons"
SVG_FILE="$ICON_DIR/app-icon.svg"
SIZES=(72 96 128 144 152 192 384 512)

# 检查是否安装了 ImageMagick
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick 未安装，请先安装:"
    echo "   brew install imagemagick"
    echo ""
    echo "或者手动创建以下尺寸的图标:"
    for size in "${SIZES[@]}"; do
        echo "   - ${size}x${size} -> icon-${size}x${size}.png"
    done
    exit 1
fi

# 检查 SVG 文件是否存在
if [ ! -f "$SVG_FILE" ]; then
    echo "❌ SVG 文件不存在: $SVG_FILE"
    exit 1
fi

echo "🎨 开始生成 PWA 图标..."

# 生成各种尺寸的 PNG 图标
for size in "${SIZES[@]}"; do
    output_file="$ICON_DIR/icon-${size}x${size}.png"
    echo "   生成 ${size}x${size} 图标..."
    
    convert "$SVG_FILE" \
        -resize "${size}x${size}" \
        -background transparent \
        -gravity center \
        -extent "${size}x${size}" \
        "$output_file"
        
    if [ $? -eq 0 ]; then
        echo "   ✅ 成功: $output_file"
    else
        echo "   ❌ 失败: $output_file"
    fi
done

# 生成 favicon
echo "   生成 favicon.ico..."
convert "$ICON_DIR/icon-32x32.png" "$ICON_DIR/icon-16x16.png" "public/favicon.ico"

# 生成 Apple Touch Icon
cp "$ICON_DIR/icon-192x192.png" "public/apple-touch-icon.png"

echo ""
echo "🎉 图标生成完成！"
echo ""
echo "📁 生成的文件："
ls -la "$ICON_DIR"/*.png
echo ""
echo "💡 提示："
echo "   1. 可以手动编辑 SVG 文件来自定义图标设计"
echo "   2. 重新运行此脚本生成新图标"
echo "   3. 部署前请确保所有图标都已正确生成"