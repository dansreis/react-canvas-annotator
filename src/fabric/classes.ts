import { fabric } from "fabric";

interface CustomCornerObjectOptions extends fabric.IGroupOptions {
  number?: number;
  color?: string;
}

export class CustomCornerObject extends fabric.Group {
  constructor(options: CustomCornerObjectOptions = {}) {
    const number =
      options.number !== undefined ? options.number.toString() : "";
    const size = 5;
    const circle = new fabric.Circle({
      radius: size / 2,
      fill: "white",
      stroke: options.color ?? "green",
      strokeWidth: 0.8,
      originX: "center",
      originY: "center",
      left: 1.5,
      top: -1,
    });

    const text = new fabric.Text(number, {
      fontSize: size / 2,
      fontFamily: "Arial",
      originX: "center",
      originY: "center",
      fill: "black",
      left: 1.5,
      top: -1,
    });

    const pointer = new fabric.Triangle({
      width: size / 3,
      height: size / 3,
      fill: options.color ?? "green",
      stroke: options.color ?? "green",
      strokeWidth: 1,
      originX: "center",
      originY: "bottom",
      top: -size / 2,
      angle: -45,
    });

    const objects = [circle, text, pointer];
    super(objects, options);

    this.set("selectable", false);
    this.set("evented", true);
  }
}
