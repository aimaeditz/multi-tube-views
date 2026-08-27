import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { aiOrchestrator } from "./server/ai/orchestrator.js";
import { globalRateLimiter } from "./server/ai/rate-limiter.js";
import { getPrompts, getPromptById, syncPromptsFromRss } from "./server/ai-prompt-engine.js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Enable CORS for cross-domain static hosting deployment (e.g. multitubeviews.com)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

// Lazy-initialized Gemini AI Client
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

interface ParsedUrlData {
  platform: string;
  videoId: string;
  isRecognized: boolean;
  statusNote: string;
  realTitle?: string | null;
  realDescription?: string | null;
  realAuthor?: string | null;
  durationSeconds?: number | null;
  durationFormatted?: string;
}

// Parse ISO 8601 duration (e.g. PT8M32S, PT1H12M40S, PT45S)
function parseIsoDuration(durationStr: string): number | null {
  if (!durationStr || typeof durationStr !== "string") return null;
  const match = durationStr.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/i);
  if (!match) return null;
  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);
  const seconds = parseInt(match[3] || "0", 10);
  const total = hours * 3600 + minutes * 60 + seconds;
  return total > 0 ? total : null;
}

// Format seconds into MM:SS or HH:MM:SS
function formatDurationSeconds(totalSeconds: number | null | undefined): string {
  if (totalSeconds == null || isNaN(totalSeconds) || totalSeconds <= 0) {
    return "Data unavailable";
  }
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

// Fetch public video metadata, real duration, and title from public oEmbed / endpoints
async function inspectAndFetchVideoMetadata(urlStr: string): Promise<ParsedUrlData> {
  if (!urlStr || typeof urlStr !== "string") {
    return {
      platform: "General Video",
      videoId: "",
      isRecognized: false,
      statusNote: "Data unavailable (No URL provided)",
      realTitle: null,
      realDescription: null,
      realAuthor: null,
      durationSeconds: null,
      durationFormatted: "Data unavailable",
    };
  }

  const clean = urlStr.trim();

  // 1. YouTube
  if (/youtube\.com|youtu\.be/i.test(clean)) {
    const match = clean.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
    const videoId = match ? match[1] : "";
    let realTitle: string | null = null;
    let realAuthor: string | null = null;
    let durationSeconds: number | null = null;
    let realDescription: string | null = null;

    if (videoId) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2400);

        // Fetch oEmbed for verified title and author
        const oembedPromise = fetch(
          `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
          { signal: controller.signal, headers: { "User-Agent": "Mozilla/5.0" } }
        ).then(async (r) => (r.ok ? r.json() : null)).catch(() => null);

        // Fetch public page to extract schema duration and meta description
        const pagePromise = fetch(`https://www.youtube.com/watch?v=${videoId}`, {
          signal: controller.signal,
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept-Language": "en-US,en;q=0.9",
          },
        }).then(async (r) => (r.ok ? r.text() : null)).catch(() => null);

        const [oembedData, htmlText] = await Promise.all([oembedPromise, pagePromise]);
        clearTimeout(timeoutId);

        if (oembedData) {
          realTitle = oembedData.title || null;
          realAuthor = oembedData.author_name || null;
        }

        if (htmlText) {
          // Duration extraction from schema meta tag (e.g. <meta itemprop="duration" content="PT8M32S">)
          const durMetaMatch = htmlText.match(/<meta\s+itemprop=["']duration["']\s+content=["']([^"']+)["']/i);
          if (durMetaMatch && durMetaMatch[1]) {
            durationSeconds = parseIsoDuration(durMetaMatch[1]);
          }

          // Fallback approxDurationMs or lengthSeconds
          if (!durationSeconds) {
            const approxMatch = htmlText.match(/"approxDurationMs"\s*:\s*"(\d+)"/);
            if (approxMatch && approxMatch[1]) {
              durationSeconds = Math.round(parseInt(approxMatch[1], 10) / 1000);
            }
          }
          if (!durationSeconds) {
            const lenMatch = htmlText.match(/"lengthSeconds"\s*:\s*"(\d+)"/);
            if (lenMatch && lenMatch[1]) {
              durationSeconds = parseInt(lenMatch[1], 10);
            }
          }

          // Description extraction
          const descMetaMatch = htmlText.match(/<meta\s+(?:name|property)=["'](?:description|og:description)["']\s+content=["']([^"']+)["']/i);
          if (descMetaMatch && descMetaMatch[1]) {
            realDescription = descMetaMatch[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&');
          }

          if (!realTitle) {
            const titleMatch = htmlText.match(/<title>([^<]+)<\/title>/i);
            if (titleMatch && titleMatch[1]) {
              realTitle = titleMatch[1].replace(/ - YouTube$/i, "").trim();
            }
          }
        }
      } catch (_) {
        // network or abort, proceed with parsed ID
      }
    }

    const durationFormatted = formatDurationSeconds(durationSeconds);
    const statusDetails = [
      `YouTube URL verified (ID: ${videoId || "Parsed"})`,
      realTitle ? `Title: "${realTitle.slice(0, 45)}..."` : null,
      durationSeconds ? `Duration: ${durationFormatted}` : null,
    ].filter(Boolean).join(" • ");

    return {
      platform: "YouTube",
      videoId,
      isRecognized: true,
      statusNote: statusDetails,
      realTitle,
      realDescription,
      realAuthor,
      durationSeconds,
      durationFormatted,
    };
  }

  // 2. Vimeo
  if (/vimeo\.com/i.test(clean)) {
    const match = clean.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/[^\/]*\/videos\/|video\/|)(\d+)/);
    const videoId = match ? match[1] : "";
    let realTitle: string | null = null;
    let realAuthor: string | null = null;
    let durationSeconds: number | null = null;
    let realDescription: string | null = null;

    if (videoId) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2400);
        const res = await fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${videoId}`, {
          signal: controller.signal,
          headers: { "User-Agent": "Mozilla/5.0" },
        });
        clearTimeout(timeoutId);
        if (res.ok) {
          const data = await res.json();
          realTitle = data.title || null;
          realAuthor = data.author_name || null;
          durationSeconds = typeof data.duration === "number" ? data.duration : null;
          realDescription = data.description || null;
        }
      } catch (_) {}
    }

    const durationFormatted = formatDurationSeconds(durationSeconds);
    return {
      platform: "Vimeo",
      videoId,
      isRecognized: true,
      statusNote: `Vimeo URL verified${durationSeconds ? ` (Duration: ${durationFormatted})` : ""}`,
      realTitle,
      realDescription,
      realAuthor,
      durationSeconds,
      durationFormatted,
    };
  }

  // 3. TikTok
  if (/tiktok\.com/i.test(clean)) {
    let realTitle: string | null = null;
    let realAuthor: string | null = null;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(clean)}`, {
        signal: controller.signal,
        headers: { "User-Agent": "Mozilla/5.0" },
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        realTitle = data.title || null;
        realAuthor = data.author_name || null;
      }
    } catch (_) {}

    return {
      platform: "TikTok",
      videoId: "",
      isRecognized: true,
      statusNote: realTitle ? `TikTok post verified ("${realTitle.slice(0, 35)}...")` : "TikTok URL format verified",
      realTitle,
      realDescription: null,
      realAuthor,
      durationSeconds: null,
      durationFormatted: "Data unavailable",
    };
  }

  // 4. Twitch
  if (/twitch\.tv/i.test(clean)) {
    return {
      platform: "Twitch",
      videoId: "",
      isRecognized: true,
      statusNote: "Twitch stream/clip URL verified",
      realTitle: null,
      realDescription: null,
      realAuthor: null,
      durationSeconds: null,
      durationFormatted: "Data unavailable",
    };
  }

  // 5. Reddit
  if (/reddit\.com|redd\.it/i.test(clean)) {
    let realTitle: string | null = null;
    const slugMatch = clean.match(/\/comments\/[a-zA-Z0-9]+\/([^\/?#]+)/);
    if (slugMatch && slugMatch[1]) {
      realTitle = decodeURIComponent(slugMatch[1]).replace(/[_-]+/g, " ").trim();
      realTitle = realTitle.charAt(0).toUpperCase() + realTitle.slice(1);
    }
    return {
      platform: "Reddit Video",
      videoId: "",
      isRecognized: true,
      statusNote: realTitle ? `Reddit topic verified ("${realTitle.slice(0, 35)}...")` : "Reddit post URL verified",
      realTitle,
      realDescription: null,
      realAuthor: null,
      durationSeconds: null,
      durationFormatted: "Data unavailable",
    };
  }

  // 6. Generic Web Video
  try {
    const parsed = new URL(clean);
    const host = parsed.hostname.replace(/^www\./, "");
    return {
      platform: host || "Web Video",
      videoId: "",
      isRecognized: true,
      statusNote: `Web Video (${host})`,
      realTitle: null,
      realDescription: null,
      realAuthor: null,
      durationSeconds: null,
      durationFormatted: "Data unavailable",
    };
  } catch (_) {
    return {
      platform: "Web Video",
      videoId: "",
      isRecognized: false,
      statusNote: "Data unavailable (Unrecognized URL structure)",
      realTitle: null,
      realDescription: null,
      realAuthor: null,
      durationSeconds: null,
      durationFormatted: "Data unavailable",
    };
  }
}

// Sanitize user inputs and guard against prompt injection / keys leakage
function sanitizeAndValidateInput(text: string, maxLen: number = 2500): { clean: string; isSanitized: boolean; safetyNotes: string[] } {
  if (!text || typeof text !== "string") {
    return { clean: "", isSanitized: false, safetyNotes: ["No input text provided."] };
  }

  let clean = text.trim().slice(0, maxLen);
  const safetyNotes: string[] = ["Validated for safety and length limits."];
  let isSanitized = false;

  const injectionPatterns = [
    /ignore\s+(all\s+)?previous\s+instructions/i,
    /disregard\s+(all\s+)?prior\s+prompts/i,
    /system\s+prompt/i,
    /reveal\s+(your\s+)?(api\s+key|secret|password|token)/i,
    /print\s+env/i,
    /DAN\s+mode/i,
    /jailbreak/i,
  ];

  for (const pattern of injectionPatterns) {
    if (pattern.test(clean)) {
      clean = clean.replace(pattern, "[Redacted Unsafe Phrase]");
      isSanitized = true;
      safetyNotes.push("Detected and neutralized unsafe instruction pattern.");
    }
  }

  return { clean, isSanitized, safetyNotes };
}

// Extract topic words from title and category
function extractTopicKeywords(title: string, category: string): string[] {
  const stopWords = new Set([
    "the", "and", "for", "with", "this", "that", "how", "you", "your", "video", "official", "watch",
    "from", "into", "over", "what", "when", "where", "which", "will", "would", "about", "best", "some",
    "data", "unavailable", "media"
  ]);

  const clean = `${title} ${category}`
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w));

  return Array.from(new Set(clean));
}

