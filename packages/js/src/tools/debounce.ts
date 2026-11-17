/**
 * Returns a debounced wrapper that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last call.
 */
export function debounce<TArgs extends unknown[]>(
  func: (...args: TArgs) => void,
  wait: number,
): (...args: TArgs) => void {
  let timeout: null | ReturnType<typeof setTimeout> = null;
  return (...args: TArgs) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}
