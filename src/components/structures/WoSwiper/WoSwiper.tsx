import type { ReactNode } from "react";
import type { Merge } from "type-fest";

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

import * as styles from "./woSwiper.module.css";

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

type SwiperChild = JSX.Element | JSX.Element[];
type SwiperVariant = (typeof WO_SWIPER_VARIANTS)[number];

interface SwiperTopProps {
  moreLink?: ReactNode;
  subtitle?: string;
  title?: string;
  variant?: SwiperVariant;
}

interface SwiperFadeProps {
  fade: { left: number; right: number };
}

interface FreeModeOptions {
  freeMode?: object;
  navigation?: boolean;
  pagination?: boolean;
}

export interface WoSwiperProps
  extends Partial<SwiperTopProps>,
    Partial<SwiperFadeProps>,
    Merge<React.ComponentProps<typeof Swiper>, FreeModeOptions> {
  children: SwiperChild;
  className?: string;
  hasSeparator?: boolean;
  moreLinkVertical?: ReactNode;
}

const SPACE_BETWEEN_OPTIONS = {
  large: 64,
  normal: 32,
};

function getDerivedProps(variant: string | undefined) {
  let derivedProps = {};
  if (variant === "coverflow") {
    derivedProps = {
      coverflowEffect: { depth: 200, modifier: 1, rotate: 5, stretch: 10 },
      effect: "coverflow",
    };
  }
  return derivedProps;
}

function SwiperTop({ moreLink, subtitle, title, variant }: SwiperTopProps) {
  return (
    (!!title || !!subtitle || !!moreLink) && (
      <div className={styles.top}>
        <div className={styles.topLeft}>
          {!!title && <h2 className={styles.title}>{title}</h2>}
          {!!subtitle && <h3 className={styles.subtitle}>{subtitle}</h3>}
        </div>
        <div>{!!moreLink && variant !== "coverflow" && moreLink}</div>
      </div>
    )
  );
}

function SwiperFade({ fade }: SwiperFadeProps) {
  return (
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
  );
}

function SwiperSlideGroup({
  children,
  variant,
}: {
  children: SwiperChild;
  variant?: SwiperVariant;
}) {
  return React.Children.map(children, (child, index) => (
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
  ));
}

const getFreeModeOptions = ({
  freeMode,
  navigation = true,
  pagination,
}: FreeModeOptions) =>
  pagination
    ? false
    : {
        enabled: true,
        sticky: !navigation,
        ...freeMode,
      };

const getPaginationOptions = (pagination?: boolean) =>
  pagination
    ? {
        clickable: true,
        dynamicBullets: true,
      }
    : false;

const getSpaceBetween = (variant?: SwiperVariant) =>
  variant === "coverflow"
    ? SPACE_BETWEEN_OPTIONS.large
    : SPACE_BETWEEN_OPTIONS.normal;

export default function WoSwiper({
  children,
  className,
  fade,
  freeMode,
  hasSeparator,
  moreLink,
  moreLinkVertical,
  navigation,
  pagination,
  subtitle,
  title,
  variant,
  ...props
}: WoSwiperProps) {
  const derivedProps = getDerivedProps(variant);

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
      <SwiperTop moreLink={moreLink} subtitle={subtitle} title={title} />
      <Swiper
        className={styles.swiper}
        freeMode={getFreeModeOptions({ freeMode, navigation, pagination })}
        modules={modules}
        mousewheel={{ forceToAxis: true }}
        navigation={navigation}
        pagination={getPaginationOptions(pagination)}
        spaceBetween={getSpaceBetween(variant)}
        {...derivedProps}
        {...props}
      >
        <SwiperSlideGroup variant={variant}>{children}</SwiperSlideGroup>
        {fade && <SwiperFade fade={fade} />}
      </Swiper>
      {!!moreLinkVertical && (
        <div className={styles.bottom}>{moreLinkVertical}</div>
      )}
    </div>
  );
}
