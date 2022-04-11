import clsx from "clsx";
import Tooltip from "./Tooltip";

type Props = {
  content: React.ReactNode;
  className: string;
};

export default function Popover({ content, className, ...props }: Props) {
  return (
    <Tooltip className={clsx(className)} title={content} popover {...props} />
  );
}
