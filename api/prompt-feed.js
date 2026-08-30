import fs from 'fs';
import path from 'path';

function parseBloggerFeed(feedData) {
  const entries = feedData?.feed?.entry || [];
  const prompts = [];

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const postTitle = (entry.title?.$t || '').trim();
    const postId = (entry.id?.$t || '').trim();
    const published = entry.published?.$t || new Date().toISOString();
    const categories = (entry.category || [])
      .map((c) => c.term || c.$t)
      .filter(Boolean);
    const primaryCategory = categories[0] || 'AI Prompt';

    const altLink = (entry.link || []).find((l) => l.rel === 'alternate');
    const sourceUrl = altLink?.href || '';

    const defaultThumb =
      entry.media$thumbnail?.url?.replace(/\/s(?:72-c|320|400)\//, '/s800/') || '';
    const content = entry.content?.$t || entry.summary?.$t || '';

    // Collect all post images
    const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
    const postImages = [];
    let imgM;
    while ((imgM = imgRegex.exec(content)) !== null) {
      const src = imgM[1];
      if (
        !src.includes('favicon') &&
        !src.includes('b16-rounded.gif') &&
        !src.includes('clear.gif')
      ) {
        postImages.push(src.replace(/\/s(?:72-c|320|400)\//, '/s800/'));
      }
    }

    const extractedInPost = [];

    // Match prompt-text blocks
    const ptRegex = /<div class=["']prompt-text["'][^>]*>([\s\S]*?)<\/div>/gi;
    let ptM;
    let itemIdx = 1;
    while ((ptM = ptRegex.exec(content)) !== null) {
      let rawText = ptM[1].replace(/<[^>]+>/g, '').trim();
      rawText = rawText.replace(/^PROMPT:\s*/i, '').trim();
      if (rawText.length > 20) {
        extractedInPost.push({
          text: rawText,
          image: postImages[itemIdx - 1] || defaultThumb || postImages[0] || '',
          itemIdx: itemIdx++,
        });
      }
    }

    if (extractedInPost.length === 0) {
      const fallbackRegex = /PROMPT:\s*([^<]+)/gi;
      let fbM;
      while ((fbM = fallbackRegex.exec(content)) !== null) {
        const text = fbM[1].trim();
        if (text.length > 20) {
          extractedInPost.push({
            text,
            image: postImages[0] || defaultThumb,
            itemIdx: 1,
          });
        }
      }
    }

    const cleanTitle = postTitle.replace(/\s*\[Code\s*#\d+\]\s*/i, '').trim();

    if (extractedInPost.length > 0) {
      extractedInPost.forEach((item) => {
        const itemTitle =
          extractedInPost.length > 1
            ? `${cleanTitle} (Style ${item.itemIdx})`
            : cleanTitle;
        prompts.push({
          id: `prompt_${postId.replace(/[^a-zA-Z0-9]/g, '_')}_${item.itemIdx}`,
          postId,
          title: itemTitle,
          originalPostTitle: postTitle,
          image: item.image || defaultThumb,
          imageUrl: item.image || defaultThumb,
          promptText: item.text,
          category: primaryCategory,
          categories: categories.length > 0 ? categories : [primaryCategory],
          originalLink: sourceUrl,
          sourceUrl,
          published,
          pubDate: published,
          itemIndex: item.itemIdx,
        });
      });
    } else {
      const cleanContent = content
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      prompts.push({
        id: `prompt_${postId.replace(/[^a-zA-Z0-9]/g, '_')}_1`,
        postId,
        title: cleanTitle || postTitle,
        originalPostTitle: postTitle,
        image: defaultThumb || postImages[0] || '',
        imageUrl: defaultThumb || postImages[0] || '',
        promptText: cleanContent.slice(0, 500),
        category: primaryCategory,
        categories: categories.length > 0 ? categories : [primaryCategory],
        originalLink: sourceUrl,
        sourceUrl,
        published,
        pubDate: published,
        itemIndex: 1,
      });
    }
  }

  return prompts;
}

function loadLocalPromptsFallback() {
  const candidatePaths = [
    path.join(process.cwd(), 'assets', 'data', 'ai-prompts.json'),
    path.join(process.cwd(), 'public', 'assets', 'data', 'ai-prompts.json'),
  ];

  for (const p of candidatePaths) {
    if (fs.existsSync(p)) {
      try {
        const rawData = JSON.parse(fs.readFileSync(p, 'utf-8'));
        if (rawData && Array.isArray(rawData.prompts)) {
          return rawData.prompts.map((p) => ({
            title: p.title || p.originalPostTitle || '',
            image: p.imageUrl || p.image || '',
            promptText: p.promptText || '',
            categories:
              Array.isArray(p.categories) && p.categories.length > 0
                ? p.categories
                : p.category
                ? [p.category]
                : ['AI Prompt'],
            originalLink: p.sourceUrl || p.originalLink || '',
            published: p.pubDate
              ? new Date(p.pubDate).toISOString()
              : new Date().toISOString(),
          }));
        }
      } catch (e) {
        console.error('Error reading local fallback prompts file:', e);
      }
    }
  }
  return [];
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  // Short 60s CDN cache with 120s stale-while-revalidate for fast update propagation
  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120, max-age=60');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const feedUrl = `https://aipromptxpert.blogspot.com/feeds/posts/default?alt=json&max-results=500&orderby=published&_t=${Date.now()}`;
    const fetchResponse = await fetch(feedUrl, {
      cache: 'no-store',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MultiTubeViews/2.0; +https://multitubeviews.com)',
        'Accept': 'application/json',
      },
    });

    if (fetchResponse.ok) {
      const feedJson = await fetchResponse.json();
      const livePrompts = parseBloggerFeed(feedJson);
      if (livePrompts.length > 0) {
        res.status(200).json({ prompts: livePrompts });
        return;
      }
    }

    // Fallback if live feed returned empty or non-200
    const fallbackPrompts = loadLocalPromptsFallback();
    res.status(200).json({ prompts: fallbackPrompts });
  } catch (err) {
    console.error('Error fetching live Blogger feed in api/prompt-feed:', err);
    const fallbackPrompts = loadLocalPromptsFallback();
    res.status(200).json({ prompts: fallbackPrompts });
  }
}
