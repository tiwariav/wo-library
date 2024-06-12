import { useMemo, useReducer } from "react";

export interface Action {
  payload: unknown[];
  type: string;
}

export type CreateMethods<TRecord extends ActionRecord, TState> = (
  state: TState,
) => TRecord;

export type ActionRecord<TState = unknown> = Record<
  Action["type"],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (...args: any) => TState
>;

export type WrappedMethods<TRecord extends ActionRecord> = {
  [key in keyof TRecord]: (...payload: Parameters<TRecord[key]>) => void;
};

export default function useMethods<
  TRecord extends ActionRecord<TState>,
  TState,
>(
  createMethods: CreateMethods<TRecord, TState>,
  initialState: TState,
): [TState, WrappedMethods<TRecord>] {
  const reducer = useMemo(
    () => (previousState: TState, action: Action) => {
      return createMethods(previousState)[action.type](...action.payload);
    },
    [createMethods],
  );

  const [state, dispatch] = useReducer(reducer, initialState);

  const wrappedMethods = useMemo(() => {
    const createdMethods = createMethods(initialState);
    const actionTypes = Object.keys(createdMethods) as (keyof TRecord)[];
    const response = {} as WrappedMethods<TRecord>;
    for (const type of actionTypes) {
      response[type] = (...payload) => {
        dispatch({ payload, type: type as string });
      };
    }
    return response;
  }, [createMethods, initialState]);

  return [state, wrappedMethods];
}
