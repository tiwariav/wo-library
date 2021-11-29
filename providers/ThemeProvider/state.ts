export interface ThemeState {
  themeOptions: { [name: string]: string };
  activeThemeClassName: string;
}

const INITIAL_THEME_STATE: ThemeState = {
  themeOptions: {},
  activeThemeClassName: "default",
};

export default INITIAL_THEME_STATE;
