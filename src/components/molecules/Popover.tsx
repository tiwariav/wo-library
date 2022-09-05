import { clsx } from "clsx";
import Tooltip from "../atoms/Tooltip.js";
import styles from "./popover.module.css";

type Props = {
  content: React.ReactNode;
  innerClassNames: any;
};

export default function Popover({
  content,
  innerClassNames = {},
  ...props
}: Props) {
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
