import fs from 'fs';
import path from 'path';

function walk(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === '.git' || file === 'dist') continue;
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      walk(full, fileList);
    } else if (file.endsWith('.html')) {
      fileList.push(full);
    }
  }
  return fileList;
}

const htmlFiles = walk('.');
let modifiedCount = 0;
const modifiedFiles = [];
const skippedFiles = [];

const TARGET_LINK_LI = '<li><a href="https://publicmediatool.com/" target="_blank" rel="noopener">PMT Hub ↗</a></li>';
const TARGET_LINK_A = '<a href="https://publicmediatool.com/" target="_blank" rel="noopener">PMT Hub ↗</a>';

for (const file of htmlFiles) {
  let content = fs.readFileSync(file, 'utf8');

  // Skip redirect files with no footer
  if (!content.includes('<footer')) {
    skippedFiles.push({ file, reason: 'No footer' });
    continue;
  }

  let updated = false;

  // 1. If it already has publicmediatool.com, ensure it uses "PMT Hub ↗" label
  if (content.includes('https://publicmediatool.com/')) {
    const oldPmtRegex = /<a[^>]*href="https:\/\/publicmediatool\.com\/?"[^>]*>.*?<\/a>/g;
    const newContent = content.replace(oldPmtRegex, '<a href="https://publicmediatool.com/" target="_blank" rel="noopener">PMT Hub ↗</a>');
    if (newContent !== content) {
      content = newContent;
      updated = true;
    }
  } else {
    // 2. Insert after credits.html
    // Pattern A: <li><a href="...credits.html...">...</a></li> in a <ul>
    const liCreditsRegex = /([ \t]*)<li><a href="[^"]*credits\.html[^"]*">.*?<\/a><\/li>/;
    // Pattern B: <a href="...credits.html...">...</a> in a <div>
    const aCreditsRegex = /([ \t]*)<a href="[^"]*credits\.html[^"]*">.*?<\/a>/;

    if (liCreditsRegex.test(content)) {
      content = content.replace(liCreditsRegex, (match, indent) => {
        return `${match}\n${indent}${TARGET_LINK_LI}`;
      });
      updated = true;
    } else if (aCreditsRegex.test(content)) {
      content = content.replace(aCreditsRegex, (match, indent) => {
        return `${match}\n${indent}${TARGET_LINK_A}`;
      });
      updated = true;
    } else if (content.includes('<h4>Legal & Info</h4>') || content.includes('<h4>Legal &amp; Info</h4>')) {
      const legalListRegex = /(<h4>Legal &(?:amp;)? Info<\/h4>\s*<ul class="footer-links">[\s\S]*?)(<li><a href="[^"]*contact\.html">.*?<\/a><\/li>)/;
      if (legalListRegex.test(content)) {
        content = content.replace(legalListRegex, (match, pre, contactLi) => {
          const depth = file.split(path.sep).length - 1;
          const p = depth === 0 ? '' : '../'.repeat(depth);
          return `${pre}<li><a href="${p}credits.html">Credits & Attributions</a></li>\n            ${TARGET_LINK_LI}\n            ${contactLi}`;
        });
        updated = true;
      }
    }
  }

  if (updated) {
    fs.writeFileSync(file, content, 'utf8');
    modifiedFiles.push(file);
    modifiedCount++;
  }
}

console.log(`Total HTML files: ${htmlFiles.length}`);
console.log(`Modified files: ${modifiedCount}`);
console.log(`Skipped files: ${skippedFiles.length}`);
if (skippedFiles.length > 0) {
  console.log('Skipped files list:', JSON.stringify(skippedFiles, null, 2));
}
