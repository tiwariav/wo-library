export function plularize(word, number, { plural, pluralSuffix }) {
  if (number && number > 1) {
    return plural ? plural : word + pluralSuffix;
  }
  return word;
}
