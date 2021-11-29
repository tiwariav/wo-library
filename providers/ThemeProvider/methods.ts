import { ThemeState } from "./state";

export default function createThemeMethods(state: ThemeState) {
  return {
    setThemeClassName: (themeClassName) => {
      return { ...state, activeThemeClassName: themeClassName };
    },
    setThemeName: (themeName) => {
      return { ...state, activeThemeClassName: state.themeOptions[themeName] };
    },
    setThemeOptions: (themeOptions) => {
      return { ...state, themeOptions };
    },
  };
}
