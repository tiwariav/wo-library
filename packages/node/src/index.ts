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
export {
  CANONICAL_MAX_EDGE,
  CANONICAL_WEBP_QUALITY,
  CORPUS_MAX_EDGE,
  CORPUS_WEBP_QUALITY,
  isConvertibleImageKey,
  isThumbKey,
  stemFromKey,
  THUMB_MAX_EDGE,
  THUMB_WEBP_QUALITY,
  thumbKeyFromCanonicalKey,
  toWebpKey,
} from "./tools/mediaImage.js";
export {
  canonicalUploadValue,
  DEFAULT_PUBLIC_READABLE_PREFIXES,
  isPublicReadableKey,
  isPublicUploadKey,
  PUBLIC_UPLOAD_PREFIX,
  uploadKeyFromStoredValue,
  type UploadKeyOptions,
} from "./tools/uploadKey.js";
export {
  getCleanBody,
  getParam,
  getQueryEnum,
  getQueryString,
  getQueryStringArray,
} from "./tools/requestParams.js";
