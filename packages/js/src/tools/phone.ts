/** Offset between uppercase ASCII and regional indicator symbols. */
const FLAG_EMOJI_OFFSET = 127_397;

/**
 * Converts an ISO 3166-1 alpha-2 country code to a flag emoji.
 *
 * @param countryCode - Two-letter country code (e.g. `"IN"`, `"US"`).
 * @returns The corresponding flag emoji string.
 *
 * @example
 * ```typescript
 * getFlagEmoji("IN"); // "🇮🇳"
 * getFlagEmoji("US"); // "🇺🇸"
 * ```
 */
export function getFlagEmoji(countryCode: string): string {
  return countryCode
    .toUpperCase()
    .replaceAll(/./g, (char) =>
      String.fromCodePoint((char.codePointAt(0) as number) + FLAG_EMOJI_OFFSET),
    );
}