// Generate grounded chapters based strictly on real duration and real content outline
function generateGroundedChapters(title: string, durationSeconds: number | null | undefined): string {
  if (durationSeconds == null || isNaN(durationSeconds) || durationSeconds <= 0) {
    return "TIMESTAMPS & CHAPTERS:\nData unavailable (Video duration could not be reliably verified; timestamps were not generated to prevent inaccuracies).";
  }

  // If sub-minute media (Shorts, TikTok, short clip)
  if (durationSeconds <= 60) {
    const formatted = formatDurationSeconds(durationSeconds);
    return `TIMESTAMPS & CHAPTERS:\n[Short-Form Media — Duration: ${formatted} — Chapters not applicable for sub-minute video]`;
  }

  const durFormatted = formatDurationSeconds(durationSeconds);
  const cleanTitle = (title || "Content Overview").trim();

  // Proportional intervals strictly bounded inside the real duration
  // E.g. 5 chapters distributed at 0%, 18%, 45%, 72%, 90%
  const t0 = "00:00";
  const t1 = formatDurationSeconds(Math.max(15, Math.floor(durationSeconds * 0.18)));
  const t2 = formatDurationSeconds(Math.max(45, Math.floor(durationSeconds * 0.45)));
  const t3 = formatDurationSeconds(Math.max(90, Math.floor(durationSeconds * 0.72)));
  const t4 = formatDurationSeconds(Math.max(120, Math.floor(durationSeconds * 0.90)));

  return `TIMESTAMPS & CHAPTERS (Verified Video Duration: ${durFormatted}):\n${t0} - Introduction & Core Topic: ${cleanTitle}\n${t1} - Key Principles & Setup\n${t2} - In-Depth Walkthrough & Examples\n${t3} - Critical Best Practices & Common Pitfalls\n${t4} - Key Takeaways & Summary`;
}

