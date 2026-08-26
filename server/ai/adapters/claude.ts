/**
 * Multi Tube Views — Anthropic Claude Provider Adapter
 */

import { 
  AIProviderInterface, 
  AIProviderId, 
  AIRequest, 
  AIResponse, 
  AIProviderStatus 
} from '../types.js';
import { PROVIDER_REGISTRY } from '../registry.js';

export class ClaudeProvider implements AIProviderInterface {
  public id: AIProviderId = 'claude';
  public displayName = PROVIDER_REGISTRY.claude.displayName;

  public isConfigured(): boolean {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    const isEnabled = process.env.ANTHROPIC_ENABLED !== 'false';
    return Boolean(apiKey && apiKey.trim() !== '' && isEnabled);
  }

  public getStatus(): AIProviderStatus {
    const configured = this.isConfigured();
    return {
      id: this.id,
      displayName: this.displayName,
      configured,
      enabled: process.env.ANTHROPIC_ENABLED !== 'false',
      status: configured ? 'available' : 'not_configured',
      models: PROVIDER_REGISTRY.claude.supportedModels.map(m => m.id),
      capabilities: PROVIDER_REGISTRY.claude.capabilities,
      priority: PROVIDER_REGISTRY.claude.priority,
      statusNote: configured ? 'Configured via ANTHROPIC_API_KEY' : 'ANTHROPIC_API_KEY environment variable is missing',
    };
  }

  public async generate(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();
    if (!this.isConfigured()) {
      return {
        success: false,
        provider: this.id,
        model: request.model || PROVIDER_REGISTRY.claude.defaultModel,
        text: '',
        error: 'Anthropic Claude API key is not configured on the server.',
        errorCode: 'INVALID_CONFIGURATION',
      };
    }

    const apiKey = process.env.ANTHROPIC_API_KEY!;
    const modelName = request.model || PROVIDER_REGISTRY.claude.defaultModel;
    const baseUrl = PROVIDER_REGISTRY.claude.apiBaseUrl || 'https://api.anthropic.com/v1';

    try {
      const messages: Array<{ role: string; content: string }> = [];

      if (request.history && request.history.length > 0) {
        request.history.forEach(m => {
          if (m.role === 'user' || m.role === 'assistant') {
            messages.push({ role: m.role, content: m.content });
          }
        });
      }

      messages.push({ role: 'user', content: request.prompt });

      const payload: any = {
        model: modelName,
        max_tokens: request.maxTokens || 2048,
        temperature: request.temperature ?? 0.3,
        messages,
      };

      if (request.systemInstruction) {
        payload.system = request.systemInstruction;
      }

      if (request.responseFormat === 'json' || request.jsonSchema) {
        payload.system = (payload.system ? payload.system + '\n\n' : '') + 'Return strictly valid JSON format only.';
      }

      const controller = new AbortController();
      const timeoutMs = PROVIDER_REGISTRY.claude.timeoutMs;
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      const res = await fetch(`${baseUrl}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const latencyMs = Date.now() - startTime;

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errorMsg = errorData?.error?.message || `Anthropic returned HTTP status ${res.status}`;
        
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
      const textBlocks = data?.content || [];
      const responseText = textBlocks.map((b: any) => b.text || '').join('');

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
          inputTokens: data?.usage?.input_tokens || 0,
          outputTokens: data?.usage?.output_tokens || 0,
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
        error: isAbort ? `Anthropic Claude request timed out after ${PROVIDER_REGISTRY.claude.timeoutMs}ms` : err.message,
        errorCode: isAbort ? 'REQUEST_TIMEOUT' : 'UNKNOWN_PROVIDER_ERROR',
      };
    }
  }
}
