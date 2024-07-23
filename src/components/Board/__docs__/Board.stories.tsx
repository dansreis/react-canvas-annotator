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
      {
        x: 133,
        y: 460,
      },
      {
        x: 206,
        y: 460,
      },
      {
        x: 206,
        y: 493,
      },
      {
        x: 133,
        y: 493,
      },
    ],
  },
  {
    id: "2",
    category: "category2",
    color: "green",
    value: "38",
    coords: [
      {
        x: 150,
        y: 1064,
      },
      {
        x: 182,
        y: 1064,
      },
      {
        x: 182,
        y: 1111,
      },
      {
        x: 150,
        y: 1111,
      },
    ],
  },
  {
    id: "3",
    category: "category3",
    color: "green",
    value: "9",
    coords: [
      {
        x: 235,
        y: 1207,
      },
      {
        x: 266,
        y: 1207,
      },
      {
        x: 266,
        y: 1226,
      },
      {
        x: 235,
        y: 1226,
      },
    ],
  },
  {
    id: "4",
    category: "category4",
    color: "green",
    value: "⌀38",
    coords: [
      {
        x: 481,
        y: 1375,
      },
      {
        x: 556,
        y: 1375,
      },
      {
        x: 556,
        y: 1407,
      },
      {
        x: 481,
        y: 1407,
      },
    ],
  },
  {
    id: "5",
    category: "category5",
    color: "green",
    value: "(25.5)",
    coords: [
      {
        x: 1370,
        y: 1405,
      },
      {
        x: 1473,
        y: 1406,
      },
      {
        x: 1472,
        y: 1444,
      },
      {
        x: 1369,
        y: 1442,
      },
    ],
  },
  {
    id: "6",
    category: "category6",
    color: "green",
    value: "1x45°",
    coords: [
      {
        x: 732,
        y: 1277,
      },
      {
        x: 735,
        y: 1381,
      },
      {
        x: 702,
        y: 1382,
      },
      {
        x: 699,
        y: 1278,
      },
    ],
  },
  {
    id: "7",
    category: "category7",
    color: "green",
    value: "1x45°",
    coords: [
      {
        x: 740,
        y: 795,
      },
      {
        x: 738,
        y: 895,
      },
      {
        x: 705,
        y: 894,
      },
      {
        x: 707,
        y: 794,
      },
    ],
  },
  {
    id: "8",
    category: "category8",
    color: "green",
    value: "16",
    coords: [
      {
        x: 943,
        y: 1024,
      },
      {
        x: 945,
        y: 976,
      },
      {
        x: 979,
        y: 978,
      },
      {
        x: 977,
        y: 1025,
      },
    ],
  },
  {
    id: "9",
    category: "category9",
    color: "green",
    value: "45.0°",
    coords: [
      {
        x: 821,
        y: 1093,
      },
      {
        x: 855,
        y: 1182,
      },
      {
        x: 817,
        y: 1197,
      },
      {
        x: 783,
        y: 1108,
      },
    ],
  },
  {
    id: "10",
    category: "category10",
    color: "green",
    value: "⌀21.5±0.1",
    coords: [
      {
        x: 943,
        y: 1341,
      },
      {
        x: 1122,
        y: 1343,
      },
      {
        x: 1121,
        y: 1380,
      },
      {
        x: 942,
        y: 1378,
      },
    ],
  },
  {
    id: "11",
    category: "category11",
    color: "green",
    value: "60.0°",
    coords: [
      {
        x: 925,
        y: 1556,
      },
      {
        x: 963,
        y: 1538,
      },
      {
        x: 1004,
        y: 1627,
      },
      {
        x: 966,
        y: 1644,
      },
    ],
  },
  {
    id: "12",
    category: "category12",
    color: "green",
    value: "⌀38H12",
    coords: [
      {
        x: 1317,
        y: 749,
      },
      {
        x: 1317,
        y: 782,
      },
      {
        x: 1163,
        y: 782,
      },
      {
        x: 1163,
        y: 749,
      },
    ],
  },
];

export default meta;
type Story = StoryObj<typeof Example>;

export const Main: Story = {
  args: {
    image: { name: "holder-min", src: "holder-min.jpg" },
    items: ITEMS.map((el, index) => {
      return { ...el, numberFlag: index, numberFlagSize: 5 };
    }),
  },
};
