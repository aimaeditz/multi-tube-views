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
      if (/\.(html|js|json|md|txt|mjs|cjs|ts|tsx|css)$/i.test(file)) {
        results.push(fullPath);
      }
    }
  });
  return results;
}

const files = walk('.');

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('211')) {
    console.log(`\nFILE: ${file}`);
    const lines = content.split('\n');
    lines.forEach((l, idx) => {
      if (l.includes('211')) {
        console.log(`  L${idx+1}: ${l.trim()}`);
      }
    });
  }
});
