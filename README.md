<div align="center">
<img src="./docs/logo.svg" alt="react-canvas-annotator" />
</div>

[![NPM](https://img.shields.io/npm/v/@dansreis/react-canvas-annotator)](https://www.npmjs.com/package/@dansreis/react-canvas-annotator)
[![npm](https://img.shields.io/npm/dm/@dansreis/react-canvas-annotator)](https://www.npmjs.com/package/@dansreis/react-canvas-annotator)
[![Build Status](https://github.com/dansreis/react-canvas-annotator/actions/workflows/main.yml/badge.svg)](https://github.com/dansreis/react-canvas-annotator/actions)
![Github All Contributors](https://img.shields.io/github/all-contributors/dansreis/react-canvas-annotator)

# react-canvas-annotator

> Image/Document Annotator Component for React Applications
>
> Powered by FabricJS canvas at its core, this component empowers users to seamlessly integrate annotations such as bounding boxes, polygons, and points onto images or documents. By exposing canvas interactions, it provides a foundation for constructing larger and more complex components.



## Features

- [X] Annotations on image
- [ ] Bounding Box Annotation
- [ ] Point and Polygon Annotation
- [ ] Image zoom and drag
- [ ] Categorize annotations with colors and label

![Screenshot of Annotator](docs/annotations-board.png)

## Usage

`npm install @dansreis/react-canvas-annotator`

```javascript
import React from "react";
import Board  from "react-canvas-annotator";

const App = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "800px",
      height: "500px",
      border: "1px solid black",
    }}
  >
    <Board
      ref={ref}
      imageSrc={"example.png"}
      items={[]}
    />
  </div>
);

export default App;

```

## Props

All of the following properties can be defined on the Annotator...

| Prop                     | Type (\* = required)                             | Description                                                                             | Default       |
| ------------------------ | ------------------------------------------------ | --------------------------------------------------------------------------------------- | ------------- |
| `TODO1`        | \*`string`                                       | Markdown description for what to do in the image.                                       |               |
| `TODO2`            | `{ x: number, y: number }` | Area that is available for annotation.                                                  | Entire image. |


## Developers

### Development

To begin developing run the following commands in the cloned repo.

1. `npm install`
2. `npm start`

Then navigate to http://localhost:6006/ and start testing.

See more details in the [contributing guidelines](https://github.com/dansreis/react-canvas-annotator/blob/main/CONTRIBUTING.md).

### Icons

Consult these icon repositories:

- [Styled Components](https://material.io/tools/icons/)
- [FabricJS](https://github.com/fabricjs/fabric.js)
- [FabricJS-React](https://github.com/asotog/fabricjs-react)

## Donations
<a href="https://www.buymeacoffee.com/dansreis" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

## License

MIT © [Daniel Reis](https://github.com/dansreis)

Feel free to collaborate.
