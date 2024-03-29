import React, { FC } from "react";
import MenuItem, { MenuItemProps } from "../MenuItem";

const Example: FC<MenuItemProps> = ({
  active = false,
  onClick = () => {},
  primary = true,
  size = "small",
  text = "MenuItem",
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
      <MenuItem
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
