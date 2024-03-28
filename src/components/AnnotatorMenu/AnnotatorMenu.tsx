import React from "react";
import { Button, ButtonProps } from "@mui/material";

export type AnnotatorMenuProps = {
  text?: string;
  primary?: boolean;
  disabled?: boolean;
  size?: "small" | "medium" | "large";
} & ButtonProps;

const AnnotatorMenu: React.FC<AnnotatorMenuProps> = ({
  size,
  primary,
  disabled,
  text,
  onClick,
  ...props
}) => {
  // Determine button color and background color based on primary prop
  const buttonColor = primary ? "text-white" : "text-black";
  const bgColor = primary ? "bg-red-600" : "bg-gray-300";

  // Determine padding based on size prop
  let paddingClass = "";
  if (size === "small") {
    paddingClass = "py-1 px-6";
  } else if (size === "medium") {
    paddingClass = "py-2 px-8";
  } else {
    paddingClass = "py-3 px-8";
  }

  return (
    <Button
      variant="contained"
      onClick={onClick}
      disabled={disabled}
      className={`${buttonColor} ${bgColor} ${paddingClass}`}
      {...props}
    >
      {text}
    </Button>
  );
};

export default AnnotatorMenu;
