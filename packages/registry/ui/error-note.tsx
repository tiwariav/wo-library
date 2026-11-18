/* eslint-disable sonarjs/prefer-read-only-props -- props interfaces are already immutable shapes */
import type { ReactNode } from "react";

import { cn } from "../lib/cn.js";

export interface ErrorNoteProps {
  title?: string;
  children: ReactNode;
  className?: string;
  onRetry?: () => void;
}

/** Inline error callout with optional retry. */
export function ErrorNote({
  children,
  className,
  onRetry,
  title = "Something went wrong",
}: ErrorNoteProps) {
  return (
    <div
      className={cn(
        "rounded-md border border-primary/30 bg-light px-4 py-3 text-primary",
        className,
      )}
      role="alert"
    >
      <p className="font-medium">{title}</p>
      <div className="mt-1 text-sm opacity-90">{children}</div>
      {onRetry ? (
        <button
          className="mt-2 text-sm underline"
          onClick={onRetry}
          type="button"
        >
          Try again
        </button>
      ) : null}
    </div>
  );
}
