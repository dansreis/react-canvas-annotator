import Button from "@mui/material/Button";
import React from "react";

export type AnnotatorMenuItemProps = {
  text?: string;
  primary?: boolean;
  disabled?: boolean;
  size?: "small" | "medium" | "large";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

const AnnotatorMenuItem: React.FC<AnnotatorMenuItemProps> = ({
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
      color="primary"
      onClick={onClick}
      disabled={disabled}
      className={`${buttonColor} ${bgColor} ${paddingClass}`}
      {...props}
    >
      {text}
    </Button>
  );
};

export default AnnotatorMenuItem;
