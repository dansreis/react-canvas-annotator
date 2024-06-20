import { fabric } from "fabric";
import * as fabricTypes from "./types";
import { IPolylineOptions } from "fabric/fabric-impl";
import CustomControl from "./controls/CustomControl";
import { DEFAULT_POLYLINE_OPTIONS } from "./const";

/**
 *
 * Transforms a coordinate into the original coordinate from input
 *
 * @param cInfo canvas width and height
 * @param iInfo image width and height
 * @param coord coord to transform
 * @param scaleRatio current zoom/scale
 * @returns
 */
export const toOriginalCoord = ({
  cInfo,
  iInfo,
  coord,
  scaleRatio,
}: {
  cInfo: {
    width: number;
    height: number;
  };
  iInfo: {
    width: number;
    height: number;
  };
  coord: fabric.Point;
  scaleRatio: number;
}) => {
  const unscaledX =
    (coord.x - cInfo.width / 2 + (iInfo.width * scaleRatio) / 2) / scaleRatio;
  const unscaledY =
    (coord.y - cInfo.height / 2 + (iInfo.height * scaleRatio) / 2) / scaleRatio;

  return { x: unscaledX, y: unscaledY };
};

/**
 *
 * Transforms a coordinate into a canvas-scaled coordinate, making it compatible for use within the canvas.
 *
 * @param cInfo canvas width and height
 * @param iInfo image width and height
 * @param coord coord to transform
 * @param scaleRatio current zoom/scale
 * @returns
 */
export const toScaledCoord = ({
  cInfo,
  iInfo,
  coord,
  scaleRatio,
}: {
  cInfo: {
    width: number;
    height: number;
  };
  iInfo: {
    width: number;
    height: number;
  };
  coord: { x: number; y: number };
  scaleRatio: number;
}) => {
  const x =
    cInfo.width / 2 - (iInfo.width * scaleRatio) / 2 + coord.x * scaleRatio;
  const y =
    cInfo.height / 2 - (iInfo.height * scaleRatio) / 2 + coord.y * scaleRatio;

  return { x, y };
};

/**
 *
 * Retrieves an object points in the canvas
 *
 * @param obj custom object
 * @returns
 */
export const pointsInCanvas = (obj?: fabricTypes.CustomObject) => {
  if (!obj) return [];
  return (
    obj.points?.map((p) => {
      const matrix = obj.calcOwnMatrix();
      const minX = Math.min(...obj.points!.map((_p) => _p.x));
      const minY = Math.min(...obj.points!.map((_p) => _p.y));
      const tmpPoint = new fabric.Point(
        p.x - minX - obj.width! / 2,
        p.y - minY - obj.height! / 2,
      );
      return fabric.util.transformPoint(tmpPoint, matrix);
    }) ?? []
  );
};

/**
 *
 * Retrieves all available objects in canvas
 *
 * @param canvas html canvas to look for the object
 * @returns
 */
export const retrieveObjects = <T extends fabric.Object>(
  canvas: fabric.Canvas,
) => {
  const obj = canvas.getObjects();
  return obj as T[] | undefined;
};

/**
 *
 * Finds an object in a canvas according to its name
 *
 * @param canvas html canvas to look for the object
 * @param name object identifier
 * @returns
 */
export const findObjectByName = <T extends fabric.Object>(
  canvas: fabric.Canvas,
  name?: string,
): T | undefined => {
  if (name === undefined) return undefined;
  const obj = canvas.getObjects().find((o) => o.name === name);
  return obj as T | undefined;
};

/**
 *
 * @param points array of points to create the polygon
 * @param options options of the polygon (fill, stroke, controls..)
 * @returns
 */
export const createControllableCustomObject = <
  T extends fabric.Polygon | fabric.Polyline,
>(
  FabricObj: new (
    points: Array<{ x: number; y: number }>,
    options?: IPolylineOptions,
  ) => T,
  points: { x: number; y: number }[],
  options?: IPolylineOptions,
  isRectangle?: boolean,
) => {
  const _options: fabric.IPolylineOptions = Object.assign(
    DEFAULT_POLYLINE_OPTIONS,
    options,
  );

  const controllableObject = new FabricObj(points, _options);
  if (isRectangle !== true && (controllableObject.points?.length ?? 0) > 0) {
    const controls = controllableObject.points?.reduce<{
      [key: string]: CustomControl;
    }>((acc, _point, index) => {
      acc["p" + index] = new CustomControl(
        {
          positionHandler: polygonPositionHandler,
          actionHandler: anchorWrapper(
            index > 0 ? index - 1 : controllableObject.points!.length - 1,
            actionHandler,
          ),
          actionName: "modifyPolygon",
        },
        index,
      );
      return acc;
    }, {});
    if (controls && Object.keys(controls).length > 0)
      controllableObject.controls = controls;
  }
  return controllableObject as unknown as fabricTypes.CustomObject; // TODO: Maybe we can do this in a better way
};

/**
 * Define a function that can locate the controls.
 * This function will be used both for drawing and for interaction.
 * More info: http://fabricjs.com/custom-controls-polygon
 */
