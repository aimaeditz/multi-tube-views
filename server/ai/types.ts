/**
 * Multi Tube Views (MTV) — Universal AI Infrastructure Types
 * Centralized type definitions for capabilities, models, providers,
 * prompt profiles, tools, schemas, requests, responses, and validation.
 */

// --- 1. AI PROVIDER IDS ---
export type AIProviderId = 
  | 'gemini' 
  | 'openai' 
  | 'grok' 
  | 'deepseek' 
  | 'claude' 
  | 'mistral' 
  | 'openrouter'
  | 'puter';

// --- 2. AI CAPABILITY TAXONOMY ---
export type AICapability = 
  | 'TEXT_GENERATION'
  | 'TEXT_REWRITING'
  | 'SUMMARIZATION'
  | 'TRANSLATION'
  | 'KEYWORD_RESEARCH'
  | 'KEYWORD_CLUSTERING'
  | 'SEARCH_INTENT'
  | 'SEO_ANALYSIS'
  | 'SEO_TITLE_GENERATION'
  | 'META_DESCRIPTION'
  | 'CONTENT_BRIEF'
  | 'ARTICLE_GENERATION'
  | 'SOCIAL_COPY'
  | 'YOUTUBE_ANALYSIS'
  | 'YOUTUBE_SEO'
  | 'CONTENT_ANALYSIS'
  | 'COMPETITOR_ANALYSIS'
  | 'STRUCTURED_DATA_GENERATION'
  | 'JSON_GENERATION'
  | 'VISION'
  | 'IMAGE_ANALYSIS'
  | 'OCR'
  | 'IMAGE_GENERATION'
  | 'VIDEO_ANALYSIS'
  | 'VIDEO_GENERATION'
  | 'SPEECH_TO_TEXT'
  | 'TEXT_TO_SPEECH'
  | 'CLASSIFICATION'
  | 'SENTIMENT_ANALYSIS'
  | 'LANGUAGE_DETECTION'
  | 'EMBEDDINGS'
  | 'RAG'
  | 'FUNCTION_CALLING'
  | 'TOOL_CALLING'
  | 'STREAMING'
  | 'REASONING'
  // Backward compatibility short-names:
  | 'text'
  | 'json'
  | 'vision'
  | 'reasoning'
  | 'long_context'
  | 'coding';

// --- 3. ERROR CODES ---
export type AIErrorCode = 
  | 'PROVIDER_UNAVAILABLE' 
  | 'RATE_LIMITED' 
  | 'QUOTA_EXCEEDED' 
  | 'INVALID_CONFIGURATION' 
  | 'AUTHENTICATION_FAILED' 
  | 'REQUEST_TIMEOUT' 
  | 'CONTENT_BLOCKED' 
  | 'INVALID_REQUEST' 
  | 'VALIDATION_FAILED'
  | 'SCHEMA_MISMATCH'
  | 'PARSING_ERROR'
  | 'TOOL_NOT_FOUND'
  | 'CAPABILITY_UNSUPPORTED'
  | 'UNKNOWN_PROVIDER_ERROR';

// --- 4. MODEL CONFIGURATION ---
export interface AIModelConfig {
  id: string;
  providerId: AIProviderId;
  displayName: string;
  capabilities: AICapability[];
  inputTypes: ('text' | 'image' | 'audio' | 'video')[];
  outputTypes: ('text' | 'json' | 'image' | 'audio')[];
  maxContextTokens?: number;
  maxOutputTokens?: number;
  supportsStreaming?: boolean;
  supportsVision?: boolean;
  supportsToolCalling?: boolean;
  supportsStructuredOutput?: boolean;
  status: 'active' | 'deprecated' | 'beta' | 'maintenance';
  priority: number;
  fallbackPriority: number;
  isDefault?: boolean;
}

// --- 5. PROVIDER CONFIGURATION ---
export interface AIProviderConfig {
  id: AIProviderId;
  displayName: string;
  envKeyName: string;
  enabledEnvVar: string;
  defaultModel: string;
  supportedModels: AIModelConfig[];
  capabilities: AICapability[];
  timeoutMs: number;
  priority: number;
  apiBaseUrl?: string;
  isOptional?: boolean;
}

// --- 6. CAPABILITY DEFINITION ---
export interface CapabilityDefinition {
  id: AICapability;
  name: string;
  description: string;
  category: 'content' | 'seo' | 'analysis' | 'multimodal' | 'structured' | 'utility';
  requiredInputTypes: ('text' | 'image' | 'audio' | 'video')[];
  expectedOutputType: 'text' | 'json' | 'image' | 'audio';
  defaultPromptProfile?: string;
}

