export function plularize(
  word: string,
  number: number,
  { plural, pluralSuffix }: { plural: string; pluralSuffix: string }
): string {
  if (number && number > 1) {
    return plural || word + pluralSuffix;
  }
  return word;
}
