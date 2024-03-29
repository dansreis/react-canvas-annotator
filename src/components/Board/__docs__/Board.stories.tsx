import type { Meta, StoryObj } from "@storybook/react";
import ExampleMain from "./ExampleMain";

const meta: Meta<typeof ExampleMain> = {
  title: "Board",
  component: ExampleMain,
};

export default meta;
type Story = StoryObj<typeof ExampleMain>;

export const Primary: Story = {
  args: {
    text: "Board",
    primary: true,
    disabled: false,
    size: "small",
    onClick: () => console.log("Board"),
  },
};
export const Secondary: Story = {
  args: {
    text: "Board",
    primary: false,
    disabled: false,
    size: "small",
    onClick: () => console.log("Board"),
  },
};
