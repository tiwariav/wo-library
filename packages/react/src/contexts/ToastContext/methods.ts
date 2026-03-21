import type { Toast, ToastState } from "./state.js";

export default function createToastMethods(state: ToastState) {
  return {
    addToast: (toast: Omit<Toast, "id">): ToastState => {
      const id = Math.random().toString(36).substring(2, 9);
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
