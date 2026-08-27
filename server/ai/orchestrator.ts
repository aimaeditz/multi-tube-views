/**
 * Multi Tube Views (MTV) — Universal AI Engine & Gateway Orchestrator
 * Central intelligence hub managing tool routing, capability matching,
 * prompt composition, primary execution, automated fallback, JSON repair,
 * TruthGuard factuality enforcement, and operational observability.
 */

import { 
  AIProviderInterface, 
  AIProviderId, 
  AIRequest, 
  AIResponse, 
  AIProviderStatus,
  AICapability,
  BatchAIRequest,
  BatchAIResponse,
  AICompareResponse
} from './types.js';
import { PROVIDER_REGISTRY } from './registry.js';
import { GeminiProvider } from './adapters/gemini.js';
import { OpenAIProvider } from './adapters/openai.js';
import { GrokProvider } from './adapters/grok.js';
import { DeepSeekProvider } from './adapters/deepseek.js';
import { ClaudeProvider } from './adapters/claude.js';
import { MistralProvider } from './adapters/mistral.js';
import { OpenRouterProvider } from './adapters/openrouter.js';
import { PuterProvider } from './adapters/puter.js';
import { getToolDefinition } from './tools/registry.js';
import { normalizeCapability } from './capabilities.js';
import { getModelsForCapability, getDefaultModelForProvider } from './models.js';
import { PromptBuilder } from './prompts/builder.js';
import { Validator } from './validation/validator.js';
import { aiObservability } from './observability.js';

export class AIOrchestrator {
  private providers: Map<AIProviderId, AIProviderInterface> = new Map();

  constructor() {
    this.registerProviders();
  }

  private registerProviders() {
    this.providers.set('gemini', new GeminiProvider());
    this.providers.set('openai', new OpenAIProvider());
    this.providers.set('grok', new GrokProvider());
    this.providers.set('deepseek', new DeepSeekProvider());
    this.providers.set('claude', new ClaudeProvider());
    this.providers.set('mistral', new MistralProvider());
    this.providers.set('openrouter', new OpenRouterProvider());
    this.providers.set('puter', new PuterProvider());
  }

  public getProvider(id: AIProviderId): AIProviderInterface | undefined {
    return this.providers.get(id);
  }

  public getAllProviders(): AIProviderInterface[] {
    return Array.from(this.providers.values());
  }

  public getProviderStatuses(): AIProviderStatus[] {
    return this.getAllProviders().map(p => p.getStatus());
  }

  public getProviderStatusList(): AIProviderStatus[] {
    return this.getProviderStatuses();
  }

  public getConfiguredProviders(): AIProviderInterface[] {
    return this.getAllProviders().filter(p => p.isConfigured());
  }

  public getAvailableProviders(): AIProviderStatus[] {
    return this.getProviderStatuses().filter(p => p.configured && p.enabled);
  }

  public async generate(rawRequest: AIRequest): Promise<AIResponse> {
    return this.execute(rawRequest);
  }

  /**
   * Determine optimal candidate providers and models for a given tool/capability
   */
  public resolveProviderCandidates(options: {
    explicitProvider?: string;
    explicitModel?: string;
    capability?: AICapability;
    toolPreferredProviders?: AIProviderId[];
    toolPreferredModels?: string[];
  }): Array<{ providerId: AIProviderId; model: string }> {
    const configured = this.getConfiguredProviders();
    const candidates: Array<{ providerId: AIProviderId; model: string }> = [];

    // 1. Explicit provider requested (and not 'auto')
    if (options.explicitProvider && options.explicitProvider !== 'auto') {
      const explicitId = options.explicitProvider as AIProviderId;
      const prov = this.getProvider(explicitId);
      if (prov) {
        const model = options.explicitModel || getDefaultModelForProvider(explicitId);
        candidates.push({ providerId: explicitId, model });
      }
    }

    // 2. Tool preferred providers
    if (options.toolPreferredProviders && options.toolPreferredProviders.length > 0) {
      for (const prefId of options.toolPreferredProviders) {
        if (!candidates.some(c => c.providerId === prefId)) {
          const prov = this.getProvider(prefId);
          if (prov && prov.isConfigured()) {
            candidates.push({ providerId: prefId, model: getDefaultModelForProvider(prefId) });
          }
        }
      }
    }

    // 3. Fallback to all configured providers sorted by registry priority
    const sortedConfigured = configured.sort((a, b) => {
      const pA = PROVIDER_REGISTRY[a.id]?.priority ?? 99;
      const pB = PROVIDER_REGISTRY[b.id]?.priority ?? 99;
      return pA - pB;
    });

    for (const prov of sortedConfigured) {
      if (!candidates.some(c => c.providerId === prov.id)) {
        candidates.push({ providerId: prov.id, model: getDefaultModelForProvider(prov.id) });
      }
    }

    // 4. If no configured providers found at all, include Gemini and OpenAI as fallback stubs
    if (candidates.length === 0) {
      candidates.push({ providerId: 'gemini', model: 'gemini-3.6-flash' });
      candidates.push({ providerId: 'openai', model: 'gpt-4o-mini' });
    }

    return candidates;
  }

