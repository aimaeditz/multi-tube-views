/**
 * Multi Tube Views — Master AI Provider & Model Registry
 * Centralized definition of all supported providers, official model IDs,
 * capabilities, environment keys, and priority routing defaults.
 */

import { AIProviderConfig, AIProviderId, AIModelConfig } from './types.js';
import { getModelsByProvider } from './models.js';

export const PROVIDER_REGISTRY: Record<AIProviderId, AIProviderConfig> = {
  gemini: {
    id: 'gemini',
    displayName: 'Google Gemini',
    envKeyName: 'GEMINI_API_KEY',
    enabledEnvVar: 'GEMINI_ENABLED',
    defaultModel: 'gemini-3.6-flash',
    timeoutMs: 20000,
    priority: 1,
    capabilities: [
      'TEXT_GENERATION', 'JSON_GENERATION', 'SEO_TITLE_GENERATION', 'META_DESCRIPTION', 
      'KEYWORD_RESEARCH', 'YOUTUBE_SEO', 'YOUTUBE_ANALYSIS', 'SOCIAL_COPY', 
      'CONTENT_BRIEF', 'VISION', 'STREAMING', 'REASONING', 'text', 'json', 'vision', 'reasoning', 'coding'
    ],
    supportedModels: getModelsByProvider('gemini'),
  },
  openai: {
    id: 'openai',
    displayName: 'OpenAI',
    envKeyName: 'OPENAI_API_KEY',
    enabledEnvVar: 'OPENAI_ENABLED',
    defaultModel: 'gpt-4o-mini',
    timeoutMs: 20000,
    priority: 2,
    apiBaseUrl: 'https://api.openai.com/v1',
    capabilities: [
      'TEXT_GENERATION', 'JSON_GENERATION', 'SEO_TITLE_GENERATION', 'META_DESCRIPTION', 
      'KEYWORD_RESEARCH', 'YOUTUBE_SEO', 'YOUTUBE_ANALYSIS', 'SOCIAL_COPY', 
      'CONTENT_BRIEF', 'VISION', 'STREAMING', 'REASONING', 'text', 'json', 'vision', 'coding'
    ],
    supportedModels: getModelsByProvider('openai'),
  },
  grok: {
    id: 'grok',
    displayName: 'xAI Grok',
    envKeyName: 'XAI_API_KEY',
    enabledEnvVar: 'XAI_ENABLED',
    defaultModel: 'grok-2-latest',
    timeoutMs: 20000,
    priority: 3,
    apiBaseUrl: 'https://api.x.ai/v1',
    capabilities: [
      'TEXT_GENERATION', 'JSON_GENERATION', 'SEO_TITLE_GENERATION', 'META_DESCRIPTION', 
      'KEYWORD_RESEARCH', 'YOUTUBE_SEO', 'SOCIAL_COPY', 'STREAMING', 'REASONING', 'text', 'json'
    ],
    supportedModels: getModelsByProvider('grok'),
  },
  deepseek: {
    id: 'deepseek',
    displayName: 'DeepSeek',
    envKeyName: 'DEEPSEEK_API_KEY',
    enabledEnvVar: 'DEEPSEEK_ENABLED',
    defaultModel: 'deepseek-chat',
    timeoutMs: 22000,
    priority: 4,
    apiBaseUrl: 'https://api.deepseek.com',
    capabilities: [
      'TEXT_GENERATION', 'JSON_GENERATION', 'SEO_TITLE_GENERATION', 'META_DESCRIPTION', 
      'KEYWORD_RESEARCH', 'YOUTUBE_SEO', 'SOCIAL_COPY', 'CONTENT_BRIEF', 'STREAMING', 'REASONING', 'text', 'json'
    ],
    supportedModels: getModelsByProvider('deepseek'),
  },
  claude: {
    id: 'claude',
    displayName: 'Anthropic Claude',
    envKeyName: 'ANTHROPIC_API_KEY',
    enabledEnvVar: 'ANTHROPIC_ENABLED',
    defaultModel: 'claude-3-5-sonnet-20241022',
    timeoutMs: 22000,
    priority: 5,
    apiBaseUrl: 'https://api.anthropic.com/v1',
    capabilities: [
      'TEXT_GENERATION', 'JSON_GENERATION', 'SEO_TITLE_GENERATION', 'META_DESCRIPTION', 
      'KEYWORD_RESEARCH', 'YOUTUBE_SEO', 'YOUTUBE_ANALYSIS', 'SOCIAL_COPY', 
      'CONTENT_BRIEF', 'VISION', 'STREAMING', 'REASONING', 'text', 'json', 'vision', 'long_context'
    ],
    supportedModels: getModelsByProvider('claude'),
  },
  mistral: {
    id: 'mistral',
    displayName: 'Mistral AI',
    envKeyName: 'MISTRAL_API_KEY',
    enabledEnvVar: 'MISTRAL_ENABLED',
    defaultModel: 'mistral-small-latest',
    timeoutMs: 20000,
    priority: 6,
    apiBaseUrl: 'https://api.mistral.ai/v1',
    capabilities: [
      'TEXT_GENERATION', 'JSON_GENERATION', 'SEO_TITLE_GENERATION', 'META_DESCRIPTION', 
      'KEYWORD_RESEARCH', 'YOUTUBE_SEO', 'SOCIAL_COPY', 'CONTENT_BRIEF', 'STREAMING', 'REASONING', 'text', 'json'
    ],
    supportedModels: getModelsByProvider('mistral'),
  },
  openrouter: {
    id: 'openrouter',
    displayName: 'OpenRouter',
    envKeyName: 'OPENROUTER_API_KEY',
    enabledEnvVar: 'OPENROUTER_ENABLED',
    defaultModel: 'google/gemini-3.6-flash',
    timeoutMs: 22000,
    priority: 7,
    apiBaseUrl: 'https://openrouter.ai/api/v1',
    capabilities: [
      'TEXT_GENERATION', 'JSON_GENERATION', 'SEO_TITLE_GENERATION', 'META_DESCRIPTION', 
      'KEYWORD_RESEARCH', 'YOUTUBE_SEO', 'VISION', 'STREAMING', 'REASONING', 'text', 'json', 'vision'
    ],
    supportedModels: getModelsByProvider('openrouter'),
  },
  puter: {
    id: 'puter',
    displayName: 'Puter AI (Optional Gateway)',
    envKeyName: 'PUTER_AUTH_TOKEN',
    enabledEnvVar: 'PUTER_ENABLED',
    defaultModel: 'puter/gpt-4o-mini',
    timeoutMs: 22000,
    priority: 8,
    isOptional: true,
    capabilities: [
      'TEXT_GENERATION', 'JSON_GENERATION', 'SEO_TITLE_GENERATION', 'META_DESCRIPTION', 'STREAMING', 'text', 'json'
    ],
    supportedModels: getModelsByProvider('puter'),
  },
};

export function getProviderConfig(id: AIProviderId): AIProviderConfig {
  return PROVIDER_REGISTRY[id];
}

export function getAllSupportedProviders(): AIProviderConfig[] {
  return Object.values(PROVIDER_REGISTRY);
}
