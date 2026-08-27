/**
 * Multi Tube Views — Puter AI Optional Provider Adapter
 * Optional AI Gateway adapter that provides optional access to models via Puter
 * without becoming a hard dependency. Seamlessly falls back when not configured.
 */

import { 
  AIProviderInterface, 
  AIProviderId, 
  AIRequest, 
  AIResponse, 
  AIProviderStatus 
} from '../types.js';
import { PROVIDER_REGISTRY } from '../registry.js';

export class PuterProvider implements AIProviderInterface {
  public id: AIProviderId = 'puter';
  public displayName = PROVIDER_REGISTRY.puter.displayName;

  public isConfigured(): boolean {
    const isEnabled = process.env.PUTER_ENABLED === 'true';
    const token = process.env.PUTER_AUTH_TOKEN || process.env.PUTER_API_KEY;
    return Boolean(isEnabled && token && token.trim() !== '');
  }

  public getStatus(): AIProviderStatus {
    const configured = this.isConfigured();
    const isEnabled = process.env.PUTER_ENABLED === 'true';
    return {
      id: this.id,
      displayName: this.displayName,
      configured,
      enabled: isEnabled,
      isOptional: true,
      status: configured ? 'available' : (!isEnabled ? 'disabled' : 'not_configured'),
      models: PROVIDER_REGISTRY.puter.supportedModels.map(m => m.id),
      capabilities: PROVIDER_REGISTRY.puter.capabilities,
      priority: PROVIDER_REGISTRY.puter.priority,
      statusNote: configured 
        ? 'Optional Puter gateway configured' 
        : (!isEnabled ? 'Optional provider disabled (PUTER_ENABLED is not true)' : 'PUTER_AUTH_TOKEN not provided'),
    };
  }

  public async generate(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();
    if (!this.isConfigured()) {
      return {
        success: false,
        provider: this.id,
        model: request.model || PROVIDER_REGISTRY.puter.defaultModel,
        text: '',
        error: 'Puter optional gateway is not configured or disabled in server environment.',
        errorCode: 'INVALID_CONFIGURATION',
      };
    }

    const token = process.env.PUTER_AUTH_TOKEN || process.env.PUTER_API_KEY!;
    const modelName = (request.model || PROVIDER_REGISTRY.puter.defaultModel).replace(/^puter\//, '');
    const baseUrl = process.env.PUTER_API_BASE_URL || 'https://api.puter.com/drivers/ai/chat';

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
        interface: 'puter-chat-completion',
        driver: modelName.includes('claude') ? 'claude' : 'openai',
        model: modelName,
        messages,
        temperature: request.temperature ?? 0.3,
      };

      const controller = new AbortController();
      const timeoutMs = PROVIDER_REGISTRY.puter.timeoutMs;
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      const res = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const latencyMs = Date.now() - startTime;

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errorMsg = errorData?.error?.message || `Puter returned HTTP status ${res.status}`;
        
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
      const responseText = data?.message?.content || data?.choices?.[0]?.message?.content || data?.text || '';

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
        error: isAbort ? `Puter request timed out after ${PROVIDER_REGISTRY.puter.timeoutMs}ms` : err.message,
        errorCode: isAbort ? 'REQUEST_TIMEOUT' : 'UNKNOWN_PROVIDER_ERROR',
      };
    }
  }
}
