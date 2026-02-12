import type { ReactNode } from "react";

import * as styles from "./formGroup.module.css";

interface FormGroupProps extends React.ComponentPropsWithoutRef<"div"> {
  error?: {
    message: string;
  };
  label?: ReactNode;
}

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
