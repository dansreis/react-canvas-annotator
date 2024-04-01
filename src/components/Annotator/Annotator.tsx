import React from "react";

export type AnnotatorProps = {
  id?: string;
  primary?: boolean;
};

const Annotator: React.FC<AnnotatorProps> = ({ id, primary, ...props }) => {
  const baseClasses = primary
    ? "text-white bg-red-600"
    : "text-black bg-gray-300";
  const headerClasses = "bg-gray-800 text-white py-2 text-center";
  const containerClasses = "flex h-screen";
  const toolbarClasses = "bg-gray-400 w-1/20 p-4";
  const canvasContainerClasses = "flex-grow";
  const stackMenuClasses = "bg-gray-400 w-1/6 p-4";

  return (
    <div
      id={id}
      role={"annotator"}
      className={`w-full ${baseClasses}`}
      {...props}
    >
      <div className={headerClasses}>Header</div>
      <div className={containerClasses}>
        <div className={toolbarClasses}>Toolbar</div>
        <div className={canvasContainerClasses}>CanvasContainer</div>
        <div className={stackMenuClasses}>Stack Menu</div>
      </div>
    </div>
  );
};

export default Annotator;
