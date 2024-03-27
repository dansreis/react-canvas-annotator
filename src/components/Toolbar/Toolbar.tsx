import React, { MouseEventHandler } from "react";

export type ToolbarProps = {
  id?: string;
  primary?: boolean;
  onClick?: MouseEventHandler<HTMLDivElement>;
};

const Toolbar: React.FC<ToolbarProps> = ({
  id,
  primary,
  onClick,
  ...props
}) => {
  // Determine button color and background color based on primary prop
  const buttonColor = primary ? "text-white" : "text-black";
  const bgColor = primary ? "bg-red-600" : "bg-gray-300";

  return (
    <div
      id={id}
      onClick={onClick}
      className={`p-2 rounded-md inline-block cursor-pointer ${buttonColor} ${bgColor}`}
      {...props}
    >
      toolbar example
    </div>
  );
};

export default Toolbar;
