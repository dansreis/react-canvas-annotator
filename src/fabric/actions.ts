import { findObjectByName } from "./utils";

/**
 *
 * Deletes an object
 *
 * @param canvas html canvas to look for the object
 * @param obj object to delete
 */
export const deleteObject = (canvas: fabric.Canvas, obj: fabric.Object) => {
  if (obj) canvas.remove(obj);
};

/**
 *
 * Deletes all objects from the canvas
 *
 * @param canvas fabricjs HTML canvas
 */
export const deleteAll = (canvas: fabric.Canvas) => {
  canvas?.getObjects().forEach((o) => canvas?.remove(o));
  canvas?.discardActiveObject();
  canvas?.renderAll();
};

/**
 *
 * Deletes all selected objects from the canvas
 *
 * @param canvas fabricjs HTML canvas
 */
export const deleteSelected = (canvas: fabric.Canvas) => {
  const activeObjects = canvas.getActiveObjects();
  if (activeObjects) {
    activeObjects.forEach((activeObject) => {
      canvas.remove(activeObject);
    });
    canvas.discardActiveObject();
  }
};

/**
 *
 * Deletes an object by its name
 *
 * @param canvas html canvas to look for the object
 * @param name object identifier
 */
export const deleteObjectByName = (canvas: fabric.Canvas, name: string) => {
  const obj = findObjectByName(canvas, name);
  if (obj) canvas.remove(obj);
};

/**
 *
 * Applies an input image to a canvas and downloads the image from it. (TODO: later on it will be downloaded with the annotations if specified)
 *
 * @param image properties and resources
 */
export const canvasImageDownload = (image: { name: string; src: string }) => {
  // Create a temporary canvas to compose original image and annotations
  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d")!;

  // Get the original image data from the canvas
  const originalImageSrc = image.src; // Provide the path to your original image
  const originalImage = new Image();
  originalImage.src = originalImageSrc;

  // Wait for the original image to load before composing
  originalImage.onload = function () {
    // Set the size of the temporary canvas to match the original image
    tempCanvas.width = originalImage.width;
    tempCanvas.height = originalImage.height;

    // Draw the original image onto the temporary canvas
    tempCtx.drawImage(originalImage, 0, 0);

    // Get the Fabric.js canvas instance
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    // const canvas = editor?.canvas!;
    // const fabricCanvas = canvas.getObjects();
    // console.log(fabricCanvas[0]);

    // items.forEach((item) => {
    //   const polygon = new fabric.Polygon(item.coords, {
    //     name: `ID_${item.id}`,
    //     fill: undefined,
    //     stroke: "red",
    //     strokeWidth: 1,
    //   });
    //   // tempCtx.save();
    //   polygon.render(tempCtx);
    //   // tempCtx.restore();
    // });

    // Loop through all objects on the Fabric.js canvas and draw them onto the temporary canvas
    // fabricCanvas.forEach((obj) => {
    //   const scaleFactorX = tempCanvas.width / canvas.width!;
    //   const scaleFactorY = tempCanvas.height / canvas.height!;

    //   console.log({ scaleFactorX, scaleFactorY });

    //   // Adjust top and left positions based on the scale
    //   const left = obj.left! * scaleFactorX;
    //   const top = obj.top! * scaleFactorY;

    //   tempCtx.save();
    //   tempCtx.translate(0, 0);
    //   tempCtx.scale(scaleFactorX, scaleFactorY);
    //   obj.render(tempCtx);
    //   tempCtx.restore();
    // });

    // Convert the composed image on the temporary canvas to a data URL
    const composedDataURL = tempCanvas.toDataURL("image/png");

    // Create a temporary anchor element
    const link = document.createElement("a");
    link.href = composedDataURL;
    link.download = image.name; // Set the desired filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
};
