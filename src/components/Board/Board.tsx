import React, { useCallback, useEffect, useState } from "react";
import { fabric } from "fabric";
import { v4 as uuidv4 } from "uuid";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import { CanvasObject } from "./types";
import * as fabricUtils from "../../fabric/utils";
import * as fabricActions from "../../fabric/actions";
import * as fabricTypes from "../../fabric/types";
import parse from "color-parse";
import { CustomCornerObject } from "../../fabric/classes";

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
};

export type BoardActions = {
  resetZoom: () => void;
  deleteSelectedObjects: () => void;
  deleteObjectById: (id: string) => void;
  jumpToId: (id: string, setActive?: boolean) => void;
  deselectAll: () => void;
  downloadImage: () => void;
  drawObject: (type?: "rectangle" | "polygon") => void;
  retrieveObjects: (includeContent?: boolean) => CanvasObject[];
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
      onSelectItem,
      onLoadedImage,
      onItemHover,
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
        if (editor?.canvas) {
          const obj = fabricUtils.findObjectByName(editor.canvas, id);
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
      jumpToId(id: string, setActive?: boolean) {
        const canvas = editor?.canvas;
        if (!canvas) return;

        const object = fabricUtils.findObjectByName(canvas, id);
        if (!object) return;

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
      retrieveObjects: (includeContent: boolean = true) => {
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

    const getObjectInfo = (
      obj: fabricTypes.CustomObject,
      includeContent = true,
    ) => {
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
        content: includeContent
          ? originalFabricImage?.toDataURL({
              withoutTransform: true,
              ...fabricUtils.getBoundingBox(updatedCoords),
            })
          : undefined,
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

    const findBottomRight = (
      points: {
        x: number;
        y: number;
      }[],
    ) => {
      return points.reduce((bottomRight, current) => {
        if (
          current.x > bottomRight.x ||
          (current.x <= bottomRight.x && current.y > bottomRight.y)
        ) {
          return current;
        }
        return bottomRight;
      }, points[0]);
    };

    const addCornerObjectToPolygon = useCallback(
      (
        polygon: fabric.Object,
        index: number,
        scaledCoords: {
          x: number;
          y: number;
        }[],
        size?: number,
      ) => {
        if (!editor?.canvas) return;

        const cornerObject = new CustomCornerObject({
          number: index + 1,
          size,
        });

        cornerObject.set({
          left: findBottomRight(scaledCoords).x,
          top: findBottomRight(scaledCoords).y,
        });

        editor.canvas.add(cornerObject);

        // Ensure the corner object moves with the polygon
        polygon.on("moving", () => {
          const newBounds = polygon.getBoundingRect();
          cornerObject.set({
            left: newBounds.left + newBounds.width,
            top: newBounds.top + newBounds.height,
          });
          editor.canvas.renderAll();
        });

        // Ensure the corner object is removed when the polygon is removed
        polygon.on("removed", () => {
          editor.canvas?.remove(cornerObject);
        });
      },
      [editor?.canvas],
    );

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
          setObjectHelper({ enabled: false, top: 0, left: 0 });
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

      items.forEach((item) => {
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

        const selectable = item.selectable ?? true;
        const polygon = fabricUtils.createControllableCustomObject(
          fabric.Polygon,
          scaledCoords,
          {
            name: item.id,
            stroke: item.color,
            fill: `rgba(${parse(item.color).values.join(",")},${item.opacity ?? 0.4})`,
            selectable,
            hoverCursor: item.hoverCursor,
            moveCursor: item.moveCursor,
          },
          scaledCoords.length === 4, // Is a rectangle
        );

        canvas.add(polygon);
        if (item.numberFlag !== null && item.numberFlag !== undefined) {
          addCornerObjectToPolygon(
            polygon,
            item.numberFlag,
            scaledCoords,
            item.numberFlagSize,
          );
        }
      });
    }, [
      editor?.canvas,
      imageSize.width,
      imageSize.height,
      items,
      scaleRatio,
      addCornerObjectToPolygon,
    ]);

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
