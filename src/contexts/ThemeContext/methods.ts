import { ThemeState, ThemeVariants } from "./state.js";

export default function createThemeMethods(state: ThemeState) {
  return {
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
    setThemeName: (themeName: string): ThemeState => {
      return { ...state, activeThemeName: themeName };
    },
    setThemeVariants: (themeVariants: ThemeVariants): ThemeState => {
      return { ...state, themeVariants };
    },
  };
}

export type ThemeMethods = ReturnType<typeof createThemeMethods>;
