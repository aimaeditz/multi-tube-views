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

console.log('=== DETAILED COUNT CONTEXT SCAN ===');

const patterns = [
  /211/g,
  /430/g,
  /160/g,
  /AI [Tt]ools \(\d+\)/g,
  /\d+ AI [Tt]ools/g,
  /Search \d+\+/g,
  /\d+ Instant Tools/g,
  /Creator [Tt]ools \(\d+\)/g,
  /\d+ [Cc]reator [Tt]ools/g,
  /Browser [Uu]tilities \(\d+\)/g,
  /\d+ [Bb]rowser [Uu]tilities/g,
  /Media [Cc]onverters \(\d+\)/g,
  /\d+ [Mm]edia [Cc]onverters/g,
  /Platforms \(\d+\)/g,
  /\d+ Platforms/g
];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (line.includes('d="M') || line.includes('viewBox') || line.includes('path d=')) return;
    patterns.forEach(p => {
      p.lastIndex = 0;
      if (p.test(line)) {
        console.log(`${f}:${idx + 1}: ${line.trim()}`);
      }
    });
  });
});
