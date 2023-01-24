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
} from "@floating-ui/react-dom-interactions";
import { clsx } from "clsx";
import React, { useCallback, useState } from "react";
import styles from "./modal.module.css";

interface Props {
  className?: string;
  children: JSX.Element | JSX.Element[];
  onClose?: () => boolean;
  open?: boolean;
}

const Modal: React.FC<Props> = ({
  className,
  children,
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

  const { reference, floating, context } = useFloating({
    onOpenChange: handleOpenChange,
    open,
  });

  const id = useId();
  const labelId = `${id}-label`;
  const descriptionId = `${id}-description`;

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useClick(context),
    useRole(context),
    useDismiss(context, { outsidePressEvent: "mousedown" }),
  ]);

  return (
    <>
      <div {...getReferenceProps({ ref: reference })} />
      <FloatingPortal>
        {open && (
          <FloatingOverlay lockScroll className={styles.overlay}>
            <FloatingFocusManager context={context}>
              <div
                ref={floating}
                className={clsx(styles.modal, className)}
                aria-labelledby={labelId}
                aria-describedby={descriptionId}
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
