import React, { MouseEventHandler } from "react";

export type ButtonProps = {
  text?: string;
  primary?: boolean;
  disabled?: boolean;
  size?: "small" | "medium" | "large";
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

const Button: React.FC<ButtonProps> = ({
  size,
  primary,
  disabled,
  text,
  onClick,
  ...props
}) => {
  // Determine button color and background color based on primary prop
  const buttonColor = primary ? "text-white" : "text-black";
  const bgColor = primary ? "bg-blue-500" : "bg-green-500";

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
    <>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`border-0 font-semibold rounded-lg inline-block cursor-pointer ${buttonColor} ${bgColor} ${paddingClass}`}
        {...props}
      >
        {text}
      </button>
    </>
  );
};

export default Button;
