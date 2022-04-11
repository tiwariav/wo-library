import clsx from "clsx";
import styles from "./popover.module.css";
import Tooltip from "./Tooltip";

type Props = {
  content: React.ReactNode;
  className: string;
  
}

export default function Popover({ content, className, ...props }:Props) {
  return (
    <Tooltip
      className={clsx(styles.root, className)}
      title={content}
      popover
      {...props}
    />
  );
}
