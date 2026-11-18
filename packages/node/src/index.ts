/**
 * Node-only utilities. Adapters for HTTP frameworks and databases are passed in
 * by consumers; this package does not import those runtimes directly.
 */

export {
  canonicalJson,
  hashRequest,
  IDEMPOTENCY_HEADER,
  parseIdempotencyKey,
} from "./tools/idempotency.js";
export { RateLimiter, type RateLimiterOptions } from "./tools/rateLimit.js";
export {
  createVendorLimiter,
  isRateLimited,
  limited,
  perCredentialLimiters,
  retryAfterMs,
  type VendorLimiterOptions,
} from "./tools/vendorLimit.js";
