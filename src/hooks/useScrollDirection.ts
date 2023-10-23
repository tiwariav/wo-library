import { RefObject, useEffect, useRef } from "react";
import { useRafState } from "react-use";
import { isBrowser, off, on } from "react-use/lib/misc/util.js";

export default function useScrollDirection(ref?: RefObject<HTMLElement>) {
  const [state, setState] = useRafState(() => ({
    direction: "",
    x: isBrowser && !ref ? window.scrollX : 0,
    y: isBrowser && !ref ? window.scrollY : 0,
  }));

  const scrollRef = useRef(0);

  useEffect(() => {
    const current = ref?.current;
    const handler = () => {
      setState((state) => {
        let x = 0,
          y = 0;
        if (current) {
          x = current.scrollLeft;
          y = current.scrollTop;
        } else {
          x = window.scrollX;
          y = window.scrollY;
        }
        if (state.x !== x || state.y !== y) {
          const direction = y - scrollRef.current > 0 ? "down" : "up";
          scrollRef.current = y;
          return { direction, x, y };
        }
        return state;
      });
    };

    //We have to update window scroll at mount, before subscription.
    //Window scroll may be changed between render and effect handler.
    handler();

    on(current || window, "scroll", handler, {
      capture: false,
      passive: true,
    });

    return () => {
      off(current || window, "scroll", handler);
    };
  }, [ref, setState]);

  return state;
}
