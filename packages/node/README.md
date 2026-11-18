# @wo-library/node

Node-oriented utilities. HTTP frameworks and ORMs stay outside this package — pass adapters and allow-lists.

## Install

```bash
pnpm add @wo-library/node
```

Requires Node `>=22.18.0`.

## Function index

| Area | Exports |
| --- | --- |
| Rate limit | `RateLimiter`, `createVendorLimiter`, `perCredentialLimiters`, `limited`, `isRateLimited`, `retryAfterMs` |
| Idempotency | `parseIdempotencyKey`, `canonicalJson`, `hashRequest`, `IDEMPOTENCY_HEADER` |
| Uploads | `uploadKeyFromStoredValue`, `canonicalUploadValue`, `isPublicUploadKey`, `isPublicReadableKey` |
| Media keys | `toWebpKey`, `thumbKeyFromCanonicalKey`, `isConvertibleImageKey`, `isThumbKey` |
| Request maps | `getParam`, `getQueryString`, `getQueryStringArray`, `getQueryEnum`, `getCleanBody` |

```typescript
import {
  RateLimiter,
  hashRequest,
  uploadKeyFromStoredValue,
} from "@wo-library/node";

const limiter = new RateLimiter({ name: "vendor", minIntervalMs: 200 });
await limiter.schedule(() => callVendor(), { isRetryable: () => false });

uploadKeyFromStoredValue(url, { awsBucketNames: ["my-bucket"] });
hashRequest({ method: "POST", path: "/x", body: { a: 1 } });
```

## License

MIT
