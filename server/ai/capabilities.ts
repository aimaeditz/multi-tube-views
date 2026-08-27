/**
 * Multi Tube Views (MTV) — Universal AI Capability Registry
 * Defines all standard AI capabilities, their operational categories,
 * input/output contracts, and validation helpers.
 */

import { AICapability, CapabilityDefinition } from './types.js';

export const CAPABILITY_REGISTRY: Record<string, CapabilityDefinition> = {
  TEXT_GENERATION: {
    id: 'TEXT_GENERATION',
    name: 'General Text Generation',
    description: 'Generates creative or informational text content from prompts.',
    category: 'content',
    requiredInputTypes: ['text'],
    expectedOutputType: 'text',
    defaultPromptProfile: 'GENERAL_TEXT_V1',
  },
  TEXT_REWRITING: {
    id: 'TEXT_REWRITING',
    name: 'Text Rewriting & Paraphrasing',
    description: 'Rewrites, clarifies, or refines existing text with specific tone.',
    category: 'content',
    requiredInputTypes: ['text'],
    expectedOutputType: 'text',
    defaultPromptProfile: 'TEXT_REWRITE_V1',
  },
  SUMMARIZATION: {
    id: 'SUMMARIZATION',
    name: 'Content Summarization',
    description: 'Extracts core insights and structured summaries from articles or transcripts.',
    category: 'content',
    requiredInputTypes: ['text'],
    expectedOutputType: 'text',
    defaultPromptProfile: 'SUMMARIZE_V1',
  },
  TRANSLATION: {
    id: 'TRANSLATION',
    name: 'Language Translation',
    description: 'Translates text between languages while preserving technical and cultural context.',
    category: 'content',
    requiredInputTypes: ['text'],
    expectedOutputType: 'text',
  },
  KEYWORD_RESEARCH: {
    id: 'KEYWORD_RESEARCH',
    name: 'SEO Keyword Research',
    description: 'Discovers primary, secondary, and long-tail search keywords with intent mapping.',
    category: 'seo',
    requiredInputTypes: ['text'],
    expectedOutputType: 'json',
    defaultPromptProfile: 'SEO_KEYWORDS_V1',
  },
  KEYWORD_CLUSTERING: {
    id: 'KEYWORD_CLUSTERING',
    name: 'Keyword Clustering',
    description: 'Groups keywords into semantic topical clusters for pillar content strategy.',
    category: 'seo',
    requiredInputTypes: ['text'],
    expectedOutputType: 'json',
    defaultPromptProfile: 'SEO_CLUSTERING_V1',
  },
  SEARCH_INTENT: {
    id: 'SEARCH_INTENT',
    name: 'Search Intent Analysis',
    description: 'Classifies search queries into Informational, Navigational, Commercial, or Transactional intent.',
    category: 'seo',
    requiredInputTypes: ['text'],
    expectedOutputType: 'json',
  },
  SEO_ANALYSIS: {
    id: 'SEO_ANALYSIS',
    name: 'Comprehensive SEO Analysis',
    description: 'Audits on-page metadata, headings, keyword density, and search visibility.',
    category: 'seo',
    requiredInputTypes: ['text'],
    expectedOutputType: 'json',
    defaultPromptProfile: 'SEO_AUDIT_V1',
  },
  SEO_TITLE_GENERATION: {
    id: 'SEO_TITLE_GENERATION',
    name: 'SEO Title & Headline Generator',
    description: 'Generates high-CTR, non-clickbait, search-intent-aligned titles within character limits.',
    category: 'seo',
    requiredInputTypes: ['text'],
    expectedOutputType: 'json',
    defaultPromptProfile: 'SEO_TITLES_V1',
  },
  META_DESCRIPTION: {
    id: 'META_DESCRIPTION',
    name: 'Meta Description Generator',
    description: 'Crafts 140–160 character search snippet descriptions with front-loaded keywords.',
    category: 'seo',
    requiredInputTypes: ['text'],
    expectedOutputType: 'json',
    defaultPromptProfile: 'META_DESC_V1',
  },
  CONTENT_BRIEF: {
    id: 'CONTENT_BRIEF',
    name: 'Content Brief & Outline Generator',
    description: 'Creates structured content briefs with H2/H3 outlines, target queries, and key takeaways.',
    category: 'content',
    requiredInputTypes: ['text'],
    expectedOutputType: 'json',
    defaultPromptProfile: 'CONTENT_BRIEF_V1',
  },
  ARTICLE_GENERATION: {
    id: 'ARTICLE_GENERATION',
    name: 'In-Depth Article Generation',
    description: 'Drafts comprehensive, well-structured articles adhering strictly to provided facts.',
    category: 'content',
    requiredInputTypes: ['text'],
    expectedOutputType: 'text',
  },
  SOCIAL_COPY: {
    id: 'SOCIAL_COPY',
    name: 'Multi-Platform Social Copy Generator',
    description: 'Generates platform-tailored promotional copy for YouTube, TikTok, Instagram, X, LinkedIn, etc.',
    category: 'content',
    requiredInputTypes: ['text'],
    expectedOutputType: 'json',
    defaultPromptProfile: 'SOCIAL_COPY_V1',
  },
  YOUTUBE_ANALYSIS: {
    id: 'YOUTUBE_ANALYSIS',
    name: 'YouTube Video & Metadata Audit',
    description: 'Audits YouTube metadata, titles, descriptions, and duration-grounded timestamp chapters.',
    category: 'analysis',
    requiredInputTypes: ['text'],
    expectedOutputType: 'json',
    defaultPromptProfile: 'YOUTUBE_AUDIT_V1',
  },
  YOUTUBE_SEO: {
    id: 'YOUTUBE_SEO',
    name: 'YouTube Video SEO & Packaging',
    description: 'Optimizes video title, tags, description, and chapter bounds strictly adhering to real video duration.',
    category: 'seo',
    requiredInputTypes: ['text'],
    expectedOutputType: 'json',
    defaultPromptProfile: 'YOUTUBE_SEO_V1',
  },
  CONTENT_ANALYSIS: {
    id: 'CONTENT_ANALYSIS',
    name: 'Content Quality & Clarity Analysis',
    description: 'Analyzes readability, tone, audience resonance, and engagement hooks.',
    category: 'analysis',
    requiredInputTypes: ['text'],
    expectedOutputType: 'json',
  },
  COMPETITOR_ANALYSIS: {
    id: 'COMPETITOR_ANALYSIS',
    name: 'Competitor Content Benchmarking',
    description: 'Identifies content gaps, angle differentiators, and packaging opportunities.',
    category: 'analysis',
    requiredInputTypes: ['text'],
    expectedOutputType: 'json',
  },
  STRUCTURED_DATA_GENERATION: {
    id: 'STRUCTURED_DATA_GENERATION',
    name: 'Schema Structured Data Generator',
    description: 'Produces valid JSON-LD schemas (VideoObject, Article, FAQPage, HowTo, BreadcrumbList).',
    category: 'structured',
    requiredInputTypes: ['text'],
    expectedOutputType: 'json',
    defaultPromptProfile: 'SCHEMA_JSONLD_V1',
  },
  JSON_GENERATION: {
    id: 'JSON_GENERATION',
    name: 'Strict JSON Output Generator',
    description: 'Generates clean, parseable JSON conforming strictly to a specified schema.',
    category: 'structured',
    requiredInputTypes: ['text'],
    expectedOutputType: 'json',
  },
  VISION: {
    id: 'VISION',
    name: 'Image & Visual Understanding',
    description: 'Analyzes visual content, screenshots, thumbnails, and charts.',
    category: 'multimodal',
    requiredInputTypes: ['image', 'text'],
    expectedOutputType: 'text',
  },
  IMAGE_ANALYSIS: {
    id: 'IMAGE_ANALYSIS',
    name: 'Thumbnail & Image Analysis',
    description: 'Evaluates composition, contrast, focal points, and readability of video thumbnails.',
    category: 'multimodal',
    requiredInputTypes: ['image', 'text'],
    expectedOutputType: 'json',
  },
  OCR: {
    id: 'OCR',
    name: 'Optical Character Recognition',
    description: 'Extracts printed or handwritten text from images.',
    category: 'multimodal',
    requiredInputTypes: ['image'],
    expectedOutputType: 'text',
  },
  IMAGE_GENERATION: {
    id: 'IMAGE_GENERATION',
    name: 'AI Image Generation',
    description: 'Generates images or artwork from descriptive prompts.',
    category: 'multimodal',
    requiredInputTypes: ['text'],
    expectedOutputType: 'image',
  },
  VIDEO_ANALYSIS: {
    id: 'VIDEO_ANALYSIS',
    name: 'Video Structure Analysis',
    description: 'Analyzes video transcript or frame sequences for pacing and topic boundaries.',
    category: 'multimodal',
    requiredInputTypes: ['video', 'text'],
    expectedOutputType: 'json',
  },
  VIDEO_GENERATION: {
    id: 'VIDEO_GENERATION',
    name: 'Video Synthesis',
    description: 'Generates video clips from text prompts (when provider supported).',
    category: 'multimodal',
    requiredInputTypes: ['text'],
    expectedOutputType: 'text',
  },
  SPEECH_TO_TEXT: {
    id: 'SPEECH_TO_TEXT',
    name: 'Audio Transcription',
    description: 'Converts speech audio into timestamped text transcripts.',
    category: 'multimodal',
    requiredInputTypes: ['audio'],
    expectedOutputType: 'text',
  },
  TEXT_TO_SPEECH: {
    id: 'TEXT_TO_SPEECH',
    name: 'Voice & Speech Synthesis',
    description: 'Converts text into natural voice audio output.',
    category: 'multimodal',
    requiredInputTypes: ['text'],
    expectedOutputType: 'audio',
  },
  CLASSIFICATION: {
    id: 'CLASSIFICATION',
    name: 'Text & Topic Classification',
    description: 'Categorizes text into predefined taxonomy classes.',
    category: 'analysis',
    requiredInputTypes: ['text'],
    expectedOutputType: 'json',
  },
  SENTIMENT_ANALYSIS: {
    id: 'SENTIMENT_ANALYSIS',
    name: 'Sentiment & Audience Reaction Analysis',
    description: 'Measures positive, neutral, negative sentiment and emotional tones.',
    category: 'analysis',
    requiredInputTypes: ['text'],
    expectedOutputType: 'json',
  },
  LANGUAGE_DETECTION: {
    id: 'LANGUAGE_DETECTION',
    name: 'Language Detection',
    description: 'Identifies natural language and dialect of input text.',
    category: 'utility',
    requiredInputTypes: ['text'],
    expectedOutputType: 'json',
  },
  EMBEDDINGS: {
    id: 'EMBEDDINGS',
    name: 'Vector Embeddings Generation',
    description: 'Generates numerical vector embeddings for semantic search.',
    category: 'utility',
    requiredInputTypes: ['text'],
    expectedOutputType: 'json',
  },
  RAG: {
    id: 'RAG',
    name: 'Retrieval Augmented Generation',
    description: 'Synthesizes grounded responses by retrieving relevant context documents.',
    category: 'utility',
    requiredInputTypes: ['text'],
    expectedOutputType: 'text',
  },
  FUNCTION_CALLING: {
    id: 'FUNCTION_CALLING',
    name: 'Function Calling Execution',
    description: 'Executes programmatic function invocations based on structured outputs.',
    category: 'utility',
    requiredInputTypes: ['text'],
    expectedOutputType: 'json',
  },
  TOOL_CALLING: {
    id: 'TOOL_CALLING',
    name: 'Tool Calling & Agentic Execution',
    description: 'Coordinates multi-step tool calls.',
    category: 'utility',
    requiredInputTypes: ['text'],
    expectedOutputType: 'json',
  },
  STREAMING: {
    id: 'STREAMING',
    name: 'Real-Time Token Streaming',
    description: 'Streams incremental text tokens as they are generated.',
    category: 'utility',
    requiredInputTypes: ['text'],
    expectedOutputType: 'text',
  },
  REASONING: {
    id: 'REASONING',
    name: 'Deep Step-by-Step Reasoning',
    description: 'Complex multi-step analytical reasoning and problem-solving.',
    category: 'analysis',
    requiredInputTypes: ['text'],
    expectedOutputType: 'text',
  },
};

/**
 * Normalizes short-name or full capability to standard AICapability enum
 */
export function normalizeCapability(cap: string | AICapability | undefined): AICapability {
  if (!cap) return 'TEXT_GENERATION';
  const upper = String(cap).toUpperCase().replace(/[\s-]/g, '_');
  
  if (CAPABILITY_REGISTRY[upper]) {
    return upper as AICapability;
  }

  // Map legacy short names
  const legacyMap: Record<string, AICapability> = {
    TEXT: 'TEXT_GENERATION',
    JSON: 'JSON_GENERATION',
    VISION: 'VISION',
    REASONING: 'REASONING',
    CODING: 'TEXT_GENERATION',
    LONG_CONTEXT: 'TEXT_GENERATION',
  };

  return legacyMap[upper] || 'TEXT_GENERATION';
}

/**
 * Returns all capability definitions
 */
export function getAllCapabilities(): CapabilityDefinition[] {
  return Object.values(CAPABILITY_REGISTRY);
}

/**
 * Gets definition for specific capability
 */
export function getCapabilityDefinition(capability: AICapability | string): CapabilityDefinition | undefined {
  const norm = normalizeCapability(capability);
  return CAPABILITY_REGISTRY[norm];
}
