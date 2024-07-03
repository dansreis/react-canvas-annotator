// Types from FabricJS

import { Transform } from "fabric/fabric-impl";

export type TMat2D = [
  a: number,
  b: number,
  c: number,
  d: number,
  e: number,
  f: number,
];

export type CustomObject = fabric.Object & {
  __corner?: string;
  pathOffset?: { x: number; y: number };
  points?: fabric.Point[];
  oCoords: {
    [key: string]:
      | {
          x: number;
          y: number;
          corner: {
            tl: fabric.Point;
            tr: fabric.Point;
            bl: fabric.Point;
            br: fabric.Point;
          };
        }
      | undefined;
  };
  setPositionByOrigin?: (
    pos: fabric.Point,
    originX: number,
    originY: number,
  ) => void;
  _setPositionDimensions?: (o: unknown) => unknown; // TODO: Understand why this needs to be here. Migrate to 'setDimensions'.
};

export type CustomTransform = Transform & {
  target: CustomObject;
};

export type CanvasAnnotationState = {
  selection?: boolean;
  lastPosX: number;
  lastPosY: number;
  isDragging?: boolean;
  lastClickCoords?: { x: number; y: number };

  drawingObject?: {
    isDrawing: boolean;
    id?: string;
    type: "polygon" | "rectangle";
    cursor?: CursorType;
    points: { x: number; y: number }[];
  };
};

export type CursorType =
  | "auto"
  | "default"
  | "none"
  | "context-menu"
  | "help"
  | "pointer"
  | "progress"
  | "wait"
  | "cell"
  | "crosshair"
  | "text"
  | "vertical-text"
  | "alias"
  | "copy"
  | "move"
  | "no-drop"
  | "not-allowed"
  | "grab"
  | "grabbing"
  | "e-resize"
  | "n-resize"
  | "ne-resize"
  | "nw-resize"
  | "s-resize"
  | "se-resize"
  | "sw-resize"
  | "w-resize"
  | "ew-resize"
  | "ns-resize"
  | "nesw-resize"
  | "nwse-resize"
  | "col-resize"
  | "row-resize"
  | "all-scroll"
  | "zoom-in"
  | "zoom-out"
  | "revert";
