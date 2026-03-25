import type { ReactNode } from "react";

import { produce } from "immer";
import { createContext, useContext, useMemo } from "react";

import type { ActionRecord } from "../hooks/useMethods.js";

/**
 * Dispatch wrapper type for contexts built with {@link createAndUseContext}.
 *
 * Wraps the methods record in a `{ dispatch }` object to keep the state and
 * methods contexts separate.
 */
export interface ContextDispatch<
  TRecord extends ActionRecord<TState>,
  TState = unknown,
> {
  dispatch: {
    [key in keyof TRecord]: (...payload: Parameters<TRecord[key]>) => void;
  };
}

/**
 * Creates a split-context pair (state + dispatch) and returns typed hooks.
 *
 * Following the recommended pattern of splitting state and dispatch into
 * separate contexts to prevent unnecessary re-renders in components that only
 * consume methods.
 *
 * @typeParam TState - The shape of the context state.
 * @typeParam TDispatch - The shape of the dispatch context value.
 * @returns `{ StateContext, MethodContext, useContextState, useContextMethods }`
 *
 * @example
 * ```tsx
 * const { StateContext, MethodContext, useContextState, useContextMethods } =
 *   createAndUseContext<MyState, ContextDispatch<MyMethods>>();
 * ```
 */
export function createAndUseContext<TState, TDispatch>() {
  const StateContext = createContext({} as TState);
  const MethodContext = createContext({} as TDispatch);

  // eslint-disable-next-line @eslint-react/component-hook-factories
  const useContextState = () => useContext(StateContext);
  // eslint-disable-next-line @eslint-react/component-hook-factories
  const useContextMethods = () => useContext(MethodContext);

  return {
    MethodContext,
    StateContext,
    useContextMethods,
    useContextState,
  };
}

export function dispatchLoading<
  TDispatch extends ContextDispatch<ActionRecord>,
  TMethod extends TDispatch["dispatch"][keyof TDispatch["dispatch"]],
>(
  dispatch: TDispatch["dispatch"],
  method: TMethod,
  ...args: Parameters<TMethod>
) {
  dispatch.setLoading(true);
  method(...args);
  dispatch.setLoading(true);
}

/**
 * Helper that produces an Immer-based state updater function for use inside
 * `useMethods` action records.
 *
 * @param state - The current state.
 * @returns A function that merges a partial state update immutably.
 */
export const getUpdateStateMethod =
  <TState extends object>(state: TState) =>
  (data: Partial<TState>) => {
    return produce(state, (draft) => {
      Object.assign(draft, data);
    });
  };

/**
 * Renders a simple two-provider tree (state + dispatch) wrapping `children`.
 *
 * @param context - The state `React.Context`.
 * @param dispatchContext - The dispatch `React.Context`.
 * @param options - `{ children, dispatch, state }` values to inject.
 */
export function useSimpleProvider<TState, TDispatch>(
  context: React.Context<TState>,
  dispatchContext: React.Context<{ dispatch: TDispatch }>,
  {
    children,
    dispatch,
    state,
  }: {
    children: ReactNode;
    dispatch: TDispatch;
    state: TState;
  },
) {
  const memoDispatch = useMemo(() => ({ dispatch }), [dispatch]);

  const Context = context;
  const DispatchContext = dispatchContext;

  return (
    <DispatchContext.Provider value={memoDispatch}>
      <Context.Provider value={state}>{children}</Context.Provider>
    </DispatchContext.Provider>
  );
}
