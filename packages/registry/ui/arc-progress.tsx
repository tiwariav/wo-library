/* eslint-disable sonarjs/prefer-read-only-props -- props interfaces are already immutable shapes */
/* eslint-disable @typescript-eslint/no-magic-numbers -- SVG layout constants */
/* eslint-disable jsx-a11y/prefer-tag-over-role -- decorative SVG progress */
import { describeArc } from "@wo-library/js";

import { cn } from "../lib/cn.js";

const ARC_START = -180;
const ARC_END = 0;

export interface ArcProgressProps {
  /** 0–100. */
  value: number;
  size?: number;
  className?: string;
  label?: string;
}

/** Semicircle arc progress using `@wo-library/js` SVG helpers. */
export function ArcProgress({
  className,
  label,
  size = 120,
  value,
}: ArcProgressProps) {
  const radius = size / 2 - 8;
  const center = { x: size / 2, y: size / 2 + 4 };
  const clamped = Math.min(100, Math.max(0, value));
  const end = ARC_START + ((ARC_END - ARC_START) * clamped) / 100;
  const track = describeArc(radius, { end: ARC_END, start: ARC_START }, center);
  const fill =
    clamped <= 0 ? "" : describeArc(radius, { end, start: ARC_START }, center);

  return (
    <div className={cn("inline-flex flex-col items-center gap-1", className)}>
      <svg
        aria-label={label ?? `${clamped}%`}
        height={size / 2 + 12}
        role="img"
        viewBox={`0 0 ${size} ${size / 2 + 16}`}
        width={size}
      >
        <path
          d={track}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.2}
          strokeWidth={8}
        />
        {fill ? (
          <path
            d={fill}
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth={8}
          />
        ) : null}
      </svg>
      {label ? <span className="text-sm">{label}</span> : null}
    </div>
  );
}
