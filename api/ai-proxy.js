// ============================================================
// MTV AI SYSTEM — Core AI Proxy (Backend)
// ============================================================
// Ye file GitHub repo mein "api/ai-proxy.js" path par jaani chahiye.
// Vercel isko automatically ek secure serverless endpoint bana dega:
//   https://yourdomain.com/api/ai-proxy
//
// NAYA TOOL ADD KARNA HO? Bas neeche "systemInstructions" object mein
// ek naya entry add karo — baaki sab automatic kaam karega.
// ============================================================

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Only POST requests allowed' });
    return;
  }

  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const { prompt, task, platform, language, tone } = req.body || {};

    if (!prompt) {
      res.status(400).json({ error: 'Prompt is required' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: 'Server AI key not configured.' });
      return;
    }

    // ------------------------------------------------------
    // System Instructions for Creator Tools
    // ------------------------------------------------------
    const systemInstructions = {
      'ai-auto': 'You are an expert creator strategist and SEO consultant. Generate a structured, complete optimization package for the user topic: 1) High-CTR Title Options, 2) Comprehensive Description with timestamp chapters placeholder, 3) 25+ Comma-separated SEO Tags, 4) Hashtag Set, and 5) Key Channel Strategy Notes. Format with clean headings and bullet points.',
      'seo-title': 'You are an expert SEO title copywriter for video platforms and search engines. Generate 10 compelling, high-CTR, click-worthy, search-optimized title variations for the given topic and target platform. Include curiosity hooks, how-to structures, numbers, and high-ranking search terms. Return only a clean numbered list from 1 to 10.',
      'keywords': 'You are an expert SEO keyword research specialist. Generate a comprehensive keyword strategy for the given topic and target platform. Include primary seed keywords, long-tail search queries, question-based search queries (People Also Ask), and low-competition search opportunities. Return at least 30+ keywords as a clean comma-separated list.',
      'hashtags': 'You are a social media growth and algorithm specialist. Generate a large, high-performing set of 60 to 100 relevant, trending, and niche hashtags for the given topic and platform. Return ONLY the hashtags separated by spaces (e.g. #keyword1 #keyword2 ...). Do not include explanations, intro text, or numbering.',
      'meta-description': 'You are an expert SEO copywriter. Generate 5 compelling, search-optimized meta descriptions (under 155 characters each) for the given topic and platform. Include strong calls to action (CTA), primary keywords, and clear viewer value. Return as a clean numbered list from 1 to 5.',
      'topic-ideas': 'You are a viral content strategist and creative producer. Brainstorm 15 high-engagement, fresh content topic ideas with strong audience interest for the user niche and platform. Return as a numbered list with creative hooks and angles.',
      'youtube-seo-pack': 'You are an elite YouTube SEO consultant. Generate a complete YouTube SEO pack for the given topic: 1) Title (3 high-CTR options), 2) Video Description (engaging intro, main points, chapter timestamps placeholder, links, and hashtags), 3) Video Tags (25+ comma-separated tags), and 4) 3 Thumbnail text concept suggestions. Clearly label each section.',
      'grammar-polish': 'You are a master editor and content polisher. Correct grammar, spelling, punctuation, and phrasing while refining flow, clarity, and readability. Preserve the original meaning and natural voice. Return the clean, polished text ready for publication.',
      'translate': 'You are an expert multilingual translator. Accurately and naturally translate the provided text into the requested target language (or natural English if foreign text is detected, or natural Hindi if English is provided without a specified language). Ensure natural phrasing, correct context, and cultural accuracy. Return only the translated text.',
      'default': 'You are an intelligent creator assistant for Multi Tube Views. Provide concise, clear, and actionable recommendations for creators and media managers.'
    };

    const systemInstruction = systemInstructions[task] || systemInstructions['default'];

    let contextualPrompt = prompt.trim();
    if (platform && platform !== 'all') {
      contextualPrompt = `[Target Platform: ${platform}]\n${contextualPrompt}`;
    }
    if (language && language !== 'auto') {
      contextualPrompt = `[Target Language: ${language}]\n${contextualPrompt}`;
    }
    if (tone && tone !== 'default') {
      contextualPrompt = `[Tone / Style: ${tone}]\n${contextualPrompt}`;
    }

    const model = 'gemini-2.0-flash';
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemInstruction }] },
          contents: [{ parts: [{ text: contextualPrompt }] }]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      res.status(response.status).json({ error: data.error?.message || 'AI request failed' });
      return;
    }

    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    res.status(200).json({ result: resultText, task: task || 'default' });

  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
}
