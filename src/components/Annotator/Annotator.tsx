import React from "react";
import styled from "styled-components";
import { Header } from "../Header";
import { Toolbar } from "../Toolbar";
import { Menu } from "../Menu";
import { Board } from "../Board";
import { BoardActions } from "../Board/Board";
import { CanvasObject } from "../Board/types";

export type AnnotatorProps = {
  id?: string;
  primary?: boolean;
};

const ITEMS: CanvasObject[] = [
  {
    id: "1",
    category: "category1",
    color: "green",
    value: "⌀42",
    coords: [
      {
        x: 133,
        y: 460,
      },
      {
        x: 206,
        y: 460,
      },
      {
        x: 206,
        y: 493,
      },
      {
        x: 133,
        y: 493,
      },
    ],
  },
  {
    id: "2",
    category: "category2",
    color: "green",
    value: "38",
    coords: [
      {
        x: 150,
        y: 1064,
      },
      {
        x: 182,
        y: 1064,
      },
      {
        x: 182,
        y: 1111,
      },
      {
        x: 150,
        y: 1111,
      },
    ],
  },
  {
    id: "3",
    category: "category3",
    color: "green",
    value: "9",
    coords: [
      {
        x: 235,
        y: 1207,
      },
      {
        x: 266,
        y: 1207,
      },
      {
        x: 266,
        y: 1226,
      },
      {
        x: 235,
        y: 1226,
      },
    ],
  },
  {
    id: "4",
    category: "category4",
    color: "green",
    value: "⌀38",
    coords: [
      {
        x: 481,
        y: 1375,
      },
      {
        x: 556,
        y: 1375,
      },
      {
        x: 556,
        y: 1407,
      },
      {
        x: 481,
        y: 1407,
      },
    ],
  },
  {
    id: "5",
    category: "category5",
    color: "green",
    value: "(25.5)",
    coords: [
      {
        x: 1370,
        y: 1405,
      },
      {
        x: 1473,
        y: 1406,
      },
      {
        x: 1472,
        y: 1444,
      },
      {
        x: 1369,
        y: 1442,
      },
    ],
  },
  {
    id: "6",
    category: "category6",
    color: "green",
    value: "1x45°",
    coords: [
      {
        x: 732,
        y: 1277,
      },
      {
        x: 735,
        y: 1381,
      },
      {
        x: 702,
        y: 1382,
      },
      {
        x: 699,
        y: 1278,
      },
    ],
  },
  {
    id: "7",
    category: "category7",
    color: "green",
    value: "1x45°",
    coords: [
      {
        x: 740,
        y: 795,
      },
      {
        x: 738,
        y: 895,
      },
      {
        x: 705,
        y: 894,
      },
      {
        x: 707,
        y: 794,
      },
    ],
  },
  {
    id: "8",
    category: "category8",
    color: "green",
    value: "16",
    coords: [
      {
        x: 943,
        y: 1024,
      },
      {
        x: 945,
        y: 976,
      },
      {
        x: 979,
        y: 978,
      },
      {
        x: 977,
        y: 1025,
      },
    ],
  },
  {
    id: "9",
    category: "category9",
    color: "green",
    value: "45.0°",
    coords: [
      {
        x: 821,
        y: 1093,
      },
      {
        x: 855,
        y: 1182,
      },
      {
        x: 817,
        y: 1197,
      },
      {
        x: 783,
        y: 1108,
      },
    ],
  },
  {
    id: "10",
    category: "category10",
    color: "green",
    value: "⌀21.5±0.1",
    coords: [
      {
        x: 943,
        y: 1341,
      },
      {
        x: 1122,
        y: 1343,
      },
      {
        x: 1121,
        y: 1380,
      },
      {
        x: 942,
        y: 1378,
      },
    ],
  },
  {
    id: "11",
    category: "category11",
    color: "green",
    value: "60.0°",
    coords: [
      {
        x: 925,
        y: 1556,
      },
      {
        x: 963,
        y: 1538,
      },
      {
        x: 1004,
        y: 1627,
      },
      {
        x: 966,
        y: 1644,
      },
    ],
  },
  {
    id: "12",
    category: "category12",
    color: "green",
    value: "⌀38H12",
    coords: [
      {
        x: 1317,
        y: 749,
      },
      {
        x: 1317,
        y: 782,
      },
      {
        x: 1163,
        y: 782,
      },
      {
        x: 1163,
        y: 749,
      },
    ],
  },
];

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
  const ref = React.createRef<BoardActions>();
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
        <InnerContent>
          <Board
            ref={ref}
            primary={primary}
            imageSrc={"holder-min.jpg"}
            items={ITEMS}
            // onToggleDragging={(s) => setToggleStatus(s)}
            // onZoomChange={(v) => setCurrentZoom(v)}
          />
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
