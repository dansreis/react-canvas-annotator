import React, { FC } from "react";
import Menu, { MenuProps } from "../Menu";

const Example: FC<MenuProps> = ({
  primary = true,
  visible = true,
  items = [
    { icon: "tags", title: "Tag", content: <>Hello World</> },
    { icon: "zoomReset", title: "Zooming", content: <>Hello World</> },
  ],
}) => {
  return (
    <div
      style={{
        display: "flex",
        width: "500px",
        height: "500px",
        overflow: "auto",
      }}
    >
      <Menu primary={primary} visible={visible} items={items} />
    </div>
  );
};

export default Example;
