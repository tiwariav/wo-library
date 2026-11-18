/* eslint-disable sonarjs/prefer-read-only-props -- props interfaces are already immutable shapes */
/* eslint-disable jsx-a11y/prefer-tag-over-role -- lightweight overlay without native dialog */
import type { ReactNode } from "react";

import { cn } from "../lib/cn.js";

export interface SheetProps {
  open: boolean;
  title?: string;
  side?: "bottom" | "left" | "right";
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

/** Side/bottom sheet panel. */
export function Sheet({
  children,
  className,
  onClose,
  open,
  side = "right",
  title,
}: SheetProps) {
  if (!open) {
    return null;
  }
  let sideClass = "right-0 top-0 h-full w-80";
  if (side === "left") {
    sideClass = "left-0 top-0 h-full w-80";
  } else if (side === "bottom") {
    sideClass = "bottom-0 left-0 w-full max-h-[80vh]";
  }

  return (
    <div className="fixed inset-0 z-50">
      <button
        aria-label="Close"
        className="absolute inset-0 bg-primary/40"
        onClick={onClose}
        type="button"
      />
      <aside
        aria-modal="true"
        className={cn(
          "absolute bg-light p-4 text-primary shadow-xl",
          sideClass,
          className,
        )}
        role="dialog"
      >
        <div className="mb-3 flex items-center justify-between gap-2">
          {title ? <h2 className="font-semibold">{title}</h2> : <span />}
          <button
            className="rounded px-2 py-1 text-sm"
            onClick={onClose}
            type="button"
          >
            Close
          </button>
        </div>
        {children}
      </aside>
    </div>
  );
}
