// ============================================================
// MTV AI SYSTEM — Multi-Provider Proxy (Gemini + Groq + OpenRouter + DeepSeek)
// ============================================================
// Auto-detects ANY number of keys per provider from Vercel Environment
// Variables, named:
//   GEMINI_API_KEY, GEMINI_API_KEY_2, GEMINI_API_KEY_3, ...
//   GROQ_API_KEY, GROQ_API_KEY_2, ...
//   OPENROUTER_API_KEY, OPENROUTER_API_KEY_2, ...
//   DEEPSEEK_API_KEY, DEEPSEEK_API_KEY_2, ...
//   LLM7_API_KEY, LLM7_API_KEY_2, ...
// Keep numbering sequential per provider, no gaps. Add as many as you want,
// this file never needs to be edited again for more keys.
//
// ALL keys across ALL providers race in PARALLEL — whichever responds
// first wins. This gives maximum speed and maximum reliability.
// ============================================================

const responseCache = new Map();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

function getCacheKey(task, prompt, platform, language) {
  return `${task || 'default'}|${platform || ''}|${language || ''}|${(prompt || '').trim().toLowerCase()}`;
}

function collectKeys(baseName) {
  const keys = [];
  if (process.env[baseName]) keys.push(process.env[baseName]);
  let i = 2;
  while (process.env[`${baseName}_${i}`]) {
    keys.push(process.env[`${baseName}_${i}`]);
    i++;
  }
  return keys;
}

// ---------- Gemini caller ----------
async function tryGemini(key, model, systemInstruction, prompt) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemInstruction }] },
          contents: [{ parts: [{ text: prompt }] }]
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

// ---------- Generic OpenAI-compatible caller (Groq, OpenRouter, DeepSeek) ----------
async function tryOpenAICompatible(baseUrl, key, model, systemInstruction, prompt) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: prompt }
        ]
      })
    });
    const data = await response.json();
    if (!response.ok) throw new Error('failed');
    const resultText = data.choices?.[0]?.message?.content || '';
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
    if (remaining === 0) { reject(new Error('no attempts')); return; }
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

    const geminiKeys = collectKeys('GEMINI_API_KEY');
    const groqKeys = collectKeys('GROQ_API_KEY');
    const openrouterKeys = collectKeys('OPENROUTER_API_KEY');
    const deepseekKeys = collectKeys('DEEPSEEK_API_KEY');
    const llm7Keys = collectKeys('LLM7_API_KEY');

    if (geminiKeys.length + groqKeys.length + openrouterKeys.length + deepseekKeys.length + llm7Keys.length === 0) {
      res.status(500).json({ error: 'Service temporarily unavailable. Please try again shortly.' });
      return;
    }

    const geminiModels = ['gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-2.5-flash'];
    const groqModel = 'llama-3.3-70b-versatile';
    const openrouterModel = 'meta-llama/llama-3.3-70b-instruct:free';
    const deepseekModel = 'deepseek-chat';
    const llm7Model = 'gpt-4o-mini-2024-07-18';

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
      'translate': robustRule + 'You are a professional translator fluent in all major world languages. Translate the given text accurately into the target language specified. If no target language is specified: if the input is not in English, translate it to English; if the input is already in English, translate it to natural, fluent Hindi. Return ONLY the translated text, no commentary, no markdown asterisks.',
      'default': robustRule + 'You are a helpful assistant for the MTV platform. Keep responses clear, specific, and useful. No markdown asterisks.'
    };

    const systemInstruction = systemInstructions[task] || systemInstructions['default'];

    let contextPrefix = '';
    if (platform) contextPrefix += `Platform: ${platform}\n`;
    if (language) contextPrefix += `Target Language: ${language}\n`;
    const finalPrompt = contextPrefix ? `${contextPrefix}${prompt}` : prompt;

    // --------------------------------------------------------
    // Build ALL attempts across ALL providers and ALL keys, race
    // them together — whichever responds first wins.
    // --------------------------------------------------------
    const attempts = [];

    geminiKeys.forEach((key) => {
      geminiModels.forEach((model) => {
        attempts.push(tryGemini(key, model, systemInstruction, finalPrompt));
      });
    });

    groqKeys.forEach((key) => {
      attempts.push(tryOpenAICompatible('https://api.groq.com/openai/v1/chat/completions', key, groqModel, systemInstruction, finalPrompt));
    });

    openrouterKeys.forEach((key) => {
      attempts.push(tryOpenAICompatible('https://openrouter.ai/api/v1/chat/completions', key, openrouterModel, systemInstruction, finalPrompt));
    });

    deepseekKeys.forEach((key) => {
      attempts.push(tryOpenAICompatible('https://api.deepseek.com/chat/completions', key, deepseekModel, systemInstruction, finalPrompt));
    });

    llm7Keys.forEach((key) => {
      attempts.push(tryOpenAICompatible('https://api.llm7.io/v1/chat/completions', key, llm7Model, systemInstruction, finalPrompt));
    });

    try {
      const resultText = await raceSuccess(attempts);
      responseCache.set(cacheKey, { result: resultText, time: Date.now() });
      res.status(200).json({ result: resultText, task: task || 'default' });
      return;
    } catch (e) {
      res.status(503).json({ error: 'Thoda busy hai, kripya kuch second baad dobara try karein.' });
    }

  } catch (err) {
    res.status(500).json({ error: 'Kuch gadbad ho gayi, dobara try karein.' });
  }
}
