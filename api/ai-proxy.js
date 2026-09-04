// ============================================================
// MTV AI SYSTEM — Multi-Provider Proxy (Final Merged Version)
// ============================================================
// Providers & key patterns (add as many numbered keys as you want, ever):
//   GEMINI_API_KEY, GEMINI_API_KEY_2, GEMINI_API_KEY_3, ...
//   GROQ_API_KEY, GROQ_API_KEY_2, ...
//   OPENROUTER_API_KEY, OPENROUTER_API_KEY_2, ...
//   DEEPSEEK_API_KEY, DEEPSEEK_API_KEY_2, ...
//   LLM7_API_KEY, LLM7_API_KEY_2, ...
// ALL keys across ALL providers race in PARALLEL per model tier —
// whichever responds first wins. 1-hour response cache included.
// ============================================================

const responseCache = new Map();
const CACHE_TTL_MS = 60 * 60 * 1000;

function getCacheKey(task, prompt, platform, language, tone) {
  return `${task || 'default'}|${platform || ''}|${language || ''}|${tone || ''}|${(prompt || '').trim().toLowerCase()}`;
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

async function tryGemini(key, model, systemInstruction, prompt) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
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
    if (!resultText.trim()) throw new Error('empty');
    return resultText;
  } finally {
    clearTimeout(timeout);
  }
}

