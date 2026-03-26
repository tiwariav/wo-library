import { isNil } from "lodash-es";

/**
 * Checks if a value is null, undefined, or an empty string.
 *
 * @param value - The value to check
 * @returns `true` if the value is nil or an empty string
 *
 * @example
 * ```typescript
 * isEmpty(null);      // true
 * isEmpty(undefined); // true
 * isEmpty("");        // true
 * isEmpty(0);         // false
 * isEmpty("hello");   // false
 * ```
 */
export function isEmpty<TValue>(value: TValue) {
  return isNil(value) || value === "";
}

/**
 * Checks if a value exists in a readonly array and returns it with the correct type.
 * Returns `undefined` if the value is not found.
 *
 * @typeParam TArray - The tuple type of the array
 * @typeParam TValue - The element type of the array
 * @param array - The array to search in
 * @param value - The value to search for
 * @returns The typed value if found, or `undefined`
 *
 * @example
 * ```typescript
 * const sizes = ["sm", "md", "lg"] as const;
 * inSubArray(sizes, "md"); // "md"
 * inSubArray(sizes, "xl"); // undefined
 * ```
 */
export function inSubArray<TArray extends [], TValue = TArray[number]>(
  array: readonly unknown[],
  value: unknown,
) {
  const typedValue = value as TValue;
  return array.includes(typedValue) ? typedValue : undefined;
}
