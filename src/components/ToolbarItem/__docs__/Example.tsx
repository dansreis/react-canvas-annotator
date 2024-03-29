import React, { FC } from "react";
import ToolbarItem, { ToolbarItemProps } from "../ToolbarItem";

const Example: FC<ToolbarItemProps> = ({
  active = false,
  onClick = () => {},
  primary = true,
  size = "small",
  text = "ToolbarItem",
  iconName = "rectangle",
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
      <ToolbarItem
        size={size}
        text={text}
        active={active}
        onClick={onClick}
        primary={primary}
        iconName={iconName}
      />
    </div>
  );
};

export default Example;
