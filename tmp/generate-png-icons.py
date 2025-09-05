#!/usr/bin/env python3
"""
Generate PNG icons for PWA using PIL (Python Imaging Library)
This creates simple circular icons with stock chart pattern
"""

import os
from PIL import Image, ImageDraw
import math

def create_stock_icon(size, output_path):
    """Create a stock-style icon with chart pattern"""
    # Create new image with transparent background
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Draw blue circle background
    draw.ellipse([0, 0, size, size], fill=(37, 99, 235, 255))  # #2563eb
    
    # Draw stock chart line (simplified)
    padding = size * 0.2
    chart_width = size - (2 * padding)
    chart_height = size * 0.4
    chart_top = size * 0.3
    
    # Define points for stock chart
    points = [
        (padding, chart_top + chart_height * 0.7),  # Start low
        (padding + chart_width * 0.25, chart_top + chart_height * 0.5),  # Rise
        (padding + chart_width * 0.5, chart_top + chart_height * 0.6),   # Slight dip
        (padding + chart_width * 0.8, chart_top + chart_height * 0.2),   # High point
    ]
    
    # Draw the chart line
    line_width = max(2, size // 40)
    for i in range(len(points) - 1):
        draw.line([points[i], points[i + 1]], fill='white', width=line_width)
    
    # Draw point at the end
    last_point = points[-1]
    point_radius = max(2, size // 25)
    draw.ellipse([
        last_point[0] - point_radius, last_point[1] - point_radius,
        last_point[0] + point_radius, last_point[1] + point_radius
    ], fill='white')
    
    # Save the image
    img.save(output_path, 'PNG')
    print(f"Created {output_path}")

def create_shortcut_icon(size, color, output_path):
    """Create shortcut icon with different colors"""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Draw colored circle background
    draw.ellipse([0, 0, size, size], fill=color)
    
    # Draw simple chart pattern
    padding = size * 0.2
    chart_width = size - (2 * padding)
    chart_height = size * 0.4
    chart_top = size * 0.3
    
    points = [
        (padding, chart_top + chart_height * 0.7),
        (padding + chart_width * 0.25, chart_top + chart_height * 0.5),
        (padding + chart_width * 0.5, chart_top + chart_height * 0.6),
        (padding + chart_width * 0.8, chart_top + chart_height * 0.2),
    ]
    
    line_width = max(2, size // 20)
    for i in range(len(points) - 1):
        draw.line([points[i], points[i + 1]], fill='white', width=line_width)
    
    last_point = points[-1]
    point_radius = max(2, size // 16)
    draw.ellipse([
        last_point[0] - point_radius, last_point[1] - point_radius,
        last_point[0] + point_radius, last_point[1] + point_radius
    ], fill='white')
    
    img.save(output_path, 'PNG')
    print(f"Created {output_path}")

def main():
    # Create icons directory
    icons_dir = '../public/icons'
    os.makedirs(icons_dir, exist_ok=True)
    
    # Generate main app icons
    sizes = [72, 96, 128, 144, 152, 192, 384, 512]
    for size in sizes:
        output_path = os.path.join(icons_dir, f'icon-{size}x{size}.png')
        create_stock_icon(size, output_path)
    
    # Generate shortcut icons
    shortcut_configs = [
        ('shortcut-intraday.png', (16, 185, 129)),   # Green
        ('shortcut-daily.png', (245, 158, 11)),      # Orange  
        ('shortcut-stocks.png', (139, 92, 246)),     # Purple
        ('shortcut-dashboard.png', (239, 68, 68)),   # Red
    ]
    
    for filename, color in shortcut_configs:
        output_path = os.path.join(icons_dir, filename)
        create_shortcut_icon(96, color + (255,), output_path)  # Add alpha channel
    
    print("All PNG icons generated successfully!")

if __name__ == '__main__':
    main()