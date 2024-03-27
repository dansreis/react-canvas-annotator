import React, { MouseEventHandler } from "react";
import styled from "styled-components";

export type ToolbarProps = {
  id?: string;
  primary?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

const ToolbarButton = styled.div<ToolbarProps>`
  color: ${(props) => (props.primary ? "#fff" : "#000")};
  background-color: ${(props) => (props.primary ? "#FF5655" : "#f4c4c4")};
`;

const Toolbar: React.FC<ToolbarProps> = ({
  id,
  primary,
  onClick,
  ...props
}) => {
  return (
    <ToolbarButton id={id} onClick={onClick} primary={primary} {...props}>
      toolbar example
    </ToolbarButton>
  );
};

export default Toolbar;
