import React, { MouseEventHandler, useState } from "react";
import styled from "styled-components";
import ToolbarItem, { ToolbarIconTypes } from "../ToolbarItem/ToolbarItem";
import tokens from "../../tokens";

export type ToolbarProps = {
  primary?: boolean;
  items: {
    icon: ToolbarIconTypes;
    text: string;
    selected?: boolean;
    onClick?: MouseEventHandler<HTMLButtonElement>;
  }[];
  size?: "small" | "medium" | "large";
};

const StyledDiv = styled.div<Omit<ToolbarProps, "items">>`
  display: flex;
  flex-direction: column;
  background-color: ${(props) =>
    props.primary
      ? tokens.primary.backgroundColor
      : tokens.secondary.backgroundColor};
  gap: 10px;
  height: 100%;
`;

const ItemDiv = styled.div`
  padding: 5px;
`;

const Toolbar: React.FC<ToolbarProps> = ({
  primary,
  items,
  size = "medium",
  ...props
}) => {
  const [selectedItem, setSelectedItem] = useState<number | undefined>(
    items.findIndex((i) => i.selected == true),
  );

  return (
    <StyledDiv role={"toolbar"} primary={primary} {...props}>
      {items.map(({ icon, text, onClick }, index) => (
        <ItemDiv key={index}>
          <ToolbarItem
            iconName={icon}
            text={text}
            primary={primary}
            size={size}
            active={selectedItem === index}
            onClick={(event) => {
              setSelectedItem(index);
              onClick?.(event);
            }}
          />
        </ItemDiv>
      ))}
    </StyledDiv>
  );
};

export default Toolbar;
