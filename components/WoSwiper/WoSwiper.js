import clsx from "clsx";
import PropTypes from "prop-types";
import React from "react";
import {
  A11y,
  Autoplay,
  EffectCoverflow,
  FreeMode,
  Mousewheel,
  Navigation,
} from "swiper";
import { Swiper, SwiperSlide } from "swiper/react/swiper-react.js";
import "./styles";
import styles from "./woSwiper.module.css";

const variants = ["basic", "coverflow"];

export default function WoSwiper({
  className,
  variant,
  title,
  subtitle,
  children,
  moreLink,
  moreLinkVertical,
  hasSeparator,
  fade,
  navigation,
  ...props
}) {
  let derivedProps = {};
  if (variant === "coverflow") {
    derivedProps = {
      // effects
      effect: "coverflow",
      coverflowEffect: { rotate: 5, depth: 200, modifier: 1, stretch: 10 },
      // loop
      loop: true,
    };
  }

  return (
    <div
      className={clsx(
        styles.container,
        styles[`is-${variant}`],
        {
          [styles.hasSeparator]: hasSeparator,
        },
        className
      )}
    >
      {title || subtitle || moreLink ? (
        <div className={styles.top}>
          <div className={styles.topLeft}>
            {title ? <h2 className={styles.title}>{title}</h2> : null}
            {subtitle ? <h3 className={styles.subtitle}>{subtitle}</h3> : null}
          </div>
          <div>{moreLink && variant !== "coverflow" ? moreLink : null}</div>
        </div>
      ) : null}
      <Swiper
        // modules
        modules={[
          // TODO: creating new wrapper-id for each storyshot run
          ...(!process.env.JEST_WORKER_ID ? [A11y] : []),
          EffectCoverflow,
          FreeMode,
          Mousewheel,
          Navigation,
          Autoplay,
        ]}
        className={styles.swiper}
        // swiper params
        // slides grid
        centeredSlides={variant === "coverflow"}
        spaceBetween={variant === "coverflow" ? 64 : 32}
        slidesPerView={"auto"}
        // freemode
        freeMode={true}
        freeModeSticky={!navigation}
        // navigation
        navigation={navigation}
        // mousewheel
        mousewheel={{ forceToAxis: true }}
        {...derivedProps}
        {...props}
      >
        {React.Children.map(children, (child, index) => (
          <SwiperSlide key={index}>
            {({ isActive, isDuplicate }) => {
              const extraProps = {};
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
        {fade ? (
          <>
            <div
              className={styles.fadeLeft}
              style={{ width: fade.left }}
              slot="container-start"
            />
            <div
              className={styles.fadeRight}
              style={{ width: fade.right }}
              slot="container-end"
            />
          </>
        ) : null}
      </Swiper>
      {moreLinkVertical ? (
        <div className={styles.bottom}>{moreLinkVertical}</div>
      ) : null}
    </div>
  );
}

WoSwiper.propTypes = {
  /**
   * Title text
   */
  title: PropTypes.string,
  /**
   * Subtitle text
   */
  subtitle: PropTypes.string,
  /**
   * Swiper variant
   */
  variant: PropTypes.oneOf(variants),
};

WoSwiper.defaultProps = {
  variant: "basic",
  // swiper default props
  navigation: true,
  autoplay: false,
};
