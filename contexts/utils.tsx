import { createContext, useContext } from "react";

export function createAndUseContext<TState, TDispatch>() {
  const Context = createContext<TState>({} as TState);
  const DispatchContext = createContext<TDispatch>({} as TDispatch);

  const useContextState = () => useContext(Context);
  const useContextDispatch = () => useContext(DispatchContext);

  return { Context, DispatchContext, useContextState, useContextDispatch };
}
