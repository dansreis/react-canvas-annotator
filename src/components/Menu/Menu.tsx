import React, { useState } from "react";
import styled from "styled-components";
import { FiChevronDown, FiChevronUp } from "react-icons/fi"; // Assuming you have react-icons installed
import { AvailableIcons } from "../../utils";
import tokens from "../../tokens";
import { CgUnavailable } from "react-icons/cg";

export type MenuProps = {
  primary?: boolean;
  visible?: boolean;
  items: {
    icon?: keyof typeof AvailableIcons;
    title: string;
    content: React.ReactNode;
    disabled?: boolean;
  }[];
};

// Styled components
const MenuContainer = styled.div<Omit<MenuProps, "items">>`
  width: 100%;
  height: 100%;
  font-family: Roboto;
  font-style: normal;
  visibility: ${(props) => (props.visible ? "visible" : "hidden")};
  font-size: 14px;
  background-color: ${(props) =>
    props.primary
      ? tokens.primary.backgroundColor
      : tokens.secondary.backgroundColor};
  color: ${(props) =>
    props.primary ? tokens.primary.color : tokens.secondary.color};
`;

const MenuItem = styled.div<Omit<MenuProps, "items">>`
  border: 1px solid
    ${(props) =>
      props.primary ? tokens.primary.lightColor : tokens.secondary.lightColor};
  border-radius: 5px;
  margin: 0 5px 5px 5px;
  background-color: ${(props) =>
    props.primary ? undefined : tokens.secondary.activeColor};
`;

const MenuHeader = styled.div<
  Omit<MenuProps, "items"> & { disabled?: boolean }
>`
  background-color: ${(props) =>
    props.primary
      ? tokens.primary.semiBackgroundColor
      : tokens.secondary.backgroundColor};

  padding: 10px;
  border-radius: 5px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MenuTitle = styled.span<Omit<MenuProps, "items">>`
  display: flex;
  gap: 10px;
  font-weight: 600;
`;

const MenuIcon = styled.div`
  display: "flex";
  align-items: "center";
  justify-content: "center";
`;

const MenuContent = styled.div<Omit<MenuProps, "items"> & { isOpen: boolean }>`
  padding: 10px;
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
  color: ${(props) =>
    props.primary ? tokens.primary.color : tokens.secondary.color};
`;

const Menu: React.FC<MenuProps> = ({ primary, visible = true, items }) => {
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  const toggleMenu = (index: number) => {
    const currentIndex = openIndexes.indexOf(index);
    const newOpenIndexes = [...openIndexes];
    if (currentIndex === -1) {
      newOpenIndexes.push(index);
    } else {
      newOpenIndexes.splice(currentIndex, 1);
    }
    setOpenIndexes(newOpenIndexes);
  };

  return (
    <MenuContainer primary={primary} visible={visible} role="menu">
      {items.map(({ icon, title, content, disabled }, index) => {
        const DynamicIcon = AvailableIcons[icon ?? "rectangle"];
        return (
          <MenuItem primary={primary} key={index}>
            <MenuHeader
              primary={primary}
              disabled={!!disabled}
              onClick={() => !disabled && toggleMenu(index)}
            >
              <MenuTitle primary={primary}>
                {icon ? (
                  <MenuIcon>
                    <DynamicIcon size={tokens.icon.medium} />
                  </MenuIcon>
                ) : undefined}
                {title}
              </MenuTitle>
              {openIndexes.includes(index) ? (
                <FiChevronUp />
              ) : disabled ? (
                <CgUnavailable />
              ) : (
                <FiChevronDown />
              )}
            </MenuHeader>
            <MenuContent primary={primary} isOpen={openIndexes.includes(index)}>
              {content}
            </MenuContent>
          </MenuItem>
        );
      })}
    </MenuContainer>
  );
};

export default Menu;
