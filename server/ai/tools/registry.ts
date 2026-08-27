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
    name: 'Meta Description Generator',
    slug: 'meta-description-generator',
    category: 'SEO & Copywriting',
    description: 'Generates SEO-friendly meta descriptions bounded between 135–158 characters with natural call-to-actions.',
    capability: 'META_DESCRIPTION',
    platform: 'all',
    promptProfile: 'META_DESCRIPTION_GENERATOR_V1',
    preferredModels: ['gemini-2.5-flash', 'gpt-4o-mini'],
    fallbackPolicy: {
      maxAttempts: 3,
      allowDeterministicFallback: true,
    },
    enabled: true,
    version: 1,
    inputSchema: {
      name: 'MetaDescriptionInput',
      version: 1,
      requiredFields: ['topic'],
      properties: {
        topic: { type: 'string', description: 'Core topic, page title, or keywords', required: true },
      },
    },
    outputSchema: {
      name: 'MetaDescriptionOutput',
      version: 1,
      requiredFields: ['descriptions'],
      properties: {
        descriptions: { type: 'array', description: 'List of optimized meta descriptions' },
      },
    },
    deterministicFallback: (input: any) => {
      const topic = String(input?.topic || 'Subject').trim();
      return {
        descriptions: [
          `Discover the ultimate guide to ${topic}. Learn best practices, key insights, and step-by-step walkthroughs in this complete overview.`,
          `Want to master ${topic}? Read our actionable tips, step-by-step tutorial, and detailed breakdown to elevate your skills.`,
          `Looking for a clear explanation of ${topic}? Explore expert techniques, common pitfalls to avoid, and essential takeaways.`,
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

  // --- 6. HASHTAG GENERATOR ---
  'hashtag-generator': {
    toolId: 'hashtag-generator',
    name: 'Hashtag Generator',
    slug: 'hashtag-generator',
    category: 'SEO & Metadata',
    description: 'Generates a large set of lowercase relevant hashtags based on your topic or niche.',
    capability: 'SOCIAL_COPY',
    platform: 'all',
    promptProfile: 'HASHTAG_GENERATOR_V1',
    preferredModels: ['gemini-2.5-flash', 'gpt-4o-mini', 'grok-2-latest'],
    fallbackPolicy: {
      maxAttempts: 3,
      allowDeterministicFallback: true,
    },
    enabled: true,
    version: 1,
    inputSchema: {
      name: 'HashtagInput',
      version: 1,
      requiredFields: ['topic'],
      properties: {
        topic: { type: 'string', description: 'Core topic or content description', required: true },
        quantity: { type: 'number', description: 'Quantity of hashtags to generate (25, 50, 100, 200, 300)', default: 25 },
        platform: { type: 'string', description: 'Target social media platform' },
      },
    },
    outputSchema: {
      name: 'HashtagOutput',
      version: 1,
      requiredFields: ['hashtags'],
      properties: {
        hashtags: { type: 'array', description: 'List of formatted hashtags starting with #' },
      },
    },
    deterministicFallback: (input: any) => {
      const topic = String(input?.topic || 'video').toLowerCase().replace(/[^a-z0-9\s]/g, '');
      const words = topic.split(/\s+/).filter(w => w.length > 2);
      const qty = Number(input?.quantity) || 25;
      const base = ['tutorial', 'guide', 'tips', 'trending', 'creator', 'video', 'viral', 'viralvideo', 'marketing', 'seo', 'growth', 'learning', 'howtoguide'];
      const combined = words.concat(base).map(w => `#${w}`);
      const hashtags = Array.from(new Set(combined)).slice(0, qty);
      return { hashtags };
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

  // --- 8. KEYWORD GENERATOR ---
  'keyword-generator': {
    toolId: 'keyword-generator',
    name: 'Keyword Generator',
    slug: 'keyword-generator',
    category: 'SEO & Research',
    description: 'Discovers primary, secondary, long-tail, and related search keywords mapped to search intent.',
    capability: 'KEYWORD_RESEARCH',
    platform: 'all',
    promptProfile: 'KEYWORD_GENERATOR_V1',
    preferredModels: ['gemini-2.5-flash', 'gpt-4o-mini'],
    fallbackPolicy: {
      maxAttempts: 3,
      allowDeterministicFallback: true,
    },
    enabled: true,
    version: 1,
    inputSchema: {
      name: 'KeywordGeneratorInput',
      version: 1,
      requiredFields: ['topic'],
      properties: {
        topic: { type: 'string', description: 'Seed topic or niche keyword', required: true },
      },
    },
    outputSchema: {
      name: 'KeywordGeneratorOutput',
      version: 1,
      requiredFields: ['primary', 'secondary', 'longTail', 'related'],
      properties: {
        primary: { type: 'array', description: 'High-volume primary keywords' },
        secondary: { type: 'array', description: 'Supporting secondary keywords' },
        longTail: { type: 'array', description: 'Highly specific long-tail queries' },
        related: { type: 'array', description: 'Thematically related keywords' },
      },
    },
    deterministicFallback: (input: any) => {
      const topic = String(input?.topic || 'SEO').toLowerCase().trim();
      return {
        primary: [topic, `${topic} tips`, `${topic} guide`],
        secondary: [`how to do ${topic}`, `best ${topic} tool`, `mastering ${topic}`],
        longTail: [`step by step ${topic} tutorial for beginners`, `how to increase views with ${topic}`, `common ${topic} mistakes and solutions`],
        related: ['seo strategy', 'content creation', 'digital marketing', 'video optimization'],
      };
    },
  },

  // --- 9. SEO TITLE GENERATOR ---
  'seo-title-generator': {
    toolId: 'seo-title-generator',
    name: 'SEO Title Generator',
    slug: 'seo-title-generator',
    category: 'SEO & Packaging',
    description: 'Generates non-clickbait, high-CTR, search-intent-aligned titles.',
    capability: 'SEO_TITLE_GENERATION',
    platform: 'all',
    promptProfile: 'SEO_TITLE_GENERATOR_V1',
    preferredModels: ['gemini-2.5-flash', 'gpt-4o-mini'],
    fallbackPolicy: {
      maxAttempts: 3,
      allowDeterministicFallback: true,
    },
    enabled: true,
    version: 1,
    inputSchema: {
      name: 'SeoTitleInput',
      version: 1,
      requiredFields: ['topic'],
      properties: {
        topic: { type: 'string', description: 'Core topic, working title or keyword', required: true },
      },
    },
    outputSchema: {
      name: 'SeoTitleOutput',
      version: 1,
      requiredFields: ['titles'],
      properties: {
        titles: { type: 'array', description: 'A list of 5-8 highly optimized titles' },
      },
    },
    deterministicFallback: (input: any) => {
      const topic = String(input?.topic || 'Topic').trim();
      return {
        titles: [
          `Mastering ${topic}: A Complete Step-by-Step Guide`,
          `How to ${topic} (Beginners Tutorial & Best Practices)`,
          `${topic} Explained: Everything You Need to Know`,
          `5 Essential ${topic} Mistakes You Must Avoid`,
          `Practical ${topic} Walkthrough (Overview & Tips)`,
        ],
      };
    },
  },

  // --- 11. TOPIC GENERATOR ---
  'topic-generator': {
    toolId: 'topic-generator',
    name: 'Topic Generator',
    slug: 'topic-generator',
    category: 'Content Strategy',
    description: 'Generates creative, highly engaging content and video topic ideas.',
    capability: 'CONTENT_BRIEF',
    platform: 'all',
    promptProfile: 'TOPIC_GENERATOR_V1',
    preferredModels: ['gemini-2.5-flash', 'gpt-4o-mini'],
    fallbackPolicy: {
      maxAttempts: 3,
      allowDeterministicFallback: true,
    },
    enabled: true,
    version: 1,
    inputSchema: {
      name: 'TopicGeneratorInput',
      version: 1,
      requiredFields: ['topic'],
      properties: {
        topic: { type: 'string', description: 'Seed topic, category, or audience niche', required: true },
      },
    },
    outputSchema: {
      name: 'TopicGeneratorOutput',
      version: 1,
      requiredFields: ['topics'],
      properties: {
        topics: { type: 'array', description: 'List of creative topic/content ideas' },
      },
    },
    deterministicFallback: (input: any) => {
      const topic = String(input?.topic || 'niche').trim();
      return {
        topics: [
          `${topic} Tutorial for Complete Beginners`,
          `10 Common ${topic} Mistakes and How to Avoid Them`,
          `Mastering ${topic}: A Practical Step-by-Step Guide`,
          `The Future of ${topic}: Trends and Predictions`,
          `Essential ${topic} Tools Every Creator Needs`,
          `Step-by-Step ${topic} Walkthrough (Beginners to Pro)`,
        ],
      };
    },
  },

  // --- 12. YOUTUBE SEO FULL PACKAGE GENERATOR ---
  'youtube-seo-full-package': {
    toolId: 'youtube-seo-full-package',
    name: 'YouTube SEO Full Package Generator',
    slug: 'youtube-seo-full-package',
    category: 'Video Optimization',
    description: 'Generates a complete YouTube SEO metadata package containing titles, keywords, description, hashtags, tags, search phrases, and thumbnail suggestions.',
    capability: 'YOUTUBE_SEO',
    platform: 'youtube',
    promptProfile: 'YOUTUBE_SEO_FULL_PACKAGE_V1',
    preferredModels: ['gemini-2.5-flash', 'gpt-4o-mini'],
    fallbackPolicy: {
      maxAttempts: 3,
      allowDeterministicFallback: true,
    },
    enabled: true,
    version: 1,
    inputSchema: {
      name: 'YouTubeSeoPackageInput',
      version: 1,
      requiredFields: ['topic'],
      properties: {
        topic: { type: 'string', description: 'Video topic or working title', required: true },
        keyword: { type: 'string', description: 'Target primary keyword (optional)' },
        audience: { type: 'string', description: 'Target audience (optional)' },
        niche: { type: 'string', description: 'Channel niche/category (optional)' },
        context: { type: 'string', description: 'Optional description or video context' },
      },
    },
    outputSchema: {
      name: 'YouTubeSeoPackageOutput',
      version: 1,
      requiredFields: ['titles', 'keywords', 'description', 'hashtags', 'tags', 'searchPhrases', 'thumbnailSuggestions', 'notes'],
      properties: {
        titles: { type: 'array', description: 'A list of 5 optimized titles' },
        keywords: { type: 'array', description: 'Primary and secondary keywords' },
        description: { type: 'string', description: 'Highly optimized description template' },
        hashtags: { type: 'array', description: '3-5 lowercase relevant hashtags starting with #' },
        tags: { type: 'array', description: 'YouTube video tags' },
        searchPhrases: { type: 'array', description: 'Suggested viewer search terms' },
        thumbnailSuggestions: { type: 'array', description: 'Visual text overlays for thumbnail designs' },
        notes: { type: 'array', description: 'SEO implementation advice and quality tips' },
      },
    },
    deterministicFallback: (input: any) => {
      const topic = String(input?.topic || 'Video Topic').trim();
      const kw = String(input?.keyword || topic).trim();
      return {
        titles: [
          `Mastering ${topic}: Complete Step-by-Step Guide`,
          `How to ${topic} for Beginners (Best Practices & Tips)`,
          `${topic} Explained: Everything You Need to Know`,
          `5 ${topic} Mistakes Every Creator Makes (And How to Fix)`,
          `Ultimate ${topic} Walkthrough (Actionable Checklist)`,
        ],
        keywords: [kw, `${kw.toLowerCase()} guide`, `${kw.toLowerCase()} tutorial`, `how to ${kw.toLowerCase()}`],
        description: `In this comprehensive step-by-step tutorial, we dive deep into ${topic}.\n\nLearn the essential principles, master key techniques, and avoid common mistakes that slow down your progress.\n\nMake sure to subscribe for more actionable guides and creation walkthroughs!`,
        hashtags: [`#${topic.toLowerCase().replace(/[^a-z0-9]/g, '')}`, '#tutorial', '#guide', '#seo'],
        tags: [kw.toLowerCase(), `${kw.toLowerCase()} guide`, `${kw.toLowerCase()} tutorial`, 'learn', 'how to'],
        searchPhrases: [`how to get started with ${kw.toLowerCase()}`, `${kw.toLowerCase()} tutorial for beginners`, `best setup for ${kw.toLowerCase()}`],
        thumbnailSuggestions: [
          'EASY STEP-BY-STEP!',
          'MASTER THIS NOW',
          'STOP DOING THIS!',
        ],
        notes: [
          'Place your primary keyword within the first 60 characters of your chosen title.',
          'Add your link or CTA in the top 2 lines of the video description (above the fold).',
          'Use high-contrast text on your thumbnail with at least 1:1 contrast ratio.',
        ],
      };
    },
  },

  // --- 13. GRAMMAR & TEXT IMPROVER ---
  'grammar-text-improver': {
    toolId: 'grammar-text-improver',
    name: 'Grammar & Text Improver',
    slug: 'grammar-text-improver',
    category: 'Quality & Editing',
    description: 'Improves grammar, spelling, structure, and readability while preserving original meaning.',
    capability: 'TEXT_REWRITING',
    platform: 'all',
    promptProfile: 'GRAMMAR_TEXT_IMPROVER_V1',
    preferredModels: ['gemini-2.5-flash', 'gpt-4o-mini'],
    fallbackPolicy: {
      maxAttempts: 3,
      allowDeterministicFallback: true,
    },
    enabled: true,
    version: 1,
    inputSchema: {
      name: 'GrammarInput',
      version: 1,
      requiredFields: ['text'],
      properties: {
        text: { type: 'string', description: 'Original text to improve', required: true },
      },
    },
    outputSchema: {
      name: 'GrammarOutput',
      version: 1,
      requiredFields: ['improvedText'],
      properties: {
        improvedText: { type: 'string', description: 'Grammatically improved and polished text' },
        shorterVersion: { type: 'string', description: 'More concise and brief version of the text' },
        professionalVersion: { type: 'string', description: 'Polished corporate/professional version of the text' },
      },
    },
    deterministicFallback: (input: any) => {
      const orig = String(input?.text || '').trim();
      return {
        improvedText: orig || 'No text supplied.',
        shorterVersion: orig ? orig.slice(0, Math.floor(orig.length * 0.7)) + '...' : '',
        professionalVersion: orig ? `Please find the polished version: ${orig}` : '',
      };
    },
  },

  // --- 14. AI TRANSLATOR ---
  'ai-translator': {
    toolId: 'ai-translator',
    name: 'AI Translator',
    slug: 'ai-translator',
    category: 'Utility & Language',
    description: 'Translates text accurately while preserving context, tone, terminology, and formatting.',
    capability: 'TRANSLATION',
    platform: 'all',
    promptProfile: 'AI_TRANSLATOR_V1',
    preferredModels: ['gemini-2.5-flash', 'gpt-4o-mini'],
    fallbackPolicy: {
      maxAttempts: 3,
      allowDeterministicFallback: true,
    },
    enabled: true,
    version: 1,
    inputSchema: {
      name: 'TranslatorInput',
      version: 1,
      requiredFields: ['text', 'targetLanguage'],
      properties: {
        text: { type: 'string', description: 'Text to translate', required: true },
        targetLanguage: { type: 'string', description: 'Target language (e.g. Spanish, French, German, Japanese)', required: true },
      },
    },
    outputSchema: {
      name: 'TranslatorOutput',
      version: 1,
      requiredFields: ['translatedText'],
      properties: {
        translatedText: { type: 'string', description: 'Accurately translated text' },
      },
    },
    deterministicFallback: (input: any) => {
      const orig = String(input?.text || '').trim();
      const lang = String(input?.targetLanguage || 'Target Language').trim();
      return {
        translatedText: orig ? `[Deterministic Fallback Translation to ${lang}]: ${orig}` : 'No text supplied.',
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
