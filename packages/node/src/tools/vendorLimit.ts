/**
 * Outbound vendor rate-limit helpers built on {@link RateLimiter}.
 * No HTTP client coupling — pass status/header extractors.
 */

import { RateLimiter, type RateLimiterOptions } from "./rateLimit.js";

const HTTP_TOO_MANY_REQUESTS = 429;
const DEFAULT_MAX_RETRIES = 2;
const DEFAULT_BASE_BACKOFF_MS = 5000;
const MAX_LIMITERS = 1000;
const MS_PER_SECOND = 1000;

export interface HttpErrorLike {
  response?: {
    headers?: Record<string, unknown>;
    status?: number;
  };
}

/** True when the error looks like HTTP 429. */
export function isRateLimited(error: unknown): boolean {
  const status = (error as HttpErrorLike | null)?.response?.status;
  return status === HTTP_TOO_MANY_REQUESTS;
}

/** Parse `Retry-After` (seconds or HTTP-date) from a response-like error. */
export function retryAfterMs(error: unknown): number | undefined {
  const header = (error as HttpErrorLike | null)?.response?.headers?.[
    "retry-after"
  ];
  if (header == null) {
    return undefined;
  }
  const seconds = Number(header);
  if (Number.isFinite(seconds)) {
    return Math.max(0, seconds * MS_PER_SECOND);
  }
  // eslint-disable-next-line @typescript-eslint/no-base-to-string -- headers are string | number
  const at = Date.parse(String(header));
  return Number.isFinite(at) ? Math.max(0, at - Date.now()) : undefined;
}

export interface VendorLimiterOptions {
  name: string;
  minIntervalMs: number;
  maxRetries?: number;
  baseBackoffMs?: number;
  onRetry: RateLimiterOptions["onRetry"];
}

export function createVendorLimiter(opts: VendorLimiterOptions): RateLimiter {
  return new RateLimiter({
    baseBackoffMs: opts.baseBackoffMs ?? DEFAULT_BASE_BACKOFF_MS,
    maxRetries: opts.maxRetries ?? DEFAULT_MAX_RETRIES,
    minIntervalMs: opts.minIntervalMs,
    name: opts.name,
    onRetry: opts.onRetry,
  });
}

/**
 * One limiter per credential string (vendors often rate-limit per token).
 * Evicts an arbitrary entry when the map exceeds {@link MAX_LIMITERS}.
 */
export function perCredentialLimiters(
  opts: VendorLimiterOptions,
): (credential: string) => RateLimiter {
  const byCredential = new Map<string, RateLimiter>();
  return (credential: string) => {
    let limiter = byCredential.get(credential);
    if (!limiter) {
      if (byCredential.size >= MAX_LIMITERS) {
        const first = byCredential.keys().next().value;
        if (first !== undefined) {
          byCredential.delete(first);
        }
      }
      limiter = createVendorLimiter(opts);
      byCredential.set(credential, limiter);
    }
    return limiter;
  };
}

/** Schedule `fn` with 429 retry + Retry-After. */
export function limited<T>(
  limiter: RateLimiter,
  label: string,
  fn: () => Promise<T>,
): Promise<T> {
  return limiter.schedule(fn, {
    isRetryable: isRateLimited,
    label,
    retryAfterMs,
  });
}
