import type { Meta, StoryObj } from "@storybook/react";
import Example from "./Example";

const meta: Meta<typeof Example> = {
  title: "Toolbar",
  component: Example,
};

export default meta;
type Story = StoryObj<typeof Example>;

export const Primary: Story = {
  args: {
    text: "Toolbar",
    primary: true,
    disabled: false,
    size: "small",
    onClick: () => console.log("Toolbar"),
  },
};
export const Secondary: Story = {
  args: {
    text: "Toolbar",
    primary: false,
    disabled: false,
    size: "small",
    onClick: () => console.log("Toolbar"),
  },
};
