import fs from 'fs';
import path from 'path';

const INDEXNOW_KEY = 'a827f311c9d64b28e50b1aef421d03bc';
const HOST = 'multitubeviews.com';
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;

export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(455).json({ error: 'Method not allowed' });
  }

  try {
    const sitemapPath = path.resolve(process.cwd(), 'sitemap.xml');
    let urls = [];

    if (fs.existsSync(sitemapPath)) {
      const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
      const urlMatches = sitemapContent.match(/<loc>(https?:\/\/[^<]+)<\/loc>/g) || [];
      urls = urlMatches.map(m => m.replace(/<\/?loc>/g, '').trim());
    }

    if (urls.length === 0) {
      return res.status(200).json({ success: false, message: 'No URLs found in sitemap.xml' });
    }

    const payload = {
      host: HOST,
      key: INDEXNOW_KEY,
      keyLocation: KEY_LOCATION,
      urlList: urls.slice(0, 10000)
    };

    const apiRes = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload)
    });

    return res.status(200).json({
      success: apiRes.ok || apiRes.status === 200 || apiRes.status === 202,
      status: apiRes.status,
      submittedCount: payload.urlList.length,
      keyLocation: KEY_LOCATION
    });
  } catch (err) {
    return res.status(200).json({
      success: false,
      error: err.message || 'Non-blocking IndexNow endpoint error'
    });
  }
}
