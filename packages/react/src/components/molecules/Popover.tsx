import type { ReactNode } from "react";
import type { SetOptional } from "type-fest";

import { clsx } from "clsx";

import Tooltip, { type TooltipProps } from "../atoms/Tooltip/Tooltip.js";
import * as styles from "./popover.module.css";

type PopoverTooltipProps = {
  content: React.ReactNode;
  title?: ReactNode;
} & TooltipProps;

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
