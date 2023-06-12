import { clsx } from "clsx";
import { ReactNode } from "react";
import { SetOptional } from "type-fest";

import Tooltip, { TooltipProps } from "../atoms/Tooltip.js";
import styles from "./popover.module.css";

type PopoverTooltipProps = TooltipProps & {
  content: React.ReactNode;
  innerClassNames?: object;
  title?: ReactNode;
};

type PopoverProps = SetOptional<PopoverTooltipProps, "title">;

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
      popover
      title={content}
      {...props}
    />
  );
}
