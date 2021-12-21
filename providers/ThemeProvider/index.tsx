import { createSimpleProvider } from "../createProvider";
import createThemeMethods from "./methods";
import INITIAL_THEME_STATE, { ThemeState } from "./state";

interface ThemeDispatch {
  ThemeMethods: ReturnType<typeof createThemeMethods>;
}

const simpleContextProvider = createSimpleProvider<ThemeState, ThemeDispatch>({
  createMethods: createThemeMethods,
  initialState: INITIAL_THEME_STATE,
});

export default simpleContextProvider;
