import { isNumber } from "lodash-es";
/* eslint-disable sonarjs/prefer-read-only-props -- props interfaces are already immutable shapes */
import { useState, type ChangeEvent, type InputHTMLAttributes } from "react";
import {
  groupIndian,
  sanitizeNumberText,
  stringToNumber,
} from "@wo-library/js";

import { cn } from "../lib/cn.js";

export interface NumberInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "type" | "value"
> {
  value: null | number | undefined;
  onValueChange: (value: null | number) => void;
}

/**
 * en-IN grouping number field. Formats while typing via `@wo-library/js`.
 */
export function NumberInput({
  className,
  onValueChange,
  value,
  ...props
}: NumberInputProps) {
  const [text, setText] = useState(() =>
    value == null ? "" : groupIndian(String(value)),
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const cleaned = sanitizeNumberText(event.target.value);
    const next = groupIndian(cleaned);
    setText(next);
    const parsed = stringToNumber(cleaned);
    onValueChange(isNumber(parsed) && Number.isFinite(parsed) ? parsed : null);
  };

  return (
    <input
      {...props}
      className={cn(
        "rounded-md border border-primary/30 bg-light px-3 py-2 text-primary",
        className,
      )}
      inputMode="decimal"
      onChange={handleChange}
      type="text"
      value={text}
    />
  );
}
