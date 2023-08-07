import type React from "react";

import { clsx } from "clsx";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { useEvent, useLatest } from "react-use";

import styles from "./modal.module.css";

export interface ModalProps {
  children: React.ReactNode;
  className?: string;
  isOpen?: boolean;
  onClose?: (event?: Event) => void;
}

const Modal: React.FC<ModalProps> = ({
  children,
  className,
  isOpen,
  onClose,
}) => {
  const [open, setOpen] = useState(false);
  const openRef = useLatest(open);
  const modalRef = useRef<HTMLDialogElement | null>(null);

  const showModal = useCallback(() => {
    if (!modalRef.current || modalRef.current.open) return;
    modalRef.current.showModal();
    if (!openRef.current) setOpen(true);
  }, [openRef, setOpen]);

  const hideModal = useCallback(() => {
    if (!modalRef.current) return;
    modalRef.current.close();
    if (openRef.current) setOpen(false);
  }, [openRef, setOpen]);

  const closeOnBackdropClick = useCallback(
    ({ target }: React.MouseEvent<HTMLDialogElement>) => {
      if (target === modalRef.current) hideModal();
    },
    [hideModal],
  );

  const closeOnOutsideClick = useCallback(
    ({ target }: Event) => {
      if (
        (target instanceof Node && !modalRef.current?.contains(target)) ||
        target === modalRef.current
      ) {
        hideModal();
      }
    },
    [hideModal],
  );

  useEvent("mousedown", closeOnOutsideClick, window);

  useLayoutEffect(() => {
    if (isOpen) {
      showModal();
      return;
    }
    hideModal();
  }, [isOpen, showModal, hideModal]);

  return (
    <div>
      <h4>New Modal</h4>
      <dialog
        onClick={(event) => {
          closeOnBackdropClick(event);
        }}
        onClose={(event) => {
          event.stopPropagation();
          event.preventDefault();
          onClose?.();
          if (open) setOpen(false);
        }}
        className={clsx(styles.dialog, className)}
        ref={modalRef}
      >
        {open && children}
      </dialog>
    </div>
  );
};

export default Modal;
