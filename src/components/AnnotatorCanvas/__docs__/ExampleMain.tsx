import React, { FC, useEffect, useState } from "react";
import { fabric } from "fabric";
import { AnnotatorCanvasProps } from "../AnnotatorCanvas";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";

const WIDTH = 800;
const HEIGHT = 500;

const ExampleMain: FC<AnnotatorCanvasProps> = ({
  disabled = false,
  onClick = () => {},
  primary = true,
  size = "small",
  text = "Button",
}) => {
  console.log({ disabled, primary, size, onClick, text });
  const { editor, onReady } = useFabricJSEditor();
  const [currentZoom, setCurrentZoom] = useState<number>(100);
  const [scaleRatio, setScaleRation] = useState<number>(100);
  const [imageSize, setImageSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (!editor || !fabric) {
      return;
    }

    editor.canvas.setWidth(WIDTH);
    editor.canvas.setHeight(HEIGHT);

    fabric.Image.fromURL(
      "holder.jpg",
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
      },
      { selectable: false },
    );

    editor.canvas.on("mouse:wheel", function (opt) {
      const delta = opt.e.deltaY;
      let zoom = editor.canvas.getZoom();
      zoom *= 0.999 ** delta;
      if (zoom > 20) zoom = 20;
      if (zoom < 0.01) zoom = 0.01;
      editor.canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
      setCurrentZoom(zoom * 100);
      opt.e.preventDefault();
      opt.e.stopPropagation();
    });

    editor.canvas.on("mouse:down", (opt) => {
      const canvas = editor?.canvas;
      if (!canvas) return;

      // const size = (WIDTH * 0.05) / canvas.getZoom(); // 5% of the width
      // const pointer = canvas.getPointer(opt.e);
      // const origX = pointer.x;
      // const origY = pointer.y;

      // console.log("Clicked!");

      // console.log("Clicked!-insinde");
      // const rect = new fabric.Rect({
      //   left: origX,
      //   top: origY,
      //   originX: "left",
      //   originY: "top",
      //   width: size,
      //   height: size,
      //   fill: "rgba(255,127,39,1)",
      //   selectable: true,
      // });
      // canvas.add(rect);

      canvas.renderAll();
      opt.e.preventDefault();
      opt.e.stopPropagation();
    });

    editor.canvas.renderAll();
  }, [editor]);

  // TODO: Make sure this makes sense..
  const resetZoom = () => {
    editor?.canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
  };

  const getActiveObjects = () => {
    console.log(editor?.canvas.getActiveObjects());
  };

  const addRandom = () => {
    // Calculate the coordinates relative to the image
    // (x1, y1) = (133, 460)
    const rect = new fabric.Rect({
      scaleX: scaleRatio,
      scaleY: scaleRatio,
      left: WIDTH / 2 - (imageSize.width * scaleRatio) / 2 + 133 * scaleRatio, // Specify the left coordinate relative to image
      top: HEIGHT / 2 - (imageSize.height * scaleRatio) / 2 + 460 * scaleRatio,
      width: 73,
      height: 33,
      fill: "rgba(255,127,39,1)",
      selectable: true,
    });
    editor?.canvas.add(rect);
  };

  const onAddRectangle = () => {
    // editor?.addRectangle();
    const rect = new fabric.Rect({
      left: 0,
      top: 0,
      originX: "left",
      originY: "top",
      width: 100,
      height: 100,
      fill: "rgba(255,127,39,1)",
      selectable: true,
    });

    const renderIcon = (ctx, left, top, styleOverride, fabricObject) => {
      const deleteIcon =
        "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";

      const img = document.createElement("img");
      img.src = deleteIcon;
      const size = 24;
      ctx.save();
      ctx.translate(left, top);
      ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
      ctx.drawImage(img, -size / 2, -size / 2, size, size);
      ctx.restore();
    };

    const onDelete = () => {
      editor?.deleteSelected();
      return true;
    };

    rect.controls = {
      onDelete: new fabric.Control({
        x: 0.5,
        y: -0.5,
        offsetY: 16,
        cursorStyle: "pointer",
        mouseUpHandler: () => onDelete(),
        render: renderIcon,
      }),
    };

    editor?.canvas.add(rect);
    // setAction({ primitive: "rectangle", operation: "add" });
  };

  return (
    <div className="App">
      <h1>FabricJS React Sample</h1>
      <button onClick={onAddRectangle}>Add Rectangle</button>
      <button onClick={resetZoom}>Reset Zoom</button>
      <button onClick={addRandom}>Add Random</button>
      <button onClick={getActiveObjects}>Active Objects</button>
      <div
        style={{
          border: `3px solid Green`,
          width: `${WIDTH}px`,
          height: `${HEIGHT}px`,
        }}
      >
        <FabricJSCanvas className="sample-canvas" onReady={onReady} />
        <div>Zoom: {Math.round(currentZoom)}%</div>
      </div>
    </div>
  );
};

export default ExampleMain;
