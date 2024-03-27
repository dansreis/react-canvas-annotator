import { Button, Header } from "react-image-annotator";

import "./App.css";

function App() {
  return (
    <>
      <Button text="Button" onClick={() => console.log("Button!")}/>
      <Header text="Header" onClick={() => console.log("Header!")}/>
    </>
  );
}

export default App;
