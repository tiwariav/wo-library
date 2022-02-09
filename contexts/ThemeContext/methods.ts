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
    setSectionTheme: (sectionName, themeName) => {
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
