import type {
  ChangeEvent,
  ChangeEventHandler,
  ComponentPropsWithRef,
  FocusEvent,
  ReactElement,
  ReactNode,
} from "react";
import type { ControllerProps, FieldValues } from "react-hook-form";
import type { SetOptional } from "type-fest";

import { isObject } from "lodash-es";
import React, { Suspense, useCallback, useMemo } from "react";
import { useController } from "react-hook-form";

import type { InputFormValue } from "../TextInput/TextInput.js";

import FormError from "../FormError.js";

const ErrorMessage = React.lazy(() =>
  import("@hookform/error-message").then((defaultImport) => ({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    default: defaultImport.ErrorMessage,
  })),
);

export type ChangeHandler = (
  event: ChangeEvent<HTMLInputElement>,
  value?: { action: "select-option" } | InputFormValue,
  shouldUpdate?: boolean,
) => void;

/**
 * Props for the {@link HookFormInputWrapper} component.
 * @template TValues - react-hook-form `FieldValues` shape for the containing form.
 */
export type HookFormInputWrapperProps<TValues extends FieldValues> = {
  /**
   * The single form input element to control. Must accept an `onChange` prop
   * compatible with {@link ChangeHandler}.
   */
  children: ReactElement<
    {
      onChange?: ChangeHandler;
    } & ComponentPropsWithRef<"input">
  >;
  /** Additional onChange handler called after react-hook-form's controller. */
  onChange?: ChangeEventHandler;
  /** Whether to render a validation error message below the input. @default true */
  showError?: boolean;
} & SetOptional<ControllerProps<TValues>, "control" | "render">;

/**
 * Connects any input component to react-hook-form via `useController`.
 * Handles value synchronisation, validation errors, and react-select compatibility.
 *
 * @template TValues - The form's `FieldValues` type.
 *
 * @example
 * <HookFormInputWrapper control={control} name="email" showError>
 *   <TextInput label="Email" />
 * </HookFormInputWrapper>
 */
export default function HookFormInputWrapper<TValues extends FieldValues>({
  children,
  name,
  showError = true,
  ...props
}: HookFormInputWrapperProps<TValues>): ReactNode {
  const {
    field: { onBlur, onChange, ref, value },
    fieldState: { error },
    formState: { defaultValues, errors },
  } = useController({ name, ...props });

  const child = React.Children.only(children);

  const handleHookFormChange = useCallback(
    (
      event: ChangeEvent<HTMLInputElement>,
      inputValue: unknown,
      shouldUpdate?: boolean,
    ) => {
      // for react-select compatibility
      if (
        isObject(inputValue) &&
        "action" in inputValue &&
        inputValue.action === "select-option"
      ) {
        onChange(event);
        return;
      }
      if (shouldUpdate) {
        onChange(inputValue);
        return;
      }
      if (inputValue === undefined) {
        onChange(event);
      }
    },
    [onChange],
  );

  const changeHandlers = useMemo(
    () => ({
      onBlur: (event: FocusEvent<HTMLInputElement>) => {
        onBlur();
        child.props.onBlur?.(event);
      },
      onChange: ((event, inputValue, shouldUpdate) => {
        handleHookFormChange(event, inputValue, shouldUpdate);
        child.props.onChange?.(event, inputValue, shouldUpdate);
      }) as ChangeHandler,
    }),
    [child.props, handleHookFormChange, onBlur],
  );

  const cloneProps = useMemo(() => {
    const response = {
      hasError: !!error?.message,
      ref,
      value,
      ...changeHandlers,
    } as typeof child.props;
    if (defaultValues?.[name] !== undefined) {
      response.defaultValue = defaultValues[name];
    }
    return response;
  }, [changeHandlers, child, defaultValues, error, name, ref, value]);

  return (
    <>
      {React.cloneElement(child, cloneProps)}
      {showError && (
        <Suspense>
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message, messages }) => (
              <FormError
                messages={isObject(messages) ? messages : { message }}
              />
            )}
          />
        </Suspense>
      )}
    </>
  );
}
