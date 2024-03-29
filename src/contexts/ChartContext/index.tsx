import { ReactNode, useMemo } from "react";

import useMethods from "../../hooks/useMethods.js";
import { ContextDispatch, createAndUseContext } from "../utils.js";
import createChartMethods from "./methods.js";
import INITIAL_CHART_STATE, { ChartState } from "./state.js";

interface ChartProviderProps {
  children: ReactNode;
}

const { Context, DispatchContext, useContextDispatch, useContextState } =
  createAndUseContext<
    ChartState,
    ContextDispatch<ReturnType<typeof createChartMethods>>
  >();

export function ChartProvider({ children }: ChartProviderProps) {
  const memoizedInitialState = useMemo(() => ({ ...INITIAL_CHART_STATE }), []);
  const [state, dispatch] = useMethods(
    createChartMethods,
    memoizedInitialState,
  );

  return (
    <DispatchContext.Provider value={{ dispatch }}>
      <Context.Provider value={state}>{children}</Context.Provider>
    </DispatchContext.Provider>
  );
}

export { useContextDispatch, useContextState };
