import type { Meta, StoryObj } from "@storybook/react";
import Example from "./Example";

const meta: Meta<typeof Example> = {
  title: "Header",
  component: Example,
};

export default meta;
type Story = StoryObj<typeof Example>;

export const Primary: Story = {
  args: {
    text: "Header",
    primary: true,
    disabled: false,
    size: "small",
    onClick: () => console.log("Header"),
  },
};
export const Secondary: Story = {
  args: {
    text: "Header",
    primary: false,
    disabled: false,
    size: "small",
    onClick: () => console.log("Header"),
  },
};
