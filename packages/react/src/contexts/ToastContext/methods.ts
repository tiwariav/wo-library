import type { Toast, ToastState } from "./state.js";

export default function createToastMethods(state: ToastState) {
  return {
    addToast: (toast: Omit<Toast, "id">): ToastState => {
      const id = globalThis.crypto.randomUUID();
      return {
        ...state,
        toasts: [...state.toasts, { ...toast, id }],
      };
    },
    removeToast: (id: string): ToastState => {
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== id),
      };
    },
  };
}

export type ToastMethods = ReturnType<typeof createToastMethods>;
