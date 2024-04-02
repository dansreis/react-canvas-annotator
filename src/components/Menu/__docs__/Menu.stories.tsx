import type { Meta, StoryObj } from "@storybook/react";
import Example from "./Example";
import React from "react";

const meta: Meta<typeof Example> = {
  title: "Menu",
  component: Example,
};

export default meta;
type Story = StoryObj<typeof Example>;

export const Primary: Story = {
  args: {
    primary: true,
    visible: true,
    items: [
      {
        icon: "circle",
        title: "Circle",
        content: (
          <div>
            <p>It is a circle</p>
            <ul>
              <li>Circle 1</li>
              <li>Circle 2</li>
              <li>Circle 3</li>
            </ul>
            <button>Click me (circle)!</button>
          </div>
        ),
        disabled: false,
      },
      {
        icon: "tags",
        title: "Tags",
        content: (
          <div>
            <p>It is a tag</p>
            <ul>
              <li>Tag 1</li>
              <li>Tag 2</li>
              <li>Tag 3</li>
            </ul>
            <button>Click me (tag)!</button>
          </div>
        ),
        disabled: false,
      },
      {
        icon: "annotation",
        title: "Annotation",
        content: (
          <div>
            <p>It is a annotation</p>
            <ul>
              <li>Annotation 1</li>
              <li>Annotation 2</li>
              <li>Annotation 3</li>
            </ul>
            <button>Click me (annotation)!</button>
          </div>
        ),
        disabled: true,
      },
      {
        icon: "coffee",
        title: "Coffee",
        content: (
          <div>
            <p>It is a coffee</p>
            <ul>
              <li>Coffee 1</li>
              <li>Coffee 2</li>
              <li>Coffee 3</li>
            </ul>
            <button>Click me (coffee)!</button>
          </div>
        ),
        disabled: false,
      },
    ],
  },
};
