import type { MutableRefObject } from "react";

import { isEmpty, isNil, isObject } from "lodash-es";
import { forwardRef, useCallback, useRef } from "react";

import type { FormatNumberOptions } from "../../../tools/number.js";
import type {
  FormattedInputParse,
  FormattedInputProps,
} from "../FormattedInput/FormattedInput.js";
import type { InputDomValue, InputFormValue } from "../TextInput/TextInput.js";

import { formatNumber, stringToNumber } from "../../../tools/number.js";
import { FormattedInput } from "../FormattedInput/index.js";

export interface NumberInputProps
  extends Omit<FormattedInputProps, "format" | "parse" | "value"> {
  format?: FormatNumberOptions | boolean;
  parse?: boolean;
  value?: number | string;
}

function getFormattedNumber(
  value: string,
  format: FormatNumberOptions | boolean,
  textRef: MutableRefObject<InputFormValue>,
) {
  const newValueDecimals = value.split(".")[1]?.length ?? 0;
  const nullValue = value ? "0" : "";
  const formatOptions = isObject(format) ? format : {};
  const minimumFractionDigits =
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    formatOptions.minimumFractionDigits ??
    Math.min(newValueDecimals, formatOptions.maximumFractionDigits ?? 2) ??
    0;
  const formattedValue = formatNumber(value, {
    nullValue,
    ...formatOptions,
    minimumFractionDigits,
  });
  if (newValueDecimals > (formattedValue.split(".")[1]?.length || 0)) {
    // if the input value decimals are more than format options,
    // reduce the decimals for input to parseFucntion
    const newSplits = value.split(".");
    textRef.current = `${newSplits[0]}.${formattedValue.split(".")[1]}`;
  }
  return formattedValue;
}

const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({ format = false, parse = false, ...props }, ref) => {
    const textValueRef = useRef<InputFormValue>();

    const formatFunction = useCallback(
      (value: InputDomValue) => {
        if (isNil(value)) {
          textValueRef.current = "";
          return "";
        }
        value = value.toString();
        textValueRef.current = value;
        if (!format || value.endsWith(".") || value === "-") {
          return value;
        }
        return getFormattedNumber(value, format, textValueRef);
      },
      [format],
    );

    const parseFunction = useCallback<FormattedInputParse>(
      (formattedValue, emptyValue) => {
        const textValue = textValueRef.current;
        if (isEmpty(textValue)) {
          return emptyValue;
        }
        const unformattedValue = format
          ? stringToNumber(formattedValue as string, emptyValue)
          : textValue;
        return parse || isNil(unformattedValue)
          ? unformattedValue
          : unformattedValue.toString();
      },
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
