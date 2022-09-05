import { createContext, useContext } from "react";
import { FunctionRecord, WrappedMethods } from "../hooks/useMethods";

export interface Dispatch<Methods extends FunctionRecord> {
  dispatch: WrappedMethods<Methods>;
}

export interface LoadingDispatch<Methods extends FunctionRecord>
  extends Dispatch<Methods> {
  loadingDispatch: WrappedMethods<Methods>;
}

export function createAndUseContext<TypeState, TpyeDispatch>() {
  const Context = createContext<TypeState>({} as TypeState);
  const DispatchContext = createContext<TpyeDispatch>({} as TpyeDispatch);

  const useContextState = () => useContext(Context);
  const useContextDispatch = () => useContext(DispatchContext);

  return { Context, DispatchContext, useContextDispatch, useContextState };
}
