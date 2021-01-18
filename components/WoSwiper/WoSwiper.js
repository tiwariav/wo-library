// Import Swiper React components
// Import Swiper styles
// import "!style-loader!sass-loader!swiper/swiper.scss";
import clsx from "clsx";
import PropTypes from "prop-types";
import React from "react";
import SwiperCore, {
  A11y,
  Autoplay,
  EffectCoverflow,
  Mousewheel,
  Navigation,
} from "swiper";
// import "swiper/components/navigation/navigation.scss";
import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/swiper-bundle.css";
import "./swiper.module.scss";
import styles from "./woSwiper.module.css";
// install Swiper components
SwiperCore.use([A11y, EffectCoverflow, Mousewheel, Navigation, Autoplay]);

const variants = ["basic", "coverflow"];

export default function WoSwiper({
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
  switch (variant) {
    case "coverflow":
      derivedProps = {
        // effects
        effect: "coverflow",
        coverflowEffect: { rotate: 5, depth: 200, modifier: 1, stretch: 10 },
        // loop
        loop: true,
      };
      break;

    default:
      break;
  }
  return (
    <div
      className={clsx(styles.container, styles[`is-${variant}`], {
        [styles.hasSeparator]: hasSeparator,
      })}
    >
      {title || subtitle || moreLink ? (
        <div className={styles.top}>
          <div className={styles.topLeft}>
            {title ? <h2 className={styles.title}>{title}</h2> : null}
            {subtitle ? <h3 className={styles.subtitle}>{subtitle}</h3> : null}
          </div>
          <div className={styles.topRight}>
            {moreLink && variant !== "coverflow" ? moreLink : null}
          </div>
        </div>
      ) : null}
      <Swiper
        className={styles.swiper}
        // swiper params
        watchOverflow={true}
        // slides grid
        centeredSlides={variant === "coverflow"}
        spaceBetween={variant === "coverflow" ? 64 : 32}
        slidesPerView={"auto"}
        // touches
        simulateTouch={false}
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
            {({ isActive, isDuplicate }) =>
              React.createElement(child.type, {
                ...{
                  ...child.props,
                  viewMode:
                    variant === "coverflow"
                      ? isActive && !isDuplicate
                        ? "mini"
                        : "thumb"
                      : undefined,
                },
              })
            }
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
