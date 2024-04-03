import React, { FC, useState } from "react";
import Board, { BoardActions, BoardProps } from "../Board";
import styled from "styled-components";

const StyledDiv = styled.div`
  display: flex;
  gap: 10px;
`;

const StyledP = styled.p`
  display: flex;
  border: 1px solid black;
  padding: 3px;
`;

const Example: FC<BoardProps> = ({ primary = true, items, imageSrc }) => {
  const ref = React.createRef<BoardActions>();

  const [toggleStatus, setToggleStatus] = useState(false);
  const [currentZoom, setCurrentZoom] = useState<number | undefined>();

  return (
    <>
      <StyledDiv>
        <button onClick={() => ref.current?.toggleDragging()}>
          Toggle Dragging [{toggleStatus ? "ON" : "OFF"}]
        </button>
        <button onClick={() => ref.current?.resetZoom()}>Reset Zoom</button>
      </StyledDiv>
      <StyledDiv>
        <StyledP>Current zoom: {currentZoom}</StyledP>
      </StyledDiv>
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
          primary={primary}
          imageSrc={imageSrc}
          items={items}
          onToggleDragging={(s) => setToggleStatus(s)}
          onZoomChange={(v) => setCurrentZoom(v)}
        />
      </div>
    </>
  );
};

export default Example;
