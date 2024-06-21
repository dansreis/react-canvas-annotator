import React, { useCallback, useEffect, useState } from "react";
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
  helper: (id: string, content?: string) => React.ReactNode;
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
  deleteObjectById: (id: string) => void;
  deselectAll: () => void;
  downloadImage: () => void;
  drawObject: (type?: "rectangle" | "polygon") => void;
  retrieveObjects: () => CanvasObject[];
  retrieveObjectContent: (id: string) => string | null;
};

const Board = React.forwardRef<BoardActions, BoardProps>(
  (
    {
      image,
      initialStatus,
      items,
      onResetZoom,
      onZoomChange,
      onLoadedImage,
      helper,
    },
    ref,
  ) => {
    // Set board actions
    React.useImperativeHandle(ref, () => ({
      resetZoom() {
        editor?.canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
        setCurrentZoom(100);
        onResetZoom?.();
      },
      retrieveObjectContent(id: string) {
        const polygonId = fabricUtils.toPolygonId(id);
        if (editor?.canvas) {
          const obj = fabricUtils.findObjectByName(editor.canvas, polygonId);
          return obj
            ? getObjectInfo(obj as fabricTypes.CustomObject).content ?? null
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
      drawObject(type?: "rectangle" | "polygon") {
        const isDrawing = !drawingObject?.isDrawing;
        if (isDrawing) {
          const polygonId = fabricUtils.toPolygonId(uuidv4());
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
            const info = getObjectInfo(co);

            return {
              id: co.name!,
              category: "TODO_category",
              color: "TODO_color",
              value: "TODO_value",
              coords: info.coords,
              content: info.content,
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

    const getObjectInfo = (obj: fabricTypes.CustomObject) => {
      const width = editor?.canvas.getWidth() ?? 0;
      const height = editor?.canvas.getHeight() ?? 0;
      const updatedCoordPoints = fabricUtils.pointsInCanvas(obj);
      const updatedCoords = updatedCoordPoints.map((p) =>
        fabricUtils.toOriginalCoord({
          cInfo: {
            width,
            height,
          },
          iInfo: imageSize,
          coord: p,
          scaleRatio,
        }),
      );

      return {
        coords: updatedCoords,
        content: originalFabricImage?.toDataURL({
          withoutTransform: true,
          ...fabricUtils.getBoundingBox(updatedCoords),
        }),
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
        function (this: fabricTypes.CanvasAnnotationState, opt) {
          if (this.isDragging) {
            // Reset the viewport
            editor.canvas.zoomToPoint(
              { x: opt.e.offsetX, y: opt.e.offsetY },
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
            updateObjectHelper(opt.target);
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
        setObjectHelper({ ...objectHelper, enabled: false });
        const selected = opt.selected?.[0];
        const isDrawing = this.drawingObject?.isDrawing ?? false;
        if (selected && !isDrawing) {
          updateObjectHelper(selected);
        }
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
          setObjectHelper({ enabled: false, top: 0, left: 0 });
        },
      );

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
    ]);

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
            name: fabricUtils.toPolygonId(item.id),
            stroke: item.color,
            fill: `rgba(${parse(item.color).values.join(",")},${item.opacity ?? 0.4})`,
            selectable: item.selectable ?? true,
          },
          scaledCoords.length === 4, // Is a rectangle
        );

        // const renderIcon = (
        //   ctx: CanvasRenderingContext2D,
        //   left: number,
        //   top: number,
        //   styleOverride: unknown,
        //   fabricObject: fabric.Object,
        // ) => {
        //   const deleteIcon =
        //     "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";

        //   const img = document.createElement("img");
        //   img.src = deleteIcon;
        //   const size = 24;
        //   ctx.save();
        //   ctx.translate(left, top);
        //   if (fabricObject.angle)
        //     ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
        //   ctx.drawImage(img, -size / 2, -size / 2, size, size);
        //   ctx.restore();
        // };

        // polygon.controls = {
        //   ...polygon.controls,
        //   onDelete: new fabric.Control({
        //     x: 0.5,
        //     y: -0.5,
        //     offsetY: 16,
        //     cursorStyle: "pointer",
        //     mouseUpHandler: () => {
        //       console.log("deleted up!");
        //       return true;
        //     },
        //     render: renderIcon,
        //   }),
        // };
        canvas.add(polygon);
      }
    }, [editor?.canvas, imageSize.width, imageSize.height, items, scaleRatio]);

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
