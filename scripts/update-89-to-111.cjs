const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const replacements = [
  { from: /89 In-Browser Client-Side Tools/g, to: '111 In-Browser Client-Side Tools' },
  { from: /89 In-Browser Utilities/g, to: '111 In-Browser Utilities' },
  { from: /89 Free Client-Side Web Tools/g, to: '111 Free Client-Side Web Tools' },
  { from: /89 client-side browser utilities/g, to: '111 client-side browser utilities' },
  { from: /89 client-side tools/g, to: '111 client-side tools' },
  { from: /89 high-speed client-side tools/g, to: '111 high-speed client-side tools' },
  { from: /89 browser utilities/g, to: '111 browser utilities' },
  { from: /89 Browser Utilities/g, to: '111 Browser Utilities' },
  { from: /89 fast, 100% private/g, to: '111 fast, 100% private' },
  { from: /Suite of 89 fast/g, to: 'Suite of 111 fast' },
  { from: /Search 89 utilities/g, to: 'Search 111 utilities' },
  { from: /⚡ 89 CLIENT-SIDE UTILITIES/g, to: '⚡ 111 CLIENT-SIDE UTILITIES' },
  { from: /'89 Tools'/g, to: "'111 Tools'" },
  { from: />89 Tools</g, to: '>111 Tools<' },
  { from: />89 tools</g, to: '>111 tools<' },
  { from: /categories and 89 tools/g, to: 'categories and 111 tools' },
  { from: /89 Browser Utilities/g, to: '111 Browser Utilities' },
  { from: /browserUtilities: 89/g, to: 'browserUtilities: 111' },
  { from: /BROWSER UTILITIES \(89 TOOLS\)/g, to: 'BROWSER UTILITIES (111 TOOLS)' },
  { from: /All 89 browser utilities/g, to: 'All 111 browser utilities' }
];

function processDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.name === 'node_modules' || e.name === '.git' || e.name === 'dist' || e.name === '.next' || e.name === 'vendor' || e.name.includes('.min.')) continue;
    const fullPath = path.join(dir, e.name);
    if (e.isDirectory()) {
      processDir(fullPath);
    } else if (/\.(html|js|mjs|cjs|ts|json|md)$/.test(e.name)) {
      if (e.name === 'ai-prompts.json' || e.name === 'package-lock.json' || e.name.includes('pdf') || e.name === 'find-89-references.cjs' || e.name === 'update-89-to-111.cjs') continue;
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      for (const r of replacements) {
        if (r.from.test(content)) {
          content = content.replace(r.from, r.to);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`✓ Updated 89->111 in ${path.relative(ROOT, fullPath)}`);
      }
    }
  }
}

console.log('Processing replacements across project...');
processDir(ROOT);
console.log('Finished updating 89 to 111.');
