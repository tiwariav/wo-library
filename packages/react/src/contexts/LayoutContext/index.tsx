import type { ReactNode, RefObject } from "react";
import type { ContextDispatch } from "../utils";

import { useMemo, useRef } from "react";
import useMethods from "../../hooks/useMethods";
import { createAndUseContext } from "../utils";

import type { LayoutMethods } from "./methods.js";
import type { LayoutState } from "./state.js";

import createLayoutMethods from "./methods.js";
import INITIAL_LAYOUT_STATE from "./state.js";

interface LayoutProviderProps {
  children: ReactNode;
  initialState?: Partial<LayoutState>;
}

type LayoutContextState = {
  refs: {
    sideNav: RefObject<HTMLDivElement | null>;
    topNav: RefObject<HTMLDivElement | null>;
  };
} & LayoutState;

const {
  MethodContext,
  StateContext,
  useContextMethods: useLayoutMethods,
  useContextState: useLayoutState,
} = createAndUseContext<LayoutContextState, ContextDispatch<LayoutMethods>>();

function LayoutProvider({ children, initialState }: Readonly<LayoutProviderProps>) {
  const memoizedInitialState = useMemo(
    () => ({ ...INITIAL_LAYOUT_STATE, ...initialState }),
    [initialState],
  );
  const [state, dispatch] = useMethods(
    createLayoutMethods,
    memoizedInitialState,
  );

  const topNavRef = useRef<HTMLDivElement>(null);
  const sideNavRef = useRef<HTMLDivElement>(null);

  const finalState = useMemo(
    () => ({
      ...state,
      refs: {
        sideNav: sideNavRef,
        topNav: topNavRef,
      },
    }),
    [state],
  );

  const memoDispatch = useMemo(() => ({ dispatch }), [dispatch]);

  return (
    <MethodContext.Provider value={memoDispatch}>
      <StateContext.Provider value={finalState}>
        {children}
      </StateContext.Provider>
    </MethodContext.Provider>
  );
}

export { LayoutProvider, useLayoutMethods, useLayoutState };
