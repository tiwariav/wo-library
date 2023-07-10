import { isObject } from "lodash-es";

export function pushOrCreate<TValue, TKey extends number | string>(
  object: Record<TKey, TValue[]>,
  key: TKey,
  value: TValue,
  index?: number | string,
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
interface RecInterface {
  [name: string]: RecInterface | object;
}

export function getNestedValue(
  data: RecInterface | object,
  key: string,
): RecInterface | RecInterface[] {
  const keys = Object.keys(data);
  let response: RecInterface[] = [];
  if (keys && !keys.includes(key)) {
    for (const value of Object.values(data)) {
      if (!isObject(value)) continue;
      const child_response = getNestedValue(value, key);
      response = Array.isArray(child_response)
        ? [...response, ...child_response]
        : [...response, child_response];
    }
    return response;
  }
  return data[key] as RecInterface;
}
