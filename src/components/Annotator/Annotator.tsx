import React from "react";
import { Box, Typography } from "@mui/material";

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
    <Box id={id} className={`w-full ${baseClasses}`} {...props}>
      <Box className={headerClasses}>
        <Typography variant="h6">Header</Typography>
      </Box>
      <Box className={containerClasses}>
        <Box className={toolbarClasses}>
          <Typography>Toolbar</Typography>
        </Box>
        <Box className={canvasContainerClasses}>
          <Typography>CanvasContainer</Typography>
        </Box>
        <Box className={stackMenuClasses}>
          <Typography>Stack Menu</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Annotator;
