import React, { FC } from "react";
import Board, { BoardProps } from "../Board";

const Example: FC<BoardProps> = ({ primary = true }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <Board primary={primary} />
    </div>
  );
};

export default Example;
