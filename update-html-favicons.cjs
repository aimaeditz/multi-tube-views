const fs = require('fs');
const path = require('path');

const faviconSnippet = `  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="icon" type="image/svg+xml" href="/assets/icons/favicon.svg">
  <link rel="icon" type="image/png" sizes="192x192" href="/assets/icons/favicon-192.png">
  <link rel="apple-touch-icon" href="/assets/icons/favicon-192.png">`;

function getHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (file !== 'node_modules' && file !== 'dist' && file !== '.git') {
        results = results.concat(getHtmlFiles(fullPath));
      }
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  });
  return results;
}

const rootDir = path.resolve(__dirname);
const htmlFiles = getHtmlFiles(rootDir);

htmlFiles.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Remove existing favicon/apple-touch-icon/shortcut icon tags
  const iconTagRegex = /[ \t]*<link\s+[^>]*rel=["'](?:icon|shortcut icon|apple-touch-icon)["'][^>]*>\r?\n?/gi;
  content = content.replace(iconTagRegex, '');
  
  // Insert new snippet right after <meta name="viewport" ...> or <meta charset=...> or <head>
  if (content.includes('<meta name="viewport"')) {
    content = content.replace(/(<meta name="viewport"[^>]*>)/i, `$1\n${faviconSnippet}`);
  } else if (content.includes('<head>')) {
    content = content.replace(/<head>/i, `<head>\n${faviconSnippet}`);
  }

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Updated favicon links in: ${path.relative(rootDir, filePath)}`);
});

console.log(`Processed ${htmlFiles.length} HTML files.`);
