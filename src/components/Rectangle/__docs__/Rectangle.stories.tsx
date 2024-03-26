import type { Meta, StoryObj } from "@storybook/react";
import Example from "./Example";

const meta: Meta<typeof Example> = {
  title: "Rectangle",
  component: Example,
};

export default meta;
type Story = StoryObj<typeof Example>;

export const Primary: Story = {
  args: {
    text: "Rectangle",
    primary: true,
    disabled: false,
    size: "small",
    onClick: () => console.log("Rectangle"),
  },
};
export const Secondary: Story = {
  args: {
    text: "Rectangle",
    primary: false,
    disabled: false,
    size: "small",
    onClick: () => console.log("Rectangle"),
  },
};
