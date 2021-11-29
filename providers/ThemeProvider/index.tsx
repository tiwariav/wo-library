import clsx from "clsx";
import React, { useContext, useMemo } from "react";
import { useMethods } from "react-use";
import createThemeMethods from "./methods";
import INITIAL_THEME_STATE, { ThemeState } from "./state";

interface ThemeDispatch {
  ThemeMethods: ReturnType<typeof createThemeMethods>;
}

interface ThemeProviderProps extends ThemeState {
  children: React.ReactNode;
}

const ThemeContext = React.createContext<ThemeState>({} as ThemeState);
const ThemeDispatchContext = React.createContext<ThemeDispatch>(
  {} as ThemeDispatch
);

function ThemeProvider({ children, ...state }: ThemeProviderProps) {
  const initialState = useMemo(
    () => ({ ...INITIAL_THEME_STATE, ...state }),
    [state]
  );
  const [themeState, themeMethods] = useMethods(
    createThemeMethods,
    initialState
  );

  const dispatch = useMemo(() => ({ themeMethods }), [themeMethods]);

  return (
    <ThemeDispatchContext.Provider value={dispatch}>
      <ThemeContext.Provider value={themeState}>
        <div className={clsx(themeState.activeThemeClassName)}>{children}</div>
      </ThemeContext.Provider>
    </ThemeDispatchContext.Provider>
  );
}

const useThemeState = () => useContext(ThemeContext);
const useThemeDispatch = () => useContext(ThemeDispatchContext);

export { ThemeProvider, useThemeState, useThemeDispatch };
