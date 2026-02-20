export function range(start: number, stop: number, step: number) {
  return Array.from(
    { length: (stop - start) / step + 1 },
    (_, index) => start + index * step,
  );
}

export function addOrUpdate(
  array: Record<string, unknown>[],
  object: Record<string, unknown>,
  key: string,
) {
  const newArray = [...array];
  const existingIndex = newArray.findIndex((item) => item[key] === object[key]);
  if (existingIndex >= 0) {
    newArray[existingIndex] = { ...object };
  } else {
    newArray.push(object);
  }
  return newArray;
}
