import { isObject } from "lodash-es";

export function pushOrCreate(
  object: Record<any, any>,
  key: string | number,
  value: any,
  index?: string | number
) {
  if (!object[key]) {
    return [value];
  }
  const newValue = [...object[key]];
  if (index !== undefined) {
    newValue[index] = value;
  } else {
    newValue.push(value);
  }
  return newValue;
}

export function getNestedValue(data: Record<any, any>, key: string) {
  const keys = Object.keys(data);
  let response = [];
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
  return data[key];
}
