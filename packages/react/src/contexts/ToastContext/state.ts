export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
}

export interface ToastState {
  toasts: Toast[];
}

const INITIAL_TOAST_STATE: ToastState = {
  toasts: [],
};

export default INITIAL_TOAST_STATE;
