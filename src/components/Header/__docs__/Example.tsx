import React, { FC } from "react";
import Header, { HeaderProps } from "../Header";

const Example: FC<HeaderProps> = ({
  disabled = false,
  onClick = () => {},
  primary = true,
  size = "small",
  text = "Header",
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
      <Header
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
