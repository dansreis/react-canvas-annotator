import React, { FC } from "react";
import Header, { HeaderProps } from "../Header";

const Example: FC<HeaderProps> = (props) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "800px",
      }}
    >
      <Header {...props} />
    </div>
  );
};

export default Example;
