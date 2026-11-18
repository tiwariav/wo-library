/* eslint-disable lodash/prefer-lodash-typecheck -- keep node package lodash-free */
/**
 * Collapse framework query/param shapes (`string | string[] | …`) to strings.
 * Framework-agnostic — pass the raw value maps, not a Request object.
 */

const firstString = (value: unknown): string | undefined => {
  if (typeof value === "string") {
    return value;
  }
  if (Array.isArray(value)) {
    const head: unknown = value[0];
    return typeof head === "string" ? head : undefined;
  }
  return undefined;
};

/** Required route param as a string (empty if absent). */
export function getParam(
  params: Record<string, unknown>,
  name: string,
): string {
  return firstString(params[name]) ?? "";
}

/** Optional query value as a string. */
export function getQueryString(
  query: Record<string, unknown>,
  name: string,
): string | undefined {
  return firstString(query[name]);
}

/** All string values for a repeated query key. */
export function getQueryStringArray(
  query: Record<string, unknown>,
  name: string,
): string[] {
  const raw = query[name];
  if (typeof raw === "string") {
    return [raw];
  }
  if (Array.isArray(raw)) {
    return raw.filter((item): item is string => typeof item === "string");
  }
  return [];
}

/** Optional query value narrowed to an allowed set. */
export function getQueryEnum<T extends string>(
  query: Record<string, unknown>,
  name: string,
  allowed: readonly T[],
): T | undefined {
  const value = firstString(query[name]);
  return value !== undefined && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : undefined;
}

const AUDIT_KEYS = new Set([
  "createdBy",
  "createdById",
  "updatedBy",
  "updatedById",
]);

/** Shallow copy of a body without common audit injection fields. */
export function getCleanBody<T extends Record<string, unknown>>(
  body: null | T | undefined,
): T {
  const source = body ?? ({} as T);
  return Object.fromEntries(
    Object.entries(source).filter(([key]) => !AUDIT_KEYS.has(key)),
  ) as T;
}
