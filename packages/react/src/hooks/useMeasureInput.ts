import type { RefObject } from "react";

import { cssVariable } from "@wo-library/web";
import { useEffect, useRef, useState } from "react";

/** Computed style overrides for an input element based on label measurement. */
interface CalculatedInputStyles {
  input?: {
    height: number;
    paddingTop: number;
  };
}

/**
 * Measures a label element's height and computes padding/height adjustments
 * for its associated input when the label wraps to multiple lines.
 *
 * @returns A `[labelRef, extraStyles]` tuple. Attach `labelRef` to the
 *   `<label>` element; apply `extraStyles.input` to the input element.
 *
 * @example
 * ```tsx
 * function TextInput({ label }: { label: string }) {
 *   const [labelRef, extraStyles] = useMeasureInput();
 *   return (
 *     <div>
 *       <label ref={labelRef}>{label}</label>
 *       <input style={extraStyles.input} />
 *     </div>
 *   );
 * }
 * ```
 */
export default function useMeasureInput(): [
  RefObject<HTMLLabelElement | null>,
  CalculatedInputStyles,
] {
  const labelRef = useRef<HTMLLabelElement>(null);
  const [extraStyles, setExtraStyles] = useState<CalculatedInputStyles>({});

  useEffect(() => {
    if (labelRef.current) {
      const lineHeight = Number.parseFloat(cssVariable("--ye-line-height"));
      const labelHeight = labelRef.current.offsetHeight;
      const fontSize = Number.parseFloat(
        getComputedStyle(labelRef.current).fontSize,
      );
      const lineHeightPixel = lineHeight * fontSize;
      if (lineHeightPixel < labelHeight) {
        setExtraStyles({
          input: {
            height: labelHeight,
            paddingTop: labelHeight - lineHeightPixel,
          },
        });
      }
    }
  }, []);

  return [labelRef, extraStyles];
}
