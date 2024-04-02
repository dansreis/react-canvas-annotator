import React from "react";
import styled from "styled-components";

export type TooltipProps = {
  primary?: boolean;
};

const TooltipText = styled.div`
  background: rgba(28, 56, 151, 0.9);
  color: #fff;
  width: 200px;
  text-align: center;
  line-height: 44px;
  border-radius: 3px;
  cursor: pointer;
`;
const TooltipBox = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  left: 30px;
  visibility: hidden;
  color: transparent;
  background-color: transparent;
  width: 150px;
  padding: 5px 5px;
  border-radius: 4px;
  transition:
    visibility 0.5s,
    color 0.5s,
    background-color 0.5s,
    width 0.5s,
    padding 0.5s ease-in-out;
  &:before {
    content: "";
    width: 0;
    height: 0;
    left: 40px;
    top: -10px;
    position: absolute;
    border: 10px solid transparent;
    transform: rotate(135deg);
    transition: border 0.3s ease-in-out;
  }
`;
const TooltipCard = styled.div`
  position: relative;
  & ${TooltipText}:hover + ${TooltipBox} {
    visibility: visible;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.8);
    width: 230px;
    padding: 8px 8px;
    &:before {
      border-color: transparent transparent rgba(0, 0, 0, 0.8)
        rgba(0, 0, 0, 0.8);
    }
  }
`;

const Tooltip: React.FC<TooltipProps> = () => {
  return (
    <>
      <TooltipCard>
        <TooltipText>
          <h3>Hover :D</h3>
        </TooltipText>
        <TooltipBox>
          <p>First item</p>
          <p>Second item</p>
        </TooltipBox>
      </TooltipCard>
      <h4 style={{ color: "rgba(0,0,0,0.5)" }}>
        Some content that is right below Hover :D
      </h4>
    </>
  );
};

export default Tooltip;
