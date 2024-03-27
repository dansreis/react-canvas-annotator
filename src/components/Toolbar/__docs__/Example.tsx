import React, { FC } from "react";
import Toolbar, { ToolbarProps } from "../Toolbar";

const Example: FC<ToolbarProps> = ({
  id = "Toolbar",
  onClick = () => {},
  primary = true,
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
      <Toolbar id={id} onClick={onClick} primary={primary} />
    </div>
  );
};

export default Example;
