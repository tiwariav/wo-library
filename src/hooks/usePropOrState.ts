import { useEffect, useState } from "react";

export default function usePropOrState<TState>(
  value: TState,
): [TState, React.Dispatch<React.SetStateAction<TState>>] {
  const [state, setState] = useState<TState>(value);
  useEffect(() => {
    if (value !== undefined) setState(value);
  }, [value]);
  return [state, setState];
}
