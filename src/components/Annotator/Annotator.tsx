import React from "react";
import styled from "styled-components";

export type AnnotatorProps = {
  id?: string;
  primary?: boolean;
};

const StyledDiv = styled.div``;

const Annotator: React.FC<AnnotatorProps> = ({ id, ...props }) => {
  return (
    <StyledDiv id={id} role="annotator" {...props}>
      <div>Header</div>
      <div>
        <div>Toolbar</div>
        <div>CanvasContainer</div>
        <div>Stack Menu</div>
      </div>
    </StyledDiv>
  );
};

export default Annotator;
