import React, { FC } from "react";
import Annotator, { AnnotatorProps } from "../Annotator";

const Example: FC<AnnotatorProps> = ({
  disabled = false,
  onClick = () => {},
  primary = true,
  size = "small",
  text = "Annotator",
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
      <Annotator
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
