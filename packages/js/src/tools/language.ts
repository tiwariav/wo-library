/**
 * Returns the plural form of a word based on a count.
 * Uses either a custom plural form or appends a suffix to the original word.
 *
 * @param word - The singular form of the word
 * @param number - The count to determine singular vs plural
 * @param options - Pluralization options
 * @param options.plural - A custom plural form to use (overrides suffix)
 * @param options.pluralSuffix - Suffix to append to `word` for pluralization
 * @returns The singular or plural form of the word
 *
 * @example
 * ```typescript
 * plularize("apple", 1, { plural: "", pluralSuffix: "s" });  // "apple"
 * plularize("apple", 3, { plural: "", pluralSuffix: "s" });  // "apples"
 * plularize("child", 2, { plural: "children", pluralSuffix: "" }); // "children"
 * ```
 */
export function plularize(
  word: string,
  number: number,
  { plural, pluralSuffix }: { plural: string; pluralSuffix: string },
): string {
  if (number && number > 1) {
    return plural || word + pluralSuffix;
  }
  return word;
}
