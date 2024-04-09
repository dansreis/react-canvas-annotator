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

export type CustomTransform = Transform & {
  target: fabric.Object & {
    __corner?: string;
    pathOffset?: { x: number; y: number };
    points?: fabric.Point[];
    setPositionByOrigin?: (
      pos: fabric.Point,
      originX: number,
      originY: number,
    ) => void;
  };
};
