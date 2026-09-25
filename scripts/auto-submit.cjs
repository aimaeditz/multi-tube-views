const fs = require('fs');
const path = require('path');
const { submitIndexNow } = require('./indexnow-submit.cjs');

const ROOT_DIR = path.resolve(__dirname, '..');
const SITEMAP_URL = 'https://multitubeviews.com/sitemap.xml';

async function pingUrl(serviceName, pingUrl) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const response = await fetch(pingUrl, {
      method: 'GET',
      signal: controller.signal,
      headers: { 'User-Agent': 'MTV-Auto-SEO/1.0' }
    });
    clearTimeout(timeout);
    console.log(`[Ping] ${serviceName}: Status ${response.status} (${response.statusText || 'OK'})`);
    return response.status;
  } catch (err) {
    const msg = err.name === 'AbortError' ? 'Timeout (8s)' : (err.message || String(err));
    console.warn(`[Ping] ${serviceName} failed: ${msg}`);
    return null;
  }
}

async function runAutoSubmit() {
  console.log('====================================================');
  console.log('🚀 Starting Automatic SEO & Search Engine Submission');
  console.log('====================================================');

  // 1. Read sitemap.xml
  let sitemapPath = path.join(ROOT_DIR, 'sitemap.xml');
  if (!fs.existsSync(sitemapPath)) {
    sitemapPath = path.join(ROOT_DIR, 'public', 'sitemap.xml');
  }

  let urlCount = 0;
  if (fs.existsSync(sitemapPath)) {
    const content = fs.readFileSync(sitemapPath, 'utf-8');
    const matches = content.match(/<loc>(https?:\/\/[^<]+)<\/loc>/g) || [];
    urlCount = matches.length;
    console.log(`[Sitemap] Loaded sitemap at ${sitemapPath} with ${urlCount} URLs.`);
  } else {
    console.warn('[Sitemap] Warning: sitemap.xml not found in root or public directory.');
  }

  // 2. Ping Search Engines
  console.log('\n--- Pinging Search Engine Sitemap Endpoints ---');
  const encodedSitemap = encodeURIComponent(SITEMAP_URL);

  await pingUrl('Google', `https://www.google.com/ping?sitemap=${encodedSitemap}`);
  await pingUrl('Bing', `https://www.bing.com/ping?sitemap=${encodedSitemap}`);
  await pingUrl('Yandex IndexNow', `https://yandex.com/indexnow?url=${encodedSitemap}`);

  // 3. Submit to IndexNow
  console.log('\n--- IndexNow Direct API Submission ---');
  try {
    await submitIndexNow();
  } catch (err) {
    console.warn('[IndexNow] Error during submission:', err.message || err);
  }

  console.log('====================================================');
  console.log('✅ Automatic SEO submission finished successfully.');
  console.log('====================================================');
}

if (require.main === module) {
  runAutoSubmit().catch(err => {
    console.error('[Auto-Submit] Critical error:', err);
    process.exit(0); // Exit cleanly so build/workflow does not crash unexpectedly
  });
}

module.exports = { runAutoSubmit };
