/* eslint-disable compat/compat, max-statements, sonarjs/cognitive-complexity, lodash/prefer-lodash-typecheck, unicorn/prefer-includes-over-repeated-comparisons -- Node URL parsing */
/**
 * Extract a storage object key from a stored upload URL or bare key.
 * Host/bucket allow-lists are injected — no product env defaults.
 */

const MAX_VALUE_LENGTH = 2048;

export const PUBLIC_UPLOAD_PREFIX = "public/";

export interface UploadKeyOptions {
  /** Virtual-hosted S3 bucket names (`bucket.s3…amazonaws.com`). */
  awsBucketNames?: readonly string[];
  /** Custom public CDN / R2 hosts (hostname only). */
  publicHosts?: readonly string[];
  /** S3-compatible API endpoint URL (path-style or virtual-hosted). */
  endpointUrl?: string;
  /** Bucket names on the endpoint (path-style `/bucket/key`). */
  endpointBuckets?: readonly string[];
  /** App/local hosts that serve `/uploads/<key>`. */
  localHosts?: readonly string[];
  /** Prefixes treated as publicly readable. */
  publicReadablePrefixes?: readonly string[];
}

const escapeRegExp = (text: string) =>
  text.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);

const hostOf = (value: string | undefined): null | string => {
  try {
    return value ? new URL(value).hostname : null;
  } catch {
    return null;
  }
};

const isOurBucketHost = (
  hostname: string,
  buckets: readonly string[],
): boolean => {
  if (buckets.length === 0) {
    return false;
  }
  return buckets.some((bucket) =>
    new RegExp(
      String.raw`^${escapeRegExp(bucket)}\.s3([.-][\da-z-]+)?\.amazonaws\.com$`,
      "i",
    ).test(hostname),
  );
};

const keyFromEndpointUrl = (
  hostname: string,
  path: string,
  options: UploadKeyOptions,
): null | string | undefined => {
  const endpointHost = hostOf(options.endpointUrl);
  if (!endpointHost) {
    return undefined;
  }
  const buckets = options.endpointBuckets ?? [];
  if (buckets.length === 0) {
    return undefined;
  }
  const host = hostname.toLowerCase();
  if (host === endpointHost.toLowerCase()) {
    const bucket = buckets.find((name) => path.startsWith(`/${name}/`));
    return bucket ? path.slice(bucket.length + 2) : null;
  }
  if (
    buckets.some((name) => host === `${name}.${endpointHost}`.toLowerCase())
  ) {
    return path.slice(1);
  }
  return undefined;
};

const isSafeKey = (key: string): boolean => {
  if (
    !key ||
    key.startsWith("/") ||
    key.includes("\\") ||
    key.includes("\0") ||
    key.includes("?") ||
    key.includes("#")
  ) {
    return false;
  }
  return key
    .split("/")
    .every((part) => part !== "" && part !== "." && part !== "..");
};

/** Return the object key, or `null` when the value is not one of ours. */
export function uploadKeyFromStoredValue(
  value: unknown,
  options: UploadKeyOptions = {},
): null | string {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  if (
    !trimmed ||
    trimmed.length > MAX_VALUE_LENGTH ||
    /%2e|%2f|%5c/i.test(trimmed.split(/[?#]/u)[0] ?? "")
  ) {
    return null;
  }

  let key: string;
  if (/^https?:\/\//i.test(trimmed)) {
    let url: URL;
    try {
      url = new URL(trimmed);
    } catch {
      return null;
    }
    let path: string;
    try {
      path = decodeURIComponent(url.pathname);
    } catch {
      return null;
    }
    const endpointKey = keyFromEndpointUrl(url.hostname, path, options);
    if (endpointKey !== undefined) {
      if (endpointKey === null) {
        return null;
      }
      key = endpointKey;
    } else if (url.hostname.endsWith(".amazonaws.com")) {
      if (!isOurBucketHost(url.hostname, options.awsBucketNames ?? [])) {
        return null;
      }
      key = path.slice(1);
    } else if (
      (options.publicHosts ?? []).some(
        (host) => host.toLowerCase() === url.hostname.toLowerCase(),
      )
    ) {
      key = path.slice(1);
    } else {
      const localHosts = options.localHosts ?? ["localhost"];
      if (localHosts.every((host) => host !== url.hostname)) {
        return null;
      }
      const at = path.indexOf("/uploads/");
      if (at === -1) {
        return null;
      }
      key = path.slice(at + "/uploads/".length);
    }
  } else {
    key = trimmed;
  }

  return isSafeKey(key) ? key : null;
}

export function isPublicUploadKey(key: string): boolean {
  return key.startsWith(PUBLIC_UPLOAD_PREFIX);
}

export const DEFAULT_PUBLIC_READABLE_PREFIXES = [PUBLIC_UPLOAD_PREFIX] as const;

export function isPublicReadableKey(
  key: string,
  prefixes: readonly string[] = DEFAULT_PUBLIC_READABLE_PREFIXES,
): boolean {
  return prefixes.some((prefix) => key.startsWith(prefix));
}

/** Strip query/fragment from an upload URL. */
export function canonicalUploadValue(value: string): string {
  if (!/^https?:\/\//i.test(value)) {
    return value;
  }
  try {
    const url = new URL(value);
    url.hash = "";
    url.search = "";
    return `${url.origin}${url.pathname}`;
  } catch {
    return value;
  }
}
