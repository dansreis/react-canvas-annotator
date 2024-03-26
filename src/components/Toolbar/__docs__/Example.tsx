import React, { FC } from "react";
import Toolbar, { ToolbarProps } from "../Toolbar";

const Example: FC<ToolbarProps> = ({
  disabled = false,
  onClick = () => {},
  primary = true,
  size = "small",
  text = "Toolbar",
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
      <Toolbar
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
