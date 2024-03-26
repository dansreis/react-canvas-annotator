import React, { FC } from "react";
import AnnotatorMenu, { AnnotatorMenuProps } from "../AnnotatorMenu";

const Example: FC<AnnotatorMenuProps> = ({
  disabled = false,
  onClick = () => {},
  primary = true,
  size = "small",
  text = "AnnotatorMenu",
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
      <AnnotatorMenu
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
