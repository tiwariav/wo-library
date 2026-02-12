import type { PhoneNumber } from "libphonenumber-js";
import type { Dispatch, SetStateAction } from "react";

import clsx from "clsx";
import { polyfillCountryFlagEmojis } from "country-flag-emoji-polyfill";
import { AsYouType, ParseError, parsePhoneNumber } from "libphonenumber-js";
import { isNil, isString } from "lodash-es";
import { forwardRef, useCallback, useRef, useState } from "react";
import { useEffectOnce } from "react-use";

import type {
  FormattedInputParse,
  FormattedInputProps,
} from "../FormattedInput/FormattedInput.js";
import type { InputDomValue } from "../TextInput/TextInput.js";

import FormattedInput from "../FormattedInput/FormattedInput.js";
import * as styles from "./phoneNumberInput.module.css";

// offset between uppercase ascii and regional indicator symbols
const OFFSET = 127_397;

function getFlagEmoji(countryCode: string) {
  return countryCode
    .toUpperCase()
    .replaceAll(/./g, (char) =>
      String.fromCodePoint((char.codePointAt(0) as number) + OFFSET),
    );
}

function getPhoneNumber(value: string) {
  try {
    return parsePhoneNumber(value, "IN");
  } catch (error) {
    if (!(error instanceof ParseError)) {
      throw error;
    }
    if (
      (error.message === "NOT_A_NUMBER" && !/[^+]/.test(value)) ||
      (error.message === "TOO_SHORT" && /^\+?[\d\s]+-*$/.test(value))
    ) {
      // return empty string to allow value change
      return "";
    }
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw error;
  }
}

function formatCountryCode({
  currentText,
  phoneNumber,
  setFlag,
  value,
}: {
  currentText: string;
  phoneNumber: PhoneNumber;
  setFlag: Dispatch<SetStateAction<string>>;
  value: string;
}) {
  currentText = value;
  if (!phoneNumber.country) {
    currentText = value;
    return currentText;
  }
  setFlag(getFlagEmoji(phoneNumber.country));
  return new AsYouType().input(value);
}

const PhoneNumberInput = forwardRef<HTMLInputElement, FormattedInputProps>(
  ({ className, defaultValue = "+91", variant, ...props }, ref) => {
    const textValueRef = useRef<string>(defaultValue.toString());
    const [flag, setFlag] = useState(getFlagEmoji("IN"));

    useEffectOnce(() => {
      polyfillCountryFlagEmojis();
    });

    const formatFunction = useCallback((value: InputDomValue) => {
      if (isNil(value)) {
        textValueRef.current = "";
        return "";
      }
      value = value.toString();
      let phoneNumber;
      try {
        phoneNumber = getPhoneNumber(value) as PhoneNumber;
      } catch {
        // unhandled error, dont update input value
        return textValueRef.current;
      }
      return formatCountryCode({
        currentText: textValueRef.current,
        phoneNumber,
        setFlag,
        value,
      });
    }, []);

    const parseFunction = useCallback<FormattedInputParse>((formattedValue) => {
      const textValue = textValueRef.current;
      if (isNil(textValue) || isNil(formattedValue)) {
        return;
      }
      return isString(formattedValue)
        ? formattedValue.replaceAll(" ", "")
        : formattedValue;
    }, []);

    return (
      <FormattedInput
        className={clsx(
          styles.root,
          variant === "material" && styles.variantMaterial,
          className,
        )}
        defaultValue={defaultValue}
        format={formatFunction}
        iconBefore={flag}
        innerClassNames={{ iconBefore: styles.flagIcon, label: styles.label }}
        parse={parseFunction}
        ref={ref}
        variant={variant}
        {...props}
      />
    );
  },
);
PhoneNumberInput.displayName = "PhoneNumberInput";

export default PhoneNumberInput;
