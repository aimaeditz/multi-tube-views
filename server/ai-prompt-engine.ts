import fs from "fs";
import path from "path";

export interface PromptRecord {
  id: string;
  postId: string;
  title: string;
  originalPostTitle: string;
  sourceUrl: string;
  imageUrl: string;
  promptText: string;
  category: string;
  categories: string[];
  pubDate: string;
  itemIndex: number;
}

export interface PromptSyncResult {
  success: boolean;
  source: string;
  syncedAt: string;
  total: number;
  categories: string[];
  prompts: PromptRecord[];
  error?: string;
}

const RSS_FEED_URL = "https://aipromptxpert.blogspot.com/feeds/posts/default?alt=rss";
const DATA_FILE_PATH = path.join(process.cwd(), "assets", "data", "ai-prompts.json");

// In-memory cache
let cachedData: PromptSyncResult | null = null;
let lastSyncTimestamp = 0;
let activeSyncPromise: Promise<PromptSyncResult> | null = null;
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes cache TTL

/**
 * Clean and unescape HTML entities
 */
function unescapeHtml(str: string): string {
  if (!str) return "";
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

/**
 * Remove hashtags, links, promo, and author text from prompt
 */
function cleanPromptText(text: string): string {
  if (!text) return "";
  let clean = unescapeHtml(text)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Remove leading 'PROMPT:' or 'Prompt:' label
  clean = clean.replace(/^(?:PROMPT|Prompt)\s*:\s*/i, "").trim();

  // Remove trailing hashtags (#something or multiple #tags)
  clean = clean.replace(/#\w+[\s\w#]*$/, "").trim();

  // Remove any trailing instructions/promotions that might have leaked
  clean = clean.replace(/(?:Support Us|Join Our Community|Follow on Instagram|Step 1\s*[—–-]|Welcome to AIPromptXpert).*$/i, "").trim();

  return clean;
}

/**
 * Parse an RSS feed XML chunk into prompt records
 */
function parseRssChunk(xmlText: string): { items: PromptRecord[]; categories: Set<string>; totalResults: number } {
  const items: PromptRecord[] = [];
  const categories = new Set<string>();

  const totMatch = xmlText.match(/<openSearch:totalResults>(\d+)<\/openSearch:totalResults>/);
  const totalResults = totMatch ? parseInt(totMatch[1], 10) : 0;

  const rawItems = xmlText.split("<item>").slice(1);

  for (const rawItem of rawItems) {
    const titleMatch = rawItem.match(/<title>([^<]+)<\/title>/);
    const rawTitle = titleMatch ? unescapeHtml(titleMatch[1]).trim() : "";
    
    const linkMatch = rawItem.match(/<link>([^<]+)<\/link>/);
    const sourceUrl = linkMatch ? linkMatch[1].trim() : "";

    const guidMatch = rawItem.match(/<guid[^>]*>([^<]+)<\/guid>/);
    const postId = guidMatch ? guidMatch[1].trim() : "";

    const pubDateMatch = rawItem.match(/<pubDate>([^<]+)<\/pubDate>/);
    const pubDate = pubDateMatch ? pubDateMatch[1].trim() : "";

    const catMatches = [...rawItem.matchAll(/<category[^>]*>([^<]+)<\/category>/g)].map(m => unescapeHtml(m[1]).trim());
    catMatches.forEach(c => categories.add(c));
    const primaryCategory = catMatches[0] || "AI Prompt";

    const descMatch = rawItem.match(/<description>([\s\S]*?)<\/description>/);
    if (!descMatch) continue;

    const rawHtml = unescapeHtml(descMatch[1]);

    // 1. Extract content images (exclude system logos/spacers)
    const allImages = [...rawHtml.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)]
      .map(m => m[1])
      .filter(src => src && !src.includes("blogger_logo") && !src.includes("clear.gif") && !src.includes("blank.gif"));

    // 2. Extract prompt blocks
    let promptBlocks = [...rawHtml.matchAll(/class=["'][^"']*prompt-text[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi)].map(m => m[1]);

    if (promptBlocks.length === 0) {
      const altMatches = [...rawHtml.matchAll(/(?:PROMPT|Prompt)\s*:\s*([\s\S]*?)(?:<\/div>|<\/p>|<button|<\/blockquote>)/gi)].map(m => m[1]);
      if (altMatches.length > 0) promptBlocks = altMatches;
    }

    // 3. Clean and validate prompts
    const validPrompts = promptBlocks
      .map(p => cleanPromptText(p))
      .filter(t => t.length > 20 && !t.startsWith("http") && !t.includes("Step 1 — Copy"));

    const baseTitle = rawTitle.replace(/\s*\[Code\s*#?\d+\]/i, "").trim();

    validPrompts.forEach((promptText, idx) => {
      // Maintain exact 1:1 image and prompt pair association
      const imgUrl = allImages[idx] || allImages[0] || "";
      if (promptText && imgUrl) {
        const itemIdx = idx + 1;
        const stableId = "prompt_" + (postId.replace(/[^a-zA-Z0-9]/g, "_") || "post") + "_" + itemIdx;
        const itemTitle = validPrompts.length > 1 ? `${baseTitle} (Style ${itemIdx})` : baseTitle;

        items.push({
          id: stableId,
          postId,
          title: itemTitle,
          originalPostTitle: rawTitle,
          sourceUrl,
          imageUrl: imgUrl,
          promptText,
          category: primaryCategory,
          categories: catMatches.length > 0 ? catMatches : ["AI Prompt"],
          pubDate,
          itemIndex: itemIdx,
        });
      }
    });
  }

  return { items, categories, totalResults };
}

/**
 * Load cached data from local disk file if exists
 */
function loadDiskCache(): PromptSyncResult | null {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const content = fs.readFileSync(DATA_FILE_PATH, "utf-8");
      const parsed = JSON.parse(content);
      if (parsed && Array.isArray(parsed.prompts) && parsed.prompts.length > 0) {
        return parsed as PromptSyncResult;
      }
    }
  } catch (err) {
    console.warn("Could not load local ai-prompts.json disk cache:", err);
  }
  return null;
}

/**
 * Save prompt result to disk cache
 */
function saveDiskCache(data: PromptSyncResult): void {
  try {
    const targets = [
      path.join(process.cwd(), "assets", "data", "ai-prompts.json"),
      path.join(process.cwd(), "public", "assets", "data", "ai-prompts.json"),
    ];

    if (fs.existsSync(path.join(process.cwd(), "dist"))) {
      targets.push(path.join(process.cwd(), "dist", "assets", "data", "ai-prompts.json"));
    }

    const jsonStr = JSON.stringify(data, null, 2);

    for (const target of targets) {
      const dir = path.dirname(target);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(target, jsonStr, "utf-8");
    }
  } catch (err) {
    console.error("Failed to write ai-prompts.json disk cache:", err);
  }
}

/**
 * Full RSS synchronization across all available posts with pagination
 */
export async function syncPromptsFromRss(force = false): Promise<PromptSyncResult> {
  const now = Date.now();

  // If in-memory cache is fresh and not forced, return immediately
  if (!force && cachedData && now - lastSyncTimestamp < CACHE_TTL_MS) {
    return cachedData;
  }

  // If already syncing, await ongoing sync to prevent duplicate parallel fetches
  if (activeSyncPromise) {
    return activeSyncPromise;
  }

  activeSyncPromise = (async () => {
    try {
      const allRecords: PromptRecord[] = [];
      const allCategories = new Set<string>();
      let startIndex = 1;
      const maxResults = 50;
      let totalAvailable = 0;

      // Paginate through the Blogger RSS feed
      while (true) {
        const url = `${RSS_FEED_URL}&start-index=${startIndex}&max-results=${maxResults}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const res = await fetch(url, {
          signal: controller.signal,
          headers: {
            "User-Agent": "MultiTubeViews-AIPromptSync/1.0",
            Accept: "application/rss+xml, application/xml, text/xml",
          },
        });
        clearTimeout(timeoutId);

        if (!res.ok) {
          console.warn(`Blogger RSS fetch failed at start-index ${startIndex} (status: ${res.status})`);
          break;
        }

        const xmlText = await res.text();
        const { items, categories, totalResults } = parseRssChunk(xmlText);

        if (!totalAvailable && totalResults) {
          totalAvailable = totalResults;
        }

        items.forEach(item => allRecords.push(item));
        categories.forEach(c => allCategories.add(c));

        if (items.length === 0 || rawItemsCount(xmlText) < maxResults || (totalAvailable > 0 && startIndex + maxResults > totalAvailable)) {
          break;
        }

        startIndex += maxResults;
        if (startIndex > 5000) break; // generous safety ceiling
      }

      // Deduplicate records idempotently
      const seenIds = new Set<string>();
      const seenHashes = new Set<string>();
      const uniqueRecords: PromptRecord[] = [];

      for (const rec of allRecords) {
        if (seenIds.has(rec.id)) continue;
        const contentHash = `${rec.imageUrl}::${rec.promptText.slice(0, 80)}`;
        if (seenHashes.has(contentHash)) continue;

        seenIds.add(rec.id);
        seenHashes.add(contentHash);
        uniqueRecords.push(rec);
      }

      if (uniqueRecords.length > 0) {
        const result: PromptSyncResult = {
          success: true,
          source: RSS_FEED_URL,
          syncedAt: new Date().toISOString(),
          total: uniqueRecords.length,
          categories: Array.from(allCategories),
          prompts: uniqueRecords,
        };

        cachedData = result;
        lastSyncTimestamp = Date.now();
        saveDiskCache(result);
        return result;
      }
    } catch (err: any) {
      console.error("RSS synchronization error:", err);
    } finally {
      activeSyncPromise = null;
    }

    // Fallback to disk cache if live RSS fetch fails or is unreachable
    const diskFallback = loadDiskCache();
    if (diskFallback) {
      cachedData = diskFallback;
      return diskFallback;
    }

    // Return clean non-breaking empty state (NEVER fabricated demo content)
    return {
      success: false,
      source: RSS_FEED_URL,
      syncedAt: new Date().toISOString(),
      total: 0,
      categories: [],
      prompts: [],
      error: "No AI prompts are available right now. Could not reach source RSS feed.",
    };
  })();

  return activeSyncPromise;
}

function rawItemsCount(xml: string): number {
  return (xml.match(/<item>/g) || []).length;
}

/**
 * Query prompts with category filter, search query, and pagination
 */
export async function getPrompts(query?: {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  categories: string[];
  prompts: PromptRecord[];
  syncedAt: string;
}> {
  const syncResult = await syncPromptsFromRss();
  let list = syncResult.prompts;

  // Filter by category
  if (query?.category && query.category !== "All") {
    const targetCat = query.category.toLowerCase().trim();
    list = list.filter(
      p =>
        p.category.toLowerCase().includes(targetCat) ||
        p.categories.some(c => c.toLowerCase().includes(targetCat))
    );
  }

  // Filter by search keyword
  if (query?.search && query.search.trim()) {
    const q = query.search.toLowerCase().trim();
    list = list.filter(
      p =>
        p.title.toLowerCase().includes(q) ||
        p.promptText.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.categories.some(c => c.toLowerCase().includes(q))
    );
  }

  const total = list.length;
  const page = Math.max(1, query?.page || 1);
  const limit = Math.max(1, Math.min(100, query?.limit || 24));
  const totalPages = Math.ceil(total / limit) || 1;
  const startIndex = (page - 1) * limit;
  const paginated = list.slice(startIndex, startIndex + limit);

  return {
    total,
    page,
    limit,
    totalPages,
    categories: syncResult.categories,
    prompts: paginated,
    syncedAt: syncResult.syncedAt,
  };
}

/**
 * Get individual prompt by ID
 */
export async function getPromptById(id: string): Promise<PromptRecord | null> {
  const syncResult = await syncPromptsFromRss();
  return syncResult.prompts.find(p => p.id === id) || null;
}
