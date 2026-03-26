import type { ReactNode } from "react";

import * as styles from "./formGroup.module.css";

/**
 * Props for the {@link FormGroup} component.
 */
interface FormGroupProps extends React.ComponentPropsWithoutRef<"div"> {
  /** Validation error to display below the field. Typically from react-hook-form's `fieldState.error`. */
  error?: {
    message: string;
  };
  /** Label text or element. When provided, children are wrapped in a `<label>` element. */
  label?: ReactNode;
}

/**
 * Wraps a form field with an optional label and validation error message.
 * When `label` is provided, children are wrapped in a `<label>` element for
 * accessible association.
 *
 * @example
 * <FormGroup label="Email" error={errors.email}>
 *   <TextInput name="email" />
 * </FormGroup>
 */
export default function FormGroup({
  children,
  error,
  label,
  ...props
}: FormGroupProps) {
  return (
    <div className={styles.container} {...props}>
      {label ? (
        <label>
          <span className={styles.labelText}>{label}</span>
          {children}
        </label>
      ) : (
        children
      )}
      {error && <div className={styles.error}>{error.message}</div>}
    </div>
  );
}
