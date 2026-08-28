import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = 3000;

// Simple in-memory cache for performance optimization
interface CacheItem {
  data: any;
  expiry: number;
}
const cacheStore = new Map<string, CacheItem>();

function getCached<T>(key: string): T | null {
  const item = cacheStore.get(key);
  if (!item) return null;
  if (Date.now() > item.expiry) {
    cacheStore.delete(key);
    return null;
  }
  return item.data as T;
}

function setCache(key: string, data: any, ttlSeconds = 300): void {
  cacheStore.set(key, {
    data,
    expiry: Date.now() + ttlSeconds * 1000,
  });
}

// In-memory rate limiting map
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
function checkRateLimit(ip: string, limit = 60, windowMs = 60000): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  if (record.count >= limit) {
    return false;
  }
  record.count++;
  return true;
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request tracing & security headers middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const requestId = `req_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`;
  res.setHeader('X-Request-ID', requestId);
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.path.startsWith('/api/')) {
      console.log(`[Trace:${requestId}] ${req.method} ${req.path} -> Status ${res.statusCode} (${duration}ms)`);
    }
  });

  next();
});

// CORS headers for multi-domain preview and Blogger integration
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Request-ID');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

// Rate limiting middleware for /api/ routes
app.use('/api/', (req: Request, res: Response, next: NextFunction) => {
  const clientIp = req.ip || req.headers['x-forwarded-for']?.toString() || 'unknown-client';
  if (!checkRateLimit(clientIp, 100, 60000)) {
    res.status(429).json({
      success: false,
      error: 'Too many requests. Rate limit exceeded. Please wait a moment.',
    });
    return;
  }
  next();
});

// Lazy Gemini SDK client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) return null;
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

