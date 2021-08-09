import { createContext, useContext, useMemo } from "react";
import { useMethods } from "react-use";
import createChartMethods from "./methods";
import INITIAL_CHART_STATE from "./state";

const ChartContext = createContext();
const ChartDispatchContext = createContext();

function ChartProvider({ children, data }) {
  const initialState = useMemo(
    () => ({ ...INITIAL_CHART_STATE, ...data }),
    [data]
  );
  const [state, chartMethods] = useMethods(createChartMethods, initialState);

  const dispatch = useMemo(() => ({ chartMethods }), [chartMethods]);

  return (
    <ChartContext.Provider value={state}>
      <ChartDispatchContext.Provider value={dispatch}>
        {children}
      </ChartDispatchContext.Provider>
    </ChartContext.Provider>
  );
}

const useChartState = () => useContext(ChartContext);
const useChartDispatch = () => useContext(ChartDispatchContext);

export { ChartProvider, useChartState, useChartDispatch };
