import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const BASE_URL = 'https://multitubeviews.com';
const TODAY = new Date().toISOString().split('T')[0];

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

export function generateSitemap() {
  const allHtmlFiles = getHtmlFiles(ROOT_DIR);
  const urlEntries = [];

  allHtmlFiles.forEach(fullPath => {
    const relativePath = path.relative(ROOT_DIR, fullPath).replace(/\\/g, '/');

    // Skip redirect stubs
    if (relativePath === 'browser-utilities/index.html' || relativePath === 'platforms/index.html') {
      return;
    }

    const loc = `${BASE_URL}/${relativePath}`;
    let priority = '0.75';
    let changefreq = 'weekly';

    if (relativePath === 'index.html') {
      priority = '1.0';
    } else if (['creator-tools.html', 'media-converter-tools.html', 'ai-prompt.html', 'ai-tools.html', 'ai-auto.html', 'platforms.html', 'browser-utilities.html'].includes(relativePath)) {
      priority = '0.95';
    } else if (['articles.html', 'about.html'].includes(relativePath)) {
      priority = '0.85';
      changefreq = relativePath === 'about.html' ? 'monthly' : 'weekly';
    } else if (['privacy.html', 'terms.html', 'disclaimer.html', 'credits.html', 'settings.html'].includes(relativePath)) {
      priority = '0.50';
      changefreq = 'monthly';
    } else if (relativePath.startsWith('platforms/')) {
      const platformName = relativePath.replace('platforms/', '').replace('.html', '');
      if (['youtube', 'twitch', 'spotify', 'tiktok'].includes(platformName)) {
        priority = '0.90';
      } else {
        priority = '0.80';
      }
    } else if (relativePath.startsWith('browser-utilities/')) {
      // Categories vs Individual tools
      const utilName = relativePath.replace('browser-utilities/', '').replace('.html', '');
      if (utilName.includes('-extras') || utilName.includes('-converters') || utilName.includes('-creators') || utilName.includes('-utilities') || utilName.includes('-productivity')) {
        priority = '0.85';
      } else {
        priority = '0.75';
      }
    }

    urlEntries.push({ loc, priority, changefreq, lastmod: TODAY });
  });

  // Sort entries deterministically: root pages first, then alphabetically
  urlEntries.sort((a, b) => {
    if (parseFloat(b.priority) !== parseFloat(a.priority)) {
      return parseFloat(b.priority) - parseFloat(a.priority);
    }
    return a.loc.localeCompare(b.loc);
  });

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries.map(entry => `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

  const sitemapPath = path.join(ROOT_DIR, 'sitemap.xml');
  const publicSitemapPath = path.join(ROOT_DIR, 'public', 'sitemap.xml');
  const distSitemapPath = path.join(ROOT_DIR, 'dist', 'sitemap.xml');

  fs.writeFileSync(sitemapPath, sitemapXml, 'utf-8');
  console.log(`Updated root sitemap.xml with ${urlEntries.length} URLs.`);

  const publicDir = path.dirname(publicSitemapPath);
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  fs.writeFileSync(publicSitemapPath, sitemapXml, 'utf-8');
  console.log(`Updated public/sitemap.xml.`);

  if (fs.existsSync(path.dirname(distSitemapPath))) {
    fs.writeFileSync(distSitemapPath, sitemapXml, 'utf-8');
    console.log(`Updated dist/sitemap.xml.`);
  }

  return urlEntries.length;
}

if (process.argv[1] && process.argv[1].endsWith('generate-sitemap.mjs')) {
  generateSitemap();
}
