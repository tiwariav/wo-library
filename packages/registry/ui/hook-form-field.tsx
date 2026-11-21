/* eslint-disable sonarjs/prefer-read-only-props -- props interfaces are already immutable shapes */
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface HookFormFieldProps {
  label: string;
  htmlFor?: string;
  error?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Presentational field wrapper for react-hook-form (or any form lib).
 * Pass the controlled input as `children`; surface `error` from form state.
 */
export function HookFormField({
  children,
  className,
  description,
  error,
  htmlFor,
  label,
}: HookFormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1 text-primary", className)}>
      <label className="text-sm font-medium" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {description && !error ? (
        <p className="text-xs opacity-70">{description}</p>
      ) : null}
      {error ? (
        <p className="text-xs text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
