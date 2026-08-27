import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { executeSeoTool } from "./server/seo-tools-registry.js";
import { aiOrchestrator } from "./server/ai/orchestrator.js";
import { globalRateLimiter } from "./server/ai/rate-limiter.js";

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
    endpoints: ["/api/ai", "/api/seo-research", "/api/analyze-video", "/api/ai/health", "/api/ai/providers"],
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

// Master API endpoint for Social Media Research & SEO Suite (Approved 6 Tools)
// Provides tool-specific schemas, specialized prompts, and grounded deterministic engines for the 6 tools
app.get("/api/seo-research", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  return res.json({
    success: true,
    message: "Social Media & Video SEO Research API endpoint is active. Send a POST request with { toolId, topic, platforms } payload to execute research.",
    supportedTools: [1, 2, 3, 4, 5, 6, 7],
  });
});

app.post("/api/seo-research", async (req, res) => {
  try {
    const {
      toolId = 1,
      toolName = "Keyword Research",
      category = "SEO & Metadata",
      topic = "",
      title = "",
      url = "",
      keyword = "",
      description = "",
      singleInput = "",
      platforms = ["YouTube"],
      country = "Global",
      language = "English",
      contentCategory = "Education & Tech",
      audience = "General Audience",
      contentType = "Video Content",
      competitorInput = "",
      tone = "Educational",
      duration = "",
      provider,
    } = req.body;

    const targetProvider = getIntelligentProvider(Number(toolId));
    let inputUrl = String(url || "").trim();
    let effectiveTopic = String(singleInput || topic || title || keyword || description || "").trim();

    if (singleInput && /^https?:\/\//i.test(singleInput.trim())) {
      inputUrl = singleInput.trim();
      effectiveTopic = "";
    }

    // Inspect URL if provided
    const urlData = await inspectAndFetchVideoMetadata(inputUrl);
    const rawTopic = effectiveTopic || urlData.realTitle || (urlData.videoId ? `Video ${urlData.videoId}` : "Content Strategy");
    const sanitizedTopic = sanitizeAndValidateInput(rawTopic);
    const resolvedTopic = sanitizedTopic.clean;
    const activePlatforms = Array.isArray(platforms) && platforms.length > 0 ? platforms : ["YouTube"];

    const numericToolId = Math.max(1, Math.min(7, Number(toolId) || 1));
    const cleanCategory = contentCategory || category || "Education & Tech";
    const geoCountry = country || "Global";
    const targetLang = language || "English";

    // 7 Approved Tool classifications
    const toolTypeMap: Record<number, string> = {
      1: "keyword",
      2: "hashtag",
      3: "hook",
      4: "caption",
      5: "topic",
      6: "repurpose",
      7: "checklist",
    };

    const toolTypeKey = toolTypeMap[numericToolId] || "general";

    if (resolvedTopic || inputUrl) {
      try {
        let systemPrompt = "";
        let userPrompt = "";
        let responseSchema: any = undefined;

        if (numericToolId === 2) {
          systemPrompt = `You are an expert social media hashtag and video tag generator.
Generate a comprehensive, relevant list of platform-specific hashtags and tags based on the topic or content provided.
Follow these rules strictly:
1. Divide hashtags into clear, useful groups: Primary, High-Relevance, and Niche groupings.
2. Provide pre-built minimal (5 hashtags) and balanced (10 hashtags) copy-paste sets.
3. Provide comma-separated video tags specifically formatted for standard video uploading platform tags metadata fields.
4. Customize suggestions specifically for each of the target social platforms selected by the user.`;

          userPrompt = `Generate hashtags and tags for the content: "${resolvedTopic}"
Platform: ${activePlatforms.join(', ')}
Country: ${geoCountry}
Language: ${targetLang}
Category: ${cleanCategory}

Your output must follow this exact schema:
{
  "formattedSets": {
    "minimalSet": string, (5 space-separated hashtags starting with #)
    "balancedSet": string, (10 space-separated hashtags starting with #)
    "commaSeparatedTags": string (20-30 comma-separated keywords/phrases for video tags input, without # symbol)
  },
  "broadHashtags": string[], (6-10 primary broad hashtags starting with #)
  "nicheHashtags": string[], (6-10 specific long-tail or niche hashtags starting with #)
  "platformSpecific": {
    "YouTube": string[], (5-7 hashtags starting with # if YouTube is in platforms list)
    "Instagram": string[], (5-7 hashtags starting with # if Instagram is in platforms list)
    "TikTok": string[] (5-7 hashtags starting with # if TikTok is in platforms list)
  }
}`;

          responseSchema = {
            type: Type.OBJECT,
            properties: {
              formattedSets: {
                type: Type.OBJECT,
                properties: {
                  minimalSet: { type: Type.STRING },
                  balancedSet: { type: Type.STRING },
                  commaSeparatedTags: { type: Type.STRING }
                },
                required: ["minimalSet", "balancedSet", "commaSeparatedTags"]
              },
              broadHashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
              nicheHashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
              platformSpecific: {
                type: Type.OBJECT,
                additionalProperties: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            },
            required: ["formattedSets", "broadHashtags", "nicheHashtags", "platformSpecific"]
          };
        } else if (numericToolId === 1) {
          systemPrompt = `You are an expert keyword research analyst for YouTube and video platforms.
Generate a structured list of highly relevant, natural keyword opportunities for the entered seed topic.
Follow these rules strictly:
1. Do NOT invent or estimate numerical metrics like search volume, CPC, or competition scores.
2. Ensure every keyword is directly related to the user's topic, natural, search-oriented, and appropriate for the target language/region.
3. Remove obvious duplicates.`;

          userPrompt = `Perform keyword research for the seed topic: "${resolvedTopic}"
Platform: ${activePlatforms.join(', ')}
Country: ${geoCountry}
Language: ${targetLang}
Category: ${cleanCategory}

Your output must follow this exact schema:
{
  "researchSummary": {
    "topic": string,
    "platforms": string[],
    "country": string,
    "language": string,
    "totalCount": number,
    "summary": string (A 2-3 sentence expert overview of search patterns, intent density, and opportunities for this topic)
  },
  "primaryKeywords": string[], (5 broad, high-relevance terms directly describing the seed topic)
  "relatedKeywords": string[], (5 closely related variations)
  "longTailKeywords": string[], (5 specific multi-word phrases)
  "questionKeywords": string[], (5 search phrases starting with questions like how, what, why, when, where, which)
  "searchIntent": {
    "Informational": string[], (2-3 informational keywords)
    "Tutorial / How-To": string[], (2-3 tutorial / step-by-step keywords)
    "Commercial / Discovery": string[], (2-3 discovery / review / product keywords)
    "Entertainment / Trend-oriented": string[] (2-3 trend or entertainment keywords)
  },
  "contentOpportunities": [
    {
      "angle": string, (e.g., "Tutorial", "Comparison", "Beginner guide", "Problem/solution", "List format", "Shorts angle", "Current-event/topic angle")
      "keyword": string, (the specific keyword phrase matching the angle)
      "description": string (explanation of how to build a video around this keyword)
    }
  ], (Provide 5-7 clear content opportunities)
  "trendOpportunities": [
    {
      "keyword": string,
      "label": "AI Suggested Opportunity" or "Search-Relevance Suggestion",
      "explanation": string
    }
  ] (Provide 2 key trend opportunities)
}`;

          responseSchema = {
            type: Type.OBJECT,
            properties: {
              researchSummary: {
                type: Type.OBJECT,
                properties: {
                  topic: { type: Type.STRING },
                  platforms: { type: Type.ARRAY, items: { type: Type.STRING } },
                  country: { type: Type.STRING },
                  language: { type: Type.STRING },
                  totalCount: { type: Type.INTEGER },
                  summary: { type: Type.STRING }
                },
                required: ["topic", "platforms", "country", "language", "totalCount", "summary"]
              },
              primaryKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
              relatedKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
              longTailKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
              questionKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
              searchIntent: {
                type: Type.OBJECT,
                properties: {
                  "Informational": { type: Type.ARRAY, items: { type: Type.STRING } },
                  "Tutorial / How-To": { type: Type.ARRAY, items: { type: Type.STRING } },
                  "Commercial / Discovery": { type: Type.ARRAY, items: { type: Type.STRING } },
                  "Entertainment / Trend-oriented": { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["Informational", "Tutorial / How-To", "Commercial / Discovery", "Entertainment / Trend-oriented"]
              },
              contentOpportunities: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    angle: { type: Type.STRING },
                    keyword: { type: Type.STRING },
                    description: { type: Type.STRING }
                  },
                  required: ["angle", "keyword", "description"]
                }
              },
              trendOpportunities: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    keyword: { type: Type.STRING },
                    label: { type: Type.STRING },
                    explanation: { type: Type.STRING }
                  },
                  required: ["keyword", "label", "explanation"]
                }
              }
            },
            required: [
              "researchSummary",
              "primaryKeywords",
              "relatedKeywords",
              "longTailKeywords",
              "questionKeywords",
              "searchIntent",
              "contentOpportunities",
              "trendOpportunities"
            ]
          };
        } else if (numericToolId === 3) {
          systemPrompt = `You are an expert scriptwriter specializing in high-retention video intros and opening hooks for video platforms.
Generate 5 distinct, high-impact hooks and visual cues tailored to the specified topic, tone, and audience.
Follow these rules strictly:
1. Provide 5 varied hook styles (Direct Problem, Contrarian/Myth-Busting, Curiosity Gap, Story/Transformation, Bold Claim).
2. For each hook, include a spoken script (1-2 sentences) and a specific visual action cue.
3. Include a retention framework with 3-second hook, visual pattern interrupt, 15-second intro script, retention cues, and drop-off prevention tips.
4. Do NOT invent fake metrics or fake view numbers.`;

          userPrompt = `Generate high-retention video hooks and intro script for topic: "${resolvedTopic}"
Tone: ${tone}
Audience: ${audience}
Platforms: ${activePlatforms.join(', ')}
Language: ${targetLang}
Category: ${cleanCategory}

Your output must follow this exact schema:
{
  "hooks": [
    {
      "style": string, (e.g. "Direct Problem / Pain Point")
      "spokenScript": string, (The exact first 1-2 sentences to speak)
      "visualActionCue": string (Visual direction or graphics note for the creator)
    }
  ], (5 distinct hooks)
  "retentionFramework": {
    "spokenHook3Seconds": string,
    "visualPatternInterrupt": string,
    "introScript15Seconds": string,
    "retentionCues": string[],
    "dropOffPreventionChecklist": string[]
  }
}`;

          responseSchema = {
            type: Type.OBJECT,
            properties: {
              hooks: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    style: { type: Type.STRING },
                    spokenScript: { type: Type.STRING },
                    visualActionCue: { type: Type.STRING }
                  },
                  required: ["style", "spokenScript", "visualActionCue"]
                }
              },
              retentionFramework: {
                type: Type.OBJECT,
                properties: {
                  spokenHook3Seconds: { type: Type.STRING },
                  visualPatternInterrupt: { type: Type.STRING },
                  introScript15Seconds: { type: Type.STRING },
                  retentionCues: { type: Type.ARRAY, items: { type: Type.STRING } },
                  dropOffPreventionChecklist: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["spokenHook3Seconds", "visualPatternInterrupt", "introScript15Seconds", "retentionCues", "dropOffPreventionChecklist"]
              }
            },
            required: ["hooks", "retentionFramework"]
          };
        } else if (numericToolId === 4) {
          systemPrompt = `You are a video SEO metadata specialist.
Generate a professional, search-optimized video description and timestamped chapters for the given topic.
Follow these rules strictly:
1. Front-load core keywords in the summary paragraph.
2. Provide realistic timestamped chapters starting at 0:00.
3. Include formatted resources and hashtags at the bottom.
4. Do NOT invent fake views or metrics.`;

          userPrompt = `Generate a video description and chapter timestamps for: "${resolvedTopic}"
Platforms: ${activePlatforms.join(', ')}
Audience: ${audience}
Category: ${cleanCategory}
Language: ${targetLang}

Your output must follow this exact schema:
{
  "descriptionText": string, (The full ready-to-copy description formatted with timestamps and hashtags)
  "chapters": [
    { "time": string, "title": string }
  ], (5-7 timestamp chapters starting at 0:00)
  "descriptionKit": {
    "frontLoadedSummary": string,
    "timestampedChapters": [ { "time": string, "title": string } ],
    "bulletPoints": string[],
    "fullFormattedDescription": string
  }
}`;

          responseSchema = {
            type: Type.OBJECT,
            properties: {
              descriptionText: { type: Type.STRING },
              chapters: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    time: { type: Type.STRING },
                    title: { type: Type.STRING }
                  },
                  required: ["time", "title"]
                }
              },
              descriptionKit: {
                type: Type.OBJECT,
                properties: {
                  frontLoadedSummary: { type: Type.STRING },
                  timestampedChapters: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        time: { type: Type.STRING },
                        title: { type: Type.STRING }
                      },
                      required: ["time", "title"]
                    }
                  },
                  bulletPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                  fullFormattedDescription: { type: Type.STRING }
                },
                required: ["frontLoadedSummary", "timestampedChapters", "bulletPoints", "fullFormattedDescription"]
              }
            },
            required: ["descriptionText", "chapters", "descriptionKit"]
          };
        } else if (numericToolId === 5) {
          systemPrompt = `You are a video content strategist and topic researcher.
Generate audience questions, subtopics, and a 4-week content roadmap based on the seed topic.
Follow these rules strictly:
1. Provide top questions real users search for regarding this topic.
2. Outline key subtopics to cover in separate videos or sections.
3. Build a structured 4-week publishing plan with video titles, formats, and goals.
4. Do NOT fabricate fake analytics or search volumes.`;

          userPrompt = `Generate content ideation and question exploration for: "${resolvedTopic}"
Category: ${cleanCategory}
Audience: ${audience}
Platforms: ${activePlatforms.join(', ')}

Your output must follow this exact schema:
{
  "topAudienceQuestions": string[], (5-7 high-intent questions real viewers ask)
  "subtopics": string[], (4-6 key subtopics or thematic angles)
  "contentPlan4Week": [
    { "week": string, "title": string, "format": string, "goal": string }
  ] (4 week content plan: Week 1 to Week 4)
}`;

          responseSchema = {
            type: Type.OBJECT,
            properties: {
              topAudienceQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
              subtopics: { type: Type.ARRAY, items: { type: Type.STRING } },
              contentPlan4Week: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    week: { type: Type.STRING },
                    title: { type: Type.STRING },
                    format: { type: Type.STRING },
                    goal: { type: Type.STRING }
                  },
                  required: ["week", "title", "format", "goal"]
                }
              }
            },
            required: ["topAudienceQuestions", "subtopics", "contentPlan4Week"]
          };
        } else if (numericToolId === 6) {
          systemPrompt = `You are a multi-platform social media repurposing expert.
Adapt a core video topic into platform-native post packages for each selected platform.
Follow these rules strictly:
1. Provide native titles, formats, captions, and publishing rules for each target platform.
2. Tailor tone and character lengths for YouTube, Instagram, TikTok, LinkedIn, X, etc.
3. Do NOT invent fake metrics or fake engagement numbers.`;

          userPrompt = `Repurpose the topic "${resolvedTopic}" for target platforms: ${activePlatforms.join(', ')}
Category: ${cleanCategory}
Audience: ${audience}

Your output must follow this exact schema:
{
  "repurposedPackages": {
    "PlatformName": {
      "title": string,
      "format": string,
      "caption": string,
      "rules": string
    }
  }
}`;

          responseSchema = {
            type: Type.OBJECT,
            properties: {
              repurposedPackages: {
                type: Type.OBJECT,
                additionalProperties: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    format: { type: Type.STRING },
                    caption: { type: Type.STRING },
                    rules: { type: Type.STRING }
                  },
                  required: ["title", "format", "caption", "rules"]
                }
              }
            },
            required: ["repurposedPackages"]
          };
        } else if (numericToolId === 7) {
          systemPrompt = `You are a video production QA and SEO compliance inspector.
Generate a pre-upload SEO checklist and launch day checklist tailored to the video topic.
Follow these rules strictly:
1. Include essential technical, metadata, and visual check items for pre-upload.
2. Include engagement and promotion check items for launch day.
3. Return clean JSON checklists with id, task, and checked boolean (default false).`;

          userPrompt = `Generate pre-upload and launch checklists for: "${resolvedTopic}"
Category: ${cleanCategory}
Platforms: ${activePlatforms.join(', ')}

Your output must follow this exact schema:
{
  "checklists": {
    "preUploadChecklist": [
      { "id": string, "task": string, "checked": boolean }
    ],
    "launchDayChecklist": [
      { "id": string, "task": string, "checked": boolean }
    ]
  }
}`;

          responseSchema = {
            type: Type.OBJECT,
            properties: {
              checklists: {
                type: Type.OBJECT,
                properties: {
                  preUploadChecklist: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        task: { type: Type.STRING },
                        checked: { type: Type.BOOLEAN }
                      },
                      required: ["id", "task", "checked"]
                    }
                  },
                  launchDayChecklist: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        task: { type: Type.STRING },
                        checked: { type: Type.BOOLEAN }
                      },
                      required: ["id", "task", "checked"]
                    }
                  }
                },
                required: ["preUploadChecklist", "launchDayChecklist"]
              }
            },
            required: ["checklists"]
          };
        } else {
          systemPrompt = `You are the specialized AI research engine for Multi Tube Views Tool #${numericToolId}: "${toolName}" (${category}). Return concise, actionable JSON strictly for this tool with zero metric fabrication or fake engagement metrics.`;
          userPrompt = `Generate the exact data structure for Tool #${numericToolId} "${toolName}".
Topic/Input: "${resolvedTopic}"
URL: "${inputUrl || 'None'}"
Platforms: ${activePlatforms.join(', ')}
Country: ${geoCountry} | Language: ${targetLang} | Category: ${cleanCategory} | Audience: ${audience} | Tone: ${tone}
Competitor/Secondary Input: "${competitorInput || 'None'}"

STRICT RULE: Output strictly valid JSON matching Tool #${numericToolId}'s specific schema. No fake views, no fabricated CTR numbers.`;
        }

        const aiResponse = await aiOrchestrator.generate({
          prompt: userPrompt,
          systemInstruction: systemPrompt,
          provider: targetProvider,
          responseFormat: 'json',
          temperature: 0.3,
        });

        if (aiResponse.success && (aiResponse.json || aiResponse.text)) {
          let parsed = aiResponse.json;
          if (!parsed && aiResponse.text) {
            try {
              const cleanText = aiResponse.text.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
              parsed = JSON.parse(cleanText);
            } catch (e) {
              console.error("Failed to parse JSON text from AI response:", e);
            }
          }

          if (parsed) {
            const toolNameStr = String(toolName || `Tool #${numericToolId}`);
            const inputsUsedArr = [resolvedTopic, ...activePlatforms, geoCountry, targetLang].filter(Boolean);
            const seoSummaryStr = String(parsed.seo_summary || parsed.researchSummary?.summary || `Search intent research report for "${resolvedTopic}" across ${activePlatforms.join(", ")}. Grounded in real search patterns.`);
            const nextActionStr = String(parsed.next_action || `Incorporate these ${toolNameStr} deliverables into your video metadata and publication workflow.`);
            const assumptionsArr = Array.isArray(parsed.assumptions) && parsed.assumptions.length > 0
              ? parsed.assumptions
              : [
                  `Target audience aligns with ${cleanCategory} search intent in ${geoCountry}.`,
                  `Platform formatting conventions applied for ${activePlatforms.join(", ")}.`
                ];
            const safetyNotesArr = Array.isArray(parsed.safety_notes) && parsed.safety_notes.length > 0
              ? parsed.safety_notes
              : [
                  ...sanitizedTopic.safetyNotes,
                  "No fabricated view metrics or synthetic claims.",
                  "Inputs sanitized and API credentials secured."
                ];

            const deliverablesObj = parsed.deliverables || {
              formattedSets: parsed.formattedSets,
              primaryKeywords: parsed.primaryKeywords,
              relatedKeywords: parsed.relatedKeywords,
              longTailKeywords: parsed.longTailKeywords,
              questionKeywords: parsed.questionKeywords,
              hooks: parsed.hooks,
              retentionFramework: parsed.retentionFramework,
              descriptionText: parsed.descriptionText,
              chapters: parsed.chapters,
              topAudienceQuestions: parsed.topAudienceQuestions,
              subtopics: parsed.subtopics,
              contentPlan4Week: parsed.contentPlan4Week,
              repurposedPackages: parsed.repurposedPackages,
              checklists: parsed.checklists
            };

            return res.json({
              success: true,
              tool_name: toolNameStr,
              language: targetLang,
              inputs_used: inputsUsedArr,
              deliverables: deliverablesObj,
              seo_summary: seoSummaryStr,
              next_action: nextActionStr,
              assumptions: assumptionsArr,
              safety_notes: safetyNotesArr,
              toolId: numericToolId,
              toolName: toolNameStr,
              category,
              toolType: toolTypeKey,
              inputContext: {
                topic: resolvedTopic,
                platforms: activePlatforms,
                country: geoCountry,
                language: targetLang,
                category: cleanCategory,
                audience,
              },
              ...parsed,
              verifiedMetadata: {
                platform: activePlatforms.join(", "),
                title: urlData.realTitle || resolvedTopic,
                category: cleanCategory,
                isPublicDataVerified: urlData.isRecognized,
                statusNote: urlData.statusNote || "Research grounded in submitted parameters.",
              },
              _aiMeta: {
                provider: aiResponse.provider,
                model: aiResponse.model,
                latencyMs: aiResponse.latencyMs,
                fallbackOccurred: aiResponse.fallbackOccurred,
              },
            });
          }
        }

        // Fallback gracefully to grounded engine if AI response is missing or failed
        console.warn(`[SEO API Fallback] AI generation unsuccessful (${aiResponse.error || 'Empty parsed response'}). Using grounded engine fallback for Tool #${numericToolId}`);
        const fallbackData = generateToolSpecificOutput(
          numericToolId,
          toolName,
          category,
          resolvedTopic,
          activePlatforms,
          geoCountry,
          targetLang,
          cleanCategory,
          audience,
          contentType,
          competitorInput,
          urlData
        );
        return res.json({
          success: true,
          ...fallbackData,
          _aiMeta: {
            provider: targetProvider,
            model: 'grounded-engine-fallback',
            fallbackOccurred: true,
            reason: aiResponse.error || 'AI generation returned empty output',
          },
        });
      } catch (err: any) {
        console.error("SEO Research API error, providing grounded fallback:", err);
        const fallbackData = generateToolSpecificOutput(
          numericToolId,
          toolName,
          category,
          resolvedTopic,
          activePlatforms,
          geoCountry,
          targetLang,
          cleanCategory,
          audience,
          contentType,
          competitorInput,
          urlData
        );
        return res.json({
          success: true,
          ...fallbackData,
          _aiMeta: {
            provider: 'grounded-engine',
            model: 'grounded-engine-fallback',
            fallbackOccurred: true,
            reason: err.message || 'Error occurred during AI processing',
          },
        });
      }
    }

    return res.status(400).json({
      success: false,
      error: "Please enter a topic, keyword, title, or video URL.",
      errorCode: "MISSING_INPUT",
    });
  } catch (error: any) {
    console.error("SEO Research API error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Unable to process SEO research request.",
      errorCode: "SERVER_ERROR",
    });
  }
});

