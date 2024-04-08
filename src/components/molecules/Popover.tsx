import type { ReactNode } from "react";
import type { SetOptional } from "type-fest";

import { clsx } from "clsx";

import type { TooltipProps } from "../atoms/Tooltip.js";

import Tooltip from "../atoms/Tooltip.js";
import styles from "./popover.module.css";

type PopoverTooltipProps = TooltipProps & {
  content: React.ReactNode;
  title?: ReactNode;
};

export type PopoverProps = SetOptional<PopoverTooltipProps, "title">;

export default function Popover({
  content,
  innerClassNames,
  ...props
}: PopoverProps) {
  return (
    <Tooltip
      innerClassNames={{
        ...innerClassNames,
        arrow: clsx(styles.arrow, innerClassNames?.arrow),
        title: clsx(styles.root, innerClassNames?.title),
      }}
      isPopover
      title={content}
      {...props}
    />
  );
}
