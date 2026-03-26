import { useEffect, useRef } from "react";

/**
 * Hook that triggers a callback when a click is detected outside the target element.
 *
 * @param callback - Function to call on outside click.
 * @returns A ref to be attached to the target element.
 *
 * @example
 * ```tsx
 * const ref = useClickAway(() => setIsOpen(false));
 * <div ref={ref}>Dropdown content</div>
 * ```
 */
export default function useClickAway<T extends HTMLElement>(
  callback: (event: MouseEvent | TouchEvent) => void,
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handler = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      callback(event);
    };

    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [callback]);

  return ref;
}
