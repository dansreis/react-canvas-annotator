import{j as e}from"./jsx-runtime-QvZ8i92b.js";import{useMDXComponents as o}from"./index-FeUjBnvO.js";import{M as i,C as s}from"./index-BR30DjoS.js";import{B as a,M as c}from"./Board.stories-Bno9GSkC.js";import"./index-uubelm5h.js";import"./iframe-BUWNiWsv.js";import"../sb-preview/runtime.js";import"./index-Ds9UkXKy.js";import"./utils-DhuYYJsA.js";import"./index-DrFu-skq.js";function t(r){const n={code:"code",h1:"h1",h2:"h2",h4:"h4",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...o(),...r.components};return e.jsxs(e.Fragment,{children:[e.jsx(i,{of:a,title:"Board"}),`
`,e.jsx(n.h1,{id:"board",children:"Board"}),`
`,e.jsx(n.p,{children:"Button component with different props."}),`
`,e.jsx(n.h4,{id:"example",children:"Example"}),`
`,e.jsx(s,{of:c}),`
`,e.jsx(n.h2,{id:"usage",children:"Usage"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-ts",children:`import Board, {BoardActions} from "react-canvas-annotator";

const Example = () => {
  const image = {name: "test", src: "http://imagesource.com/test.png"}
  const ref = React.createRef<BoardActions>();
  return (
      <Board
        ref={ref}
        image={image}
        items={[]}
      />
  );
};

export default Example;
`})}),`
`,e.jsx(n.h4,{id:"arguments",children:"Arguments"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"image"})," ",e.jsx(n.code,{children:"{ name: string, src: string }"})," - The image object containing the name and source URL."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"items"})," ",e.jsx(n.code,{children:"CanvasObject[]"}),": - An array of canvas objects to be rendered."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"initialStatus"})," ",e.jsx(n.code,{children:"{ draggingEnabled?: boolean, currentZoom?: number, scaleRatio?: number }"}),": - Optional initial status settings for the board:"]}),`
`]}),`
`,e.jsxs(n.p,{children:[e.jsx(n.code,{children:"draggingEnabled"}),": Boolean flag indicating if dragging is enabled."]}),`
`,e.jsxs(n.p,{children:[e.jsx(n.code,{children:"currentZoom"}),": Number representing the initial zoom level."]}),`
`,e.jsxs(n.p,{children:[e.jsx(n.code,{children:"scaleRatio"}),": Number representing the scale ratio."]}),`
`,e.jsxs(n.p,{children:[e.jsx(n.code,{children:"onResetZoom () => void"}),": Optional callback function to reset the zoom level."]}),`
`,e.jsxs(n.p,{children:[e.jsx(n.code,{children:"onZoomChange: "}),"(currentZoom: number) => void` - Optional callback function called when the zoom level changes."]}),`
`,e.jsxs(n.p,{children:[e.jsx(n.code,{children:"currentZoom"}),": Number representing the current zoom level."]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"currentStatus"}),": Boolean indicating the current dragging status."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"onLoadedImage"}),": ",e.jsx(n.code,{children:"({ width, height }: { width: number, height: number }) => void"})," -  Optional callback function called when the image is loaded (width: Width of the loaded image, height: Height of the loaded image)."]}),`
`]})]})}function b(r={}){const{wrapper:n}={...o(),...r.components};return n?e.jsx(n,{...r,children:e.jsx(t,{...r})}):t(r)}export{b as default};
