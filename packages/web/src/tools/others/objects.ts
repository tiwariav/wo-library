import { isArray, isObject } from "lodash-es";

const isDataKey = <TKey extends number | string>(
  key: number | string,
  data: Record<TKey, unknown>,
): key is TKey => key in data;

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

export function getNestedValue<TResponse = string>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>,
  key: string,
): TResponse | TResponse[] {
  const keys = Object.keys(data);
  let response: TResponse[] = [];
  if (!keys.includes(key)) {
    for (const value of Object.values(data)) {
      if (!isObject(value)) {
        continue;
      }
      const childResponse = getNestedValue<TResponse>(value, key);
      response = isArray(childResponse)
        ? [...response, ...childResponse]
        : [...response, childResponse];
    }
    return response;
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return data[key];
}
