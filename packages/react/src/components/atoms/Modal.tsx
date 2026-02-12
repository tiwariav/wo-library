import type { ReactNode } from "react";

import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useClick,
  useDismiss,
  useFloating,
  useId,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import { clsx } from "clsx";

import * as styles from "./modal.module.css";

export interface ModalProps {
  children: ReactNode;
  className?: string;
  innerClassNames?: {
    overlay?: string;
  };
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Modal({
  children,
  className,
  innerClassNames,
  isOpen,
  onClose,
}: ModalProps) {
  const handleOpenChange = () => {
    onClose?.();
  };

  const { context, refs } = useFloating({
    onOpenChange: handleOpenChange,
    open: isOpen,
  });

  const id = useId();
  const labelId = `${id}-label`;
  const descriptionId = `${id}-description`;

  const { getFloatingProps, getReferenceProps } = useInteractions([
    useClick(context),
    useRole(context),
    useDismiss(context, { outsidePressEvent: "mousedown" }),
  ]);

  return (
    <>
      <div {...getReferenceProps({ ref: refs.setReference })} />
      <FloatingPortal>
        {isOpen && (
          <FloatingOverlay
            className={clsx(styles.overlay, innerClassNames?.overlay)}
            lockScroll
          >
            <FloatingFocusManager context={context}>
              <div
                aria-describedby={descriptionId}
                aria-labelledby={labelId}
                className={clsx(styles.modal, className)}
                ref={refs.setFloating}
                {...getFloatingProps()}
              >
                {children}
              </div>
            </FloatingFocusManager>
          </FloatingOverlay>
        )}
      </FloatingPortal>
    </>
  );
}
