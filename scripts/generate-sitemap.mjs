import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { BU_CATEGORIES } from './build-categories-data.mjs';
import { ALL_TOOLS } from './generate-all-pages.mjs';
import { AI_TOOLS_DATA } from '../assets/data/ai-tools-data.js';
import { CREATOR_TOOLS_DATA } from '../assets/data/creator-tools-data.js';

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

function getMediaToolsKeys() {
  try {
    const mediaToolsPath = path.join(ROOT_DIR, 'assets', 'js', 'media-tools-data.js');
    if (fs.existsSync(mediaToolsPath)) {
      const content = fs.readFileSync(mediaToolsPath, 'utf-8');
      const keys = [];
      const regex = /'([a-z0-9-]+)'\s*:\s*\{/g;
      let match;
      while ((match = regex.exec(content)) !== null) {
        keys.push(match[1]);
      }
      return keys;
    }
  } catch (err) {
    console.warn('Could not parse media-tools-data.js:', err);
  }
  return [];
}

export function generateSitemap() {
  const urlMap = new Map();

  function addUrl(relativePath) {
    const cleanPath = relativePath.replace(/\\/g, '/');

    // Skip redirect stubs or invalid paths
    if (!cleanPath || cleanPath === 'browser-utilities/index.html' || cleanPath === 'platforms/index.html') {
      return;
    }

    const loc = `${BASE_URL}/${cleanPath}`;
    let priority = '0.75';
    let changefreq = 'weekly';

    if (cleanPath === 'index.html') {
      priority = '1.0';
    } else if (['creator-tools.html', 'media-converter-tools.html', 'ai-prompt.html', 'ai-tools.html', 'ai-auto.html', 'platforms.html', 'browser-utilities.html'].includes(cleanPath)) {
      priority = '0.95';
    } else if (['articles.html', 'about.html'].includes(cleanPath)) {
      priority = '0.85';
      changefreq = cleanPath === 'about.html' ? 'monthly' : 'weekly';
    } else if (['privacy.html', 'terms.html', 'disclaimer.html', 'credits.html', 'settings.html'].includes(cleanPath)) {
      priority = '0.50';
      changefreq = 'monthly';
    } else if (cleanPath.startsWith('platforms/')) {
      const platformName = cleanPath.replace('platforms/', '').replace('.html', '');
      if (['youtube', 'twitch', 'spotify', 'tiktok'].includes(platformName)) {
        priority = '0.90';
      } else {
        priority = '0.80';
      }
    } else if (cleanPath.startsWith('browser-utilities/')) {
      const utilName = cleanPath.replace('browser-utilities/', '').replace('.html', '');
      const isCategory = BU_CATEGORIES.some(c => c.id === utilName) ||
        utilName.includes('-extras') ||
        utilName.includes('-converters') ||
        utilName.includes('-creators') ||
        utilName.includes('-utilities') ||
        utilName.includes('-productivity');

      if (isCategory) {
        priority = '0.85';
      } else {
        priority = '0.75';
      }
    }

    urlMap.set(loc, { loc, priority, changefreq, lastmod: TODAY });
  }

  // 1. Pull URLs from Browser Utilities Data Sources
  BU_CATEGORIES.forEach(cat => {
    addUrl(`browser-utilities/${cat.id}.html`);
  });

  ALL_TOOLS.forEach(tool => {
    addUrl(`browser-utilities/${tool.id}.html`);
  });

  // 2. Validate Tool System Data Sources (AI Tools, Creator Tools, Media Converter Tools)
  const aiToolsCount = Object.keys(AI_TOOLS_DATA || {}).length;
  const creatorToolsCount = Object.keys(CREATOR_TOOLS_DATA || {}).length;
  const mediaToolsKeys = getMediaToolsKeys();

  if (aiToolsCount > 0) {
    addUrl('ai-tools.html');
    addUrl('ai-prompt.html');
    addUrl('ai-auto.html');
  }

  if (creatorToolsCount > 0) {
    addUrl('creator-tools.html');
  }

  if (mediaToolsKeys.length > 0) {
    addUrl('media-converter-tools.html');
  }

  // 3. Pull URLs from Platforms Data / Filesystem
  const platformsDir = path.join(ROOT_DIR, 'platforms');
  if (fs.existsSync(platformsDir)) {
    addUrl('platforms.html');
    const platformFiles = fs.readdirSync(platformsDir);
    platformFiles.forEach(file => {
      if (file.endsWith('.html') && file !== 'index.html') {
        addUrl(`platforms/${file}`);
      }
    });
  }

  // 4. Filesystem scan to discover all static pages and any newly added HTML files
  const allHtmlFiles = getHtmlFiles(ROOT_DIR);
  allHtmlFiles.forEach(fullPath => {
    const relativePath = path.relative(ROOT_DIR, fullPath).replace(/\\/g, '/');
    addUrl(relativePath);
  });

  const urlEntries = Array.from(urlMap.values());

  // Sort entries deterministically: highest priority first, then alphabetically by URL
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

