import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { IconMenu } from "@tabler/icons-react";
import { clsx } from "clsx";
import { isEmpty, isObject } from "lodash-es";
import { forwardRef } from "react";

import type { ButtonProps } from "../../atoms/Button/Button.js";

import {
  LayoutProvider,
  useLayoutMethods,
  useLayoutState,
} from "../../../contexts/LayoutContext/index.js";
import { Button } from "../../atoms/index.js";
import * as styles from "./sideNav.module.css";
import { useSideNavEffects } from "./utils.js";

export function SideNavToggle({ children, ...props }: ButtonProps) {
  const layoutState = useLayoutState();
  const layoutDispatch = useLayoutMethods();
  return (
    <Button
      onClick={() => {
        layoutDispatch.dispatch.updateSideNav({
          isToggled: !layoutState.sideNav.isToggled,
        });
      }}
      spacing="none"
      variant="borderless"
      {...props}
    >
      {children ?? <IconMenu />}
    </Button>
  );
}

function SideNavInner({
  children,
}: Pick<SideNavProps, "children" | "toggleIcon">) {
  return (
    <div className={styles.wrapperOuter}>
      <div className={styles.wrapperInner}>{children}</div>
    </div>
  );
}

function SideNavButton() {
  const layoutState = useLayoutState();
  const layoutDispatch = useLayoutMethods();

  return (
    <button
      className={clsx(styles.backdrop, {
        [styles.backdropToggled]: layoutState.sideNav.isToggled,
      })}
      onClick={() => {
        layoutDispatch.dispatch.updateSideNav({
          isToggled: !layoutState.sideNav.isToggled,
        });
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          layoutDispatch.dispatch.updateSideNav({
            isToggled: !layoutState.sideNav.isToggled,
          });
        }
      }}
      tabIndex={0}
    />
  );
}

export interface SideNavProps extends ComponentPropsWithoutRef<"div"> {
  hasCompactMode?: boolean;
  isFullHeight?: boolean;
  sticky?:
    | {
        bottom?: boolean;
        topNavOffset?: boolean;
      }
    | boolean;
  toggleIcon?: ReactNode;
}

const SideNavWrapper = forwardRef<HTMLDivElement, SideNavProps>(
  (
    {
      children,
      className,
      hasCompactMode = true,
      isFullHeight,
      sticky,
      style,
      toggleIcon,
      ...props
    }: SideNavProps,
    ref,
  ) => {
    const layoutState = useLayoutState();
    const { bottom = false, topNavOffset = false } = isObject(sticky)
      ? sticky
      : {};
    const { setInnerRef } = useSideNavEffects(ref, { topNavOffset });

    return (
      <>
        <SideNavButton />
        <div
          className={clsx(
            styles.root,
            {
              [styles.hasCompactMode]: hasCompactMode,
              [styles.isFullHeight]: isFullHeight,
              [styles.isSticky]: !!sticky || isFullHeight,
              [styles.isStickyBottom]: bottom,
              [styles.isToggled]: layoutState.sideNav.isToggled,
            },
            className,
          )}
          ref={setInnerRef}
          style={{ ...style }}
          {...props}
        >
          {toggleIcon !== null &&
            (toggleIcon ?? (
              <div className={styles.toggle}>
                <SideNavToggle />
              </div>
            ))}
          <SideNavInner toggleIcon={toggleIcon}>{children}</SideNavInner>
        </div>
      </>
    );
  },
);
SideNavWrapper.displayName = "SideNavWrapper";

const SideNav = forwardRef<HTMLDivElement, SideNavProps>((props, ref) => {
  const layoutState = useLayoutState();
  return isEmpty(layoutState) ? (
    <LayoutProvider>
      <SideNavWrapper {...props} ref={ref} />
    </LayoutProvider>
  ) : (
    <SideNavWrapper {...props} ref={ref} />
  );
});
SideNav.displayName = "SideNav";

export default SideNav;
