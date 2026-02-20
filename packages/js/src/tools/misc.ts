/**
 * Returns a promise that resolves after the specified timeout in milliseconds.
 * Useful for adding delays in async workflows.
 *
 * @param timeout - The number of milliseconds to wait
 * @returns A promise that resolves after the timeout
 *
 * @example
 * ```typescript
 * await wait(1000); // pauses execution for 1 second
 * await wait(500);  // pauses execution for 500ms
 * ```
 */
export function wait(timeout: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}
