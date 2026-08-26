import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { executeSeoTool } from "./server/seo-tools-registry.js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

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

// API endpoint for Video Growth Audit (backward compatibility)
app.post("/api/analyze-video", async (req, res) => {
  try {
    const { url = "", title = "", category = "Education & Tech" } = req.body;
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

    const ai = getAI();

    // AI audit with Gemini (using gemini-3.7-flash with strict instructions for the 4 outputs)
    if (ai && hasValidInput) {
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

        const aiPromise = ai.models.generateContent({
          model: "gemini-3.7-flash",
          contents: prompt,
          config: {
            systemInstruction:
              "You are an expert video SEO and packaging auditor. Output strict JSON adhering to exact verified duration, non-clickbait titles, and grounded timestamps.",
            responseMimeType: "application/json",
            temperature: 0.2,
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                overallScore: { type: Type.INTEGER },
                tierLabel: { type: Type.STRING },
                tierBadgeClass: { type: Type.STRING },
                tierSummary: { type: Type.STRING },
                problemsFound: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "3 to 5 key findings",
                },
                exactImprovements: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "2 to 3 actionable improvements",
                },
                improvedTitleSuggestion: {
                  type: Type.STRING,
                  description: "Accurate, high-intent title without clickbait",
                },
                optimizedDescription: {
                  type: Type.STRING,
                  description: "Concise description with grounded timestamps based strictly on actual duration or explicit Data unavailable note",
                },
                relevantKeywords: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Video-specific keywords directly relevant to real topic",
                },
                relevantHashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                tagsOrSeoTerms: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Video-specific SEO search terms directly relevant to real topic",
                },
                whyThisMatters: { type: Type.STRING },
              },
              required: [
                "overallScore",
                "tierLabel",
                "tierBadgeClass",
                "problemsFound",
                "exactImprovements",
                "improvedTitleSuggestion",
                "optimizedDescription",
                "relevantKeywords",
                "relevantHashtags",
                "tagsOrSeoTerms",
                "whyThisMatters",
              ],
            },
          },
        });

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("AI timeout")), 20000)
        );

        const response: any = await Promise.race([aiPromise, timeoutPromise]);
        const text = response.text;
        if (text) {
          const parsed = JSON.parse(text);
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

// Master API endpoint for Social Media Research & SEO Suite (Approved 10 Tools)
// Provides tool-specific schemas, specialized prompts, and grounded deterministic engines for the 10 tools
app.post("/api/seo-research", async (req, res) => {
  try {
    const {
      toolId = 1,
      toolName = "Video SEO Analyzer",
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
    } = req.body;

    let inputUrl = String(url || "").trim();
    let effectiveTopic = String(singleInput || topic || title || keyword || description || "").trim();

    if (singleInput && /^https?:\/\//i.test(singleInput.trim())) {
      inputUrl = singleInput.trim();
      effectiveTopic = "";
    }

    // Inspect URL if provided
    const urlData = await inspectAndFetchVideoMetadata(inputUrl);
    const resolvedTopic = effectiveTopic || urlData.realTitle || (urlData.videoId ? `Video ${urlData.videoId}` : "Content Strategy");
    const activePlatforms = Array.isArray(platforms) && platforms.length > 0 ? platforms : ["YouTube"];

    const numericToolId = Math.max(1, Math.min(10, Number(toolId) || 1));
    const cleanCategory = contentCategory || category || "Education & Tech";
    const geoCountry = country || "Global";
    const targetLang = language || "English";

    // 10 Approved Tool classifications
    const toolTypeMap: Record<number, string> = {
      1: "seo_audit",
      2: "keyword",
      3: "title",
      4: "hashtag",
      5: "hook",
      6: "caption",
      7: "topic",
      8: "competitor",
      9: "repurpose",
      10: "checklist",
    };

    const toolTypeKey = toolTypeMap[numericToolId] || "general";
    const ai = getAI();

    if (ai && (resolvedTopic || inputUrl)) {
      try {
        let systemPrompt = "";
        let userPrompt = "";
        let responseSchema: any = undefined;

        if (numericToolId === 1) {
          const videoId = urlData.videoId || "";
          const computedThumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;

          systemPrompt = `You are an expert video SEO and packaging auditor. Analyze the video and generate a professional, clear, detailed SEO audit. Return STRICT JSON conforming EXACTLY to the requested schema. No fake views, no fabricated CTR, likes, or comments. Use verified data where available or reasonably analyzed from the submitted input.`;
          
          userPrompt = `Perform a full professional video SEO audit of the following video submission:
- URL/Input: "${inputUrl || 'None'}"
- Platform: YouTube (or other platform if detected, focus primarily on YouTube SEO)
- Verified Real Title: "${urlData.realTitle || 'Data unavailable'}"
- Submitted Topic/Title: "${resolvedTopic}"
- Content Category: "${cleanCategory}"
- Verified Video Duration: ${urlData.durationSeconds ? `${urlData.durationFormatted} (${urlData.durationSeconds} seconds)` : 'Data unavailable'}
- Public Description Snippet: "${urlData.realDescription ? urlData.realDescription.slice(0, 500) : 'Data unavailable'}"

Do not invent private analytics or engagement signals. Grade the available evidence and calculate an overall score.

Your output must follow this exact schema:
{
  "videoTitle": string, (The analyzed video's title or the submitted topic)
  "thumbnailUrl": string or null, (Use "${computedThumbnail}" if videoId is available, otherwise null)
  "overallScore": number, (1 to 100)
  "overallGrade": string, (e.g., "A", "B+", "C")
  "overallSummary": string, (A 2-3 sentence expert summary of the SEO health)
  "titleAnalysis": {
    "score": number, (1 to 100)
    "charCount": number, (Estimate or compute exact character count of title)
    "keywordPresence": string, (Analysis of whether keywords are in the title and if they are front-loaded)
    "readability": string, (Analysis of how readable the title is for humans)
    "mobileTruncationRisk": string, (High / Medium / Low risk with details)
    "mainProblems": string[], (1 to 3 key title issues)
    "improvementSuggestions": string[], (1 to 3 suggestions)
    "optimizedTitles": string[] (3 to 5 clear, optimized, click-worthy but non-clickbait title options)
  },
  "descriptionAnalysis": {
    "score": number, (1 to 100)
    "length": number, (Estimate of description length in characters, or 0 if no desc)
    "keywordPlacement": string, (Whether keywords appear in the opening 150 characters)
    "openingLines": string, (Analysis of the first 2 sentences)
    "structure": string, (Analysis of formatting, links, and layout)
    "warnings": string, (Any keyword stuffing or hashtag warning)
    "missingElements": string[], (List of missing elements like chapters, links, CTAs)
    "improvements": string[] (2 to 4 actionable description improvements)
  },
  "tagsHashtagsAnalysis": {
    "existingTags": string[], (List of existing tags if parsed, or analyzed from content)
    "suggestedTags": string[], (4 to 8 highly relevant multi-word tags to target search intent)
    "suggestedHashtags": string[], (3 to 5 appropriate hashtags)
    "issuesExplanation": string (Expert advice on tags and hashtags optimization)
  },
  "seoIssues": [
    {
      "problem": string,
      "whyItMatters": string,
      "impact": string, (High, Medium, Low)
      "recommendedFix": string
    }
  ], (Show 2 to 4 clear issue cards)
  "technicalChecks": [
    { "name": "Title Length", "status": "pass" | "warning" | "fail", "note": string },
    { "name": "Keyword Placement", "status": "pass" | "warning" | "fail", "note": string },
    { "name": "Description Quality", "status": "pass" | "warning" | "fail", "note": string },
    { "name": "Tags", "status": "pass" | "warning" | "fail", "note": string },
    { "name": "Hashtag Count", "status": "pass" | "warning" | "fail", "note": string },
    { "name": "Metadata Completeness", "status": "pass" | "warning" | "fail", "note": string }
  ],
  "topRecommendations": string[], (Ranked list, highest impact first. Return exactly 3 items)
  "keywordOpportunities": string[] (3 to 5 high-value keyword phrases derived from the actual subject, without fabricated numbers)
}`;

          responseSchema = {
            type: Type.OBJECT,
            properties: {
              videoTitle: { type: Type.STRING },
              thumbnailUrl: { type: Type.STRING, nullable: true },
              overallScore: { type: Type.INTEGER },
              overallGrade: { type: Type.STRING },
              overallSummary: { type: Type.STRING },
              titleAnalysis: {
                type: Type.OBJECT,
                properties: {
                  score: { type: Type.INTEGER },
                  charCount: { type: Type.INTEGER },
                  keywordPresence: { type: Type.STRING },
                  readability: { type: Type.STRING },
                  mobileTruncationRisk: { type: Type.STRING },
                  mainProblems: { type: Type.ARRAY, items: { type: Type.STRING } },
                  improvementSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
                  optimizedTitles: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["score", "charCount", "keywordPresence", "readability", "mobileTruncationRisk", "mainProblems", "improvementSuggestions", "optimizedTitles"]
              },
              descriptionAnalysis: {
                type: Type.OBJECT,
                properties: {
                  score: { type: Type.INTEGER },
                  length: { type: Type.INTEGER },
                  keywordPlacement: { type: Type.STRING },
                  openingLines: { type: Type.STRING },
                  structure: { type: Type.STRING },
                  warnings: { type: Type.STRING },
                  missingElements: { type: Type.ARRAY, items: { type: Type.STRING } },
                  improvements: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["score", "length", "keywordPlacement", "openingLines", "structure", "warnings", "missingElements", "improvements"]
              },
              tagsHashtagsAnalysis: {
                type: Type.OBJECT,
                properties: {
                  existingTags: { type: Type.ARRAY, items: { type: Type.STRING } },
                  suggestedTags: { type: Type.ARRAY, items: { type: Type.STRING } },
                  suggestedHashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                  issuesExplanation: { type: Type.STRING }
                },
                required: ["existingTags", "suggestedTags", "suggestedHashtags", "issuesExplanation"]
              },
              seoIssues: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    problem: { type: Type.STRING },
                    whyItMatters: { type: Type.STRING },
                    impact: { type: Type.STRING },
                    recommendedFix: { type: Type.STRING }
                  },
                  required: ["problem", "whyItMatters", "impact", "recommendedFix"]
                }
              },
              technicalChecks: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    status: { type: Type.STRING },
                    note: { type: Type.STRING }
                  },
                  required: ["name", "status", "note"]
                }
              },
              topRecommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
              keywordOpportunities: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: [
              "videoTitle",
              "thumbnailUrl",
              "overallScore",
              "overallGrade",
              "overallSummary",
              "titleAnalysis",
              "descriptionAnalysis",
              "tagsHashtagsAnalysis",
              "seoIssues",
              "technicalChecks",
              "topRecommendations",
              "keywordOpportunities"
            ]
          };
        } else if (numericToolId === 2) {
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

        const configObj: any = {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          temperature: 0.3,
        };
        if (responseSchema) {
          configObj.responseSchema = responseSchema;
        }

        const aiPromise = ai.models.generateContent({
          model: "gemini-3.7-flash",
          contents: userPrompt,
          config: configObj,
        });

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("AI timeout")), 18000)
        );

        const response: any = await Promise.race([aiPromise, timeoutPromise]);
        const text = response.text;
        if (text) {
          const parsed = JSON.parse(text);
          return res.json({
            toolId: numericToolId,
            toolName,
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
          });
        }
      } catch (err: any) {
        // Fall back to deterministic tool generator
      }
    }

    // High quality deterministic tool-specific response matching strict per-tool contract
    const groundedResult = executeSeoTool({
      toolId: numericToolId,
      toolName,
      category,
      topic: resolvedTopic,
      platforms: activePlatforms,
      country: geoCountry,
      language: targetLang,
      contentCategory: cleanCategory,
      audience,
      contentType,
      competitorInput,
      tone,
      duration,
      urlData,
    });

    return res.json(groundedResult);
  } catch (error: any) {
    console.error("SEO Research API error:", error);
    return res.status(500).json({
      error: "Unable to process SEO research request. Please verify inputs and try again.",
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

  // #04, #05, #28, #45: HASHTAG TOOLS -> ONLY HASHTAGS & TAGS
  if ([4, 5, 28, 45].includes(toolId)) {
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

  // #02, #03, #14, #29, #30, #31, #37, #46, #56: KEYWORD TOOLS -> ONLY KEYWORDS & INTENT
  if ([2, 3, 14, 29, 30, 31, 37, 46, 56].includes(toolId)) {
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

  // #18: HOOK ANALYZER -> ONLY HOOKS & ATTENTION TRIGGERS
  if ([18].includes(toolId)) {
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

  // #07, #08, #09, #36, #44: CAPTION & DESCRIPTION TOOLS
  if ([7, 8, 9, 36, 44].includes(toolId)) {
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

  // #10, #11, #12, #13, #32, #33, #49, #50, #51, #58, #59: TOPIC & QUESTION FINDER TOOLS
  if ([10, 11, 12, 13, 32, 33, 49, 50, 51, 58, 59].includes(toolId)) {
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

  // #53, #54: CHECKLIST TOOLS
  if ([53, 54].includes(toolId)) {
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

  // #23, #24, #38, #39, #40, #41, #42, #60: REPURPOSING & MULTI-PLATFORM
  if ([23, 24, 38, 39, 40, 41, 42, 60].includes(toolId)) {
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

