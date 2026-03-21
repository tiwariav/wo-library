import { isEmpty, isNil, isObject } from "lodash-es";
import {
  forwardRef,
  useCallback,
  useRef,
  type ReactElement,
  type RefObject,
} from "react";

import { formatNumber, stringToNumber } from "@wo-library/js";
import { FormattedInput } from "../FormattedInput/index.js";
import type {
  FormattedInputParse,
  FormattedInputProps,
} from "../FormattedInput/FormattedInput.js";
import type { InputDomValue, InputFormValue } from "../TextInput/TextInput.js";

/** Options for number formatting. */
export interface FormatNumberOptions extends Intl.NumberFormatOptions {
  /** Number of decimal places (default: 2). Sets both min and max fraction digits. */
  fractionDigits?: number;
  /** Value to return when input is invalid (default: ""). */
  nullValue?: string;
}

/**
 * Props for the `NumberInput` component.
 *
 * Extends `FormattedInput` with automatic number formatting using `formatNumber`
 * (Indian locale, `en-IN`).
 *
 * @property format - Formatting options passed to `formatNumber`, or `false` to
 *   disable formatting, or `true` to use defaults.
 * @property parse - When `true`, the `onChange` value is converted back to a
 *   number string (removing locale separators).
 * @property value - Current numeric value (number or numeric string).
 */
export interface NumberInputProps extends Omit<
  FormattedInputProps,
  "format" | "parse" | "value"
> {
  format?: FormatNumberOptions | boolean;
  parse?: boolean;
  value?: number | string;
}

function getFormattedNumber(
  value: string,
  format: FormatNumberOptions | boolean,
  textRef: RefObject<InputFormValue>,
): string {
  const newValueDecimals = (value.split(".")[1] as string | undefined)?.length ?? 0;
  const nullValue = value ? "0" : "";
  const formatOptions: FormatNumberOptions = isObject(format) ? format : {};
  const maxDecimals = formatOptions.maximumFractionDigits ?? 2;
  const minimumFractionDigits =
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    formatOptions.minimumFractionDigits ??
    Math.min(newValueDecimals, maxDecimals) ??
    0;
  const formattedValue = formatNumber(value, {
    nullValue,
    ...formatOptions,
    minimumFractionDigits,
  }) as string;
  if (newValueDecimals > ((formattedValue.split(".")[1] as string | undefined)?.length ?? 0)) {
    // if the input value decimals are more than format options,
    // reduce the decimals for input to parseFucntion
    const newSplits = value.split(".") as [string, string | undefined];
    textRef.current = `${newSplits[0]}.${
      (formattedValue.split(".")[1] as string | undefined) ?? ""
    }`;
  }
  return formattedValue;
}

interface GetParsedValueOptions {
  emptyValue: InputFormValue;
  format: FormatNumberOptions | boolean;
  formattedValue: InputDomValue;
  parse: boolean;
  textValue: InputFormValue;
}

function getParsedValue({
  emptyValue,
  format,
  formattedValue,
  parse,
  textValue,
}: GetParsedValueOptions): InputFormValue {
  let unformattedValue: InputFormValue;
  if (isEmpty(textValue)) {
    unformattedValue = emptyValue;
  } else if (format) {
    unformattedValue = stringToNumber(
      formattedValue as string,
      emptyValue as number,
    ) as InputFormValue;
  } else {
    unformattedValue = textValue;
  }

  if (parse || isNil(unformattedValue)) {
    return unformattedValue;
  }
  return String(unformattedValue) as InputFormValue;
}

const NumberInput = forwardRef<
  HTMLInputElement,
  Readonly<NumberInputProps>
>(({ format = false, parse = false, ...props }, ref): ReactElement => {
    const textValueRef = useRef<InputFormValue>(null as InputFormValue);

    const formatFunction = useCallback(
      (value: InputDomValue) => {
        if (isNil(value)) {
        textValueRef.current = "";
          return "";
        }
        const stringValue = value.toString();
        textValueRef.current = stringValue;
        if (!format || stringValue.endsWith(".") || stringValue === "-") {
          return stringValue;
        }
        return getFormattedNumber(stringValue, format, textValueRef);
      },
      [format],
    );

    const parseFunction = useCallback<FormattedInputParse>(
      (formattedValue, emptyValue) =>
        getParsedValue({
          emptyValue,
          format,
          formattedValue,
          parse,
          textValue: textValueRef.current,
        }),
      [format, parse],
    );

    return (
      <FormattedInput
        format={formatFunction}
        hiddenInputProps={{ type: "number" }}
        inputMode="decimal"
        parse={parseFunction}
        ref={ref}
        type={format ? "text" : "number"}
        {...props}
      />
    );
  },
);
NumberInput.displayName = "NumberInput";

export default NumberInput;
