import { isArray, isObject } from "lodash-es";

const isDataKey = <TKey extends number | string>(
  key: number | string,
  data: Record<TKey, unknown>,
): key is TKey => key in data;

/**
 * Pushes a value to an array at a given key in a record, or creates a new array if the key doesn't exist.
 * If `index` is provided, replaces the value at that position instead of pushing.
 *
 * @param params - Object containing data record, key, value, and optional index
 * @param params.data - The record containing arrays
 * @param params.key - The key to look up in the record
 * @param params.value - The value to push or insert
 * @param params.index - Optional index to replace at instead of pushing
 * @returns A new array with the value added or replaced
 *
 * @example
 * ```typescript
 * const data = { fruits: ["apple", "banana"] };
 *
 * pushOrCreate({ data, key: "fruits", value: "cherry" });
 * // ["apple", "banana", "cherry"]
 *
 * pushOrCreate({ data, key: "veggies", value: "carrot" });
 * // ["carrot"]
 *
 * pushOrCreate({ data, key: "fruits", value: "mango", index: 0 });
 * // ["mango", "banana"]
 * ```
 */
export function pushOrCreate<TValue, TKey extends number | string>({
  data,
  index,
  key,
  value,
}: {
  data: Record<TKey, TValue[]>;
  index?: number;
  key: string;
  value: TValue;
}) {
  if (!isDataKey(key, data)) {
    return [value];
  }
  const newValue = [...data[key]];
  if (index === undefined) {
    newValue.push(value);
  } else {
    newValue[index] = value;
  }
  return newValue;
}

/**
 * Recursively searches a nested object for all values matching a given key.
 * Returns the direct value if the key exists at the top level, otherwise
 * collects all matching values from nested objects.
 *
 * @typeParam TResponse - The expected type of the returned value(s)
 * @param data - The object to search through
 * @param key - The key to search for
 * @returns The value at the key, or an array of all matching values found recursively
 *
 * @example
 * ```typescript
 * const data = {
 *   user: { name: "Alice", address: { city: "Mumbai" } },
 *   company: { address: { city: "Delhi" } },
 * };
 *
 * getNestedValue(data, "city");  // ["Mumbai", "Delhi"]
 * getNestedValue(data, "name");  // ["Alice"]
 * ```
 */
export function getNestedValue<TResponse = string>(
  data: Record<string, unknown>,
  key: string,
): TResponse | TResponse[] {
  const keys = Object.keys(data);
  let response: TResponse[] = [];
  if (!keys.includes(key)) {
    for (const value of Object.values(data)) {
      if (!isObject(value)) {
        continue;
      }
      const childResponse = getNestedValue<TResponse>(
        value as Record<string, unknown>,
        key,
      );
      response = isArray(childResponse)
        ? [...response, ...childResponse]
        : [...response, childResponse];
    }
    return response;
  }
  return data[key] as TResponse;
}
