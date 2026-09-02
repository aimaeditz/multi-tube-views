const fs = require('fs');
const path = require('path');

const faviconSnippet = `  <link rel="icon" href="/assets/icons/favicon.ico" sizes="any">
  <link rel="icon" type="image/svg+xml" href="/assets/icons/favicon.svg">
  <link rel="icon" type="image/png" sizes="16x16" href="/assets/icons/favicon-16.png">
  <link rel="icon" type="image/png" sizes="32x32" href="/assets/icons/favicon-32.png">
  <link rel="icon" type="image/png" sizes="48x48" href="/assets/icons/favicon-48.png">
  <link rel="icon" type="image/png" sizes="192x192" href="/assets/icons/favicon-192.png">
  <link rel="icon" type="image/png" sizes="512x512" href="/assets/icons/favicon-512.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/assets/icons/apple-touch-icon.png">
  <link rel="manifest" href="/manifest.json">`;

function getHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (file !== 'node_modules' && file !== 'dist' && file !== '.git' && file !== 'public') {
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
  
  // Remove existing favicon/apple-touch-icon/shortcut icon/manifest tags
  const iconTagRegex = /[ \t]*<link\s+[^>]*rel=["'](?:icon|shortcut icon|apple-touch-icon|manifest)["'][^>]*>\r?\n?/gi;
  content = content.replace(iconTagRegex, '');
  
  // Insert new snippet right after <meta name="viewport" ...> or <meta charset=...> or <head>
  if (content.includes('<meta name="viewport"')) {
    content = content.replace(/(<meta name="viewport"[^>]*>)/i, `$1\n${faviconSnippet}`);
  } else if (content.includes('<head>')) {
    content = content.replace(/<head>/i, `<head>\n${faviconSnippet}`);
  }

  // Check Open Graph image and Twitter card image references
  // Ensure og:image points to og-image-16x9.jpg
  if (content.includes('og:image')) {
    content = content.replace(/content=["'][^"']*og-image[^"']*["']/gi, 'content="https://multitubeviews.com/assets/images/og-image-16x9.jpg"');
  }
  if (content.includes('twitter:image')) {
    content = content.replace(/<meta\s+name=["']twitter:image["']\s+content=["'][^"']*["']\s*\/?>/gi, '<meta name="twitter:image" content="https://multitubeviews.com/assets/images/og-image-16x9.jpg">');
  }

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Updated favicon & meta links in: ${path.relative(rootDir, filePath)}`);
});

console.log(`Processed ${htmlFiles.length} HTML files.`);
