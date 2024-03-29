import React, { FC } from "react";
import Header, { HeaderProps } from "../Header";

const Example: FC<HeaderProps> = ({
  primary = true,
  size = "medium",
  items = [
    { icon: "circle", text: "Text", onClick: () => console.log("Text") },
  ],
}) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <Header primary={primary} items={items} size={size} />
    </div>
  );
};

export default Example;
