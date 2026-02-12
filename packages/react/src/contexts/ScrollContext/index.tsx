import type {
  OverlayScrollbarsComponentProps,
  OverlayScrollbarsComponentRef,
} from "overlayscrollbars-react";
import type { ContextDispatch } from "wo-library/contexts/utils.js";

import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { useMemo, useRef } from "react";
import { useEffectOnce } from "react-use";
import { createAndUseContext } from "wo-library/contexts/utils.js";
import useMethods from "wo-library/hooks/useMethods.js";

import type { ScrollState } from "./state.js";

import createScrollMethods from "./methods.js";
import "./scrollContext.module.css";
import INITIAL_SCROLL_STATE from "./state.js";

interface ScrollProviderProps extends OverlayScrollbarsComponentProps {
  data?: object;
}

const {
  MethodContext,
  StateContext,
  useContextMethods: useScrollMethods,
  useContextState: useScrollState,
} = createAndUseContext<
  ScrollState,
  ContextDispatch<ReturnType<typeof createScrollMethods>>
>();

function ScrollProvider({
  children,
  className,
  data,
  ...props
}: ScrollProviderProps) {
  const overlayRef = useRef<OverlayScrollbarsComponentRef>(null);

  const [state, dispatch] = useMethods(createScrollMethods, {
    ...INITIAL_SCROLL_STATE,
    ...data,
  });

  const memoDispatch = useMemo(() => ({ dispatch }), [dispatch]);

  useEffectOnce(() => {
    dispatch.updateState({ overlayScrollbars: overlayRef.current });
  });

  return (
    <OverlayScrollbarsComponent
      className={className}
      ref={overlayRef}
      {...props}
    >
      <MethodContext.Provider value={memoDispatch}>
        <StateContext.Provider value={state}>{children}</StateContext.Provider>
      </MethodContext.Provider>
    </OverlayScrollbarsComponent>
  );
}

export { ScrollProvider, useScrollMethods, useScrollState };
