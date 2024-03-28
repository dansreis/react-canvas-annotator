import React from "react";
import Button from "@mui/material/Button";

export type ButtonProps = {
  text?: string;
  primary?: boolean;
  disabled?: boolean;
  size?: "small" | "medium" | "large";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

const MyButton: React.FC<ButtonProps> = ({
  size,
  primary,
  disabled,
  text,
  onClick,
  ...props
}) => {
  // Determine button color and background color based on primary prop
  const buttonColor = primary ? "text-white" : "text-black";
  const bgColor = primary ? "#2196f3" : "#4caf50"; // Adjust colors according to Material-UI theme

  // Determine padding based on size prop
  let paddingStyle = {};
  if (size === "small") {
    paddingStyle = { padding: "6px 16px" };
  } else if (size === "medium") {
    paddingStyle = { padding: "8px 24px" };
  } else {
    paddingStyle = { padding: "10px 24px" };
  }

  return (
    <Button
      variant="contained"
      color="primary"
      disabled={disabled}
      onClick={onClick}
      style={{ ...paddingStyle, backgroundColor: bgColor, color: buttonColor }}
      {...props}
    >
      {text}
    </Button>
  );
};

export default MyButton;
