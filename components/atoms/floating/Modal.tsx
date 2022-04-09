import {
  FloatingOverlay,
  FloatingPortal,
  useClick,
  useDismiss,
  useFloating,
  useFocusTrap,
  useId,
  useInteractions,
  useRole,
} from "@floating-ui/react-dom-interactions";
import clsx from "clsx";
import React, { useCallback, useState } from "react";
import styles from "./modal.module.css";

interface Props {
  open?: boolean;
  render: (props: {
    close: () => void;
    labelId: string;
    descriptionId: string;
  }) => React.ReactNode;
}

const Modal: React.FC<Props> = ({
  className,
  children,
  onClose,
  open: passedOpen = false,
}) => {
  const [show, setShow] = useState(passedOpen);
  const open = passedOpen || show;
  const handleOpenChange = useCallback((value) => {
    setShow(value);
    if (onClose) onClose();
  }, []);

  const { reference, floating, context } = useFloating({
    open,
    onOpenChange: handleOpenChange,
  });

  const id = useId();
  const labelId = `${id}-label`;
  const descriptionId = `${id}-description`;

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useClick(context),
    useFocusTrap(context),
    useRole(context),
    useDismiss(context),
  ]);

  return (
    <>
      <div {...getReferenceProps({ ref: reference })} />
      <FloatingPortal>
        {open && (
          <FloatingOverlay lockScroll className={styles.overlay}>
            <div
              {...getFloatingProps({
                ref: floating,
                className: clsx(styles.modal, className),
                "aria-labelledby": labelId,
                "aria-describedby": descriptionId,
              })}
            >
              {children}
            </div>
          </FloatingOverlay>
        )}
      </FloatingPortal>
    </>
  );
};

export default Modal;
