/**
 * Multi Tube Views — DeepSeek Provider Adapter
 */

import { 
  AIProviderInterface, 
  AIProviderId, 
  AIRequest, 
  AIResponse, 
  AIProviderStatus 
} from '../types.js';
import { PROVIDER_REGISTRY } from '../registry.js';

export class DeepSeekProvider implements AIProviderInterface {
  public id: AIProviderId = 'deepseek';
  public displayName = PROVIDER_REGISTRY.deepseek.displayName;

  public isConfigured(): boolean {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    const isEnabled = process.env.DEEPSEEK_ENABLED !== 'false';
    return Boolean(apiKey && apiKey.trim() !== '' && isEnabled);
  }

  public getStatus(): AIProviderStatus {
    const configured = this.isConfigured();
    return {
      id: this.id,
      displayName: this.displayName,
      configured,
      enabled: process.env.DEEPSEEK_ENABLED !== 'false',
      status: configured ? 'available' : 'not_configured',
      models: PROVIDER_REGISTRY.deepseek.supportedModels.map(m => m.id),
      capabilities: PROVIDER_REGISTRY.deepseek.capabilities,
      priority: PROVIDER_REGISTRY.deepseek.priority,
      statusNote: configured ? 'Configured via DEEPSEEK_API_KEY' : 'DEEPSEEK_API_KEY environment variable is missing',
    };
  }

  public async generate(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();
    if (!this.isConfigured()) {
      return {
        success: false,
        provider: this.id,
        model: request.model || PROVIDER_REGISTRY.deepseek.defaultModel,
        text: '',
        error: 'DeepSeek API key is not configured on the server.',
        errorCode: 'INVALID_CONFIGURATION',
      };
    }

    const apiKey = process.env.DEEPSEEK_API_KEY!;
    const modelName = request.model || PROVIDER_REGISTRY.deepseek.defaultModel;
    const baseUrl = PROVIDER_REGISTRY.deepseek.apiBaseUrl || 'https://api.deepseek.com';

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

      if ((request.responseFormat === 'json' || request.jsonSchema) && modelName !== 'deepseek-reasoner') {
        payload.response_format = { type: 'json_object' };
      }

      const controller = new AbortController();
      const timeoutMs = PROVIDER_REGISTRY.deepseek.timeoutMs;
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
        const errorMsg = errorData?.error?.message || `DeepSeek returned HTTP status ${res.status}`;
        
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
        error: isAbort ? `DeepSeek request timed out after ${PROVIDER_REGISTRY.deepseek.timeoutMs}ms` : err.message,
        errorCode: isAbort ? 'REQUEST_TIMEOUT' : 'UNKNOWN_PROVIDER_ERROR',
      };
    }
  }
}
