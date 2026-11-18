/** Tiny className joiner (no runtime deps). */
export function cn(...parts: (false | null | string | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}
