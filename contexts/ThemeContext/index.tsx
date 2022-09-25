import React, { ReactNode, useMemo } from "react";
import useMethods from "../../hooks/useMethods";
import { createAndUseContext, Dispatch } from "../utils";
import createThemeMethods from "./methods";
import INITIAL_THEME_STATE, { ThemeState, ThemeVariants } from "./state";

interface ThemeProviderProps {
  children: ReactNode;
  themeVariants: ThemeVariants;
}

const { Context, DispatchContext, useContextState, useContextDispatch } =
  createAndUseContext<
    ThemeState,
    Dispatch<ReturnType<typeof createThemeMethods>>
  >();

export function ThemeProvider({ children, themeVariants }: ThemeProviderProps) {
  const memoizedInitialState = useMemo(
    () => ({ ...INITIAL_THEME_STATE, themeVariants }),
    [themeVariants]
  );
  const [state, dispatch] = useMethods(
    createThemeMethods,
    memoizedInitialState
  );

  const contextValue = useMemo(
    () => ({
      ...state,
      activeThemeClassName: state.sectionThemes[state.activeThemeName],
    }),
    [state]
  );

  return (
    <DispatchContext.Provider value={{ dispatch }}>
      <Context.Provider value={contextValue}>{children}</Context.Provider>
    </DispatchContext.Provider>
  );
}

export { useContextState, useContextDispatch };