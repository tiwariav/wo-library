import {
  FloatingArrow,
  FloatingPortal,
  OffsetOptions,
  Padding,
  Placement,
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
import { clsx } from "clsx";
import {
  CSSProperties,
  MouseEventHandler,
  ReactNode,
  RefObject,
  cloneElement,
  isValidElement,
  useMemo,
  useRef,
} from "react";

import useStateWithProp from "../../hooks/useStateWithProp.js";
import styles from "./tooltip.module.css";

const TRIGGER_OPTIONS = ["click", "hover"] as const;
const ARROW_WIDTH = 12;
const ARROW_HEIGHT = 8;

export interface TooltipProps {
  animate?: boolean;
  children?: ReactNode;
  className?: string;
  innerClassNames?: {
    arrow?: string;
    floating?: string;
    reference?: string;
    title?: string;
  };
  isOpen?: boolean;
  isPopover?: boolean;
  onClick?: MouseEventHandler<Element>;
  onClose?: () => void;
  options?: {
    offset?: OffsetOptions;
    padding?: Padding;
  };
  placement?: Placement;
  portal?: boolean;
  showArrow?: boolean;
  style?: CSSProperties;
  title: ReactNode;
  trigger?: (typeof TRIGGER_OPTIONS)[number];
}

const defaultOptions = { offset: 8, padding: 8 };

export default function Tooltip({
  animate,
  children,
  innerClassNames = {},
  isOpen,
  isPopover,
  onClick,
  onClose,
  options: propsOptions,
  placement,
  portal,
  showArrow,
  style,
  title,
  trigger = "click",
}: TooltipProps) {
  const arrowRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useStateWithProp(isOpen);

  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    onClose?.();
  };

  const options = { ...defaultOptions, ...propsOptions };

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

  const { getFloatingProps, getReferenceProps } = useInteractions([
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

  const arrowX = middlewareData.arrow?.x ?? 0;
  const arrowY = middlewareData.arrow?.y ?? 0;
  const transformX = arrowX + ARROW_WIDTH / 2;
  const transformY = arrowY + ARROW_HEIGHT;

  const { isMounted, styles: transitionStyles } = useTransitionStyles(context, {
    common: ({ side }) => ({
      transformOrigin: {
        bottom: `${transformX}px ${-ARROW_HEIGHT}px`,
        left: `calc(100% + ${ARROW_HEIGHT}px) ${transformY}px`,
        right: `${-ARROW_HEIGHT}px ${transformY}px`,
        top: `${transformX}px calc(100% + ${ARROW_HEIGHT}px)`,
      }[side],
    }),
    duration: 100,
    initial: {
      transform: "scale(0)",
    },
  });

  const body = isMounted && (
    <div
      className={clsx(styles.floating, innerClassNames.floating)}
      {...getFloatingProps({
        ref: refs.setFloating,
        style: floatingStyles,
      })}
    >
      <div
        className={clsx(styles.title, innerClassNames.title, {
          [styles.isPlain]: !isPopover,
        })}
        style={animate ? transitionStyles : {}}
      >
        {title}
      </div>
      {showArrow && (
        <FloatingArrow
          className={clsx(styles.arrow, innerClassNames.arrow)}
          context={context}
          height={ARROW_HEIGHT}
          ref={arrowRef as unknown as RefObject<SVGSVGElement>}
          width={ARROW_WIDTH}
        />
      )}
    </div>
  );

  const triggerElement = useMemo<ReactNode>(() => {
    if (
      isValidElement<{
        className: string;
        onClick?: MouseEventHandler<Element>;
        style: CSSProperties;
      }>(children)
    ) {
      const childProps = children.props;
      return cloneElement(children, {
        className: clsx(
          styles.reference,
          innerClassNames.reference,
          children.props.className,
        ),
        style,
        ...getReferenceProps({
          onClick: (event) => {
            childProps.onClick?.(event);
            onClick?.(event);
          },
          ref: refs.setReference,
        }),
      });
    }
    return (
      <button
        className={clsx(styles.reference, innerClassNames.reference)}
        style={style}
        {...getReferenceProps({
          onClick,
          ref: refs.setReference,
        })}
      >
        {children}
      </button>
    );
  }, [
    children,
    getReferenceProps,
    innerClassNames.reference,
    onClick,
    refs.setReference,
    style,
  ]);

  return (
    <>
      {triggerElement}
      {portal ? <FloatingPortal>{open && body}</FloatingPortal> : open && body}
    </>
  );
}
