import { default as CustomControl } from './controls/CustomControl';
import { IPolylineOptions } from 'fabric/fabric-impl';
import { fabric } from 'fabric';

import * as fabricTypes from "./types";
/**
 *
 * Transforms a coordinate into the original coordinate from input
 *
 * @param cInfo canvas width and height
 * @param iInfo image width and height
 * @param coord coord to transform
 * @param scaleRatio current zoom/scale
 * @returns
 */
export declare const toOriginalCoord: ({ cInfo, iInfo, coord, scaleRatio, }: {
    cInfo: {
        width: number;
        height: number;
    };
    iInfo: {
        width: number;
        height: number;
    };
    coord: fabric.Point;
    scaleRatio: number;
}) => {
    x: number;
    y: number;
};
/**
 *
 * Transforms a coordinate into a canvas-scaled coordinate, making it compatible for use within the canvas.
 *
 * @param cInfo canvas width and height
 * @param iInfo image width and height
 * @param coord coord to transform
 * @param scaleRatio current zoom/scale
 * @returns
 */
export declare const toScaledCoord: ({ cInfo, iInfo, coord, scaleRatio, }: {
    cInfo: {
        width: number;
        height: number;
    };
    iInfo: {
        width: number;
        height: number;
    };
    coord: {
        x: number;
        y: number;
    };
    scaleRatio: number;
}) => {
    x: number;
    y: number;
};
/**
 *
 * Retrieves an object points in the canvas
 *
 * @param obj custom object
 * @returns
 */
export declare const pointsInCanvas: (obj?: fabricTypes.CustomObject) => fabric.Point[];
/**
 *
 * Retrieves all available objects in canvas
 *
 * @param canvas html canvas to look for the object
 * @returns
 */
export declare const retrieveObjects: <T extends fabric.Object>(canvas: fabric.Canvas) => T[] | undefined;
/**
 *
 * Finds an object in a canvas according to its name
 *
 * @param canvas html canvas to look for the object
 * @param name object identifier
 * @returns
 */
export declare const findObjectByName: <T extends fabric.Object>(canvas: fabric.Canvas, name?: string) => T | undefined;
/**
 *
 * @param points array of points to create the polygon
 * @param options options of the polygon (fill, stroke, controls..)
 * @returns
 */
export declare const createControllableCustomObject: <T extends fabric.Polygon | fabric.Polyline>(FabricObj: new (points: Array<{
    x: number;
    y: number;
}>, options?: IPolylineOptions) => T, points: {
    x: number;
    y: number;
}[], options?: IPolylineOptions, isRectangle?: boolean) => fabricTypes.CustomObject;
/**
 * Define a function that can locate the controls.
 * This function will be used both for drawing and for interaction.
 * More info: http://fabricjs.com/custom-controls-polygon
 */
export declare const polygonPositionHandler: (this: CustomControl, _dim: {
    x: number;
    y: number;
}, _finalMatrix: fabricTypes.TMat2D, fabricObject: fabric.Polyline) => fabric.Point;
/**
 * More info: http://fabricjs.com/custom-controls-polygon
 */
export declare const getObjectSizeWithStroke: (object: fabric.Object) => fabric.Point;
/**
 * Define a function that will define what the control does
 * This function will be called on every mouse move after a control has been clicked and is being dragged.
 * The function receive as argument the mouse event, the current trasnform object and the current position in canvas coordinate
 * transform.target is a reference to the current object being transformed,
 *
 * More info: http://fabricjs.com/custom-controls-polygon
 */
export declare const actionHandler: (_eventData: MouseEvent, transform: fabricTypes.CustomTransform, x: number, y: number) => boolean;
/**
 * Define a function that can keep the polygon in the same position when we change its width/height/top/left.
 *
 * More info: http://fabricjs.com/custom-controls-polygon
 */
export declare const anchorWrapper: (anchorIndex: number, fn: (eventData: MouseEvent, transform: fabricTypes.CustomTransform, x: number, y: number) => boolean) => (eventData: MouseEvent, transform: fabricTypes.CustomTransform, x: number, y: number) => boolean;
export declare const isCoordInsideCoords: (point: {
    x: number;
    y: number;
}, vertices: {
    tl: {
        x: number;
        y: number;
    };
    tr: {
        x: number;
        y: number;
    };
    bl: {
        x: number;
        y: number;
    };
    br: {
        x: number;
        y: number;
    };
}) => boolean;
