/* eslint css-modules/no-unused-class: [2, {camelCase: true, markAsUsed: ['is-small'] }] */

import type { ComponentPropsWithoutRef } from "react";

import { SVGPathFlagData, SVGPathPinData } from "@wo-library/ui";
import { clsx } from "clsx";
import { forwardRef, useId } from "react";

import * as styles from "./symbol.module.css";

function SVGPathFlag(props: ComponentPropsWithoutRef<"path">) {
  return <path d={SVGPathFlagData.d} {...props} />;
}

function SVGPathPin(props: ComponentPropsWithoutRef<"path">) {
  return (
    <g transform={SVGPathPinData.transform}>
      <path d={SVGPathPinData.d} {...props} />
    </g>
  );
}

const SYMBOL_VARIANTS = ["circle", "flag", "pin", "triangle"] as const;

function imageTransform(variant: (typeof SYMBOL_VARIANTS)[number]) {
  switch (variant) {
    case "pin": {
      return "translate(0 -0.5)";
    }
    case "flag": {
      return "translate(0 -0.75)";
    }
    default: {
      return "translate(0 0)";
    }
  }
}
/**
 * Props for the {@link Symbol} component.
 */
interface SymbolProps extends ComponentPropsWithoutRef<"svg"> {
  /** Fill colour applied to the shape mask. */
  fill?: string;
  /** Extra props forwarded to the SVG `<image>` element (when `imageSrc` is set). */
  imageProps?: ComponentPropsWithoutRef<"image">;
  /** URL of an image rendered inside the shape mask (e.g. a map pin avatar). */
  imageSrc?: string;
  /** Shape mask applied to the content. One of `'circle'`, `'flag'`, `'pin'`, `'triangle'`. */
  variant?: (typeof SYMBOL_VARIANTS)[number];
}

const Symbol = forwardRef<SVGSVGElement, SymbolProps>(
  ({ className, fill, imageProps, imageSrc, variant, ...props }, ref) => {
    const maskId = useId();

    return (
      <svg
        className={clsx(styles.root, className)}
        ref={ref}
        viewBox="0 0 10 10"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <mask id={maskId}>
          <rect fill="black" height="100%" width="100%" />
          {variant === "circle" ? (
            <circle cx="5" cy="5" fill="white" r="5" />
          ) : variant === "triangle" ? (
            <circle cx="5" cy="5" fill="white" r="5" />
          ) : variant === "pin" ? (
            <SVGPathPin fill="white" transform="translate(.95 0)" />
          ) : variant === "flag" ? (
            <SVGPathFlag fill="white" transform="translate(.3 0)" />
          ) : (
            <rect fill="white" height="100%" width="100%" />
          )}
        </mask>
        <rect fill={fill} height="100%" mask={`url(#${maskId})`} width="100%" />
        {!!imageSrc && (
          <image
            height="100%"
            href={imageSrc}
            transform={variant && imageTransform(variant)}
            width="100%"
            {...imageProps}
          />
        )}
      </svg>
    );
  },
);
Symbol.displayName = "Symbol";

export default Symbol;
