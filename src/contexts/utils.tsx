import { createContext, useContext } from "react";

import { ActionRecord } from "../hooks/useMethods.js";

export interface ContextDispatch<
  TRecord extends ActionRecord<TState>,
  TState = any,
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
  TDispatch extends ContextDispatch<any>,
  TMethod extends TDispatch["dispatch"][keyof TDispatch["dispatch"]],
>(
  dispatch: TDispatch["dispatch"],
  method: TMethod,
  ...args: Parameters<TMethod>
) {
  dispatch.setLoading(true);
  const response = method(...args);
  dispatch.setLoading(true);
  return response;
}
