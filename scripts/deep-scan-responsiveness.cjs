const fs = require('fs');
const path = require('path');

const cssFiles = fs.readdirSync('assets/css').filter(f => f.endsWith('.css'));

console.log('=== CHECKING CSS FOR RESPONSIVE BREAKPOINTS & OVERFLOW ===');

cssFiles.forEach(file => {
  const filePath = path.join('assets/css', file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  const hasMedia768 = content.includes('768px');
  const hasMedia480 = content.includes('480px');
  const hasOverflowWrap = content.includes('overflow-wrap') || content.includes('word-break') || content.includes('break-words');

  console.log(`${file}:`);
  console.log(`  - Has <=768px query: ${hasMedia768}`);
  console.log(`  - Has <=480px query: ${hasMedia480}`);
  console.log(`  - Has word wrapping / overflow protection: ${hasOverflowWrap}`);
});
