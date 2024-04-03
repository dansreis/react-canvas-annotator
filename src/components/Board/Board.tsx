import React, { useEffect, useState } from "react";
import { fabric } from "fabric";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import tokens from "../../tokens";
import { CanvasObject } from "./types";
import styled from "styled-components";

export type BoardProps = {
  primary?: boolean;
  items: CanvasObject[];
  imageSrc: string;
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
};

type CanvasAnnotationState = {
  selection?: boolean;
  lastPosX: number;
  lastPosY: number;
  isDragging?: boolean;
};

const StyledCanvas = styled.div`
  width: 100%;
  height: 100%;
`;

const Board = React.forwardRef<BoardActions, BoardProps>(
  (
    {
      primary = true,
      imageSrc,
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
    }));
    const { editor, onReady } = useFabricJSEditor();

    const [currentZoom, setCurrentZoom] = useState<number>(
      initialStatus?.currentZoom || 100,
    );

    const [scaleRatio, setScaleRation] = useState(
      initialStatus?.scaleRatio || 100,
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [imageSize, setImageSize] = useState({
      width: 0,
      height: 0,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [draggingEnabled, setDraggingEnabled] = useState(
      initialStatus?.draggingEnabled || false,
    );

    useEffect(() => {
      const parentCanvasElement = document.getElementById(
        "react-annotator-canvas",
      );
      if (!editor || !fabric || !parentCanvasElement) {
        return;
      }

      // Background color of canvas
      editor.canvas.backgroundColor = primary
        ? tokens.primary.backgroundColor
        : tokens.secondary.backgroundColor;

      // Set FabricJS canvas width and height
      editor.canvas.setWidth(parentCanvasElement.clientWidth);
      editor.canvas.setHeight(parentCanvasElement.clientHeight);

      // Change the cursor
      editor.canvas.defaultCursor = draggingEnabled ? "pointer" : "default";

      fabric.Image.fromURL(
        imageSrc,
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

      editor.canvas.on(
        "mouse:wheel",
        function (this: CanvasAnnotationState, opt) {
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

      editor.canvas.on(
        "mouse:down",
        function (this: CanvasAnnotationState, opt) {
          const evt = opt.e;
          this.isDragging = draggingEnabled;
          this.selection = false;
          this.lastPosX = evt.clientX;
          this.lastPosY = evt.clientY;

          opt.e.preventDefault();
          opt.e.stopPropagation();
        },
      );

      editor.canvas.on(
        "mouse:move",
        function (this: CanvasAnnotationState, opt) {
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

          opt.e.preventDefault();
          opt.e.stopPropagation();
        },
      );

      editor.canvas.on("mouse:up", function (this: CanvasAnnotationState, opt) {
        this.isDragging = false;
        this.selection = true;

        opt.e.preventDefault();
        opt.e.stopPropagation();
      });

      // Selected Objects
      editor.canvas.on(
        "selection:created",
        function (this: CanvasAnnotationState, opt) {
          // console.log("SELECTED! ", opt.selected?.[0]);

          opt.e.preventDefault();
          opt.e.stopPropagation();
        },
      );

      // editor.canvas.on("mouse:over", function (this: CanvasAnnotationState, opt) {
      //   opt.target?.set("fill", "green");
      //   editor.canvas.renderAll();

      //   opt.e.preventDefault();
      //   opt.e.stopPropagation();
      // });

      // editor.canvas.on("mouse:out", function (this: CanvasAnnotationState, opt) {
      //   opt.target?.set("fill", "rgba(255,127,39,1)");
      //   editor.canvas.renderAll();

      //   opt.e.preventDefault();
      //   opt.e.stopPropagation();
      // });

      editor.canvas.renderAll();
    }, [
      primary,
      draggingEnabled,
      editor,
      imageSrc,
      onLoadedImage,
      onZoomChange,
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

      for (const item of items) {
        const polygon = new fabric.Polygon(item.coords.map(toScaledCoord), {
          fill: undefined,
          stroke: "red",
          strokeWidth: 0.3,
        });
        editor?.canvas.add(polygon);
      }
    }, [editor?.canvas, imageSize.height, imageSize.width, items, scaleRatio]);

    // const onAddRectangle = () => {
    //   // editor?.addRectangle();
    //   const rect = new fabric.Rect({
    //     name: "MERDAS",
    //     left: 0,
    //     top: 0,
    //     originX: "left",
    //     originY: "top",
    //     width: 100,
    //     height: 100,
    //     fill: "rgba(255,127,39,1)",
    //     selectable: true,
    //     visible: true,
    //   });

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

    //   const onDelete = () => {
    //     editor?.deleteSelected();
    //     return true;
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

    // const getVisible = () => {
    //   console.log(editor?.canvas.getObjects()?.[0].visible);
    // };

    return (
      <>
        <StyledCanvas id="react-annotator-canvas">
          <FabricJSCanvas className="fabricjs-canvas" onReady={onReady} />
        </StyledCanvas>
      </>
      // <div className="App">
      //   <button onClick={onAddRectangle}>Add Rectangle</button>
      //   <button onClick={resetZoom}>Reset Zoom</button>
      //   <button onClick={addRandom}>Add Random</button>
      //   <button onClick={draggingState}>
      //     DraggingState {draggingEnabled ? "ON" : "OFF"}
      //   </button>
      //   <button onClick={getActiveObjects}>Active Objects</button>
      //   <button onClick={getVisible}>Get Visible</button>
      //   <div
      //     style={{
      //       border: `3px solid Green`,
      //       width: `${WIDTH}px`,
      //       height: `${HEIGHT}px`,
      //     }}
      //   >
      //     <FabricJSCanvas className="react-annotator-canvas" onReady={onReady} />
      //     <div>Zoom: {Math.round(currentZoom)}%</div>
      //   </div>
      // </div>
    );
  },
);

Board.displayName = "Board";
export default Board;
