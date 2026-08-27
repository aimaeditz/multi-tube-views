/**
 * Multi Tube Views — Google Gemini Provider Adapter
 */

import { GoogleGenAI } from '@google/genai';
import { 
  AIProviderInterface, 
  AIProviderId, 
  AIRequest, 
  AIResponse, 
  AIProviderStatus 
} from '../types.js';
import { PROVIDER_REGISTRY } from '../registry.js';

export class GeminiProvider implements AIProviderInterface {
  public id: AIProviderId = 'gemini';
  public displayName = PROVIDER_REGISTRY.gemini.displayName;
  private client: GoogleGenAI | null = null;

  constructor() {
    this.initClient();
  }

  private initClient(): void {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        this.client = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });
      } catch (err) {
        console.warn('Gemini client init warning:', err);
      }
    }
  }

  public isConfigured(): boolean {
    const apiKey = process.env.GEMINI_API_KEY;
    const isEnabled = process.env.GEMINI_ENABLED !== 'false';
    return Boolean(apiKey && apiKey.trim() !== '' && isEnabled);
  }

  public getStatus(): AIProviderStatus {
    const configured = this.isConfigured();
    return {
      id: this.id,
      displayName: this.displayName,
      configured,
      enabled: process.env.GEMINI_ENABLED !== 'false',
      status: configured ? 'available' : 'not_configured',
      models: PROVIDER_REGISTRY.gemini.supportedModels.map(m => m.id),
      capabilities: PROVIDER_REGISTRY.gemini.capabilities,
      priority: PROVIDER_REGISTRY.gemini.priority,
      statusNote: configured ? 'Configured via GEMINI_API_KEY' : 'GEMINI_API_KEY environment variable is missing',
    };
  }

  public async generate(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();
    if (!this.isConfigured()) {
      return {
        success: false,
        provider: this.id,
        model: request.model || PROVIDER_REGISTRY.gemini.defaultModel,
        text: '',
        error: 'Gemini API key is not configured on the server.',
        errorCode: 'INVALID_CONFIGURATION',
      };
    }

    if (!this.client) {
      this.initClient();
    }

    if (!this.client) {
      return {
        success: false,
        provider: this.id,
        model: request.model || PROVIDER_REGISTRY.gemini.defaultModel,
        text: '',
        error: 'Failed to initialize Gemini AI client.',
        errorCode: 'UNKNOWN_PROVIDER_ERROR',
      };
    }

    const modelName = request.model || PROVIDER_REGISTRY.gemini.defaultModel;

    try {
      const systemInstruction = request.systemInstruction || 'You are an expert AI content and SEO research assistant for Multi Tube Views. Provide clear, accurate, grounded responses.';
      
      const config: any = {
        systemInstruction,
        temperature: request.temperature ?? 0.3,
      };

      if (request.responseFormat === 'json' || request.jsonSchema) {
        config.responseMimeType = 'application/json';
        if (request.jsonSchema) {
          config.responseSchema = request.jsonSchema;
        }
      }

      const promptText = request.prompt;

      const aiPromise = this.client.models.generateContent({
        model: modelName,
        contents: promptText,
        config,
      });

      const timeoutMs = PROVIDER_REGISTRY.gemini.timeoutMs;
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`Gemini request timed out after ${timeoutMs}ms`)), timeoutMs)
      );

      const response: any = await Promise.race([aiPromise, timeoutPromise]);
      const responseText = response.text || '';
      const latencyMs = Date.now() - startTime;

      let parsedJson: any = undefined;
      if (request.responseFormat === 'json' || request.jsonSchema) {
        try {
          parsedJson = JSON.parse(responseText);
        } catch (_) {
          // Keep raw text if parse fails
        }
      }

      return {
        success: true,
        provider: this.id,
        model: modelName,
        text: responseText,
        json: parsedJson,
        latencyMs,
        usage: {
          inputTokens: response.usageMetadata?.promptTokenCount || 0,
          outputTokens: response.usageMetadata?.candidatesTokenCount || 0,
        },
      };
    } catch (err: any) {
      const latencyMs = Date.now() - startTime;
      const message = err?.message || 'Unknown error during Gemini generation';
      
      let errorCode: any = 'UNKNOWN_PROVIDER_ERROR';
      if (message.includes('timed out')) {
        errorCode = 'REQUEST_TIMEOUT';
      } else if (message.includes('API key') || message.includes('401') || message.includes('403')) {
        errorCode = 'AUTHENTICATION_FAILED';
      } else if (message.includes('quota') || message.includes('RESOURCE_EXHAUSTED')) {
        errorCode = 'QUOTA_EXCEEDED';
      } else if (message.includes('429')) {
        errorCode = 'RATE_LIMITED';
      }

      return {
        success: false,
        provider: this.id,
        model: modelName,
        text: '',
        latencyMs,
        error: message,
        errorCode,
      };
    }
  }
}
