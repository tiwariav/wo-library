/**
 * Pure idempotency-key helpers (no database). Storage adapters claim keys separately.
 */

import { createHash } from "node:crypto";

export const IDEMPOTENCY_HEADER = "idempotency-key";

const KEY_PATTERN = /^[\w-]{8,128}$/;

/** Return the key when valid, otherwise `null`. */
export function parseIdempotencyKey(raw: unknown): null | string {
  // eslint-disable-next-line lodash/prefer-lodash-typecheck -- node package has no lodash
  return typeof raw === "string" && KEY_PATTERN.test(raw) ? raw : null;
}

/** JSON with object keys sorted at every level. */
export function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map((item) => canonicalJson(item ?? null)).join(",")}]`;
  }
  // eslint-disable-next-line lodash/prefer-lodash-typecheck -- node package has no lodash
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const keys = Object.keys(record)
      .filter((key) => record[key] !== undefined)
      // eslint-disable-next-line unicorn/no-array-sort -- keep ES2022-compatible for typed lib
      .sort((left, right) => left.localeCompare(right));
    const parts = keys.map(
      (key) => `${JSON.stringify(key)}:${canonicalJson(record[key])}`,
    );
    return `{${parts.join(",")}}`;
  }
  return JSON.stringify(value ?? null);
}

/** sha256 of method + path + query + canonical JSON body. */
export function hashRequest(input: {
  body?: unknown;
  method: string;
  path: string;
  query?: unknown;
}): string {
  return createHash("sha256")
    .update(
      [
        input.method.toUpperCase(),
        input.path,
        canonicalJson(input.query ?? {}),
        canonicalJson(input.body ?? null),
      ].join("\n"),
    )
    .digest("hex");
}