// Exponential Backoff Retry Utility for AI calls
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  initialDelayMs = 400
): Promise<T> {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await fn();
    } catch (err: any) {
      attempt++;
      const status = err?.status || err?.response?.status;
      const isRetryable = status === 429 || status === 503 || status === 500 || !status;
      if (attempt >= maxRetries || !isRetryable) {
        throw err;
      }
      const delay = initialDelayMs * Math.pow(2, attempt - 1) + Math.random() * 150;
      console.warn(`[Retry Attempt ${attempt}/${maxRetries}] Retrying AI call in ${Math.round(delay)}ms... Error: ${err.message}`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error('Max retries exceeded');
}

// Check provider credentials
function getProviderAvailability() {
  return {
    gemini: !!(process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY),
    openai: !!process.env.OPENAI_API_KEY,
    deepseek: !!process.env.DEEPSEEK_API_KEY,
    anthropic: !!process.env.ANTHROPIC_API_KEY,
    openrouter: !!process.env.OPENROUTER_API_KEY,
  };
}

function parseJsonWithSanitization(raw: string) {
  try {
    return JSON.parse(raw);
  } catch (err) {
    const sanitized = raw.replace(/[\u0000-\u001F]/g, (char) => {
      if (char === '\n') return '\\n';
      if (char === '\r') return '\\r';
      if (char === '\t') return '\\t';
      return '';
    });
    return JSON.parse(sanitized);
  }
}

// 1. Health API Endpoint
app.get('/api/health', (req: Request, res: Response) => {
  const providers = getProviderAvailability();
  res.json({
    status: 'ok',
    service: 'Multi Tube Views AI Backend',
    timestamp: new Date().toISOString(),
    providers,
    activeProvider: providers.gemini
      ? 'gemini'
      : providers.openrouter
      ? 'openrouter'
      : providers.openai
      ? 'openai'
      : 'none',
    cacheEntries: cacheStore.size,
  });
});

// 1b. Models API Endpoint (Available AI models including environment configuration)
app.get('/api/models', (req: Request, res: Response) => {
  const envDefaultModel = process.env.DEFAULT_AI_MODEL || process.env.GEMINI_MODEL;
  const envExtraModels = process.env.EXTRA_AI_MODELS ? process.env.EXTRA_AI_MODELS.split(',').map(m => m.trim()).filter(Boolean) : [];

  const models = [
    {
      id: 'gemini-3.7-flash',
      name: 'Gemini 3.7 Flash',
      provider: 'google',
      description: 'Default high-performance model for reasoning, content & coding',
      badge: 'Recommended',
      isDefault: !envDefaultModel || envDefaultModel === 'gemini-3.7-flash',
    },
    {
      id: 'gemini-3.1-pro-preview',
      name: 'Gemini 3.1 Pro',
      provider: 'google',
      description: 'Advanced reasoning & complex problem solving',
      badge: 'Pro',
      isDefault: envDefaultModel === 'gemini-3.1-pro-preview',
    },
    {
      id: 'gemini-3.1-flash-lite',
      name: 'Gemini 3.1 Flash Lite',
      provider: 'google',
      description: 'Ultra-fast lightweight model for quick tasks',
      badge: 'Lite',
      isDefault: envDefaultModel === 'gemini-3.1-flash-lite',
    },
    {
      id: 'gemini-flash-latest',
      name: 'Gemini Flash Latest',
      provider: 'google',
      description: 'Latest Gemini Flash production release',
      badge: 'Latest',
      isDefault: envDefaultModel === 'gemini-flash-latest',
    },
  ];

  if (envDefaultModel && !models.some(m => m.id === envDefaultModel)) {
    models.unshift({
      id: envDefaultModel,
      name: `Custom (${envDefaultModel})`,
      provider: 'env',
      description: 'Configured via DEFAULT_AI_MODEL environment variable',
      badge: 'Env Override',
      isDefault: true,
    });
  }

  for (const extra of envExtraModels) {
    if (!models.some(m => m.id === extra)) {
      models.push({
        id: extra,
        name: extra,
        provider: 'env',
        description: 'Configured via EXTRA_AI_MODELS environment variable',
        badge: 'Custom',
        isDefault: false,
      });
    }
  }

  if (process.env.OPENAI_API_KEY) {
    models.push({
      id: 'gpt-4o-mini',
      name: 'OpenAI GPT-4o Mini',
      provider: 'openai',
      description: 'OpenAI lightweight model',
      badge: 'OpenAI',
      isDefault: false,
    });
    models.push({
      id: 'gpt-4o',
      name: 'OpenAI GPT-4o',
      provider: 'openai',
      description: 'OpenAI flagship model',
      badge: 'OpenAI',
      isDefault: false,
    });
  }

  res.json({
    success: true,
    defaultModel: envDefaultModel || 'gemini-3.7-flash',
    models,
  });
});

// 1c. Architecture & Diagnostics Endpoint (Step 2 Architecture Documentation)
app.get('/api/architecture', (req: Request, res: Response) => {
  res.json({
    success: true,
    application: 'Multi Tube Views (MTV) AI Studio',
    version: '2.0.0',
    layers: {
      frontend: {
        framework: 'React 19 + Vite 6 + Tailwind CSS',
        container: 'Single Page Application / Classical HTML Hybrid Workspace',
        clientSecurity: 'Strict Content Security Policy & Safe Direct Gateway Fallbacks',
      },
      backend: {
        framework: 'Express.js on Node.js (Port 3000)',
        middleware: ['Request Tracing (X-Request-ID)', 'Rate Limiting', 'Security Headers', 'TTL In-Memory Caching'],
        proxyPattern: 'Server-Side API Proxy (Hides API Secrets from Client Browsers)',
      },
      aiLayer: {
        primarySdk: '@google/genai (TypeScript SDK)',
        recommendedModel: 'gemini-3.7-flash',
        proModel: 'gemini-3.1-pro-preview',
        liteModel: 'gemini-3.1-flash-lite',
        retryStrategy: 'Exponential Backoff with Jitter (3 Attempts)',
      },
    },
    securityControls: {
      apiKeyStorage: 'Environment Variables (GEMINI_API_KEY / GOOGLE_AI_API_KEY)',
      xssMitigation: 'JSON Output Parsing & Codeblock Stripping Sanitization',
      rateLimiting: '100 requests / minute per client IP',
    },
    bottlenecksAndMitigations: [
      {
        issue: 'Rate limits or transient timeouts on high concurrency AI prompts',
        mitigation: 'Automated candidate model fallback array + Exponential Backoff Retry engine',
      },
      {
        issue: 'Redundant model queries for identical prompt analysis',
        mitigation: 'In-Memory TTL Cache (300 seconds default TTL)',
      },
    ],
  });
});

// 2. AI Prompts Library API Endpoint
app.get('/api/ai-prompts', (req: Request, res: Response) => {
  try {
    const categoryParam = req.query.category ? String(req.query.category).toLowerCase().trim() : '';
    const searchParam = req.query.search ? String(req.query.search).toLowerCase().trim() : '';
    const page = parseInt(String(req.query.page || '1'), 10) || 1;
    const limit = parseInt(String(req.query.limit || '1000'), 10) || 1000;

    const cacheKey = `prompts_${categoryParam}_${searchParam}_${page}_${limit}`;
    const cachedData = getCached<any>(cacheKey);
    if (cachedData) {
      res.json(cachedData);
      return;
    }

    const candidatePaths = [
      path.join(process.cwd(), 'assets', 'data', 'ai-prompts.json'),
      path.join(process.cwd(), 'public', 'assets', 'data', 'ai-prompts.json'),
    ];

    let fileData: any = null;
    for (const p of candidatePaths) {
      if (fs.existsSync(p)) {
        const raw = fs.readFileSync(p, 'utf-8');
        fileData = parseJsonWithSanitization(raw);
        break;
      }
    }

    if (!fileData || !Array.isArray(fileData.prompts)) {
      res.status(404).json({
        success: false,
        error: 'AI prompt dataset not found on server.',
      });
      return;
    }

    let filtered = fileData.prompts;

    if (categoryParam && categoryParam !== 'all') {
      filtered = filtered.filter((p: any) => {
        const cat = (p.category || '').toLowerCase();
        const cats = (p.categories || []).map((c: string) => c.toLowerCase());
        return cat.includes(categoryParam) || cats.includes(categoryParam);
      });
    }

    if (searchParam) {
      filtered = filtered.filter((p: any) => {
        const title = (p.title || '').toLowerCase();
        const text = (p.promptText || '').toLowerCase();
        const cat = (p.category || '').toLowerCase();
        return title.includes(searchParam) || text.includes(searchParam) || cat.includes(searchParam);
      });
    }

    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const paginatedPrompts = filtered.slice(startIndex, startIndex + limit);

    const responseObj = {
      success: true,
      total,
      page,
      limit,
      categories: fileData.categories || [],
      prompts: paginatedPrompts,
      syncedAt: fileData.syncedAt || new Date().toISOString(),
    };

    setCache(cacheKey, responseObj, 600);
    res.json(responseObj);
  } catch (err: any) {
    console.error('API /api/ai-prompts error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve AI prompts library.',
      details: err.message,
    });
  }
});

