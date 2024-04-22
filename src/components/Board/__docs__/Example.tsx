import React, { FC, useState } from "react";
import Board, { BoardActions, BoardProps } from "../Board";

const Example: FC<BoardProps> = ({ items, image }) => {
  const ref = React.createRef<BoardActions>();

  const [toggleStatus, setToggleStatus] = useState(false);
  const [isDrawingPolygon, setIsDrawingPolygon] = useState(false);
  const [isDrawingRectangle, setIsDrawingRectangle] = useState(false);
  const [currentZoom, setCurrentZoom] = useState<number | undefined>();

  return (
    <>
      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={() => ref.current?.toggleDragging()}>
          Toggle Dragging [{toggleStatus ? "ON" : "OFF"}]
        </button>
        <button onClick={() => ref.current?.resetZoom()}>Reset Zoom</button>
        <button onClick={() => ref.current?.deleteSelectedObjects()}>
          Delete Selected
        </button>
        <button
          onClick={() => {
            ref.current?.drawObject();
            setIsDrawingPolygon(!isDrawingPolygon);
          }}
        >
          Draw Polygon [{isDrawingPolygon ? "ON" : "OFF"}]
        </button>
        <button
          onClick={() => {
            ref.current?.drawObject();
            setIsDrawingRectangle(!isDrawingRectangle);
          }}
        >
          Draw Rectangle [{isDrawingRectangle ? "ON" : "OFF"}]
        </button>
        <button onClick={() => ref.current?.downloadImage()}>
          Download Image
        </button>
        <button
          onClick={() => {
            const asd = ref.current?.retrieveObjects();
            console.log(asd);
          }}
        >
          Retrieve Objects
        </button>
      </div>
      <div style={{ display: "flex", gap: "10px" }}>
        <div
          style={{ display: "flex", border: "1 solid black", padding: "3px" }}
        >
          Current zoom: {currentZoom}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "800px",
          height: "500px",
          border: "1px solid black",
        }}
      >
        <Board
          ref={ref}
          image={image}
          items={items}
          onToggleDragging={(s) => setToggleStatus(s)}
          onZoomChange={(v) => setCurrentZoom(v)}
        />
      </div>
    </>
  );
};

export default Example;
