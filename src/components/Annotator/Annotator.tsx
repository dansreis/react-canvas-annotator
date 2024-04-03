import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { Header } from "../Header";
import { Toolbar } from "../Toolbar";
import { Menu } from "../Menu";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";

export type AnnotatorProps = {
  id?: string;
  primary?: boolean;
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  border: 2px solid black;
  border-radius: 2px;
  padding: 5px;
`;

const TopBar = styled.div`
  height: "auto";
  display: flex;
  align-items: center;
  justify-content: center;
  border-color: black;
`;

const InnerWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
`;

const LeftBar = styled.div`
  background-color: #444;
  width: auto;
  overflow: hidden;
`;

const RightBar = styled.div`
  width: auto;
  min-width: 250px;
`;

const InnerContent = styled.div`
  flex: 1;
  border: 1px solid #cbcbcb;
  margin: 15px;
`;

const Annotator: React.FC<AnnotatorProps> = ({ id, primary }) => {
  const ref = useRef(null);
  const { editor, onReady } = useFabricJSEditor();

  useEffect(() => {
    if (!editor || !ref.current) {
      return;
    }
    console.log("width", ref.current ? ref.current.offsetWidth : 0);
    console.log("height", ref.current ? ref.current.offsetHeight : 0);

    editor.canvas.setWidth(ref.current.offsetWidth);
    editor.canvas.setHeight(ref.current.offsetHeight);
  }, [ref, editor]);

  return (
    <Container id={id} role={"annotator"}>
      <TopBar>
        <Header
          primary={primary}
          imageInfo={{ width: 1920, height: 1080 }}
          zoom={{ value: 10, action: (e) => console.log(e) }}
          annotation={{ value: true, action: (e) => console.log(e) }}
        />
      </TopBar>
      <InnerWrapper>
        <LeftBar>
          <Toolbar
            primary={primary}
            size="medium"
            items={[
              {
                icon: "hand",
                text: "Move",
                onClick: () => console.log("Move"),
              },
              {
                icon: "pointer",
                text: "Pointer",
                selected: true,
                onClick: () => console.log("Pointer"),
              },
              {
                icon: "rectangle",
                text: "Annotate",
                onClick: () => console.log("Annotate"),
              },
            ]}
          />
        </LeftBar>
        <InnerContent ref={ref}>
          <FabricJSCanvas className="sample-canvas" onReady={onReady} />
        </InnerContent>
        <RightBar>
          <Menu
            visible
            primary={primary}
            items={[
              {
                icon: "circle",
                title: "Circle",
                content: (
                  <div>
                    <p>It is a circle</p>
                    <ul>
                      <li>Circle 1</li>
                      <li>Circle 2</li>
                      <li>Circle 3</li>
                    </ul>
                    <button>Click me (circle)!</button>
                  </div>
                ),
                disabled: false,
              },
              {
                icon: "tags",
                title: "Tags",
                content: (
                  <div>
                    <p>It is a tag</p>
                    <ul>
                      <li>Tag 1</li>
                      <li>Tag 2</li>
                      <li>Tag 3</li>
                    </ul>
                    <button>Click me (tag)!</button>
                  </div>
                ),
                disabled: false,
              },
              {
                icon: "annotation",
                title: "Annotation",
                content: (
                  <div>
                    <p>It is a annotation</p>
                    <ul>
                      <li>Annotation 1</li>
                      <li>Annotation 2</li>
                      <li>Annotation 3</li>
                    </ul>
                    <button>Click me (annotation)!</button>
                  </div>
                ),
                disabled: true,
              },
              {
                icon: "coffee",
                title: "Coffee",
                content: (
                  <div>
                    <p>It is a coffee</p>
                    <ul>
                      <li>Coffee 1</li>
                      <li>Coffee 2</li>
                      <li>Coffee 3</li>
                    </ul>
                    <button>Click me (coffee)!</button>
                  </div>
                ),
                disabled: false,
              },
            ]}
          />
        </RightBar>
      </InnerWrapper>
    </Container>
  );
};

export default Annotator;
