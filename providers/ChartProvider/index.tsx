import { createSimpleProvider } from "../createProvider";
import createChartMethods from "./methods";
import INITIAL_THEME_STATE from "./state";

const simpleContextProvider = createSimpleProvider({
  createMethods: createChartMethods,
  displayName: "ChartProvider",
  initialState: INITIAL_THEME_STATE,
});

export default simpleContextProvider;
