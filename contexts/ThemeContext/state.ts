export interface ThemeState {
  themeOptions: { [name: string]: string };
  sectionThemes: { [name: string]: string };
  activeThemeClassName: string;
}

const INITIAL_THEME_STATE: ThemeState = {
  themeOptions: {},
  sectionThemes: {},
  activeThemeClassName: "",
};

export default INITIAL_THEME_STATE;
