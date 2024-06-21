export type CanvasObject = {
    id: string;
    category: string;
    color: string;
    value: string;
    selectable?: boolean;
    coords: {
        x: number;
        y: number;
    }[];
    opacity?: number;
    content?: string;
};
