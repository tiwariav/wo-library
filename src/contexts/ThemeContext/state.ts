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
  themeVariants: {},
  sectionThemes: {},
  activeThemeName: "base",
};

export default INITIAL_THEME_STATE;
