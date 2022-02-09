import { ReactNode, useMemo } from "react";
import { useMethods } from "react-use";
import { createAndUseContext } from "../utils";
import createThemeMethods from "./methods";
import INITIAL_THEME_STATE, { ThemeState } from "./state";

interface ThemeProviderProps {
  children: ReactNode;
  data: object;
}

const { Context, DispatchContext, useContextState, useContextDispatch } =
  createAndUseContext<ThemeState, ReturnType<typeof createThemeMethods>>();

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
