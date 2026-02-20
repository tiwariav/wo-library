import { isNil } from "lodash-es";

export function isEmpty<TValue>(value: TValue) {
  return isNil(value) || value === "";
}

export function inSubArray<TArray extends [], TValue = TArray[number]>(
  array: readonly unknown[],
  value: unknown,
) {
  const typedValue = value as TValue;
  return array.includes(typedValue) ? typedValue : undefined;
}
