/* eslint css-modules/no-unused-class: [2, {camelCase: true, markAsUsed: [
  variant-flat, variant-underlined, variant-transparent, variant-logo-hanging
]}] */

import type { ReactNode } from "react";

import { IconMenu } from "@tabler/icons-react";
import { clsx } from "clsx";
import { isEmpty } from "lodash-es";
import { forwardRef, useEffect, useRef, useState } from "react";

import type { ButtonProps } from "../../atoms/Button/Button.js";
import type { TopNavInnerClassNames, UseTopNavPropsOptions } from "./utils.js";

import {
  LayoutProvider,
  useLayoutMethods,
  useLayoutState,
} from "../../../contexts/LayoutContext/index.js";
import { getDynamicClassName } from "../../../tools/utils.js";
import { FlexAlignCenterDiv, FlexColDiv } from "../../../wrappers/div.js";
import { Button, Container } from "../../atoms/index.js";
import TopNavItem from "./TopNavItem.js";
import * as styles from "./topNav.module.css";
import { useTopNavProps } from "./utils.js";

const LOGO_VARIANTS = ["hanging"] as const;

export function IconMenuItem({ children, ...props }: ButtonProps) {
  return (
    <TopNavItem className={styles.contentMenuIcon}>
      <Button
        aria-label="Open Top Menu"
        spacing="none"
        variant="borderless"
        {...props}
      >
        {children ?? <IconMenu />}
      </Button>
    </TopNavItem>
  );
}

interface LogoProps {
  logo: ReactNode;
  logoVariant?: (typeof LOGO_VARIANTS)[number];
}

function Logo({ logo, logoVariant }: LogoProps) {
  return (
    <div
      className={clsx(
        styles.logoContainer,
        logoVariant &&
          getDynamicClassName(styles, `variant-logo-${logoVariant}`),
      )}
    >
      <div className={styles.logo}>{logo}</div>
    </div>
  );
}

interface ContentMenuProps {
  contentLeft?: ReactNode;
  contentMenu?: ReactNode;
  contentMiddle?: ReactNode;
  contentRight?: ReactNode;
  innerClassNames?: TopNavInnerClassNames;
  smallerWidth?: boolean;
}

function ContentMenu({
  contentLeft,
  contentMenu,
  contentMiddle,
  contentRight,
  innerClassNames,
  smallerWidth,
}: ContentMenuProps) {
  const layoutState = useLayoutState();
  const [contentMenuHeight, setContentMenuHeight] = useState<number>();
  const contentMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setContentMenuHeight(contentMenuRef.current?.offsetHeight);
  }, [smallerWidth]);

  return (
    <div
      className={clsx(
        styles.contentMenuWrapper,
        contentMenuHeight === undefined
          ? styles.contentMenuMeasuring
          : styles.contentMenuMeasured,
        {
          [styles.contentMenuIsOpen]: layoutState.topNav.isDrawerToggled,
        },
      )}
      ref={contentMenuRef}
      style={
        layoutState.topNav.isDrawerToggled ? { height: contentMenuHeight } : {}
      }
    >
      <div className={styles.shadowWrapper}>
        <FlexColDiv
          className={clsx(styles.contentMenu, innerClassNames?.contentMenu)}
        >
          {contentMenu ?? (
            <>
              {!!contentLeft && (
                <FlexColDiv className={styles.contentMenuTop}>
                  {contentLeft}
                </FlexColDiv>
              )}
              {!!contentMiddle && <FlexColDiv>{contentMiddle}</FlexColDiv>}
              {!!contentRight && (
                <FlexColDiv className={styles.contentMenuBottom}>
                  {contentRight}
                </FlexColDiv>
              )}
            </>
          )}
        </FlexColDiv>
      </div>
    </div>
  );
}

function RightNavIcon(props: ButtonProps) {
  const layoutState = useLayoutState();
  const layoutDispatch = useLayoutMethods();

  return (
    <IconMenuItem
      onClick={() => {
        layoutDispatch.dispatch.updateTopNav({
          isDrawerToggled: !layoutState.topNav.isDrawerToggled,
        });
      }}
      {...props}
    />
  );
}

export interface TopNavProps
  extends Omit<ContentMenuProps, "smallerWidth">,
    UseTopNavPropsOptions {
  banner?: ReactNode;
  leftNavIcon?: ReactNode;
  logo?: ReactNode;
  logoVariant?: (typeof LOGO_VARIANTS)[number];
  multiRow?: boolean;
  rightNavIcon?: ReactNode;
}

const TopNavWrapper = forwardRef<HTMLDivElement, TopNavProps>(
  (
    {
      banner,
      contentLeft,
      contentMenu,
      contentMiddle,
      contentRight,
      innerClassNames,
      leftNavIcon,
      logo,
      logoVariant,
      multiRow,
      rightNavIcon,
      ...props
    },
    ref,
  ) => {
    const contentLeftRef = useRef<HTMLDivElement>(null);
    const hasContentMenu = contentMenu ?? contentLeft ?? contentRight;
    const { props: topNavProps, smallerWidth } = useTopNavProps(
      { ...props, contentLeftRef, innerClassNames },
      ref,
    );

    return (
      <div {...topNavProps}>
        {!!banner && <div className={styles.banner}>{banner}</div>}
        <div className={styles.wrapper}>
          <Container
            className={clsx(styles.container, innerClassNames?.container, {
              [styles.hasMultiRow]: multiRow,
            })}
          >
            <FlexAlignCenterDiv>
              {!!leftNavIcon && (
                <div className={styles.sideNavToggle}>{leftNavIcon}</div>
              )}
              {/* logo */}
              {!!logo && <Logo logo={logo} logoVariant={logoVariant} />}
              {/* left content */}
              {(smallerWidth === false || multiRow) && !!contentLeft && (
                <FlexAlignCenterDiv
                  className={styles.contentLeft}
                  ref={contentLeftRef}
                >
                  {contentLeft}
                </FlexAlignCenterDiv>
              )}
            </FlexAlignCenterDiv>

            {(smallerWidth === false || multiRow) && !!contentMiddle && (
              <FlexAlignCenterDiv>{contentMiddle}</FlexAlignCenterDiv>
            )}

            {!!hasContentMenu && (
              <FlexAlignCenterDiv>
                {/* right content */}
                {!!contentRight && (
                  <FlexAlignCenterDiv className={styles.contentRight}>
                    {contentRight}
                  </FlexAlignCenterDiv>
                )}
                {/* right nav icon */}
                {!multiRow &&
                  smallerWidth !== false &&
                  rightNavIcon !== null &&
                  !!hasContentMenu && (
                    <RightNavIcon>{rightNavIcon}</RightNavIcon>
                  )}
              </FlexAlignCenterDiv>
            )}
          </Container>
          {smallerWidth && !!hasContentMenu && (
            <ContentMenu
              contentLeft={contentLeft}
              contentMenu={contentMenu}
              contentMiddle={contentMiddle}
              contentRight={contentRight}
            />
          )}
        </div>
      </div>
    );
  },
);
TopNavWrapper.displayName = "TopNavWrapper";

const TopNav = forwardRef<HTMLDivElement, TopNavProps>((props, ref) => {
  const layoutState = useLayoutState();
  return isEmpty(layoutState) ? (
    <LayoutProvider>
      <TopNavWrapper {...props} ref={ref} />
    </LayoutProvider>
  ) : (
    <TopNavWrapper {...props} ref={ref} />
  );
});
TopNav.displayName = "TopNav";

export default TopNav;
