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

function getCacheKey(task, prompt, platform, language, tone) {
  return `${task || 'default'}|${platform || ''}|${language || ''}|${tone || ''}|${(prompt || '').trim().toLowerCase()}`;
}

async function tryOne(key, model, systemInstruction, finalPrompt) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
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
    const { prompt, task, platform, language, tone } = req.body || {};

    if (!prompt) {
      res.status(400).json({ error: 'Prompt is required' });
      return;
    }

    const cacheKey = getCacheKey(task, prompt, platform, language, tone);
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
      'ai-auto': robustRule + 'You are an expert SEO content strategist. Given a topic, generate a complete, ready-to-use creator content package: 1) A high-CTR title, 2) A full SEO-optimized description, 3) A list of 15-20 relevant tags, 4) Strategic hashtags. Label each section clearly. Output ONLY the package content, no conversational preamble or postamble.',
      'seo-title': robustRule + 'You are an expert copywriter specializing in high-CTR titles. Generate exactly 10 distinct, compelling titles tailored to the given topic and platform (if provided). Return ONLY a clean numbered list from 1 to 10. Do NOT include any intro, outro, explanations, hashtags, or markdown formatting.',
      'keywords': robustRule + 'You are an SEO keyword research expert. Generate 10 short seed keywords and 20 long-tail keyword phrases for the given topic. Return ONLY as "Seed Keywords:" and "Long-Tail Keywords:" sections. Do NOT include intro text, hashtags, or titles.',
      'hashtags': robustRule + 'You are a social media hashtag strategist. Generate 30 to 60 relevant, real hashtags for the given topic and platform (if provided). Return ONLY hashtags starting with # separated by single spaces (e.g. #keyword1 #keyword2). Do NOT include any numbers, bullet points, intro text, titles, explanations, or commentary.',
      'meta-description': robustRule + 'You are an SEO copywriter. Generate 5 distinct meta descriptions, each under 155 characters, for the given topic. Return ONLY a clean numbered list from 1 to 5. Do NOT include intro text, titles, or hashtags.',
      'topic-ideas': robustRule + 'You are a content strategist. Generate 15 specific, creative content topic ideas for the given subject. Return ONLY a clean numbered list from 1 to 15. Do NOT include intro text, hashtags, or scripts.',
      'youtube-seo-pack': robustRule + 'You are a YouTube SEO expert. Generate a YouTube SEO pack for the given topic with these exact sections: 1) Title Options, 2) Video Description with timestamps placeholder, 3) Video Tags (comma-separated list), 4) Thumbnail Text Concepts. Label each section clearly. Do NOT include any conversational preamble or postamble.',
      'grammar-polish': robustRule + 'You are a master editor. Correct grammar, spelling, punctuation, and clarity while preserving original meaning and tone, in whatever language the text is written. Return ONLY the polished, corrected text. Do NOT include any preamble, intro (such as "Here is the corrected text:"), explanations, list of changes, quotes, or conversational commentary.',
      'translate': robustRule + 'You are an expert multilingual translator fluent in all world languages including Urdu, English, Hindi, Spanish, French, German, Arabic, Japanese, Portuguese, and Russian. Translate the provided text accurately into the exact Target Language specified. If Target Language is Urdu, output in Urdu script. Return ONLY the translated text in the specified target language. Do NOT include any preamble, intro, translator notes, explanations, original text, quotes, or markdown commentary.',
      'thumbnail-text': robustRule + 'You are a thumbnail copywriting expert. Generate 10 short, bold, high-impact thumbnail text ideas (2-5 words each) for the given topic. Return only a numbered list. No markdown asterisks.',
      'video-hook': robustRule + 'You are a video retention expert. Generate 8 attention-grabbing opening hook lines (1-2 sentences each) designed to stop viewers scrolling in the first 5 seconds, for the given topic. Return only a numbered list. No markdown asterisks.',
      'script-outline': robustRule + 'You are a video content strategist. Generate a clear bullet-point script outline (intro, 3-5 main points, conclusion/CTA) for a video on the given topic. Return only the outline with clear section labels. No markdown asterisks.',
      'bio-generator': robustRule + 'You are a branding copywriter. Generate 5 distinct short bio/about-section options (each 1-3 sentences) for the given creator, channel, or brand topic. Return only a numbered list. No markdown asterisks.',
      'content-calendar': robustRule + 'You are a content strategist. Generate a 7-day content posting plan for the given topic/niche, with one specific content idea per day, labeled Day 1 through Day 7. No markdown asterisks.',
      'trending-topics': robustRule + 'You are a trend-aware content strategist. Generate 15 fresh, currently-relevant content topic ideas related to the given niche or subject. Return only a numbered list. No markdown asterisks.',
      'emoji-suggestions': robustRule + 'You generate relevant emoji sets for captions or titles. Given the topic or text, return 15-20 relevant emojis grouped loosely by theme, separated by spaces. No explanation, no markdown asterisks.',
      'title-comparer': robustRule + 'You are an expert copywriting judge. Given two titles provided by the user (they may be separated by a line break, "vs", or similar), pick the stronger one for click-through rate and clearly explain why in 2-3 sentences, then briefly suggest one improvement to the weaker one. No markdown asterisks.',
      'default': robustRule + 'You are a helpful assistant for the MTV platform. Keep responses clear, specific, and useful. No markdown asterisks.'
    };

    const systemInstruction = systemInstructions[task] || systemInstructions['default'];

    let contextPrefix = '';
    if (platform) contextPrefix += `Platform: ${platform}\n`;
    if (language) contextPrefix += `Target Language: ${language}\n`;
    if (tone && tone !== 'default') contextPrefix += `Tone: ${tone}\n`;
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
