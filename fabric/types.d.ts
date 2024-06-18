import { Transform } from 'fabric/fabric-impl';

export type TMat2D = [
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number
];
export type CustomObject = fabric.Object & {
    __corner?: string;
    pathOffset?: {
        x: number;
        y: number;
    };
    points?: fabric.Point[];
    oCoords: {
        [key: string]: {
            x: number;
            y: number;
            corner: {
                tl: fabric.Point;
                tr: fabric.Point;
                bl: fabric.Point;
                br: fabric.Point;
            };
        } | undefined;
    };
    setPositionByOrigin?: (pos: fabric.Point, originX: number, originY: number) => void;
    _setPositionDimensions?: (o: unknown) => unknown;
};
export type CustomTransform = Transform & {
    target: CustomObject;
};
export type CanvasAnnotationState = {
    selection?: boolean;
    lastPosX: number;
    lastPosY: number;
    isDragging?: boolean;
    lastClickCoords?: {
        x: number;
        y: number;
    };
    drawingObject?: {
        id?: string;
        type: "polygon" | "rectangle";
        isDrawing: boolean;
        points: {
            x: number;
            y: number;
        }[];
    };
};
