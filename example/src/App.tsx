import { Board } from "react-canvas-annotator";

import "./App.css";

function App() {
  return (
    <>
      <Board items={[]} image={{name: "annotations-board",src:"annotations-board.png"}} />
    </>
  );
}

export default App;