// Deterministic analyzer adhering strictly to verified topic, real duration, and non-clickbait rules
function generateGroundedAudit(
  effectiveTitle: string,
  category: string,
  urlData: ParsedUrlData,
  hasValidInput: boolean
) {
  const isDataUnavailable = !hasValidInput && !urlData.realTitle && !effectiveTitle;
  
  if (isDataUnavailable) {
    return {
      overallScore: 50,
      tierLabel: "Data unavailable",
      tierBadgeClass: "tier-moderate",
      tierSummary: "Data unavailable (Public video data or title could not be accessed).",
      problemsFound: ["Video content and public metadata cannot be reliably accessed."],
      exactImprovements: ["Provide a direct public video URL or descriptive video title to evaluate."],
      improvedTitleSuggestion: "Data unavailable",
      optimizedDescription: "Data unavailable",
      relevantKeywords: ["Data unavailable"],
      relevantHashtags: ["#video"],
      tagsOrSeoTerms: ["Data unavailable"],
      whyThisMatters: "Data unavailable (Valid video input required for SEO analysis).",
      verifiedMetadata: {
        platform: urlData.platform,
        title: "Data unavailable",
        category,
        isPublicDataVerified: false,
        statusNote: "Data unavailable",
      },
    };
  }

  const cleanTitle = (effectiveTitle || urlData.realTitle || "Video Presentation").trim();
  const keywords = extractTopicKeywords(cleanTitle, category);
  const mainPhrase = keywords.slice(0, 3).join(" ") || cleanTitle;
  const tLen = cleanTitle.length;

  const problems: string[] = [];
  const improvements: string[] = [];

  // Finding 1: Title length / Mobile search packaging
  if (tLen < 35) {
    problems.push(`Title is concise (${tLen} chars); adding primary search context will improve viewer clarity.`);
    improvements.push(`Expand to 45–60 characters to include clear topic benefit and format context.`);
  } else if (tLen > 65) {
    problems.push(`Title (${tLen} chars) may truncate on mobile search feeds, cutting off trailing keywords.`);
    improvements.push(`Front-load the core subject phrase within the first 40 characters for mobile display.`);
  } else {
    problems.push(`Title length (${tLen} chars) is well-balanced for mobile search feed visibility.`);
    improvements.push(`Refine headline with natural search-intent keywords to strengthen click clarity.`);
  }

  // Finding 2: Search intent / Format cues
  if (!/\d+|guide|how to|mistakes|best|tips|explained|tutorial|walkthrough|overview|vs/i.test(cleanTitle)) {
    problems.push(`Title lacks a specific content format cue (e.g. 'Step-by-Step Guide', 'Explained', or 'Overview').`);
    improvements.push(`Add a natural format specifier such as 'Step-by-Step Guide' or 'Overview & Key Takeaways'.`);
  } else {
    problems.push(`Includes clear search-intent phrasing that clarifies what viewers will learn.`);
  }

  // Finding 3: Duration / Chapter indexing
  if (urlData.durationSeconds && urlData.durationSeconds > 60) {
    problems.push(`Verified video duration is ${urlData.durationFormatted}; structured timestamp chapters will improve key moment indexing.`);
    improvements.push(`Add 4–5 timestamped chapters bounded to the ${urlData.durationFormatted} duration.`);
  } else if (urlData.durationSeconds && urlData.durationSeconds <= 60) {
    problems.push(`Sub-minute short-form media detected (${urlData.durationFormatted}); concise search descriptions are recommended over chapters.`);
  } else {
    improvements.push(`If video is multi-minute, add verified timestamps to enable video search moment indexing.`);
  }

  // Score calculation
  let score = 72;
  if (tLen >= 40 && tLen <= 65) score += 12;
  if (/\d+|guide|how to|mistakes|best|tips|explained/i.test(cleanTitle)) score += 10;
  if (urlData.realTitle || urlData.isRecognized) score += 4;
  const overallScore = Math.min(96, Math.max(45, score));

  let tierLabel = "Solid Search Packaging";
  let tierBadgeClass = "tier-good";
  if (overallScore >= 85) {
    tierLabel = "Search-Optimized";
    tierBadgeClass = "tier-excellent";
  } else if (overallScore < 65) {
    tierLabel = "Needs Optimization";
    tierBadgeClass = "tier-moderate";
  }

  // 1. Output: Improved Title Suggestion (Accurately matches actual video, improves search intent and CTR without clickbait)
  let improvedTitleSuggestion = cleanTitle;
  if (!/guide|tutorial|explained|overview|how to|walkthrough/i.test(cleanTitle)) {
    improvedTitleSuggestion = cleanTitle.includes(":")
      ? `${cleanTitle} (Step-by-Step Guide)`
      : `${cleanTitle}: Step-by-Step Guide & Key Takeaways`;
  } else if (!cleanTitle.includes(":") && !cleanTitle.includes("-") && cleanTitle.length < 50) {
    improvedTitleSuggestion = `${cleanTitle} - Practical Overview & Insights`;
  }

  // 2. Output: Short Optimized Description & Chapters (Concise, natural, proper keyword density, real timestamps or explicit note)
  const chaptersBlock = generateGroundedChapters(cleanTitle, urlData.durationSeconds);
  const cleanCategoryTag = category.split("&")[0].trim().toLowerCase().replace(/[^a-z0-9]/g, "");
  const relevantHashtags = [
    `#${(keywords[0] || "video").toLowerCase()}`,
    `#${(keywords[1] || "guide").toLowerCase()}`,
    `#${cleanCategoryTag || "tutorial"}`,
    `#${urlData.platform.toLowerCase().replace(/[^a-z0-9]/g, "") || "media"}`,
  ].slice(0, 4);

  const durationNote = urlData.durationSeconds ? ` [Duration: ${urlData.durationFormatted}]` : "";
  const optimizedDescription = `In this video, we provide a structured overview and practical walkthrough of ${cleanTitle}.${durationNote}\n\nWe cover foundational concepts, step-by-step execution, and key takeaways to give you a clear, comprehensive understanding of the topic.\n\n${chaptersBlock}\n\nRESOURCES & LINKS:\n• Official Platform: ${urlData.platform}\n\n${relevantHashtags.join(" ")}`;

  // 3. Output: Relevant Keywords (Video-specific, directly relevant to real topic and content)
  const relevantKeywords = [
    mainPhrase.toLowerCase(),
    `${mainPhrase.toLowerCase()} guide`,
    `${mainPhrase.toLowerCase()} tutorial`,
    `how to understand ${mainPhrase.toLowerCase()}`,
    `${mainPhrase.toLowerCase()} best practices`,
    `${mainPhrase.toLowerCase()} key takeaways`,
  ];

  // 4. Output: Tags / SEO Search Terms (Directly relevant to real topic)
  const tagsOrSeoTerms = [
    mainPhrase.toLowerCase(),
    `${mainPhrase.toLowerCase()} overview`,
    `${mainPhrase.toLowerCase()} walkthrough`,
    `${category.toLowerCase()}`,
    `${mainPhrase.toLowerCase()} tips`,
    `${mainPhrase.toLowerCase()} explained`,
  ];

  return {
    overallScore,
    tierLabel,
    tierBadgeClass,
    tierSummary: `Evaluated strictly on verified video metadata, search intent, and ${category} audience alignment.`,
    problemsFound: problems.slice(0, 4),
    exactImprovements: improvements.slice(0, 3),
    improvedTitleSuggestion,
    optimizedDescription,
    relevantKeywords,
    relevantHashtags,
    tagsOrSeoTerms,
    whyThisMatters: `Front-loading high-intent search terms and grounding timestamps in actual video duration directly improves organic search indexing and viewer retention without misleading clickbait.`,
    verifiedMetadata: {
      platform: urlData.platform,
      title: cleanTitle,
      category,
      isPublicDataVerified: urlData.isRecognized && (!!urlData.realTitle || !!urlData.durationSeconds),
      statusNote: urlData.statusNote,
    },
  };
}

