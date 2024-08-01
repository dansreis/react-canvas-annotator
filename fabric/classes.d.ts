import { fabric } from 'fabric';

interface CustomCornerObjectOptions extends fabric.IGroupOptions {
    number?: number;
    color?: string;
    size?: number;
}
export declare class CustomCornerObject extends fabric.Group {
    constructor(options?: CustomCornerObjectOptions);
}
export {};
