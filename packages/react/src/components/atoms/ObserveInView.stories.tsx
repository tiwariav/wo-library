import type { Meta, StoryObj } from "@storybook/react";

import ObserveInView from "./ObserveInView.js";

const metadata: Meta<typeof ObserveInView> = {
  component: ObserveInView,
  parameters: {
    docs: {
      description: {
        component:
          "Wrapper that uses `react-intersection-observer` to detect viewport visibility. Applies dynamic CSS classes and triggers callbacks on view changes.",
      },
    },
  },
  title: "Atoms/ObserveInView",
};

export default metadata;

type Story = StoryObj<typeof ObserveInView>;

export const Default: Story = {
  args: {
    animate: true,
    children: (
      <div
        style={{
          background: "var(--ye-color-primary, #0066cc)",
          color: "white",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        Scroll to observe me
      </div>
    ),
    observeOptions: { threshold: 0.5 },
  },
};

export const WithDynamicClasses: Story = {
  args: {
    animate: true,
    children: (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        Element with dynamic classes
      </div>
    ),
    dynamicClasses: {
      animate: "custom-animate",
      inView: "custom-in-view",
    },
    observeOptions: { threshold: 0 },
  },
};

export const NoAnimation: Story = {
  args: {
    animate: false,
    children: (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        No animation applied
      </div>
    ),
    observeOptions: { threshold: 0 },
  },
};
