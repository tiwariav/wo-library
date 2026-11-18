import {
  createVendorLimiter,
  isRateLimited,
  limited,
  perCredentialLimiters,
  retryAfterMs,
} from "../vendorLimit.js";

describe("vendorLimit helpers", () => {
  test("isRateLimited and retryAfterMs", () => {
    expect(isRateLimited({ response: { status: 429 } })).toBe(true);
    expect(isRateLimited({ response: { status: 500 } })).toBe(false);
    expect(
      retryAfterMs({ response: { headers: { "retry-after": "2" } } }),
    ).toBe(2000);
    expect(retryAfterMs({ response: { headers: {} } })).toBeUndefined();
    expect(retryAfterMs({})).toBeUndefined();
    const future = new Date(Date.now() + 5000).toUTCString();
    expect(
      retryAfterMs({ response: { headers: { "retry-after": future } } }),
    ).toBeGreaterThan(0);
    expect(
      retryAfterMs({ response: { headers: { "retry-after": "not-a-date" } } }),
    ).toBeUndefined();
  });

  test("perCredentialLimiters and limited", async () => {
    const factory = perCredentialLimiters({
      baseBackoffMs: 0,
      maxRetries: 0,
      minIntervalMs: 0,
      name: "v",
    });
    const a = factory("tok-a");
    const b = factory("tok-a");
    expect(a).toBe(b);
    expect(factory("tok-b")).not.toBe(a);
    for (let i = 0; i < 1001; i += 1) {
      factory(`tok-${i}`);
    }
    const limiter = createVendorLimiter({ minIntervalMs: 0, name: "direct" });
    await expect(limited(limiter, "call", async () => 7)).resolves.toBe(7);
  });
});
