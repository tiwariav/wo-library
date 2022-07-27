import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useFloating,
  useId,
  useInteractions,
  useRole,
} from "@floating-ui/react-dom-interactions";
import clsx from "clsx";
import React, { ReactNode, useCallback, useState } from "react";
import styles from "./modal.module.css";

interface Props {
  className?: string;
  children: ReactNode;
  onClose?: Function;
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
  const handleOpenChange = useCallback(
    (value) => {
      setShow(value);
      if (onClose) onClose();
    },
    [onClose]
  );

  const { reference, floating, context } = useFloating({
    open,
    onOpenChange: handleOpenChange,
  });

  const id = useId();
  const labelId = `${id}-label`;
  const descriptionId = `${id}-description`;

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useRole(context),
  ]);

  const handleOutsideClick = (event) => {
    if (event.target === event.currentTarget) {
      handleOpenChange(false);
    }
  };

  return (
    <>
      <div {...getReferenceProps({ ref: reference })} />
      <FloatingPortal>
        {open && (
          <FloatingFocusManager context={context}>
            <FloatingOverlay
              lockScroll
              className={styles.overlay}
              onClick={handleOutsideClick}
            >
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
          </FloatingFocusManager>
        )}
      </FloatingPortal>
    </>
  );
};

export default Modal;
