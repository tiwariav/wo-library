export type ThemeVariants = Record<string, string>;

export type SectionThemes = Record<string, string>;

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
