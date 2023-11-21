import { isArray, isObject } from "lodash-es";

export function pushOrCreate<TValue, TKey extends number | string>(
  object: Record<TKey, TValue[]>,
  key: TKey,
  value: TValue,
  index?: number,
) {
  if (!object[key]) {
    return [value];
  }
  const newValue = [...object[key]];
  if (index === undefined) {
    newValue.push(value);
  } else {
    newValue[index] = value;
  }
  return newValue;
}

export function getNestedValue<TResponse = string>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>,
  key: string,
): TResponse | TResponse[] {
  const keys = Object.keys(data);
  let response: TResponse[] = [];
  if (keys && !keys.includes(key)) {
    for (const value of Object.values(data)) {
      if (!isObject(value)) continue;
      const child_response = getNestedValue<TResponse>(value, key);
      response = isArray(child_response)
        ? [...response, ...child_response]
        : [...response, child_response];
    }
    return response;
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return data[key];
}
