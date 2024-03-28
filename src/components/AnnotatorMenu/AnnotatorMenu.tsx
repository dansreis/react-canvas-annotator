import React, { MouseEventHandler } from "react";

export type AnnotatorMenuProps = {
  text?: string;
  primary?: boolean;
  disabled?: boolean;
  size?: "small" | "medium" | "large";
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

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
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`border-0 font-semibold rounded-lg inline-block cursor-pointer ${buttonColor} ${bgColor} ${paddingClass}`}
      {...props}
    >
      {text}
    </button>
  );
};

export default AnnotatorMenu;
