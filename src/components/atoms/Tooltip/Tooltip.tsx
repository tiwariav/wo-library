import type { FloatingContext } from "@floating-ui/react";
import type {
  CSSProperties,
  ComponentProps,
  MouseEventHandler,
  ReactNode,
  RefObject,
} from "react";

import { FloatingArrow, FloatingPortal } from "@floating-ui/react";
import { clsx } from "clsx";
import { cloneElement, isValidElement } from "react";

import type { TriggerOptions, UseTooltipOptions } from "./utils.js";

import * as styles from "./tooltip.module.css";
import {
  ARROW_HEIGHT,
  ARROW_WIDTH,
  useContextInteractions,
  useTooltipProps,
} from "./utils.js";

export interface TooltipCommonProps {
  children?: ReactNode;
  className?: string;
  onClick?: MouseEventHandler;
}

export interface TooltipTriggerProps extends TooltipCommonProps {
  getReferenceProps: (
    userProps?: ComponentProps<"button">,
  ) => Record<string, unknown>;
  referenceRef: (node: HTMLButtonElement | null) => void;
}

export function TooltipTrigger({
  children,
  className,
  getReferenceProps,
  onClick,
  referenceRef,
}: TooltipTriggerProps) {
  if (
    isValidElement<{
      className: string;
      onClick?: MouseEventHandler;
    }>(children)
  ) {
    const childProps = children.props;
    return cloneElement(children, {
      className: clsx(styles.reference, className, children.props.className),
      ...getReferenceProps({
        ...childProps,
        onClick: (event) => {
          childProps.onClick?.(event);
          onClick?.(event);
        },
        ref: referenceRef,
      }),
    });
  }
  return (
    <button
      className={clsx(styles.reference, className)}
      {...getReferenceProps({
        onClick,
        ref: referenceRef,
      })}
    >
      {children}
    </button>
  );
}

interface TooltipBodySharedProps {
  innerClassNames?: {
    arrow?: string;
    floating?: string;
    reference?: string;
    title?: string;
  };
  isPopover?: boolean;
}

interface TooltipBodyProps extends TooltipBodySharedProps {
  animate?: boolean;
  arrowRef?: RefObject<SVGSVGElement>;
  context: FloatingContext;
  floatingRef: (node: HTMLDivElement | null) => void;
  floatingStyles: CSSProperties;
  getFloatingProps: (
    userProps?: ComponentProps<"div">,
  ) => Record<string, unknown>;
  showArrow?: boolean;
  showBody?: boolean;
  title: ReactNode;
  transitionStyles: CSSProperties;
}

export function TooltipBody({
  animate,
  arrowRef,
  context,
  floatingRef,
  floatingStyles,
  getFloatingProps,
  innerClassNames,
  isPopover,
  showArrow,
  showBody,
  title,
  transitionStyles,
}: TooltipBodyProps) {
  return (
    showBody && (
      <div
        className={clsx(styles.floating, innerClassNames?.floating)}
        {...getFloatingProps({
          ref: floatingRef,
          style: floatingStyles,
        })}
      >
        <div
          className={clsx(styles.title, innerClassNames?.title, {
            [styles.isPlain]: !isPopover,
          })}
          style={animate ? transitionStyles : {}}
        >
          {title}
        </div>
        {showArrow && (
          <FloatingArrow
            className={clsx(styles.arrow, innerClassNames?.arrow)}
            context={context}
            height={ARROW_HEIGHT}
            ref={arrowRef}
            width={ARROW_WIDTH}
          />
        )}
      </div>
    )
  );
}

export interface TooltipProps
  extends TooltipCommonProps,
    UseTooltipOptions,
    TooltipBodySharedProps {
  animate?: boolean;
  className?: string;
  portal?: boolean;
  style?: CSSProperties;
  title: ReactNode;
  trigger?: TriggerOptions;
}

export default function Tooltip({
  children,
  innerClassNames,
  onClick,
  portal,
  title,
  trigger,
  ...props
}: TooltipProps) {
  const { context, refs, ...floatingProps } = useTooltipProps({ ...props });

  const { getFloatingProps, getReferenceProps } = useContextInteractions(
    context,
    trigger,
  );

  const bodyProps = {
    ...floatingProps,
    context,
    floatingRef: refs.setFloating,
    getFloatingProps,
    title,
  };

  return (
    <>
      <TooltipTrigger
        className={innerClassNames?.reference}
        getReferenceProps={getReferenceProps}
        onClick={onClick}
        referenceRef={refs.setReference}
      >
        {children}
      </TooltipTrigger>
      {portal ? (
        <FloatingPortal>
          <TooltipBody {...bodyProps} />
        </FloatingPortal>
      ) : (
        <TooltipBody {...bodyProps} />
      )}
    </>
  );
}
