import { fabric } from "fabric";
import * as fabricTypes from "./fabricTypes";
import { IPolylineOptions } from "fabric/fabric-impl";

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

/**
 *
 * Deletes all objects from the canvas
 *
 * @param canvas fabricjs HTML canvas
 */
export const deleteAll = (canvas: fabric.Canvas) => {
  canvas?.getObjects().forEach((o) => canvas?.remove(o));
  canvas?.discardActiveObject();
  canvas?.renderAll();
};

/**
 *
 * Deletes all selected objects from the canvas
 *
 * @param canvas fabricjs HTML canvas
 */
export const deleteSelected = (canvas: fabric.Canvas) => {
  const activeObjects = canvas.getActiveObjects();
  if (activeObjects) {
    activeObjects.forEach((activeObject) => {
      canvas.remove(activeObject);
    });
    canvas.discardActiveObject();
  }
};

/**
 *
 * Applies an input image to a canvas and downloads the image from it. (TODO: later on it will be downloaded with the annotations if specified)
 *
 * @param image properties and resources
 */
export const canvasImageDownload = (image: { name: string; src: string }) => {
  // Create a temporary canvas to compose original image and annotations
  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d")!;

  // Get the original image data from the canvas
  const originalImageSrc = image.src; // Provide the path to your original image
  const originalImage = new Image();
  originalImage.src = originalImageSrc;

  // Wait for the original image to load before composing
  originalImage.onload = function () {
    // Set the size of the temporary canvas to match the original image
    tempCanvas.width = originalImage.width;
    tempCanvas.height = originalImage.height;

    // Draw the original image onto the temporary canvas
    tempCtx.drawImage(originalImage, 0, 0);

    // Get the Fabric.js canvas instance
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    // const canvas = editor?.canvas!;
    // const fabricCanvas = canvas.getObjects();
    // console.log(fabricCanvas[0]);

    // items.forEach((item) => {
    //   const polygon = new fabric.Polygon(item.coords, {
    //     name: `ID_${item.id}`,
    //     fill: undefined,
    //     stroke: "red",
    //     strokeWidth: 1,
    //   });
    //   // tempCtx.save();
    //   polygon.render(tempCtx);
    //   // tempCtx.restore();
    // });

    // Loop through all objects on the Fabric.js canvas and draw them onto the temporary canvas
    // fabricCanvas.forEach((obj) => {
    //   const scaleFactorX = tempCanvas.width / canvas.width!;
    //   const scaleFactorY = tempCanvas.height / canvas.height!;

    //   console.log({ scaleFactorX, scaleFactorY });

    //   // Adjust top and left positions based on the scale
    //   const left = obj.left! * scaleFactorX;
    //   const top = obj.top! * scaleFactorY;

    //   tempCtx.save();
    //   tempCtx.translate(0, 0);
    //   tempCtx.scale(scaleFactorX, scaleFactorY);
    //   obj.render(tempCtx);
    //   tempCtx.restore();
    // });

    // Convert the composed image on the temporary canvas to a data URL
    const composedDataURL = tempCanvas.toDataURL("image/png");

    // Create a temporary anchor element
    const link = document.createElement("a");
    link.href = composedDataURL;
    link.download = image.name; // Set the desired filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
};

/**
 *
 * Finds an object in a canvas according to its name
 *
 * @param canvas html canvas to look for the object
 * @param name object identifier
 * @returns
 */
export const findObjectByName = (canvas: fabric.Canvas, name: string) => {
  return canvas.getObjects().find((o) => o.name === name);
};

/**
 *
 * Deletes an object by its name
 *
 * @param canvas html canvas to look for the object
 * @param name object identifier
 */
export const deleteObjectByName = (canvas: fabric.Canvas, name: string) => {
  const obj = findObjectByName(canvas, name);
  if (obj) canvas.remove(obj);
};

/**
 *
 * Deletes an object
 *
 * @param canvas html canvas to look for the object
 * @param obj object to delete
 */
export const deleteObject = (canvas: fabric.Canvas, obj: fabric.Object) => {
  if (obj) canvas.remove(obj);
};

// TODO: Maybe remove this 'createPolygon' from here. Replace with 'createRect'.
/**
 *
 * @param name name of the object
 * @param points array of points to create the polygon
 * @param options options of the polygon (fill, stroke, controls..)
 * @param isPolyline if it should create a the polygon as a  polyline
 * @returns
 */
export const createPolygon = ({
  name,
  points,
  options,
  isPolyline = false,
}: {
  name: string;
  points: { x: number; y: number }[];
  options?: {
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    hasBorders?: boolean;
    hasControls?: boolean;
  };
  isPolyline?: boolean;
}) => {
  // Merge default options with user input
  const _options = Object.assign(
    {
      fill: "rgba(255,0,0,0.4)",
      stroke: "red",
      strokeWidth: 2,
      hasBorders: false,
      hasControls: false,
    },
    options,
  );
  if (isPolyline) {
    return new fabric.Polyline(points, {
      name,
      ..._options,
    });
  }
  return new fabric.Polygon(points, {
    name,
    ..._options,
  });
};

// TODO: Finish method
export const createControllableObject = <T = fabric.Polygon | fabric.Polyline>(
  FabricObj: new (
    points: Array<{ x: number; y: number }>,
    options?: IPolylineOptions,
  ) => T,
  points: { x: number; y: number }[],
  options?: IPolylineOptions,
) => {
  return new FabricObj(points, options);
};

/**
 * Custom FabricJS Control class with extra pointIndex
 */
export class CustomControl extends fabric.Control {
  // Add an extra field pointIndex
  pointIndex: number;

  // Override the constructor to include the new field
  constructor(options: Partial<fabric.Control>, pointIndex: number) {
    // Call the constructor of the base class
    super(options);

    // Initialize the new field
    this.pointIndex = pointIndex;
  }
}

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
  return fabric.util.transformPoint(
    new fabric.Point(x, y),
    fabric.util.multiplyTransformMatrices(
      fabricObject!.canvas!.viewportTransform!,
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
