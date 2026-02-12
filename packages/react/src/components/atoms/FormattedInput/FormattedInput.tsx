import type { ChangeEvent, ChangeEventHandler } from "react";

import clsx from "clsx";
import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { useLatest } from "react-use";

import type {
  InputDomValue,
  InputFormValue,
  TextInputProps,
} from "../TextInput/TextInput.js";

import { TextInput } from "../TextInput/index.js";
import * as styles from "./formattedInput.module.css";

export type FormattedInputParse = (
  value: InputDomValue,
  emptyValue: InputFormValue,
) => InputFormValue;

export interface FormattedInputProps
  extends Omit<TextInputProps, "innerClassNames" | "onChange"> {
  defaultValue?: InputDomValue;
  emptyValue?: InputFormValue;
  format?: (value: InputDomValue) => string;
  hiddenInputProps?: object;
  id?: string;
  innerClassNames?: {
    textInput?: string;
  } & TextInputProps["innerClassNames"];
  isBusy?: boolean;
  isLoading?: boolean;
  onChange?: (
    event: ChangeEvent<HTMLInputElement>,
    value: InputFormValue,
    shouldUpdate: boolean,
  ) => void;
  parse?: FormattedInputParse;
  value?: number | string;
}

const FormattedInput = forwardRef<HTMLInputElement, FormattedInputProps>(
  (
    {
      className,
      defaultValue,
      emptyValue,
      format,
      hiddenInputProps = {},
      innerClassNames = {},
      isBusy,
      isLoading,
      onChange,
      parse,
      value,
      ...props
    },
    ref,
  ) => {
    const modified = useRef(false);
    const [formattedValue, setFormattedValue] = useState<InputDomValue>("");
    const [parsedValue, setParsedValue] = useState<InputFormValue>("");
    const currentParsedValue = useLatest(parsedValue);
    const inputId = useId();

    const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
      (event) => {
        modified.current = true;
        // to get new formatted text when input value is changed by user
        const newFormattedValue = format
          ? format(event.target.value)
          : event.target.value;
        setFormattedValue(newFormattedValue);
        const newParsedValue = parse
          ? parse(newFormattedValue, emptyValue)
          : newFormattedValue;
        setParsedValue(newParsedValue);
        onChange?.(
          event,
          newParsedValue,
          newParsedValue !== currentParsedValue.current,
        );
      },
      [currentParsedValue, emptyValue, format, onChange, parse],
    );

    useEffect(() => {
      // return if value is not modified and is empty, to avoid
      // re-render for defaultValue
      const newValue = !modified.current && !value ? defaultValue : value;
      const newFormattedValue = format ? format(newValue) : newValue;
      const newParsedValue = parse
        ? parse(newFormattedValue, emptyValue)
        : newValue;
      // when to set formatted value
      if (
        !format ||
        !modified.current ||
        // if format is not required for this change
        // (for example if value is `1` but formatterValue is `1.0`)
        newParsedValue !== currentParsedValue.current
      ) {
        setFormattedValue(newFormattedValue);
      }
      setParsedValue(newParsedValue);
    }, [currentParsedValue, defaultValue, emptyValue, format, parse, value]);

    return (
      <div className={clsx(styles.root, className)}>
        <TextInput
          className={innerClassNames.textInput}
          id={`${inputId}-formattedInputText`}
          innerClassNames={innerClassNames}
          isBusy={isBusy}
          isLoading={isLoading}
          onChange={handleChange}
          value={formattedValue}
          {...props}
        />
        {/* This second input is required so that if any parent component tries
         * to access the value using ref, it always gets the unformatted text,
         * not the formatted string. The behavior is meant to be consistent with
         * the handleChange function.
         */}
        <input
          className={styles.hiddenInput}
          id={inputId}
          readOnly
          ref={ref}
          value={parsedValue ?? ""}
          {...hiddenInputProps}
        />
      </div>
    );
  },
);
FormattedInput.displayName = "FormattedInput";

export default FormattedInput;
