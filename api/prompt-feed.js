import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const candidatePaths = [
      path.join(process.cwd(), 'assets', 'data', 'ai-prompts.json'),
      path.join(process.cwd(), 'public', 'assets', 'data', 'ai-prompts.json'),
    ];

    let rawData = null;
    for (const p of candidatePaths) {
      if (fs.existsSync(p)) {
        rawData = JSON.parse(fs.readFileSync(p, 'utf-8'));
        break;
      }
    }

    if (!rawData || !Array.isArray(rawData.prompts)) {
      res.status(200).json({ prompts: [] });
      return;
    }

    const formattedPrompts = rawData.prompts.map((p) => ({
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
      published: p.pubDate ? new Date(p.pubDate).toISOString() : new Date().toISOString(),
    }));

    res.status(200).json({ prompts: formattedPrompts });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load prompt feed', prompts: [] });
  }
}
