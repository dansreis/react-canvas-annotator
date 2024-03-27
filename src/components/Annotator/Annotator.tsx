import React from "react";
import styled from "styled-components";

export type AnnotatorProps = {
  id?: string;
  primary?: boolean;
};

const Base = styled.div<AnnotatorProps>`
  width: 100%;
  color: ${(props) => (props.primary ? "#fff" : "#000")};
  background-color: ${(props) => (props.primary ? "#FF5655" : "#f4c4c4")};
`;

const Header = styled.div`
  background-color: #333;
  color: #fff;
  padding: 10px;
  text-align: center;
`;

const Container = styled.div`
  display: flex;
  height: calc(100vh - 40px);
`;

const Toolbar = styled.div`
  background-color: #ddd;
  width: 5%;
  padding: 10px;
`;

const CanvasContainer = styled.div`
  flex-grow: 1;
  position: relative;
`;

const StackMenu = styled.div`
  background-color: #ddd;
  width: 15%;
  padding: 10px;
`;

const Annotator: React.FC<AnnotatorProps> = ({ id, primary, ...props }) => {
  return (
    <Base id={id} primary={primary} {...props}>
      <Header>Header</Header>
      <Container>
        <Toolbar>Toolbar</Toolbar>
        <CanvasContainer>CanvasContainer</CanvasContainer>
        <StackMenu>Stack Meny</StackMenu>
      </Container>
    </Base>
  );
};

export default Annotator;
