import { ReactNode, useMemo } from "react";
import useMethods, { WrappedMethods } from "../../hooks/useMethods";
import { createAndUseContext } from "../utils";
import createThemeMethods from "./methods";
import INITIAL_THEME_STATE, { ThemeState } from "./state";

interface ThemeProviderProps {
  children: ReactNode;
  data: ThemeState;
}

const { Context, DispatchContext, useContextState, useContextDispatch } =
  createAndUseContext<
    ThemeState,
    WrappedMethods<ReturnType<typeof createThemeMethods>>
  >();

export function ThemeProvider({ children, data }: ThemeProviderProps) {
  const memoizedInitialState = useMemo(
    () => ({ ...INITIAL_THEME_STATE, ...data }),
    [data]
  );
  const [state, dispatch] = useMethods(
    createThemeMethods,
    memoizedInitialState
  );

  return (
    <DispatchContext.Provider value={dispatch}>
      <Context.Provider value={state}>{children}</Context.Provider>
    </DispatchContext.Provider>
  );
}

export { useContextState, useContextDispatch };
