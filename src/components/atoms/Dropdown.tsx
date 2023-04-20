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
      middleware: [offset(5), flip(), shift({ padding: 8 })],
      onOpenChange: setOpen,
      open,
      placement,
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
            className: "Tooltip",
            ref: floating,
            style: {
              left: x ?? "",
              position: strategy,
              top: y ?? "",
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
