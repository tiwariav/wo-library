import {
  Icon3dCubeSphere,
  IconBulb,
  IconHome,
  IconIceCream,
} from "@tabler/icons-react";
import { forwardRef } from "react";

import type { SideNavProps } from "../structures/SideNav/SideNav.js";

import { Anchor } from "../atoms/index.js";
import SideNav from "../structures/SideNav/SideNav.js";
import SideNavItem from "../structures/SideNav/SideNavItem.js";
import { SideNavGroup } from "../structures/index.js";

export const BasicSideNav = forwardRef<
  HTMLDivElement,
  { groups?: number } & SideNavProps
>(({ groups = 2, ...props }, ref) => {
  return (
    <SideNav {...props} ref={ref}>
      <SideNavGroup>
        <SideNavItem
          as={Anchor}
          href="/"
          iconBefore={<IconHome />}
          variant="nav-item"
        >
          Home
        </SideNavItem>
        <SideNavItem
          as={Anchor}
          href="/"
          iconBefore={<IconBulb />}
          variant="nav-item"
        >
          Menu Item
        </SideNavItem>
      </SideNavGroup>
      {Array.from({ length: groups }).map((_, index) => (
        <SideNavGroup
          icon={<Icon3dCubeSphere />}
          key={index}
          title="Menu Group"
        >
          <SideNavItem
            as={Anchor}
            href="/"
            iconBefore={<IconIceCream />}
            variant="nav-item"
          >
            Menu Item
          </SideNavItem>
          <SideNavItem
            as={Anchor}
            href="/"
            iconBefore={<IconIceCream />}
            variant="nav-item"
          >
            Menu Item
          </SideNavItem>
        </SideNavGroup>
      ))}
    </SideNav>
  );
});
BasicSideNav.displayName = "BasicSideNav";
