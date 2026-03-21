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

/**
 * Props for the `Modal` component.
 *
 * @property children - Modal content.
 * @property className - Additional class name for the modal panel.
 * @property innerClassNames.overlay - Class name override for the backdrop overlay.
 * @property isOpen - Controls the modal visibility.
 * @property onClose - Called when the modal should close (overlay click, Esc key).
 */
export interface ModalProps {
  children: ReactNode;
  className?: string;
  innerClassNames?: {
    overlay?: string;
  };
  isOpen?: boolean;
  onClose?: () => void;
}

/**
 * Accessible modal dialog built with `@floating-ui/react`.
 *
 * Renders into a portal, traps focus, and closes on outside click or Esc.
 *
 * @example
 * ```tsx
 * <Modal isOpen={isOpen} onClose={() => setOpen(false)}>
 *   <h2>Confirm deletion</h2>
 *   <Button onClick={handleDelete}>Delete</Button>
 * </Modal>
 * ```
 */
export default function Modal({
  children,
  className,
  innerClassNames,
  isOpen,
  onClose,
}: Readonly<ModalProps>) {
  const handleOpenChange = () => {
    onClose?.();
  };

  const { context, refs } = useFloating({
    onOpenChange: handleOpenChange,
    open: isOpen,
  });

  const id = useId();
  const labelId = `${id ?? ""}-label`;
  const descriptionId = `${id ?? ""}-description`;

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
