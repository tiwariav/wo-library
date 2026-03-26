/* eslint @typescript-eslint/no-magic-numbers: ["error", { "ignore": [0, 1, -1, 2] }] */

import type { ReactNode } from "react";

import { clsx } from "clsx";
import { useMemo } from "react";

import * as styles from "./circleProgress.module.css";

const MAX_PERCENT = 100;
const MAX_ROTATION = 180;
const ROTATION_OFFSET = 90;

/**
 * Returns a CSS class key based on the completion percentage.
 * Returns `'progressNone'` (≤0%), `'progressPartial'` (<100%), or `'progressFull'` (100%).
 *
 * @param percentage - Completion percentage between 0 and 100.
 * @returns Class name key for styling.
 */
export function getProgressClass(percentage: number) {
  if (percentage <= 0) {
    return "progressNone";
  }
  if (percentage < MAX_PERCENT) {
    return "progressPartial";
  }
  return "progressFull";
}

function getCircleStyles(radius: number, arcRotation = 0, completion = 0) {
  // Arc length at 100% coverage is the circle circumference
  const strokeDasharray = 2 * radius * Math.PI;
  const rotationOffset =
    (2 * radius * (arcRotation - ROTATION_OFFSET) * Math.PI) / MAX_ROTATION;
  // Scale 100% coverage overlay with the actual percent
  const strokeDashoffset =
    rotationOffset +
    ((strokeDasharray - rotationOffset) * (MAX_PERCENT - completion)) /
      MAX_PERCENT;
  return { rotationOffset, strokeDasharray, strokeDashoffset };
}

/** Controls center text: "parts", "percent", "value" or a custom suffix. */
function getTextContent(
  text: string,
  progress: [number, number],
  percentage: number,
): string {
  switch (text) {
    case "parts": {
      return (progress[0] / progress[1]).toString();
    }
    case "percent": {
      return `${percentage}%`;
    }
    case "value": {
      return progress[0].toString();
    }
    default: {
      return `${progress[0]} ${text}`;
    }
  }
}

interface CenterTextProps {
  arcHeight: number;
  className?: string;
  fill?: string;
  percentage: number;
  progress: [number, number];
  text?: string;
}

function CenterText({
  arcHeight,
  className,
  fill,
  percentage,
  progress,
  text,
}: Readonly<CenterTextProps>) {
  return text ? (
    <text
      className={clsx([styles.text], className)}
      dominantBaseline="middle"
      fill={fill}
      textAnchor="middle"
      x="50%"
      y={`${MAX_PERCENT - arcHeight / 2}%`}
    >
      {getTextContent(text, progress, percentage)}
    </text>
  ) : null;
}

interface CircleStyle {
  strokeDasharray: number;
  strokeDashoffset: number;
}

/**
 * Props for the {@link CircleProgress} component.
 */
interface CircleProgressProps {
  /** Percentage of the circle height to render (controls arc slice). @default 100 */
  arcHeight?: number;
  /** Optional content rendered at the center of the circle. */
  children?: ReactNode;
  className?: string;
  /** Override class names for internal SVG elements. */
  innerClassNames?: {
    circleBackground?: string;
    progressFull?: string;
    progressNone?: string;
    progressPartial?: string;
    text?: string;
  };
  /** Tuple of `[current, total]` used to compute fill percentage. */
  progress: [number, number];
  /**
   * `'value'` (current), or a custom suffix string appended to the current value.
   */
  progressText?: string;
  /** Whether to use round line-caps on the progress arc. @default true */
  roundEdges?: boolean;
  /** Size of the enclosing SVG viewBox square. @default 20 */
  squareSize?: number;
  /** SVG stroke width in viewBox units. @default 2 */
  strokeWidth?: number;
}

const DEFAULT_SQUARE_SIZE = 20;

export default function CircleProgress({
  arcHeight = MAX_PERCENT,
  children,
  className,
  innerClassNames,
  progress,
  progressText,
  roundEdges = true,
  squareSize = DEFAULT_SQUARE_SIZE,
  strokeWidth = 2,
  ...props
}: Readonly<CircleProgressProps>) {
  const initData = useMemo(() => {
    // Size of the enclosing square
    const height = (squareSize * arcHeight) / MAX_PERCENT;
    const dia = (squareSize * MAX_PERCENT) / arcHeight;
    const squareHeight = (dia * arcHeight) / MAX_PERCENT;
    // SVG centers the stroke width on the radius, subtract out so circle fits in square
    const radius = (squareSize - strokeWidth) / 2;
    // Enclose cicle in a circumscribing square
    const viewBox = `0 0 ${squareSize} ${height}`;
    const calcRadius = radius;
    const arcRotation =
      ROTATION_OFFSET +
      Math.acos((height - strokeWidth - calcRadius) / calcRadius) *
        (MAX_ROTATION / Math.PI);
    return { arcRotation, dia, height, radius, squareHeight, viewBox };
  }, [arcHeight, squareSize, strokeWidth]);

  const progressData: {
    circleBackgroundStyles: CircleStyle;
    circleStyles: CircleStyle;
    completion: number;
    progressClass: ReturnType<typeof getProgressClass>;
  } = useMemo(() => {
    const completion =
      progress[0] && progress[1]
        ? (MAX_PERCENT * progress[0]) / progress[1]
        : 0;
    const progressClass = getProgressClass(completion);
    const { arcRotation, radius } = initData;
    const { rotationOffset, ...circleStyles } = getCircleStyles(
      radius,
      arcRotation,
      completion,
    );
    return {
      circleBackgroundStyles: {
        strokeDasharray: circleStyles.strokeDasharray,
        strokeDashoffset: rotationOffset,
      },
      circleStyles,
      completion,
      progressClass,
    };
  }, [initData, progress]);

  const circleTransform = `rotate(${initData.arcRotation} ${squareSize / 2} ${
    squareSize / 2
  })`;

  return (
    <div
      className={clsx(styles.root, className)}
      data-tooltip={`${progress[0]} / ${progress[1]}`}
      {...props}
    >
      <svg
        height={(squareSize * arcHeight) / MAX_PERCENT}
        viewBox={initData.viewBox}
        width={squareSize}
      >
        <circle
          className={clsx(
            styles.circleBackground,
            innerClassNames?.circleBackground,
          )}
          cx={squareSize / 2}
          cy={squareSize / 2}
          r={initData.radius}
          strokeWidth={`${strokeWidth}px`}
          style={progressData.circleBackgroundStyles}
          transform={circleTransform}
        />
        <circle
          className={clsx(
            styles.circleProgress,
            {
              [styles.strokeRound]: roundEdges,
            },
            styles[progressData.progressClass],
            innerClassNames?.[progressData.progressClass],
          )}
          cx={squareSize / 2}
          cy={squareSize / 2}
          markerEnd="url(#round)"
          r={initData.radius}
          strokeWidth={`${strokeWidth}px`}
          style={progressData.circleStyles}
          transform={circleTransform}
        />
        <CenterText
          arcHeight={arcHeight}
          className={clsx(
            innerClassNames?.text,
            styles[progressData.progressClass as keyof typeof styles],
          )}
          percentage={progressData.completion}
          progress={progress}
          text={progressText}
        />
      </svg>
      {!!children && <div className={styles.content}>{children}</div>}
    </div>
  );
}
