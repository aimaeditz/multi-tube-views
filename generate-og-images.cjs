const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function generateOGImages() {
  const og16x9Svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="#FFFFFF"/>
    <!-- Central White Card with subtle border and shadow aesthetic -->
    <rect x="460" y="120" width="280" height="280" rx="64" fill="#FFFFFF" stroke="#E5E5EA" stroke-width="4"/>
    <text x="600" y="300" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="124" font-weight="900" fill="#1D1D1F" letter-spacing="-4" text-anchor="middle">MTV</text>
    
    <text x="600" y="470" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="46" font-weight="800" fill="#1D1D1F" letter-spacing="-1" text-anchor="middle">Multi Tube Views</text>
    <text x="600" y="520" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="22" font-weight="500" fill="#6E6E73" text-anchor="middle">Multi-Platform Public Media Workspace</text>
  </svg>`);

  const og3x4Svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1200" viewBox="0 0 900 1200">
    <rect width="900" height="1200" fill="#FFFFFF"/>
    <rect x="270" y="300" width="360" height="360" rx="80" fill="#FFFFFF" stroke="#E5E5EA" stroke-width="5"/>
    <text x="450" y="530" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="160" font-weight="900" fill="#1D1D1F" letter-spacing="-5" text-anchor="middle">MTV</text>
    
    <text x="450" y="770" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="54" font-weight="800" fill="#1D1D1F" letter-spacing="-1" text-anchor="middle">Multi Tube Views</text>
    <text x="450" y="830" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="26" font-weight="500" fill="#6E6E73" text-anchor="middle">Multi-Platform Public Media Workspace</text>
  </svg>`);

  const ogSquareSvg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200">
    <rect width="1200" height="1200" fill="#FFFFFF"/>
    <rect x="400" y="300" width="400" height="400" rx="88" fill="#FFFFFF" stroke="#E5E5EA" stroke-width="5"/>
    <text x="600" y="560" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="180" font-weight="900" fill="#1D1D1F" letter-spacing="-6" text-anchor="middle">MTV</text>
    
    <text x="600" y="810" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="60" font-weight="800" fill="#1D1D1F" letter-spacing="-1" text-anchor="middle">Multi Tube Views</text>
    <text x="600" y="870" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="28" font-weight="500" fill="#6E6E73" text-anchor="middle">Multi-Platform Public Media Workspace</text>
  </svg>`);

  const targets = [
    { svg: og16x9Svg, filename: 'og-image-16x9.jpg', width: 1200, height: 630 },
    { svg: og3x4Svg, filename: 'og-image-3x4.jpg', width: 900, height: 1200 },
    { svg: ogSquareSvg, filename: 'og-image-square.jpg', width: 1200, height: 1200 }
  ];

  const dirs = [
    path.resolve(__dirname, 'assets/images'),
    path.resolve(__dirname, 'public/assets/images')
  ];

  dirs.forEach(d => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  });

  for (const item of targets) {
    const buf = await sharp(item.svg)
      .jpeg({ quality: 95 })
      .toBuffer();
    
    for (const dir of dirs) {
      fs.writeFileSync(path.join(dir, item.filename), buf);
      console.log(`Saved ${item.filename} to ${dir}`);
    }
  }

  console.log('OG images updated successfully!');
}

generateOGImages().catch(err => {
  console.error('Error generating OG images:', err);
  process.exit(1);
});
