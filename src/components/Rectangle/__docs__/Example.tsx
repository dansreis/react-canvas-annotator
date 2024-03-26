import React, { FC } from "react";
import Rectangle, { RectangleProps } from "../Rectangle";

const Example: FC<RectangleProps> = ({
  disabled = false,
  onClick = () => {},
  primary = true,
  size = "small",
  text = "Rectangle",
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
      <Rectangle
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
