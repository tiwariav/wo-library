import type { ReactNode } from "react";

import { clsx } from "clsx";
import React from "react";
import {
  A11y,
  Autoplay,
  EffectCoverflow,
  FreeMode,
  Mousewheel,
  Navigation,
  Pagination,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import styles from "./woSwiper.module.css";

export const WO_SWIPER_VARIANTS = ["coverflow"] as const;

const modules = [
  A11y,
  EffectCoverflow,
  FreeMode,
  Mousewheel,
  Navigation,
  Autoplay,
  Pagination,
];

export interface WoSwiperProps extends React.ComponentProps<typeof Swiper> {
  children: JSX.Element | JSX.Element[];
  className?: string;
  fade?: { left: number; right: number };
  freeMode?: object;
  hasSeparator?: boolean;
  moreLink?: ReactNode;
  moreLinkVertical?: ReactNode;
  navigation?: boolean;
  pagination?: boolean;
  subtitle?: string;
  title?: string;
  variant?: (typeof WO_SWIPER_VARIANTS)[number];
}

const SPACE_BETWEEN_OPTIONS = {
  large: 64,
  normal: 32,
};

export default function WoSwiper({
  children,
  className,
  fade,
  freeMode,
  hasSeparator,
  moreLink,
  moreLinkVertical,
  navigation = true,
  pagination,
  subtitle,
  title,
  variant,
  ...props
}: WoSwiperProps) {
  let derivedProps = {};
  if (variant === "coverflow") {
    derivedProps = {
      coverflowEffect: { depth: 200, modifier: 1, rotate: 5, stretch: 10 },
      effect: "coverflow",
    };
  }

  return (
    <div
      className={clsx(
        styles.container,
        {
          [styles.hasPagination]: pagination,
          [styles.hasSeparator]: hasSeparator,
        },
        className,
      )}
    >
      {(!!title || !!subtitle || !!moreLink) && (
        <div className={styles.top}>
          <div className={styles.topLeft}>
            {!!title && <h2 className={styles.title}>{title}</h2>}
            {!!subtitle && <h3 className={styles.subtitle}>{subtitle}</h3>}
          </div>
          <div>{!!moreLink && variant !== "coverflow" && moreLink}</div>
        </div>
      )}
      <Swiper
        // modules
        className={styles.swiper}
        // freemode
        freeMode={
          pagination
            ? false
            : {
                enabled: true,
                sticky: !navigation,
                ...freeMode,
              }
        }
        modules={modules}
        mousewheel={{ forceToAxis: true }}
        navigation={navigation}
        pagination={
          pagination
            ? {
                clickable: true,
                dynamicBullets: true,
              }
            : false
        }
        spaceBetween={
          variant === "coverflow"
            ? SPACE_BETWEEN_OPTIONS.large
            : SPACE_BETWEEN_OPTIONS.normal
        }
        {...derivedProps}
        {...props}
      >
        {React.Children.map(children, (child, index) => (
          <SwiperSlide key={index}>
            {({
              isActive,
              // @ts-expect-error: TS2339 because library definition is wrong
              isDuplicate,
            }) => {
              const extraProps = {} as { viewMode?: string };
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              if (child.type.displayName === "Card") {
                extraProps.viewMode =
                  variant === "coverflow"
                    ? isActive && !isDuplicate
                      ? "mini"
                      : "thumb"
                    : undefined;
              }
              return React.cloneElement(child, extraProps);
            }}
          </SwiperSlide>
        ))}
        {fade && (
          <>
            <div
              className={styles.fadeLeft}
              slot="container-start"
              style={{ width: fade.left }}
            />
            <div
              className={styles.fadeRight}
              slot="container-end"
              style={{ width: fade.right }}
            />
          </>
        )}
      </Swiper>
      {!!moreLinkVertical && (
        <div className={styles.bottom}>{moreLinkVertical}</div>
      )}
    </div>
  );
}
