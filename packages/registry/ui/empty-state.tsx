/* eslint-disable sonarjs/prefer-read-only-props -- props interfaces are already immutable shapes */
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface EmptyStateProps {
  title: string;
  description?: string;
  visual?: ReactNode;
  action?: { label: string; onClick?: () => void };
  guidance?: { title?: string; tips: string[] };
  className?: string;
}

/** Centered empty list / page placeholder. */
export function EmptyState({
  action,
  className,
  description,
  guidance,
  title,
  visual,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-lg bg-light p-8 text-center text-primary",
        className,
      )}
    >
      {visual ? <div aria-hidden>{visual}</div> : null}
      <h2 className="text-lg font-semibold">{title}</h2>
      {description ? (
        <p className="max-w-md text-sm opacity-80">{description}</p>
      ) : null}
      {action ? (
        <button
          className="rounded-md bg-primary px-3 py-1.5 text-sm text-light"
          onClick={action.onClick}
          type="button"
        >
          {action.label}
        </button>
      ) : null}
      {guidance ? (
        <div className="mt-2 max-w-md text-left text-sm">
          <p className="mb-1 font-medium">
            {guidance.title ?? "Getting started"}
          </p>
          <ul className="list-disc space-y-1 pl-5 opacity-80">
            {guidance.tips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
