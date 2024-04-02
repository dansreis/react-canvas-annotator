import React, { FC } from "react";
import Annotator, { AnnotatorProps } from "../Annotator";

const Example: FC<AnnotatorProps> = ({ id, primary = true }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "900px",
        height: "500px",
      }}
    >
      <Annotator id={id} primary={primary} />
    </div>
  );
};

export default Example;
