/* eslint-disable sonarjs/prefer-read-only-props -- props interfaces are already immutable shapes */
import { isString } from "lodash-es";
import { useState, type ChangeEvent, type InputHTMLAttributes } from "react";
import { normalizePhoneDigits } from "@wo-library/js";

import { cn } from "@/lib/cn";

export interface PhoneInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "type" | "value"
> {
  value: string;
  onValueChange: (digits: string) => void;
}

/**
 * Digit-normalising phone field (libphonenumber UI can wrap this later).
 */
export function PhoneInput({
  className,
  onValueChange,
  value,
  ...props
}: PhoneInputProps) {
  const [text, setText] = useState(value);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value;
    setText(next);
    const digits = normalizePhoneDigits(next);
    onValueChange(isString(digits) ? digits : "");
  };

  return (
    <input
      {...props}
      autoComplete="tel"
      className={cn(
        "rounded-md border border-primary/30 bg-light px-3 py-2 text-primary",
        className,
      )}
      inputMode="tel"
      onChange={handleChange}
      type="tel"
      value={text}
    />
  );
}
