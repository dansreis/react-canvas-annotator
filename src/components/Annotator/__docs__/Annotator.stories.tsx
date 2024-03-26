import type { Meta, StoryObj } from "@storybook/react";
import Example from "./Example";

const meta: Meta<typeof Example> = {
  title: "composed/Annotator",
  component: Example,
};

export default meta;
type Story = StoryObj<typeof Example>;

export const Primary: Story = {
  args: {
    text: "Annotator",
    primary: true,
    disabled: false,
    size: "small",
    onClick: () => console.log("Annotator"),
  },
};
export const Secondary: Story = {
  args: {
    text: "Annotator",
    primary: false,
    disabled: false,
    size: "small",
    onClick: () => console.log("Annotator"),
  },
};
