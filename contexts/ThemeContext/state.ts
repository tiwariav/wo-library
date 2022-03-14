export interface ThemeOptions {
  [name: string]: string;
}

export interface SectionThemes {
  [sectionName: string]: string;
}

export interface ThemeState {
  themeOptions: ThemeOptions;
  sectionThemes: SectionThemes;
  activeThemeClassName: string;
}

const INITIAL_THEME_STATE: ThemeState = {
  themeOptions: {},
  sectionThemes: {},
  activeThemeClassName: "",
};

export default INITIAL_THEME_STATE;
