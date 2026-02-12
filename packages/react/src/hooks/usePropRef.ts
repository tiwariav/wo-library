import type { MutableRefObject } from "react";

import { isArray, isFunction, isObject } from "lodash-es";
import { useCallback, useRef } from "react";

export default function usePropRef<TElement = Node>(
  propRef:
    | React.ForwardedRef<TElement>
    | React.ForwardedRef<TElement>[]
    | undefined,
) {
  const innerRef: MutableRefObject<TElement | null> = useRef<TElement>(null);
  const setInnerRef = useCallback(
    (node: TElement) => {
      const refs = isArray(propRef) ? propRef : [propRef];
      for (const ref of refs) {
        if (ref) {
          if (isFunction(ref)) {
            ref(node);
          } else if (isObject(ref)) {
            ref.current = node;
          }
        }
      }
      innerRef.current = node;
    },
    [propRef],
  );

  return { innerRef, setInnerRef };
}
