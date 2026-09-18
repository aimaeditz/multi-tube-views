const fs = require('fs');
const path = require('path');

const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));

console.log(`Checking ${htmlFiles.length} HTML files in root...`);

const suspiciousPatterns = [
  { name: 'Old AI tools 211', regex: /\b211\b/g },
  { name: 'Old total tools 430', regex: /\b430\b/g },
  { name: 'Old AI tools 160', regex: /\b160 Free\b|\b160 AI\b|\b160 dedicated\b/gi },
  { name: 'Old AI tools 1211', regex: /1211/g },
  { name: 'Old Creator tools (not 70)', regex: /\b(50|65|72|80) Creator\b/gi }
];

let issues = [];

htmlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    suspiciousPatterns.forEach(p => {
      p.regex.lastIndex = 0;
      if (p.regex.test(line)) {
        issues.push({ file, line: idx + 1, type: p.name, text: line.trim() });
      }
    });
  });
});

console.log(`Found ${issues.length} potential issues in HTML files:`);
issues.forEach(i => console.log(`${i.file}:${i.line} [${i.type}] -> ${i.text}`));
