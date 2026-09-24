import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const INDEXNOW_KEY = 'a827f311c9d64b28e50b1aef421d03bc';
const HOST = 'multitubeviews.com';
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;

export async function submitIndexNow() {
  console.log('[IndexNow] Preparing auto-submission for Google/Bing IndexNow...');
  try {
    const sitemapPath = path.join(ROOT_DIR, 'sitemap.xml');
    if (!fs.existsSync(sitemapPath)) {
      console.warn('[IndexNow] Warning: sitemap.xml not found. Skipping IndexNow submission.');
      return;
    }

    const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
    const urlMatches = sitemapContent.match(/<loc>(https?:\/\/[^<]+)<\/loc>/g) || [];
    const urls = urlMatches.map(m => m.replace(/<\/?loc>/g, '').trim());

    if (urls.length === 0) {
      console.warn('[IndexNow] No URLs found in sitemap.xml.');
      return;
    }

    console.log(`[IndexNow] Found ${urls.length} URLs from sitemap.xml.`);

    // IndexNow allows up to 10,000 URLs per batch
    const BATCH_SIZE = 10000;
    for (let i = 0; i < urls.length; i += BATCH_SIZE) {
      const batch = urls.slice(i, i + BATCH_SIZE);
      const payload = {
        host: HOST,
        key: INDEXNOW_KEY,
        keyLocation: KEY_LOCATION,
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

        if (response.ok || response.status === 200 || response.status === 202) {
          console.log(`[IndexNow] Successfully submitted batch of ${batch.length} URLs to IndexNow (Status ${response.status}).`);
        } else {
          console.warn(`[IndexNow] IndexNow API returned status ${response.status}: ${response.statusText}`);
        }
      } catch (postErr) {
        console.warn('[IndexNow] Request error during IndexNow POST:', postErr.message || postErr);
      }
    }
  } catch (err) {
    console.warn('[IndexNow] Non-blocking IndexNow error:', err.message || err);
  }
}

if (process.argv[1] && process.argv[1].endsWith('indexnow-submit.mjs')) {
  submitIndexNow();
}
