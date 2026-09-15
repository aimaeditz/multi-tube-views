import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://multitubeviews.com';
const DEFAULT_OG_IMAGE = `${BASE_URL}/assets/images/og-image-16x9.jpg`;

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

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Extract <title>
  const titleMatch = content.match(/<title>([\s\S]*?)<\/title>/i);
  if (!titleMatch) return false;
  const title = titleMatch[1].trim();

  // Extract <meta name="description" content="...">
  const descMatch = content.match(/<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']/i);
  const description = descMatch ? descMatch[1].trim() : '';

  // Determine canonical URL / og:url
  let relativePath = filePath.replace(/\\/g, '/').replace(/^\.\//, '');
  if (relativePath === 'index.html') relativePath = 'index.html';
  const pageUrl = `${BASE_URL}/${relativePath}`;

  // Build OG and Twitter tags snippet
  const ogTags = [
    `  <!-- Open Graph -->`,
    `  <meta property="og:type" content="website">`,
    `  <meta property="og:url" content="${pageUrl}">`,
    `  <meta property="og:title" content="${title}">`,
    description ? `  <meta property="og:description" content="${description}">` : '',
    `  <meta property="og:site_name" content="Multi Tube Views">`,
    `  <meta property="og:image" content="${DEFAULT_OG_IMAGE}">`,
    `  <meta property="og:image:width" content="1200">`,
    `  <meta property="og:image:height" content="630">`,
    `  <!-- Twitter -->`,
    `  <meta name="twitter:card" content="summary_large_image">`,
    `  <meta name="twitter:title" content="${title}">`,
    description ? `  <meta name="twitter:description" content="${description}">` : '',
    `  <meta name="twitter:image" content="${DEFAULT_OG_IMAGE}">`
  ].filter(Boolean).join('\n');

  // Check if Open Graph block or tags exist in head
  const ogBlockRegex = /<!-- Open Graph -->[\s\S]*?<!-- Twitter -->[\s\S]*?<meta name="twitter:image"[^>]*>/i;
  
  if (ogBlockRegex.test(content)) {
    content = content.replace(ogBlockRegex, ogTags);
  } else {
    // Replace individual og: / twitter: meta tags if scattered, or inject before </head>
    let updated = content;
    
    // Replace existing individual og: and twitter: tags if present
    const ogTitleReg = /<meta\s+property=["']og:title["']\s+content=["'][\s\S]*?["']\s*\/?>\n?/gi;
    const ogDescReg = /<meta\s+property=["']og:description["']\s+content=["'][\s\S]*?["']\s*\/?>\n?/gi;
    const ogUrlReg = /<meta\s+property=["']og:url["']\s+content=["'][\s\S]*?["']\s*\/?>\n?/gi;
    const ogSiteReg = /<meta\s+property=["']og:site_name["']\s+content=["'][\s\S]*?["']\s*\/?>\n?/gi;
    const ogImgReg = /<meta\s+property=["']og:image["']\s+content=["'][\s\S]*?["']\s*\/?>\n?/gi;
    const ogImgWReg = /<meta\s+property=["']og:image:width["']\s+content=["'][\s\S]*?["']\s*\/?>\n?/gi;
    const ogImgHReg = /<meta\s+property=["']og:image:height["']\s+content=["'][\s\S]*?["']\s*\/?>\n?/gi;
    const ogTypeReg = /<meta\s+property=["']og:type["']\s+content=["'][\s\S]*?["']\s*\/?>\n?/gi;

    const twCardReg = /<meta\s+name=["']twitter:card["']\s+content=["'][\s\S]*?["']\s*\/?>\n?/gi;
    const twTitleReg = /<meta\s+name=["']twitter:title["']\s+content=["'][\s\S]*?["']\s*\/?>\n?/gi;
    const twDescReg = /<meta\s+name=["']twitter:description["']\s+content=["'][\s\S]*?["']\s*\/?>\n?/gi;
    const twImgReg = /<meta\s+name=["']twitter:image["']\s+content=["'][\s\S]*?["']\s*\/?>\n?/gi;

    const ogCommentReg = /<!-- Open Graph -->\n?/gi;
    const twCommentReg = /<!-- Twitter -->\n?/gi;

    const hasAnyOg = ogTitleReg.test(content) || ogDescReg.test(content) || ogUrlReg.test(content);

    if (hasAnyOg) {
      // Remove scattered tags first
      updated = updated
        .replace(ogCommentReg, '')
        .replace(twCommentReg, '')
        .replace(ogTypeReg, '')
        .replace(ogUrlReg, '')
        .replace(ogTitleReg, '')
        .replace(ogDescReg, '')
        .replace(ogSiteReg, '')
        .replace(ogImgReg, '')
        .replace(ogImgWReg, '')
        .replace(ogImgHReg, '')
        .replace(twCardReg, '')
        .replace(twTitleReg, '')
        .replace(twDescReg, '')
        .replace(twImgReg, '');

      // Insert clean block after canonical link or after description/keywords tag
      if (/<link\s+rel=["']canonical["'][^>]*>/i.test(updated)) {
        updated = updated.replace(/(<link\s+rel=["']canonical["'][^>]*>)/i, `$1\n\n${ogTags}`);
      } else if (/<meta\s+name=["']theme-color["'][^>]*>/i.test(updated)) {
        updated = updated.replace(/(<meta\s+name=["']theme-color["'][^>]*>)/i, `$1\n\n${ogTags}`);
      } else {
        updated = updated.replace(/<\/head>/i, `${ogTags}\n</head>`);
      }
    } else {
      // Inject before </head> or after canonical
      if (/<link\s+rel=["']canonical["'][^>]*>/i.test(updated)) {
        updated = updated.replace(/(<link\s+rel=["']canonical["'][^>]*>)/i, `$1\n\n${ogTags}`);
      } else {
        updated = updated.replace(/<\/head>/i, `${ogTags}\n</head>`);
      }
    }
    content = updated;
  }

  fs.writeFileSync(filePath, content, 'utf8');
  return true;
}

const files = getHtmlFiles('.');
let count = 0;
files.forEach(file => {
  if (processFile(file)) {
    count++;
  }
});

console.log(`Updated Open Graph & Twitter meta tags across ${count} HTML files.`);
