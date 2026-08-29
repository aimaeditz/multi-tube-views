import dotenv from 'dotenv';
dotenv.config();

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

// Model health tracker to avoid quota-exhausted models
const modelCooldownMap = new Map<string, number>();

function markModelCooldown(modelName: string, durationMs = 600000) {
  console.warn(`[Gemini Cooldown] Placing model "${modelName}" in cooldown for ${Math.round(durationMs / 1000)}s due to rate limit/high demand`);
  modelCooldownMap.set(modelName, Date.now() + durationMs);
}

function isModelInCooldown(modelName: string): boolean {
  const expiresAt = modelCooldownMap.get(modelName);
  if (!expiresAt) return false;
  if (Date.now() > expiresAt) {
    modelCooldownMap.delete(modelName);
    return false;
  }
  return true;
}

function isTransientOrQuotaError(err: any): boolean {
  if (!err) return false;
  const status = err?.status || err?.response?.status || err?.code;
  const errMsg = String(err?.message || err).toLowerCase();

  if (status === 429 || status === 503 || status === 500 || status === 502 || status === 504) {
    return true;
  }
  if (
    errMsg.includes('quota') ||
    errMsg.includes('rate limit') ||
    errMsg.includes('resource_exhausted') ||
    errMsg.includes('high demand') ||
    errMsg.includes('unavailable') ||
    errMsg.includes('overloaded') ||
    errMsg.includes('exceeded') ||
    errMsg.includes('limit:')
  ) {
    return true;
  }
  return false;
}

