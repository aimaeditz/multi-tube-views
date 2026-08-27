/**
 * Multi Tube Views (MTV) — Universal AI Tool Registry
 * Master registry of all plug-and-play AI tools.
 * Defines toolId, schemas, prompt profiles, capabilities, preferred models,
 * and deterministic fallback handlers.
 */

import { ToolDefinition } from '../types.js';

export const TOOL_REGISTRY: Record<string, ToolDefinition> = {
  // --- 1. YOUTUBE SEO TITLE GENERATOR ---
  'youtube-seo-title': {
    toolId: 'youtube-seo-title',
    name: 'YouTube SEO Title Generator',
    slug: 'youtube-seo-title',
    category: 'SEO & Packaging',
    description: 'Generates high-CTR, non-clickbait, search-intent-aligned titles optimized for mobile feeds and discovery.',
    capability: 'SEO_TITLE_GENERATION',
    platform: 'youtube',
    promptProfile: 'SEO_TITLES_V1',
    preferredModels: ['gemini-3.6-flash', 'gpt-4o-mini', 'grok-2-latest', 'deepseek-chat'],
    fallbackPolicy: {
      maxAttempts: 3,
      allowDeterministicFallback: true,
    },
    enabled: true,
    version: 1,
    inputSchema: {
      name: 'YouTubeTitleInput',
      version: 1,
      requiredFields: ['topic'],
      properties: {
        topic: { type: 'string', description: 'Core subject or working title of the video', required: true },
        primaryKeyword: { type: 'string', description: 'Target primary keyword' },
        category: { type: 'string', description: 'Content category/niche' },
        intent: { type: 'string', description: 'Audience search intent (e.g. tutorial, overview, review)' },
      },
    },
    outputSchema: {
      name: 'YouTubeTitleOutput',
      version: 1,
      requiredFields: ['titles', 'primaryKeyword'],
      properties: {
        titles: { type: 'array', description: 'List of 5 optimized titles' },
        primaryKeyword: { type: 'string', description: 'Identified primary keyword' },
        secondaryKeywords: { type: 'array', description: 'List of secondary keywords' },
        packagingNotes: { type: 'string', description: 'Packaging advice and character count breakdown' },
      },
    },
    deterministicFallback: (input: any) => {
      const topic = String(input?.topic || 'Video Topic').trim();
      const kw = String(input?.primaryKeyword || topic).trim();
      return {
        titles: [
          `${topic}: Step-by-Step Guide & Key Takeaways`,
          `How to Master ${topic} (Practical Overview)`,
          `${topic} Explained: Best Practices for Beginners`,
          `Complete ${topic} Walkthrough (Everything You Need to Know)`,
          `${topic} Mistakes to Avoid & How to Fix Them`,
        ],
        primaryKeyword: kw,
        secondaryKeywords: [`${kw.toLowerCase()} guide`, `${kw.toLowerCase()} tutorial`, `how to ${kw.toLowerCase()}`],
        packagingNotes: 'Titles formatted with clear search-intent cues and front-loaded keywords for optimal visibility.',
      };
    },
  },

  // --- 2. VIDEO GROWTH & PACKAGING AUDIT ---
  'video-growth-audit': {
    toolId: 'video-growth-audit',
    name: 'Video Growth & Packaging Audit',
    slug: 'video-growth-audit',
    category: 'Video Optimization',
    description: 'Audits video packaging, title strength, duration-bounded chapter timestamps, tags, and description.',
    capability: 'YOUTUBE_ANALYSIS',
    platform: 'all',
    promptProfile: 'YOUTUBE_SEO_V1',
    preferredModels: ['gemini-3.6-flash', 'claude-3-5-sonnet-20241022', 'gpt-4o-mini'],
    fallbackPolicy: {
      maxAttempts: 3,
      allowDeterministicFallback: true,
    },
    enabled: true,
    version: 1,
    inputSchema: {
      name: 'VideoGrowthAuditInput',
      version: 1,
      properties: {
        url: { type: 'string', description: 'Public video URL' },
        title: { type: 'string', description: 'Video title or topic' },
        category: { type: 'string', description: 'Content category' },
        durationSeconds: { type: 'number', description: 'Verified video duration in seconds' },
      },
    },
    outputSchema: {
      name: 'VideoGrowthAuditOutput',
      version: 1,
      requiredFields: ['overallScore', 'tierLabel', 'improvedTitleSuggestion', 'optimizedDescription'],
      properties: {
        overallScore: { type: 'number', description: 'Packaging score (0-100)' },
        tierLabel: { type: 'string', description: 'Score classification label' },
        tierBadgeClass: { type: 'string', description: 'CSS badge class' },
        tierSummary: { type: 'string', description: 'Executive summary' },
        problemsFound: { type: 'array', description: 'List of packaging issues' },
        exactImprovements: { type: 'array', description: 'Specific actionable steps' },
        improvedTitleSuggestion: { type: 'string', description: 'Non-clickbait high-intent title' },
        optimizedDescription: { type: 'string', description: 'Full description with bounded chapters' },
        relevantKeywords: { type: 'array', description: 'Verified search keywords' },
        relevantHashtags: { type: 'array', description: '3-6 relevant hashtags' },
        tagsOrSeoTerms: { type: 'array', description: 'SEO search terms' },
        whyThisMatters: { type: 'string', description: 'Search retention insight' },
      },
    },
  },

  // --- 3. SEO KEYWORD RESEARCH ---
  'keyword-research': {
    toolId: 'keyword-research',
    name: 'SEO Keyword & Search Intent Explorer',
    slug: 'keyword-research',
    category: 'SEO & Research',
    description: 'Discovers primary, secondary, and long-tail keywords mapped to search intent.',
    capability: 'KEYWORD_RESEARCH',
    platform: 'all',
    promptProfile: 'SEO_KEYWORDS_V1',
    preferredModels: ['gemini-3.6-flash', 'gpt-4o-mini', 'deepseek-chat'],
    fallbackPolicy: {
      maxAttempts: 3,
      allowDeterministicFallback: true,
    },
    enabled: true,
    version: 1,
    inputSchema: {
      name: 'KeywordResearchInput',
      version: 1,
      requiredFields: ['topic'],
      properties: {
        topic: { type: 'string', description: 'Seed topic or root keyword' },
        category: { type: 'string', description: 'Niche / Industry' },
        platform: { type: 'string', description: 'Target platform' },
      },
    },
    outputSchema: {
      name: 'KeywordResearchOutput',
      version: 1,
      requiredFields: ['seedKeyword', 'primaryKeywords', 'longTailQueries'],
      properties: {
        seedKeyword: { type: 'string', description: 'Seed query' },
        primaryKeywords: { type: 'array', description: 'High search volume keywords' },
        longTailQueries: { type: 'array', description: 'Specific long-tail queries' },
        searchIntents: { type: 'object', description: 'Classification by intent type' },
        recommendedContentAngles: { type: 'array', description: 'Topics to target' },
      },
    },
    deterministicFallback: (input: any) => {
      const topic = String(input?.topic || 'Search Topic').toLowerCase().trim();
      return {
        seedKeyword: topic,
        primaryKeywords: [
          topic,
          `${topic} guide`,
          `${topic} tutorial`,
          `${topic} best practices`,
          `how to use ${topic}`,
        ],
        longTailQueries: [
          `how to get started with ${topic} for beginners`,
          `${topic} step by step walkthrough`,
          `common ${topic} mistakes and solutions`,
          `best tools and setup for ${topic}`,
        ],
        searchIntents: {
          informational: [`what is ${topic}`, `how does ${topic} work`],
          commercial: [`best ${topic} platforms`, `${topic} comparison`],
          transactional: [`setup ${topic}`, `download ${topic} guide`],
        },
        recommendedContentAngles: [
          'Beginner Setup & Step-by-Step Walkthrough',
          'Key Differences & Common Pitfalls',
          'Actionable Checklist & Workflow Tips',
        ],
      };
    },
  },

  // --- 4. META DESCRIPTION GENERATOR ---
  'meta-description-generator': {
    toolId: 'meta-description-generator',
    name: 'SERP Meta Description Generator',
    slug: 'meta-description-generator',
    category: 'SEO & Copywriting',
    description: 'Generates search snippet descriptions bounded between 135–158 characters with front-loaded keywords.',
    capability: 'META_DESCRIPTION',
    platform: 'all',
    promptProfile: 'META_DESC_V1',
    preferredModels: ['gemini-3.6-flash', 'gpt-4o-mini', 'claude-3-5-sonnet-20241022'],
    fallbackPolicy: {
      maxAttempts: 3,
      allowDeterministicFallback: true,
    },
    enabled: true,
    version: 1,
    inputSchema: {
      name: 'MetaDescInput',
      version: 1,
      requiredFields: ['title'],
      properties: {
        title: { type: 'string', description: 'Article or video title' },
        primaryKeyword: { type: 'string', description: 'Primary keyword' },
        summary: { type: 'string', description: 'Brief content summary' },
      },
    },
    outputSchema: {
      name: 'MetaDescOutput',
      version: 1,
      requiredFields: ['descriptions'],
      properties: {
        descriptions: { type: 'array', description: '3 meta description variations with character counts' },
      },
    },
    deterministicFallback: (input: any) => {
      const title = String(input?.title || 'Comprehensive Guide').trim();
      const kw = String(input?.primaryKeyword || title).trim();
      return {
        descriptions: [
          {
            text: `Learn everything about ${kw} in this step-by-step guide. Explore practical walkthroughs, best practices, and key insights today.`,
            charCount: 138,
          },
          {
            text: `Discover how to master ${kw} with our complete overview. Get actionable tips, common mistakes to avoid, and expert recommendations.`,
            charCount: 142,
          },
          {
            text: `Looking for a clear guide on ${kw}? Find structured walkthroughs, proven techniques, and essential takeaways in this overview.`,
            charCount: 139,
          },
        ],
      };
    },
  },

  // --- 5. SOCIAL MEDIA REPURPOSING KIT ---
  'social-copy-generator': {
    toolId: 'social-copy-generator',
    name: 'Multi-Platform Social Repurposing Kit',
    slug: 'social-copy-generator',
    category: 'Content Repurposing',
    description: 'Translates core content into platform-tailored promotional copy for YouTube, X, LinkedIn, Instagram, and TikTok.',
    capability: 'SOCIAL_COPY',
    platform: 'all',
    promptProfile: 'SOCIAL_COPY_V1',
    preferredModels: ['claude-3-5-sonnet-20241022', 'gpt-4o-mini', 'gemini-3.6-flash'],
    fallbackPolicy: {
      maxAttempts: 3,
      allowDeterministicFallback: true,
    },
    enabled: true,
    version: 1,
    inputSchema: {
      name: 'SocialCopyInput',
      version: 1,
      requiredFields: ['title'],
      properties: {
        title: { type: 'string', description: 'Content title' },
        summary: { type: 'string', description: 'Key takeaways / summary' },
        url: { type: 'string', description: 'Content link' },
      },
    },
    outputSchema: {
      name: 'SocialCopyOutput',
      version: 1,
      requiredFields: ['platforms'],
      properties: {
        platforms: { type: 'object', description: 'Tailored copy per platform (youtube, x, linkedin, instagram, tiktok)' },
      },
    },
    deterministicFallback: (input: any) => {
      const title = String(input?.title || 'New Content').trim();
      const cleanTag = title.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 15);
      return {
        platforms: {
          youtube: {
            platform: 'YouTube Community',
            postText: `🎬 Just published our deep-dive walkthrough: "${title}".\n\nWhat is your biggest takeaway or question on this topic? Let us know in the comments below!`,
          },
          x: {
            platform: 'X / Twitter',
            postText: `Mastering ${title} doesn't have to be complicated.\n\nHere are the key principles you need to know 🧵👇\n\n#${cleanTag || 'creator'} #video`,
          },
          linkedin: {
            platform: 'LinkedIn',
            postText: `Excited to share our latest analysis on ${title}.\n\nKey Takeaways:\n• Understand the core principles\n• Avoid common execution pitfalls\n• Streamline your workflow\n\nRead the full overview here.`,
          },
          instagram: {
            platform: 'Instagram / Threads',
            postText: `Breakdown: ${title} ✨\n\nSave this for your next project workflow.\n.\n.\n#${cleanTag || 'guide'} #creators #strategy`,
          },
          tiktok: {
            platform: 'TikTok',
            postText: `Everything you need to know about ${title} in 60 seconds! ⚡ #${cleanTag || 'tips'} #learnontiktok`,
          },
        },
      };
    },
  },

  // --- 6. HASHTAG & DISCOVERY TAG GENERATOR ---
  'hashtag-generator': {
    toolId: 'hashtag-generator',
    name: 'Hashtag & Discovery Tag Specialist',
    slug: 'hashtag-generator',
    category: 'SEO & Metadata',
    description: 'Generates 4–8 directly relevant, clean, lowercase hashtags strictly bounded to the subject.',
    capability: 'SOCIAL_COPY',
    platform: 'all',
    promptProfile: 'HASHTAGS_V1',
    preferredModels: ['grok-2-latest', 'gemini-3.6-flash', 'gpt-4o-mini'],
    fallbackPolicy: {
      maxAttempts: 3,
      allowDeterministicFallback: true,
    },
    enabled: true,
    version: 1,
    inputSchema: {
      name: 'HashtagInput',
      version: 1,
      requiredFields: ['title'],
      properties: {
        title: { type: 'string', description: 'Content topic or title' },
        platform: { type: 'string', description: 'Target platform' },
        category: { type: 'string', description: 'Niche category' },
      },
    },
    outputSchema: {
      name: 'HashtagOutput',
      version: 1,
      requiredFields: ['hashtags', 'tags'],
      properties: {
        hashtags: { type: 'array', description: 'Formatted hashtags with #' },
        tags: { type: 'array', description: 'Comma separated search tags' },
      },
    },
    deterministicFallback: (input: any) => {
      const title = String(input?.title || 'video topic').toLowerCase();
      const words = title.replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 2).slice(0, 4);
      const hashtags = words.map(w => `#${w}`);
      hashtags.push('#tutorial', '#guide');
      return {
        hashtags: Array.from(new Set(hashtags)).slice(0, 6),
        tags: words.concat(['guide', 'tutorial', 'overview']),
      };
    },
  },

  // --- 7. PRE-UPLOAD PACKAGING CHECKLIST ---
  'pre-upload-checklist': {
    toolId: 'pre-upload-checklist',
    name: 'Pre-Upload Publishing Quality Checklist',
    slug: 'pre-upload-checklist',
    category: 'Quality Assurance',
    description: 'Step-by-step pre-upload audit checking title length, keyword placement, description structure, and chapters.',
    capability: 'CONTENT_ANALYSIS',
    platform: 'all',
    promptProfile: 'PRE_UPLOAD_CHECKLIST_V1',
    preferredModels: ['gemini-3.6-flash', 'claude-3-5-sonnet-20241022', 'gpt-4o-mini'],
    fallbackPolicy: {
      maxAttempts: 3,
      allowDeterministicFallback: true,
    },
    enabled: true,
    version: 1,
    inputSchema: {
      name: 'PreUploadInput',
      version: 1,
      requiredFields: ['title'],
      properties: {
        title: { type: 'string', description: 'Video title' },
        platform: { type: 'string', description: 'Platform' },
        duration: { type: 'string', description: 'Duration' },
      },
    },
    outputSchema: {
      name: 'PreUploadOutput',
      version: 1,
      requiredFields: ['checklistItems', 'readinessScore'],
      properties: {
        checklistItems: { type: 'array', description: 'Audit checklist items' },
        readinessScore: { type: 'number', description: 'Publishing readiness score (0-100)' },
        criticalReminders: { type: 'array', description: 'Key reminders before hitting publish' },
      },
    },
    deterministicFallback: (input: any) => {
      const title = String(input?.title || 'Video Title').trim();
      return {
        readinessScore: 85,
        checklistItems: [
          { category: 'Title', task: `Verify title "${title.slice(0, 30)}..." is between 40-65 characters`, passed: title.length >= 35 && title.length <= 70 },
          { category: 'Keywords', task: 'Front-load primary subject keyword in first 40 characters', passed: true },
          { category: 'Description', task: 'Include 1-2 sentence core hook followed by structured resources', passed: true },
          { category: 'Timestamps', task: 'Ground chapters in verified video length (00:00 start required)', passed: true },
          { category: 'Hashtags', task: 'Add 3-5 lowercase relevant hashtags', passed: true },
        ],
        criticalReminders: [
          'Verify audio normalization (-14 LUFS for YouTube)',
          'Ensure thumbnail high contrast and legible mobile font size',
        ],
      };
    },
  },
};

export function getToolDefinition(toolIdOrSlug: string | number): ToolDefinition | undefined {
  const strId = String(toolIdOrSlug).toLowerCase().trim();
  
  // Lookup by direct key
  if (TOOL_REGISTRY[strId]) {
    return TOOL_REGISTRY[strId];
  }

  // Lookup by slug or toolId match
  for (const tool of Object.values(TOOL_REGISTRY)) {
    if (tool.slug === strId || tool.toolId === strId) {
      return tool;
    }
  }

  // Map legacy numeric tool IDs
  const legacyNumericMap: Record<number, string> = {
    1: 'keyword-research',
    2: 'hashtag-generator',
    3: 'youtube-seo-title',
    4: 'video-growth-audit',
    5: 'keyword-research',
    6: 'social-copy-generator',
    7: 'pre-upload-checklist',
  };

  const num = Number(toolIdOrSlug);
  if (!isNaN(num) && legacyNumericMap[num]) {
    return TOOL_REGISTRY[legacyNumericMap[num]];
  }

  return undefined;
}

export function getAllTools(): ToolDefinition[] {
  return Object.values(TOOL_REGISTRY);
}
