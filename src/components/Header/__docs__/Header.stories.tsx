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
    primary: true,
    items: [
      { icon: "hand", text: "Move", onClick: () => console.log("Move") },
      {
        icon: "pointer",
        text: "Pointer",
        onClick: () => console.log("Pointer"),
      },
      {
        icon: "rectangle",
        text: "Annotate",
        onClick: () => console.log("Annotate"),
      },
    ],
  },
};

export const Secondary: Story = {
  args: {
    ...Primary.args,
    primary: false,
  },
};
