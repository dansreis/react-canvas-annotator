import type { Meta, StoryObj } from "@storybook/react";
import ExampleMain from "./ExampleMain";

const meta: Meta<typeof ExampleMain> = {
  title: "AnnotatorCanvas",
  component: ExampleMain,
};

export default meta;
type Story = StoryObj<typeof ExampleMain>;

export const Primary: Story = {
  args: {
    text: "Button",
    primary: true,
    disabled: false,
    size: "small",
    onClick: () => console.log("Button"),
  },
};
export const Secondary: Story = {
  args: {
    text: "Button",
    primary: false,
    disabled: false,
    size: "small",
    onClick: () => console.log("Button"),
  },
};
