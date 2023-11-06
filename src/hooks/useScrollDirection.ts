import { RefObject, useEffect } from "react";
import { useRafState } from "react-use";
import { isBrowser, off, on } from "react-use/lib/misc/util.js";

type DirectionState = {
  direction: "" | "down" | "up";
  x: number;
  y: number;
};

export default function useScrollDirection(ref?: RefObject<HTMLElement>) {
  const [state, setState] = useRafState<DirectionState>(() => ({
    direction: "",
    x: isBrowser && !ref ? window.scrollX : 0,
    y: isBrowser && !ref ? window.scrollY : 0,
  }));

  useEffect(() => {
    const current = ref?.current;
    const handler = () => {
      setState((previousState) => {
        let x = 0,
          y = 0;
        if (current) {
          x = current.scrollLeft;
          y = current.scrollTop;
        } else {
          x = window.scrollX;
          y = window.scrollY;
        }

        const diff = y - previousState.y;
        const direction =
          diff > 0 ? "down" : diff < 0 ? "up" : previousState.direction;
        return { direction, x, y };
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
