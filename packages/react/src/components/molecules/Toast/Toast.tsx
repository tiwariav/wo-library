import { clsx } from "clsx";
import { useEffect } from "react";

import {
  ToastProvider,
  useToastMethods,
  useToastState,
} from "../../../contexts/ToastContext/index.js";
import * as styles from "./toast.module.css";

/**
 * Container component that renders active toasts.
 * Must be wrapped in a `ToastProvider`.
 */
export function ToastContainer() {
  const { toasts } = useToastState();
  const { dispatch } = useToastMethods();

  return (
    <div className={styles.container}>
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          onClose={() => dispatch.removeToast(toast.id)}
          toast={toast}
        />
      ))}
    </div>
  );
}

function ToastItem({
  onClose,
  toast,
}: {
  onClose: () => void;
  toast: { id: string; message: string; type: string };
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={clsx(styles.toast, styles[toast.type])}>
      <span className={styles.message}>{toast.message}</span>
      <button className={styles.closeBtn} onClick={onClose} type="button">
        &times;
      </button>
    </div>
  );
}

export { ToastProvider };
