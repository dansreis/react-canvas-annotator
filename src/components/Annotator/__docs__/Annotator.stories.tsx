import type { Meta, StoryObj } from "@storybook/react";
import Example from "./Example";

const meta: Meta<typeof Example> = {
  title: "composite/Annotator",
  component: Example,
};

export default meta;
type Story = StoryObj<typeof Example>;

export const Primary: Story = {
  args: {
    id: "AnnotatorPrimary",
    primary: true,
  },
};
export const Secondary: Story = {
  args: {
    id: "AnnotatorSecondary",
    primary: false,
  },
};
