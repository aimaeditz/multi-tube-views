import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const sitemapPath = path.join(rootDir, 'sitemap.xml');
let sitemapContent = fs.readFileSync(sitemapPath, 'utf8');

// Categories
const categories = [
  'text-utilities.html',
  'developer-utilities.html',
  'web-seo-utilities.html',
  'image-utilities.html',
  'file-data-utilities.html',
  'everyday-utilities.html'
];

// Tools in browser-utilities/
const buDir = path.join(rootDir, 'browser-utilities');
const toolFiles = fs.readdirSync(buDir).filter(f => f.endsWith('.html') && !categories.includes(f));

let newEntries = `  <!-- Browser Utilities Hub & Categories -->
  <url>
    <loc>https://multitubeviews.com/browser-utilities.html</loc>
    <lastmod>2026-09-10</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.95</priority>
  </url>
`;

categories.forEach(cat => {
  newEntries += `  <url>
    <loc>https://multitubeviews.com/browser-utilities/${cat}</loc>
    <lastmod>2026-09-10</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.90</priority>
  </url>
`;
});

newEntries += `  <!-- Individual Browser Utilities (36 Tools) -->\n`;
toolFiles.sort().forEach(tool => {
  newEntries += `  <url>
    <loc>https://multitubeviews.com/browser-utilities/${tool}</loc>
    <lastmod>2026-09-10</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
`;
});

if (!sitemapContent.includes('browser-utilities.html')) {
  sitemapContent = sitemapContent.replace('</urlset>', `${newEntries}</urlset>`);
  fs.writeFileSync(sitemapPath, sitemapContent, 'utf8');
  console.log(`Updated sitemap.xml with ${categories.length + toolFiles.length + 1} Browser Utilities pages.`);
} else {
  console.log('Browser Utilities already in sitemap.xml');
}
