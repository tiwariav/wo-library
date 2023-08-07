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
import { ReactNode, useCallback } from "react";

import useStateWithProp from "../../hooks/useStateWithProp.js";
import styles from "./modal.module.css";

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
  innerClassNames = {},
  isOpen = false,
  onClose,
}: ModalProps) {
  const [open, setOpen] = useStateWithProp(isOpen);
  const handleOpenChange = useCallback(
    (value: boolean) => {
      setOpen(value);
      onClose?.();
    },
    [onClose, setOpen],
  );

  const { context, refs } = useFloating({
    onOpenChange: handleOpenChange,
    open,
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
        {open && (
          <FloatingOverlay
            className={clsx(styles.overlay, innerClassNames.overlay)}
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
