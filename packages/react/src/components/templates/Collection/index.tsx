/* eslint css-modules/no-unused-class: [2, {camelCase: true, markAsUsed: [
  is-list, is-grid
]}] */

import type { CSSProperties, ReactNode } from "react";

import { IconFilter, IconSortDescending } from "@tabler/icons-react";
import React from "react";

import { getDynamicClassName } from "../../../tools/utils.js";
import Container from "../../atoms/Container/Container.js";
import { Button } from "../../atoms/index.js";
import * as styles from "./collection.module.css";

export interface FilterOption {
  key: string;
  name: string;
  options: string[];
}

export interface SortOption {
  key: string;
  name: string;
}

const COLLECTION_VARIANT_OPTIONS = ["list", "grid"] as const;

export interface CollectionProps {
  children: ReactNode;
  columns?: number;
  filter?: FilterOption[];
  sort?: SortOption[];
  title?: string;
  variant?: (typeof COLLECTION_VARIANT_OPTIONS)[number];
}

const MAX_WIDTH = 100;

export default function Collection({
  children,
  columns,
  filter,
  sort,
  title,
  variant = "list",
  ...props
}: CollectionProps) {
  const itemStyle: CSSProperties = {};
  const contentStyle: CSSProperties = {};
  if (columns) {
    if (variant === "list") {
      itemStyle.width = `${MAX_WIDTH / columns}%`;
    }
    contentStyle.gridTemplateColumns = `repeat(${columns}, 1fr)`;
  }
  return (
    <Container {...props}>
      <h1 className={styles.title}>{title}</h1>
      {((!!filter && filter.length > 0) || (sort && sort.length > 0)) && (
        <div className={styles.options}>
          {filter && (
            <Button
              className={styles.button}
              iconBefore={<IconFilter />}
              size="small"
            >
              Filter
            </Button>
          )}
          {sort && (
            <Button
              className={styles.button}
              iconBefore={<IconSortDescending />}
              size="small"
            >
              Filter
            </Button>
          )}
        </div>
      )}
      <div
        className={getDynamicClassName(styles, `is-${variant}`)}
        style={contentStyle}
      >
        {React.Children.map(children, (child, index) => (
          <div className={styles.item} key={index} style={itemStyle}>
            {child}
          </div>
        ))}
      </div>
    </Container>
  );
}
