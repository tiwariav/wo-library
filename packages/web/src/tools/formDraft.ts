/* eslint-disable @typescript-eslint/no-magic-numbers, max-statements -- draft TTL / quiet window */
/**
 * Half-filled create-form drafts in localStorage (JSON only; no files).
 */

import { isNil, isNumber, isObject, isString } from "lodash-es";

export interface DraftEnvelope<T> {
  savedAt: number;
  values: Partial<T>;
}

const DEFAULT_PREFIX = "app:draft:v1:";
/** Drafts older than this are dropped on read. */
export const DRAFT_TTL_MS = 3 * 24 * 60 * 60 * 1000;
const SAVED_QUIET_MS = 3000;

export function draftKey(
  scope: string,
  formKey: string,
  prefix = DEFAULT_PREFIX,
): string {
  return `${prefix}${scope}:${formKey}`;
}

const storage = (): null | Storage => {
  try {
    return typeof window === "undefined" ? null : globalThis.localStorage;
  } catch {
    return null;
  }
};

export function readDraft<T>(
  key: string,
  now: number = Date.now(),
): DraftEnvelope<T> | null {
  const store = storage();
  if (!store) {
    return null;
  }
  try {
    const raw = store.getItem(key);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as null | Partial<DraftEnvelope<T>>;
    if (
      !parsed ||
      !isNumber(parsed.savedAt) ||
      !parsed.values ||
      !isObject(parsed.values) ||
      now - parsed.savedAt > DRAFT_TTL_MS
    ) {
      store.removeItem(key);
      return null;
    }
    return { savedAt: parsed.savedAt, values: parsed.values };
  } catch {
    return null;
  }
}

const savedKeys = new Map<string, number>();

/** Test seam: clear after-save quiet windows. */
export function resetSavedGuards(): void {
  savedKeys.clear();
}

export function writeDraft<T>(
  key: string,
  values: Partial<T>,
  now: number = Date.now(),
): void {
  if ((savedKeys.get(key) ?? 0) > now) {
    return;
  }
  try {
    storage()?.setItem(key, JSON.stringify({ savedAt: now, values }));
  } catch {
    /* quota / blocked */
  }
}

export function clearDraft(
  key: string,
  options: { afterSave?: boolean } = {},
): void {
  if (options.afterSave) {
    savedKeys.set(key, Date.now() + SAVED_QUIET_MS);
  }
  try {
    storage()?.removeItem(key);
  } catch {
    /* ignore */
  }
}

export function omitFields<T extends object>(
  values: T,
  omit: readonly string[] = [],
): Partial<T> {
  if (omit.length === 0) {
    return values;
  }
  return Object.fromEntries(
    Object.entries(values).filter(([key]) => !omit.includes(key)),
  ) as Partial<T>;
}

const isEmptyValue = (value: unknown): boolean =>
  isNil(value) ||
  value === "" ||
  value === false ||
  (isNumber(value) && Number.isNaN(value)) ||
  (isString(value) && value.trim() === "") ||
  (Array.isArray(value) && value.length === 0);

/** Count top-level fields that differ from defaults and are non-empty. */
export function changedFieldCount(
  values: object,
  defaults: object = {},
): number {
  const base = defaults as Record<string, unknown>;
  return Object.entries(values).filter(
    ([key, value]) =>
      !isEmptyValue(value) &&
      JSON.stringify(value) !== JSON.stringify(base[key]),
  ).length;
}
