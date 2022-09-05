export interface ThemeVariants {
  [name: string]: string;
}

export interface SectionThemes {
  [sectionName: string]: string;
}

export interface ThemeState {
  themeVariants: ThemeVariants;
  sectionThemes: SectionThemes;
  activeThemeName: string;
}

const INITIAL_THEME_STATE: ThemeState = {
  activeThemeName: "base",
  sectionThemes: {},
  themeVariants: {},
};

export default INITIAL_THEME_STATE;
