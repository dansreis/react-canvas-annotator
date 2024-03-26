import React, { FC } from "react";
import AnnotatorMenuItem, {
  AnnotatorMenuItemProps,
} from "../AnnotatorMenuItem";

const Example: FC<AnnotatorMenuItemProps> = ({
  disabled = false,
  onClick = () => {},
  primary = true,
  size = "small",
  text = "AnnotatorMenuItem",
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
      <AnnotatorMenuItem
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
