import fs from 'fs';
import path from 'path';

const ADSENSE_META = '<meta name="google-adsense-account" content="ca-pub-5279550123869703">';
const ADSENSE_SCRIPT = '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5279550123869703" crossorigin="anonymous"></script>';

function getHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    if (
      filePath.includes('/node_modules') ||
      filePath.includes('/.git') ||
      file.startsWith('.')
    ) {
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

function processHtmlFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  const hasMeta = content.includes('ca-pub-5279550123869703') && content.includes('google-adsense-account');
  const hasScript = content.includes('ca-pub-5279550123869703') && content.includes('adsbygoogle');

  if (hasMeta && hasScript) {
    return false;
  }

  // Ensure <head> exists
  if (!content.includes('<head>') && !content.includes('<HEAD>')) {
    console.warn(`[Warning] No <head> tag found in ${filePath}`);
    return false;
  }

  if (!hasMeta) {
    if (hasScript) {
      // Place meta tag immediately above the adsbygoogle script tag
      content = content.replace(
        /(<script[^>]*adsbygoogle[^>]*><\/script>|<script[^>]*adsbygoogle[^>]*\/>|<script[^>]*src=["'][^"']*adsbygoogle[^"']*["'][^>]*>\s*<\/script>)/i,
        `${ADSENSE_META}\n  $1`
      );
      modified = true;
    } else if (/<meta\s+charset=["']?UTF-8["']?/i.test(content)) {
      content = content.replace(
        /(<meta\s+charset=["']?UTF-8["']?[^>]*>)/i,
        `$1\n  ${ADSENSE_META}`
      );
      modified = true;
    } else {
      content = content.replace(
        /(<head[^>]*>)/i,
        `$1\n  ${ADSENSE_META}`
      );
      modified = true;
    }
  }

  if (!hasScript) {
    if (content.includes('google-adsense-account')) {
      content = content.replace(
        /(<meta\s+name=["']google-adsense-account["'][^>]*>)/i,
        `$1\n  ${ADSENSE_SCRIPT}`
      );
      modified = true;
    } else if (/<meta\s+charset=["']?UTF-8["']?/i.test(content)) {
      content = content.replace(
        /(<meta\s+charset=["']?UTF-8["']?[^>]*>)/i,
        `$1\n  ${ADSENSE_SCRIPT}`
      );
      modified = true;
    } else {
      content = content.replace(
        /(<head[^>]*>)/i,
        `$1\n  ${ADSENSE_SCRIPT}`
      );
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
  }

  return modified;
}

const htmlFiles = getHtmlFiles('.');
let updatedCount = 0;

htmlFiles.forEach(file => {
  if (processHtmlFile(file)) {
    updatedCount++;
  }
});

console.log(`✓ AdSense tags checked & updated across ${updatedCount} HTML files (Total scanned: ${htmlFiles.length}).`);
