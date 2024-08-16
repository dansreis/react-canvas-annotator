import { fabric } from "fabric";

interface CustomCornerObjectOptions extends fabric.IGroupOptions {
  polygon: fabric.Polygon;
  number?: number;
  color?: string;
  size?: number;
  coords: {
    x: number;
    y: number;
  };
  position?:
    | "topLeft"
    | "top"
    | "topRight"
    | "left"
    | "right"
    | "bottomLeft"
    | "bottom"
    | "bottomRight";
}

export class CustomCornerObject extends fabric.Group {
  constructor(options: CustomCornerObjectOptions) {
    const number =
      options.number !== undefined ? options.number.toString() : "";
    // const size = options.size !== undefined ? options.size : 15;
    const size = 35;

    let leftCircleAndTextOffset = 0;
    let topCircleAndTextOffset = 0;
    let leftPointerOffset = 0;
    let topPointerOffset = 0;
    let pointerAngle = 0;

    options.position = "top";
    switch (options.position) {
      case "topLeft":
        leftCircleAndTextOffset = size;
        topCircleAndTextOffset = size;
        leftPointerOffset = (size - 5) * 0.7;
        topPointerOffset = (size - 5) * 0.7;
        pointerAngle = 135;
        break;
      case "top":
        leftCircleAndTextOffset = size;
        topCircleAndTextOffset = size;
        leftPointerOffset = (size - 5) * 0.7 + (options.polygon.width ?? 0);
        topPointerOffset = (size - 5) * 0.7;
        pointerAngle = 180;
        break;
      case "topRight":
        leftCircleAndTextOffset = size + (size - 5) * 0.5;
        topCircleAndTextOffset = -(size + (size - 5) * 0.5);
        pointerAngle = 225;
        break;
      case "left":
        leftCircleAndTextOffset = -(size + (size - 5) * 0.5);
        topCircleAndTextOffset = 0;
        pointerAngle = 90;
        break;
      case "right":
        leftCircleAndTextOffset = size + (size - 5) * 0.5;
        topCircleAndTextOffset = 0;
        pointerAngle = 270;
        break;
      case "bottomLeft":
        leftCircleAndTextOffset = size + (size - 5) * 0.5;
        topCircleAndTextOffset = size + (size - 5) * 0.5;
        pointerAngle = 45;
        break;
      case "bottom":
        leftCircleAndTextOffset = size + (size - 5) * 0.5;
        topCircleAndTextOffset = size + (size - 5) * 0.5;
        pointerAngle = 0;
        break;
      default:
        leftCircleAndTextOffset = size + (size - 5) * 0.5;
        topCircleAndTextOffset = size + (size - 5) * 0.5;
        pointerAngle = 315;
    }

    // const circle = new fabric.Circle({
    //   radius: size / 2,
    //   fill: "white",
    //   stroke: options.color ?? "green",
    //   strokeWidth: 0.8,
    //   originX: "center",
    //   originY: "center",
    //   left: leftCircleAndTextOffset,
    //   top: topCircleAndTextOffset,
    // });

    // const text = new fabric.Text(number, {
    //   fontSize: size / 2,
    //   fontFamily: "Arial",
    //   originX: "center",
    //   originY: "center",
    //   fill: "black",
    //   left: 1.5 + (size - 5) * 0.5 + leftCircleAndTextOffset,
    //   top: -1,
    // });

    const pointer = new fabric.Triangle({
      width: size / 3,
      height: size / 3,
      fill: options.color ?? "green",
      stroke: options.color ?? "green",
      strokeWidth: 1,
      originX: "center",
      originY: "center",
      left: 0,
      top: 0,
      angle: pointerAngle,
    });

    console.log("leftPointerOffset", leftPointerOffset);
    // console.log("topCircleAndTextOffset", topCircleAndTextOffset);
    const objects = [pointer];
    options.left = options.coords.x - size + leftPointerOffset;
    options.top = options.coords.y - size + topPointerOffset;
    super(objects, options);

    this.set("selectable", false);
    this.set("evented", true);
  }
}
