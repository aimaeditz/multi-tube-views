// ============================================================
// MTV AI SYSTEM — Blogger Prompt Feed Reader (Backend)
// ============================================================
// This file must go in the repo at: api/prompt-feed.js
//
// What it does: fetches the AiPromptXpert Blogger RSS feed from the
// SERVER side (so there is no browser CORS blocking), converts it to
// clean JSON, and returns it to the website. Any time you add a new
// post/prompt/category on Blogger, it will show up automatically the
// next time this endpoint is called — no code changes needed, ever.
// ============================================================

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const feedUrl = 'https://aipromptxpert.blogspot.com/feeds/posts/default?alt=json&max-results=500';

    const response = await fetch(feedUrl);
    if (!response.ok) {
      res.status(502).json({ error: 'Could not load prompt library right now. Please try again shortly.' });
      return;
    }

    const data = await response.json();
    const entries = data.feed?.entry || [];

    const prompts = entries.map((entry) => {
      // Extract text content
      const title = entry.title?.$t || '';
      const contentHtml = entry.content?.$t || entry.summary?.$t || '';

      // Extract first image from the post content, if any
      let image = '';
      const imgMatch = contentHtml.match(/<img[^>]+src="([^">]+)"/i);
      if (imgMatch) image = imgMatch[1];

      // Extract categories/labels
      const categories = (entry.category || []).map((c) => c.term);

      // Extract original post link
      let link = '';
      const altLink = (entry.link || []).find((l) => l.rel === 'alternate');
      if (altLink) link = altLink.href;

      // Strip HTML tags to get plain prompt text
      const plainText = contentHtml.replace(/<[^>]*>/g, '').trim();

      return {
        title,
        image,
        promptText: plainText,
        categories,
        originalLink: link,
        published: entry.published?.$t || ''
      };
    });

    // Cache for 10 minutes so repeated visits are fast, but new Blogger
    // posts still show up automatically within that window.
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=1200');
    res.status(200).json({ prompts });

  } catch (err) {
    res.status(500).json({ error: 'Could not load prompt library right now. Please try again shortly.' });
  }
}
