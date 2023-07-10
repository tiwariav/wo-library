import {
  FloatingPortal,
  OffsetOptions,
  Padding,
  Placement,
  arrow,
  autoPlacement,
  autoUpdate,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import { clsx } from "clsx";
import React, { CSSProperties, ReactNode, useRef, useState } from "react";

import styles from "./tooltip.module.css";

export interface TooltipProps {
  children?: ReactNode;
  className?: string;
  innerClassNames?: Record<string, string>;
  options?: {
    offset?: OffsetOptions;
    padding?: Padding;
  };
  placement?: Placement;
  popover?: boolean;
  portal?: boolean;
  style?: CSSProperties;
  title: ReactNode;
  trigger?: string[];
  visible?: boolean;
}

const defaultOptions = { offset: 8, padding: 8 };

const Tooltip: React.FC<TooltipProps> = ({
  children,
  innerClassNames = {},
  options: propsOptions,
  placement,
  popover,
  portal,
  style,
  title,
  trigger = ["click"],
  visible,
}) => {
  const arrowRef = useRef<HTMLElement>(null);
  const [show, setShow] = useState(visible);
  const open = visible || show;
  const options = { ...defaultOptions, ...propsOptions };
  const { context, refs, strategy, x, y } = useFloating({
    ...(placement ? { placement } : {}),
    middleware: [
      ...(arrowRef?.current ? [arrow({ element: arrowRef.current })] : []),
      offset(options.offset),
      shift({ padding: options.padding }),
      ...(placement ? [] : [autoPlacement()]),
    ],
    onOpenChange: setShow,
    open,
    whileElementsMounted: autoUpdate,
  });

  const { getFloatingProps, getReferenceProps } = useInteractions([
    useHover(context, {
      delay: {
        close: 250,
        open: 0,
      },
      enabled: trigger.includes("hover"),
    }),
    useClick(context),
    useFocus(context),
    useRole(context, { role: "tooltip" }),
    useDismiss(context),
  ]);

  const body = (
    <div
      className={clsx(
        styles.floating,
        { [styles.isVisible]: open },
        { [styles.isPlain]: !popover },
        innerClassNames.floating,
      )}
      {...getFloatingProps({
        ref: refs.setFloating,
        style: {
          left: x ?? "",
          position: strategy,
          top: y ?? "",
        },
      })}
    >
      {title}
    </div>
  );

  return (
    <>
      <div
        className={clsx(styles.reference, innerClassNames.reference)}
        style={style}
        {...getReferenceProps({ ref: refs.setReference })}
      >
        {children}
      </div>
      {portal ? <FloatingPortal>{open && body}</FloatingPortal> : open && body}
    </>
  );
};

export default Tooltip;
