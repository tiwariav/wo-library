import clsx from "clsx";
import styles from "./popover.module.css";
import Tooltip from "./Tooltip";

export default function Popover({ content, className, ...props }) {
  return (
    <Tooltip
      className={clsx(styles.root, className)}
      title={content}
      popover
      {...props}
    />
  );
}
