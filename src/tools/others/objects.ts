import { isObject } from "lodash-es";

export function pushOrCreate<V>(
  object: Record<any, V[]>,
  key: string | number,
  value: V,
  index?: string | number
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
  [name: string]: any | RecInterface;
}

export function getNestedValue(
  data: Record<any, RecInterface>,
  key: string
): RecInterface | RecInterface[] {
  const keys = Object.keys(data);
  let response: RecInterface[] = [];
  if (keys && !keys.includes(key)) {
    for (const value of Object.values(data)) {
      if (!isObject(value)) continue;
      const child_response = getNestedValue(value as RecInterface, key);
      response = Array.isArray(child_response)
        ? [...response, ...(child_response as RecInterface[])]
        : [...response, child_response];
    }
    return response;
  }
  return data[key];
}
