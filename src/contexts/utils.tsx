import { createContext, useContext } from "react";

export function createAndUseContext<TypeState, TpyeDispatch>() {
  const Context = createContext<TypeState>({} as TypeState);
  const DispatchContext = createContext<TpyeDispatch>({} as TpyeDispatch);

  const useContextState = () => useContext(Context);
  const useContextDispatch = () => useContext(DispatchContext);

  return { Context, DispatchContext, useContextState, useContextDispatch };
}
