import type { RefObject } from "react";

import { isArray, isFunction, isObject } from "lodash-es";
import { useCallback, useRef } from "react";

/**
 * Merges one or more forwarded refs into a single internal ref.
 *
 * Useful when a component needs its own ref while also forwarding one
 * (or multiple) refs from the parent.
 *
 * @param propRef - A single forwarded ref, an array of forwarded refs, or `undefined`.
 * @returns An object with `innerRef` (the internal `MutableRefObject`) and
 *   `setInnerRef` (a callback ref that updates all provided refs).
 *
 * @example
 * ```tsx
 * const MyInput = forwardRef<HTMLInputElement>((props, ref) => {
 *   const { innerRef, setInnerRef } = usePropRef(ref);
 *   return <input ref={setInnerRef} {...props} />;
 * });
 * ```
 */
export default function usePropRef<TElement = Node>(
  propRef:
    | React.ForwardedRef<TElement>
    | React.ForwardedRef<TElement>[]
    | undefined,
) {
  const innerRef = useRef<TElement | null>(null);
  const setInnerRef = useCallback(
    (node: TElement | null) => {
      const refs = isArray(propRef) ? propRef : [propRef];
      for (const ref of refs) {
        if (ref) {
          if (isFunction(ref)) {
            ref(node);
          } else if (isObject(ref)) {
            (ref as { current: TElement | null }).current = node;
          }
        }
      }
      (innerRef as { current: TElement | null }).current = node;
    },
    [propRef],
  );

  return { innerRef, setInnerRef };
}