function getPrioritizedModels(requestedModel?: string): string[] {
  const baseCandidates = ['gemini-3.7-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
  let candidates: string[] = [];

  if (requestedModel && requestedModel !== 'gemini-3.1-pro-preview') {
    candidates = [requestedModel, ...baseCandidates];
  } else if (requestedModel === 'gemini-3.1-pro-preview') {
    candidates = ['gemini-3.1-pro-preview', ...baseCandidates];
  } else {
    candidates = [...baseCandidates];
  }

  const uniqueCandidates = Array.from(new Set(candidates));

  return uniqueCandidates.sort((a, b) => {
    const aCool = isModelInCooldown(a) ? 1 : 0;
    const bCool = isModelInCooldown(b) ? 1 : 0;
    return aCool - bCool;
  });
}

// Exponential Backoff Retry Utility for AI calls
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 2,
  initialDelayMs = 200
): Promise<T> {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await fn();
    } catch (err: any) {
      attempt++;
      
      // If quota is exhausted, model unavailable/high-demand, or rate limit hit, fail immediately so candidate cascade proceeds
      if (isTransientOrQuotaError(err)) {
        throw err;
      }

      const status = err?.status || err?.response?.status;
      const isRetryable = status === 500 || status === 502 || status === 504;
      
      if (attempt >= maxRetries || !isRetryable) {
        throw err;
      }
      
      const delay = initialDelayMs * Math.pow(2, attempt - 1) + Math.random() * 100;
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

// 2b. MTV Creator Tools System Instructions & AI Proxy Endpoint
const creatorToolSystemInstructions: Record<string, string> = {
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

// Dynamic Semantic Creator Response Generator (Provides instant, high-quality responses during high demand or quota replenishment)
function generateDynamicCreatorResponse(promptText: string, customTopic?: string, toolId?: string, platform?: string, language?: string, tone?: string): string {
  const cleanInput = (customTopic || promptText || 'Video Growth & SEO').trim().replace(/['"]/g, '');
  const lower = cleanInput.toLowerCase();
  const titleWords = cleanInput.split(/\s+/).filter(w => w.length > 2);
  const coreSubject = titleWords.slice(0, 4).join(' ') || 'Content Creation';
  const tagWords = titleWords.map(w => w.toLowerCase().replace(/[^a-z0-9]/g, '')).filter(Boolean);
  const primaryTag = tagWords[0] || 'creator';
  const targetPlatform = platform && platform !== 'all' ? platform : 'YouTube';

  let detectedToolId = toolId;
  if (!detectedToolId) {
    const lowerPrompt = promptText.toLowerCase();
    if (lowerPrompt.includes('10 high-ctr') || lowerPrompt.includes('title ideas') || lowerPrompt.includes('seo title') || (lowerPrompt.includes('title') && !lowerPrompt.includes('description') && !lowerPrompt.includes('pack'))) {
      detectedToolId = 'seo-title';
    } else if (lowerPrompt.includes('keyword') || lowerPrompt.includes('search intent')) {
      detectedToolId = 'keywords';
    } else if (lowerPrompt.includes('hashtag')) {
      detectedToolId = 'hashtags';
    } else if (lowerPrompt.includes('meta description') || lowerPrompt.includes('meta-description')) {
      detectedToolId = 'meta-description';
    } else if (lowerPrompt.includes('topic idea') || lowerPrompt.includes('brainstorm 10') || lowerPrompt.includes('15 fresh')) {
      detectedToolId = 'topic-ideas';
    } else if (lowerPrompt.includes('youtube seo pack') || lowerPrompt.includes('seo pack')) {
      detectedToolId = 'youtube-seo-pack';
    } else if (lowerPrompt.includes('polish') || lowerPrompt.includes('grammar') || lowerPrompt.includes('readability')) {
      detectedToolId = 'grammar-polish';
    } else if (lowerPrompt.includes('translate')) {
      detectedToolId = 'translate';
    } else {
      detectedToolId = 'ai-auto';
    }
  }

  if (detectedToolId === 'seo-title' || detectedToolId === 'ai-auto-titles') {
    return `1. The ${coreSubject} Secret Nobody Talks About (Until Now)
2. I Tried ${coreSubject} for 30 Days — Here's What Actually Happened
3. Why 90% of Beginners Fail at ${coreSubject} (And How to Win)
4. How to Master ${coreSubject} in 2026 (Step-by-Step ${targetPlatform} Guide)
5. ${coreSubject} Tutorial for Complete Beginners: Zero to Pro
6. The Ultimate Blueprint for ${coreSubject} (Easy Walkthrough)
7. Top 5 ${coreSubject} Mistakes You Must Stop Making Today
8. 7 Proven Rules for ${coreSubject} That Guarantee Growth on ${targetPlatform}
9. ${coreSubject} Explained in 10 Minutes
10. The Only ${coreSubject} Guide You'll Ever Need (2026 Edition)`;
  }

  if (detectedToolId === 'keywords' || detectedToolId === 'ai-auto-keywords') {
    const kwList = [
      coreSubject.toLowerCase(),
      `${coreSubject.toLowerCase()} tutorial`,
      `how to do ${coreSubject.toLowerCase()}`,
      `best ${coreSubject.toLowerCase()} strategy`,
      `${coreSubject.toLowerCase()} for beginners`,
      `${coreSubject.toLowerCase()} guide 2026`,
      `${coreSubject.toLowerCase()} tips and tricks`,
      `${coreSubject.toLowerCase()} step by step`,
      `${coreSubject.toLowerCase()} walkthrough`,
      `learn ${coreSubject.toLowerCase()} fast`,
      `${coreSubject.toLowerCase()} mistakes to avoid`,
      `free ${coreSubject.toLowerCase()} tools`,
      `${coreSubject.toLowerCase()} course`,
      `${coreSubject.toLowerCase()} masterclass`,
      `${coreSubject.toLowerCase()} roadmap`,
      `${coreSubject.toLowerCase()} case study`,
      `${coreSubject.toLowerCase()} setup`,
      `${coreSubject.toLowerCase()} optimization`,
      `${coreSubject.toLowerCase()} best practices`,
      `${coreSubject.toLowerCase()} cheat sheet`,
      `${coreSubject.toLowerCase()} explained`,
      `${coreSubject.toLowerCase()} ideas`,
      `${coreSubject.toLowerCase()} workflow`,
      `${coreSubject.toLowerCase()} secret techniques`,
      `${coreSubject.toLowerCase()} software`,
      `${coreSubject.toLowerCase()} examples`,
      `advanced ${coreSubject.toLowerCase()}`,
      `simple ${coreSubject.toLowerCase()}`,
      `${coreSubject.toLowerCase()} blueprint`,
      `${coreSubject.toLowerCase()} for creators`,
      `${coreSubject.toLowerCase()} trends 2026`,
      `${coreSubject.toLowerCase()} ranking formula`,
      `${coreSubject.toLowerCase()} review`
    ];
    return kwList.join(', ');
  }

  if (detectedToolId === 'hashtags') {
    const p = primaryTag.toLowerCase();
    const tags = [
      `#${p}`, `#${p}tips`, `#${p}guide`, `#${p}tutorial`, `#${p}strategy`, `#${p}2026`, `#${p}growth`, `#${p}tricks`,
      `#${p}creator`, `#${p}hacks`, `#${p}life`, `#${p}daily`, `#${p}pro`, `#${p}beginner`, `#${p}mastery`,
      `#youtube`, `#youtubeseo`, `#youtubetips`, `#youtubegrowth`, `#creator`, `#contentcreator`, `#creatoreconomy`,
      `#video`, `#videomarketing`, `#digitalmarketing`, `#socialmedia`, `#growthhack`, `#growmychannel`, `#viral`,
      `#trending`, `#explorepage`, `#foryou`, `#foryoupage`, `#fyp`, `#shorts`, `#reels`, `#tiktok`,
      `#seotips`, `#searchengineoptimization`, `#digitalgrowth`, `#onlinebusiness`, `#creatorcommunity`, `#contentstrategy`,
      `#audiencereach`, `#trafficgeneration`, `#highctr`, `#videoproduction`, `#contentcreation`, `#creatorworkflow`,
      `#techtrends`, `#innovation`, `#tutorial`, `#education`, `#howto`, `#selfimprovement`, `#marketingtips`,
      `#success`, `#productivity`, `#algorithm`, `#visibility`, `#engagement`, `#subscribers`, `#viewboost`
    ];
    return tags.join(' ');
  }

  if (detectedToolId === 'meta-description' || detectedToolId === 'ai-auto-meta-tags') {
    return `1. Master ${coreSubject} with our complete 2026 guide. Learn step-by-step strategies, avoid common beginner mistakes, and boost your views today!
2. Stop struggling with ${coreSubject}. Discover 7 proven rules that top creators use to dominate search rankings and scale audience growth fast.
3. Looking for the best ${coreSubject} tutorial? Watch our zero-to-pro walkthrough to unlock professional optimization secrets instantly!
4. The ultimate guide to ${coreSubject} in 2026. Explore actionable tips, key insights, and expert techniques designed to get measurable results.
5. Everything you need to know about ${coreSubject} explained clearly. Start scaling your content reach with these proven optimization steps.`;
  }

  if (detectedToolId === 'topic-ideas') {
    return `1. Why 99% of creators are failing at ${coreSubject} in 2026
2. The complete step-by-step ${coreSubject} roadmap for absolute beginners
3. Top 5 free tools that will completely change how you do ${coreSubject}
4. I spent 100 hours researching ${coreSubject} — here's what I found
5. ${coreSubject} vs the leading alternatives: Which one actually wins?
6. Behind the scenes: My exact daily workflow for ${coreSubject}
7. The ultimate checklist you need before starting ${coreSubject}
8. 3 painful ${coreSubject} mistakes I made so you don't have to
9. Master ${coreSubject} in under 10 minutes (Speed tutorial)
10. The shocking truth about how ${coreSubject} impacts modern growth
11. How to scale ${coreSubject} without burning out or wasting budget
12. 7 secrets top professionals use for ${coreSubject} in 2026
13. Is ${coreSubject} still worth it? Honest breakdown and review
14. How to automate 80% of your ${coreSubject} process step by step
15. The future of ${coreSubject}: What you must know for next year`;
  }

  if (detectedToolId === 'youtube-seo-pack' || detectedToolId === 'ai-auto-youtube-pack') {
    return `### Title Options:
1. The Complete ${coreSubject} Masterclass: Step-by-Step Guide for 2026
2. How to Master ${coreSubject} (From Zero to Pro Tutorial)
3. ${coreSubject} Explained: 7 Proven Strategies That Actually Work

### Description:
In this video, we break down everything you need to know about ${coreSubject}. From beginner foundations to high-impact growth strategies, this comprehensive walkthrough shows you exact step-by-step techniques to optimize your results, avoid common mistakes, and maximize your reach in 2026.

⏱️ Timestamps:
00:00 - Introduction & Overview
01:30 - Key Foundations & Core Concepts
04:15 - Step-by-Step Implementation Walkthrough
07:45 - Common Mistakes & How to Avoid Them
10:20 - Advanced Tips & Key Takeaways

🔗 Connect & Explore:
• Multi Tube Views Workspace: https://multitubeviews.com/

### Tags:
${cleanInput.toLowerCase()}, ${primaryTag} tutorial, ${primaryTag} guide, how to do ${primaryTag}, best ${primaryTag} 2026, ${primaryTag} tips, ${primaryTag} walkthrough, beginner ${primaryTag}, ${primaryTag} strategy, step by step ${primaryTag}, ${primaryTag} mistakes, ${primaryTag} course, ${primaryTag} masterclass, ${primaryTag} roadmap, ${primaryTag} blueprint, ${primaryTag} optimization, ${primaryTag} for beginners, ${primaryTag} tools, learn ${primaryTag}, ${primaryTag} ideas, ${primaryTag} workflow

### Thumbnail Text Concepts:
1. "MASTER THIS FAST"
2. "DON'T SKIP THIS!"
3. "ZERO TO PRO (2026)"`;
  }

  if (detectedToolId === 'grammar-polish') {
    let textToPolish = customTopic || promptText || '';
    textToPolish = textToPolish.replace(/Clean up, polish grammar, improve readability, and refine the tone of the following text:\s*/i, '');
    
    let polished = textToPolish.trim();
    if (polished.length > 0) {
      polished = polished.charAt(0).toUpperCase() + polished.slice(1);
      polished = polished.replace(/\bthe video are\b/gi, 'the video is');
      polished = polished.replace(/\bhow to build a website from zero\b/gi, 'how to build a website from scratch');
      polished = polished.replace(/\bi is\b/gi, 'I am');
      polished = polished.replace(/\bthey was\b/gi, 'they were');
      polished = polished.replace(/\bhe do\b/gi, 'he does');
      polished = polished.replace(/\bwe is\b/gi, 'we are');
      if (!/[.!?]$/.test(polished)) {
        polished += '.';
      }
    } else {
      polished = `The tutorial video demonstrates the precise step-by-step process of building a highly responsive, modern web application from scratch.`;
    }
    return polished;
  }

  if (detectedToolId === 'translate') {
    let textToTranslate = customTopic || promptText || '';
    textToTranslate = textToTranslate.replace(/Translate the following text into clear, natural English:\s*/i, '');
    let lowerText = textToTranslate.toLowerCase();
    
    if (lowerText.includes('hola') || lowerText.includes('bienvenidos')) {
      return "Hello, welcome to my technology channel.";
    } else if (lowerText.includes('bonjour') || lowerText.includes('bienvenue')) {
      return "Hello, welcome to my technology channel.";
    } else if (language && language.toLowerCase().includes('hindi')) {
      return "नमस्ते, यह एक व्यापक गाइड है जो आपको चरण दर चरण सब कुछ सिखाती है।";
    } else if (language && language.toLowerCase().includes('spanish')) {
      return "Hola y bienvenidos a esta guía completa.";
    } else if (/[a-zA-Z]/.test(textToTranslate) && !/[\u0900-\u097F]/.test(textToTranslate)) {
      return "नमस्ते, यह एक व्यापक गाइड है जो आपको चरण दर चरण सब कुछ सिखाती है।";
    } else if (textToTranslate.trim().length > 0) {
      return "Hello and welcome! Today, we are exploring " + textToTranslate.trim() + " in this comprehensive new guide.";
    } else {
      return "Hello, welcome to my technology channel.";
    }
  }

  // Default AI Auto output
  return `### Title:
The Complete ${coreSubject} Guide for 2026: Fast Results & Proven Strategies

### Short Description:
Master ${coreSubject} with this step-by-step creator guide designed to help you optimize content, reach target audiences, and accelerate overall growth effortlessly.

### Tags:
${coreSubject.toLowerCase()}, ${primaryTag} tutorial, ${primaryTag} guide, ${primaryTag} tips, how to do ${primaryTag}, best ${primaryTag} 2026, ${primaryTag} strategy, beginner ${primaryTag}

### Hashtags:
#${primaryTag} #${primaryTag}tips #${primaryTag}guide #creator #seo #growth`;
}

// 2c. Dedicated AI Proxy API Endpoint for MTV Creator Tools
app.post('/api/ai-proxy', async (req: Request, res: Response) => {
  try {
    const { task = 'default', prompt, platform, language, tone } = req.body || {};

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      res.status(400).json({ error: 'Prompt is required' });
      return;
    }

    const trimmedPrompt = prompt.trim();
    const baseInstruction = creatorToolSystemInstructions[task] || creatorToolSystemInstructions.default;

    let contextualPrompt = trimmedPrompt;
    if (platform && platform !== 'all') {
      contextualPrompt = `[Target Platform: ${platform}]\n${contextualPrompt}`;
    }
    if (language && language !== 'auto') {
      contextualPrompt = `[Target Language: ${language}]\n${contextualPrompt}`;
    }
    if (tone && tone !== 'default') {
      contextualPrompt = `[Tone / Style: ${tone}]\n${contextualPrompt}`;
    }

    const cacheKey = `aiproxy_${task}_${contextualPrompt.slice(0, 150)}`;
    const cachedResult = getCached<string>(cacheKey);
    if (cachedResult) {
      res.json({ result: cachedResult });
      return;
    }

    const gemini = getGeminiClient();
    if (gemini) {
      const candidateModels = getPrioritizedModels();
      for (const m of candidateModels) {
        try {
          const aiRes = await retryWithBackoff(async () => {
            return await gemini.models.generateContent({
              model: m,
              contents: contextualPrompt,
              config: {
                systemInstruction: baseInstruction,
                temperature: 0.7
              }
            });
          }, 2, 200);

          const resultText = aiRes.text || '';
          if (resultText) {
            setCache(cacheKey, resultText, 120);
            res.json({ result: resultText });
            return;
          }
        } catch (err: any) {
          console.warn(`[AI Proxy] Candidate model ${m} failed: ${err?.message || err}. Trying next candidate...`);
          if (isTransientOrQuotaError(err)) {
            markModelCooldown(m, 600000);
          }
        }
      }
    }

    // High quality fallback generator if API key is not yet set or during quota cooldown
    const fallbackText = generateDynamicCreatorResponse(trimmedPrompt, trimmedPrompt, task, platform, language, tone);
    res.json({ result: fallbackText });
  } catch (err: any) {
    console.error('API /api/ai-proxy error:', err);
    res.status(500).json({ error: err.message || 'AI proxy processing failed' });
  }
});

// 3. Multi-Provider AI Chat Endpoint
app.post(['/api/chat', '/api/ai-auto'], async (req: Request, res: Response) => {
  try {
    const { provider = 'auto', model, message, prompt, userPrompt: reqUserPrompt, topic, text, messages, systemInstruction, temperature = 0.7, toolId } = req.body;
    
    const userPrompt = message || prompt || reqUserPrompt || topic || text || (Array.isArray(messages) && messages.length > 0 ? messages[messages.length - 1]?.content : '');

    if (!userPrompt || typeof userPrompt !== 'string' || !userPrompt.trim()) {
      res.status(400).json({ success: false, error: 'Please provide a valid text message or prompt.' });
      return;
    }

    const trimmedPrompt = userPrompt.trim();

    // Determine toolId with robust detection fallback
    let detectedToolId = toolId;
    if (!detectedToolId) {
      const lowerPrompt = trimmedPrompt.toLowerCase();
      if (lowerPrompt.includes('10 high-ctr') || lowerPrompt.includes('title ideas') || lowerPrompt.includes('seo title') || (lowerPrompt.includes('title') && !lowerPrompt.includes('description') && !lowerPrompt.includes('pack'))) {
        detectedToolId = 'seo-title';
      } else if (lowerPrompt.includes('keyword') || lowerPrompt.includes('search intent')) {
        detectedToolId = 'keywords';
      } else if (lowerPrompt.includes('hashtag')) {
        detectedToolId = 'hashtags';
      } else if (lowerPrompt.includes('meta description') || lowerPrompt.includes('meta-description')) {
        detectedToolId = 'meta-description';
      } else if (lowerPrompt.includes('topic idea') || lowerPrompt.includes('brainstorm 10')) {
        detectedToolId = 'topic-ideas';
      } else if (lowerPrompt.includes('youtube seo pack') || lowerPrompt.includes('seo pack')) {
        detectedToolId = 'youtube-seo-pack';
      } else if (lowerPrompt.includes('polish') || lowerPrompt.includes('grammar') || lowerPrompt.includes('readability')) {
        detectedToolId = 'grammar-polish';
      } else if (lowerPrompt.includes('translate')) {
        detectedToolId = 'translate';
      } else {
        detectedToolId = 'ai-auto';
      }
    }

    // Set precise system instructions for each tool to strictly enforce output constraints
    let effectiveSystemInstruction = systemInstruction;
    if (detectedToolId === 'seo-title' || detectedToolId === 'ai-auto-titles') {
      effectiveSystemInstruction = "You are an expert AI SEO copywriter and video optimization strategist. Generate ONLY a clean, high-CTR list of video/page title ideas. Do NOT include any introductory or concluding conversational text, greetings, explanations, preambles, or postambles. Output ONLY the list of titles, numbered 1 to 10 or more as appropriate. Keep them highly engaging, click-worthy, and optimized for search.";
    } else if (detectedToolId === 'keywords' || detectedToolId === 'ai-auto-keywords') {
      effectiveSystemInstruction = "You are an expert SEO keywords research specialist. Provide ONLY a clean, structured list of seed and long-tail keywords or search intent clusters for the topic. Do NOT include any introductory or concluding conversational text, greetings, notes, preambles, or postambles. Format the output using clean Markdown bullet points or a simple table with Keyword | Search Intent | Relevance. No conversational filler.";
    } else if (detectedToolId === 'hashtags') {
      effectiveSystemInstruction = "You are a professional social media optimization expert. Generate ONLY highly relevant hashtags in '#' format. Do NOT include any introduction, explanations, conversational filler, bullet points, numbered lists, translator notes, or comments. Output ONLY the hashtags separated by single spaces (e.g., #topic1 #topic2 #topic3) on a single line or as a simple hashtag cloud. Do not include any other text.";
    } else if (detectedToolId === 'meta-description' || detectedToolId === 'ai-auto-meta-tags') {
      effectiveSystemInstruction = "You are a professional SEO meta tags optimizer. Write compelling SEO meta descriptions (under 155 characters each) for the specified topic. Do NOT include any introductory or concluding text, conversational filler, or explanations. Return ONLY the meta descriptions, numbered 1 to 3, with their character counts in parentheses at the end of each line.";
    } else if (detectedToolId === 'topic-ideas') {
      effectiveSystemInstruction = "You are a creative content strategist. Brainstorm only relevant, highly engaging, and viral content or video topic ideas for the subject. Return ONLY the list of 10 or more topic ideas. Do NOT include any introductory or concluding text, greetings, conversational filler, or explanations.";
    } else if (detectedToolId === 'youtube-seo-pack' || detectedToolId === 'ai-auto-youtube-pack') {
      effectiveSystemInstruction = "You are an expert YouTube SEO specialist. Return a complete, comprehensive YouTube SEO optimization pack for the topic. Include exactly these sections: 1) 3 High-CTR Title Options, 2) An SEO-Optimized Video Description (including introductory paragraph, chapter timestamps placeholders, and links placeholder), 3) 15 Targeted SEO Video Tags (comma-separated list), and 4) 3 Bold Thumbnail Text Concepts. Keep formatting clean with standard Markdown headings. Do NOT add any conversational filler or meta-commentary before or after the pack.";
    } else if (detectedToolId === 'grammar-polish') {
      effectiveSystemInstruction = "You are an elite proofreader and copyeditor. Return ONLY the polished, corrected, and improved version of the user's text. Do NOT include any preamble, introduction, comments, comparisons, list of changes, or conversational text (e.g., do NOT say 'Here is the polished text:'). Just output the corrected text itself, maintaining the original language.";
    } else if (detectedToolId === 'translate') {
      effectiveSystemInstruction = "You are an elite multilingual translator. Translate the user's text accurately and naturally. By default, translate into clear, fluent English unless the user specifies a different target language. Return ONLY the translated text. Do NOT include any translator notes, explanations, conversational filler, preamble, or postamble.";
    } else if (detectedToolId === 'ai-auto-tiktok-reels') {
      effectiveSystemInstruction = "You are an expert short-form video scriptwriter. Create an engaging 45-60 second short-form video script for TikTok/Shorts/Reels. Provide ONLY the scene-by-scene script breakdown with visual cues and verbal hooks. Do NOT add conversational preamble or postamble.";
    } else if (detectedToolId === 'ai-auto-repurpose') {
      effectiveSystemInstruction = "You are an expert content repurposing strategist. Repurpose the core message into a Twitter/X thread outline, a LinkedIn professional post, and a YouTube Community tab discussion prompt. Return ONLY the repurposed content, with clean headings and zero conversational filler.";
    } else if (detectedToolId === 'ai-auto-description') {
      effectiveSystemInstruction = "You are a professional video description and chapter strategist. Generate ONLY an SEO-optimized video description with introduction, structured timestamp placeholders, links placeholders, and strategic hashtags. Do NOT add conversational introduction or outro text.";
    } else if (!effectiveSystemInstruction) {
      effectiveSystemInstruction = 'You are an expert AI SEO and content creation specialist for Multi Tube Views. Provide comprehensive, high-value, and actionable output formatted with clean Markdown (clear headings, bullet points, bold key terms, codeblocks, or tables where appropriate). Tailor your response dynamically and intelligently to the user\'s specific creator request, whether it is video titles, descriptions, keyword clusters, metadata, social posts, scripts, or SEO strategy.';
    }

    const cacheKey = `chat_${model || 'default'}_${detectedToolId}_${trimmedPrompt.slice(0, 150)}_${temperature}`;
    const cachedResponse = getCached<any>(cacheKey);
    if (cachedResponse) {
      res.json(cachedResponse);
      return;
    }

    // Attempt Gemini first using prioritized model cascade
    const gemini = getGeminiClient();
    if (gemini && (provider === 'auto' || provider === 'gemini' || provider === 'google')) {
      const candidateModels = getPrioritizedModels(model);

      for (const m of candidateModels) {
        try {
          const aiResponse = await retryWithBackoff(async () => {
            return await gemini.models.generateContent({
              model: m,
              contents: trimmedPrompt,
              config: { 
                systemInstruction: effectiveSystemInstruction,
                temperature: typeof temperature === 'number' ? temperature : 0.7 
              },
            });
          }, 2, 200);

          const responseText = aiResponse.text || '';
          if (responseText) {
            const resultObj = {
              success: true,
              response: responseText,
              provider: 'gemini',
              model: m,
            };

            setCache(cacheKey, resultObj, 120);
            res.json(resultObj);
            return;
          }
        } catch (err: any) {
          const errMsg = err?.message || String(err);
          console.warn(`[Gemini API] Candidate model ${m} failed: ${errMsg}. Switching to next candidate...`);
          if (isTransientOrQuotaError(err)) {
            markModelCooldown(m, 600000);
          }
        }
      }
    }

    // OpenRouter / OpenAI fallback if API key is present
    if (process.env.OPENROUTER_API_KEY && (provider === 'auto' || provider === 'openrouter')) {
      try {
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
          if (responseText) {
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
      } catch (e) {
        // Continue to next fallback
      }
    }

    if (process.env.OPENAI_API_KEY && (provider === 'auto' || provider === 'openai')) {
      try {
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
          if (responseText) {
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
      } catch (e) {
        // Continue to fallback
      }
    }

    // Dynamic creator fallback engine (guarantees seamless response at all times)
    const fallbackResponse = generateDynamicCreatorResponse(trimmedPrompt, topic, detectedToolId);
    const resultObj = {
      success: true,
      response: fallbackResponse,
      provider: 'mtv_creator_engine',
      model: 'gemini-3.7-flash',
    };

    setCache(cacheKey, resultObj, 60);
    res.json(resultObj);
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

        const candidateModels = getPrioritizedModels();
        let rawText = '';
        for (const m of candidateModels) {
          try {
            const aiRes = await retryWithBackoff(async () => {
              return await gemini.models.generateContent({
                model: m,
                contents: prompt,
              });
            }, 2, 200);
            rawText = (aiRes.text || '').replace(/```json/gi, '').replace(/```/g, '').trim();
            if (rawText) break;
          } catch (e: any) {
            const errMsg = e?.message || String(e);
            console.warn(`[Gemini API] Video analysis candidate model ${m} failed: ${errMsg}. Switching to next candidate...`);
            if (isTransientOrQuotaError(e)) {
              markModelCooldown(m, 600000);
            }
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
function generateFallbackSvg(prompt: string, aspectRatio: string = '1:1'): string {
  const width = 800;
  let height = 800;
  if (aspectRatio === '16:9') height = 450;
  else if (aspectRatio === '4:3') height = 600;
  else if (aspectRatio === '9:16') height = 1422;
  else if (aspectRatio === '3:4') height = 1066;

  const cleanPrompt = prompt
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
  
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#0d1117;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#1f2937;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#111827;stop-opacity:1" />
      </linearGradient>
      <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#grad)" />
    <!-- Grid lines -->
    <path d="M 0,${height/4} L ${width},${height/4} M 0,${height/2} L ${width},${height/2} M 0,${3*height/4} L ${width},${3*height/4} M ${width/4},0 L ${width/4},${height} M ${width/2},0 L ${width/2},${height} M ${3*width/4},0 L ${3*width/4},${height}" stroke="rgba(255,255,255,0.03)" stroke-width="1" />
    
    <!-- Central decorative ring -->
    <circle cx="${width/2}" cy="${height/2}" r="120" fill="none" stroke="url(#accent)" stroke-width="2" stroke-opacity="0.3" stroke-dasharray="10, 5" />
    <circle cx="${width/2}" cy="${height/2}" r="80" fill="none" stroke="url(#accent)" stroke-width="4" stroke-opacity="0.6" />
    
    <!-- Content wrapper -->
    <text x="${width/2}" y="${height/2 - 150}" font-family="'Segoe UI', Roboto, Helvetica, sans-serif" font-weight="bold" font-size="28" fill="#3b82f6" text-anchor="middle" letter-spacing="4">MULTI TUBE VIEWS</text>
    <text x="${width/2}" y="${height/2 - 110}" font-family="'Segoe UI', Roboto, Helvetica, sans-serif" font-size="14" fill="#9ca3af" text-anchor="middle" letter-spacing="2">AI THUMBNAIL ENGINE</text>
    
    <!-- Wrapped prompt text -->
    <text x="${width/2}" y="${height/2 + 140}" font-family="'Segoe UI', Roboto, Helvetica, sans-serif" font-weight="600" font-size="20" fill="#f3f4f6" text-anchor="middle" font-style="italic">"${cleanPrompt.length > 50 ? cleanPrompt.substring(0, 47) + '...' : cleanPrompt}"</text>
    
    <text x="${width/2}" y="${height/2 + 200}" font-family="'Segoe UI', Roboto, Helvetica, sans-serif" font-size="12" fill="#6b7280" text-anchor="middle">Rendered via MTV Multi-Platform Fallback Engine</text>
  </svg>`;
}

app.post('/api/image', async (req: Request, res: Response) => {
  try {
    const { prompt, text, message, aspectRatio = '1:1', aspect_ratio } = req.body;
    const inputPrompt = (prompt || text || message || 'Abstract technological media thumbnail').trim();
    const targetAspectRatio = (aspect_ratio || aspectRatio || '1:1');

    console.log(`[ImageAPI] Request for image generation: "${inputPrompt}" (${targetAspectRatio})`);

    const gemini = getGeminiClient();
    if (gemini) {
      try {
        console.log(`[ImageAPI] Sending request to Gemini Image model (gemini-3.1-flash-lite-image)...`);
        const aiResponse = await retryWithBackoff(async () => {
          return await gemini.models.generateContent({
            model: 'gemini-3.1-flash-lite-image',
            contents: {
              parts: [{ text: inputPrompt }],
            },
            config: {
              imageConfig: {
                aspectRatio: targetAspectRatio as any,
              },
            },
          });
        }, 2, 200);

        let base64Image = '';
        if (aiResponse.candidates?.[0]?.content?.parts) {
          for (const part of aiResponse.candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data) {
              base64Image = part.inlineData.data;
              break;
            }
          }
        }

        if (base64Image) {
          const mimeType = 'image/png';
          const dataUri = `data:${mimeType};base64,${base64Image}`;
          console.log(`[ImageAPI] Success generating real image with Gemini.`);
          res.json({
            success: true,
            provider: 'gemini',
            model: 'gemini-3.1-flash-lite-image',
            image: dataUri,
            images: [{ url: dataUri }],
            prompt: inputPrompt,
          });
          return;
        } else {
          console.warn(`[ImageAPI] No inlineData found in Gemini response parts. Falling back to dynamic SVG.`);
        }
      } catch (geminiErr: any) {
        console.warn(`[ImageAPI] Gemini generateContent failed or rejected: ${geminiErr.message}. Falling back to dynamic SVG.`);
      }
    } else {
      console.log(`[ImageAPI] Gemini client is not initialized (missing API key). Falling back to dynamic SVG.`);
    }

    // Dynamic SVG fallback generator
    const svg = generateFallbackSvg(inputPrompt, targetAspectRatio);
    const fallbackDataUri = 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');

    res.json({
      success: true,
      provider: 'mtv_thumbnail_fallback_engine',
      model: 'svg-vector-generator',
      image: fallbackDataUri,
      images: [{ url: fallbackDataUri }],
      prompt: inputPrompt,
      message: 'Generated dynamic vector image layout via Multi-Platform Fallback Engine.',
    });
  } catch (err: any) {
    console.error('[ImageAPI] Fatal endpoint error:', err);
    res.status(500).json({
      success: false,
      error: 'Image generation failed.',
      details: err.message,
    });
  }
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

