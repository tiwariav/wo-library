/**
 * Indian digit grouping helpers for number fields: `12,34,567.5` — last three
 * digits, then pairs. Useful for display when a field is not focused.
 */

import { isNil } from "lodash-es";

const PLAIN_NUMBER = /^(-?)(\d+)(\.\d*)?$/;
const DEFAULT_EMPTY = "—";
const DEFAULT_LOCALE = "en-IN";
const INDIAN_TAIL_DIGITS = 3;
const PERCENT_SCALE = 100;

/** Values accepted by the display formatters. */
export type FormatNumberInput = null | number | string | undefined;

/** `"12,34,567.5"` → `"1234567.5"`. */
export function stripGrouping(text: string): string {
  return text.replaceAll(",", "");
}

function groupByPairs(digits: string): string {
  let result = "";
  const offset = digits.length % 2;
  if (offset > 0) {
    result = digits.slice(0, offset);
  }
  for (let index = offset; index < digits.length; index += 2) {
    if (result) {
      result += ",";
    }
    result += digits.slice(index, index + 2);
  }
  return result;
}

/**
 * Groups the integer part Indian-style. Non-plain values (empty, lone `-` or `.`,
 * half-typed text) are returned unchanged.
 */
export function groupIndian(text: string): string {
  const match = PLAIN_NUMBER.exec(stripGrouping(text));
  if (!match) {
    return text;
  }
  const sign = match[1];
  const digits = match[2];
  const fraction = match[3] || "";
  const head =
    digits.length > INDIAN_TAIL_DIGITS
      ? digits.slice(0, -INDIAN_TAIL_DIGITS)
      : "";
  const tail = digits.slice(-INDIAN_TAIL_DIGITS);
  const grouped = head ? `${groupByPairs(head)},${tail}` : tail;
  return `${sign}${grouped}${fraction}`;
}

/**
 * What a number field accepts while typing: digits, one decimal point, optional
 * leading minus. Pasted grouped or currency-prefixed values are cleaned.
 */
export function sanitizeNumberText(text: string): string {
  const stripped = stripGrouping(text).replaceAll(/[^\d.-]/g, "");
  const isNegative = stripped.startsWith("-");
  const unsigned = stripped.replaceAll("-", "");
  const dot = unsigned.indexOf(".");
  const cleaned =
    dot === -1
      ? unsigned
      : `${unsigned.slice(0, dot + 1)}${unsigned.slice(dot + 1).replaceAll(".", "")}`;
  return isNegative ? `-${cleaned}` : cleaned;
}

function asFiniteNumber(value: FormatNumberInput): null | number {
  if (isNil(value) || value === "") {
    return null;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

/** Whole-number display with Indian grouping, e.g. `"12,34,567"`. */
export function formatCount(
  value: FormatNumberInput,
  empty = DEFAULT_EMPTY,
  locale = DEFAULT_LOCALE,
): string {
  const parsed = asFiniteNumber(value);
  return parsed === null
    ? empty
    : parsed.toLocaleString(locale, { maximumFractionDigits: 0 });
}

/** Formats a whole number and optionally appends a unit suffix. */
export function formatWithUnit(
  value: FormatNumberInput,
  options: { empty?: string; locale?: string; unit?: boolean | string } = {},
): string {
  const {
    empty = DEFAULT_EMPTY,
    locale = DEFAULT_LOCALE,
    unit = true,
  } = options;
  const parsed = asFiniteNumber(value);
  if (parsed === null) {
    return empty;
  }
  const text = parsed.toLocaleString(locale, { maximumFractionDigits: 0 });
  if (unit === false) {
    return text;
  }
  const suffix = unit === true ? "km" : unit;
  return `${text} ${suffix}`;
}

/** Percentage from a whole percent value (42 → `"42%"`). */
export function formatPercent(
  value: FormatNumberInput,
  empty = DEFAULT_EMPTY,
  locale = DEFAULT_LOCALE,
): string {
  const parsed = asFiniteNumber(value);
  return parsed === null
    ? empty
    : `${parsed.toLocaleString(locale, { maximumFractionDigits: 0 })}%`;
}

/** Percentage from a fraction (0.42 → `"42%"`). */
export function formatFractionPercent(
  fraction: FormatNumberInput,
  empty = DEFAULT_EMPTY,
  locale = DEFAULT_LOCALE,
): string {
  const parsed = asFiniteNumber(fraction);
  return parsed === null
    ? empty
    : formatPercent(parsed * PERCENT_SCALE, empty, locale);
}
