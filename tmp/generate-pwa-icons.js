const fs = require('fs');
const path = require('path');

// Create a simple PNG icon using HTML5 Canvas (Node.js Canvas package)
// Since we don't have canvas package, we'll create a simple SVG that can be easily converted

const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconDir = path.join(__dirname, '../public/icons');

// Ensure icons directory exists
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

// Generate simple SVG icons for different sizes
iconSizes.forEach(size => {
  const svgContent = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="#2563eb"/>
    <path d="M${size*0.2} ${size*0.7} L${size*0.4} ${size*0.5} L${size*0.6} ${size*0.6} L${size*0.8} ${size*0.3}" 
          stroke="white" stroke-width="${size*0.05}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="${size*0.8}" cy="${size*0.3}" r="${size*0.04}" fill="white"/>
  </svg>`;
  
  fs.writeFileSync(path.join(iconDir, `icon-${size}x${size}.svg`), svgContent);
});

// Create shortcut icons (simple PNG data URLs for now)
const shortcutIcons = [
  { name: 'shortcut-intraday.png', color: '#10b981' },
  { name: 'shortcut-daily.png', color: '#f59e0b' },
  { name: 'shortcut-stocks.png', color: '#8b5cf6' },
  { name: 'shortcut-dashboard.png', color: '#ef4444' }
];

shortcutIcons.forEach(({ name, color }) => {
  const svgContent = `<svg width="96" height="96" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
    <circle cx="48" cy="48" r="48" fill="${color}"/>
    <path d="M19.2 67.2 L38.4 48 L57.6 57.6 L76.8 28.8" 
          stroke="white" stroke-width="4.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="76.8" cy="28.8" r="3.84" fill="white"/>
  </svg>`;
  
  fs.writeFileSync(path.join(iconDir, name.replace('.png', '.svg')), svgContent);
});

console.log('PWA icons generated successfully!');
console.log('Created icons for sizes:', iconSizes.join(', '));
console.log('Created shortcut icons for all app sections');