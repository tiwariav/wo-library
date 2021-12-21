import { createContext, useContext } from "react";
import { useProvider } from "../hooks";

interface ContextProviderProps<TState, TDispatch> {
  Context: React.Context<TState>;
  DispatchContext: React.Context<TDispatch>;
  children: React.ReactNode;
  dispatch: any;
  state: any;
}

export function ContextProviderComponent<TState, TDispatch>({
  Context,
  DispatchContext,
  children,
  dispatch,
  state,
}: ContextProviderProps<TState, TDispatch>) {
  return (
    <Context.Provider value={state}>
      <DispatchContext.Provider value={{ ...dispatch }}>
        {children}
      </DispatchContext.Provider>
    </Context.Provider>
  );
}

export function createAndUseContext<TState, TDispatch>() {
  const Context = createContext<TState>({} as TState);
  const DispatchContext = createContext<TDispatch>({} as TDispatch);

  const useContextState = () => useContext(Context);
  const useContextDispatch = () => useContext(DispatchContext);

  return { Context, DispatchContext, useContextState, useContextDispatch };
}

export function createSimpleProvider<TState, TDispatch>({
  createMethods,
  displayName,
  initialState,
}) {
  const { Context, DispatchContext, useContextState, useContextDispatch } =
    createAndUseContext<TState, TDispatch>();

  const ContextProvider = ({ children, data }) => {
    const [state, dispatch] = useProvider({
      createMethods,
      data: { ...initialState, ...data },
    });

    const props = { Context, DispatchContext, children, dispatch, state };

    return <ContextProviderComponent<TState, TDispatch> {...props} />;
  };
  ContextProvider.displayName = displayName;

  return { ContextProvider, useContextState, useContextDispatch };
}
