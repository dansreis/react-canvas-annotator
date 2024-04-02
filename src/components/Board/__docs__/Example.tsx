import React, { FC } from "react";
import Board, { BoardProps } from "../Board";
import useBoardActions from "../hooks";

const Example: FC<BoardProps> = ({ primary = true, items, imageSrc }) => {
  const { actions, onLoaded } = useBoardActions();
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
        <Board
          primary={primary}
          imageSrc={imageSrc}
          items={items}
          onLoaded={onLoaded}
        />
      </div>
      <button onClick={() => actions.alert()}>LOG</button>
    </>
  );
};

export default Example;
