import { clsx } from "clsx";
import { useEffect } from "react";

import {
  useToastMethods,
  useToastState,
} from "../../../contexts/ToastContext/index.js";
import * as styles from "./toast.module.css";

const TOAST_TIMEOUT_MS = 5000;

function ToastItem({
  onClose,
  toast,
}: Readonly<{
  onClose: () => void;
  toast: { id: string; message: string; type: string };
}>) {
  useEffect(() => {
    const timer = setTimeout(onClose, TOAST_TIMEOUT_MS);
    return () => {
      clearTimeout(timer);
    };
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
          onClose={() => {
            dispatch.removeToast(toast.id);
          }}
          toast={toast}
        />
      ))}
    </div>
  );
}

export { ToastProvider } from "../../../contexts/ToastContext/index.js";
