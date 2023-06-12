import { Reducer, useMemo, useReducer } from "react";

type Action = {
  payload: any[];
  type: string;
};

type CreateMethods<M, T> = (state: T) => M;

export type FunctionRecord = Record<string, (...args: any[]) => any>;

export type WrappedMethods<M extends FunctionRecord> = {
  [P in keyof M]: (...payload: Parameters<M[P]>) => void;
};

export default function useMethods<
  M extends Record<string, (...args: any[]) => T>,
  T
>(createMethods: CreateMethods<M, T>, initialState: T): [T, WrappedMethods<M>] {
  const reducer = useMemo<Reducer<T, Action>>(
    () => (reducerState: T, action: Action) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return createMethods(reducerState)[action.type](...action.payload);
    },
    [createMethods]
  );

  const [state, dispatch] = useReducer<Reducer<T, Action>>(
    reducer,
    initialState
  );

  const wrappedMethods: WrappedMethods<M> = useMemo(() => {
    const actionTypes = Object.keys(createMethods(initialState));
    const response = {} as WrappedMethods<M>;
    for (const type of actionTypes) {
      response[type as keyof M] = (...payload) => dispatch({ payload, type });
    }
    return response;
  }, [createMethods, initialState]);

  return [state, wrappedMethods];
}
