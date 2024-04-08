import type {
  FloatingContext,
  MiddlewareData,
  OffsetOptions,
  Padding,
  Placement,
  Side,
} from "@floating-ui/react";

import {
  arrow,
  autoUpdate,
  flip,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
  useTransitionStyles,
} from "@floating-ui/react";
import { useRef, useState } from "react";

export const TRIGGER_OPTIONS = ["click", "hover"] as const;
const DEFAULT_TOOLTIP_OPTIONS = { offset: 8, padding: 8 };
const ARROW_X_TRANSFORM = 0.5;
export const ARROW_WIDTH = 12;
export const ARROW_HEIGHT = 8;

export type TriggerOptions = (typeof TRIGGER_OPTIONS)[number];

export const useContextInteractions = (
  context: FloatingContext,
  trigger?: TriggerOptions,
) =>
  useInteractions([
    useHover(context, {
      delay: {
        close: 250,
        open: 0,
      },
      enabled: trigger === "hover",
    }),
    useClick(context),
    useFocus(context),
    useRole(context, { role: "tooltip" }),
    useDismiss(context),
  ]);

export function getTransformOrigin(
  arrowPosition: MiddlewareData["arrow"],
  side: Side,
) {
  const arrowX = arrowPosition?.x ?? 0;
  const arrowY = arrowPosition?.y ?? 0;
  const transformX = arrowX + ARROW_WIDTH * ARROW_X_TRANSFORM;
  const transformY = arrowY + ARROW_HEIGHT;
  return {
    bottom: `${transformX}px ${-ARROW_HEIGHT}px`,
    left: `calc(100% + ${ARROW_HEIGHT}px) ${transformY}px`,
    right: `${-ARROW_HEIGHT}px ${transformY}px`,
    top: `${transformX}px calc(100% + ${ARROW_HEIGHT}px)`,
  }[side];
}

export interface UseTooltipOptions {
  isOpen?: boolean;
  onClose?: () => void;
  options?: {
    offset?: OffsetOptions;
    padding?: Padding;
  };
  placement?: Placement;
  showArrow?: boolean;
}

export function useTooltipProps({
  isOpen,
  onClose,
  options: propsOptions,
  placement,
  showArrow,
}: UseTooltipOptions) {
  const arrowRef = useRef<SVGSVGElement>(null);
  const [internalOpen, setInternalOpen] = useState(false);
  const open = isOpen ?? internalOpen;

  const handleOpenChange = (value: boolean) => {
    setInternalOpen(value);
    onClose?.();
  };

  const options = { ...DEFAULT_TOOLTIP_OPTIONS, ...propsOptions };

  const { context, floatingStyles, middlewareData, refs } = useFloating({
    middleware: [
      flip(),
      offset(options.offset),
      shift({ padding: options.padding }),
      ...(showArrow ? [arrow({ element: arrowRef.current })] : []),
    ],
    onOpenChange: handleOpenChange,
    open,
    ...(placement ? { placement } : {}),
    whileElementsMounted: autoUpdate,
  });

  const { isMounted, styles: transitionStyles } = useTransitionStyles(context, {
    common: ({ side }) => ({
      transformOrigin: getTransformOrigin(middlewareData.arrow, side),
    }),
    duration: 100,
    initial: {
      transform: "scale(0)",
    },
  });
  return {
    arrowRef,
    context,
    floatingStyles,
    isMounted,
    refs,
    showBody: open && isMounted,
    transitionStyles,
  };
}
