import { isObject, reduce } from "lodash-es";

export function cloneIfModified(original, update) {
  const diff = reduce(
    update,
    function (result, value, key) {
      if (original[key] !== value) result[key] = value;
      return result;
    },
    {}
  );
  for (const key in diff) {
    if (Object.prototype.hasOwnProperty.call(diff, key)) {
      return { ...original, ...diff };
    }
  }
  return original;
}

export function pushOrCreate(object, key, value, index) {
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


export function getNestedValue(data, key) {
  let keys = Object.keys(data);
  let response = [];
  if (keys && !keys.includes(key)) {
    for (const value of Object.values(data)) {
      if (!isObject(value)) continue;
      const child_response = getNestedValue(value, key);
      if (Array.isArray(child_response)) {
        response = [...response, ...child_response];
      } else {
        response = [...response, child_response];
      }
    }
    return response;
  }
  return data[key];
}
