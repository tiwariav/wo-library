import {
  arrow,
  autoPlacement,
  autoUpdate,
  FloatingPortal,
  offset,
  Placement,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from "@floating-ui/react-dom-interactions";
import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import styles from "./tooltip.module.css";

interface TooltipProps {
  className?: string;
  options?: any;
  placement?: Placement;
  title: string;
  trigger: string[];
  visible?: boolean;
  popover?: boolean;
  portal?: boolean;
  innerClassNames?: Record<string, string>;
}

const defaultOptions = { offset: 8, padding: 8 };

const Tooltip: React.FC<TooltipProps> = ({
  children,
  innerClassNames = {},
  visible,
  placement,
  title,
  options: propsOptions,
  popover,
  portal,
  trigger = ["click"],
  style,
}) => {
  const arrowRef = useRef(null);
  const [show, setShow] = useState(visible);
  const open = visible || show;
  const options = { ...defaultOptions, ...propsOptions };
  const {
    x,
    y,
    reference,
    floating,
    strategy,
    context,
    refs,
    update,
    // middlewareData,
  } = useFloating({
    ...(placement ? { placement } : {}),
    middleware: [
      ...(arrowRef?.current ? [arrow({ element: arrowRef.current })] : []),
      offset(options.offset),
      shift({ padding: options.padding }),
      ...(!placement ? [autoPlacement()] : []),
    ],
    onOpenChange: setShow,
    open,
  });

  // const { x: arrowX, y: arrowY } = middlewareData.arrow || {};

  const { getReferenceProps, getFloatingProps } = useInteractions([
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

  useEffect(() => {
    if (refs.reference.current && refs.floating.current && open) {
      return autoUpdate(refs.reference.current, refs.floating.current, update);
    }
  }, [refs.reference, refs.floating, update, open]);

  const body = (
    <div
      className={clsx(
        styles.floating,
        { [styles.isVisible]: open },
        { [styles.isPopover]: popover },
        { [styles.isPlain]: !popover },
        innerClassNames.floating
      )}
      {...getFloatingProps({
        ref: floating,
        style: {
          left: x ?? "",
          position: strategy,
          top: y ?? "",
        },
      })}
    >
      {title}
      {/* <div
            ref={arrowRef}
            className={styles.arrow}
            style={{
              left: arrowX != null ? `${arrowX}px` : "",
              top: arrowY != null ? `${arrowY}px` : "",
            }}
          /> */}
    </div>
  );

  return (
    <>
      <div
        className={clsx(styles.reference, innerClassNames.reference)}
        style={style}
        {...getReferenceProps({ ref: reference })}
      >
        {children}
      </div>
      {portal ? <FloatingPortal>{open && body}</FloatingPortal> : open && body}
    </>
  );
};

export default Tooltip;
