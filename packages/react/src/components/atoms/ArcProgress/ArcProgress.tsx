/* eslint css-modules/no-unused-class: [2, {camelCase: true, markAsUsed: [
  segment-1, segment-2, segment-3, segment-4
]}] */
import type { ReactNode } from "react";

import { IconArrowLeftRhombus } from "@tabler/icons-react";
import { clsx } from "clsx";
import { useId, useMemo } from "react";

import { describeArc } from "@wo-library/js";
import * as styles from "./arcProgress.module.css";
import useProgressAnimation, {
  ARC_ANGLE,
  MAX_PROGRESS,
} from "./useProgressAnimations.js";

const DEFAULT_SLICE_ANGLE = 7.5;
const CENTER = 50;

/**
 * Props for the {@link ArcProgress} component.
 */
interface ArcProgressProps {
  /** Optional content rendered inside the arc (e.g., a label or icon). */
  children?: ReactNode;
  className?: string;
  /** Override class names for individual arc segments. Keys follow `segment0`, `segment1`, … pattern. */
  innerClassNames?: {
    [key: `segment${number}`]: string;
    /** Class applied to every segment. */
    segment?: string;
  };
  /** Tuple of `[current, total]` used to calculate fill percentage. */
  progress: [number, number];
  /** Number of discrete arc segments to divide the arc into. @default 1 */
  segments?: number;
  /** SVG stroke width in viewBox units. @default 3 */
  strokeWidth?: number;
}

function getAngles(segments: number) {
  const value: [number, number][] = [];
  const parts = Array.from<number>({ length: segments }).fill(
    MAX_PROGRESS / segments,
  );
  let startAngle = -90;
  for (let index = 0; index < parts.length; index++) {
    const part = parts[index];
    const nextAngle = startAngle + (ARC_ANGLE * part) / MAX_PROGRESS;
    const endAngle =
      index === parts.length - 1 ? nextAngle : nextAngle - DEFAULT_SLICE_ANGLE;
    value.push([startAngle, endAngle]);
    startAngle = nextAngle;
  }
  return value;
}

export default function ArcProgress({
  children,
  className,
  innerClassNames,
  progress,
  segments = 4,
  strokeWidth = 2,
}: ArcProgressProps) {
  const percentage = MAX_PROGRESS * (progress[0] / progress[1]);
  const animeId = useId();
  const angles = useMemo(() => getAngles(segments), [segments]);

  /*#__PURE__*/ useProgressAnimation(percentage, animeId);

  return (
    <div className={clsx(styles.root, className)}>
      <svg className={styles.svg} viewBox="0 0 100 50">
        {angles.map(([startAngle, endAngle], index) => {
          const segmentIndex: `segment${number}` = `segment${index + 1}`;
          return (
            <path
              className={clsx(
                styles.segment,
                styles[segmentIndex as keyof typeof styles],
                innerClassNames?.segment,
                innerClassNames?.[segmentIndex],
              )}
              d={describeArc(
                CENTER - strokeWidth * 2,
                { end: endAngle, start: startAngle },
                { x: CENTER, y: CENTER - strokeWidth },
              )}
              fill="none"
              key={index}
              strokeLinecap="round"
              strokeWidth={strokeWidth}
            />
          );
        })}
      </svg>
      <div className={clsx(styles.indicator)} id={`${animeId}-animeIndicator`}>
        <IconArrowLeftRhombus />
      </div>
      <div className={styles.content}>
        <div className={clsx(styles.text)} id={`${animeId}-animeText`}>
          {percentage}
        </div>
        {children}
      </div>
    </div>
  );
}
