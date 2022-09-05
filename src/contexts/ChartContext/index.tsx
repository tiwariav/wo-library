import { ReactNode, useMemo } from "react";
import useMethods, { WrappedMethods } from "../../hooks/useMethods.js";
import { createAndUseContext } from "../utils.js";
import createChartMethods from "./methods.js";
import INITIAL_CHART_STATE, { ChartState } from "./state.js";

interface ChartProviderProps {
  children: ReactNode;
  data: ChartState;
}

const { Context, DispatchContext, useContextState, useContextDispatch } =
  createAndUseContext<
    ChartState,
    WrappedMethods<ReturnType<typeof createChartMethods>>
  >();

export function ChartProvider({ children, data }: ChartProviderProps) {
  const memoizedInitialState = useMemo(
    () => ({ ...INITIAL_CHART_STATE, ...data }),
    [data]
  );
  const [state, dispatch] = useMethods(
    createChartMethods,
    memoizedInitialState
  );

  return (
    <DispatchContext.Provider value={dispatch}>
      <Context.Provider value={state}>{children}</Context.Provider>
    </DispatchContext.Provider>
  );
}

export { useContextState, useContextDispatch };
