# @wo-library/web

Browser and DOM utilities for script loading, fetch wrappers, storage abstraction, and more.

## Installation

```bash
npm install @wo-library/web
# or
pnpm add @wo-library/web
```

## Features

### Script & Stylesheet Loading

Dynamically inject `<script>` or `<link>` tags with CSP nonce support.

```typescript
import { loadScript, loadStylesheet } from "@wo-library/web";

await loadScript("https://cdn.example.com/sdk.js");
await loadStylesheet("https://cdn.example.com/styles.css");
```

### Fetch Wrapper (`WoFetch`)

Configurable HTTP client with auth header injection, URL construction, pluggable error/response handlers, and XHR file upload with progress.

```typescript
import { fetch } from "@wo-library/web";

const api = new fetch.WoFetch({ endpoint: "https://api.example.com" });
const user = await api.getUrl<User>("/users/1");
await api.postUrl("/users", { data: { name: "Alice" } });
```

### Storage Abstraction (`AnyStorage`)

Unified API across `localStorage`, `sessionStorage`, and in-memory fallback. Supports optional JSON serialisation and key prefixing.

```typescript
import { storage } from "@wo-library/web";

await storage.anyStorageInstance.setItem("token", "abc123", { persist: true });
const token = await storage.anyStorageInstance.getItem("token", { persist: true });
```

### CSS Utilities

Read and set CSS custom properties on DOM elements.

```typescript
import { cssVariable, overrideStyleProperty } from "@wo-library/web";

const color = cssVariable("--primary-color");
overrideStyleProperty("--primary-color", "#ff0000");
```

### SVG Utilities

Serialise SVG nodes or markup strings to `data:image/svg+xml` URIs.

```typescript
import { svg } from "@wo-library/web";

const dataUri = svg.svgNodeToData(document.querySelector("svg")!);
```

### Error Classes

Typed error hierarchy for network and response failures:

| Class                | Description                              |
| -------------------- | ---------------------------------------- |
| `WoError`            | Base error                               |
| `WoLoadScriptError`  | Script failed to load                    |
| `WoNetworkError`     | No response received                     |
| `WoResponseError<T>` | Non-OK response with `data` and `status` |

### Payments

Razorpay checkout integration via `razorpayCheckout`.

### Routing

`redirectToLogout` — redirects to a logout path with optional `from` and `message` query parameters.

## Dependencies

- `lodash-es` — tree-shakeable utilities
- `type-fest` — type helpers

## Related Packages

- [`@wo-library/js`](../js) — pure JS/TS utilities
- [`@wo-library/react`](../react) — React components and hooks

## License

MIT
