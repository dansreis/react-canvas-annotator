import React, { FC } from "react";
import Menu, { MenuProps } from "../Menu";

const Example: FC<MenuProps> = ({
  disabled = false,
  onClick = () => {},
  primary = true,
  size = "small",
  text = "Menu",
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
      <Menu
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
