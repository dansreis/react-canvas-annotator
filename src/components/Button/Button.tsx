import React, { MouseEventHandler } from "react";
import styled from "styled-components";
import { FaDrawPolygon } from "react-icons/fa";
import tokens from "../../tokens";

export type ButtonProps = {
  text?: string;
  primary?: boolean;
  disabled?: boolean;
  size?: "small" | "medium" | "large";
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

const StyledButton = styled.button<ButtonProps>`
  border: 0;
  line-height: 1;
  font-size: 15px;
  cursor: pointer;
  font-weight: 700;
  font-weight: bold;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  color: ${(props) => (props.primary ? "#fff" : "#000")};
  background-color: ${(props) => (props.primary ? "#FF5655" : "#f4c4c4")};
  padding: ${(props) =>
    props.size === "small"
      ? tokens.size.small
      : props.size === "medium"
        ? tokens.size.medium
        : tokens.size.large};
`;

const Icon = styled.span`
  margin-right: 5px; /* Adjust the margin as needed */
`;

const Button: React.FC<ButtonProps> = ({
  size,
  primary,
  disabled,
  text,
  onClick,
  ...props
}) => {
  return (
    <StyledButton
      type="button"
      onClick={onClick}
      primary={primary}
      disabled={disabled}
      size={size}
      {...props}
    >
      <Icon>
        <FaDrawPolygon />
      </Icon>
      {text}
    </StyledButton>
  );
};

export default Button;
