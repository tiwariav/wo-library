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
    height: 0,
    width: 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return windowSize;
}
