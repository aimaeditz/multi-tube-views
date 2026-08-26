/**
 * Multi Tube Views — Multi-Provider AI Architecture Types
 */

export type AIProviderId = 
  | 'gemini' 
  | 'openai' 
  | 'grok' 
  | 'deepseek' 
  | 'claude' 
  | 'mistral' 
  | 'openrouter';

export type AICapability = 
  | 'text' 
  | 'json' 
  | 'vision' 
  | 'reasoning' 
  | 'long_context' 
  | 'coding';

export type AIErrorCode = 
  | 'PROVIDER_UNAVAILABLE' 
  | 'RATE_LIMITED' 
  | 'QUOTA_EXCEEDED' 
  | 'INVALID_CONFIGURATION' 
  | 'AUTHENTICATION_FAILED' 
  | 'REQUEST_TIMEOUT' 
  | 'CONTENT_BLOCKED' 
  | 'INVALID_REQUEST' 
  | 'UNKNOWN_PROVIDER_ERROR';

export interface AIModelConfig {
  id: string;
  displayName: string;
  providerId: AIProviderId;
  capabilities: AICapability[];
  maxContextTokens?: number;
  isDefault?: boolean;
}

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
}

export interface AIHistoryMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIRequest {
  prompt: string;
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
  toolId?: number;
  action?: string;
}

export interface AIUsage {
  inputTokens: number;
  outputTokens: number;
}

export interface AIResponse {
  success: boolean;
  provider: AIProviderId | string;
  model: string;
  text: string;
  json?: any;
  usage?: AIUsage;
  latencyMs?: number;
  fallbackOccurred?: boolean;
  attemptedProviders?: string[];
  error?: string;
  errorCode?: AIErrorCode;
}

export interface AICompareResponse {
  success: boolean;
  prompt: string;
  responses: Record<string, AIResponse>;
  totalProviders: number;
  successfulProviders: number;
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
}

export interface AIProviderInterface {
  id: AIProviderId;
  displayName: string;
  isConfigured(): boolean;
  generate(request: AIRequest): Promise<AIResponse>;
  getStatus(): AIProviderStatus;
}
