import type { ReactNode } from "react";

import { useMemo } from "react";

import type { ContextDispatch } from "../utils.js";
import type { ThemeMethods } from "./methods.js";
import type { ThemeState, ThemeVariants } from "./state.js";

import useMethods from "../../hooks/useMethods.js";
import { createAndUseContext } from "../utils.js";
import createThemeMethods from "./methods.js";
import INITIAL_THEME_STATE from "./state.js";

interface ThemeProviderProps {
  activeThemeName?: string;
  children: ReactNode;
  themeVariants: ThemeVariants;
}

const { Context, DispatchContext, useContextDispatch, useContextState } =
  createAndUseContext<ThemeState, ContextDispatch<ThemeMethods>>();

export function ThemeProvider({ children, themeVariants }: ThemeProviderProps) {
  const memoizedInitialState = useMemo(
    () => ({ ...INITIAL_THEME_STATE, themeVariants }),
    [themeVariants],
  );
  const [state, dispatch] = useMethods(
    createThemeMethods,
    memoizedInitialState,
  );

  const contextValue = useMemo(
    () => ({
      ...state,
      activeThemeClassName: state.sectionThemes[state.activeThemeName],
    }),
    [state],
  );

  const memoDispatch = useMemo(() => ({ dispatch }), [dispatch]);

  return (
    <DispatchContext.Provider value={memoDispatch}>
      <Context.Provider value={contextValue}>{children}</Context.Provider>
    </DispatchContext.Provider>
  );
}

export { useContextDispatch, useContextState };
