import type { SetStateAction } from "react";

import { isFunction } from "lodash-es";
import { useCallback, useEffect, useState } from "react";

/**
 * Hook for managing state synchronized with `localStorage`.
 *
 * @param key - The storage key.
 * @param initialValue - Initial value if none exists in storage.
 * @returns A stateful value and a function to update it.
 *
 * @example
 * ```tsx
 * const [theme, setTheme] = useLocalStorage('theme', 'light');
 * ```
 */
export default function useLocalStorage<T>(key: string, initialValue: T) {
  const getInitialValue = useCallback((): T => {
    try {
      const item = globalThis.localStorage.getItem(key);
      if (item === null) {
        return initialValue;
      }

      const parsedItem: unknown = JSON.parse(item);
      return parsedItem as T;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  }, [initialValue, key]);

  const [storedValue, setStoredValue] = useState<T>(() => {
    return getInitialValue();
  });

  const setValue = useCallback(
    (value: SetStateAction<T>) => {
      try {
        const valueToStore = isFunction(value) ? value(storedValue) : value;
        setStoredValue(valueToStore);
        globalThis.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(error);
      }
    },
    [key, storedValue],
  );

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue) {
        const parsedValue: unknown = JSON.parse(event.newValue);
        setStoredValue(parsedValue as T);
      }
    };

    globalThis.addEventListener("storage", handleStorageChange);
    return () => {
      globalThis.removeEventListener("storage", handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue] as const;
}
