import React, { useEffect, useState } from "react";
import { fabric } from "fabric";
import { v4 as uuidv4 } from "uuid";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import { CanvasObject } from "./types";
import * as fabricUtils from "../../fabric/utils";
import * as fabricActions from "../../fabric/actions";
import * as fabricTypes from "../../fabric/types";
import parse from "color-parse";

export type BoardProps = {
  items: CanvasObject[];
  image: { name: string; src: string };
  initialStatus?: {
    draggingEnabled?: boolean;
    currentZoom?: number;
    scaleRatio?: number;
  };
  onResetZoom?: () => void;
  onZoomChange?: (currentZoom: number) => void;
  onLoadedImage?: ({
    width,
    height,
  }: {
    width: number;
    height: number;
  }) => void;
};

export type BoardActions = {
  resetZoom: () => void;
  deleteSelectedObjects: () => void;
  downloadImage: () => void;
  drawObject: (type?: "rectangle" | "polygon") => void;
  retrieveObjects: () => CanvasObject[];
};

const Board = React.forwardRef<BoardActions, BoardProps>(
  (
    { image, initialStatus, items, onResetZoom, onZoomChange, onLoadedImage },
    ref,
  ) => {
    // Set board actions
    React.useImperativeHandle(ref, () => ({
      resetZoom() {
        editor?.canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
        setCurrentZoom(100);
        onResetZoom?.();
      },
      deleteSelectedObjects() {
        const canvas = editor?.canvas;
        if (canvas) fabricActions.deleteSelected(canvas);
      },
      drawObject(type?: "rectangle" | "polygon") {
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
      downloadImage() {
        fabricActions.canvasImageDownload(image);
      },
      retrieveObjects: () => {
        const canvas = editor?.canvas;
        if (canvas) {
          const customObjects =
            fabricUtils.retrieveObjects<fabricTypes.CustomObject>(canvas);
          if (!customObjects) return [];
          return customObjects.map((co) => {
            const updatedCoordPoints = fabricUtils.pointsInCanvas(co);
            const updatedCoords = updatedCoordPoints.map((p) =>
              fabricUtils.toOriginalCoord({
                cInfo: {
                  width: canvas.getWidth(),
                  height: canvas.getHeight(),
                },
                iInfo: imageSize,
                coord: p,
                scaleRatio,
              }),
            );

            const content = originalFabricImage?.toDataURL({
              withoutTransform: true,
              ...fabricUtils.getBoundingBox(updatedCoords),
            });

            return {
              id: co.name!,
              category: "TODO_category",
              color: "TODO_color",
              value: "TODO_value",
              coords: updatedCoords,
              content,
            };
          });
        }
        return [];
      },
    }));

    const { editor, onReady } = useFabricJSEditor();

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

    const [drawingObject, setDrawingObject] = useState<
      NonNullable<fabricTypes.CanvasAnnotationState["drawingObject"]>
    >({ isDrawing: false, type: "polygon", points: [] });

    const resetDrawingObject = () => {
      const state: fabricTypes.CanvasAnnotationState["drawingObject"] = {
        isDrawing: false,
        type: "polygon",
        points: [],
      };
      (
        editor?.canvas as unknown as fabricTypes.CanvasAnnotationState
      ).drawingObject = state;
      setDrawingObject(state);
    };

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

      fabric.Image.fromURL(
        image.src,
        (img) => {
          setOriginalFabricImage(img);

          const { canvas } = editor;
          const scaleRatio = Math.min(
            (canvas.width ?? 1) / (img.width ?? 1),
            (canvas.height ?? 1) / (img.height ?? 1),
          );
          setImageSize({ width: img.width ?? 0, height: img.height ?? 0 });

          setScaleRation(scaleRatio);
          canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
            scaleX: scaleRatio,
            scaleY: scaleRatio,
            left: (canvas.width ?? 1) / 2,
            top: (canvas.height ?? 1) / 2,
            originX: "middle",
            originY: "middle",
          });
          canvas!.renderAll();
          onLoadedImage?.({ width: img.width ?? 0, height: img.height ?? 0 });
        },
        { selectable: false },
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
          opt.e.preventDefault();
          opt.e.stopPropagation();
        },
      );

      // On Mouse left click (down)
      editor.canvas.on(
        "mouse:down",
        function (this: fabricTypes.CanvasAnnotationState, opt) {
          const evt = opt.e;
          this.isDragging = opt.target === null; // Enable dragging when the cursor is on canvas (no object selected)
          this.selection = false;
          this.lastPosX = evt.clientX;
          this.lastPosY = evt.clientY;
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

            const hasClickedOnInitialPoint = (p?: fabricTypes.CustomObject) => {
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
        },
      );

      // On Mouse left click (up)
      editor.canvas.on(
        "mouse:up",
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        function (this: fabricTypes.CanvasAnnotationState, _opt) {
          if (this.isDragging) {
            // Reset the viewport
            editor.canvas.zoomToPoint(
              { x: _opt.e.offsetX, y: _opt.e.offsetY },
              editor.canvas.getZoom(),
            );
          }
          this.isDragging = false;
          this.selection = true;

          // Disable drawing when it's a rectangle on mouse up
          if (
            this.drawingObject?.isDrawing &&
            this.drawingObject.type === "rectangle"
          ) {
            console.log("Draw Rectangle - DOWN");
            resetDrawingObject();
          }
        },
      );

      // On Mouse free moving on canvas
      editor.canvas.on(
        "mouse:move",
        function (this: fabricTypes.CanvasAnnotationState, opt) {
          const isDrawingObject = this.drawingObject?.isDrawing;
          const drawingObjectType = this.drawingObject?.type;
          const pointer = editor?.canvas.getPointer(opt.e);

          if (this.isDragging && !isDrawingObject) {
            const e = opt.e;
            const vpt = editor.canvas.viewportTransform;
            if (vpt) {
              vpt[4] += e.clientX - this.lastPosX;
              vpt[5] += e.clientY - this.lastPosY;
              this.lastPosX = e.clientX;
              this.lastPosY = e.clientY;
              editor.canvas.requestRenderAll();
            }
          }

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
        },
      );

      // Selected Objects
      editor.canvas.on(
        "selection:created",
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        function (this: fabricTypes.CanvasAnnotationState, _opt) {
          // console.log("SELECTED! ", opt.selected?.[0]);
        },
      );

      // Objects Moving
      editor.canvas.on(
        "object:modified",
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        function (this: fabricTypes.CanvasAnnotationState, _opt) {
          const obj = _opt.target as fabricTypes.CustomObject | undefined;
          if (obj) {
            console.log(`Object ["${obj.name}"] modified event`);
          }
        },
      );

      editor.canvas.renderAll();

      // TODO: Need to verify this
      // Clear all canvas events when the status changes.
      return () => {
        editor.canvas.off();
      };
    }, [editor, image, onLoadedImage, onZoomChange, drawingObject]);

    // Update zoom parent value
    useEffect(() => {
      onZoomChange?.(Math.round(currentZoom));
    }, [currentZoom, onZoomChange]);

    // Load Initial items
    useEffect(() => {
      const canvas = editor?.canvas;
      if (!canvas) return;

      // Clear all objects from canvas
      fabricActions.deleteAll(editor?.canvas);

      for (const item of items) {
        const scaledCoords = item.coords.map((p) =>
          fabricUtils.toScaledCoord({
            cInfo: { width: canvas.getWidth(), height: canvas.getHeight() },
            iInfo: {
              width: imageSize.width,
              height: imageSize.height,
            },
            coord: p,
            scaleRatio,
          }),
        );

        const polygon = fabricUtils.createControllableCustomObject(
          fabric.Polygon,
          scaledCoords,
          {
            name: `ID_${item.id}`,
            stroke: item.color,
            fill: `rgba(${parse(item.color).values.join(",")},${item.opacity ?? 0.4})`,
          },
          scaledCoords.length === 4, // Is a rectangle
        );
        canvas.add(polygon);
      }
    }, [editor?.canvas, imageSize.width, imageSize.height, items, scaleRatio]);

    return (
      <div
        id="react-annotator-canvas"
        data-testid="react-annotator-canvas"
        style={{ width: "100%", height: "100%" }}
      >
        <FabricJSCanvas className="fabricjs-canvas" onReady={onReady} />
      </div>
    );
  },
);

Board.displayName = "Board";
export default Board;
