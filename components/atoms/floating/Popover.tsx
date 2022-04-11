import clsx from "clsx";
import styles from "./popover.module.css";
import Tooltip from "./Tooltip";

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
