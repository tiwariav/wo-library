import { useState } from "react";
import { useUpdateEffect } from "react-use";

/**
 * React hook that keeps local state in sync with a prop value.
 *
 * Creates a `useState` that automatically updates whenever the incoming prop
 * changes (using `useUpdateEffect` to skip the initial render).
 *
 * @param value - The prop value to sync with local state.
 * @returns A `[state, setState]` tuple, identical to `useState`.
 *
 * @example
 * ```tsx
 * function Input({ value }: { value: string }) {
 *   const [localValue, setLocalValue] = useStateWithProp(value);
 *   return <input value={localValue} onChange={(e) => setLocalValue(e.target.value)} />;
 * }
 * ```
 */
export default function useStateWithProp<TState>(
  value: TState,
): [TState, React.Dispatch<React.SetStateAction<TState>>] {
  const [state, setState] = useState<TState>(value);

  useUpdateEffect(() => {
    setState(value);
  }, [value]);

  return [state, setState];
}
