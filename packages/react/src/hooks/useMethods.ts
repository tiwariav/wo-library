import { useMemo, useReducer } from "react";

/**
 * Represents a dispatched action with a type string and variadic payload.
 */
export interface Action {
  payload: unknown[];
  type: string;
}

/**
 * Factory function that receives current state and returns an object of named
 * reducer methods.
 */
export type CreateMethods<TRecord extends ActionRecord, TState> = (
  state: TState,
) => TRecord;

export type ActionRecord<TState = unknown> = Record<
  Action["type"],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (...args: any) => TState
>;

/**
 * The dispatch-wrapped methods returned by {@link useMethods}.
 * Each method dispatches the corresponding action when called.
 */
export type WrappedMethods<TRecord extends ActionRecord> = {
  [key in keyof TRecord]: (...payload: Parameters<TRecord[key]>) => void;
};

/**
 * A type-safe alternative to `useReducer` that uses named methods instead of
 * action types.
 *
 * @param createMethods - Factory that receives the current state and returns an
 *   object whose keys are action names and values are reducer functions.
 * @param initialState - The initial state value.
 * @returns A `[state, methods]` tuple where `methods` maps each action name to
 *   a dispatch function.
 *
 * @example
 * ```tsx
 * const [count, { increment, decrement }] = useMethods(
 *   (state) => ({
 *     increment: () => state + 1,
 *     decrement: () => state - 1,
 *   }),
 *   0,
 * );
 * ```
 */
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
