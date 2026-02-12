import type { Meta } from "@storybook/react";
import type { ComponentProps } from "react";

import { randomGradientGenerator } from "wo-library/tools/colors.js";

import { BasicSideNav } from "../../__stories/SideNavTemplates.js";
import Hero from "../../atoms/Hero/Hero.js";
import { Basic as HeroBasic } from "../../atoms/Hero/Hero.stories.js";
import {
  Basic as CollectionBasic,
  FixedColumns as CollectionFixedColumns,
  Grid as CollectionGrid,
  Template as CollectionTemplate,
} from "../../templates/Collection/Collection.stories.js";
import {
  Basic as DetailsBasic,
  Template as DetailsTemplate,
} from "../../templates/Details/Details.stories.js";
import {
  Basic as ProfileBasic,
  Template as ProfileTemplate,
} from "../../templates/Profile/Profile.stories.js";
import { Basic as SideNavBasic } from "../SideNav/SideNav.stories.js";
import TopNavMeta from "../TopNav/TopNav.stories.js";
import { TopNav } from "../index.js";
import Page from "./Page.js";

const topNavMap = {
  ImageBasic: <TopNav {...TopNavMeta.args} sticky variant="transparent" />,
  TopNavHangingLogo: <TopNav {...TopNavMeta.args} logoVariant="hanging" />,
};

const sideNavMap = {
  SideNavBasic: (
    <BasicSideNav {...SideNavBasic.args} isFullHeight={false} sticky />
  ),
};
const heroMap = { HeroBasic: <Hero {...HeroBasic.args} /> };
const templateMap = {
  CollectionBasic: <CollectionTemplate {...CollectionBasic.args} />,
  CollectionFixedColumns: (
    <CollectionTemplate {...CollectionFixedColumns.args} />
  ),
  CollectionGrid: <CollectionTemplate {...CollectionGrid.args} />,
  Details: <DetailsTemplate {...DetailsBasic.args} />,
  Profile: <ProfileTemplate {...ProfileBasic.args} />,
};

function Template({
  hero,
  sideNav,
  topNav,
  ...args
}: ComponentProps<typeof Page>) {
  return (
    <div
      style={{
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        backgroundImage: randomGradientGenerator(20),
        margin: "-1rem",
      }}
    >
      <Page hero={hero} sideNav={sideNav} topNav={topNav} {...args}>
        <CollectionTemplate {...CollectionBasic.args} />
      </Page>
    </div>
  );
}

const pageMeta: Meta<typeof Page> = {
  argTypes: {
    children: { mapping: templateMap, options: Object.keys(templateMap) },
    hero: { mapping: heroMap, options: Object.keys(heroMap) },
    sideNav: { mapping: sideNavMap, options: Object.keys(sideNavMap) },
    topNav: { mapping: topNavMap, options: Object.keys(topNavMap) },
  },
  component: Page,
  render: (args) => <Template {...args} />,
};

export default pageMeta;

export const Basic = {
  args: {
    sideNav: "SideNavBasic",
    template: "CollectionBasic",
    topNav: "ImageBasic",
  },
};

export const WithHero = {
  args: {
    hero: "HeroBasic",
    sideNav: "SideNavBasic",
    topNav: "TopNavHangingLogo",
  },
};

export const VariantStc = {
  args: {
    sideNav: "SideNavBasic",
    topNav: "ImageBasic",
    variant: "[S][TC]",
  },
};
