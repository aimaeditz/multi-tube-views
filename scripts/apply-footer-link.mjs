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

const TARGET_LINK_LI = '<li><a href="https://publicmediatool.com/" target="_blank" rel="noopener">Public Media Tool ↗</a></li>';
const TARGET_LINK_A = '<a href="https://publicmediatool.com/" target="_blank" rel="noopener">Public Media Tool ↗</a>';

for (const file of htmlFiles) {
  let content = fs.readFileSync(file, 'utf8');

  // Skip redirect files with no footer
  if (!content.includes('<footer')) {
    skippedFiles.push({ file, reason: 'No footer' });
    continue;
  }

  // Already updated?
  if (content.includes('https://publicmediatool.com/')) {
    skippedFiles.push({ file, reason: 'Already contains link' });
    continue;
  }

  let updated = false;

  // Type 1: <li> item with credits in a <ul>
  const liCreditsRegex = /([ \t]*)<li><a href="[^"]*credits\.html[^"]*">.*?<\/a><\/li>/;
  if (liCreditsRegex.test(content)) {
    content = content.replace(liCreditsRegex, (match, indent) => {
      return `${match}\n${indent}${TARGET_LINK_LI}`;
    });
    updated = true;
  }
  // Type 2: <a> link with credits in <div class="footer-links">
  else if (/([ \t]*)<a href="[^"]*credits\.html[^"]*">.*?<\/a>/.test(content)) {
    const aCreditsRegex = /([ \t]*)<a href="[^"]*credits\.html[^"]*">.*?<\/a>/;
    content = content.replace(aCreditsRegex, (match, indent) => {
      return `${match}\n${indent}${TARGET_LINK_A}`;
    });
    updated = true;
  }
  // Type 3: Platform pages missing credits <li> in Legal & Info list
  else if (file.includes('platforms/') && content.includes('<h4>Legal & Info</h4>')) {
    const legalListRegex = /(<h4>Legal & Info<\/h4>\s*<ul class="footer-links">[\s\S]*?)(<li><a href="[^"]*contact\.html">.*?<\/a><\/li>)/;
    if (legalListRegex.test(content)) {
      content = content.replace(legalListRegex, (match, pre, contactLi) => {
        return `${pre}<li><a href="../credits.html">Credits & Attributions</a></li>\n            ${TARGET_LINK_LI}\n            ${contactLi}`;
      });
      updated = true;
    }
  }

  if (updated) {
    fs.writeFileSync(file, content, 'utf8');
    modifiedFiles.push(file);
    modifiedCount++;
  } else {
    skippedFiles.push({ file, reason: 'No matching pattern' });
  }
}

console.log(`Total HTML files: ${htmlFiles.length}`);
console.log(`Modified files: ${modifiedCount}`);
console.log(`Skipped files: ${skippedFiles.length}`);
if (skippedFiles.length > 0) {
  console.log('Skipped files list:', JSON.stringify(skippedFiles, null, 2));
}
