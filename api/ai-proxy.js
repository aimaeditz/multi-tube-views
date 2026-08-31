// ============================================================
// MTV AI SYSTEM — Core AI Proxy (Backend) — Robust Final Version
// ============================================================
// - Auto-detects all GEMINI_API_KEY / GEMINI_API_KEY_2... keys
// - Tries multiple models per key, IN PARALLEL, first success wins
// - Per-attempt timeout (8s) so a slow key doesn't block others
// - Caches identical requests for 1 hour
// - Every tool now robustly handles ANY input: short, long, any language,
//   any phrasing — always understands the topic and stays strictly on
//   that tool's specific job.
// - Translator supports many more languages.
// ============================================================

const responseCache = new Map();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

function getCacheKey(task, prompt, platform, language) {
  return `${task || 'default'}|${platform || ''}|${language || ''}|${(prompt || '').trim().toLowerCase()}`;
}

async function tryOne(key, model, systemInstruction, finalPrompt) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
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
  } finally {
    clearTimeout(timeout);
  }
}

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

    // ------------------------------------------------------------
    // ROBUST BEHAVIOR RULE applied to every tool: no matter how messy,
    // short, long, or in whatever language the user's input is, always
    // figure out the real topic/intent and produce a complete, on-topic,
    // correctly-formatted answer for that specific tool's job — never a
    // vague, generic, or off-topic response, and never ask the user to
    // rephrase.
    // ------------------------------------------------------------
    const robustRule = 'IMPORTANT: The user input may be short, long, messy, informal, in any language or mix of languages, or phrased as a casual sentence rather than a clean topic. Regardless of how it is written, identify the real subject/intent behind it and produce a complete, high-quality, correctly-formatted answer that fully matches this tool\'s specific job. Never respond with a generic, vague, or off-topic answer, and never ask the user to clarify — always do your best to understand and deliver the expected output. ';

    const systemInstructions = {
      'ai-auto': robustRule + 'You are an expert SEO content strategist. Given a topic, generate a complete, ready-to-use creator content package: 1) A high-CTR title, 2) A full SEO-optimized description (3-5 sentences), 3) A list of 15-20 relevant tags. Label each section clearly. No markdown asterisks.',
      'seo-title': robustRule + 'You are an expert copywriter specializing in high-CTR titles. Generate exactly 10 distinct, compelling titles tailored to the given topic and platform (if provided). Return only a clean numbered list, no markdown asterisks.',
      'keywords': robustRule + 'You are an SEO keyword research expert. Generate 10 short seed keywords and 20 long-tail keyword phrases for the given topic. Return as "Seed Keywords:" and "Long-Tail Keywords:" sections. No markdown asterisks.',
      'hashtags': robustRule + 'You are a social media hashtag strategist. Generate 60 relevant, real hashtags for the given topic and platform (if provided). Return only hashtags separated by spaces, grouped loosely by relevance. No numbering, no markdown asterisks.',
      'meta-description': robustRule + 'You are an SEO copywriter. Generate 5 distinct meta descriptions, each under 155 characters, for the given topic. Return only a numbered list, no markdown asterisks.',
      'topic-ideas': robustRule + 'You are a content strategist. Generate 15 specific, creative content topic ideas for the given subject. Return only a numbered list, no markdown asterisks.',
      'youtube-seo-pack': robustRule + 'You are a YouTube SEO expert. Generate: 1) One high-CTR title, 2) A 3-4 sentence SEO description with a call to action, 3) A comma-separated list of 25+ tags. Label each section. No markdown asterisks.',
      'grammar-polish': robustRule + 'You are a professional editor. Correct grammar, spelling, punctuation, and clarity while preserving meaning and tone, in whatever language the text is written. Return ONLY the corrected text. No markdown asterisks.',
      'translate': robustRule + 'You are a professional translator fluent in all major world languages, including but not limited to: English, Hindi, Urdu, Arabic, Spanish, French, German, Portuguese, Russian, Chinese, Japanese, Korean, Turkish, Italian, Bengali, Indonesian, Vietnamese, Thai, Persian/Farsi, Punjabi, and Pashto. Translate the given text accurately into the target language specified. If no target language is specified: if the input is not in English, translate it to English; if the input is already in English, translate it to natural, fluent Hindi. Preserve tone and meaning. Return ONLY the translated text, no commentary, no markdown asterisks.',
      'default': robustRule + 'You are a helpful assistant for the MTV platform. Keep responses clear, specific, and useful. No markdown asterisks.'
    };

    const systemInstruction = systemInstructions[task] || systemInstructions['default'];

    let contextPrefix = '';
    if (platform) contextPrefix += `Platform: ${platform}\n`;
    if (language) contextPrefix += `Target Language: ${language}\n`;
    const finalPrompt = contextPrefix ? `${contextPrefix}${prompt}` : prompt;

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
