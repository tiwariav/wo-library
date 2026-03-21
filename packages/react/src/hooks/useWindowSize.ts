import { useEffect, useState } from "react";

/**
 * Hook that tracks the browser window dimensions.
 *
 * @returns Object containing `width` and `height`.
 *
 * @example
 * ```tsx
 * const { width, height } = useWindowSize();
 * ```
 */
export default function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    height: typeof window !== "undefined" ? window.innerHeight : 0,
    width: typeof window !== "undefined" ? window.innerWidth : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}
