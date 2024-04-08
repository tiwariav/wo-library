import { produce } from "immer";
import { createContext, useContext } from "react";

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
  const Context = createContext({} as TState);
  const DispatchContext = createContext({} as TDispatch);

  const useContextState = () => useContext(Context);
  const useContextDispatch = () => useContext(DispatchContext);

  return { Context, DispatchContext, useContextDispatch, useContextState };
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
