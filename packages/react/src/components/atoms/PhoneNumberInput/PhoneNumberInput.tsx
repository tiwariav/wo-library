import type { PhoneNumber } from "libphonenumber-js";
import type { Dispatch, SetStateAction } from "react";

import clsx from "clsx";
import { polyfillCountryFlagEmojis } from "country-flag-emoji-polyfill";
import {
  AsYouType,
  ParseError,
  parsePhoneNumberFromString,
} from "libphonenumber-js";
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

function getPhoneNumber(value: string): PhoneNumber | undefined {
  try {
    return parsePhoneNumberFromString(value, "IN");
  } catch (error) {
    if (!(error instanceof ParseError)) {
      throw error;
    }
    if (
      (error.message === "NOT_A_NUMBER" && !/[^+]/.test(value)) ||
      (error.message === "TOO_SHORT" && /^\+?[\d\s]+-*$/.test(value))
    ) {
      // return undefined to allow value change and maintain type consistency
      return undefined;
    }
    throw error;
  }
}

function formatCountryCode({
  phoneNumber,
  setFlag,
  value,
}: {
  phoneNumber: PhoneNumber;
  setFlag: Dispatch<SetStateAction<string>>;
  value: string;
}) {
  if (!phoneNumber.country) {
    return value;
  }
  setFlag(getFlagEmoji(phoneNumber.country));
  return new AsYouType().input(value);
}

const PhoneNumberInput = forwardRef<
  HTMLInputElement,
  Readonly<FormattedInputProps>
>(({ className, defaultValue = "+91", variant, ...props }, ref) => {
  const textValueRef = useRef<string>(defaultValue.toString());
  const [flag, setFlag] = useState(() => getFlagEmoji("IN"));

  useEffectOnce(() => {
    polyfillCountryFlagEmojis();
  });

  const formatFunction = useCallback((value: InputDomValue) => {
    if (isNil(value)) {
      textValueRef.current = "";
      return "";
    }
    const stringValue = value.toString();
    try {
      const phoneNumber = getPhoneNumber(stringValue);
      if (!phoneNumber) {
        return stringValue;
      }
      return formatCountryCode({ phoneNumber, setFlag, value: stringValue });
    } catch {
      return textValueRef.current;
    }
  }, []);

  const parseFunction = useCallback<FormattedInputParse>((formattedValue) => {
    const textValue = textValueRef.current;
    if (isNil(textValue) || isNil(formattedValue)) {
      return "";
    }
    return isString(formattedValue)
      ? formattedValue.replaceAll(" ", "")
      : String(formattedValue);
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
});
PhoneNumberInput.displayName = "PhoneNumberInput";

export default PhoneNumberInput;
