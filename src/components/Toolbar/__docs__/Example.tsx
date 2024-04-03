import React, { FC } from "react";
import Toolbar, { ToolbarProps } from "../Toolbar";

const Example: FC<ToolbarProps> = ({
  primary = true,
  size = "medium",
  items = [
    { icon: "circle", text: "Text", onClick: () => console.log("Text") },
  ],
}) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "500px",
      }}
    >
      <Toolbar primary={primary} items={items} size={size} />
    </div>
  );
};

export default Example;
