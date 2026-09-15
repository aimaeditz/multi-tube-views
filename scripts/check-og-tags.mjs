import fs from 'fs';
import path from 'path';

function getHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    if (filePath.includes('/node_modules') || filePath.includes('/dist') || filePath.includes('/public') || file.startsWith('.')) {
      return;
    }
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getHtmlFiles(filePath));
    } else if (file.endsWith('.html')) {
      results.push(filePath);
    }
  });
  return results;
}

const files = getHtmlFiles('.');
console.log('Total Source HTML files:', files.length);

let auditResults = [];

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  
  const titleMatch = content.match(/<title>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';

  const descMatch = content.match(/<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']/i);
  const desc = descMatch ? descMatch[1].trim() : '';

  const ogTitleMatch = content.match(/<meta\s+property=["']og:title["']\s+content=["']([\s\S]*?)["']/i);
  const ogDescMatch = content.match(/<meta\s+property=["']og:description["']\s+content=["']([\s\S]*?)["']/i);
  const ogUrlMatch = content.match(/<meta\s+property=["']og:url["']\s+content=["']([\s\S]*?)["']/i);
  const ogImgMatch = content.match(/<meta\s+property=["']og:image["']\s+content=["']([\s\S]*?)["']/i);

  const ogTitle = ogTitleMatch ? ogTitleMatch[1].trim() : '';
  const ogDesc = ogDescMatch ? ogDescMatch[1].trim() : '';
  const ogUrl = ogUrlMatch ? ogUrlMatch[1].trim() : '';
  const ogImg = ogImgMatch ? ogImgMatch[1].trim() : '';

  const issues = [];
  if (!ogTitleMatch) issues.push('missing og:title');
  if (!ogDescMatch) issues.push('missing og:description');
  if (!ogUrlMatch) issues.push('missing og:url');
  if (!ogImgMatch) issues.push('missing og:image');

  if (ogTitleMatch && ogTitle !== title) issues.push(`og:title mismatch (page: "${title}", og: "${ogTitle}")`);
  if (ogDescMatch && ogDesc !== desc) issues.push(`og:desc mismatch (page: "${desc}", og: "${ogDesc}")`);

  if (issues.length > 0) {
    auditResults.push({ file, title, desc, ogTitle, ogDesc, ogUrl, ogImg, issues });
  }
});

console.log(`\nAudit finished. ${auditResults.length} of ${files.length} files need OG updates:\n`);
auditResults.forEach(item => {
  console.log(`📄 ${item.file}`);
  item.issues.forEach(iss => console.log(`   - ${iss}`));
});
