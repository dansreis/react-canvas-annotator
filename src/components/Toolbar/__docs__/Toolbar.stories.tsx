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
    id: "Toolbar - p",
    primary: true,
    onClick: () => console.log("Toolbar"),
  },
};
export const Secondary: Story = {
  args: {
    id: "Toolbar - s",
    primary: false,
    onClick: () => console.log("Toolbar"),
  },
};
