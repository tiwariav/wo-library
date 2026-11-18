/** Loose text matching for fuzzy record lookup. */

/** Codes compare without spacing, dashes or case: `"BP-102 "` → `"bp102"`. */
export function normalizeCode(value: null | string | undefined): string {
  return (value ?? "").toLowerCase().replaceAll(/[^a-z0-9]/g, "");
}

function tokens(value: null | string | undefined): string[] {
  return (value ?? "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 0);
}

/**
 * Share of the smaller word set found in the larger.
 * `1` means one name's tokens are fully contained in the other.
 */
export function nameOverlap(a: string, b: string): number {
  const left = new Set(tokens(a));
  const right = new Set(tokens(b));
  if (left.size === 0 || right.size === 0) {
    return 0;
  }
  let shared = 0;
  for (const token of left) {
    if (right.has(token)) {
      shared += 1;
    }
  }
  return shared / Math.min(left.size, right.size);
}
