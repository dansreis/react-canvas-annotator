import type { Meta, StoryObj } from "@storybook/react";
import Example from "./Example";

const meta: Meta<typeof Example> = {
  title: "Menu",
  component: Example,
};

export default meta;
type Story = StoryObj<typeof Example>;

export const Primary: Story = {
  args: {
    text: "Menu",
    primary: true,
    disabled: false,
    size: "small",
    onClick: () => console.log("Menu"),
  },
};
export const Secondary: Story = {
  args: {
    text: "Menu",
    primary: false,
    disabled: false,
    size: "small",
    onClick: () => console.log("Menu"),
  },
};
