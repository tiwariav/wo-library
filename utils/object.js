import { reduce } from "lodash-es";

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

export function pushOrCreate(obj, key, value, index) {
  if (!obj[key]) {
    return [value];
  }
  const newVal = [...obj[key]];
  if (index !== undefined) {
    newVal[index] = value;
  } else {
    newVal.push(value);
  }
  return newVal;
}
