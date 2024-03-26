import type { Meta, StoryObj } from "@storybook/react";
import Example from "./Example";

const meta: Meta<typeof Example> = {
  title: "AnnotatorMenu",
  component: Example,
};

export default meta;
type Story = StoryObj<typeof Example>;

export const Primary: Story = {
  args: {
    text: "AnnotatorMenu",
    primary: true,
    disabled: false,
    size: "small",
    onClick: () => console.log("AnnotatorMenu"),
  },
};
export const Secondary: Story = {
  args: {
    text: "AnnotatorMenu",
    primary: false,
    disabled: false,
    size: "small",
    onClick: () => console.log("AnnotatorMenu"),
  },
};
