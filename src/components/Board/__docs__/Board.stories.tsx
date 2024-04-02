import type { Meta, StoryObj } from "@storybook/react";
import Example from "./Example";
import { CanvasObject } from "../types";

const meta: Meta<typeof Example> = {
  title: "Board",
  component: Example,
};

const ITEMS: CanvasObject[] = [
  {
    id: "1",
    category: "category1",
    color: "green",
    value: "⌀42",
    coords: [
      [55, 382],
      [128, 382],
      [128, 415],
      [55, 415],
    ],
  },
];

export default meta;
type Story = StoryObj<typeof Example>;

export const Main: Story = {
  args: {
    primary: true,
    imageSrc: "holder-min.jpg",
    items: ITEMS,
  },
};
