import React, { FC } from "react";
import Board, { BoardActions, BoardProps } from "../Board";

const Example: FC<BoardProps> = ({ primary = true, items, imageSrc }) => {
  const ref = React.createRef<BoardActions>();

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "800px",
          height: "500px",
        }}
      >
        <Board ref={ref} primary={primary} imageSrc={imageSrc} items={items} />
      </div>
      <button onClick={() => ref.current?.toggleDragging()}>Dragging</button>
    </>
  );
};

export default Example;
