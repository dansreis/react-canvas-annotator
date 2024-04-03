import React, { useState } from "react";
import styled from "styled-components";
import tokens from "../../tokens";
import { Button } from "../Button";

export type HeaderProps = {
  primary?: boolean;
  size?: "small" | "medium" | "large";
  imageInfo?: { width: number; height: number };
  zoom?: { value: number; action?: (event: "in" | "out" | "reset") => void };
  annotation?: { value: boolean; action: (event: "on" | "off") => void };
};

const Divider = styled.div<HeaderProps>`
  height: 80%;
  width: 1px; /* Width of the divider */
  /* Color of the divider */
  background-color: ${(props) =>
    props.primary
      ? tokens.secondary.backgroundColor
      : tokens.primary.backgroundColor};
  margin: auto 10px; /* Adjust margin as needed */
`;

const StyledDiv = styled.div<HeaderProps>`
  display: flex;
  flex-direction: row;
  background-color: ${(props) =>
    props.primary
      ? tokens.primary.backgroundColor
      : tokens.secondary.backgroundColor};
  padding: 5px;
  width: 100%;
  gap: 3px;
  justify-content: center;

  height: ${(props) =>
    props.size === "small"
      ? "26px"
      : props.size === "medium"
        ? "32px"
        : "36px"};
`;

const ZoomValue = styled.span<HeaderProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Roboto;
  font-style: normal;
  font-weight: 500;
  min-width: 50px;
  padding: 4px 8px;
  color: ${(props) =>
    props.primary ? tokens.primary.color : tokens.secondary.color};
  border: ${(props) =>
    props.primary
      ? `1px solid ${tokens.primary.borderColor}`
      : `1px solid ${tokens.secondary.borderColor}`};
  border-radius: 4px;
  text-align: center;
`;

const ImageInfo = styled.span<HeaderProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Roboto;
  font-style: normal;
  font-weight: 500;
  color: ${(props) =>
    props.primary ? tokens.primary.lightColor : tokens.secondary.lightColor};
`;

const Header: React.FC<HeaderProps> = ({
  primary = true,
  size = "medium",
  imageInfo,
  zoom,
  annotation,
  ...props
}) => {
  const [annotationStatus, setAnnotationStatus] = useState(annotation?.value);

  return (
    <StyledDiv role={"header"} primary={primary} size={size} {...props}>
      {/* Show Image information */}
      {imageInfo ? (
        <>
          <ImageInfo primary={primary}>
            {imageInfo?.width}x{imageInfo?.height}px
          </ImageInfo>
        </>
      ) : undefined}
      {/* Allow Zoom */}
      {zoom ? (
        <>
          <Divider primary={primary} />
          <Button
            primary={primary}
            size={size}
            iconName="zoomOut"
            onClick={() => zoom?.action?.("out")}
          />
          <ZoomValue primary={primary}>{zoom.value} %</ZoomValue>
          <Button
            primary={primary}
            size={size}
            iconName="zoomIn"
            onClick={() => zoom?.action?.("in")}
          />
          <Button
            primary={primary}
            size={size}
            iconName="zoomReset"
            onClick={() => zoom?.action?.("reset")}
          />
        </>
      ) : undefined}
      {/* Annotations */}
      {annotation ? (
        <>
          <Divider primary={primary} />
          <Button
            primary={primary}
            size={size}
            iconName={annotationStatus ? "annotation" : "annotationDisabled"}
            onClick={() => {
              setAnnotationStatus(!annotationStatus);
              annotation?.action?.(annotationStatus ? "on" : "off");
            }}
          />
        </>
      ) : undefined}
    </StyledDiv>
  );
};

export default Header;
