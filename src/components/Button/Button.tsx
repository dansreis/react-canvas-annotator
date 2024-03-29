import React, { MouseEventHandler } from "react";
import styled from "styled-components";
import { FaDrawPolygon } from "react-icons/fa";
import tokens from "../../tokens";
import { arrayToRGBA } from "../../utils";

export type ButtonProps = {
  text?: string;
  primary?: boolean;
  disabled?: boolean;
  size?: "small" | "medium" | "large";
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

const StyledButton = styled.button<ButtonProps>`
  display: flex;
  flex-direction: row;
  gap: 5px;
  align-items: center;
  justify-content: center;
  border: 0;
  line-height: 0;
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
  color: ${(props) =>
    props.primary ? tokens.primary.color : tokens.secondary.color};
  background-color: ${(props) =>
    props.primary
      ? tokens.primary.backgroundColor
      : tokens.secondary.backgroundColor};
  padding: ${(props) =>
    props.size === "small"
      ? "5px 8px 5px"
      : props.size === "medium"
        ? "8px 10px 8px"
        : "10px 12px 10px"};
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) =>
      props.primary
        ? tokens.primary.hoverColor
        : tokens.secondary.hoverColor}; // Adjust hover color
  }
  &:active {
    background-color: ${(props) =>
      props.primary
        ? tokens.primary.activeColor
        : tokens.secondary.activeColor};
  }

  &:disabled {
    background-color: ${(props) =>
      props.primary
        ? tokens.primary.disabledColor
        : tokens.secondary.disabledColor};

    background-image: ${(props) => `repeating-linear-gradient(
        45deg,
        transparent,
        transparent 1px,
        ${arrayToRGBA(props.primary ? tokens.primary.backgroundColor : tokens.secondary.backgroundColor, 0.7)} 1px,
        ${arrayToRGBA(props.primary ? tokens.primary.backgroundColor : tokens.secondary.backgroundColor, 0.7)} 3px
      ),
      repeating-linear-gradient(
        -45deg,
        transparent,
        transparent 1px,
        ${arrayToRGBA(props.primary ? tokens.primary.backgroundColor : tokens.secondary.backgroundColor, 0.7)} 1px,
        ${arrayToRGBA(props.primary ? tokens.primary.backgroundColor : tokens.secondary.backgroundColor, 0.7)} 3px
      );`}; // Adjust hover color

    /* background-image: repeating-linear-gradient(
        45deg,
        transparent,
        transparent 1px,
        rgba(255, 255, 255, 0.8) 1px,
        rgba(255, 255, 255, 0.8) 5px
      ),
      repeating-linear-gradient(
        -45deg,
        transparent,
        transparent 1px,
        rgba(255, 255, 255, 0.8) 1px,
        rgba(255, 255, 255, 0.8) 5px
      ); */

    cursor: not-allowed;
  }
`;

const IconContainer = styled.span``;

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
