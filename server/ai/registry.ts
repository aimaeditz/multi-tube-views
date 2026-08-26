/**
 * Multi Tube Views — Master AI Provider & Model Registry
 * Centralized definition of all supported providers, official model IDs,
 * capabilities, environment keys, and priority routing defaults.
 */

import { AIProviderConfig, AIProviderId, AIModelConfig } from './types.js';

export const PROVIDER_REGISTRY: Record<AIProviderId, AIProviderConfig> = {
  gemini: {
    id: 'gemini',
    displayName: 'Google Gemini',
    envKeyName: 'GEMINI_API_KEY',
    enabledEnvVar: 'GEMINI_ENABLED',
    defaultModel: 'gemini-2.5-flash',
    timeoutMs: 20000,
    priority: 1,
    capabilities: ['text', 'json', 'vision', 'reasoning', 'long_context', 'coding'],
    supportedModels: [
      {
        id: 'gemini-2.5-flash',
        displayName: 'Gemini 2.5 Flash',
        providerId: 'gemini',
        capabilities: ['text', 'json', 'vision', 'reasoning', 'coding'],
        maxContextTokens: 1000000,
        isDefault: true,
      },
      {
        id: 'gemini-1.5-flash',
        displayName: 'Gemini 1.5 Flash',
        providerId: 'gemini',
        capabilities: ['text', 'json', 'vision', 'long_context'],
        maxContextTokens: 1000000,
      },
      {
        id: 'gemini-2.5-pro',
        displayName: 'Gemini 2.5 Pro',
        providerId: 'gemini',
        capabilities: ['text', 'json', 'vision', 'reasoning', 'coding', 'long_context'],
        maxContextTokens: 2000000,
      },
    ],
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
    capabilities: ['text', 'json', 'vision', 'reasoning', 'coding'],
    supportedModels: [
      {
        id: 'gpt-4o-mini',
        displayName: 'GPT-4o Mini',
        providerId: 'openai',
        capabilities: ['text', 'json', 'vision', 'coding'],
        maxContextTokens: 128000,
        isDefault: true,
      },
      {
        id: 'gpt-4o',
        displayName: 'GPT-4o',
        providerId: 'openai',
        capabilities: ['text', 'json', 'vision', 'reasoning', 'coding'],
        maxContextTokens: 128000,
      },
      {
        id: 'gpt-3.5-turbo',
        displayName: 'GPT-3.5 Turbo',
        providerId: 'openai',
        capabilities: ['text', 'json'],
        maxContextTokens: 16385,
      },
    ],
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
    capabilities: ['text', 'json', 'reasoning', 'coding'],
    supportedModels: [
      {
        id: 'grok-2-latest',
        displayName: 'Grok 2',
        providerId: 'grok',
        capabilities: ['text', 'json', 'reasoning', 'coding'],
        maxContextTokens: 128000,
        isDefault: true,
      },
      {
        id: 'grok-beta',
        displayName: 'Grok Beta',
        providerId: 'grok',
        capabilities: ['text', 'json', 'coding'],
        maxContextTokens: 128000,
      },
    ],
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
    capabilities: ['text', 'json', 'reasoning', 'coding'],
    supportedModels: [
      {
        id: 'deepseek-chat',
        displayName: 'DeepSeek V3 (Chat)',
        providerId: 'deepseek',
        capabilities: ['text', 'json', 'coding'],
        maxContextTokens: 64000,
        isDefault: true,
      },
      {
        id: 'deepseek-reasoner',
        displayName: 'DeepSeek R1 (Reasoner)',
        providerId: 'deepseek',
        capabilities: ['text', 'reasoning', 'coding'],
        maxContextTokens: 64000,
      },
    ],
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
    capabilities: ['text', 'json', 'vision', 'reasoning', 'coding', 'long_context'],
    supportedModels: [
      {
        id: 'claude-3-5-sonnet-20241022',
        displayName: 'Claude 3.5 Sonnet',
        providerId: 'claude',
        capabilities: ['text', 'json', 'vision', 'reasoning', 'coding', 'long_context'],
        maxContextTokens: 200000,
        isDefault: true,
      },
      {
        id: 'claude-3-haiku-20240307',
        displayName: 'Claude 3 Haiku',
        providerId: 'claude',
        capabilities: ['text', 'json', 'vision', 'coding'],
        maxContextTokens: 200000,
      },
    ],
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
    capabilities: ['text', 'json', 'coding'],
    supportedModels: [
      {
        id: 'mistral-small-latest',
        displayName: 'Mistral Small',
        providerId: 'mistral',
        capabilities: ['text', 'json', 'coding'],
        maxContextTokens: 32000,
        isDefault: true,
      },
      {
        id: 'mistral-large-latest',
        displayName: 'Mistral Large',
        providerId: 'mistral',
        capabilities: ['text', 'json', 'reasoning', 'coding'],
        maxContextTokens: 128000,
      },
    ],
  },
  openrouter: {
    id: 'openrouter',
    displayName: 'OpenRouter',
    envKeyName: 'OPENROUTER_API_KEY',
    enabledEnvVar: 'OPENROUTER_ENABLED',
    defaultModel: 'google/gemini-2.5-flash',
    timeoutMs: 22000,
    priority: 7,
    apiBaseUrl: 'https://openrouter.ai/api/v1',
    capabilities: ['text', 'json', 'vision', 'reasoning', 'coding', 'long_context'],
    supportedModels: [
      {
        id: 'google/gemini-2.5-flash',
        displayName: 'OpenRouter: Gemini 2.5 Flash',
        providerId: 'openrouter',
        capabilities: ['text', 'json', 'vision'],
        isDefault: true,
      },
      {
        id: 'openai/gpt-4o-mini',
        displayName: 'OpenRouter: GPT-4o Mini',
        providerId: 'openrouter',
        capabilities: ['text', 'json', 'coding'],
      },
      {
        id: 'anthropic/claude-3.5-haiku',
        displayName: 'OpenRouter: Claude 3.5 Haiku',
        providerId: 'openrouter',
        capabilities: ['text', 'json', 'reasoning'],
      },
      {
        id: 'deepseek/deepseek-r1',
        displayName: 'OpenRouter: DeepSeek R1',
        providerId: 'openrouter',
        capabilities: ['text', 'reasoning', 'coding'],
      },
    ],
  },
};

export function getProviderConfig(id: AIProviderId): AIProviderConfig {
  return PROVIDER_REGISTRY[id];
}

export function getAllSupportedProviders(): AIProviderConfig[] {
  return Object.values(PROVIDER_REGISTRY);
}