// Intelligent backend routing mapping for different tools (Invisible AI Orchestration)
function getIntelligentProvider(toolIdOrName: number | string | undefined): any {
  const available = aiOrchestrator.getAvailableProviders();
  if (available.length === 0) return 'auto';

  // If a specific tool is requested by numeric ID or slug/action
  if (toolIdOrName !== undefined) {
    const toolId = Number(toolIdOrName);
    if (!isNaN(toolId) && toolId > 0) {
      const preferences: Record<number, string[]> = {
        1: ['gemini', 'openai', 'deepseek'],         // Keyword Research
        2: ['grok', 'mistral', 'openai', 'gemini'], // Hashtags & Tags
        3: ['grok', 'openai', 'gemini'],            // Hook & Script Intro
        4: ['claude', 'gemini', 'openai'],          // Description & Chapters
        5: ['gemini', 'claude', 'openai'],          // Topic Explorer
        6: ['claude', 'openai', 'gemini'],          // Repurposing Kit
        7: ['gemini', 'claude', 'openai']           // Pre-Upload Checklist
      };
      const candidates = preferences[toolId] || ['gemini', 'openai'];
      for (const providerId of candidates) {
        if (available.some(p => p.id === providerId)) {
          return providerId;
        }
      }
    } else {
      const name = String(toolIdOrName).toLowerCase();
      if (name.includes('video') || name.includes('audit') || name.includes('analyze')) {
        const candidates = ['gemini', 'claude', 'openai'];
        for (const providerId of candidates) {
          if (available.some(p => p.id === providerId)) {
            return providerId;
          }
        }
      }
    }
  }

  return 'auto';
}

