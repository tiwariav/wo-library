import { afterEach, beforeEach, vi } from "vitest";

import {
  canonicalJson,
  hashRequest,
  IDEMPOTENCY_HEADER,
  parseIdempotencyKey,
} from "../idempotency.js";
import { RateLimiter } from "../rateLimit.js";

describe("idempotency helpers", () => {
  test("parse and hash", () => {
    expect(IDEMPOTENCY_HEADER).toBe("idempotency-key");
    expect(parseIdempotencyKey("short")).toBeNull();
    expect(parseIdempotencyKey(12)).toBeNull();
    expect(parseIdempotencyKey("abcdefgh")).toBe("abcdefgh");
    expect(canonicalJson([1, { a: 2, b: 1 }])).toContain('"a":2');
    expect(canonicalJson(null)).toBe("null");
    expect(canonicalJson(undefined)).toBe("null");
    expect(
      hashRequest({
        body: { a: 2, z: 1 },
        method: "post",
        path: "/x",
        query: { q: true },
      }),
    ).toHaveLength(64);
  });
});

describe("RateLimiter", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  test("spaces starts by minIntervalMs", async () => {
    const limiter = new RateLimiter({ minIntervalMs: 100, name: "test" });
    const started: number[] = [];
    const p1 = limiter.schedule(
      async () => {
        started.push(Date.now());
        return 1;
      },
      { isRetryable: () => false },
    );
    const p2 = limiter.schedule(
      async () => {
        started.push(Date.now());
        return 2;
      },
      { isRetryable: () => false },
    );
    await vi.advanceTimersByTimeAsync(0);
    await p1;
    expect(started).toEqual([0]);
    await vi.advanceTimersByTimeAsync(100);
    await p2;
    expect(started).toEqual([0, 100]);
  });

  test("retries retryable errors with backoff", async () => {
    const onRetry = vi.fn();
    const limiter = new RateLimiter({
      baseBackoffMs: 50,
      maxRetries: 2,
      minIntervalMs: 0,
      name: "retry",
      onRetry,
    });
    let attempts = 0;
    const run = limiter.schedule(
      async () => {
        attempts += 1;
        if (attempts < 3) {
          throw new Error("429");
        }
        return "ok";
      },
      {
        isRetryable: (error) =>
          error instanceof Error && error.message === "429",
        label: "call",
        retryAfterMs: () => 25,
      },
    );
    const done = run.then((value) => value);
    await vi.advanceTimersByTimeAsync(0);
    await vi.advanceTimersByTimeAsync(25);
    await vi.advanceTimersByTimeAsync(25);
    await expect(done).resolves.toBe("ok");
    expect(onRetry).toHaveBeenCalled();
    expect(attempts).toBe(3);
  });

  test("rethrows non-retryable errors", async () => {
    const limiter = new RateLimiter({ minIntervalMs: 0, name: "fail" });
    const run = limiter.schedule(
      async () => {
        throw new Error("boom");
      },
      { isRetryable: () => false },
    );
    const assertion = await expect(run).rejects.toThrow("boom");
    await vi.advanceTimersByTimeAsync(0);
    await assertion;
  });
});
