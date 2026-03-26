import type { ReactNode } from "react";

import { clsx } from "clsx";
import { Children } from "react";

import type { ContainerProps } from "../../atoms/Container/Container.js";

import Container from "../../atoms/Container/Container.js";
import * as styles from "./details.module.css";

interface DetailsProps extends ContainerProps {
  contentSide?: ReactNode;
  hasSeparator?: boolean;
  headerMain?: ReactNode;
  headerSide?: ReactNode;
}

export default function Details({
  children,
  className,
  contentSide,
  hasSeparator,
  headerMain,
  headerSide,
  ...props
}: DetailsProps) {
  const itemStyle = {};
  return (
    <Container
      className={clsx(className, { [styles.hasSeparator]: hasSeparator })}
      {...props}
    >
      <div className={styles.container}>
        <div className={styles.content}>{headerMain}</div>
        <div className={styles.aside}>{headerSide}</div>
      </div>
      <div className={styles.container}>
        <div className={styles.content}>
          {Children.map(children, (child, index) => (
            <div className={styles.item} key={index} style={itemStyle}>
              {child}
            </div>
          ))}
        </div>
        <div className={styles.aside}>{contentSide}</div>
      </div>
    </Container>
  );
}
