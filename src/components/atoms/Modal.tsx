import type React from "react";

import { clsx } from "clsx";
import { useCallback, useEffect, useRef } from "react";
import { useEvent } from "react-use";

import styles from "./modal.module.css";

export interface ModalProps {
  children: JSX.Element | JSX.Element[];
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

const Modal: React.FC<ModalProps> = ({
  children,
  className,
  isOpen,
  onClose,
}) => {
  const modalRef = useRef<HTMLDialogElement | null>(null);

  const showModal = useCallback(() => {
    if (!modalRef.current) return;
    modalRef.current.showModal();
  }, [modalRef]);

  const hideModal = useCallback(() => {
    if (!modalRef.current) return;
    modalRef.current.close();
  }, [modalRef]);

  const closeOnBackdropClick = useCallback(
    ({ target }: React.MouseEvent<HTMLDialogElement>) => {
      if (target === modalRef.current) modalRef.current.close();
    },
    [modalRef],
  );

  const closeOnOutsideClick = useCallback(
    ({ target }: Event) => {
      // close if clicked element is not inside the modal
      if (
        (target instanceof Node && !modalRef.current?.contains(target)) ||
        target === modalRef.current
      ) {
        modalRef.current?.close();
      }
    },
    [modalRef],
  );

  useEvent("mousedown", closeOnOutsideClick, window);

  useEffect(() => {
    if (isOpen) {
      showModal();
      return;
    }
    hideModal();
  }, [isOpen, showModal, hideModal]);

  return (
    <dialog
      className={clsx(styles.dialog, styles.modal, className)}
      onClick={closeOnBackdropClick}
      onClose={onClose}
      ref={modalRef}
    >
      {isOpen && children}
    </dialog>
  );
};

export default Modal;
