import type {
  OverlayScrollbarsComponentProps,
  OverlayScrollbarsComponentRef,
} from "overlayscrollbars-react";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { useMemo, useRef } from "react";
import { useEffectOnce } from "react-use";

import useMethods from "../../hooks/useMethods";
import type { ContextDispatch } from "../utils";
import { createAndUseContext } from "../utils";

import type { ScrollState } from "./state.js";

import createScrollMethods from "./methods.js";
import "./scrollContext.module.css";
import INITIAL_SCROLL_STATE from "./state.js";

interface ScrollProviderProps extends OverlayScrollbarsComponentProps {
  data?: Partial<ScrollState>;
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
}: Readonly<ScrollProviderProps>) {
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
