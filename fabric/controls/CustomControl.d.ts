import { fabric } from 'fabric';

/**
 * Custom FabricJS Control class with extra pointIndex
 */
declare class CustomControl extends fabric.Control {
    pointIndex: number;
    constructor(options: Partial<fabric.Control>, pointIndex: number);
}
export default CustomControl;
