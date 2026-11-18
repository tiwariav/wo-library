/**
 * Shape unknown errors into log-safe plain objects (no request config/bodies).
 */

import { isError, isNil, isNumber, isObject, isString } from "lodash-es";

const MAX_DEPTH = 5;

export interface SafeErrorShape {
  code?: string;
  message: string;
  name?: string;
  status?: number;
}

interface Httpish {
  code?: unknown;
  config?: { method?: unknown; url?: unknown };
  message?: unknown;
  name?: unknown;
  response?: { status?: unknown };
  stack?: unknown;
  status?: unknown;
  statusCode?: unknown;
}

/** Origin + pathname only; strips userinfo, query, and fragment. */
export function safeUrl(url: string): string {
  const placeholder = "[unparseable url]";
  try {
    if (/^[a-z][\d+.a-z-]*:/i.test(url)) {
      const parsed = new URL(url);
      return (parsed.protocol === "http:" || parsed.protocol === "https:") &&
        parsed.host
        ? `${parsed.origin}${parsed.pathname}`
        : placeholder;
    }
    return new URL(url, "https://placeholder.invalid").pathname;
  } catch {
    return placeholder;
  }
}

/** Compact shape for logging. */
export function safeError(err: unknown): SafeErrorShape {
  if (isError(err)) {
    const httpish = err as Error & Httpish;
    const status =
      httpish.response?.status ?? httpish.status ?? httpish.statusCode;
    return {
      code: isString(httpish.code) ? httpish.code : undefined,
      message: err.message,
      name: err.name,
      status: isNumber(status) ? status : undefined,
    };
  }
  return { message: String(err) };
}

/** Allowlisted serializer for log pipelines (recursive on cause/errors). */
export function safeErrSerializer(
  err: unknown,
  depth = 0,
): Record<string, unknown> {
  if (isNil(err) || !isObject(err)) {
    return { message: String(err), type: "Error" };
  }
  const source = err as Httpish & {
    cause?: unknown;
    errors?: unknown;
  };
  const out: Record<string, unknown> = {
    message: isString(source.message) ? source.message : "",
    type: isString(source.name) ? source.name : "Error",
  };
  if (isString(source.stack)) {
    out.stack = source.stack;
  }
  if (isString(source.code) || isNumber(source.code)) {
    out.code = source.code;
  }
  const status = source.response?.status ?? source.status ?? source.statusCode;
  if (isNumber(status)) {
    out.status = status;
  }
  if (isString(source.config?.method)) {
    out.method = source.config.method.toUpperCase();
  }
  if (isString(source.config?.url)) {
    out.url = safeUrl(source.config.url);
  }
  if (depth < MAX_DEPTH) {
    if (source.cause && isObject(source.cause)) {
      out.cause = safeErrSerializer(source.cause, depth + 1);
    }
    if (Array.isArray(source.errors)) {
      out.errors = source.errors.map((item) =>
        safeErrSerializer(item, depth + 1),
      );
    }
  }
  return out;
}
