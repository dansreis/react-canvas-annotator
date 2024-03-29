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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 0;
  line-height: 1;
  font-size: ${(props) =>
    props.size === "small"
      ? `${tokens.font.small}px`
      : props.size === "medium"
        ? `${tokens.font.medium}px`
        : `${tokens.font.large}px`};
  cursor: pointer;
  font-weight: 700;
  font-weight: bold;
  border-radius: 10px;
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
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) =>
      props.primary ? "#ff3635" : "#d9b3b3"}; // Adjust hover color
  }
  &:active {
    background-color: #3e8e41;
  }

  /* &:disabled {
    background-color: gray;
    background-image: repeating-linear-gradient(
        45deg,
        transparent,
        transparent 1px,
        rgba(255, 255, 255, 0.556) 1px,
        rgba(255, 255, 255, 0.556) 3px
      ),
      repeating-linear-gradient(
        -45deg,
        transparent,
        transparent 1px,
        rgba(255, 255, 255, 0.556) 1px,
        rgba(255, 255, 255, 0.556) 3px
      );

    cursor: not-allowed;
  } */
`;

const IconContainer = styled.span`
  margin-bottom: 5px; // Adjust the margin as needed
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
      <IconContainer>
        <FaDrawPolygon size={16} />
      </IconContainer>
      {text}
    </StyledButton>
  );
};

export default Button;
