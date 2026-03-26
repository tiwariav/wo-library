import type { ReactNode } from "react";

import type { ContextDispatch } from "../utils.js";
import type { ToastMethods } from "./methods.js";
import type { ToastState } from "./state.js";

import useMethods from "../../hooks/useMethods.js";
import { createAndUseContext, useSimpleProvider } from "../utils.js";
import createToastMethods from "./methods.js";
import INITIAL_TOAST_STATE from "./state.js";

const {
  MethodContext,
  StateContext,
  useContextMethods: useToastMethods,
  useContextState: useToastState,
} = createAndUseContext<ToastState, ContextDispatch<ToastMethods>>();

interface ToastProviderProps {
  children: ReactNode;
}

/**
 * Provider for the Toast notification system.
 */
function ToastProvider({ children }: ToastProviderProps) {
  const [state, dispatch] = useMethods(createToastMethods, INITIAL_TOAST_STATE);

  return useSimpleProvider(StateContext, MethodContext, {
    children,
    dispatch,
    state,
  });
}

export { ToastProvider, useToastMethods, useToastState };
