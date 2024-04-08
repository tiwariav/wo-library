import type { ReactNode } from "react";

import { useMemo } from "react";

import type { ContextDispatch } from "../utils.js";
import type { ChartState } from "./state.js";

import useMethods from "../../hooks/useMethods.js";
import { createAndUseContext } from "../utils.js";
import createChartMethods from "./methods.js";
import INITIAL_CHART_STATE from "./state.js";

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

  const memoDispatch = useMemo(() => ({ dispatch }), [dispatch]);

  return (
    <DispatchContext.Provider value={memoDispatch}>
      <Context.Provider value={state}>{children}</Context.Provider>
    </DispatchContext.Provider>
  );
}

export { useContextDispatch, useContextState };