async function tryOpenAICompatible(baseUrl, key, model, systemInstruction, prompt) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
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
    if (!resultText.trim()) throw new Error('empty');
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

    const geminiKeys = collectKeys('GEMINI_API_KEY');
    const groqKeys = collectKeys('GROQ_API_KEY');
    const openrouterKeys = collectKeys('OPENROUTER_API_KEY');
    const deepseekKeys = collectKeys('DEEPSEEK_API_KEY');
    const llm7Keys = collectKeys('LLM7_API_KEY');

    const geminiModels = ['gemini-3.6-flash', 'gemini-2.5-flash', 'gemini-2.0-flash'];
    const groqModel = 'openai/gpt-oss-120b';
    const openrouterModel = 'meta-llama/llama-3.3-70b-instruct:free';
    const deepseekModel = 'deepseek-chat';
    const llm7Model = 'gpt-4o-mini-2024-07-18';

    const robustRule = 'IMPORTANT: The user input may be short, long, messy, informal, in any language or mix of languages, or phrased as a casual sentence rather than a clean topic. Regardless of how it is written, identify the real subject/intent behind it and produce a complete, high-quality, correctly-formatted answer that fully matches this tool\'s specific job. Never respond with a generic, vague, or off-topic answer, and never ask the user to clarify — always do your best to understand and deliver the expected output. ';

    const systemInstructions = {
      'ai-auto': robustRule + 'You are an expert SEO content strategist. Given a topic, generate a complete, ready-to-use creator content package: 1) A high-CTR title, 2) A full SEO-optimized description, 3) A list of 15-20 relevant tags, 4) Strategic hashtags. Label each section clearly. Output ONLY the package content, no conversational preamble or postamble.',
      'seo-title': robustRule + 'You are an expert copywriter specializing in high-CTR titles. Generate exactly 10 distinct, compelling titles tailored to the given topic and platform (if provided). Return ONLY a clean numbered list from 1 to 10. Do NOT include any intro, outro, explanations, hashtags, or markdown formatting.',
      'keywords': robustRule + 'You are an SEO keyword research expert. Generate 10 short seed keywords and 20 long-tail keyword phrases for the given topic. Return ONLY as "Seed Keywords:" and "Long-Tail Keywords:" sections. Do NOT include intro text, hashtags, or titles.',
      'hashtags': robustRule + 'You are a social media hashtag strategist. Generate 30 to 60 relevant, real hashtags for the given topic and platform (if provided). Return ONLY hashtags starting with # separated by single spaces (e.g. #keyword1 #keyword2). Do NOT include any numbers, bullet points, intro text, titles, explanations, or commentary.',
      'meta-description': robustRule + 'You are an SEO copywriter. Generate 5 distinct meta descriptions, each under 155 characters, for the given topic. Return ONLY a clean numbered list from 1 to 5. Do NOT include intro text, titles, or hashtags.',
      'topic-ideas': robustRule + 'You are a content strategist. Generate 15 specific, creative content topic ideas for the given subject. Return ONLY a clean numbered list from 1 to 15. Do NOT include intro text, hashtags, or scripts.',
      'youtube-seo-pack': robustRule + 'You are a YouTube SEO expert. Generate a YouTube SEO pack for the given topic with these exact sections: 1) Title Options, 2) Video Description with timestamps placeholder, 3) Video Tags (comma-separated list), 4) Thumbnail Text Concepts. Label each section clearly. Do NOT include any conversational preamble or postamble.',
      'grammar-polish': robustRule + 'You are a master editor. Correct grammar, spelling, punctuation, and clarity while preserving original meaning and tone, in whatever language the text is written. Return ONLY the polished, corrected text. Do NOT include any preamble, intro, explanations, list of changes, quotes, or conversational commentary.',
      'translate': robustRule + 'You are an expert multilingual translator fluent in all world languages including Urdu, English, Hindi, Spanish, French, German, Arabic, Japanese, Portuguese, and Russian. Translate the provided text accurately into the exact Target Language specified. If Target Language is Urdu, output in Urdu script. Return ONLY the translated text in the specified target language. Do NOT include any preamble, intro, translator notes, explanations, original text, quotes, or markdown commentary.',
      'thumbnail-text': robustRule + 'You are a thumbnail copywriting expert. Generate 10 short, bold, high-impact thumbnail text ideas (2-5 words each) for the given topic. Return only a numbered list. No markdown asterisks.',
      'video-hook': robustRule + 'You are a video retention expert. Generate 8 attention-grabbing opening hook lines (1-2 sentences each) designed to stop viewers scrolling in the first 5 seconds, for the given topic. Return only a numbered list. No markdown asterisks.',
      'script-outline': robustRule + 'You are a video content strategist. Generate a clear bullet-point script outline (intro, 3-5 main points, conclusion/CTA) for a video on the given topic. Return only the outline with clear section labels. No markdown asterisks.',
      'bio-generator': robustRule + 'You are a branding copywriter. Generate 5 distinct short bio/about-section options (each 1-3 sentences) for the given creator, channel, or brand topic. Return only a numbered list. No markdown asterisks.',
      'content-calendar': robustRule + 'You are a content strategist. Generate a 7-day content posting plan for the given topic/niche, with one specific content idea per day, labeled Day 1 through Day 7. No markdown asterisks.',
      'trending-topics': robustRule + 'You are a trend-aware content strategist. Generate 15 fresh, currently-relevant content topic ideas related to the given niche or subject. Return only a numbered list. No markdown asterisks.',
      'emoji-suggestions': robustRule + 'You generate relevant emoji sets for captions or titles. Given the topic or text, return 15-20 relevant emojis grouped loosely by theme, separated by spaces. No explanation, no markdown asterisks.',
      'title-comparer': robustRule + 'You are an expert copywriting judge. Given two titles provided by the user (they may be separated by a line break, "vs", or similar), pick the stronger one for click-through rate and clearly explain why in 2-3 sentences, then briefly suggest one improvement to the weaker one. No markdown asterisks.',
      'content-repurposing': robustRule + 'You are a cross-platform content strategist. Given one topic or piece of content, generate specific repurposing ideas across 4 formats: 1) Short-form video/Reel idea, 2) Carousel/slide post idea, 3) Blog post angle, 4) Thread/X post angle. Label each of the 4 sections clearly. No markdown asterisks.',
      'ab-title-test': robustRule + 'You are an expert copywriter running an A/B test. Given a topic, generate exactly 2 contrasting title options: Option A (curiosity/intrigue-driven) and Option B (direct/clear-benefit-driven). Label each clearly as "Option A:" and "Option B:", and add one short line explaining the different psychological angle each uses. No markdown asterisks.',
      'description-seo-booster': robustRule + 'You are a YouTube SEO copywriting expert. Given a short draft description or topic, expand it into a complete, SEO-optimized long-form video description (4-6 sentences) naturally including relevant keywords, followed by a short "Suggested Tags:" line with 10-15 comma-separated tags. No markdown asterisks.',
      'default': robustRule + 'You are a helpful assistant for the MTV platform. Keep responses clear, specific, and useful. No markdown asterisks.'
    };

    const systemInstruction = systemInstructions[task] || systemInstructions['default'];

    let contextPrefix = '';
    if (platform) contextPrefix += `Platform: ${platform}\n`;
    if (language) contextPrefix += `Target Language: ${language}\n`;
    if (tone && tone !== 'default') contextPrefix += `Tone: ${tone}\n`;
    const finalPrompt = contextPrefix ? `${contextPrefix}${prompt}` : prompt;

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

    if (attempts.length > 0) {
      try {
        const resultText = await raceSuccess(attempts);
        responseCache.set(cacheKey, { result: resultText, time: Date.now() });
        res.status(200).json({ result: resultText, task: task || 'default' });
        return;
      } catch (e) {
        // all providers/keys failed — fall through to safe generic error below
      }
    }

    res.status(503).json({ error: 'Thoda busy hai, kripya kuch second baad dobara try karein.' });

  } catch (err) {
    res.status(500).json({ error: 'Kuch gadbad ho gayi, dobara try karein.' });
  }
}
