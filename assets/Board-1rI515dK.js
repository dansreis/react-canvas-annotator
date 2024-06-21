import{j as e,B as o,M as s}from"./Board.stories-BPyqHZcA.js";import{useMDXComponents as i}from"./index-CqcSDpoT.js";import{M as a,C as c}from"./index-Ivox0DPU.js";import"./index-CDs2tPxN.js";import"./iframe-C74eJiMH.js";import"../sb-preview/runtime.js";import"./index-5GBGjSEQ.js";import"./index-BbYVc9ui.js";import"./index-DrFu-skq.js";function t(r){const n={code:"code",h1:"h1",h2:"h2",h4:"h4",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...i(),...r.components};return e.jsxs(e.Fragment,{children:[e.jsx(a,{of:o,title:"Board"}),`
`,e.jsx(n.h1,{id:"board",children:"Board"}),`
`,e.jsx(n.p,{children:"Button component with different props."}),`
`,e.jsx(n.h4,{id:"example",children:"Example"}),`
`,e.jsx(c,{of:s}),`
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
`]})]})}function f(r={}){const{wrapper:n}={...i(),...r.components};return n?e.jsx(n,{...r,children:e.jsx(t,{...r})}):t(r)}export{f as default};