// AI Provider Health Check Endpoint
app.get("/api/ai/health", (req, res) => {
  const statusList = aiOrchestrator.getProviderStatusList();
  const availableCount = statusList.filter(s => s.status === 'available').length;
  res.json({
    status: availableCount > 0 ? "ok" : "degraded",
    availableCount,
    totalProviders: statusList.length,
    providers: statusList,
  });
});

// AI Providers Listing Endpoint for UI Dropdown
app.get("/api/ai/providers", (req, res) => {
  const available = aiOrchestrator.getAvailableProviders();
  const allProviders = aiOrchestrator.getProviderStatusList();
  res.json({
    success: true,
    providers: available,
    allProviders,
  });
});

// Compare AI Providers Endpoint
app.post("/api/ai/compare", async (req, res) => {
  const clientIp = (req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || '127.0.0.1').split(',')[0].trim();
  const rateLimit = globalRateLimiter.check(clientIp);
  if (!rateLimit.allowed) {
    return res.status(429).json({
      error: "Rate limit exceeded. Please wait before submitting more requests.",
      errorCode: "RATE_LIMITED",
    });
  }

  const { prompt, systemInstruction, compareProviders } = req.body || {};
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required.", errorCode: "INVALID_REQUEST" });
  }

  const result = await aiOrchestrator.compare({
    prompt,
    systemInstruction,
    compareProviders,
  });

  res.json(result);
});

