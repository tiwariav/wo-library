/**
 * Generates an array of numbers from `start` to `stop` (inclusive) with a given `step`.
 *
 * @param start - The starting value of the range
 * @param stop - The ending value of the range (inclusive)
 * @param step - The increment between each value
 * @returns An array of numbers from start to stop
 *
 * @example
 * ```typescript
 * range(1, 5, 1);   // [1, 2, 3, 4, 5]
 * range(0, 10, 2);  // [0, 2, 4, 6, 8, 10]
 * range(0, 1, 0.5); // [0, 0.5, 1]
 * ```
 */
export function range(start: number, stop: number, step: number) {
  return Array.from(
    { length: (stop - start) / step + 1 },
    (_, index) => start + index * step,
  );
}

/**
 * Adds an object to an array or updates it if an object with the same key value already exists.
 * Returns a new array without mutating the original.
 *
 * @param array - The source array of objects
 * @param object - The object to add or update
 * @param key - The property name to match objects by
 * @returns A new array with the object added or updated
 *
 * @example
 * ```typescript
 * const items = [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }];
 *
 * addOrUpdate(items, { id: 2, name: "Bobby" }, "id");
 * // [{ id: 1, name: "Alice" }, { id: 2, name: "Bobby" }]
 *
 * addOrUpdate(items, { id: 3, name: "Charlie" }, "id");
 * // [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }, { id: 3, name: "Charlie" }]
 * ```
 */
export function addOrUpdate(
  array: Record<string, unknown>[],
  object: Record<string, unknown>,
  key: string,
) {
  const newArray = [...array];
  const existingIndex = newArray.findIndex((item) => item[key] === object[key]);
  if (existingIndex >= 0) {
    newArray[existingIndex] = { ...object };
  } else {
    newArray.push(object);
  }
  return newArray;
}
