import type { MultipleFieldErrors } from "react-hook-form";

import * as styles from "./formError.module.css";

function CustomError({
  messages,
}: {
  messages?: MultipleFieldErrors | string;
}) {
  return (
    messages && (
      <div className={styles.root}>
        {Object.entries(messages).map(([type, message]) => (
          <p className={styles.item} key={type}>
            {message}
          </p>
        ))}
      </div>
    )
  );
}

export default CustomError;