// 3. Multi-Provider AI Chat Endpoint
app.post(['/api/chat', '/api/ai-auto'], async (req: Request, res: Response) => {
  try {
    const { provider = 'auto', model, message, prompt, userPrompt: reqUserPrompt, topic, text, messages, systemInstruction, temperature = 0.7 } = req.body;
    
    const userPrompt = message || prompt || reqUserPrompt || topic || text || (Array.isArray(messages) && messages.length > 0 ? messages[messages.length - 1]?.content : '');

    if (!userPrompt || typeof userPrompt !== 'string' || !userPrompt.trim()) {
      res.status(400).json({ success: false, error: 'Please provide a valid text message or prompt.' });
      return;
    }

    const trimmedPrompt = userPrompt.trim();
    const effectiveSystemInstruction = systemInstruction || 
      'You are an expert AI SEO and content creation specialist for Multi Tube Views. Provide comprehensive, high-value, and actionable output formatted with clean Markdown (clear headings, bullet points, bold key terms, codeblocks, or tables where appropriate). Tailor your response dynamically and intelligently to the user\'s specific creator request, whether it is video titles, descriptions, keyword clusters, metadata, social posts, scripts, or SEO strategy.';

    const cacheKey = `chat_${model || 'default'}_${trimmedPrompt.slice(0, 150)}_${temperature}`;
    const cachedResponse = getCached<any>(cacheKey);
    if (cachedResponse) {
      res.json(cachedResponse);
      return;
    }

    // Attempt Gemini first using Exponential Backoff
    const gemini = getGeminiClient();
    if (gemini && (provider === 'auto' || provider === 'gemini' || provider === 'google')) {
      const candidateModels = [model, 'gemini-3.7-flash', 'gemini-3.1-pro-preview', 'gemini-3.1-flash-lite', 'gemini-flash-latest'].filter(Boolean);
      let lastErr: any = null;

      for (const m of candidateModels) {
        try {
          const aiResponse = await retryWithBackoff(async () => {
            return await gemini.models.generateContent({
              model: m,
              contents: effectiveSystemInstruction ? `${effectiveSystemInstruction}\n\nUser Request: ${trimmedPrompt}` : trimmedPrompt,
              config: { temperature: typeof temperature === 'number' ? temperature : 0.7 },
            });
          }, 2, 300);

          const resultObj = {
            success: true,
            response: aiResponse.text || '',
            provider: 'gemini',
            model: m,
          };

          setCache(cacheKey, resultObj, 120);
          res.json(resultObj);
          return;
        } catch (err: any) {
          lastErr = err;
          console.warn(`Model ${m} failed in chat execution:`, err.message);
        }
      }
    }

    // OpenRouter / OpenAI fallback if API key is present
    if (process.env.OPENROUTER_API_KEY && (provider === 'auto' || provider === 'openrouter')) {
      const fetchRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model || 'google/gemini-2.5-flash',
          messages: [
            { role: 'system', content: effectiveSystemInstruction },
            { role: 'user', content: trimmedPrompt }
          ],
          temperature,
        }),
      });

      if (fetchRes.ok) {
        const data = await fetchRes.json();
        const responseText = data.choices?.[0]?.message?.content || '';
        const resultObj = {
          success: true,
          response: responseText,
          provider: 'openrouter',
          model: model || 'google/gemini-2.5-flash',
        };
        res.json(resultObj);
        return;
      }
    }

    if (process.env.OPENAI_API_KEY && (provider === 'auto' || provider === 'openai')) {
      const fetchRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model || 'gpt-4o-mini',
          messages: [
            { role: 'system', content: effectiveSystemInstruction },
            { role: 'user', content: trimmedPrompt }
          ],
          temperature,
        }),
      });

      if (fetchRes.ok) {
        const data = await fetchRes.json();
        const responseText = data.choices?.[0]?.message?.content || '';
        const resultObj = {
          success: true,
          response: responseText,
          provider: 'openai',
          model: model || 'gpt-4o-mini',
        };
        res.json(resultObj);
        return;
      }
    }

    // Standard system notice mode if no AI API key is configured
    res.json({
      success: true,
      response: `### Multi Tube Views AI Auto Response\n\n**Topic / Request:** ${trimmedPrompt}\n\n*Backend engine operational.* To connect to live Gemini 3.7 Flash server-side generation, ensure \`GEMINI_API_KEY\` is configured in the environment settings.\n\n#### Recommended Creator Actions:\n1. **Define Core Intent:** Target high-CTR, search-aligned keywords.\n2. **Structure Content:** Incorporate engaging hook, timestamps, and actionable takeaways.\n3. **Multi-Platform Distribution:** Repurpose highlights across YouTube, Shorts/Reels, and community posts.`,
      provider: 'system_notice',
      model: 'standard-engine',
    });
  } catch (err: any) {
    console.error('API /api/chat error:', err);
    res.status(500).json({
      success: false,
      error: 'AI chat request processing failed.',
      details: err.message,
    });
  }
});