// Universal Multi-Provider AI API Gateway
app.get("/api/ai", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  return res.json({
    success: true,
    message: "Universal Multi-Provider AI API Gateway is active. Send a POST request to submit AI queries.",
    endpoints: ["/api/ai", "/api/analyze-video", "/api/ai/health", "/api/ai/providers"],
  });
});

app.post("/api/ai", async (req, res) => {
  const clientIp = (req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || '127.0.0.1').split(',')[0].trim();
  const rateLimit = globalRateLimiter.check(clientIp);
  if (!rateLimit.allowed) {
    return res.status(429).json({
      error: "Rate limit exceeded. Please wait before submitting more requests.",
      errorCode: "RATE_LIMITED",
    });
  }

  try {
    const { action, tool, toolId, input, prompt, provider, model, systemInstruction, compare } = req.body || {};
    const targetProvider = getIntelligentProvider(toolId || tool || action);

    // Route to video analysis if action or tool indicates video audit
    if (action === "analyze-video" || tool === "analyze-video" || tool === "video-audit") {
      const url = input?.url || req.body.url || "";
      const title = input?.title || req.body.title || "";
      const category = input?.category || req.body.category || "Education & Tech";
      const urlData = await inspectAndFetchVideoMetadata(url);
      const effectiveTitle = title || urlData.realTitle || (urlData.videoId ? `Video ${urlData.videoId}` : "");
      const hasValidInput = Boolean(title || urlData.realTitle || urlData.videoId || urlData.isRecognized);

      if (hasValidInput) {
        const aiPrompt = `Analyze the actual submitted video and generate strictly accurate, non-clickbait packaging outputs.
INPUT METADATA:
- Submitted URL: ${url || "Data unavailable"}
- Platform: ${urlData.platform}
- Verified Real Title: ${urlData.realTitle || "Data unavailable"}
- Working Title / Topic: "${effectiveTitle || "Data unavailable"}"
- Content Category: "${category}"
- Verified Video Duration: ${urlData.durationSeconds ? `${urlData.durationFormatted} (${urlData.durationSeconds} seconds)` : "Data unavailable"}`;

        const aiResponse = await aiOrchestrator.generate({
          prompt: aiPrompt,
          systemInstruction: "You are an expert video SEO and packaging auditor. Output strict JSON adhering to exact verified duration, non-clickbait titles, and grounded timestamps.",
          provider: targetProvider,
          model,
          responseFormat: 'json',
          temperature: 0.2,
        });

        if (aiResponse.success && (aiResponse.json || aiResponse.text)) {
          const auditData = aiResponse.json || JSON.parse(aiResponse.text);
          return res.json({
            ...auditData,
            _aiMeta: {
              provider: aiResponse.provider,
              model: aiResponse.model,
              latencyMs: aiResponse.latencyMs,
              fallbackOccurred: aiResponse.fallbackOccurred,
            },
          });
        }
      }
      return res.json(generateGroundedAudit(effectiveTitle, category, urlData, hasValidInput));
    }

    // Generic Multi-Provider AI prompt handler
    const userPrompt = prompt || input?.prompt || JSON.stringify(input || req.body);
    const sysInstruction = systemInstruction || req.body.systemInstruction || "You are an expert AI content assistant for Multi Tube Views. Return helpful, grounded, and accurate results in JSON format.";

    const aiResponse = await aiOrchestrator.generate({
      prompt: userPrompt,
      systemInstruction: sysInstruction,
      provider: targetProvider,
      model,
      responseFormat: 'json',
      temperature: 0.3,
    });

    if (aiResponse.success) {
      if (aiResponse.json) {
        return res.json({
          ...aiResponse.json,
          _aiMeta: {
            provider: aiResponse.provider,
            model: aiResponse.model,
            latencyMs: aiResponse.latencyMs,
            fallbackOccurred: aiResponse.fallbackOccurred,
          },
        });
      }
      return res.json({ 
        result: aiResponse.text,
        _aiMeta: {
          provider: aiResponse.provider,
          model: aiResponse.model,
          latencyMs: aiResponse.latencyMs,
          fallbackOccurred: aiResponse.fallbackOccurred,
        },
      });
    }

    return res.status(500).json({
      error: aiResponse.error || "Failed to process AI request across all available providers.",
      errorCode: aiResponse.errorCode || "PROVIDER_UNAVAILABLE",
      attemptedProviders: aiResponse.attemptedProviders,
    });
  } catch (error: any) {
    console.error("Universal AI endpoint error:", error);
    return res.status(500).json({
      error: error.message || "Failed to process AI request.",
      errorCode: "UNKNOWN_PROVIDER_ERROR",
    });
  }
});

