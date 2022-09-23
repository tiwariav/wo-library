import { ReactNode, useMemo } from "react";
import useMethods from "../../hooks/useMethods.js";
import { createAndUseContext, Dispatch } from "../utils.js";
import createChartMethods from "./methods.js";
import INITIAL_CHART_STATE, { ChartState } from "./state.js";

interface ChartProviderProps {
  children: ReactNode;
}

const { Context, DispatchContext, useContextState, useContextDispatch } =
  createAndUseContext<
    ChartState,
    Dispatch<ReturnType<typeof createChartMethods>>
  >();

export function ChartProvider({ children }: ChartProviderProps) {
  const memoizedInitialState = useMemo(() => ({ ...INITIAL_CHART_STATE }), []);
  const [state, dispatch] = useMethods(
    createChartMethods,
    memoizedInitialState
  );

  return (
    <DispatchContext.Provider value={{ dispatch }}>
      <Context.Provider value={state}>{children}</Context.Provider>
    </DispatchContext.Provider>
  );
}

export { useContextState, useContextDispatch };
