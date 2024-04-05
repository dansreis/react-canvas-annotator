import { fabric } from "fabric";

export const toPolygon = (object: fabric.Polyline) => {
  return new fabric.Polygon(object.points!, {
    name: object.name,
    fill: object.fill,
    stroke: object.stroke,
    strokeWidth: object.strokeWidth,
    hasBorders: object.hasBorders,
    hasControls: object.hasControls,
  });
};
