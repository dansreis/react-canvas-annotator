import React, { FC } from "react";
import Tooltip, { TooltipProps } from "../Tooltip";

const Example: FC<TooltipProps> = ({ primary = true }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <Tooltip primary={primary} />
    </div>
  );
};

export default Example;
