import type { Meta, StoryObj } from "@storybook/react";
import Example from "./Example";

const meta: Meta<typeof Example> = {
  title: "AnnotatorMenuItem",
  component: Example,
};

export default meta;
type Story = StoryObj<typeof Example>;

export const Primary: Story = {
  args: {
    text: "AnnotatorMenuItem",
    primary: true,
    disabled: false,
    size: "small",
    onClick: () => console.log("AnnotatorMenuItem"),
  },
};
export const Secondary: Story = {
  args: {
    text: "AnnotatorMenuItem",
    primary: false,
    disabled: false,
    size: "small",
    onClick: () => console.log("AnnotatorMenuItem"),
  },
};
