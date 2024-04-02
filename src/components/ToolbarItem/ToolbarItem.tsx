import React, { MouseEventHandler } from "react";
import styled from "styled-components";
import tokens from "../../tokens";
import { AvailableIcons } from "../../utils";

export type ToolbarIconTypes = keyof typeof AvailableIcons;

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
      ? `${tokens.font.small}px`
      : props.size === "medium"
        ? `${tokens.font.medium}px`
        : `${tokens.font.large}px`};
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
  const DynamicIcon = AvailableIcons[iconName];

  return (
    <StyledDiv
      role="toolbar-item"
      onClick={onClick}
      primary={primary}
      active={active}
      size={size}
      {...props}
    >
      <IconContainer>
        <DynamicIcon size={tokens.icon.medium} />
      </IconContainer>
      {text}
    </StyledDiv>
  );
};

export default ToolbarItem;