// --- 7. SCHEMA & VALIDATION DEFINITIONS ---
export interface SchemaProperty {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  description?: string;
  required?: boolean;
  enum?: string[];
  items?: SchemaProperty;
  properties?: Record<string, SchemaProperty>;
  default?: any;
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
}

export interface SchemaDefinition {
  name: string;
  version: number;
  properties: Record<string, SchemaProperty>;
  requiredFields?: string[];
}

// --- 8. PROMPT PROFILE & FACTUALITY ---
export interface PromptProfile {
  id: string;
  version: number;
  systemTemplate: string;
  userTemplate: string;
  platformDirectives?: Record<string, string>;
  factualityPolicy?: 'strict' | 'flexible' | 'creative';
  formattingDirectives?: string;
  outputFormat: 'json' | 'text' | 'markdown';
}

// --- 9. TOOL DEFINITIONS ---
export interface ToolFallbackPolicy {
  maxAttempts?: number;
  preferredProviders?: AIProviderId[];
  allowDeterministicFallback?: boolean;
  timeoutMs?: number;
}

export interface ToolDefinition {
  toolId: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  capability: AICapability;
  platform?: string | 'all';
  inputSchema: SchemaDefinition;
  outputSchema: SchemaDefinition;
  promptProfile: string;
  preferredModels?: string[];
  preferredProviders?: AIProviderId[];
  fallbackPolicy?: ToolFallbackPolicy;
  enabled: boolean;
  version: number;
  deterministicFallback?: (input: any) => any;
}

// --- 10. REQUEST & RESPONSE CONTRACTS ---
export interface AIHistoryMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens?: number;
}

export interface AIRequest {
  toolId?: string | number;
  capability?: AICapability;
  prompt?: string;
  input?: Record<string, any>;
  systemInstruction?: string;
  provider?: AIProviderId | 'auto' | 'compare';
  model?: string;
  requiredCapabilities?: AICapability[];
  temperature?: number;
  maxTokens?: number;
  jsonSchema?: any;
  responseFormat?: 'json' | 'text';
  history?: AIHistoryMessage[];
  compareProviders?: AIProviderId[];
  platform?: string;
  options?: {
    timeoutMs?: number;
    skipValidation?: boolean;
    stream?: boolean;
    allowFallback?: boolean;
  };
  // Backward compatibility fields:
  action?: string;
  tool?: string;
}

export interface AIResponse {
  success: boolean;
  requestId?: string;
  toolId?: string;
  capability?: AICapability | string;
  provider: AIProviderId | string;
  model: string;
  text: string;
  json?: any;
  data?: any; // Normalized structured data
  usage?: AIUsage;
  latencyMs?: number;
  fallbackOccurred?: boolean;
  fallbackUsed?: boolean;
  attemptedProviders?: string[];
  warnings?: string[];
  error?: string;
  errorCode?: AIErrorCode;
}

export interface AICompareResponse {
  success: boolean;
  prompt: string;
  toolId?: string;
  responses: Record<string, AIResponse>;
  totalProviders: number;
  successfulProviders: number;
  fastestProvider?: string;
}

export interface AIProviderStatus {
  id: AIProviderId;
  displayName: string;
  configured: boolean;
  enabled: boolean;
  status: 'available' | 'unavailable' | 'not_configured' | 'disabled' | 'quota_exceeded' | 'rate_limited';
  models: string[];
  capabilities: AICapability[];
  priority: number;
  statusNote?: string;
  isOptional?: boolean;
}

export interface AIProviderInterface {
  id: AIProviderId;
  displayName: string;
  isConfigured(): boolean;
  generate(request: AIRequest): Promise<AIResponse>;
  getStatus(): AIProviderStatus;
  supportsCapability?(capability: AICapability): boolean;
  normalizeResponse?(raw: any, latencyMs: number): AIResponse;
  normalizeError?(err: any, latencyMs: number): AIResponse;
}

// --- 11. BATCH REQUEST & RESPONSE ---
export interface BatchAIRequest {
  toolId?: string;
  capability?: AICapability;
  items: Array<{
    id: string | number;
    input: Record<string, any>;
    prompt?: string;
  }>;
  concurrency?: number;
  provider?: AIProviderId | 'auto';
  model?: string;
}

export interface BatchAIResponse {
  success: boolean;
  total: number;
  successful: number;
  failed: number;
  results: Array<{
    id: string | number;
    success: boolean;
    response?: AIResponse;
    error?: string;
  }>;
  latencyMs: number;
}
