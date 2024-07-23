import { CursorType } from "../../fabric/types";

export type CanvasObject = {
  id: string;
  category: string;
  color: string;
  value: string;
  selectable?: boolean;
  hoverCursor?: CursorType;
  moveCursor?: CursorType;
  coords: { x: number; y: number }[];
  opacity?: number;
  content?: string;
  numberFlag?: number;
  numberFlagSize?: number;
};
