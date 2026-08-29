// ============================================================
// MTV AI SYSTEM — Core AI Proxy (Backend) — Parallel + Cached
// ============================================================
// Same as before (caching, auto-detect keys), PLUS: tries multiple
// keys/models in PARALLEL instead of one-by-one, so the first one that
// responds wins — much faster average response time.
// ============================================================

const responseCache = new Map();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

function getCacheKey(task, prompt, platform, language) {
  return `${task || 'default'}|${platform || ''}|${language || ''}|${(prompt || '').trim().toLowerCase()}`;
}

async function tryOne(key, model, systemInstruction, finalPrompt) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemInstruction }] },
        contents: [{ parts: [{ text: finalPrompt }] }]
      })
    }
  );
  const data = await response.json();
  if (!response.ok) throw new Error('failed');
  const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  if (!resultText) throw new Error('empty');
  return resultText;
}

// Returns the result of whichever promise resolves first; ignores failures
// unless everything fails.
function raceSuccess(promises) {
  return new Promise((resolve, reject) => {
    let remaining = promises.length;
    let lastError = null;
    promises.forEach((p) => {
      p.then(resolve).catch((err) => {
        lastError = err;
        remaining--;
        if (remaining === 0) reject(lastError);
      });
    });
  });
}

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
    const { prompt, task, platform, language } = req.body || {};

    if (!prompt) {
      res.status(400).json({ error: 'Prompt is required' });
      return;
    }

    const cacheKey = getCacheKey(task, prompt, platform, language);
    const cached = responseCache.get(cacheKey);
    if (cached && (Date.now() - cached.time) < CACHE_TTL_MS) {
      res.status(200).json({ result: cached.result, task: task || 'default' });
      return;
    }

    const apiKeys = [];
    if (process.env.GEMINI_API_KEY) apiKeys.push(process.env.GEMINI_API_KEY);
    let i = 2;
    while (process.env[`GEMINI_API_KEY_${i}`]) {
      apiKeys.push(process.env[`GEMINI_API_KEY_${i}`]);
      i++;
    }

    if (apiKeys.length === 0) {
      res.status(500).json({ error: 'Service temporarily unavailable. Please try again shortly.' });
      return;
    }

    const models = ['gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-2.5-flash'];

    const systemInstructions = {
      'ai-auto': 'You are an expert SEO content strategist. Given a topic, generate a complete, ready-to-use creator content package: 1) A high-CTR title, 2) A full SEO-optimized description (3-5 sentences), 3) A list of 15-20 relevant tags. Label each section clearly. Be specific to the exact topic given, never generic. No markdown asterisks.',
      'seo-title': 'You are an expert copywriter specializing in high-CTR titles. Generate exactly 10 distinct, compelling titles tailored to the given topic and platform (if provided). Return only a clean numbered list, no markdown asterisks.',
      'keywords': 'You are an SEO keyword research expert. Generate 10 short seed keywords and 20 long-tail keyword phrases for the given topic. Return as "Seed Keywords:" and "Long-Tail Keywords:" sections. No markdown asterisks.',
      'hashtags': 'You are a social media hashtag strategist. Generate 60 to 100 highly relevant, real hashtags for the given topic and platform (if provided). Return only hashtags separated by spaces, grouped loosely by relevance. No numbering, no markdown asterisks.',
      'meta-description': 'You are an SEO copywriter. Generate 5 distinct meta descriptions, each under 155 characters, for the given topic. Return only a numbered list, no markdown asterisks.',
      'topic-ideas': 'You are a content strategist. Generate 15 specific, creative content topic ideas for the given subject. Return only a numbered list, no markdown asterisks.',
      'youtube-seo-pack': 'You are a YouTube SEO expert. Generate: 1) One high-CTR title, 2) A 3-4 sentence SEO description with a call to action, 3) A comma-separated list of 25+ tags. Label each section. No markdown asterisks.',
      'grammar-polish': 'You are a professional editor. Correct grammar, spelling, punctuation, and clarity while preserving meaning and tone. Return ONLY the corrected text. No markdown asterisks.',
      'translate': 'You are a professional translator. Translate the given text into the target language specified, or detect and translate sensibly if none given. Return ONLY the translated text. No markdown asterisks.',
      'default': 'You are a helpful assistant for the MTV platform. Keep responses clear, specific, and useful. No markdown asterisks.'
    };

    const systemInstruction = systemInstructions[task] || systemInstructions['default'];

    let contextPrefix = '';
    if (platform) contextPrefix += `Platform: ${platform}\n`;
    if (language) contextPrefix += `Target Language: ${language}\n`;
    const finalPrompt = contextPrefix ? `${contextPrefix}${prompt}` : prompt;

    // --------------------------------------------------------
    // Try the first model across ALL keys in PARALLEL (fast).
    // Only if every key fails on that model, move to the next model
    // and try all keys in parallel again.
    // --------------------------------------------------------
    for (const model of models) {
      const attempts = apiKeys.map((key) => tryOne(key, model, systemInstruction, finalPrompt));
      try {
        const resultText = await raceSuccess(attempts);
        responseCache.set(cacheKey, { result: resultText, time: Date.now() });
        res.status(200).json({ result: resultText, task: task || 'default' });
        return;
      } catch (e) {
        // all keys failed for this model — try next model
      }
    }

    res.status(503).json({ error: 'Thoda busy hai, kripya kuch second baad dobara try karein.' });

  } catch (err) {
    res.status(500).json({ error: 'Kuch gadbad ho gayi, dobara try karein.' });
  }
}
