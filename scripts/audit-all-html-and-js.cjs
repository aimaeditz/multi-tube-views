const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    if (file === 'node_modules' || file === '.git' || file === 'dist' || file.endsWith('.min.js') || file.endsWith('.min.mjs')) return;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else {
      if (/\.(html|js|json|md|mjs|cjs|ts|tsx)$/i.test(file)) {
        results.push(fullPath);
      }
    }
  });
  return results;
}

const files = walk('.');

console.log('=== AUDITING COUNTS IN ALL FILES ===');

const countsToSearch = ['211', '430', '160', '210', '70', '60', '89', '40'];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  countsToSearch.forEach(num => {
    // Regex for numbers contextually associated with tools or AI or counts
    const regex = new RegExp(`\\b${num}\\b`, 'g');
    if (regex.test(content)) {
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        if (new RegExp(`\\b${num}\\b`).test(line)) {
          // Filter out SVG path coords or non-count text if needed
          if (line.includes('d="M') || line.includes('viewBox') || line.includes('path')) return;
          console.log(`[${num}] ${f}:${idx + 1}: ${line.trim()}`);
        }
      });
    }
  });
});
