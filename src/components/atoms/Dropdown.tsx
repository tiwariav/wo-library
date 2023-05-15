import {
  autoUpdate,
  flip,
  offset,
  Placement,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import React, {
  cloneElement,
  isValidElement,
  ReactNode,
  useState,
} from "react";

interface WoTooltipProps {
  children: ReactNode;
  label: string;
  placement?: Placement;
}

const Dropdown: React.FC<WoTooltipProps> = ({ children, label, placement }) => {
  const [open, setOpen] = useState(false);

  const { x, y, strategy, context, refs } = useFloating({
    middleware: [offset(5), flip(), shift({ padding: 8 })],
    onOpenChange: setOpen,
    open,
    placement,
    whileElementsMounted: autoUpdate,
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([
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
