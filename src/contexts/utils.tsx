import { createContext, useContext } from "react";

import { FunctionRecord, WrappedMethods } from "../hooks/useMethods.js";

export interface Dispatch<Methods extends FunctionRecord> {
  dispatch: WrappedMethods<Methods>;
}

export interface LoadingDispatch<Methods extends FunctionRecord>
  extends Dispatch<Methods> {
  loadingDispatch: WrappedMethods<Methods>;
}

export function createAndUseContext<TypeState, TypeDispatch>() {
  const Context = createContext<TypeState>({} as TypeState);
  const DispatchContext = createContext<TypeDispatch>({} as TypeDispatch);

  const useContextState = () => useContext(Context);
  const useContextDispatch = () => useContext(DispatchContext);

  return { Context, DispatchContext, useContextDispatch, useContextState };
}
