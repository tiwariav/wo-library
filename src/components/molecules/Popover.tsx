import { clsx } from "clsx";
import Tooltip, { TooltipProps } from "../atoms/Tooltip.js";
import styles from "./popover.module.css";

interface PopoverProps extends TooltipProps {
  content: React.ReactNode;
  innerClassNames: any;
}

export default function Popover({
  content,
  innerClassNames = {},
  ...props
}: PopoverProps) {
  return (
    <Tooltip
      innerClassNames={{
        ...innerClassNames,
        floating: clsx(styles.root, innerClassNames.floating),
      }}
      title={content}
      popover
      {...props}
    />
  );
}
