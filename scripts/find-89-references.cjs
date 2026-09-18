const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const results = [];

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.name === 'node_modules' || e.name === '.git' || e.name === 'dist' || e.name === '.next' || e.name === 'vendor' || e.name.includes('.min.')) continue;
    const fullPath = path.join(dir, e.name);
    if (e.isDirectory()) {
      scanDir(fullPath);
    } else if (/\.(html|js|mjs|cjs|ts|json|md)$/.test(e.name)) {
      if (e.name === 'ai-prompts.json' || e.name === 'package-lock.json' || e.name.includes('pdf') || e.name === 'find-89-references.cjs') continue;
      const content = fs.readFileSync(fullPath, 'utf8');
      if (/\b89\b/.test(content)) {
        const lines = content.split('\n');
        lines.forEach((line, idx) => {
          if (/\b89\b/.test(line)) {
            const rel = path.relative(ROOT, fullPath);
            results.push({ file: rel, line: idx + 1, text: line.trim() });
          }
        });
      }
    }
  }
}

scanDir(ROOT);

console.log(`Found ${results.length} lines containing word '89':`);
results.forEach(r => console.log(`${r.file}:${r.line}: ${r.text}`));

