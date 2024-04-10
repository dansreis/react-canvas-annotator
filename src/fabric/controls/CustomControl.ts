import { fabric } from "fabric";

/**
 * Custom FabricJS Control class with extra pointIndex
 */
class CustomControl extends fabric.Control {
  // Add an extra field pointIndex
  pointIndex: number;

  // Override the constructor to include the new field
  constructor(options: Partial<fabric.Control>, pointIndex: number) {
    // Call the constructor of the base class
    super(options);

    // Initialize the new field
    this.pointIndex = pointIndex;
  }
}

export default CustomControl;
