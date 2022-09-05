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
} from "@floating-ui/react-dom-interactions";
import React, {
  cloneElement,
  isValidElement,
  ReactNode,
  useEffect,
  useState,
} from "react";

interface WoTooltipProps {
  children: ReactNode;
  label: string;
  placement?: Placement;
}

const WoTooltip: React.FC<WoTooltipProps> = ({
  children,
  label,
  placement,
}) => {
  const [open, setOpen] = useState(false);

  const { x, y, reference, floating, strategy, context, refs, update } =
    useFloating({
      placement,
      open,
      onOpenChange: setOpen,
      middleware: [offset(5), flip(), shift({ padding: 8 })],
    });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useHover(context),
    useFocus(context),
    useRole(context, { role: "tooltip" }),
    useDismiss(context),
  ]);

  useEffect(() => {
    if (refs.reference.current && refs.floating.current && open) {
      return autoUpdate(refs.reference.current, refs.floating.current, update);
    }
  }, [refs.reference, refs.floating, update, open]);

  return (
    <>
      {isValidElement(children) &&
        cloneElement(children, getReferenceProps({ ref: reference }))}
      {open && (
        <div
          {...getFloatingProps({
            ref: floating,
            className: "Tooltip",
            style: {
              position: strategy,
              top: y ?? "",
              left: x ?? "",
            },
          })}
        >
          "Arrey waaaah"
          {label}
        </div>
      )}
    </>
  );
};

export default WoTooltip;
