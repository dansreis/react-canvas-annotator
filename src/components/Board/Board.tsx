import React, { useEffect, useState } from "react";
import { fabric } from "fabric";
import { v4 as uuidv4 } from "uuid";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import { CanvasObject } from "./types";
import * as fabricUtils from "../../fabric/utils";
import * as fabricActions from "../../fabric/actions";
import * as fabricTypes from "../../fabric/types";

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
  onToggleDragging?: (currentStatus: boolean) => void;
  onLoadedImage?: ({
    width,
    height,
  }: {
    width: number;
    height: number;
  }) => void;
};

export type BoardActions = {
  toggleDragging: (value?: boolean) => void;
  resetZoom: () => void;
  deleteSelectedObjects: () => void;
  downloadImage: () => void;
  drawPolygon: () => void;
};

const Board = React.forwardRef<BoardActions, BoardProps>(
  (
    {
      image,
      initialStatus,
      items,
      onToggleDragging,
      onResetZoom,
      onZoomChange,
      onLoadedImage,
    },
    ref,
  ) => {
    // Set board actions
    React.useImperativeHandle(ref, () => ({
      toggleDragging() {
        const newStatus = !draggingEnabled;
        setDraggingEnabled(newStatus);
        onToggleDragging?.(newStatus);
      },
      resetZoom() {
        editor?.canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
        setCurrentZoom(100);
        onResetZoom?.();
      },
      deleteSelectedObjects() {
        const canvas = editor?.canvas;
        if (canvas) fabricActions.deleteSelected(canvas);
      },
      drawPolygon() {
        const isDrawing = !drawingPolygon?.isDrawing;
        if (isDrawing) {
          const polygonId = uuidv4();
          setDrawingPolygon({ id: polygonId, isDrawing: true, points: [] });
        } else {
          resetDrawingPolygon();
        }
      },
      downloadImage() {
        fabricActions.canvasImageDownload(image);
      },
    }));
    const { editor, onReady } = useFabricJSEditor();

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

    const [draggingEnabled, setDraggingEnabled] = useState(
      initialStatus?.draggingEnabled || false,
    );

    const [drawingPolygon, setDrawingPolygon] = useState<
      NonNullable<fabricTypes.CanvasAnnotationState["drawingPolygon"]>
    >({ isDrawing: false, points: [] });

    const resetDrawingPolygon = () => {
      // (canvas as unknown as fabricTypes.CanvasAnnotationState).drawingPolygon =
      //   state;
      setDrawingPolygon({ isDrawing: false, points: [] });
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
      editor.canvas.defaultCursor = draggingEnabled ? "pointer" : "default";

      fabric.Image.fromURL(
        image.src,
        (img) => {
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
          if (this.drawingPolygon?.isDrawing) return;
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

      // On Mouse right click (down)
      editor.canvas.on(
        "mouse:down",
        function (this: fabricTypes.CanvasAnnotationState, opt) {
          const evt = opt.e;
          this.isDragging = draggingEnabled;
          this.selection = false;
          this.lastPosX = evt.clientX;
          this.lastPosY = evt.clientY;
          this.drawingPolygon = drawingPolygon;

          // Extract coords for polygon drawing
          const pointer = editor?.canvas.getPointer(opt.e);
          const lastClickCoords = { x: pointer.x, y: pointer.y };
          this.lastClickCoords = lastClickCoords;

          if (drawingPolygon.isDrawing) {
            // Update drawing points of polygon
            const newPoints = drawingPolygon.points.concat(lastClickCoords);
            setDrawingPolygon({ ...drawingPolygon, points: newPoints });

            // Delete previously created polygon (if exists)
            const polygon = editor.canvas
              .getObjects()
              .find((o) => o.name === drawingPolygon.id);
            if (polygon) editor.canvas.remove(polygon);

            // Draw a new polygon from scratch
            const newPolygon = fabricUtils.createControllableObject(
              fabric.Polyline,
              newPoints,
              {
                name: drawingPolygon.id,
                fill: "rgba(255, 99, 71, 0.2)",
                hasBorders: false,
              },
            );

            // Add object to canvas and set it as ACTIVE
            editor.canvas.add(newPolygon);
            editor.canvas.setActiveObject(newPolygon);
          }
        },
      );

      // On Mouse right click (up)
      editor.canvas.on(
        "mouse:up",
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        function (this: fabricTypes.CanvasAnnotationState, _opt) {
          this.isDragging = false;
          this.selection = true;
        },
      );

      // On Mouse free moving on canvas
      editor.canvas.on(
        "mouse:move",
        function (this: fabricTypes.CanvasAnnotationState, opt) {
          if (this.isDragging) {
            const e = opt.e;
            const vpt = editor.canvas.viewportTransform;
            if (vpt) {
              vpt[4] += e.clientX - this.lastPosX;
              vpt[5] += e.clientY - this.lastPosY;
              editor.canvas.requestRenderAll();
              this.lastPosX = e.clientX;
              this.lastPosY = e.clientY;
            }
          }

          if (this.drawingPolygon?.isDrawing) {
            const pointer = editor?.canvas.getPointer(opt.e);
            const newPoints = drawingPolygon.points.concat({
              x: pointer.x,
              y: pointer.y,
            });

            const polygon = editor.canvas
              .getObjects()
              .find((o) => o.name === drawingPolygon.id);
            if (polygon) editor.canvas.remove(polygon);

            // Draw a new polygon from scratch
            const newPolygon = fabricUtils.createControllableObject(
              fabric.Polyline,
              newPoints,
              {
                name: drawingPolygon.id,
                fill: "rgba(255, 99, 71, 0.2)",
                hasBorders: false,
              },
            );

            // Add the object events to check if it stopped drawing
            newPolygon.on(
              "mousedown",
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              function (this: fabricTypes.ControllableObjectState, _opt) {
                const pointer = editor?.canvas.getPointer(opt.e);
                if (pointer && _opt.target?.oCoords) {
                  const collisionPoint: string | undefined = undefined;
                  const initialPoint = this.oCoords["p0"];
                  const { tl, tr, bl, br } = initialPoint.corner;
                  console.log(`Pointer: ${pointer}`);
                  console.log({ tl, tr, bl, br });
                  const clickedOnInitialPoint = fabricUtils.isCoordInsideCoords(
                    pointer,
                    { tl, tr, bl, br },
                  );

                  if (clickedOnInitialPoint) {
                    console.log("inside_coords", pointer, collisionPoint);
                  }
                }
              },
            );

            // Add object to canvas and set it as ACTIVE
            editor.canvas.add(newPolygon);
            editor.canvas.setActiveObject(newPolygon);
          }

          // // Add the object events
          // newPolygon.on(
          //   "mousedown",
          //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
          //   function (this: fabricTypes.ControllableObjectState, _opt) {
          //     const pointer = editor?.canvas.getPointer(opt.e);
          //     if (pointer && _opt.target?.oCoords) {
          //       let isInside = false;
          //       let collisionPoint: string | undefined = undefined;
          //       for (const pointKey in this.oCoords) {
          //         const { tl, tr, bl, br } = this.oCoords[pointKey].corner;
          //         const clickedOnCorner = fabricUtils.isCoordInsideCoords(
          //           pointer,
          //           [tl, tr, bl, br],
          //         );
          //         if (clickedOnCorner) {
          //           isInside = true;
          //           collisionPoint = pointKey;
          //           break;
          //         }
          //       }
          //       if (isInside) {
          //         console.log("inside_coords", pointer, collisionPoint);
          //       }
          //     }
          //   },
          // );

          // if (this.drawingPolygon) {
          //   const pointer = editor?.canvas.getPointer(opt.e);

          //   const polygonId = "polygonId";
          //   const previousPolygon = fabricUtils.findObjectByName(
          //     editor.canvas,
          //     polygonId,
          //   );

          //   if (previousPolygon)
          //     fabricActions.deleteObject(editor.canvas, previousPolygon);

          //   // Polygon "clicked" points with the cursor current pointer
          //   const polygonPoints =
          //     this.polygonPoints?.concat({ x: pointer.x, y: pointer.y }) ?? [];

          //   // const newPolygon = new fabric.Polyline(polygonPoints, {
          //   //   name: polygonId,
          //   //   fill: "rgba(255, 99, 71, 0.2)",
          //   //   stroke: "red",
          //   //   strokeWidth: 1,
          //   //   selectable: true,
          //   //   hasBorders: true,
          //   //   hasControls: true,
          //   //   cornerStyle: "rect",
          //   //   cornerColor: "rgba(113, 113, 117, 0.5)",
          //   //   objectCaching: false,
          //   // });

          //   const newPolygon = fabricUtils.createControllableObject(
          //     fabric.Polyline,
          //     polygonPoints,
          //     {
          //       name: polygonId,
          //       fill: "rgba(255, 99, 71, 0.2)",
          //       hasBorders: false,
          //     },
          //   );

          //   // newPolygon.setControlVisible("mtr", false);
          //   editor.canvas.add(newPolygon);
          //   editor.canvas.setActiveObject(newPolygon);
          // }
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

      editor.canvas.renderAll();

      // TODO: Need to verify this
      // Clear all canvas events when the status changes.
      return () => {
        editor.canvas.off();
      };
    }, [
      draggingEnabled,
      editor,
      image,
      onLoadedImage,
      onZoomChange,
      drawingPolygon,
    ]);

    // Update zoom parent value
    useEffect(() => {
      onZoomChange?.(Math.round(currentZoom));
    }, [currentZoom, onZoomChange]);

    // Load Initial items
    useEffect(() => {
      const toScaledCoord = (coord: { x: number; y: number }) => {
        const height = editor?.canvas.getHeight() ?? 1;
        const width = editor?.canvas.getWidth() ?? 1;
        const x =
          width / 2 - (imageSize.width * scaleRatio) / 2 + coord.x * scaleRatio;
        const y =
          height / 2 -
          (imageSize.height * scaleRatio) / 2 +
          coord.y * scaleRatio;

        return { x, y };
      };

      const canvas = editor?.canvas;
      if (!canvas) return;

      // Clear all objects from canvas
      fabricActions.deleteAll(editor?.canvas);

      for (const item of items) {
        const polygon = new fabric.Polygon(item.coords.map(toScaledCoord), {
          name: `ID_${item.id}`,
          fill: undefined,
          stroke: "red",
          strokeWidth: 1, // TODO: Change here!
        });
        canvas.add(polygon);
      }
    }, [editor?.canvas, imageSize.height, imageSize.width, items, scaleRatio]);

    //   const renderIcon = (
    //     ctx: CanvasRenderingContext2D,
    //     left: number,
    //     top: number,
    //     styleOverride: unknown,
    //     fabricObject: fabric.Object,
    //   ) => {
    //     const deleteIcon =
    //       "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";

    //     const img = document.createElement("img");
    //     img.src = deleteIcon;
    //     const size = 24;
    //     ctx.save();
    //     ctx.translate(left, top);
    //     if (fabricObject.angle)
    //       ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
    //     ctx.drawImage(img, -size / 2, -size / 2, size, size);
    //     ctx.restore();
    //   };

    //   rect.controls = {
    //     onDelete: new fabric.Control({
    //       x: 0.5,
    //       y: -0.5,
    //       offsetY: 16,
    //       cursorStyle: "pointer",
    //       mouseUpHandler: () => onDelete(),
    //       render: renderIcon,
    //     }),
    //   };

    //   editor?.canvas.add(rect);
    //   // setAction({ primitive: "rectangle", operation: "add" });
    // };

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