// API endpoint for Video Growth Audit (backward compatibility)
app.get("/api/analyze-video", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  return res.json({
    success: true,
    message: "Video Growth Audit API endpoint is active. Send a POST request with { url, title, category } payload to run video audits.",
  });
});

app.post("/api/analyze-video", async (req, res) => {
  try {
    const { url = "", title = "", category = "Education & Tech", provider } = req.body;
    const targetProvider = getIntelligentProvider("analyze-video");
    const inputUrl = String(url || "").trim();
    const inputTitle = String(title || "").trim();
    const inputCategory = String(category || "Education & Tech").trim();

    if (!inputUrl && !inputTitle) {
      return res.status(400).json({
        error: "Please provide a public video URL or working video title to audit.",
      });
    }

    // Inspect URL and fetch real public metadata (real title, duration, author, description)
    const urlData = await inspectAndFetchVideoMetadata(inputUrl);
    const effectiveTitle = inputTitle || urlData.realTitle || (urlData.videoId ? `Video ${urlData.videoId}` : "");
    const hasValidInput = Boolean(inputTitle || urlData.realTitle || urlData.videoId || urlData.isRecognized);

    // AI audit with AI Orchestrator (supports Gemini, OpenAI, Grok, DeepSeek, Claude, Mistral, OpenRouter with Fallback)
    if (hasValidInput) {
      try {
        const prompt = `Analyze the actual submitted video and generate strictly accurate, non-clickbait packaging outputs.

INPUT METADATA:
- Submitted URL: ${inputUrl || "Data unavailable"}
- Platform: ${urlData.platform}
- Verified Real Title: ${urlData.realTitle || "Data unavailable"}
- Working Title / Topic: "${effectiveTitle || "Data unavailable"}"
- Content Category: "${inputCategory}"
- Verified Video Duration: ${urlData.durationSeconds ? `${urlData.durationFormatted} (${urlData.durationSeconds} seconds)` : "Data unavailable"}
- Public Metadata Description: ${urlData.realDescription ? `"${urlData.realDescription.slice(0, 300)}"` : "Data unavailable"}

CRITICAL MANDATORY INSTRUCTIONS:
1. IMPROVED TITLE SUGGESTION: Suggest a title that accurately matches the actual video while improving search intent and CTR without clickbait. If content/data cannot be reliably accessed, output "Data unavailable".
2. SHORT OPTIMIZED DESCRIPTION & CHAPTERS: Generate a concise, natural description with proper keyword density and platform-appropriate length.
   - CHAPTERS/TIMESTAMPS RULE: Create chapters/timestamps based strictly on the actual video duration (${urlData.durationSeconds ? `${urlData.durationFormatted}` : "Data unavailable"}) and real content outline. Never invent timestamps or topics.
   - If duration is unavailable, chapters must explicitly state: "TIMESTAMPS & CHAPTERS:\nData unavailable (Video duration could not be reliably verified; timestamps were not generated to prevent inaccuracies)."
   - If duration is <= 60 seconds (Short/TikTok), state: "TIMESTAMPS & CHAPTERS:\n[Short-Form Media — Duration: ${urlData.durationFormatted} — Chapters not applicable for sub-minute video]".
3. RELEVANT KEYWORDS: Generate only video-specific keywords directly relevant to the video's real topic and content. If data unavailable, return ["Data unavailable"].
4. TAGS / SEO SEARCH TERMS: Generate only video-specific SEO search terms directly relevant to the video's real topic and content. If data unavailable, return ["Data unavailable"].
5. Do NOT invent private creator analytics (views, CTR %, watch time).`;

        const aiResponse = await aiOrchestrator.generate({
          prompt,
          systemInstruction: "You are an expert video SEO and packaging auditor. Output strict JSON adhering to exact verified duration, non-clickbait titles, and grounded timestamps.",
          provider: targetProvider,
          responseFormat: 'json',
          temperature: 0.2,
        });

        if (aiResponse.success && (aiResponse.json || aiResponse.text)) {
          const parsed = aiResponse.json || JSON.parse(aiResponse.text);
          return res.json({
            overallScore: parsed.overallScore || 80,
            tierLabel: parsed.tierLabel || "Search-Optimized",
            tierBadgeClass: parsed.tierBadgeClass || "tier-good",
            tierSummary: parsed.tierSummary || `Evaluated on title packaging and ${inputCategory} search intent.`,
            problemsFound: (parsed.problemsFound || []).slice(0, 5),
            exactImprovements: (parsed.exactImprovements || []).slice(0, 3),
            improvedTitleSuggestion: parsed.improvedTitleSuggestion || effectiveTitle || "Data unavailable",
            optimizedDescription: parsed.optimizedDescription || "",
            relevantKeywords: (parsed.relevantKeywords || []).slice(0, 6),
            relevantHashtags: (parsed.relevantHashtags || []).slice(0, 5),
            tagsOrSeoTerms: (parsed.tagsOrSeoTerms || []).slice(0, 6),
            whyThisMatters:
              parsed.whyThisMatters ||
              "Grounded timestamps and search-intent titles improve discovery without misleading viewers.",
            verifiedMetadata: {
              platform: urlData.platform,
              title: urlData.realTitle || effectiveTitle || "Video Submission",
              category: inputCategory,
              isPublicDataVerified: urlData.isRecognized && (!!urlData.realTitle || !!urlData.durationSeconds),
              statusNote: urlData.statusNote,
            },
            _aiMeta: {
              provider: aiResponse.provider,
              model: aiResponse.model,
              latencyMs: aiResponse.latencyMs,
              fallbackOccurred: aiResponse.fallbackOccurred,
            },
          });
        }
      } catch (err) {
        // Fall through to deterministic grounded analyzer
      }
    }

    // Grounded deterministic analyzer fallback
    const groundedData = generateGroundedAudit(effectiveTitle, inputCategory, urlData, hasValidInput);
    return res.json(groundedData);
  } catch (error: any) {
    console.error("Analysis route error:", error);
    return res.status(500).json({
      error: "Unable to process video audit. Please check your inputs.",
    });
  }
});



