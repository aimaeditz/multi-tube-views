/**
 * Multi Tube Views — Mistral AI Provider Adapter
 */

import { 
  AIProviderInterface, 
  AIProviderId, 
  AIRequest, 
  AIResponse, 
  AIProviderStatus 
} from '../types.js';
import { PROVIDER_REGISTRY } from '../registry.js';

export class MistralProvider implements AIProviderInterface {
  public id: AIProviderId = 'mistral';
  public displayName = PROVIDER_REGISTRY.mistral.displayName;

  public isConfigured(): boolean {
    const apiKey = process.env.MISTRAL_API_KEY;
    const isEnabled = process.env.MISTRAL_ENABLED !== 'false';
    return Boolean(apiKey && apiKey.trim() !== '' && isEnabled);
  }

  public getStatus(): AIProviderStatus {
    const configured = this.isConfigured();
    return {
      id: this.id,
      displayName: this.displayName,
      configured,
      enabled: process.env.MISTRAL_ENABLED !== 'false',
      status: configured ? 'available' : 'not_configured',
      models: PROVIDER_REGISTRY.mistral.supportedModels.map(m => m.id),
      capabilities: PROVIDER_REGISTRY.mistral.capabilities,
      priority: PROVIDER_REGISTRY.mistral.priority,
      statusNote: configured ? 'Configured via MISTRAL_API_KEY' : 'MISTRAL_API_KEY environment variable is missing',
    };
  }

  public async generate(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();
    if (!this.isConfigured()) {
      return {
        success: false,
        provider: this.id,
        model: request.model || PROVIDER_REGISTRY.mistral.defaultModel,
        text: '',
        error: 'Mistral API key is not configured on the server.',
        errorCode: 'INVALID_CONFIGURATION',
      };
    }

    const apiKey = process.env.MISTRAL_API_KEY!;
    const modelName = request.model || PROVIDER_REGISTRY.mistral.defaultModel;
    const baseUrl = PROVIDER_REGISTRY.mistral.apiBaseUrl || 'https://api.mistral.ai/v1';

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
      const timeoutMs = PROVIDER_REGISTRY.mistral.timeoutMs;
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      const res = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const latencyMs = Date.now() - startTime;

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errorMsg = errorData?.error?.message || `Mistral returned HTTP status ${res.status}`;
        
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
        error: isAbort ? `Mistral request timed out after ${PROVIDER_REGISTRY.mistral.timeoutMs}ms` : err.message,
        errorCode: isAbort ? 'REQUEST_TIMEOUT' : 'UNKNOWN_PROVIDER_ERROR',
      };
    }
  }
}
