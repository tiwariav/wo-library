import { useMemo } from "react";
import { useMethods } from "react-use";

export default function useProvider({ createMethods, data }) {
  const memoizedInitialState = useMemo(() => data, [data]);
  const [state, methods] = useMethods(createMethods, memoizedInitialState);
  const dispatch = useMemo(() => ({ methods }), [methods]);

  return [state, dispatch];
}
