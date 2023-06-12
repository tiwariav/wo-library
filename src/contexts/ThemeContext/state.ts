export interface ThemeVariants {
  [name: string]: string;
}

export interface SectionThemes {
  [sectionName: string]: string;
}

export interface ThemeState {
  activeThemeName: string;
  sectionThemes: SectionThemes;
  themeVariants: ThemeVariants;
}

const INITIAL_THEME_STATE: ThemeState = {
  activeThemeName: "base",
  sectionThemes: {},
  themeVariants: {},
};

export default INITIAL_THEME_STATE;
