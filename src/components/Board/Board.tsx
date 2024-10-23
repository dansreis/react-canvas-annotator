import React, { useCallback, useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { v4 as uuidv4 } from "uuid";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import { CanvasObject } from "./types";
import * as fabricUtils from "../../fabric/utils";
import * as fabricActions from "../../fabric/actions";
import * as fabricTypes from "../../fabric/types";
import _ from "lodash";
import { Canvas } from "fabric/fabric-impl";

export type BoardProps = {
  items: CanvasObject[];
  image: { name: string; src: string };
  initialStatus?: {
    draggingEnabled?: boolean;
    currentZoom?: number;
    scaleRatio?: number;
  };
  helper: (id: string, content?: string) => React.ReactNode;
  onResetZoom?: () => void;
  onMovingNumberFlag?: (item: CanvasObject, newPosition: string) => void;
  onSelectItem?: (item: fabric.Object | null) => void;
  onZoomChange?: (currentZoom: number) => void;
  onLoadedImage?: ({
    width,
    height,
  }: {
    width: number;
    height: number;
  }) => void;
  onItemHover?: ({ id }: { id: string | null }) => void;
  cornerStrokeColor?: string;
};

export type BoardActions = {
  resetZoom: () => void;
  deleteSelectedObjects: () => void;
  deleteObjectById: (id: string) => void;
  jumpToId: (
    id: string,
    setActive?: boolean,
    zoomInto?: boolean,
    scaleFactorPercentage?: number,
  ) => void;
  deselectAll: () => void;
  getAnnotatedImageAsBase64: (
    ids?: string[],
    maxSizeInMB?: number,
  ) => Promise<string | undefined>;
  drawObject: (type?: "rectangle" | "polygon") => void;
  retrieveObjects: (includeContent?: boolean) => CanvasObject[];
  retrieveObjectContent: (
    id: string,
  ) => { angle: number; content: string | undefined } | null;
  retrieveLastPointerPosition: () => { x: number; y: number };
};

const Board = React.forwardRef<BoardActions, BoardProps>(
  (
    {
      image,
      initialStatus,
      items,
      onResetZoom,
      onMovingNumberFlag,
      onZoomChange,
      onSelectItem,
      onLoadedImage,
      onItemHover,
      helper,
      cornerStrokeColor,
    },
    ref,
  ) => {
    // Set board actions
    React.useImperativeHandle(ref, () => ({
      retrieveLastPointerPosition() {
        return lastPointerPosition.current;
      },
      resetZoom() {
        editor?.canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
        setCurrentZoom(100);
        onResetZoom?.();
      },
      retrieveObjectContent(id: string) {
        if (editor?.canvas) {
          const obj = fabricUtils.findObjectByName(editor.canvas, id);
          return obj
            ? {
                angle: obj.angle ?? 0,
                content: getObjectInfo(obj as fabricTypes.CustomObject).content,
              }
            : null;
        }
        return null;
      },
      deselectAll() {
        editor?.canvas.discardActiveObject();
      },
      deleteSelectedObjects() {
        const canvas = editor?.canvas;
        if (canvas) fabricActions.deleteSelected(canvas);
      },
      deleteObjectById(id: string) {
        const canvas = editor?.canvas;
        if (canvas) {
          canvas.discardActiveObject();
          fabricActions.deleteObjectByName(canvas, id);
        }
      },
      jumpToId(
        id: string,
        setActive?: boolean,
        zoomInto?: boolean,
        scaleFactorPercentage?: number,
      ) {
        const canvas = editor?.canvas;
        if (!canvas) return;

        const object = fabricUtils.findObjectByName(canvas, id);
        if (!object) return;

        if (zoomInto === true) {
          canvas.setZoom(1);
          const boundingBox = object.getBoundingRect();

          const canvasWidth = canvas.getWidth();
          const canvasHeight = canvas.getHeight();
          // Calculate the scaling factor needed to fit the polygon within the canvas
          const scaleX = canvasWidth / boundingBox.width;
          const scaleY = canvasHeight / boundingBox.height;
          // Use the smaller scale factor to ensure the polygon fits within the canvas
          const maxScaleFactor = Math.min(scaleX, scaleY);
          // Adjust the scale factor to the desired percentage (50% in this case)
          const adjustedScaleFactor =
            maxScaleFactor * (scaleFactorPercentage ?? 0.3);
          // Set the canvas zoom level
          canvas.setZoom(adjustedScaleFactor);
        }

        // Get the object's center point
        const objectCenter = object.getCenterPoint();

        // Get the canvas dimensions
        const canvasWidth = canvas.getWidth();
        const canvasHeight = canvas.getHeight();

        // Calculate the new viewport transform
        const vpt = canvas.viewportTransform;
        if (!vpt) return;

        vpt[4] = canvasWidth / 2 - objectCenter.x * vpt[0];
        vpt[5] = canvasHeight / 2 - objectCenter.y * vpt[3];

        // Apply the new viewport transform
        canvas.setViewportTransform(vpt);

        // Render the canvas
        canvas.renderAll();
        if (setActive === true) {
          // Optionally, you can also select the object
          canvas.setActiveObject(object);
        }
      },
      drawObject(type?: "rectangle" | "polygon") {
        setSelectedObjectId(null);
        const canvas = editor?.canvas;
        canvas?.getObjects().forEach((obj) => {
          obj.off("deselected");
        });
        setObjectHelper({ enabled: false, top: 0, left: 0 });
        if (!type) {
          resetDrawingObject();
          setIsInDrawingMode(false);
          return;
        }
        setIsInDrawingMode(true);
        const isDrawing = !drawingObject?.isDrawing;
        if (isDrawing) {
          const polygonId = uuidv4();
          setDrawingObject({
            id: polygonId,
            type: type ?? "polygon",
            isDrawing: true,
            points: [],
          });
        } else {
          resetDrawingObject();
        }
      },
      async getAnnotatedImageAsBase64(
        annotationIds?: string[],
        maxSizeInMB?: number,
      ) {
        // Create a temporary canvas element
        const tempCanvasElement = document.createElement("canvas");
        tempCanvasElement.width = imageSize.width;
        tempCanvasElement.height = imageSize.height;

        // Create a Fabric.js canvas instance
        const tempCanvas = new fabric.Canvas(tempCanvasElement);

        // Load the background image into the temporary canvas
        await new Promise<void>((resolve) => {
          fabric.Image.fromURL(
            image.src,
            (img) => {
              tempCanvas.setBackgroundImage(
                img,
                tempCanvas.renderAll.bind(tempCanvas),
                {
                  scaleX: 1,
                  scaleY: 1,
                  originX: "left",
                  originY: "top",
                  stroke: "black",
                  strokeWidth: 1,
                },
              );
              resolve();
            },
            { crossOrigin: "anonymous" },
          );
        });

        // Filter items based on annotationIds if provided
        const itemsToRender = annotationIds
          ? items.filter((item) =>
              annotationIds.map((el) => el.split("_").at(-1)).includes(item.id),
            )
          : items;

        // Add annotations to the temporary canvas
        itemsToRender.forEach((item) => {
          let fabricObject: fabric.Object;

          if (item.coords.length === 4) {
            // Create a rectangle
            const [p1, p2, p3, p4] = item.coords;
            const width = Math.hypot(p2.x - p1.x, p2.y - p1.y);
            const height = Math.hypot(p4.x - p1.x, p4.y - p1.y);
            const centerX = (p1.x + p2.x + p3.x + p4.x) / 4;
            const centerY = (p1.y + p2.y + p3.y + p4.y) / 4;
            const angle =
              (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180) / Math.PI;

            fabricObject = new fabric.Rect({
              left: centerX,
              top: centerY,
              width: width,
              height: height,
              fill: item.fillColor,
              stroke: item.borderColor,
              strokeWidth: 1,
              selectable: false,
              angle: angle,
              originX: "center",
              originY: "center",
            });
          } else {
            // Create a polygon
            fabricObject = new fabric.Polygon(item.coords, {
              fill: item.fillColor,
              stroke: item.borderColor,
              strokeWidth: 1,
              selectable: false,
            });
          }

          // Add corner object if it exists
          if (item.numberFlag !== null && item.numberFlag !== undefined) {
            const cornerGroup = createCornerGroup(
              item,
              fabricObject,
              item.coords,
              "green",
              true,
            );
            tempCanvas.add(cornerGroup);
          }
        });

        // Render the canvas
        tempCanvas.renderAll();

        // Export the canvas as a Base64 PNG image
        const dataURL = tempCanvasElement.toDataURL("image/png");

        // Optionally, crop white borders if needed
        const croppedDataURL = await cropWhiteBorders(dataURL);
        const resizedBase64 = await fabricUtils.compressBase64Image(
          croppedDataURL,
          maxSizeInMB ?? 1,
        );
        return resizedBase64;
      },

      retrieveObjects: (includeContent: boolean = false) => {
        const canvas = editor?.canvas;
        if (canvas) {
          const customObjects =
            fabricUtils.retrieveObjects<fabricTypes.CustomObject>(canvas);
          if (!customObjects) return [];
          return customObjects
            .filter((el) => el.name)
            .map((co) => {
              const info = getObjectInfo(co, includeContent);

              return {
                id: co.name!,
                category: "TODO_category",
                borderColor: "TODO_color",
                fillColor: "TODO_color",
                value: "TODO_value",
                coords: info.coords,
                content: info.content ?? undefined,
              };
            });
        }
        return [];
      },
    }));
    async function cropWhiteBorders(base64Image: string) {
      return await new Promise<string>((resolve, reject) => {
        const img = new Image();
        img.onload = function () {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = img.width;
          canvas.height = img.height;
          ctx!.drawImage(img, 0, 0);

          const imageData = ctx!.getImageData(
            0,
            0,
            canvas.width,
            canvas.height,
          );
          const data = imageData.data;

          let minX = canvas.width;
          let minY = canvas.height;
          let maxX = 0;
          let maxY = 0;

          // Find the boundaries of non-white content
          for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
              const red = data[(y * canvas.width + x) * 4];
              const green = data[(y * canvas.width + x) * 4 + 1];
              const blue = data[(y * canvas.width + x) * 4 + 2];
              const alpha = data[(y * canvas.width + x) * 4 + 3];

              if (
                red !== 255 ||
                green !== 255 ||
                blue !== 255 ||
                alpha !== 255
              ) {
                minX = Math.min(minX, x);
                minY = Math.min(minY, y);
                maxX = Math.max(maxX, x);
                maxY = Math.max(maxY, y);
              }
            }
          }

          // Create a new canvas with the cropped dimensions
          const croppedCanvas = document.createElement("canvas");
          const croppedCtx = croppedCanvas.getContext("2d");
          croppedCanvas.width = maxX - minX + 1;
          croppedCanvas.height = maxY - minY + 1;

          // Draw the cropped image
          croppedCtx!.drawImage(
            canvas,
            minX,
            minY,
            croppedCanvas.width,
            croppedCanvas.height,
            0,
            0,
            croppedCanvas.width,
            croppedCanvas.height,
          );

          // Convert back to base64
          const croppedBase64 = croppedCanvas.toDataURL();
          resolve(croppedBase64);
        };
        img.onerror = reject;
        img.src = base64Image;
      });
    }
    const { editor, onReady } = useFabricJSEditor();

    const [savedItems, setSavedItems] = useState<CanvasObject[]>([]);
    const [selectedObjectId, setSelectedObjectId] = useState<string | null>(
      null,
    );

    const [originalFabricImage, setOriginalFabricImage] =
      useState<fabric.Image>();

    const [currentZoom, setCurrentZoom] = useState<number>(
      initialStatus?.currentZoom || 100,
    );

    const [scaleRatio, setScaleRation] = useState(
      initialStatus?.scaleRatio || 100,
    );

    const [imageSize, setImageSize] = useState({
      width: 0,
      height: 0,
    });

    const lastPointerPosition = useRef({
      x: 0,
      y: 0,
    });

    const [isInDrawingMode, setIsInDrawingMode] = useState(false);

    const [objectHelper, setObjectHelper] = useState<{
      left: number;
      top: number;
      enabled: boolean;
      object?: fabricTypes.CustomObject;
    }>({ left: 0, top: 0, enabled: false });

    const [drawingObject, setDrawingObject] = useState<
      NonNullable<fabricTypes.CanvasAnnotationState["drawingObject"]>
    >({ isDrawing: false, type: "polygon", points: [] });

    const resetDrawingObject = useCallback(() => {
      const state: fabricTypes.CanvasAnnotationState["drawingObject"] = {
        isDrawing: false,
        type: "polygon",
        points: [],
      };
      (
        editor?.canvas as unknown as fabricTypes.CanvasAnnotationState
      ).drawingObject = state;
      setDrawingObject(state);
    }, [editor?.canvas]);

    const getObjectInfo = (
      obj: fabricTypes.CustomObject,
      includeContent = true,
    ) => {
      const width1 = editor?.canvas.getWidth() ?? 0;
      const height1 = editor?.canvas.getHeight() ?? 0;
      const updatedCoordPoints = fabricUtils.pointsInCanvas(obj);
      const updatedCoords = updatedCoordPoints.map((p) =>
        fabricUtils.toOriginalCoord({
          cInfo: {
            width: width1,
            height: height1,
          },
          iInfo: imageSize,
          coord: p,
          scaleRatio,
        }),
      );
      // Assume updatedCoords is an array of points [{ x: Number, y: Number }, ...]
      const p0 = updatedCoords[0];
      const p1 = updatedCoords[1];
      const p2 = updatedCoords[2];

      // Calculate the angle between the first two points
      const angle = Math.atan2(p1.y - p0.y, p1.x - p0.x);

      // Function to calculate the distance between two points
      function distance(
        pA: {
          x: number;
          y: number;
        },
        pB: {
          x: number;
          y: number;
        },
      ) {
        return Math.hypot(pB.x - pA.x, pB.y - pA.y);
      }

      // Calculate the width and height of the rotated area
      const width = distance(p0, p1);
      const height = distance(p1, p2);

      // Calculate the center point of the polygon
      const centerX = (p0.x + p2.x) / 2;
      const centerY = (p0.y + p2.y) / 2;

      // Create an off-screen canvas with the dimensions of the rotated area
      const offscreenCanvas = document.createElement("canvas");
      offscreenCanvas.width = width;
      offscreenCanvas.height = height;

      const ctx = offscreenCanvas.getContext("2d");

      // Function to transform points according to the canvas transformations
      function transformPoint(p: { x: number; y: number }) {
        // Translate points to the origin (center of the polygon)
        const x = p.x - centerX;
        const y = p.y - centerY;

        // Rotate points by the negative angle to align them vertically
        const sin = Math.sin(-angle);
        const cos = Math.cos(-angle);

        const xRotated = x * cos - y * sin;
        const yRotated = x * sin + y * cos;

        // Translate points to the canvas coordinate system
        const xTransformed = xRotated + width / 2;
        const yTransformed = yRotated + height / 2;

        return { x: xTransformed, y: yTransformed };
      }

      // Transform the updatedCoords to match the canvas coordinate system
      const transformedCoords = updatedCoords.map(transformPoint);

      // Define the clipping path using the transformed coordinates
      ctx!.beginPath();
      transformedCoords.forEach((point, index) => {
        if (index === 0) {
          ctx!.moveTo(point.x, point.y);
        } else {
          ctx!.lineTo(point.x, point.y);
        }
      });
      ctx!.closePath();
      ctx!.clip();

      // Apply transformations to the context to align the image correctly
      ctx!.translate(width / 2, height / 2);
      ctx!.rotate(-angle);
      ctx!.translate(-centerX, -centerY);

      // Draw the original image onto the transformed context
      ctx!.drawImage(originalFabricImage!.getElement(), 0, 0);

      // Export the rotated and cropped image
      const dataURL = offscreenCanvas.toDataURL();

      return {
        coords: updatedCoords,
        content: includeContent ? dataURL : undefined,
      };
    };

    const updateObjectHelper = (object?: fabric.Object) => {
      if (!object) return;
      const helper = fabricUtils.getObjectHelperCoords(object);
      setObjectHelper({
        left: helper.left,
        top: helper.top,
        enabled: true,
        object: object as fabricTypes.CustomObject,
      });
    };

    const findPositionCoords = (
      points: { x: number; y: number }[],
      position:
        | "topLeft"
        | "top"
        | "topRight"
        | "left"
        | "right"
        | "bottomLeft"
        | "bottom"
        | "bottomRight",
    ) => {
      // First, find the extreme points
      const topLeft = points.reduce((a, b) => (a.x + a.y < b.x + b.y ? a : b));
      const topRight = points.reduce((a, b) => (b.y - b.x < a.y - a.x ? b : a));
      const bottomLeft = points.reduce((a, b) =>
        b.y - b.x > a.y - a.x ? b : a,
      );
      const bottomRight = points.reduce((a, b) =>
        b.x + b.y > a.x + a.y ? b : a,
      );

      // Function to find midpoint between two points
      const midpoint = (
        p1: { x: number; y: number },
        p2: { x: number; y: number },
      ) => ({
        x: (p1.x + p2.x) / 2,
        y: (p1.y + p2.y) / 2,
      });

      const topMid = midpoint(topLeft, topRight);
      const leftMid = midpoint(topLeft, bottomLeft);
      const rightMid = midpoint(topRight, bottomRight);
      const bottomMid = midpoint(bottomLeft, bottomRight);
      switch (position) {
        case "topLeft":
          return topLeft;
        case "top":
          return topMid;
        case "topRight":
          return topRight;
        case "left":
          return leftMid;
        case "right":
          return rightMid;
        case "bottomLeft":
          return bottomLeft;
        case "bottom":
          return bottomMid;
        case "bottomRight":
          return bottomRight;
      }
    };

    function getAngleBetweenPoints(
      point1: fabric.Point,
      point2: fabric.Point,
    ): number {
      // Calculate the differences in x and y coordinates
      const dx = point2.x - point1.x;
      const dy = point2.y - point1.y;

      // Calculate the angle using Math.atan2
      let angle = Math.atan2(dy, dx);

      // Convert the angle from radians to degrees
      angle = angle * (180 / Math.PI);

      // Normalize the angle to be between 0 and 360 degrees
      if (angle < 0) {
        angle += 360;
      }

      return angle;
    }

    const createCornerGroup = useCallback(
      (
        item: CanvasObject,
        polygon: fabric.Object,
        scaledCoords: {
          x: number;
          y: number;
        }[],

        color?: string,
        forExport?: boolean,
      ) => {
        const index = item.numberFlag ?? 0;
        const position = item.numberFlagPosition;

        if (!color) color = "green";
        let _size = item.numberFlagSize ?? 0;
        _size = _size * 3 * (!forExport ? scaleRatio ?? 100 : 1);
        const polygonCoords = findPositionCoords(
          scaledCoords,
          position ?? "bottomRight",
        );

        const [leftCircleAndTextCoord, topCircleAndTextCoord] =
          fabricUtils.getLeftAndTopCircleAndTextCoords(
            position ?? "bottomRight",
            _size,
            polygonCoords,
            true,
          );

        const pointerAngle =
          getAngleBetweenPoints(
            new fabric.Point(leftCircleAndTextCoord, topCircleAndTextCoord),
            polygon.getCenterPoint(),
          ) + 90;

        // Calculate the direction vector
        const dx = polygon.getCenterPoint().x - leftCircleAndTextCoord;
        const dy = polygon.getCenterPoint().y - topCircleAndTextCoord;

        // Calculate the unit vector
        const length = Math.sqrt(dx * dx + dy * dy);
        const unitX = dx / length;
        const unitY = dy / length;

        // Calculate the new point coordinates

        const circle = new fabric.Circle({
          radius: _size / 2,
          fill: "white",
          stroke: color,
          strokeWidth: _size * 0.05,
          originX: "center",
          originY: "center",
          left: leftCircleAndTextCoord,
          top: topCircleAndTextCoord,
        });

        const text = new fabric.Text(index.toString(), {
          fontSize: _size / 2,
          fontFamily: "Arial",
          originX: "center",
          originY: "center",
          fill: "black",
          left: leftCircleAndTextCoord,
          top: topCircleAndTextCoord,
        });

        const pointer = new fabric.Triangle({
          width: _size / 3,
          height: _size / 3,
          fill: color,
          stroke: color,
          strokeWidth: _size * 0.15,
          originX: "center",
          originY: "center",
          left: fabricUtils.pointerLeft(
            position ?? "bottomRight",
            _size,
            unitX,
            polygonCoords,
          ),
          top: fabricUtils.pointerTop(
            position ?? "bottomRight",
            _size,
            unitY,
            polygonCoords,
          ),
          angle: pointerAngle,
        });

        const group = new fabric.Group([pointer, circle, text], {
          name:
            "corner_position" +
            position +
            "_size" +
            item.numberFlagSize +
            "_" +
            item.id,
        });
        group.setControlsVisibility({
          mt: false, // Middle top control
          mb: false, // Middle bottom control
          ml: false, // Middle left control
          mr: false, // Middle right control
          bl: false, // Bottom left corner
          br: false, // Bottom right corner
          tl: false, // Top left corner
          tr: false, // Top right corner
          mtr: false, // Rotation control
        });
        const positionMap = [
          "topLeft",
          "top",
          "topRight",
          "left",
          "right",
          "bottomLeft",
          "bottom",
          "bottomRight",
        ].map((el) => {
          return {
            position: el,
            coords: [
              fabricUtils.pointerLeft(
                el as
                  | "topLeft"
                  | "top"
                  | "topRight"
                  | "left"
                  | "right"
                  | "bottomLeft"
                  | "bottom"
                  | "bottomRight",
                _size,
                unitX,
                polygonCoords,
              ),
              fabricUtils.pointerTop(
                el as
                  | "topLeft"
                  | "top"
                  | "topRight"
                  | "left"
                  | "right"
                  | "bottomLeft"
                  | "bottom"
                  | "bottomRight",
                _size,
                unitY,
                polygonCoords,
              ),
            ],
          };
        });
        group.on("modified", (e) => {
          const p = e.transform?.target.getCenterPoint();
          const newPosition = positionMap.reduce(
            (lowestDistancePosition, currentValue) => {
              const newPoint = new fabric.Point(p?.x ?? 0, p?.y ?? 0);
              if (
                (newPoint.distanceFrom(
                  new fabric.Point(
                    currentValue.coords[0],
                    currentValue.coords[1],
                  ),
                ) ?? 0) <
                (newPoint.distanceFrom(
                  new fabric.Point(
                    lowestDistancePosition.coords[0],
                    lowestDistancePosition.coords[1],
                  ),
                ) ?? 0)
              ) {
                return currentValue;
              } else {
                return lowestDistancePosition;
              }
            },
            positionMap[0],
          );
          onMovingNumberFlag?.(item, newPosition.position);
        });
        return group;
      },
      [onMovingNumberFlag, scaleRatio],
    );

    const addCornerObjectToPolygon = useCallback(
      (
        item: CanvasObject,
        polygon: fabric.Object,
        scaledCoords: {
          x: number;
          y: number;
        }[],

        color?: string,
      ) => {
        const group = createCornerGroup(
          item,
          polygon,
          scaledCoords,
          color,
          false,
        );
        editor?.canvas.add(group!);
      },
      [createCornerGroup, editor?.canvas],
    );

    const loadItems = useCallback(
      (canvas: Canvas) => {
        canvas.getObjects().forEach(function (object) {
          canvas.remove(object);
        });

        items.forEach((item) => {
          const scaledCoords = item.coords.map((p) =>
            fabricUtils.toScaledCoord({
              cInfo: { width: canvas.getWidth(), height: canvas.getHeight() },
              iInfo: { width: imageSize.width, height: imageSize.height },
              coord: p,
              scaleRatio,
            }),
          );

          let fabricObject;

          if (scaledCoords.length === 4) {
            const [p1, p2, p3, p4] = scaledCoords;
            const width = Math.sqrt(
              Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2),
            );
            const height = Math.sqrt(
              Math.pow(p4.x - p1.x, 2) + Math.pow(p4.y - p1.y, 2),
            );
            const centerX = (p1.x + p2.x + p3.x + p4.x) / 4;
            const centerY = (p1.y + p2.y + p3.y + p4.y) / 4;
            const angle =
              Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);
            fabricObject = new fabric.Rect({
              left: centerX,
              top: centerY,
              width: width,
              height: height,
              fill: item.fillColor,
              stroke: item.borderColor,
              strokeWidth: 0.4,
              selectable: item.selectable ?? true,
              hoverCursor: item.hoverCursor,
              moveCursor: item.moveCursor,
              cornerStrokeColor: cornerStrokeColor
                ? cornerStrokeColor
                : undefined,
              name: item.id,
              angle: angle,
              originX: "center",
              originY: "center",
            });
          } else {
            // This is a polygon
            fabricObject = fabricUtils.createControllableCustomObject(
              fabric.Polygon,
              scaledCoords,
              {
                name: item.id,
                stroke: item.borderColor,
                fill: item.fillColor,
                selectable: item.selectable ?? true,
                hoverCursor: item.hoverCursor,
                moveCursor: item.moveCursor,
                cornerStrokeColor: cornerStrokeColor
                  ? cornerStrokeColor
                  : undefined,
              },
            );
          }

          canvas.add(fabricObject);
          if (item.numberFlag !== null && item.numberFlag !== undefined) {
            addCornerObjectToPolygon(item, fabricObject, scaledCoords, "green");
          }
          // After making changes, render the canvas
          canvas.renderAll();
          if (selectedObjectId) {
            const objectToSelect = canvas
              .getObjects()
              .find((obj) => obj.name === selectedObjectId);
            if (objectToSelect) {
              canvas.setActiveObject(objectToSelect);
              canvas.requestRenderAll();
            }
          }
        });
      },
      [
        addCornerObjectToPolygon,
        cornerStrokeColor,
        imageSize.height,
        imageSize.width,
        items,
        scaleRatio,
        selectedObjectId,
      ],
    );

    useEffect(() => {
      if (!editor?.canvas) return;
      loadItems(editor.canvas);
    }, [editor?.canvas, loadItems, scaleRatio]);

    useEffect(() => {
      const parentCanvasElement = document.getElementById(
        "react-annotator-canvas",
      );
      if (!editor || !fabric || !parentCanvasElement) {
        return;
      }

      // Background color of canvas
      editor.canvas.backgroundColor = "#ffffff";

      // Set FabricJS canvas width and height
      editor.canvas.setWidth(parentCanvasElement.clientWidth);
      editor.canvas.setHeight(parentCanvasElement.clientHeight);

      // Change the cursor
      // editor.canvas.defaultCursor = draggingEnabled ? "pointer" : "default";

      // Disable uniform scaling
      editor.canvas.uniformScaling = false;

      editor.canvas.fireMiddleClick = true;

      fabric.Image.fromURL(
        image.src,
        (img) => {
          setOriginalFabricImage(img);

          const { canvas } = editor;
          const tempScaleRatio = Math.min(
            (canvas.width ?? 1) / (img.width ?? 1),
            (canvas.height ?? 1) / (img.height ?? 1),
          );
          setImageSize({ width: img.width ?? 0, height: img.height ?? 0 });

          setScaleRation(tempScaleRatio);
          canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
            scaleX: tempScaleRatio,
            scaleY: tempScaleRatio,
            left: (canvas.width ?? 1) / 2,
            top: (canvas.height ?? 1) / 2,
            originX: "middle",
            originY: "middle",
            stroke: "black",
            strokeWidth: 1,
          });
          canvas!.renderAll();
          onLoadedImage?.({ width: img.width ?? 0, height: img.height ?? 0 });
        },
        { selectable: false, crossOrigin: "anonymous" },
      );

      // On Wheel interation/move
      editor.canvas.on(
        "mouse:wheel",
        function (this: fabricTypes.CanvasAnnotationState, opt) {
          const delta = opt.e.deltaY;
          let zoom = editor.canvas.getZoom();
          zoom *= 0.999 ** delta;
          if (zoom > 20) zoom = 20;
          if (zoom < 0.01) zoom = 0.01;
          editor.canvas.zoomToPoint(
            { x: opt.e.offsetX, y: opt.e.offsetY },
            zoom,
          );
          setCurrentZoom(zoom * 100);
          editor.canvas.discardActiveObject();
          opt.e.preventDefault();
          opt.e.stopPropagation();
        },
      );

      // On Mouse left click (down)
      editor.canvas.on(
        "mouse:down",
        function (this: fabricTypes.CanvasAnnotationState, opt) {
          const evt = opt.e;
          if (
            (evt.button === 0 && !opt.target && !drawingObject.isDrawing) ||
            evt.button === 1
          ) {
            this.isDragging = true;
            this.selection = false;
            this.lastPosX = evt.clientX;
            this.lastPosY = evt.clientY;
            evt.preventDefault();
          } else {
            this.drawingObject = drawingObject;

            // Extract coords for polygon drawing
            const pointer = editor?.canvas.getPointer(opt.e);
            const lastClickCoords = { x: pointer.x, y: pointer.y };
            this.lastClickCoords = lastClickCoords;

            if (drawingObject.isDrawing && drawingObject.type === "polygon") {
              // Retrive the existing polygon

              const polygon =
                fabricUtils.findObjectByName<fabricTypes.CustomObject>(
                  editor.canvas,
                  drawingObject.id,
                );
              // Delete previously created polygon (if exists)
              if (polygon) editor.canvas.remove(polygon);

              const hasClickedOnInitialPoint = (
                p?: fabricTypes.CustomObject,
              ) => {
                if (p === undefined) return false;
                // const collisionPoint: string | undefined = undefined;
                const initialPoint = p.oCoords["p0"];

                if (initialPoint) {
                  const { tl, tr, bl, br } = initialPoint.corner;
                  // We need to ignore the zoom in order to obtain the accurate coordinates
                  const zoomedPointer = editor?.canvas.getPointer(opt.e, true);
                  return fabricUtils.isCoordInsideCoords(zoomedPointer, {
                    tl,
                    tr,
                    bl,
                    br,
                  });
                }
                return false;
              };

              const isInitialPoint = hasClickedOnInitialPoint(polygon);

              // Update drawing points of polygon
              const newPoints = isInitialPoint
                ? drawingObject.points
                : drawingObject.points.concat(lastClickCoords);

              // Draw a new polygon from scratch
              const newPolygon = fabricUtils.createControllableCustomObject(
                isInitialPoint ? fabric.Polygon : fabric.Polyline,
                newPoints,
                { name: drawingObject.id },
              );

              if (isInitialPoint) {
                resetDrawingObject();
              } else {
                setDrawingObject({
                  ...drawingObject,
                  points: newPoints,
                });
              }

              // Add object to canvas and set it as ACTIVE
              editor.canvas.add(newPolygon);
              editor.canvas.setActiveObject(newPolygon);
            } else if (
              this.drawingObject?.isDrawing &&
              this.drawingObject.type === "rectangle"
            ) {
              console.log("Draw Rectangle - BEGIN");
            }
          }
        },
      );

      // On Mouse left click (up)
      editor.canvas.on(
        "mouse:up",
        function (this: fabricTypes.CanvasAnnotationState, opt) {
          const evt = opt.e as MouseEvent;
          if (
            (evt.button === 0 && !opt.target && !drawingObject.isDrawing) ||
            evt.button === 1
          ) {
            this.isDragging = false;
            this.selection = true;
            editor.canvas.zoomToPoint(
              { x: opt.e.offsetX, y: opt.e.offsetY },
              editor.canvas.getZoom(),
            );
          } else {
            // Disable drawing when it's a rectangle on mouse up
            if (
              this.drawingObject?.isDrawing &&
              this.drawingObject.type === "rectangle"
            ) {
              console.log("Draw Rectangle - DOWN");
              resetDrawingObject();
              updateObjectHelper(opt.target);
              opt.target?.on("deselected", function () {
                editor.canvas.setActiveObject(opt.target!);
              });
            }
          }
        },
      );

      // On Mouse free moving on canvas
      editor.canvas.on(
        "mouse:move",
        function (this: fabricTypes.CanvasAnnotationState, opt) {
          const pointer = editor.canvas.getPointer(opt.e, false);
          const canvasWidth = editor.canvas.getWidth();
          const canvasHeight = editor.canvas.getHeight();
          const imageWidth = imageSize.width; // From your state
          const imageHeight = imageSize.height;

          // Get the scale ratio
          const currentScaleRatio = scaleRatio; // From your state

          // Compute the image's top-left corner position in canvas coordinates
          const imageLeft =
            canvasWidth / 2 - (imageWidth * currentScaleRatio) / 2;
          const imageTop =
            canvasHeight / 2 - (imageHeight * currentScaleRatio) / 2;

          // Calculate pointer position relative to the image's top-left corner
          const relativeX = (pointer.x - imageLeft) / currentScaleRatio;
          const relativeY = (pointer.y - imageTop) / currentScaleRatio;

          // Update the last pointer position with coordinates relative to the image
          lastPointerPosition.current = { x: relativeX, y: relativeY };
          if (this.isDragging) {
            const e = opt.e;
            const vpt = editor.canvas.viewportTransform;
            if (vpt) {
              vpt[4] += e.clientX - this.lastPosX;
              vpt[5] += e.clientY - this.lastPosY;
              this.lastPosX = e.clientX;
              this.lastPosY = e.clientY;
              editor.canvas.requestRenderAll();
            }
          } else {
            const isDrawingObject = this.drawingObject?.isDrawing;
            const drawingObjectType = this.drawingObject?.type;
            const pointer = editor?.canvas.getPointer(opt.e);

            if (isDrawingObject && drawingObjectType === "polygon") {
              const newPoints = drawingObject.points.concat({
                x: pointer.x,
                y: pointer.y,
              });

              const polygon = fabricUtils.findObjectByName(
                editor.canvas,
                drawingObject.id,
              );

              if (polygon) editor.canvas.remove(polygon);

              // Draw a new polygon from scratch
              const newPolygon = fabricUtils.createControllableCustomObject(
                fabric.Polyline,
                newPoints,
                { name: drawingObject.id },
              );

              // Add object to canvas and set it as ACTIVE
              editor.canvas.add(newPolygon);
              editor.canvas.setActiveObject(newPolygon);
            } else if (isDrawingObject && drawingObjectType === "rectangle") {
              const rectangle = fabricUtils.findObjectByName(
                editor.canvas,
                drawingObject.id,
              );

              if (rectangle) editor.canvas.remove(rectangle);

              if (!this.lastClickCoords) return;

              const newPoints = [
                { x: this.lastClickCoords?.x, y: this.lastClickCoords?.y },
                { x: pointer.x, y: this.lastClickCoords?.y },
                { x: pointer.x, y: pointer.y },
                { x: this.lastClickCoords?.x, y: pointer.y },
              ];
              // Draw a new rectangle from scratch
              const newRectangle = fabricUtils.createControllableCustomObject(
                fabric.Polygon,
                newPoints,
                { name: drawingObject.id },
                true,
              );

              // // Add object to canvas and set it as ACTIVE
              editor.canvas.add(newRectangle);
              editor.canvas.setActiveObject(newRectangle);
            }
          }
        },
      );

      // Function to reset the annotator helper
      const objectEventFunction = function (
        this: fabricTypes.CanvasAnnotationState,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _opt: fabric.IEvent<MouseEvent>,
      ) {
        // While object is being moved, remove the annotator helper
        setObjectHelper({ ...objectHelper, enabled: false });
      };

      // While object is being transformed
      editor.canvas.on("object:moving", objectEventFunction);
      editor.canvas.on("object:scaling", objectEventFunction);
      editor.canvas.on("object:resizing", objectEventFunction);
      editor.canvas.on("object:rotating", objectEventFunction);

      // Objects Modified - When object ends being modified (moved, scaled, resized..), call function
      editor.canvas.on(
        "object:modified",
        function (this: fabricTypes.CanvasAnnotationState, opt) {
          const obj = opt.target;
          if (obj) {
            const helper = fabricUtils.getObjectHelperCoords(obj);
            setObjectHelper({
              left: helper.left,
              top: helper.top,
              enabled: true,
              object: obj as fabricTypes.CustomObject,
            });
          }
        },
      );

      const onSelectionEvent = function (
        this: fabricTypes.CanvasAnnotationState,
        opt: fabric.IEvent<MouseEvent>,
      ) {
        if (isInDrawingMode) return;
        const isDrawing = this.drawingObject?.isDrawing ?? false;
        setObjectHelper({ ...objectHelper, enabled: false });
        const selected = opt.selected?.[0];
        if (selected && !isDrawing) {
          updateObjectHelper(selected);
          setSelectedObjectId(selected.name ?? null);
        }
        onSelectItem && selected && onSelectItem(selected);
      };

      // Some element was selected
      editor.canvas.on("selection:created", onSelectionEvent);
      editor.canvas.on("selection:updated", onSelectionEvent);

      // On object selection cleared
      editor.canvas.on(
        "selection:cleared",
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        function (this: fabricTypes.CanvasAnnotationState, _opt) {
          // const selectedObject = opt.deselected?.[0];
          if (isInDrawingMode) return;
          setObjectHelper({ enabled: false, top: 0, left: 0 });
          setSelectedObjectId(null);
          onSelectItem && onSelectItem(null);
        },
      );

      editor.canvas.on("mouse:over", (opt) => {
        const target = opt.target;
        if (target && onItemHover) {
          onItemHover({ id: target.name! });
        }
      });
      editor.canvas.on("mouse:out", (opt) => {
        const target = opt.target;
        if (target && onItemHover) {
          onItemHover({ id: null });
        }
      });

      editor.canvas.renderAll();

      // TODO: Need to verify this
      // Clear all canvas events when the status changes.
      return () => {
        editor.canvas.off();
      };
    }, [
      editor,
      image,
      onLoadedImage,
      onZoomChange,
      drawingObject,
      resetDrawingObject,
      objectHelper,
      onItemHover,
      onSelectItem,
      loadItems,
      scaleRatio,
      isInDrawingMode,
      imageSize.width,
      imageSize.height,
    ]);

    // Update zoom parent value
    useEffect(() => {
      onZoomChange?.(Math.round(currentZoom));
    }, [currentZoom, onZoomChange]);

    // Load Initial items
    useEffect(() => {
      const canvas = editor?.canvas;
      if (!canvas) return;
      if (!originalFabricImage) return;
      // debugger;
      if (_.isEqual(items, savedItems)) {
        return;
      }
      setSavedItems(items);
      setObjectHelper({ enabled: false, top: 0, left: 0 });
      loadItems(canvas);
    }, [editor?.canvas, items, loadItems, originalFabricImage, savedItems]);

    const renderObjectHelper = () => {
      if (
        !helper ||
        objectHelper.object?.name === undefined ||
        objectHelper.enabled === false
      ) {
        return <></>;
      }

      const left = `${objectHelper.left}px`;
      const top = `${objectHelper.top}px`;
      const info = getObjectInfo(objectHelper.object);
      return (
        <div
          id="react-annotator-canvas-helper"
          style={{
            position: "absolute",
          }}
        >
          <div
            style={{
              position: "absolute",
              left,
              top,
              margin: "5px",
            }}
          >
            {helper(objectHelper.object.name, info.content)}
          </div>
        </div>
      );
    };

    return (
      <div
        id="react-annotator-canvas"
        data-testid="react-annotator-canvas"
        style={{ display: "flex", width: "100%", height: "100%" }}
      >
        <FabricJSCanvas className="fabricjs-canvas" onReady={onReady} />
        {renderObjectHelper()}
      </div>
    );
  },
);

Board.displayName = "Board";
export default Board;
