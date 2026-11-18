/** Name normalisation for duplicate detection. */

/** Trim, lower-case, and collapse runs of whitespace. */
export function normalisedName(name: string): string {
  return name.trim().toLowerCase().replaceAll(/\s+/g, " ");
}

/**
 * SQL expression mirroring {@link normalisedName} for a column identifier.
 * Callers must pass a trusted column name (not user input).
 */
export function normalisedNameSql(column: string): string {
  return String.raw`lower(regexp_replace(btrim(${column}), '\s+', ' ', 'g'))`;
}

/**
 * Appends `" (2)"`, `" (3)"`, … until the candidate is not in `existing`
 * (compared via {@link normalisedName}).
 */
export function uniqueName(
  desired: string,
  existing: Iterable<string>,
): string {
  const taken = new Set(
    [...existing].map((name) => normalisedName(name)).filter(Boolean),
  );
  const base = desired.trim() || "Untitled";
  if (!taken.has(normalisedName(base))) {
    return base;
  }
  let index = 2;
  for (;;) {
    const candidate = `${base} (${index})`;
    if (!taken.has(normalisedName(candidate))) {
      return candidate;
    }
    index += 1;
  }
}
