import{j as n,B as o,M as s}from"./Board.stories-CmjRpZpC.js";import{useMDXComponents as i}from"./index-CqcSDpoT.js";import{M as a,C as c}from"./index-BrD9qiZz.js";import"./index-CDs2tPxN.js";import"./iframe-DjHbrynZ.js";import"../sb-preview/runtime.js";import"./index-5GBGjSEQ.js";import"./index-BbYVc9ui.js";import"./index-DrFu-skq.js";function t(r){const e={code:"code",h1:"h1",h2:"h2",h4:"h4",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...i(),...r.components};return n.jsxs(n.Fragment,{children:[n.jsx(a,{of:o,title:"Board"}),`
`,n.jsx(e.h1,{id:"board",children:"Board"}),`
`,n.jsx(e.p,{children:"Button component with different props."}),`
`,n.jsx(e.h4,{id:"example",children:"Example"}),`
`,n.jsx(c,{of:s}),`
`,n.jsx(e.h2,{id:"usage",children:"Usage"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-ts",children:`import Board {BoardActions} from "react-canvas-annotator";

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
`,n.jsx(e.h4,{id:"arguments",children:"Arguments"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"image"})," ",n.jsx(e.code,{children:"{ name: string, src: string }"})," - The image object containing the name and source URL."]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"items"})," ",n.jsx(e.code,{children:"CanvasObject[]"}),": - An array of canvas objects to be rendered."]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"initialStatus"})," ",n.jsx(e.code,{children:"{ draggingEnabled?: boolean, currentZoom?: number, scaleRatio?: number }"}),": - Optional initial status settings for the board:"]}),`
`]}),`
`,n.jsxs(e.p,{children:[n.jsx(e.code,{children:"draggingEnabled"}),": Boolean flag indicating if dragging is enabled."]}),`
`,n.jsxs(e.p,{children:[n.jsx(e.code,{children:"currentZoom"}),": Number representing the initial zoom level."]}),`
`,n.jsxs(e.p,{children:[n.jsx(e.code,{children:"scaleRatio"}),": Number representing the scale ratio."]}),`
`,n.jsxs(e.p,{children:[n.jsx(e.code,{children:"onResetZoom () => void"}),": Optional callback function to reset the zoom level."]}),`
`,n.jsxs(e.p,{children:[n.jsx(e.code,{children:"onZoomChange: "}),"(currentZoom: number) => void` - Optional callback function called when the zoom level changes."]}),`
`,n.jsxs(e.p,{children:[n.jsx(e.code,{children:"currentZoom"}),": Number representing the current zoom level."]}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[`
`,n.jsxs(e.p,{children:[n.jsx(e.strong,{children:"onToggleDragging"}),": ",n.jsx(e.code,{children:"(currentStatus: boolean) => void"})," -  Optional callback function called when dragging status changes."]}),`
`]}),`
`,n.jsxs(e.li,{children:[`
`,n.jsxs(e.p,{children:[n.jsx(e.strong,{children:"currentStatus"}),": Boolean indicating the current dragging status."]}),`
`]}),`
`,n.jsxs(e.li,{children:[`
`,n.jsxs(e.p,{children:[n.jsx(e.strong,{children:"onLoadedImage"}),": ",n.jsx(e.code,{children:"({ width, height }: { width: number, height: number }) => void"})," -  Optional callback function called when the image is loaded (width: Width of the loaded image, height: Height of the loaded image)."]}),`
`]}),`
`]})]})}function f(r={}){const{wrapper:e}={...i(),...r.components};return e?n.jsx(e,{...r,children:n.jsx(t,{...r})}):t(r)}export{f as default};
