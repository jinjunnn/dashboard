#!/usr/bin/env python3
"""
Generate simple screenshot images for PWA
"""

import os
from PIL import Image, ImageDraw, ImageFont

def create_screenshot(width, height, output_path, title):
    """Create a simple screenshot mockup"""
    img = Image.new('RGB', (width, height), (255, 255, 255))
    draw = ImageDraw.Draw(img)
    
    # Draw header bar (blue)
    header_height = height // 15
    draw.rectangle([0, 0, width, header_height], fill=(37, 99, 235))
    
    # Try to use system font, fallback to default
    try:
        font_size = header_height // 2
        font = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", font_size)
    except:
        font = ImageFont.load_default()
    
    # Draw title text
    text_bbox = draw.textbbox((0, 0), title, font=font)
    text_width = text_bbox[2] - text_bbox[0]
    text_height = text_bbox[3] - text_bbox[1]
    text_x = (width - text_width) // 2
    text_y = (header_height - text_height) // 2
    draw.text((text_x, text_y), title, fill='white', font=font)
    
    # Draw content area with some mock elements
    content_start = header_height + 20
    
    # Draw some mock signal cards
    card_height = height // 8
    card_margin = 20
    card_width = width - (2 * card_margin)
    
    for i in range(3):
        y = content_start + (i * (card_height + 10))
        # Card background
        draw.rectangle([card_margin, y, width - card_margin, y + card_height], 
                      fill=(248, 249, 250), outline=(229, 231, 235))
        
        # Mock signal indicator (green circle)
        circle_size = 12
        circle_x = card_margin + 15
        circle_y = y + 15
        draw.ellipse([circle_x, circle_y, circle_x + circle_size, circle_y + circle_size], 
                    fill=(16, 185, 129))
        
        # Mock text
        text_x = circle_x + circle_size + 10
        text_y = y + 15
        signal_text = f"信号 {i+1}: 看涨突破"
        draw.text((text_x, text_y), signal_text, fill=(75, 85, 99), font=font)
        
        # Mock price
        price_text = f"价格: ¥{15.50 + i * 2.30:.2f}"
        draw.text((text_x, text_y + 25), price_text, fill=(107, 114, 128), font=font)
    
    # Save image
    img.save(output_path, 'PNG')
    print(f"Created screenshot: {output_path}")

def main():
    # Create screenshots directory
    screenshots_dir = '../public/screenshots'
    os.makedirs(screenshots_dir, exist_ok=True)
    
    # Create desktop screenshot (wide format)
    create_screenshot(1280, 720, 
                     os.path.join(screenshots_dir, 'desktop-1.png'),
                     '股票信号分析系统 - 桌面版')
    
    # Create mobile screenshot (narrow format) 
    create_screenshot(375, 812,
                     os.path.join(screenshots_dir, 'mobile-1.png'),
                     '信号分析')
    
    print("Screenshots generated successfully!")

if __name__ == '__main__':
    main()