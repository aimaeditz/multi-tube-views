const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const pngToIcoMod = require('png-to-ico');
const pngToIco = pngToIcoMod.default || pngToIcoMod;

async function generateFavicons() {
  const svgPath = path.resolve(__dirname, 'assets/icons/favicon.svg');
  if (!fs.existsSync(svgPath)) {
    console.error('favicon.svg not found at:', svgPath);
    process.exit(1);
  }

  const svgBuffer = fs.readFileSync(svgPath);

  // Generate PNG sizes
  const sizes = [16, 32, 48, 192, 512];
  const pngBuffers = {};

  for (const size of sizes) {
    const pngBuf = await sharp(svgBuffer, { density: 300 })
      .resize(size, size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png({ compressionLevel: 9 })
      .toBuffer();
    
    pngBuffers[size] = pngBuf;
    console.log(`Generated ${size}x${size} PNG (${pngBuf.length} bytes)`);
  }

  // Generate multi-size favicon.ico from 16, 32, 48 buffers
  const icoBuffer = await pngToIco([pngBuffers[16], pngBuffers[32], pngBuffers[48]]);
  console.log(`Generated favicon.ico (${icoBuffer.length} bytes)`);

  // Target directories to write to
  const dirs = [
    path.resolve(__dirname, 'assets/icons'),
    path.resolve(__dirname, 'public/assets/icons'),
    path.resolve(__dirname),
    path.resolve(__dirname, 'public'),
  ];

  dirs.forEach(d => {
    if (!fs.existsSync(d)) {
      fs.mkdirSync(d, { recursive: true });
    }
  });

  // Write files to assets/icons and public/assets/icons
  const iconTargets = [
    path.resolve(__dirname, 'assets/icons'),
    path.resolve(__dirname, 'public/assets/icons')
  ];

  for (const dir of iconTargets) {
    fs.writeFileSync(path.join(dir, 'favicon.ico'), icoBuffer);
    fs.writeFileSync(path.join(dir, 'favicon-16.png'), pngBuffers[16]);
    fs.writeFileSync(path.join(dir, 'favicon-32.png'), pngBuffers[32]);
    fs.writeFileSync(path.join(dir, 'favicon-48.png'), pngBuffers[48]);
    fs.writeFileSync(path.join(dir, 'favicon-192.png'), pngBuffers[192]);
    fs.writeFileSync(path.join(dir, 'favicon-512.png'), pngBuffers[512]);
    fs.writeFileSync(path.join(dir, 'apple-touch-icon.png'), pngBuffers[192]);
  }

  // Write root files (favicon.ico, favicon-192.png, favicon-512.png, apple-touch-icon.png) to root and public/
  const rootTargets = [
    path.resolve(__dirname),
    path.resolve(__dirname, 'public')
  ];

  for (const dir of rootTargets) {
    fs.writeFileSync(path.join(dir, 'favicon.ico'), icoBuffer);
    fs.writeFileSync(path.join(dir, 'favicon-192.png'), pngBuffers[192]);
    fs.writeFileSync(path.join(dir, 'favicon-512.png'), pngBuffers[512]);
    fs.writeFileSync(path.join(dir, 'apple-touch-icon.png'), pngBuffers[192]);
  }

  console.log('All favicon formats generated and placed successfully!');
}

generateFavicons().catch(err => {
  console.error('Error generating favicons:', err);
  process.exit(1);
});