  /**
   * Universal AI Execution Method
   */
  public async execute(rawRequest: AIRequest): Promise<AIResponse> {
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const startTime = Date.now();
    aiObservability.recordRequestStart();

    const attemptedProviders: string[] = [];
    const warnings: string[] = [];

    // 1. Tool Resolution
    const targetToolId = rawRequest.toolId || rawRequest.tool || rawRequest.action;
    const toolDef = targetToolId ? getToolDefinition(targetToolId) : undefined;
    const capability = normalizeCapability(rawRequest.capability || toolDef?.capability || 'TEXT_GENERATION');

    // 2. Input Sanitization & Schema Validation
    let toolInput: Record<string, any> = { ...(rawRequest.input || {}) };
    if (rawRequest.prompt && !toolInput.topic && !toolInput.title) {
      toolInput.topic = rawRequest.prompt;
    }

    // Sanitize text inputs
    for (const [k, v] of Object.entries(toolInput)) {
      if (typeof v === 'string') {
        const sanitized = Validator.sanitizeInput(v);
        toolInput[k] = sanitized.clean;
        if (sanitized.warnings.length > 0) {
          warnings.push(...sanitized.warnings);
        }
      }
    }

    if (toolDef && !rawRequest.options?.skipValidation) {
      const inputValidation = Validator.validateSchema(toolInput, toolDef.inputSchema);
      if (!inputValidation.valid) {
        warnings.push(`Input validation notes: ${inputValidation.errors.join(', ')}`);
      }
    }

    // 3. Prompt Composition
    const composedSystem = PromptBuilder.buildSystemInstruction({
      profileId: toolDef?.promptProfile,
      systemInstruction: rawRequest.systemInstruction,
      capability,
      platform: rawRequest.platform,
      outputSchema: toolDef?.outputSchema,
      input: toolInput,
    });

    const composedPrompt = rawRequest.prompt && !toolDef 
      ? rawRequest.prompt 
      : PromptBuilder.buildUserPrompt({
          profileId: toolDef?.promptProfile,
          toolPrompt: rawRequest.prompt,
          platform: rawRequest.platform,
          input: toolInput,
        });

    // 4. Resolve Candidate Providers & Models
    const candidates = this.resolveProviderCandidates({
      explicitProvider: rawRequest.provider,
      explicitModel: rawRequest.model,
      capability,
      toolPreferredProviders: toolDef?.preferredProviders,
      toolPreferredModels: toolDef?.preferredModels,
    });

    let lastError: string = 'No AI provider succeeded.';
    let lastErrorCode: any = 'PROVIDER_UNAVAILABLE';
    let fallbackUsed = false;

    // 5. Provider Execution & Fallback Loop
    for (let i = 0; i < candidates.length; i++) {
      const { providerId, model } = candidates[i];
      const adapter = this.getProvider(providerId);
      if (!adapter) continue;

      attemptedProviders.push(providerId);
      if (i > 0) {
        fallbackUsed = true;
        aiObservability.recordFallbackTriggered(candidates[0].providerId);
      }

      const executionRequest: AIRequest = {
        ...rawRequest,
        provider: providerId,
        model,
        prompt: composedPrompt,
        systemInstruction: composedSystem,
        responseFormat: toolDef ? 'json' : (rawRequest.responseFormat || 'text'),
      };

      try {
        const response = await adapter.generate(executionRequest);

        if (response.success) {
          let structuredData: any = undefined;
          let finalText = response.text;

          // Attempt JSON parsing and schema validation if tool or json requested
          if (toolDef || rawRequest.responseFormat === 'json' || rawRequest.jsonSchema) {
            const parsed = Validator.extractAndRepairJson(response.text);
            if (parsed.success) {
              structuredData = parsed.data;

              // Enforce TruthGuard duration rules
              structuredData = Validator.enforceTruthGuard(structuredData, {
                durationSeconds: toolInput.durationSeconds,
                url: toolInput.url,
              });

              if (toolDef) {
                const schemaVal = Validator.validateSchema(structuredData, toolDef.outputSchema);
                if (!schemaVal.valid) {
                  warnings.push(`Output schema notes: ${schemaVal.errors.join(', ')}`);
                }
              }
            } else {
              warnings.push('AI output was structured text rather than strict JSON.');
            }
          }

          const latencyMs = Date.now() - startTime;
          aiObservability.recordSuccess(providerId, latencyMs, fallbackUsed);

          return {
            success: true,
            requestId,
            toolId: toolDef?.toolId || (typeof targetToolId === 'string' ? targetToolId : undefined),
            capability,
            provider: providerId,
            model,
            text: finalText,
            json: structuredData || response.json,
            data: structuredData,
            usage: response.usage,
            latencyMs,
            fallbackOccurred: fallbackUsed,
            fallbackUsed,
            attemptedProviders,
            warnings: warnings.length > 0 ? warnings : undefined,
          };
        } else {
          lastError = response.error || 'Provider returned unsuccessful status';
          lastErrorCode = response.errorCode || 'UNKNOWN_PROVIDER_ERROR';
          aiObservability.recordFailure(providerId, response.latencyMs || 0, response.errorCode, response.error);
        }
      } catch (err: any) {
        lastError = err.message || 'Exception during provider generation';
        lastErrorCode = 'UNKNOWN_PROVIDER_ERROR';
        aiObservability.recordFailure(providerId, 0, 'UNKNOWN_PROVIDER_ERROR', err.message);
      }
    }

    // 6. Deterministic Fallback if all providers failed and tool supports it
    if (toolDef && toolDef.deterministicFallback && toolDef.fallbackPolicy?.allowDeterministicFallback !== false) {
      warnings.push('AI providers were unavailable; served high-accuracy deterministic fallback data.');
      const fallbackData = toolDef.deterministicFallback(toolInput);
      const latencyMs = Date.now() - startTime;

      return {
        success: true,
        requestId,
        toolId: toolDef.toolId,
        capability,
        provider: 'deterministic-fallback',
        model: 'system-rule-engine-v1',
        text: JSON.stringify(fallbackData, null, 2),
        json: fallbackData,
        data: fallbackData,
        latencyMs,
        fallbackOccurred: true,
        fallbackUsed: true,
        attemptedProviders,
        warnings,
      };
    }

    // 7. Complete Failure Response
    const totalLatency = Date.now() - startTime;
    return {
      success: false,
      requestId,
      toolId: toolDef?.toolId,
      capability,
      provider: candidates[0]?.providerId || 'none',
      model: candidates[0]?.model || 'none',
      text: '',
      error: lastError,
      errorCode: lastErrorCode,
      latencyMs: totalLatency,
      fallbackOccurred: fallbackUsed,
      fallbackUsed,
      attemptedProviders,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  }

  /**
   * Multi-provider comparison mode
   */
  public async compare(request: AIRequest): Promise<AICompareResponse> {
    const configured = this.getConfiguredProviders();
    const targetProviders = request.compareProviders || configured.map(p => p.id).slice(0, 3);
    const responses: Record<string, AIResponse> = {};
    let successfulCount = 0;
    let fastestProvider: string | undefined;
    let minLatency = Infinity;

    await Promise.all(
      targetProviders.map(async (pId) => {
        const provReq: AIRequest = {
          ...request,
          provider: pId,
          model: getDefaultModelForProvider(pId),
        };
        const res = await this.execute(provReq);
        responses[pId] = res;
        if (res.success) {
          successfulCount++;
          if (res.latencyMs && res.latencyMs < minLatency) {
            minLatency = res.latencyMs;
            fastestProvider = pId;
          }
        }
      })
    );

    return {
      success: successfulCount > 0,
      prompt: request.prompt || '',
      toolId: request.toolId ? String(request.toolId) : undefined,
      responses,
      totalProviders: targetProviders.length,
      successfulProviders: successfulCount,
      fastestProvider,
    };
  }

  /**
   * Batch execution helper
   */
  public async processBatch(batchReq: BatchAIRequest): Promise<BatchAIResponse> {
    const startTime = Date.now();
    const concurrency = Math.min(batchReq.concurrency || 3, 5);
    const results: Array<{ id: string | number; success: boolean; response?: AIResponse; error?: string }> = [];

    const items = [...batchReq.items];
    const workers = Array.from({ length: concurrency }).map(async () => {
      while (items.length > 0) {
        const item = items.shift();
        if (!item) break;

        try {
          const res = await this.execute({
            toolId: batchReq.toolId,
            capability: batchReq.capability,
            input: item.input,
            prompt: item.prompt,
            provider: batchReq.provider,
            model: batchReq.model,
          });

          results.push({
            id: item.id,
            success: res.success,
            response: res,
            error: res.error,
          });
        } catch (err: any) {
          results.push({
            id: item.id,
            success: false,
            error: err.message || 'Batch item execution error',
          });
        }
      }
    });

    await Promise.all(workers);

    const successful = results.filter(r => r.success).length;
    return {
      success: successful > 0,
      total: batchReq.items.length,
      successful,
      failed: batchReq.items.length - successful,
      results,
      latencyMs: Date.now() - startTime,
    };
  }
}

export const aiOrchestrator = new AIOrchestrator();
