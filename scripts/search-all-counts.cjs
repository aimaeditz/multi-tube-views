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

console.log(`Scanning ${files.length} files...`);

const matches211 = [];
const matches430 = [];
const matchesCreator = [];

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('211')) {
    const lines = content.split('\n');
    lines.forEach((l, idx) => {
      if (l.includes('211')) {
        matches211.push({ file, line: idx + 1, text: l.trim() });
      }
    });
  }
  if (content.includes('430')) {
    const lines = content.split('\n');
    lines.forEach((l, idx) => {
      if (l.includes('430')) {
        matches430.push({ file, line: idx + 1, text: l.trim() });
      }
    });
  }
});

console.log(`\n=== ALL MATCHES FOR 211 (${matches211.length}) ===`);
matches211.forEach(m => console.log(`${m.file}:${m.line}: ${m.text}`));

console.log(`\n=== ALL MATCHES FOR 430 (${matches430.length}) ===`);
matches430.forEach(m => console.log(`${m.file}:${m.line}: ${m.text}`));
