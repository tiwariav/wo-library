import type { FormItemProps } from "antd/es/form/index.js";
import type { ReactElement } from "react";

import { Form as _Form } from "antd";
import { clsx } from "clsx";
import { defaultImport } from "default-import";
import { isDate, isObject } from "lodash-es";
import React, { useCallback, useMemo, useState } from "react";

import * as styles from "./antFormItemWrapper.module.css";

const Form = defaultImport(_Form);

interface AntFormItemWrapperProps extends FormItemProps {
  children: ReactElement;
  loading?: boolean;
  onBlur?: React.ChangeEventHandler<HTMLInputElement>;
  onKeyPress?: React.KeyboardEventHandler<HTMLInputElement>;
}

interface EventValue extends React.ChangeEvent<HTMLInputElement> {
  value?: string;
}

export default function AntFormItemWrapper({
  children,
  className,
  label,
  loading,
  onBlur,
  onKeyPress,
  rules,
  ...props
}: AntFormItemWrapperProps): ReactElement {
  const [virgin, setVirgin] = useState(true);
  const [validateTrigger, setValidateTrigger] = useState("onChange");

  const handleBlur: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      if (event.target.value && virgin) {
        setVirgin(false);
        setValidateTrigger("onChange");
      }
      if (onBlur) {
        onBlur(event);
      }
    },
    [virgin, onBlur],
  );

  const handleKeyPress: React.KeyboardEventHandler<HTMLInputElement> =
    useCallback(
      (event) => {
        if (event.key && virgin) {
          setValidateTrigger("onBlur");
        }
        if (onKeyPress) {
          onKeyPress(event);
        }
      },
      [virgin, onKeyPress],
    );

  const overrideProps = useMemo(() => {
    return {
      onBlur: handleBlur,
      onKeyPress: handleKeyPress,
      ...(loading ? { isLoading: loading } : {}),
      ...(label ? { label } : {}),
      // @ts-expect-error: TS2339 because Rules type has no prop required
      required: rules?.find((item) => item.required),
    };
  }, [handleBlur, handleKeyPress, label, loading, rules]);

  return (
    <Form.Item
      className={clsx(styles.root, className)}
      getValueFromEvent={(event: EventValue) => {
        return !isObject(event) || isDate(event)
          ? event
          : event.value ??
              (event.target.id.startsWith("numberInputText")
                ? Number(event.target.value)
                : event.target.value);
      }}
      rules={rules}
      validateTrigger={validateTrigger}
      {...props}
    >
      {React.cloneElement(children, overrideProps)}
    </Form.Item>
  );
}
