import React from "react";

export type AnnotatorProps = {
  id?: string;
  primary?: boolean;
};

const Annotator: React.FC<AnnotatorProps> = ({ id, primary, ...props }) => {
  return (
    <div id={id} role={"annotator"} {...props}>
      <div>Header</div>
      <div>
        <div>Toolbar</div>
        <div>CanvasContainer</div>
        <div>Stack Menu</div>
      </div>
    </div>
  );
};

export default Annotator;
