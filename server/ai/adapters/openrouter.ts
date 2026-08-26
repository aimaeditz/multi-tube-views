/**
 * Multi Tube Views — OpenRouter Provider Adapter
 */

import { 
  AIProviderInterface, 
  AIProviderId, 
  AIRequest, 
  AIResponse, 
  AIProviderStatus 
} from '../types.js';
import { PROVIDER_REGISTRY } from '../registry.js';

export class OpenRouterProvider implements AIProviderInterface {
  public id: AIProviderId = 'openrouter';
  public displayName = PROVIDER_REGISTRY.openrouter.displayName;

  public isConfigured(): boolean {
    const apiKey = process.env.OPENROUTER_API_KEY;
    const isEnabled = process.env.OPENROUTER_ENABLED !== 'false';
    return Boolean(apiKey && apiKey.trim() !== '' && isEnabled);
  }

  public getStatus(): AIProviderStatus {
    const configured = this.isConfigured();
    return {
      id: this.id,
      displayName: this.displayName,
      configured,
      enabled: process.env.OPENROUTER_ENABLED !== 'false',
      status: configured ? 'available' : 'not_configured',
      models: PROVIDER_REGISTRY.openrouter.supportedModels.map(m => m.id),
      capabilities: PROVIDER_REGISTRY.openrouter.capabilities,
      priority: PROVIDER_REGISTRY.openrouter.priority,
      statusNote: configured ? 'Configured via OPENROUTER_API_KEY' : 'OPENROUTER_API_KEY environment variable is missing',
    };
  }

  public async generate(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();
    if (!this.isConfigured()) {
      return {
        success: false,
        provider: this.id,
        model: request.model || PROVIDER_REGISTRY.openrouter.defaultModel,
        text: '',
        error: 'OpenRouter API key is not configured on the server.',
        errorCode: 'INVALID_CONFIGURATION',
      };
    }

    const apiKey = process.env.OPENROUTER_API_KEY!;
    const modelName = request.model || PROVIDER_REGISTRY.openrouter.defaultModel;
    const baseUrl = PROVIDER_REGISTRY.openrouter.apiBaseUrl || 'https://openrouter.ai/api/v1';

    try {
      const messages: Array<{ role: string; content: string }> = [];

      if (request.systemInstruction) {
        messages.push({ role: 'system', content: request.systemInstruction });
      }

      if (request.history && request.history.length > 0) {
        request.history.forEach(m => messages.push({ role: m.role, content: m.content }));
      }

      messages.push({ role: 'user', content: request.prompt });

      const payload: any = {
        model: modelName,
        messages,
        temperature: request.temperature ?? 0.3,
        max_tokens: request.maxTokens || 2048,
      };

      if (request.responseFormat === 'json' || request.jsonSchema) {
        payload.response_format = { type: 'json_object' };
      }

      const controller = new AbortController();
      const timeoutMs = PROVIDER_REGISTRY.openrouter.timeoutMs;
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      const res = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://multitubeviews.com',
          'X-Title': 'Multi Tube Views AI Gateway',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const latencyMs = Date.now() - startTime;

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errorMsg = errorData?.error?.message || `OpenRouter returned HTTP status ${res.status}`;
        
        let errorCode: any = 'UNKNOWN_PROVIDER_ERROR';
        if (res.status === 401) errorCode = 'AUTHENTICATION_FAILED';
        else if (res.status === 429) errorCode = 'RATE_LIMITED';

        return {
          success: false,
          provider: this.id,
          model: modelName,
          text: '',
          latencyMs,
          error: errorMsg,
          errorCode,
        };
      }

      const data = await res.json();
      const responseText = data?.choices?.[0]?.message?.content || '';

      let parsedJson: any = undefined;
      if (request.responseFormat === 'json' || request.jsonSchema) {
        try {
          parsedJson = JSON.parse(responseText);
        } catch (_) {}
      }

      return {
        success: true,
        provider: this.id,
        model: modelName,
        text: responseText,
        json: parsedJson,
        latencyMs,
        usage: {
          inputTokens: data?.usage?.prompt_tokens || 0,
          outputTokens: data?.usage?.completion_tokens || 0,
        },
      };
    } catch (err: any) {
      const latencyMs = Date.now() - startTime;
      const isAbort = err.name === 'AbortError' || err.message?.includes('aborted');
      return {
        success: false,
        provider: this.id,
        model: modelName,
        text: '',
        latencyMs,
        error: isAbort ? `OpenRouter request timed out after ${PROVIDER_REGISTRY.openrouter.timeoutMs}ms` : err.message,
        errorCode: isAbort ? 'REQUEST_TIMEOUT' : 'UNKNOWN_PROVIDER_ERROR',
      };
    }
  }
}
