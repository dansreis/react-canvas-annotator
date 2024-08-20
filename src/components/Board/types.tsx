import { CursorType } from "../../fabric/types";

export type CanvasObject = {
  id: string;
  category: string;
  borderColor: string;
  fillColor: string;
  value: string;
  selectable?: boolean;
  hoverCursor?: CursorType;
  moveCursor?: CursorType;
  coords: { x: number; y: number }[];
  opacity?: number;
  content?: string;
  numberFlag?: number;
  numberFlagSize?: number;
  numberFlagPosition?:
    | "topLeft"
    | "top"
    | "topRight"
    | "left"
    | "right"
    | "bottomLeft"
    | "bottom"
    | "bottomRight";
};
