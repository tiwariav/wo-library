import type { ReactNode } from "react";

import { FloatingPortal } from "@floating-ui/react";

import {
  TooltipBody,
  type TooltipCommonProps,
  TooltipTrigger,
} from "./Parts.js";
import {
  type TriggerOptions,
  type UseTooltipOptions,
  useContextInteractions,
  useTooltipProps,
} from "./utils.js";

export interface TooltipProps extends TooltipCommonProps, UseTooltipOptions {
  animate?: boolean;
  className?: string;
  innerClassNames?: {
    arrow?: string;
    floating?: string;
    reference?: string;
    title?: string;
  };
  isPopover?: boolean;
  portal?: boolean;
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