export const polygonPositionHandler = function (
  this: CustomControl,
  _dim: { x: number; y: number },
  _finalMatrix: fabricTypes.TMat2D,
  fabricObject: fabric.Polyline,
) {
  const x =
    fabricObject!.points![this!.pointIndex!].x - fabricObject.pathOffset.x;
  const y =
    fabricObject!.points![this!.pointIndex!].y - fabricObject.pathOffset.y;

  // Ignore transformation if object doesn't exist
  if (!fabricObject?.canvas?.viewportTransform) {
    console.log(`Ignore the transformation! [objectId: ${fabricObject.name}]`);
    return new fabric.Point(0, 0);
  }
  return fabric.util.transformPoint(
    new fabric.Point(x, y),
    fabric.util.multiplyTransformMatrices(
      fabricObject.canvas.viewportTransform,
      fabricObject.calcTransformMatrix(),
    ),
  );
};

/**
 * More info: http://fabricjs.com/custom-controls-polygon
 */
export const getObjectSizeWithStroke = (object: fabric.Object) => {
  const stroke = new fabric.Point(
    object.strokeUniform ? 1 / object.scaleX! : 1,
    object.strokeUniform ? 1 / object.scaleY! : 1,
  ).multiply(object.strokeWidth!);
  return new fabric.Point(object.width! + stroke.x, object.height! + stroke.y);
};

/**
 * Define a function that will define what the control does
 * This function will be called on every mouse move after a control has been clicked and is being dragged.
 * The function receive as argument the mouse event, the current trasnform object and the current position in canvas coordinate
 * transform.target is a reference to the current object being transformed,
 *
 * More info: http://fabricjs.com/custom-controls-polygon
 */
export const actionHandler = (
  _eventData: MouseEvent,
  transform: fabricTypes.CustomTransform,
  x: number,
  y: number,
) => {
  const polygon = transform.target;
  const currentControl = polygon.controls[polygon.__corner!] as CustomControl;
  const mouseLocalPosition = polygon.toLocalPoint(
    new fabric.Point(x, y),
    "center",
    "center",
  );
  const polygonBaseSize = getObjectSizeWithStroke(polygon);
  const size = polygon._getTransformedDimensions(0, 0);
  const finalPointPosition = {
    x:
      (mouseLocalPosition.x * polygonBaseSize.x) / size.x +
      polygon.pathOffset!.x,
    y:
      (mouseLocalPosition.y * polygonBaseSize.y) / size.y +
      polygon.pathOffset!.y,
  };
  polygon.points![currentControl.pointIndex] = new fabric.Point(
    finalPointPosition.x,
    finalPointPosition.y,
  );
  return true;
};

/**
 * Define a function that can keep the polygon in the same position when we change its width/height/top/left.
 *
 * More info: http://fabricjs.com/custom-controls-polygon
 */
export const anchorWrapper = (
  anchorIndex: number,
  fn: (
    eventData: MouseEvent,
    transform: fabricTypes.CustomTransform,
    x: number,
    y: number,
  ) => boolean,
) => {
  return function (
    eventData: MouseEvent,
    transform: fabricTypes.CustomTransform,
    x: number,
    y: number,
  ) {
    const fabricObject = transform.target;

    // Ensure object has points and pathoffset
    if (!fabricObject.points || !fabricObject.pathOffset) return false;

    const point = new fabric.Point(
      fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x,
      fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y,
    );
    const absolutePoint = fabric.util.transformPoint(
      point,
      fabricObject.calcTransformMatrix(),
    );
    const actionPerformed = fn(eventData, transform, x, y);
    fabricObject._setPositionDimensions?.({}); // TODO: Understand why this needs to be here. Migrate to 'setDimensions'.
    const polygonBaseSize = getObjectSizeWithStroke(fabricObject);
    const newX =
      (fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x) /
      polygonBaseSize.x;
    const newY =
      (fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y) /
      polygonBaseSize.y;
    fabricObject.setPositionByOrigin(absolutePoint, newX + 0.5, newY + 0.5);
    return actionPerformed;
  };
};

export const isCoordInsideCoords = (
  point: { x: number; y: number },
  vertices: {
    tl: { x: number; y: number };
    tr: { x: number; y: number };
    bl: { x: number; y: number };
    br: { x: number; y: number };
  },
) => {
  const { tl, tr, bl } = vertices;
  let isInside = false;

  // Check if the point is inside the rectangle formed by the vertices
  if (point.x > tl.x && point.x < tr.x && point.y > tl.y && point.y < bl.y) {
    isInside = true;
  }

  return isInside;
};

export const getBoundingBox = (points: { x: number; y: number }[]) => {
  if (points.length === 0) {
    return { left: 0, top: 0, width: 0, height: 0 };
  }

  let minX = points[0].x;
  let maxX = points[0].x;
  let minY = points[0].y;
  let maxY = points[0].y;

  points.forEach((point) => {
    if (point.x < minX) minX = point.x;
    if (point.x > maxX) maxX = point.x;
    if (point.y < minY) minY = point.y;
    if (point.y > maxY) maxY = point.y;
  });

  return {
    left: minX,
    top: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
};
