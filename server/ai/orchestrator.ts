/**
 * Multi Tube Views — Central AI Orchestrator & Provider Router
 * Core intelligence hub responsible for provider routing, Auto mode selection,
 * capability matching, intelligent fallback, error normalization, and Compare Mode.
 */

import { 
  AIProviderInterface, 
  AIProviderId, 
  AIRequest, 
  AIResponse, 
  AICompareResponse,
  AIProviderStatus 
} from './types.js';
import { GeminiProvider } from './adapters/gemini.js';
import { OpenAIProvider } from './adapters/openai.js';
import { GrokProvider } from './adapters/grok.js';
import { DeepSeekProvider } from './adapters/deepseek.js';
import { ClaudeProvider } from './adapters/claude.js';
import { MistralProvider } from './adapters/mistral.js';
import { OpenRouterProvider } from './adapters/openrouter.js';
import { PROVIDER_REGISTRY } from './registry.js';

export class AIOrchestrator {
  private providers: Map<AIProviderId, AIProviderInterface> = new Map();

  constructor() {
    this.registerProviders();
  }

  private registerProviders(): void {
    const gemini = new GeminiProvider();
    const openai = new OpenAIProvider();
    const grok = new GrokProvider();
    const deepseek = new DeepSeekProvider();
    const claude = new ClaudeProvider();
    const mistral = new MistralProvider();
    const openrouter = new OpenRouterProvider();

    this.providers.set('gemini', gemini);
    this.providers.set('openai', openai);
    this.providers.set('grok', grok);
    this.providers.set('deepseek', deepseek);
    this.providers.set('claude', claude);
    this.providers.set('mistral', mistral);
    this.providers.set('openrouter', openrouter);
  }

  public getProviderStatusList(): AIProviderStatus[] {
    const statusList: AIProviderStatus[] = [];
    for (const provider of this.providers.values()) {
      statusList.push(provider.getStatus());
    }
    return statusList.sort((a, b) => a.priority - b.priority);
  }

  public getAvailableProviders(): AIProviderStatus[] {
    return this.getProviderStatusList().filter(p => p.configured && p.enabled);
  }

  public async generate(request: AIRequest): Promise<AIResponse> {
    const requestedProvider = request.provider || 'auto';

    // Handle Compare Mode
    if (requestedProvider === 'compare') {
      const compareResult = await this.compare(request);
      const successfulEntry = Object.values(compareResult.responses).find(r => r.success);
      if (successfulEntry) {
        return {
          ...successfulEntry,
          json: {
            ...successfulEntry.json,
            _compareMode: true,
            _compareResults: compareResult.responses,
          },
        };
      }
      return {
        success: false,
        provider: 'compare',
        model: 'multi-provider',
        text: '',
        error: 'All configured AI providers failed during comparison mode.',
        errorCode: 'PROVIDER_UNAVAILABLE',
      };
    }

    // Auto Mode or Specific Provider Selection
    const availableProviders = this.getAvailableProviders();

    if (availableProviders.length === 0) {
      return {
        success: false,
        provider: requestedProvider,
        model: request.model || 'none',
        text: '',
        error: 'No AI providers are currently configured on the server. Please configure GEMINI_API_KEY, OPENAI_API_KEY, XAI_API_KEY, DEEPSEEK_API_KEY, ANTHROPIC_API_KEY, MISTRAL_API_KEY, or OPENROUTER_API_KEY in your server environment.',
        errorCode: 'INVALID_CONFIGURATION',
      };
    }

    // Build ordered list of candidate providers to attempt
    let candidateIds: AIProviderId[] = [];

    if ((requestedProvider as string) !== 'auto' && (requestedProvider as string) !== 'compare') {
      const specificProvider = this.providers.get(requestedProvider as AIProviderId);
      if (specificProvider && specificProvider.isConfigured()) {
        candidateIds.push(requestedProvider as AIProviderId);
      }
    }

    // Append fallback candidates sorted by priority
    const fallbackCandidates = availableProviders
      .map(p => p.id)
      .filter(id => !candidateIds.includes(id));

    candidateIds = [...candidateIds, ...fallbackCandidates];

    // If candidate list is empty (e.g. requested specific provider wasn't configured)
    if (candidateIds.length === 0) {
      candidateIds = availableProviders.map(p => p.id);
    }

    const maxAttempts = Math.min(
      candidateIds.length,
      parseInt(process.env.MAX_FALLBACK_ATTEMPTS || '3', 10) || 3
    );

    const attemptedProviders: string[] = [];
    let lastErrorResponse: AIResponse | null = null;

    for (let i = 0; i < maxAttempts; i++) {
      const providerId = candidateIds[i];
      const adapter = this.providers.get(providerId);

      if (!adapter) continue;

      attemptedProviders.push(providerId);

      // Model resolution for specific provider
      let modelToUse = request.model;
      if (!modelToUse || !PROVIDER_REGISTRY[providerId].supportedModels.some(m => m.id === modelToUse)) {
        modelToUse = PROVIDER_REGISTRY[providerId].defaultModel;
      }

      const reqForAdapter: AIRequest = {
        ...request,
        provider: providerId,
        model: modelToUse,
      };

      const response = await adapter.generate(reqForAdapter);

      if (response.success) {
        return {
          ...response,
          fallbackOccurred: i > 0,
          attemptedProviders,
        };
      }

      lastErrorResponse = response;
      console.warn(`[AI Orchestrator] Provider "${providerId}" failed (${response.errorCode}: ${response.error}). Attempting fallback...`);
    }

    return {
      success: false,
      provider: attemptedProviders[attemptedProviders.length - 1] || 'none',
      model: request.model || 'none',
      text: '',
      fallbackOccurred: attemptedProviders.length > 1,
      attemptedProviders,
      error: lastErrorResponse?.error || 'All attempted AI providers failed.',
      errorCode: lastErrorResponse?.errorCode || 'PROVIDER_UNAVAILABLE',
    };
  }

  public async compare(request: AIRequest): Promise<AICompareResponse> {
    const available = this.getAvailableProviders();
    const providersToRun = request.compareProviders && request.compareProviders.length > 0
      ? available.filter(p => request.compareProviders!.includes(p.id))
      : available;

    const responses: Record<string, AIResponse> = {};

    const promises = providersToRun.map(async pStatus => {
      const adapter = this.providers.get(pStatus.id);
      if (!adapter) return;

      const modelToUse = PROVIDER_REGISTRY[pStatus.id].defaultModel;
      const response = await adapter.generate({
        ...request,
        provider: pStatus.id,
        model: modelToUse,
      });

      responses[pStatus.id] = response;
    });

    await Promise.all(promises);

    const successfulProviders = Object.values(responses).filter(r => r.success).length;

    return {
      success: successfulProviders > 0,
      prompt: request.prompt,
      responses,
      totalProviders: providersToRun.length,
      successfulProviders,
    };
  }
}

export const aiOrchestrator = new AIOrchestrator();
