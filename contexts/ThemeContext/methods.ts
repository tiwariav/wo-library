import { ThemeOptions, ThemeState } from "./state";

export default function createThemeMethods(state: ThemeState) {
  return {
    setThemeClassName: (themeClassName: string): ThemeState => {
      return { ...state, activeThemeClassName: themeClassName };
    },
    setThemeName: (themeName: string): ThemeState => {
      return { ...state, activeThemeClassName: state.themeOptions[themeName] };
    },
    setThemeOptions: (themeOptions: ThemeOptions): ThemeState => {
      return { ...state, themeOptions };
    },
    setSectionTheme: (sectionName: string, themeName: string): ThemeState => {
      if (state.sectionThemes[sectionName] === themeName) {
        return state;
      } else {
        const sectionThemes = {
          ...state.sectionThemes,
          [sectionName]: themeName,
        };
        return { ...state, sectionThemes };
      }
    },
  };
}
