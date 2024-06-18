/**
 *
 * Deletes an object
 *
 * @param canvas html canvas to look for the object
 * @param obj object to delete
 */
export declare const deleteObject: (canvas: fabric.Canvas, obj: fabric.Object) => void;
/**
 *
 * Deletes all objects from the canvas
 *
 * @param canvas fabricjs HTML canvas
 */
export declare const deleteAll: (canvas: fabric.Canvas) => void;
/**
 *
 * Deletes all selected objects from the canvas
 *
 * @param canvas fabricjs HTML canvas
 */
export declare const deleteSelected: (canvas: fabric.Canvas) => void;
/**
 *
 * Deletes an object by its name
 *
 * @param canvas html canvas to look for the object
 * @param name object identifier
 */
export declare const deleteObjectByName: (canvas: fabric.Canvas, name: string) => void;
/**
 *
 * Applies an input image to a canvas and downloads the image from it. (TODO: later on it will be downloaded with the annotations if specified)
 *
 * @param image properties and resources
 */
export declare const canvasImageDownload: (image: {
    name: string;
    src: string;
}) => void;
