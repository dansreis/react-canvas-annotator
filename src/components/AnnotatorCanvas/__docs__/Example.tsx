import React, { FC } from "react";
import AnnotatorCanvas, { AnnotatorCanvasProps } from "../AnnotatorCanvas";

const Example: FC<AnnotatorCanvasProps> = ({
  disabled = false,
  onClick = () => {},
  primary = true,
  size = "small",
  text = "Button",
}) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <AnnotatorCanvas
        size={size}
        text={text}
        disabled={disabled}
        onClick={onClick}
        primary={primary}
      />
    </div>
  );
};

export default Example;
