const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const HOST = 'multitubeviews.com';

function getIndexNowKey() {
  const defaultKey = 'a827f311c9d64b28e50b1aef421d03bc';
  try {
    const files = fs.readdirSync(ROOT_DIR);
    const keyFile = files.find(f => f.endsWith('.txt') && f.length === 36 && f !== 'robots.txt' && f !== 'ads.txt');
    if (keyFile) {
      return keyFile.replace('.txt', '');
    }
  } catch (e) {
    // fallback to default key
  }
  return defaultKey;
}

async function submitIndexNow() {
  const key = getIndexNowKey();
  const keyLocation = `https://${HOST}/${key}.txt`;

  console.log(`[IndexNow] Starting submission using key: ${key}`);

  let sitemapPath = path.join(ROOT_DIR, 'sitemap.xml');
  if (!fs.existsSync(sitemapPath)) {
    sitemapPath = path.join(ROOT_DIR, 'public', 'sitemap.xml');
  }

  if (!fs.existsSync(sitemapPath)) {
    console.warn('[IndexNow] Warning: sitemap.xml not found.');
    return;
  }

  const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
  const urlMatches = sitemapContent.match(/<loc>(https?:\/\/[^<]+)<\/loc>/g) || [];
  const urls = urlMatches
    .map(m => m.replace(/<\/?loc>/g, '').trim())
    .map(url => url.replace('https://www.multitubeviews.com', 'https://multitubeviews.com'));

  if (urls.length === 0) {
    console.warn('[IndexNow] No URLs found in sitemap.xml.');
    return;
  }

  console.log(`[IndexNow] Loaded ${urls.length} URLs from sitemap.xml.`);

  const BATCH_SIZE = 500;
  let batchCount = 0;

  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    batchCount++;
    const batch = urls.slice(i, i + BATCH_SIZE);
    const payload = {
      host: HOST,
      key: key,
      keyLocation: keyLocation,
      urlList: batch
    };

    try {
      const response = await fetch('https://api.indexnow.org/indexnow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(payload)
      });

      const respText = await response.text();
      if (response.ok || response.status === 200 || response.status === 202) {
        console.log(`[IndexNow] Batch ${batchCount}: Successfully submitted ${batch.length} URLs (HTTP ${response.status}).`);
      } else {
        console.warn(`[IndexNow] Batch ${batchCount}: API returned status ${response.status}: ${respText.slice(0, 100)}`);
      }
    } catch (err) {
      console.warn(`[IndexNow] Batch ${batchCount}: Request error - ${err.message || String(err)}`);
    }
  }

  console.log('[IndexNow] Submission process completed.');
}

if (require.main === module) {
  submitIndexNow().catch(err => {
    console.error('[IndexNow] Unexpected error:', err);
  });
}

module.exports = { submitIndexNow, getIndexNowKey };
