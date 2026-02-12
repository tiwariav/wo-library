import type { ReactNode } from "react";

import { produce } from "immer";
import { createContext, useContext, useMemo } from "react";

import type { ActionRecord } from "../hooks/useMethods.js";

export interface ContextDispatch<
  TRecord extends ActionRecord<TState>,
  TState = unknown,
> {
  dispatch: {
    [key in keyof TRecord]: (...payload: Parameters<TRecord[key]>) => void;
  };
}

export function createAndUseContext<TState, TDispatch>() {
  const StateContext = createContext({} as TState);
  const MethodContext = createContext({} as TDispatch);

  const useContextState = () => useContext(StateContext);
  const useContextMethods = () => useContext(MethodContext);

  return { MethodContext, StateContext, useContextMethods, useContextState };
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

export const getUpdateStateMethod =
  <TState extends object>(state: TState) =>
  (data: Partial<TState>) => {
    return produce(state, (draft) => {
      void Object.assign(draft, data);
    });
  };

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
