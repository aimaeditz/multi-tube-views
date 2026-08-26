/**
 * Multi Tube Views — Rate Limiter & Abuse Protection
 * In-memory sliding window rate limiter for public AI endpoints.
 */

export interface RateLimiterOptions {
  windowMs: number; // Time window in milliseconds (e.g. 60000 = 1 min)
  maxRequests: number; // Max requests allowed per window per IP
}

interface ClientRequestRecord {
  timestamps: number[];
}

export class RateLimiter {
  private requests: Map<string, ClientRequestRecord> = new Map();
  private windowMs: number;
  private maxRequests: number;

  constructor(options: RateLimiterOptions = { windowMs: 60000, maxRequests: 60 }) {
    this.windowMs = options.windowMs;
    this.maxRequests = options.maxRequests;

    // Periodically prune stale IP records every 5 minutes
    setInterval(() => this.cleanup(), 300000);
  }

  public check(ip: string): { allowed: boolean; remaining: number; resetMs: number } {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    let record = this.requests.get(ip);
    if (!record) {
      record = { timestamps: [] };
      this.requests.set(ip, record);
    }

    // Filter out timestamps older than current window
    record.timestamps = record.timestamps.filter(ts => ts > windowStart);

    if (record.timestamps.length >= this.maxRequests) {
      const oldestTs = record.timestamps[0];
      const resetMs = Math.max(0, oldestTs + this.windowMs - now);
      return {
        allowed: false,
        remaining: 0,
        resetMs,
      };
    }

    record.timestamps.push(now);
    const remaining = this.maxRequests - record.timestamps.length;
    return {
      allowed: true,
      remaining,
      resetMs: this.windowMs,
    };
  }

  private cleanup(): void {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    for (const [ip, record] of this.requests.entries()) {
      record.timestamps = record.timestamps.filter(ts => ts > windowStart);
      if (record.timestamps.length === 0) {
        this.requests.delete(ip);
      }
    }
  }
}

export const globalRateLimiter = new RateLimiter({ windowMs: 60000, maxRequests: 60 });
