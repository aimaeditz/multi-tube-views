import fs from 'fs';
import path from 'path';
import { formatOptimalTitle, formatOptimalMeta, generateToolFaqs } from './programmatic-seo-engine.mjs';

const ROOT = path.resolve('.');

console.log('=== PHASE 3 & PHASE 4: ON-PAGE SEO, SCHEMAS & HUB-AND-SPOKE INTERNAL LINKING ===');

// 1. UPDATE HUB PAGES: Replace query string links with static HTML links
console.log('\n[1/5] Updating Hub Pages to link directly to static HTML tool pages...');

function updateHubLinks(filePath, folder) {
  let content = fs.readFileSync(filePath, 'utf8');
  const countBefore = (content.match(/href=["']\?tool=([^"']+)["']/g) || []).length;
  content = content.replace(/href=["']\?tool=([^"']+)["']/g, `href="${folder}/$1.html"`);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✓ Updated ${filePath}: Replaced ${countBefore} query links with ${folder}/*.html links.`);
}

updateHubLinks(path.join(ROOT, 'ai-tools.html'), 'ai-tools');
updateHubLinks(path.join(ROOT, 'creator-tools.html'), 'creator-tools');
updateHubLinks(path.join(ROOT, 'media-converter-tools.html'), 'media-converter-tools');

// Also update public/ copies if they exist
['ai-tools.html', 'creator-tools.html', 'media-converter-tools.html'].forEach(f => {
  const p = path.join(ROOT, 'public', f);
  if (fs.existsSync(p)) {
    fs.copyFileSync(path.join(ROOT, f), p);
  }
});

console.log('✓ Hub pages updated successfully.');
