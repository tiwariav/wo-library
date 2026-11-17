import { isNil, isNumber, isString } from "lodash-es";

const E164_MAX_DIGITS = 15;
const LOCAL_SUBSCRIBER_DIGITS = 10;
const TRUNK_PREFIXED_LOCAL_DIGITS = 11;

/**
 * Strips non-digits. Leading `0` on an 11-digit value is dropped (common
 * national trunk prefix). Empty / nullish inputs are returned unchanged.
 */
export function normalizePhoneDigits(
  value: unknown,
): null | string | undefined {
  if (isNil(value) || value === "") {
    return isNil(value) ? value : "";
  }
  const asText = isString(value) || isNumber(value) ? String(value) : "";
  const digits = asText.replaceAll(/\D/g, "");
  if (digits.length === TRUNK_PREFIXED_LOCAL_DIGITS && digits.startsWith("0")) {
    return digits.slice(1);
  }
  return digits;
}

/**
 * Representations of one phone value for fuzzy matching across free-text stores.
 * Does not invent a country code when the input did not already carry one.
 *
 * @param defaultCountryCallingCode - Digits only (e.g. `"91"`). When the local
 *   number is 10 digits and this is set, also emits `0`/`cc`/`+cc` forms.
 */
export function phoneMatchVariants(
  value: string,
  defaultCountryCallingCode?: string,
): string[] {
  const raw = value.trim();
  const digits = raw.replaceAll(/\D/g, "");
  if (!digits) {
    return [];
  }

  const variants = new Set([raw, digits, `+${digits}`]);
  const country = defaultCountryCallingCode?.replaceAll(/\D/g, "") ?? "";
  const local =
    country &&
    digits.length === country.length + LOCAL_SUBSCRIBER_DIGITS &&
    digits.startsWith(country)
      ? digits.slice(country.length)
      : digits;

  if (local.length === LOCAL_SUBSCRIBER_DIGITS) {
    variants.add(local);
    variants.add(`0${local}`);
    if (country) {
      variants.add(`${country}${local}`);
      variants.add(`+${country}${local}`);
    }
  }
  return [...variants];
}

export interface FormatToE164Options {
  /** Digits-only country calling code used when the input is a 10-digit local number. */
  defaultCountryCallingCode?: string;
}

/**
 * Best-effort E.164 formatting. Returns `null` when the value contains letters
 * or exceeds 15 digits. Does not invent a country code unless
 * `defaultCountryCallingCode` is provided for a 10-digit (or `0`+10) local form.
 */
export function formatToE164(
  value: string,
  options: FormatToE164Options = {},
): null | string {
  if (value === "") {
    return value;
  }

  const cleaned = value.trim();
  if (/[A-Za-z]/.test(cleaned)) {
    return null;
  }

  if (cleaned.startsWith("+")) {
    const plusDigits = cleaned.slice(1).replaceAll(/\D/g, "");
    return plusDigits.length > E164_MAX_DIGITS ? null : `+${plusDigits}`;
  }

  const country =
    options.defaultCountryCallingCode?.replaceAll(/\D/g, "") ?? "";
  const digits = cleaned.replaceAll(/\D/g, "");
  if (digits.length > E164_MAX_DIGITS) {
    return null;
  }

  if (digits.length === LOCAL_SUBSCRIBER_DIGITS && country) {
    return `+${country}${digits}`;
  }

  if (
    digits.length === TRUNK_PREFIXED_LOCAL_DIGITS &&
    digits.startsWith("0") &&
    country
  ) {
    return `+${country}${digits.slice(1)}`;
  }

  if (digits.length > LOCAL_SUBSCRIBER_DIGITS) {
    return `+${digits}`;
  }

  return digits;
}
