/* eslint-disable sonarjs/prefer-read-only-props -- props interfaces are already immutable shapes */
/* eslint-disable jsx-a11y/prefer-tag-over-role -- lightweight overlay without native dialog */
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface ConfirmProps {
  open: boolean;
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  className?: string;
}

/** Lightweight confirm dialog (no portal library). */
export function Confirm({
  cancelLabel = "Cancel",
  className,
  confirmLabel = "Confirm",
  description,
  destructive = false,
  onCancel,
  onConfirm,
  open,
  title,
}: ConfirmProps) {
  if (!open) {
    return null;
  }
  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 p-4"
      role="dialog"
    >
      <div
        className={cn(
          "w-full max-w-sm rounded-lg bg-light p-5 text-primary shadow-lg",
          className,
        )}
      >
        <h2 className="text-base font-semibold">{title}</h2>
        {description ? (
          <div className="mt-2 text-sm opacity-80">{description}</div>
        ) : null}
        <div className="mt-4 flex justify-end gap-2">
          <button
            className="rounded-md px-3 py-1.5 text-sm"
            onClick={onCancel}
            type="button"
          >
            {cancelLabel}
          </button>
          <button
            className={cn(
              "rounded-md px-3 py-1.5 text-sm text-light",
              destructive ? "bg-red-700" : "bg-primary",
            )}
            onClick={onConfirm}
            type="button"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
