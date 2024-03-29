import React, { MouseEventHandler } from "react";
import styled from "styled-components";
import tokens from "../../tokens";
import { PiRectangle, PiCircle } from "react-icons/pi";
import { IoHandRightOutline } from "react-icons/io5";
import { LiaMousePointerSolid } from "react-icons/lia";

const ToolbarIcons = {
  rectangle: PiRectangle,
  circle: PiCircle,
  hand: IoHandRightOutline,
  pointer: LiaMousePointerSolid,
};

export type ToolbarIconTypes = keyof typeof ToolbarIcons;

export type ToolbarItemProps = {
  iconName: ToolbarIconTypes;
  text?: string;
  primary?: boolean;
  active?: boolean;
  size?: "small" | "medium" | "large";
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

const StyledDiv = styled.div<Omit<ToolbarItemProps, "iconName">>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 0;
  font-family: "Roboto";
  font-style: normal;
  font-size: ${(props) =>
    props.size === "small"
      ? "9px 30px 9px"
      : props.size === "medium"
        ? "9px 30px 9px"
        : "9px 30px 9px"};
  cursor: pointer;
  font-weight: 400;
  border-radius: 5px;
  align-items: center;
  justify-content: center;
  position: relative;
  color: ${(props) =>
    props.primary ? tokens.primary.color : tokens.secondary.color};
  background-color: ${(props) =>
    props.primary
      ? props.active
        ? tokens.primary.hoverColor
        : tokens.primary.backgroundColor
      : props.active
        ? tokens.secondary.hoverColor
        : tokens.secondary.backgroundColor};
  padding: ${(props) =>
    props.size === "small"
      ? "5px 15px 5px"
      : props.size === "medium"
        ? "9px 25px 9px"
        : "13px 30px 13px"};
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) =>
      props.primary
        ? tokens.primary.hoverColor
        : tokens.secondary.hoverColor}; // Adjust hover color: ;
  }
  &:active {
    background-color: ${(props) =>
      props.primary
        ? tokens.primary.activeColor
        : tokens.secondary.activeColor};
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
  margin-bottom: 3px; // Adjust the margin as needed
`;

const ToolbarItem: React.FC<ToolbarItemProps> = ({
  size,
  iconName,
  primary,
  text,
  active,
  onClick,
  ...props
}) => {
  const DynamicIcon = ToolbarIcons[iconName];

  return (
    <StyledDiv
      onClick={onClick}
      primary={primary}
      active={active}
      size={size}
      {...props}
    >
      <IconContainer>
        <DynamicIcon size={20} />
      </IconContainer>
      {text}
    </StyledDiv>
  );
};

export default ToolbarItem;
