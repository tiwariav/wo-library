/* jscpd:ignore-start */
import type { ReactNode } from "react";

import { useMemo } from "react";

import type { ContextDispatch } from "../utils.js";
import type { ChartState } from "./state.js";

import useMethods from "../../hooks/useMethods.js";
import { createAndUseContext, useSimpleProvider } from "../utils.js";
import createChartMethods from "./methods.js";
import INITIAL_CHART_STATE from "./state.js";
/* jscpd:ignore-end */

interface ChartProviderProps {
  children: ReactNode;
}

const { MethodContext, StateContext, useContextMethod, useContextState } =
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

  return useSimpleProvider(StateContext, MethodContext, {
    children,
    dispatch,
    state,
  });
}

export { useContextMethod, useContextState };
