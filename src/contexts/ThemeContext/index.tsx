import type { ReactNode } from "react";

import { useMemo } from "react";

import type { ContextDispatch } from "../utils.js";
import type { ThemeMethods } from "./methods.js";
import type { ThemeState, ThemeVariants } from "./state.js";

import useMethods from "../../hooks/useMethods.js";
import { createAndUseContext, useSimpleProvider } from "../utils.js";
import createThemeMethods from "./methods.js";
import INITIAL_THEME_STATE from "./state.js";

interface ThemeProviderProps {
  activeThemeName?: string;
  children: ReactNode;
  themeVariants: ThemeVariants;
}

const { MethodContext, StateContext, useContextMethod, useContextState } =
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

  return useSimpleProvider(StateContext, MethodContext, {
    children,
    dispatch,
    state: contextValue,
  });
}

export { useContextMethod, useContextState };
