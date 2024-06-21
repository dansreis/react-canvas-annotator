import { default as React } from '../../../node_modules/react';
import { CanvasObject } from './types';

export type BoardProps = {
    items: CanvasObject[];
    image: {
        name: string;
        src: string;
    };
    initialStatus?: {
        draggingEnabled?: boolean;
        currentZoom?: number;
        scaleRatio?: number;
    };
    helper: (id: string, content?: string) => React.ReactNode;
    onResetZoom?: () => void;
    onZoomChange?: (currentZoom: number) => void;
    onLoadedImage?: ({ width, height, }: {
        width: number;
        height: number;
    }) => void;
};
export type BoardActions = {
    resetZoom: () => void;
    deleteSelectedObjects: () => void;
    deleteObjectById: (id: string) => void;
    deselectAll: () => void;
    downloadImage: () => void;
    drawObject: (type?: "rectangle" | "polygon") => void;
    retrieveObjects: () => CanvasObject[];
    retrieveObjectContent: (id: string) => string | null;
};
declare const Board: React.ForwardRefExoticComponent<BoardProps & React.RefAttributes<BoardActions>>;
export default Board;
