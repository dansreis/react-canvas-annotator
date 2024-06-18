import{j as e,B as i,M as s}from"./Board.stories-BQUubG20.js";import{useMDXComponents as o}from"./index-z5U8iC57.js";import{M as a,C as c}from"./index-CANtNxoj.js";import"./index-BBkUAzwr.js";import"./v4-D8aEg3BZ.js";import"./iframe-YmqOLXN8.js";import"../sb-preview/runtime.js";import"./index-PqR-_bA4.js";import"./index-DrlA5mbP.js";import"./index-DrFu-skq.js";function r(t){const n={code:"code",em:"em",h1:"h1",h2:"h2",h4:"h4",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...o(),...t.components};return e.jsxs(e.Fragment,{children:[e.jsx(a,{of:i,title:"Board"}),`
`,e.jsx(n.h1,{id:"board",children:"Board"}),`
`,e.jsx(n.p,{children:"Button component with different props."}),`
`,e.jsx(n.h4,{id:"example",children:"Example"}),`
`,e.jsx(c,{of:s}),`
`,e.jsx(n.h2,{id:"usage",children:"Usage"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-ts",children:`import Board {BoardActions} from "react-canvas-annotator";

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
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"text"})," ",e.jsx(n.em,{children:e.jsx(n.code,{children:"() => void"})})," - A string that represents the text content of the button."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"primary"})," - A boolean indicating whether the button should have a primary styling or not. Typically, a primary button stands out as the main action in a user interface."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"disabled"})," - A boolean indicating whether the button should be disabled or not. When disabled, the button cannot be clicked or interacted with."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"size"}),' - A string with one of three possible values: "small," "medium," or "large." It defines the size or dimensions of the button.']}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"onClick"})," - A function that is called when the button is clicked. It receives a MouseEventHandler for handling the click event on the button element."]}),`
`]})]})}function b(t={}){const{wrapper:n}={...o(),...t.components};return n?e.jsx(n,{...t,children:e.jsx(r,{...t})}):r(t)}export{b as default};
