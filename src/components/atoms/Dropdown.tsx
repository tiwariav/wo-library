import {
  Placement,
  autoUpdate,
  flip,
  offset,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import React, {
  ReactNode,
  cloneElement,
  isValidElement,
  useState,
} from "react";

export interface DropdownProps {
  children: ReactNode;
  label: string;
  placement?: Placement;
}

const Dropdown: React.FC<DropdownProps> = ({ children, label, placement }) => {
  const [open, setOpen] = useState(false);

  const { context, refs, strategy, x, y } = useFloating({
    middleware: [offset(5), flip(), shift({ padding: 8 })],
    onOpenChange: setOpen,
    open,
    placement,
    whileElementsMounted: autoUpdate,
  });

  const { getFloatingProps, getReferenceProps } = useInteractions([
    useHover(context),
    useFocus(context),
    useRole(context, { role: "tooltip" }),
    useDismiss(context),
  ]);

  return (
    <>
      {isValidElement(children) &&
        cloneElement(children, getReferenceProps({ ref: refs.setReference }))}
      {open && (
        <div
          {...getFloatingProps({
            className: "Tooltip",
            ref: refs.setFloating,
            style: {
              left: x ?? "",
              position: strategy,
              top: y ?? "",
            },
          })}
        >
          {label}
        </div>
      )}
    </>
  );
};

export default Dropdown;
