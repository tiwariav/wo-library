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
import React, { useCallback, useState } from "react";

import styles from "./modal.module.css";

export interface ModalProps {
  children: JSX.Element | JSX.Element[];
  className?: string;
  onClose?: () => void;
  open?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  children,
  className,
  onClose,
  open: passedOpen = false,
}) => {
  const [show, setShow] = useState(passedOpen);
  const open = passedOpen || show;
  const handleOpenChange = useCallback(
    (value: boolean) => {
      setShow(value);
      if (onClose) onClose();
    },
    [onClose]
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
          <FloatingOverlay className={styles.overlay} lockScroll>
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
};

export default Modal;
