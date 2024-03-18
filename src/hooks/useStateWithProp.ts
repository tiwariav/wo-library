import { useState } from "react";
import { useUpdateEffect } from "react-use";

export default function useStateWithProp<TState>(
  value: TState,
): [TState, React.Dispatch<React.SetStateAction<TState>>] {
  const [state, setState] = useState<TState>(value);

  useUpdateEffect(() => {
    setState(value);
  }, [value]);

  return [state, setState];
}
