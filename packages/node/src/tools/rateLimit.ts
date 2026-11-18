/**
 * Minimum-interval rate limiter with optional retry on rejected requests.
 * Process-local; suitable for serial outbound vendor calls.
 */

/* eslint-disable compat/compat -- Node-only package; Promise is required */
/* eslint-disable no-await-in-loop -- retries must wait between attempts */

/* eslint-disable unicorn/prefer-await -- queue chaining must stay non-blocking */
/* eslint-disable lodash/prefer-noop -- node package has no lodash */
/* eslint-disable @typescript-eslint/no-empty-function -- settle handlers ignore result */

const DEFAULT_MAX_RETRIES = 3;
const DEFAULT_BASE_BACKOFF_MS = 1000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export interface RateLimiterOptions {
  /** Label for diagnostics. */
  name: string;
  /** Minimum gap between the start of one request and the next. */
  minIntervalMs: number;
  /** Retries after a retryable failure. Default: 3. */
  maxRetries?: number;
  /** First backoff delay; doubles each attempt. Default: 1000. */
  baseBackoffMs?: number;
  /** Optional logger hook. */
  onRetry?: (info: {
    attempt: number;
    backoffMs: number;
    label?: string;
    name: string;
    statedByServer: boolean;
  }) => void;
}

export class RateLimiter {
  readonly name: string;
  private readonly minIntervalMs: number;
  private readonly maxRetries: number;
  private readonly baseBackoffMs: number;
  private readonly onRetry: RateLimiterOptions["onRetry"];
  private queue: Promise<unknown> = Promise.resolve();
  /** Instant the last request started; `null` means none yet. */
  private lastStartedAt: null | number = null;

  constructor(options: RateLimiterOptions) {
    this.name = options.name;
    this.minIntervalMs = options.minIntervalMs;
    this.maxRetries = options.maxRetries ?? DEFAULT_MAX_RETRIES;
    this.baseBackoffMs = options.baseBackoffMs ?? DEFAULT_BASE_BACKOFF_MS;
    this.onRetry = options.onRetry;
  }

  /**
   * Run `fn` in a rate-limited slot, retrying when `isRetryable` says so.
   */
  schedule<T>(
    fn: () => Promise<T>,
    opts: {
      isRetryable: (error: unknown) => boolean;
      label?: string;
      retryAfterMs?: (error: unknown) => number | undefined;
    },
  ): Promise<T> {
    const run = this.queue.then(async () => {
      for (let attempt = 0; ; attempt += 1) {
        if (this.lastStartedAt !== null) {
          const wait = Math.max(
            0,
            this.minIntervalMs - (Date.now() - this.lastStartedAt),
          );
          if (wait > 0) {
            await sleep(wait);
          }
        }
        this.lastStartedAt = Date.now();

        try {
          return await fn();
        } catch (error) {
          if (attempt >= this.maxRetries || !opts.isRetryable(error)) {
            throw error;
          }
          const stated = opts.retryAfterMs?.(error);
          const backoff = stated ?? this.baseBackoffMs * 2 ** attempt;
          this.onRetry?.({
            attempt: attempt + 1,
            backoffMs: backoff,
            label: opts.label,
            name: this.name,
            statedByServer: stated != null,
          });
          await sleep(backoff);
        }
      }
    });

    this.queue = run.then(() => {}).catch(() => {});
    return run;
  }
}
