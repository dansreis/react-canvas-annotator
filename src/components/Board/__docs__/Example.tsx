import React, { FC, useState } from "react";
import Board, { BoardActions, BoardProps } from "../Board";

const Example: FC<BoardProps> = ({ items, image }) => {
  const ref = React.createRef<BoardActions>();

  const [isDrawingPolygon, setIsDrawingPolygon] = useState(false);
  const [isDrawingRectangle, setIsDrawingRectangle] = useState(false);
  const [currentZoom, setCurrentZoom] = useState<number | undefined>();
  const [numberFlagSize, setNumberFlagSize] = useState(15);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [numberFlagPosition, setNumberFlagPosition] = useState<
    | "topLeft"
    | "top"
    | "topRight"
    | "left"
    | "right"
    | "bottomLeft"
    | "bottom"
    | "bottomRight"
  >("topLeft");

  return (
    <>
      <div style={{ display: "flex", gap: "10px" }}>
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
            if (!isDrawingRectangle) {
              ref.current?.drawObject("rectangle");
            } else {
              ref.current?.drawObject();
            }
            setIsDrawingRectangle(!isDrawingRectangle);
          }}
        >
          Draw Rectangle [{isDrawingRectangle ? "ON" : "OFF"}]
        </button>
        <button
          onClick={() => {
            const annotations = ref.current?.retrieveObjects();
            ref.current?.downloadImage(
              annotations
                ?.filter((el) => el.id.startsWith("corner"))
                .map((el) => el.id),
            );
          }}
        >
          Download Image
        </button>
        <button
          onClick={() => {
            const annotations = ref.current?.retrieveObjects();
            console.log(
              ref.current?.getAnnotatedImageAsBase64(
                annotations
                  ?.filter((el) => el.id.startsWith("corner"))
                  .map((el) => el.id),
              ),
            );
          }}
        >
          Output image as base64 to console
        </button>
        <button
          onClick={() => {
            const asd = ref.current?.retrieveObjects();
            console.log(asd);
          }}
        >
          Retrieve Objects
        </button>
        <button
          onClick={() => {
            ref.current?.jumpToId("1", false, true);
          }}
        >
          Jump to 1
        </button>
        <button
          onClick={() => {
            const obj = ref.current?.retrieveObjectContent("1");
            console.log(obj);
          }}
        >
          Show content of: 1
        </button>
      </div>
      <div style={{ display: "flex", gap: "10px" }}>
        <div
          style={{ display: "flex", border: "1 solid black", padding: "3px" }}
        >
          Current zoom: {currentZoom}
        </div>
        <div>
          <p>Numberflag size:</p>
          <input
            type="range"
            min="5"
            max="35"
            value={numberFlagSize}
            onChange={(e) => setNumberFlagSize(parseInt(e.target.value))}
          ></input>
        </div>
        <div>
          <p>Numberflag position:</p>
          <select
            onChange={(e) =>
              setNumberFlagPosition(
                e.target.value as
                  | "topLeft"
                  | "top"
                  | "topRight"
                  | "left"
                  | "right"
                  | "bottomLeft"
                  | "bottom"
                  | "bottomRight",
              )
            }
          >
            <option value="topLeft">topLeft</option>
            <option value="top">top</option>
            <option value="topRight">topRight</option>
            <option value="left">left</option>
            <option value="right">right</option>
            <option value="bottomLeft">bottomLeft</option>
            <option value="bottom">bottom</option>
            <option value="bottomRight">bottomRight</option>
          </select>
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
          items={items.map((i, index) => {
            return {
              ...i,
              numberFlag: index,
              numberFlagSize,
              numberFlagPosition,
              borderColor: i.id === highlightId ? "red" : i.borderColor,
              fillColor:
                i.id === highlightId ? "rgba(255,0,0,0.4)" : i.fillColor,
            };
          })}
          helper={(id, content) => {
            const processContent = (c?: string) => {
              const startLength = 20;
              const endLength = 20;
              // Check if the string is long enough to be shortened
              if (!c || c.length <= startLength + endLength) {
                return content;
              }
              const start = c.substring(0, startLength);
              const end = c.substring(c.length - endLength);

              // Concatenate with ellipsis
              return `${start}...${end}`;
            };
            return (
              <div>
                <p>Hello {id}</p>
                <p>{processContent(content)}</p>
                <button onClick={() => ref.current?.deselectAll()}>OK</button>
                <button onClick={() => ref.current?.deleteObjectById(id)}>
                  Delete Object
                </button>
              </div>
            );
          }}
          onSelectItem={(item) => {
            if (!item) return;
            setHighlightId(item?.name ?? null);
          }}
          onZoomChange={(v) => setCurrentZoom(v)}
          // onItemHover={(item) => {
          //   if (item.id) {
          //     setHighlighted(item.id);
          //   }
          // }}
          onMovingNumberFlag={(id, newPosition) => console.log(id, newPosition)}
        />
      </div>
    </>
  );
};

export default Example;
