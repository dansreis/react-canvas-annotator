import { describe, expect, test } from "vitest";
import { isCoordInsideCoords } from "../src/fabric/utils";

const vertices = [
  { x: 40, y: 40 },
  { x: 80, y: 40 },
  { x: 80, y: 80 },
  { x: 40, y: 80 },
];

describe("Point inside Coords", () => {
  test("Outside coords", () => {
    expect(isCoordInsideCoords({ x: 61, y: 25.5 }, vertices)).toBeFalsy();
    expect(isCoordInsideCoords({ x: 94, y: 58.5 }, vertices)).toBeFalsy();
    expect(isCoordInsideCoords({ x: 60, y: 84.5 }, vertices)).toBeFalsy();
    expect(isCoordInsideCoords({ x: 31, y: 56.5 }, vertices)).toBeFalsy();
  });

  test("Inside coords", () => {
    expect(isCoordInsideCoords({ x: 49, y: 46.5 }, vertices)).toBeTruthy();
    expect(isCoordInsideCoords({ x: 61, y: 56.5 }, vertices)).toBeTruthy();
  });
});
