import type { Meta, StoryObj } from "@storybook/react";
import Example from "./Example";

const meta: Meta<typeof Example> = {
  title: "Button",
  component: Example,
};

export default meta;
type Story = StoryObj<typeof Example>;

export const Primary: Story = {
  args: {
    text: "Button Primary",
    primary: true,
    disabled: false,
    size: "medium",
    onClick: () => console.log("Button Primary"),
  },
};
export const Secondary: Story = {
  args: {
    ...Primary.args,
    text: "Button Secondary",
    onClick: () => console.log("Button Secondary"),
  },
};

export const Disabled: Story = {
  args: {
    ...Primary.args,
    disabled: true,
  },
};
