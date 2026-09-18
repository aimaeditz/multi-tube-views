import fs from 'fs';
import path from 'path';

function searchFiles(dir, matchRegex) {
  const results = [];
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      if (['node_modules', '.git', 'dist'].includes(file.name)) continue;
      results.push(...searchFiles(fullPath, matchRegex));
    } else if (file.isFile() && /\.(html|js|mjs|cjs|ts|json|md)$/.test(file.name)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const matches = content.match(matchRegex);
      if (matches) {
        results.push({ file: fullPath, count: matches.length, matches });
      }
    }
  }
  return results;
}

console.log('--- SEARCHING FOR OUTDATED CREATOR TOOL COUNTS (e.g. "70 creator", "70 Creator", "70-tool", etc.) ---');
const creator20Results = searchFiles('.', /\b20\s*(-|\s)?\s*(creator|tool|optimization)/gi);
creator20Results.forEach(r => {
  console.log(`File: ${r.file} (${r.count} matches)`);
  r.matches.forEach(m => console.log(`   --> "${m}"`));
});

console.log('\n--- SEARCHING FOR OTHER NUMERIC STAT BADGES IN INDEX.HTML & OTHER PAGES ---');
const indexHtml = fs.readFileSync('index.html', 'utf8');
const numbersInIndex = indexHtml.match(/\b\d+\s*(creator|ai|media|browser|platform|tools?|adapters?|suite|converters?|utilities)\b/gi);
console.log('Mentions in index.html:', [...new Set(numbersInIndex)]);
