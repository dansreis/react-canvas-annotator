import type { Meta, StoryObj } from "@storybook/react";
import Example from "./Example";

const meta: Meta<typeof Example> = {
  title: "Header",
  component: Example,
};

export default meta;
type Story = StoryObj<typeof Example>;

export const Full: Story = {
  args: {
    primary: true,
    imageInfo: {
      width: 1920,
      height: 1080,
    },
    zoom: { value: 10, action: (e) => console.log(e) },
    annotation: { value: true, action: (e) => console.log(e) },
  },
};

export const Secondary: Story = {
  args: {
    ...Full.args,
    primary: false,
  },
};