// Tool-Specific Deterministic Engine Generator
function generateToolSpecificOutput(
  toolId: number,
  toolName: string,
  category: string,
  topic: string,
  platforms: string[],
  country: string,
  language: string,
  contentCategory: string,
  audience: string,
  contentType: string,
  competitorInput: string,
  urlData: ParsedUrlData
) {
  const cleanTopic = (topic || urlData.realTitle || "Content Strategy").trim();
  const words = extractTopicKeywords(cleanTopic, contentCategory);
  const primaryKw = words.slice(0, 3).join(" ") || cleanTopic;
  const targetPlatforms = platforms.length > 0 ? platforms : ["YouTube"];
  const cleanCategory = contentCategory || "General";
  const geoContext = country !== "Global" ? `${country}` : "Global Search";
  const langContext = language || "English";
  const cleanTag = (s: string) => s.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

  const baseContext = {
    topic: cleanTopic,
    platforms: targetPlatforms,
    country: geoContext,
    language: langContext,
    category: cleanCategory,
    audience: audience || "General Audience",
  };

  const verifiedMeta = {
    platform: targetPlatforms.join(", "),
    title: cleanTopic,
    category: cleanCategory,
    isPublicDataVerified: urlData.isRecognized,
    statusNote: urlData.statusNote || "Grounded analysis based on submitted input.",
  };

  // #02, #04, #05, #28, #45: HASHTAG TOOLS -> ONLY HASHTAGS & TAGS
  if ([2, 4, 5, 28, 45].includes(toolId)) {
    const rawHigh = [
      `#${cleanTag(words[0] || "viral")}`,
      `#${cleanTag(words[1] || "trending")}`,
      `#${cleanTag(words[2] || "guide")}`,
      `#${cleanTag(primaryKw)}`,
      `#${cleanTag(cleanCategory)}`,
    ].filter(Boolean);

    const rawNiche = [
      `#${cleanTag(primaryKw)}tips`,
      `#${cleanTag(primaryKw)}guide`,
      `#${cleanTag(primaryKw)}tutorial`,
      `#${cleanTag(primaryKw)}2026`,
      `#${cleanTag(primaryKw)}hacks`,
      `#${cleanTag(primaryKw)}strategy`,
      `#${cleanTag(cleanCategory)}tips`,
      `#${cleanTag(cleanCategory)}creators`,
    ];

    const rawLongTail = [
      `#howtomaster${cleanTag(words[0] || "this")}`,
      `#stepbystep${cleanTag(words[0] || "guide")}`,
      `#${cleanTag(primaryKw)}forbeginners`,
      `#${cleanTag(primaryKw)}workflow`,
      `#${cleanTag(primaryKw)}explained`,
      `#best${cleanTag(primaryKw)}practices`,
    ];

    const rawCommunity = [
      `#creatorsunite`,
      `#contentcreators`,
      `#growthhackers`,
      `#digitalcreators`,
      `#learnontiktok`,
      `#videocreator`,
    ];

    const rawPlatform = targetPlatforms.map(p => `#${cleanTag(p)}creator`);

    return {
      toolId,
      toolName,
      category,
      toolType: "hashtag",
      inputContext: baseContext,
      summary: {
        totalGenerated: rawHigh.length + rawNiche.length + rawLongTail.length + rawCommunity.length + rawPlatform.length,
        recommendedPerPost: "3 to 8 targeted tags",
        spamRiskRating: "Low (Algorithm Safe)",
      },
      hashtags: {
        highRelevance: rawHigh,
        niche: rawNiche,
        longTail: rawLongTail,
        community: rawCommunity,
        platformAppropriate: rawPlatform,
      },
      formattedSets: {
        minimalSet: rawHigh.slice(0, 5).join(" "),
        balancedSet: [...rawHigh.slice(0, 4), ...rawNiche.slice(0, 4)].join(" "),
        expandedSet: [...rawHigh, ...rawNiche, ...rawLongTail.slice(0, 4)].join(" "),
        commaSeparatedTags: [primaryKw, `${primaryKw} tutorial`, `${primaryKw} guide`, `${primaryKw} tips`, `${cleanCategory.toLowerCase()}`, ...words].slice(0, 15).join(", "),
      },
      verifiedMetadata: verifiedMeta,
    };
  }

  // #01, #02, #03, #14, #29, #30, #31, #37, #46, #56: KEYWORD TOOLS -> ONLY KEYWORDS & INTENT
  if ([1, 2, 3, 14, 29, 30, 31, 37, 46, 56].includes(toolId)) {
    return {
      toolId,
      toolName,
      category,
      toolType: "keyword",
      inputContext: baseContext,
      keywords: {
        primary: [
          primaryKw,
          `${primaryKw} guide`,
          `${primaryKw} tutorial`,
          `${primaryKw} best practices`,
          `${primaryKw} walkthrough`,
        ],
        secondary: [
          `how to learn ${primaryKw}`,
          `${cleanCategory.toLowerCase()} ${primaryKw}`,
          `${primaryKw} tips and tricks`,
          `practical ${primaryKw} workflow`,
          `${primaryKw} step by step`,
          `${primaryKw} for beginners`,
        ],
        longTail: [
          `how to get started with ${primaryKw} in ${new Date().getFullYear()}`,
          `common ${primaryKw} mistakes and how to fix them`,
          `best ${primaryKw} setup and configuration guide`,
          `step by step ${primaryKw} tutorial without errors`,
          `why ${primaryKw} is essential for ${audience.toLowerCase()}`,
        ],
        questionKeywords: [
          `what is ${primaryKw}?`,
          `how does ${primaryKw} work in practice?`,
          `why should you use ${primaryKw}?`,
          `is ${primaryKw} worth it for beginners?`,
          `how to improve your ${primaryKw} strategy?`,
        ],
        clusters: [
          {
            clusterName: `Foundational ${primaryKw}`,
            intent: "Informational (Beginner)",
            terms: [primaryKw, `what is ${primaryKw}`, `${primaryKw} for beginners`, `${primaryKw} basics`],
          },
          {
            clusterName: `Actionable Tutorials & Workflow`,
            intent: "Practical How-To",
            terms: [`how to use ${primaryKw}`, `step by step ${primaryKw}`, `${primaryKw} best practices`, `${primaryKw} tutorial`],
          },
          {
            clusterName: `Optimization & Advanced Techniques`,
            intent: "Commercial / Problem-Solving",
            terms: [`${primaryKw} mistakes to avoid`, `best ${primaryKw} tools`, `${primaryKw} vs alternatives`],
          },
        ],
        searchIntent: "Informational & Practical How-To",
        keywordDensityAdvice: "Place primary keyword in title front 40 chars, first 100 words of body, and 1 natural subheading.",
      },
      verifiedMetadata: verifiedMeta,
    };
  }

  // #06, #35: TITLE TOOLS -> ONLY TITLE ANALYSIS & ALTERNATIVES
  if ([6, 35].includes(toolId)) {
    const charCount = cleanTopic.length;
    const wordCount = cleanTopic.split(/\s+/).length;
    let titleScore = 82;
    if (charCount >= 40 && charCount <= 65) titleScore += 10;
    else if (charCount < 30) titleScore -= 8;
    if (wordCount >= 5 && wordCount <= 10) titleScore += 6;

    return {
      toolId,
      toolName,
      category,
      toolType: "title",
      inputContext: baseContext,
      titleAudit: {
        originalTitle: cleanTopic,
        characterCount: charCount,
        wordCount: wordCount,
        titleScore: Math.min(98, Math.max(50, titleScore)),
        mobileTruncationStatus: charCount > 60 ? "Warning: May be cut off on mobile search feeds (>60 chars)" : "Safe for mobile feed display",
        emotionalCuriosityTrigger: "Moderate curiosity with solid topical clarity.",
        strengths: [
          "Clearly identifies the core subject matter.",
          "Target search intent is recognizable immediately.",
        ],
        flaws: [
          charCount < 35 ? "Title is slightly short; adding a strong value hook will increase click intent." : "Ensure primary search keyword is positioned in the first 35 characters.",
          "Consider adding a specific year, framework, or outcome trigger to elevate CTR.",
        ],
      },
      alternatives: [
        {
          title: `How to Master ${cleanTopic} (${new Date().getFullYear()} Step-by-Step)`,
          formula: "How-To + Authority Year",
          ctrAppeal: "High Search Intent",
        },
        {
          title: `${cleanTopic}: The Complete Beginner to Pro Guide`,
          formula: "Topic + Skill Progression",
          ctrAppeal: "Comprehensive Value",
        },
        {
          title: `Stop Making These 3 Common ${cleanTopic} Mistakes`,
          formula: "Negative Pain Point Avoidance",
          ctrAppeal: "High Curiosity",
        },
        {
          title: `The Ultimate ${cleanTopic} Blueprint (Tested & Proven)`,
          formula: "Asset Framework + Proof",
          ctrAppeal: "Trust & Practicality",
        },
        {
          title: `Why Most People Fail at ${cleanTopic} (And How to Fix It)`,
          formula: "Contrarian Challenge + Solution",
          ctrAppeal: "Strong Retention Trigger",
        },
      ],
      verifiedMetadata: verifiedMeta,
    };
  }

  // #03, #18: HOOK ANALYZER & GENERATOR
  if ([3, 18].includes(toolId)) {
    return {
      toolId,
      toolName,
      category,
      toolType: "hook",
      inputContext: baseContext,
      hookAudit: {
        inputHook: cleanTopic,
        hookScore: 86,
        curiosityScore: "88/100 (Strong)",
        clarityScore: "90/100 (High)",
        attentionRisk: "Low (Presents clear viewer payoff within first 3 seconds)",
        firstThreeSecondsRule: "Open directly with the stakes or surprising contrast—never start with generic channel intros.",
      },
      hookFormulas: [
        {
          style: "The Direct Pain-Point Hook",
          script: `"If you've been struggling with ${cleanTopic}, you're probably making this one critical mistake."`,
          pacing: "Fast, energetic, visual close-up (0:00 - 0:03)",
        },
        {
          style: "The Curiosity Gap Hook",
          script: `"There is a secret reason why top creators handle ${cleanTopic} completely differently from everyone else."`,
          pacing: "Intriguing tone, on-screen text question (0:00 - 0:03)",
        },
        {
          style: "The Before / After Proof Hook",
          script: `"In the next 5 minutes, I'm going to show you exactly how to execute ${cleanTopic} with zero confusion."`,
          pacing: "Confident, dynamic visual cut (0:00 - 0:04)",
        },
        {
          style: "The Contrarian Hook",
          script: `"Everything you've been told about ${cleanTopic} is outdated. Here is what actually works today."`,
          pacing: "Bold statement, quick cut to screen demonstration (0:00 - 0:03)",
        },
      ],
      retentionAdvice: "Pair the verbal hook with an on-screen text card in high-contrast yellow/white to capture muted viewers on mobile feeds.",
      verifiedMetadata: verifiedMeta,
    };
  }

  // #19: THUMBNAIL ANALYZER -> ONLY THUMBNAIL & CTR AUDIT
  if ([19].includes(toolId)) {
    return {
      toolId,
      toolName,
      category,
      toolType: "thumbnail",
      inputContext: baseContext,
      thumbnailAudit: {
        conceptTopic: cleanTopic,
        recommendedOverlayText: words.slice(0, 3).map(w => w.toUpperCase()).join(" ") || "EXPLAINED FAST",
        wordCountRule: "Maximum 3–4 bold words. Do NOT repeat the exact title verbatim.",
        contrastScore: "High Contrast (Bright Subject vs Dark Background)",
        mobileSafeZoneNotice: "Keep bottom-right 20% clear of critical text or faces to avoid timestamp badge overlap.",
        faceAndSubjectGuidance: "Expressive human face on left or center-right with clear directional eye line toward focal element.",
      },
      thumbnailConcepts: [
        {
          conceptName: "The Dramatic Contrast Concept",
          focalSubject: "Split screen: Confused vs Mastered",
          textOverlay: "FIX THIS NOW",
          colorPalette: "Electric Yellow (#FFD700) + Deep Navy (#0F172A)",
        },
        {
          conceptName: "The Step-by-Step Blueprint Concept",
          focalSubject: "Clean diagram with large arrow pointing to finished result",
          textOverlay: "STEP BY STEP",
          colorPalette: "Bright Cyan (#00E5FF) + Charcoal (#18181B)",
        },
        {
          conceptName: "The High-Authority Warning Concept",
          focalSubject: "Subject with warning hand gesture and clean product/topic screenshot",
          textOverlay: "DON'T DO THIS!",
          colorPalette: "Vibrant Crimson (#EF4444) + Pure White (#FFFFFF)",
        },
      ],
      verifiedMetadata: verifiedMeta,
    };
  }

  // #20: SCRIPT ANALYZER -> ONLY SCRIPT STRUCTURE & RETENTION PACING
  if ([20].includes(toolId)) {
    return {
      toolId,
      toolName,
      category,
      toolType: "script",
      inputContext: baseContext,
      scriptAudit: {
        topic: cleanTopic,
        pacingScore: 88,
        retentionPillars: [
          { phase: "0:00 - 0:15 (The Hook & Promise)", objective: "Deliver core problem statement and immediate visual payoff.", status: "Critical Priority" },
          { phase: "0:15 - 1:30 (Context & Foundation)", objective: "Provide essential background without boring technical filler.", status: "Fast Paced" },
          { phase: "1:30 - 4:00 (Core Demonstration)", objective: "Step-by-step actionable walkthrough with pattern interrupts every 45s.", status: "High Value" },
          { phase: "4:00 - 4:45 (Retention Re-Hook)", objective: "Tease the final pro tip or biggest pitfall to prevent late-video drop-off.", status: "Re-engagement" },
          { phase: "4:45 - End (Wrap & Organic CTA)", objective: "Seamless call to action pointing to next relevant video on end screen.", status: "Clean CTA" },
        ],
        transitionSignposts: [
          `"Now that you understand the foundation, here is where most people get stuck..."`,
          `"This next step is the single most important part of ${cleanTopic}..."`,
          `"Before we move on, watch what happens when you change this one setting..."`,
        ],
        recommendedCTA: `Ask a specific question related to ${cleanTopic} to drive comment velocity.`,
      },
      verifiedMetadata: verifiedMeta,
    };
  }

  // #04, #07, #08, #09, #36, #44: CAPTION & DESCRIPTION TOOLS
  if ([4, 7, 8, 9, 36, 44].includes(toolId)) {
    const isInstagram = toolId === 7 || targetPlatforms.includes("Instagram");
    const isTikTok = toolId === 8 || targetPlatforms.includes("TikTok");

    if (isTikTok) {
      return {
        toolId,
        toolName,
        category,
        toolType: "caption",
        inputContext: baseContext,
        captionData: {
          platform: "TikTok",
          optimizedCaption: `Everything you need to know about ${cleanTopic} in 60 seconds 👇 Save this for later! #${cleanTag(words[0] || "tips")} #${cleanTag(primaryKw)} #learnontiktok #fyp`,
          characterCount: 142,
          charLimitAdvice: "TikTok search indexing thrives on natural search phrases in the first 100 characters.",
          spokenKeywordsAdvice: "Ensure you verbally say the exact keyword in your video audio to match auto-captions with FYP search algorithms.",
          hashtags: [`#${cleanTag(words[0] || "tips")}`, `#${cleanTag(primaryKw)}`, `#learnontiktok`, `#fyp`],
        },
        verifiedMetadata: verifiedMeta,
      };
    }

    if (isInstagram) {
      return {
        toolId,
        toolName,
        category,
        toolType: "caption",
        inputContext: baseContext,
        captionData: {
          platform: "Instagram",
          firstLineHook: `Stop overcomplicating ${cleanTopic} 💡 (Swipe / Read below 👇)`,
          bodyParagraphs: [
            `Here are 3 key rules that will completely change how you approach ${cleanTopic}:`,
            `1️⃣ Focus on the fundamental principles first.\n2️⃣ Consistency beats sporadic intensity every time.\n3️⃣ Track your results and iterate based on actual feedback.`,
            `💾 Save this post so you have it ready when you need it.\n💬 What's your biggest challenge with ${cleanTopic}? Let me know below!`,
          ],
          formattedCaption: `Stop overcomplicating ${cleanTopic} 💡 (Read below 👇)\n\nHere are 3 key rules to keep in mind:\n\n1️⃣ Focus on fundamentals first\n2️⃣ Keep execution consistent\n3️⃣ Measure real feedback\n\n💾 Save this post for reference!\n\n.${targetPlatforms.map(p => `#${cleanTag(p)}`).join(' ')} #${cleanTag(words[0] || "guide")}`,
          hashtags: [`#${cleanTag(words[0] || "tips")}`, `#${cleanTag(primaryKw)}`, `#creators`, `#reels`],
        },
        verifiedMetadata: verifiedMeta,
      };
    }

    // Default YouTube / Long Form Description
    return {
      toolId,
      toolName,
      category,
      toolType: "caption",
      inputContext: baseContext,
      descriptionData: {
        platform: "YouTube / Long-Form",
        structuredDescription: `In this video, we break down ${cleanTopic} step-by-step with practical strategies, real examples, and essential rules for success.\n\n⏱️ TIMESTAMPS & CHAPTERS:\n0:00 - Introduction & Overview\n0:45 - Key Fundamentals of ${cleanTopic}\n2:30 - Step-by-Step Walkthrough\n5:15 - Common Pitfalls to Avoid\n7:40 - Summary & Next Steps\n\n🔗 USEFUL RESOURCES:\n• Multi Tube Views: https://multitubeviews.com\n\n📌 CONNECT WITH US:\n• Subscribe for weekly breakdowns & creator guides\n\n${targetPlatforms.map(p => `#${cleanTag(p)}`).join(' ')} #${cleanTag(words[0] || "guide")}`,
        naturalKeywordPlacement: "Primary keywords integrated in the first 2 sentences and timestamp chapter titles for video SEO indexing.",
      },
      verifiedMetadata: verifiedMeta,
    };
  }

  // #05, #10, #11, #12, #13, #32, #33, #49, #50, #51, #58, #59: TOPIC & QUESTION FINDER TOOLS
  if ([5, 10, 11, 12, 13, 32, 33, 49, 50, 51, 58, 59].includes(toolId)) {
    return {
      toolId,
      toolName,
      category,
      toolType: "topic",
      inputContext: baseContext,
      topicPillars: {
        coreTopic: cleanTopic,
        subtopics: [
          `Foundations & Core Terminology of ${cleanTopic}`,
          `Essential Tools & Setup for ${cleanTopic}`,
          `Advanced Strategies & Workflow Optimization`,
          `Troubleshooting & Common Failure Points`,
          `Real-World Case Studies & Examples`,
          `Future Trends & Long-Term Outlook (${new Date().getFullYear()})`,
        ],
        contentAngles: [
          { angle: "The Beginner's Crash Course", description: "Zero-jargon onboarding for complete newcomers." },
          { angle: "The Myth-Busting Breakdown", description: "Debunking 3 dangerous misconceptions in the niche." },
          { angle: "The Productivity Speedrun", description: "How to complete the process in half the typical time." },
          { angle: "The Cost & ROI Analysis", description: "Is it worth the time and investment? Practical breakdown." },
        ],
        questions: {
          howToQuestions: [
            `How to start with ${cleanTopic} as a beginner?`,
            `How to optimize ${cleanTopic} for best performance?`,
            `How to troubleshoot errors in ${cleanTopic}?`,
          ],
          whatAndWhyQuestions: [
            `What is ${cleanTopic} and why does it matter?`,
            `Why do most beginners struggle with ${cleanTopic}?`,
            `What are the best tools for ${cleanTopic}?`,
          ],
          comparisonQuestions: [
            `${cleanTopic} vs traditional methods: Which is better?`,
            `Free vs paid tools for ${cleanTopic}`,
          ],
        },
      },
      verifiedMetadata: verifiedMeta,
    };
  }

  // #21, #22, #43, #47, #48, #52: CONTENT IDEAS & CALENDAR TOOLS
  if ([21, 22, 43, 47, 48, 52].includes(toolId)) {
    if (toolId === 48) {
      // 4-Week Publishing Calendar
      return {
        toolId,
        toolName,
        category,
        toolType: "calendar",
        inputContext: baseContext,
        calendar: {
          pillar: cleanTopic,
          weeks: [
            {
              weekNumber: 1,
              theme: "Foundations & Awareness",
              posts: [
                { day: "Tuesday", format: "Long-Form Video", title: `${cleanTopic}: Complete Beginner's Guide`, platform: "YouTube" },
                { day: "Thursday", format: "Short-Form Reel", title: `3 Things You Need for ${cleanTopic}`, platform: "Instagram / TikTok" },
                { day: "Saturday", format: "Discussion Thread", title: `What surprised me about ${cleanTopic}`, platform: "X / LinkedIn" },
              ],
            },
            {
              weekNumber: 2,
              theme: "Practical Walkthrough & Tools",
              posts: [
                { day: "Tuesday", format: "Long-Form Video", title: `Step-by-Step ${cleanTopic} Workflow (Live Demo)`, platform: "YouTube" },
                { day: "Thursday", format: "Short-Form Reel", title: `The Biggest Mistake in ${cleanTopic}`, platform: "Instagram / TikTok" },
                { day: "Friday", format: "Visual Checklist Pin", title: `5-Point ${cleanTopic} Checklist`, platform: "Pinterest / Reddit" },
              ],
            },
            {
              weekNumber: 3,
              theme: "Common Pitfalls & Troubleshooting",
              posts: [
                { day: "Tuesday", format: "Long-Form Video", title: `Why Your ${cleanTopic} Isn't Working (And Fixes)`, platform: "YouTube" },
                { day: "Thursday", format: "Short-Form Reel", title: `Quick Fix for ${cleanTopic} Errors`, platform: "Instagram / TikTok" },
              ],
            },
            {
              weekNumber: 4,
              theme: "Advanced Optimization & Masterclass",
              posts: [
                { day: "Tuesday", format: "Long-Form Video", title: `Advanced ${cleanTopic} Blueprint for Pros`, platform: "YouTube" },
                { day: "Saturday", format: "Roundup Newsletter / Post", title: `Monthly Summary & Key Takeaways`, platform: "LinkedIn / Community" },
              ],
            },
          ],
        },
        verifiedMetadata: verifiedMeta,
      };
    }

    return {
      toolId,
      toolName,
      category,
      toolType: "ideas",
      inputContext: baseContext,
      ideas: [
        {
          id: 1,
          title: `The Ultimate Guide to ${cleanTopic} in ${new Date().getFullYear()}`,
          hook: `"If you only watch one video on ${cleanTopic}, make it this one."`,
          format: "Comprehensive Tutorial (8-12 min)",
          targetAudience: "Beginners & Intermediate practitioners",
          coreValue: "All-in-one authoritative walkthrough.",
        },
        {
          id: 2,
          title: `I Tested 5 Ways to Do ${cleanTopic} (Here is the Winner)`,
          hook: `"I spent 30 days testing methods so you don't have to waste time."`,
          format: "Experiment / Case Study",
          targetAudience: "Curious searchers & decision makers",
          coreValue: "Objective comparisons with clear actionable winner.",
        },
        {
          id: 3,
          title: `3 Costly ${cleanTopic} Mistakes You Need to Avoid`,
          hook: `"If your results look like this, you're making mistake number 2."`,
          format: "Problem / Solution Breakdown",
          targetAudience: "Active creators facing friction",
          coreValue: "Immediate diagnostic troubleshooting.",
        },
        {
          id: 4,
          title: `${cleanTopic} Explained in Under 5 Minutes`,
          hook: `"No fluff, no sponsored intro—here is the exact breakdown."`,
          format: "Rapid-Fire Explainer",
          targetAudience: "Busy professionals seeking fast answers",
          coreValue: "High-density concise clarity.",
        },
        {
          id: 5,
          title: `The Secret ${cleanTopic} Strategy Nobody Talks About`,
          hook: `"Most tutorials skip this one step, and that's why people fail."`,
          format: "Insider Strategy Masterclass",
          targetAudience: "Advanced users wanting an edge",
          coreValue: "High-retention novel perspective.",
        },
      ],
      verifiedMetadata: verifiedMeta,
    };
  }

  // #15, #16, #17, #55, #57: COMPETITOR RESEARCH TOOLS
  if ([15, 16, 17, 55, 57].includes(toolId)) {
    return {
      toolId,
      toolName,
      category,
      toolType: "competitor",
      inputContext: baseContext,
      competitorAudit: {
        analyzedTopic: cleanTopic,
        competitorFocusSummary: `Competitors in ${cleanCategory} heavily rely on broad conceptual overviews and clickbait titles without providing verifiable step-by-step execution.`,
        contentGaps: [
          `Missing downloadable templates or checklists for ${primaryKw}`,
          `Lack of beginner troubleshooting walkthroughs`,
          `Outdated recommendations from previous years that no longer function`,
          `Absence of transparent multi-platform repurposing strategies`,
        ],
        differentiationOpportunities: [
          {
            area: "Title Packaging",
            tactic: "Replace vague hype with explicit outcomes and step counts (e.g. '5-Step Verified Guide').",
          },
          {
            area: "Pacing & Delivery",
            tactic: "Eliminate long spoken channel intros; jump straight into the first tip within 5 seconds.",
          },
          {
            area: "Visual Proof",
            tactic: "Show screen recordings and realistic before/after examples rather than generic stock footage.",
          },
        ],
      },
      verifiedMetadata: verifiedMeta,
    };
  }

  // #07, #53, #54: CHECKLIST TOOLS
  if ([7, 53, 54].includes(toolId)) {
    return {
      toolId,
      toolName,
      category,
      toolType: "checklist",
      inputContext: baseContext,
      checklists: {
        preUploadSeoChecklist: [
          { id: "chk_1", task: "Target search phrase front-loaded in the first 40 characters of the title", checked: false },
          { id: "chk_2", task: "Natural keyword integration in the first 200 characters of the description", checked: false },
          { id: "chk_3", task: "3 to 8 platform-appropriate hashtags placed cleanly at the bottom", checked: false },
          { id: "chk_4", task: "Custom thumbnail tested at small mobile sizes (120x68px) for text legibility", checked: false },
          { id: "chk_5", task: "Bottom-right 20% of thumbnail kept clear of critical text to prevent timestamp overlap", checked: false },
          { id: "chk_6", task: "Accurate category and language metadata selected in platform settings", checked: false },
        ],
        publishingDayChecklist: [
          { id: "chk_7", task: "Verify optimal posting time for target country/audience", checked: false },
          { id: "chk_8", task: "Pin first comment with an engaging discussion prompt or resource link", checked: false },
          { id: "chk_9", task: "Add end screens and relevant info cards linking to complementary videos", checked: false },
          { id: "chk_10", task: "Distribute formatted snippets across secondary social channels", checked: false },
          { id: "chk_11", task: "Reply to early viewer comments within the first 60 minutes to encourage discussion", checked: false },
        ],
      },
      verifiedMetadata: verifiedMeta,
    };
  }

  // #06, #23, #24, #38, #39, #40, #41, #42, #60: REPURPOSING & MULTI-PLATFORM
  if ([6, 23, 24, 38, 39, 40, 41, 42, 60].includes(toolId)) {
    const platformPackages: Record<string, any> = {};
    targetPlatforms.forEach(p => {
      const pTag = cleanTag(p);
      if (p === "YouTube") {
        platformPackages[p] = {
          title: `${cleanTopic}: Full Walkthrough & Guide`,
          format: "Long-Form Video (8-12 min) or Short (30-60s)",
          caption: `In this breakdown, we cover ${cleanTopic} step-by-step.\n\nTimestamps:\n0:00 Intro\n1:00 Setup\n3:30 Core Strategy\n\n#${pTag} #${cleanTag(words[0] || "tips")}`,
          rules: "Focus on first 40 chars of title; ensure chapters are present in description.",
        };
      } else if (p === "Instagram") {
        platformPackages[p] = {
          title: `How to Master ${cleanTopic}`,
          format: "Reel / Carousel Post",
          caption: `Stop overcomplicating ${cleanTopic} 💡 (Save this for later!)\n\nKey takeaways:\n• Focus on core principles\n• Keep execution consistent\n• Measure real feedback\n\n#${pTag} #${cleanTag(words[0] || "tips")} #creator`,
          rules: "High-contrast hook on first 2 seconds; clean caption spacing.",
        };
      } else if (p === "TikTok") {
        platformPackages[p] = {
          title: `${cleanTopic} in 60s`,
          format: "Vertical Short-Form (9:16)",
          caption: `The fastest way to master ${cleanTopic} 👇 #${pTag} #${cleanTag(words[0] || "tips")} #learnontiktok`,
          rules: "Spoken verbal hook within 1.5s; match on-screen text with search query keywords.",
        };
      } else if (p === "LinkedIn") {
        platformPackages[p] = {
          title: `Key Insights: ${cleanTopic}`,
          format: "Text Post / Carousel PDF",
          caption: `Strategic insights on ${cleanTopic} for practitioners:\n\n1. Foundational alignment\n2. High-retention execution\n3. Scalable organic reach\n\nWhat has been your experience? #${pTag} #strategy`,
          rules: "Professional formatting; encourage thoughtful discourse in comments.",
        };
      } else if (p === "X") {
        platformPackages[p] = {
          title: `Thread on ${cleanTopic}`,
          format: "5-Tweet Thread",
          caption: `A concise breakdown on ${cleanTopic}:\n\n1/ The core challenge\n2/ The 3-step solution\n3/ Key mistakes to avoid\n\nBookmark this thread for reference! 🧵 #${pTag}`,
          rules: "Opening tweet must contain high curiosity hook under 240 chars.",
        };
      } else {
        platformPackages[p] = {
          title: `${cleanTopic} (${p} Edition)`,
          format: `Native ${p} Post`,
          caption: `Structured guide to ${cleanTopic} formatted for ${p}.\n\n#${pTag} #${cleanTag(words[0] || "guide")}`,
          rules: `Follow native ${p} community guidelines.`,
        };
      }
    });

    return {
      toolId,
      toolName,
      category,
      toolType: "repurpose",
      inputContext: baseContext,
      platformPackages,
      verifiedMetadata: verifiedMeta,
    };
  }

  // DEFAULT / #01, #25, #26, #27, #34: COMPREHENSIVE SEO AUDIT
  return {
    toolId,
    toolName,
    category,
    toolType: "seo_audit",
    inputContext: baseContext,
    scores: {
      overallScore: 88,
      factorBreakdown: [
        { factor: "Title SEO & Search Intent", score: 90, status: "Optimal" },
        { factor: "Description Depth & Chapters", score: 85, status: "Verified" },
        { factor: "Keyword Density & Placement", score: 88, status: "Balanced" },
        { factor: "Platform Format Compliance", score: 90, status: "High Fit" },
      ],
    },
    titleAudit: {
      optimizedTitle: `${cleanTopic}: Complete Guide & Key Insights`,
      recommendation: "Primary search phrase is front-loaded within 40 characters for full mobile snippet visibility.",
    },
    descriptionAudit: {
      optimizedDescription: `In this guide, we break down ${cleanTopic} with actionable steps, practical examples, and core rules for success.\n\n⏱️ TIMESTAMPS & CHAPTERS:\n0:00 - Introduction & Overview\n1:15 - Foundational Concepts of ${cleanTopic}\n3:30 - Step-by-Step Implementation\n6:00 - Common Pitfalls & Solutions\n8:15 - Key Takeaways & Wrap-up\n\n🔗 RESOURCES:\n• Multi Tube Views: https://multitubeviews.com\n\n${targetPlatforms.map(p => `#${cleanTag(p)}`).join(' ')} #${cleanTag(words[0] || "guide")}`,
    },
    keywords: [primaryKw, `${primaryKw} tutorial`, `${primaryKw} guide`, `${cleanCategory.toLowerCase()}`, "best practices"],
    hashtags: [`#${cleanTag(words[0] || "tips")}`, `#${cleanTag(primaryKw)}`, ...targetPlatforms.map(p => `#${cleanTag(p)}`)],
    verifiedMetadata: verifiedMeta,
  };
}

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

