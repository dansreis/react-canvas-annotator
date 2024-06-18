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
    onResetZoom?: () => void;
    onZoomChange?: (currentZoom: number) => void;
    onToggleDragging?: (currentStatus: boolean) => void;
    onLoadedImage?: ({ width, height, }: {
        width: number;
        height: number;
    }) => void;
};
export type BoardActions = {
    toggleDragging: (value?: boolean) => void;
    resetZoom: () => void;
    deleteSelectedObjects: () => void;
    downloadImage: () => void;
    drawObject: (type?: "rectangle" | "polygon") => void;
    retrieveObjects: () => CanvasObject[];
};
declare const Board: React.ForwardRefExoticComponent<BoardProps & React.RefAttributes<BoardActions>>;
export default Board;