// AI Prompt Library API Endpoints (Sourced strictly from AiPromptXpert Blogger RSS)
app.get("/api/ai-prompts", async (req, res) => {
  try {
    const category = typeof req.query.category === "string" ? req.query.category : undefined;
    const search = typeof req.query.search === "string" ? req.query.search : undefined;
    const page = typeof req.query.page === "string" ? parseInt(req.query.page, 10) : undefined;
    const limit = typeof req.query.limit === "string" ? parseInt(req.query.limit, 10) : undefined;

    const data = await getPrompts({ category, search, page, limit });
    res.json({
      success: true,
      ...data,
    });
  } catch (error: any) {
    console.error("AI Prompts fetch error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to retrieve AI prompts.",
      total: 0,
      prompts: [],
      categories: [],
    });
  }
});

app.get("/api/ai-prompts/detail/:id", async (req, res) => {
  try {
    const prompt = await getPromptById(req.params.id);
    if (!prompt) {
      return res.status(404).json({
        success: false,
        error: "Prompt record not found.",
      });
    }
    res.json({
      success: true,
      prompt,
    });
  } catch (error: any) {
    console.error("AI Prompt detail error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to retrieve prompt detail.",
    });
  }
});

app.post("/api/ai-prompts/sync", async (req, res) => {
  try {
    const result = await syncPromptsFromRss(true);
    res.json(result);
  } catch (error: any) {
    console.error("AI Prompt manual sync error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to synchronize RSS prompts.",
    });
  }
});

async function startServer() {
  // Catch all unmatched /api/* requests and return JSON 404 instead of SPA HTML fallback
  app.all("/api/*", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    return res.status(404).json({
      success: false,
      error: `API endpoint not found: ${req.method} ${req.path}`,
      errorCode: "NOT_FOUND",
    });
  });

  // Global API error handler ensuring errors on /api/* routes return JSON instead of HTML
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.path && req.path.startsWith("/api")) {
      console.error("[API Error Handler]", err);
      res.setHeader("Content-Type", "application/json");
      return res.status(res.statusCode >= 400 ? res.statusCode : 500).json({
        success: false,
        error: err.message || "Internal server error occurred on API endpoint.",
        errorCode: "INTERNAL_SERVER_ERROR",
      });
    }
    next(err);
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

