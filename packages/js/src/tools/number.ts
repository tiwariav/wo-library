import { isFinite, isNil, isNumber, isString } from "lodash-es";

/**
 * Converts a string or number value to a number. Strips commas from string values.
 *
 * @param value - The value to convert
 * @param nanValue - Value to return if the conversion results in NaN
 * @returns The parsed number, or `nanValue` if parsing fails
 *
 * @example
 * ```typescript
 * stringToNumber("1,234.56");       // 1234.56
 * stringToNumber(42);               // 42
 * stringToNumber("abc", null);      // null
 * stringToNumber("abc", 0);         // 0
 * ```
 */
export function stringToNumber(value: number | string, nanValue?: NumberLike) {
  if (isNumber(value)) {
    return value;
  }
  const number = Number.parseFloat(
    isString(value) ? value.replaceAll(",", "") : value,
  );
  if (Number.isNaN(number)) {
    return nanValue;
  }
  return number;
}

/** Options for {@link formatNumber}. */
export interface FormatNumberOptions extends Intl.NumberFormatOptions {
  /** Number of decimal places (default: 2). Sets both min and max fraction digits. */
  fractionDigits?: number;
  /** Value to return when input is invalid (default: ""). */
  nullValue?: string;
}

/**
 * Formats a number using Indian locale (en-IN) with customizable fraction digits.
 * Accepts both number and string inputs. Strings with commas are parsed automatically.
 *
 * @param value - The number or numeric string to format
 * @param options - Formatting options
 * @returns Formatted number string, or `nullValue` if input is invalid
 *
 * @example
 * ```typescript
 * formatNumber(1234567);                          // "12,34,567.00"
 * formatNumber(1234567, { fractionDigits: 0 });    // "12,34,567"
 * formatNumber("1,234.567");                       // "1,234.57"
 * formatNumber("invalid");                         // ""
 * formatNumber("invalid", { nullValue: "N/A" });   // "N/A"
 * ```
 */
export function formatNumber(
  value: number | string,
  {
    fractionDigits = 2,
    maximumFractionDigits,
    minimumFractionDigits,
    nullValue = "",
    ...options
  }: FormatNumberOptions = {},
) {
  const number = stringToNumber(value, nullValue);
  if (!isFinite(number) || isNil(number)) {
    return nullValue;
  }
  const adjustedMinFractionDigits = Math.max(
    minimumFractionDigits ?? maximumFractionDigits ?? fractionDigits,
    isString(value) && value.endsWith(".") ? 1 : 0,
  );
  return number.toLocaleString("en-IN", {
    maximumFractionDigits: Math.max(
      maximumFractionDigits ?? fractionDigits,
      adjustedMinFractionDigits,
    ),
    minimumFractionDigits: adjustedMinFractionDigits,
    ...options,
  });
}

/** Options for {@link formatNumberWithSuffix}. */
export interface FormatNumberSuffixOptions extends FormatNumberOptions {
  /** Force a specific suffix: "K" (thousands), "L" (lakhs), or "Cr" (crores). Auto-detected if omitted. */
  suffix?: string;
}

const CRORE = 10_000_000;
const LAKH = 100_000;
const THOUSAND = 1000;

function getSuffixString(suffix: string, parsedNumber: number) {
  let suffixString = suffix;
  let finalNumber = parsedNumber;
  if ((!suffix && Math.abs(finalNumber) >= CRORE) || suffix === "Cr") {
    finalNumber /= CRORE;
    suffixString = " Cr";
  } else if ((!suffix && Math.abs(finalNumber) >= LAKH) || suffix === "L") {
    finalNumber /= LAKH;
    suffixString = " L";
  } else if ((!suffix && Math.abs(finalNumber) >= THOUSAND) || suffix === "K") {
    finalNumber /= THOUSAND;
    suffixString = " K";
  }
  return { finalNumber, suffixString };
}

/**
 * Formats a number with an Indian-style suffix (K, L, Cr) for readability.
 * Automatically selects the appropriate suffix based on magnitude, or uses a forced suffix.
 *
 * @param value - The number or numeric string to format
 * @param options - Formatting and suffix options
 * @returns Formatted string with suffix, or `nullValue` if input is invalid
 *
 * @example
 * ```typescript
 * formatNumberWithSuffix(1500);          // "1,500.00"
 * formatNumberWithSuffix(150000);        // "1.50 L"   (Lakhs)
 * formatNumberWithSuffix(15000000);      // "1.50 Cr"  (Crores)
 * formatNumberWithSuffix(5000, { suffix: "K" }); // "5.00 K"
 * ```
 */
export function formatNumberWithSuffix(
  value: number | string,
  { nullValue = "", suffix = "", ...options }: FormatNumberSuffixOptions = {},
) {
  const parsedNumber = isNumber(value) ? value : Number.parseFloat(value);
  if (Number.isNaN(parsedNumber)) {
    return nullValue;
  }
  const { finalNumber, suffixString } = getSuffixString(suffix, parsedNumber);
  const formattedNumber = formatNumber(finalNumber, options);
  return `${formattedNumber}${suffixString}`;
}

/** A value that can represent a number: actual number, string, null, or undefined. */
export type NumberLike = null | number | string | undefined;

const CARDINAL_MAP: Record<number, string> = {
  1: "1st",
  2: "2nd",
  3: "3rd",
};

/**
 * Converts a number to its ordinal string representation (1st, 2nd, 3rd, 4th, etc.).
 *
 * @param value - The number to convert
 * @returns The ordinal string
 *
 * @example
 * ```typescript
 * ordinalNumber(1);  // "1st"
 * ordinalNumber(2);  // "2nd"
 * ordinalNumber(3);  // "3rd"
 * ordinalNumber(4);  // "4th"
 * ordinalNumber(11); // "11th"
 * ```
 */
export function ordinalNumber(value: number) {
  if (!isNumber(value)) {
    return value;
  }
  if (value in CARDINAL_MAP) {
    return CARDINAL_MAP[value];
  }
  return `${value}th`;
}
