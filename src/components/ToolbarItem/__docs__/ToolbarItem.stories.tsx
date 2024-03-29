import type { Meta, StoryObj } from "@storybook/react";
import Example from "./Example";

const meta: Meta<typeof Example> = {
  title: "ToolbarItem",
  component: Example,
};

export default meta;
type Story = StoryObj<typeof Example>;

export const Primary: Story = {
  args: {
    text: "Item",
    iconName: "rectangle",
    primary: true,
    active: true,
    size: "medium",
    onClick: () => console.log("MenuItem"),
  },
};
export const Secondary: Story = {
  args: {
    text: "Item",
    iconName: "hand",
    primary: false,
    active: false,
    size: "medium",
    onClick: () => console.log("MenuItem"),
  },
};
