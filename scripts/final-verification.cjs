const fs = require('fs');
const path = require('path');

console.log('==================================================');
console.log('=== FINAL COMPREHENSIVE VERIFICATION AUDIT ===');
console.log('==================================================\n');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    if (file === 'node_modules' || file === '.git' || file === 'dist' || file.endsWith('.min.js') || file.endsWith('.min.mjs')) return;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else if (/\.(html|js|json|md|mjs|cjs|ts|tsx|css)$/i.test(file)) {
      results.push(fullPath);
    }
  });
  return results;
}

const files = walk('.');

let count211Matches = [];
let count430Matches = [];

files.forEach(f => {
  // Ignore self/test scripts for 211 / 430 check
  if (f.includes('scripts/find-all-counts-context') || f.includes('scripts/list-211-files') || f.includes('scripts/search-all-counts') || f.includes('scripts/audit-all-html-and-js') || f.includes('scripts/verify-all-pages-counts') || f.includes('scripts/fix-all-counts') || f.includes('scripts/final-verification')) return;

  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');

  lines.forEach((l, idx) => {
    if (l.includes('d="M') || l.includes('viewBox') || l.includes('path d=')) return; // Ignore SVG path data
    if (/\b211\b/.test(l) && !f.includes('ai-prompts.json')) {
      count211Matches.push(`${f}:${idx + 1}: ${l.trim()}`);
    }
    if (/\b430\b/.test(l) && !f.includes('ai-prompts.json')) {
      count430Matches.push(`${f}:${idx + 1}: ${l.trim()}`);
    }
  });
});

console.log(`1. Remaining '211' references (should be 0): ${count211Matches.length}`);
count211Matches.forEach(m => console.log('   ', m));

console.log(`\n2. Remaining '430' references (should be 0): ${count430Matches.length}`);
count430Matches.forEach(m => console.log('   ', m));

console.log('\n==================================================');
console.log('STATUS:', (count211Matches.length === 0 && count430Matches.length === 0) ? 'SUCCESS — ALL COUNTS FULLY VERIFIED!' : 'FAILURE — UNEXPECTED MATCHES FOUND');
console.log('==================================================');
