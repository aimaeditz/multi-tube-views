/**
 * Multi Tube Views — AI Observability & Performance Metrics
 * Tracks operational health, provider latency, fallback frequencies,
 * error distributions, and usage metrics without logging sensitive data.
 */

import { AIProviderId, AIErrorCode } from './types.js';

export interface ProviderMetrics {
  requests: number;
  successes: number;
  failures: number;
  totalLatencyMs: number;
  avgLatencyMs: number;
  fallbacksTriggered: number;
  rateLimitHits: number;
  lastSuccessTimestamp?: number;
  lastFailureTimestamp?: number;
  lastErrorMessage?: string;
}

export interface SystemMetrics {
  uptimeSeconds: number;
  totalRequests: number;
  totalSuccesses: number;
  totalFailures: number;
  totalFallbacks: number;
  providerStats: Record<string, ProviderMetrics>;
  errorDistribution: Record<string, number>;
  activeRequests: number;
}

class AIObservability {
  private startTime = Date.now();
  private totalRequests = 0;
  private totalSuccesses = 0;
  private totalFailures = 0;
  private totalFallbacks = 0;
  private activeRequests = 0;

  private providerStats: Record<string, ProviderMetrics> = {};
  private errorDistribution: Record<string, number> = {};

  private initProvider(provider: string) {
    if (!this.providerStats[provider]) {
      this.providerStats[provider] = {
        requests: 0,
        successes: 0,
        failures: 0,
        totalLatencyMs: 0,
        avgLatencyMs: 0,
        fallbacksTriggered: 0,
        rateLimitHits: 0,
      };
    }
  }

  public recordRequestStart() {
    this.totalRequests++;
    this.activeRequests++;
  }

  public recordSuccess(provider: string, latencyMs: number, fallbackUsed: boolean = false) {
    this.totalSuccesses++;
    if (this.activeRequests > 0) this.activeRequests--;
    if (fallbackUsed) this.totalFallbacks++;

    this.initProvider(provider);
    const stats = this.providerStats[provider];
    stats.requests++;
    stats.successes++;
    stats.totalLatencyMs += latencyMs;
    stats.avgLatencyMs = Math.round(stats.totalLatencyMs / stats.successes);
    stats.lastSuccessTimestamp = Date.now();
  }

  public recordFailure(provider: string, latencyMs: number, errorCode?: AIErrorCode, errorMsg?: string) {
    this.totalFailures++;
    if (this.activeRequests > 0) this.activeRequests--;

    this.initProvider(provider);
    const stats = this.providerStats[provider];
    stats.requests++;
    stats.failures++;
    stats.lastFailureTimestamp = Date.now();
    stats.lastErrorMessage = errorMsg?.slice(0, 150);

    if (errorCode === 'RATE_LIMITED') {
      stats.rateLimitHits++;
    }

    const errKey = errorCode || 'UNKNOWN_ERROR';
    this.errorDistribution[errKey] = (this.errorDistribution[errKey] || 0) + 1;
  }

  public recordFallbackTriggered(primaryProvider: string) {
    this.initProvider(primaryProvider);
    this.providerStats[primaryProvider].fallbacksTriggered++;
  }

  public getMetrics(): SystemMetrics {
    return {
      uptimeSeconds: Math.floor((Date.now() - this.startTime) / 1000),
      totalRequests: this.totalRequests,
      totalSuccesses: this.totalSuccesses,
      totalFailures: this.totalFailures,
      totalFallbacks: this.totalFallbacks,
      activeRequests: this.activeRequests,
      providerStats: { ...this.providerStats },
      errorDistribution: { ...this.errorDistribution },
    };
  }
}

export const aiObservability = new AIObservability();