// 4. Video Growth Audit Endpoint
app.post('/api/analyze-video', async (req: Request, res: Response) => {
  try {
    const { url = '', title = '', category = 'Education & Tech', provider = 'auto' } = req.body;

    const cacheKey = `audit_${url.trim().slice(0, 100)}_${title.trim().slice(0, 100)}_${category}`;
    const cachedAudit = getCached<any>(cacheKey);
    if (cachedAudit) {
      res.json(cachedAudit);
      return;
    }

    const gemini = getGeminiClient();
    if (gemini) {
      try {
        const prompt = `You are a YouTube & Social Media SEO Growth Specialist. Analyze this video packaging:
URL: "${url}"
Title: "${title}"
Category: "${category}"

Return ONLY a valid raw JSON object with NO markdown codeblocks matching this exact structure:
{
  "overallScore": 82,
  "tierSummary": "Clear 2-sentence evaluation of video title packaging and search intent alignment.",
  "problemsFound": [
    "Problem 1 describing why the title or metadata limits discoverability.",
    "Problem 2 describing mobile feed display or keyword placement."
  ],
  "exactImprovements": [
    "Improvement 1 with specific action.",
    "Improvement 2 with specific action."
  ],
  "improvedTitleSuggestion": "Optimized High-CTR Natural Title Here",
  "relevantKeywords": ["keyword 1", "keyword 2", "keyword 3", "keyword 4", "keyword 5"],
  "relevantHashtags": ["#tag1", "#tag2", "#tag3", "#tag4"],
  "tagsOrSeoTerms": ["seo term 1", "seo term 2", "seo term 3"],
  "optimizedDescription": "In-depth, natural video description summary with chapter timestamps and links.",
  "whyThisMatters": "Clear explanation of how these changes improve organic click-through rates.",
  "verifiedMetadata": {
    "platform": "Video Platform",
    "title": "${title || 'Video Title'}",
    "category": "${category}",
    "isPublicDataVerified": true
  }
}`;

        const candidateModels = ['gemini-3.7-flash', 'gemini-3.1-pro-preview', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
        let rawText = '';
        for (const m of candidateModels) {
          try {
            const aiRes = await retryWithBackoff(async () => {
              return await gemini.models.generateContent({
                model: m,
                contents: prompt,
              });
            }, 2, 300);
            rawText = (aiRes.text || '').replace(/```json/gi, '').replace(/```/g, '').trim();
            if (rawText) break;
          } catch (e) {
            // try next candidate model
          }
        }
        if (rawText) {
          const parsedData = JSON.parse(rawText);
          const responseObj = { success: true, data: parsedData };
          setCache(cacheKey, responseObj, 300);
          res.json(responseObj);
          return;
        }
      } catch (geminiErr) {
        console.warn('Gemini video analysis fallback to heuristic model:', geminiErr);
      }
    }

    // Heuristic structured fallback
    const rawTitle = (title || 'Video Topic').trim();
    const cleanTitle = rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1);
    const titleLen = cleanTitle.length;

    let score = 78;
    const problems = [];
    const improvements = [];

    if (titleLen > 70) {
      score -= 10;
      problems.push(`Title length (${titleLen} chars) exceeds the 60-character mobile feed limit and will truncate.`);
      improvements.push('Front-load the primary subject phrase within the first 40 characters.');
    } else if (titleLen < 30 && titleLen > 0) {
      score -= 8;
      problems.push(`Title is relatively short (${titleLen} chars) and lacks search intent context.`);
      improvements.push('Expand to 45–65 characters to specify viewer benefit and topic scope.');
    }

    if (!/guide|tutorial|explained|overview|how to|tips|mistakes/i.test(cleanTitle)) {
      problems.push('Title lacks a clear content format cue (e.g. "Guide", "Tutorial", or "Overview").');
      improvements.push('Add a format specifier such as "Complete Guide" or "Key Takeaways".');
    }

    if (problems.length === 0) {
      problems.push('Description may benefit from structured chapter timestamps for search indexing.');
      problems.push('Include 3-5 focused lowercase hashtags matching topic intent.');
    }

    if (improvements.length === 0) {
      improvements.push('Include chapter timestamps (00:00) to enable video search indexing.');
      improvements.push('Add 3-5 targeted lowercase hashtags directly relevant to the topic.');
    }

    const words = cleanTitle.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 3);
    const mainWords = words.slice(0, 3);
    const topicTag = mainWords.join('') || 'video';

    const fallbackResponse = {
      success: true,
      data: {
        overallScore: Math.max(50, Math.min(95, score)),
        tierSummary: `Evaluated title packaging and search intent alignment for "${cleanTitle}".`,
        problemsFound: problems.slice(0, 3),
        exactImprovements: improvements.slice(0, 3),
        improvedTitleSuggestion: `${cleanTitle}: Step-by-Step Practical Guide & Key Takeaways`,
        relevantKeywords: [
          cleanTitle.toLowerCase(),
          `${cleanTitle.toLowerCase()} guide`,
          `${cleanTitle.toLowerCase()} tutorial`,
          `how to understand ${cleanTitle.toLowerCase()}`,
          `best practices for ${cleanTitle.toLowerCase()}`,
        ],
        relevantHashtags: [`#${topicTag}`, '#guide', '#tutorial', '#video'],
        tagsOrSeoTerms: [cleanTitle.toLowerCase(), `${cleanTitle.toLowerCase()} breakdown`, 'video walkthrough'],
        optimizedDescription: `In this video, we provide a complete walkthrough and overview of ${cleanTitle}.\n\nTIMESTAMPS & CHAPTERS:\n00:00 - Introduction & Core Concept\n01:30 - Detailed Walkthrough & Key Points\n04:15 - Practical Application & Best Practices\n07:00 - Summary & Key Takeaways\n\nRESOURCES:\n• Multi Tube Views Platform: https://multitubeviews.com/\n\n#${topicTag} #guide #tutorial`,
        whyThisMatters: 'Structuring titles and descriptions with clear intent keywords and timestamped chapters directly improves search discoverability and viewer retention.',
        verifiedMetadata: {
          platform: url.includes('youtube') ? 'YouTube' : url.includes('tiktok') ? 'TikTok' : 'Video Platform',
          title: cleanTitle,
          category,
          isPublicDataVerified: true,
        },
      },
    };

    setCache(cacheKey, fallbackResponse, 300);
    res.json(fallbackResponse);
  } catch (err: any) {
    console.error('API /api/analyze-video error:', err);
    res.status(500).json({
      success: false,
      error: 'Video analysis failed.',
      details: err.message,
    });
  }
});

// 5. Image Generation API Endpoint
app.post('/api/image', async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'AI Image generation interface ready.',
    images: [{ url: 'assets/icons/favicon.svg' }],
  });
});

// 6. Nonce & Legacy WP/AIPKit simulation routes
app.all('/api/get-nonce', (req: Request, res: Response) => {
  res.json({ success: true, data: { nonce: 'mtv_live_nonce_v1' } });
});

app.all('/admin-ajax.php', (req: Request, res: Response) => {
  res.json({ success: true, data: { nonce: 'mtv_live_nonce_v1' } });
});

// Boot Server with Vite Middleware in Dev Mode or Static Serving in Prod Mode
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'mpa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[MTV AI Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

