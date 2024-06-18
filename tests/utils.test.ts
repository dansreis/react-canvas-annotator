import { describe, expect, test } from "vitest";
import { isCoordInsideCoords } from "../src/fabric/utils";

const vertices1 = {
  tl: { x: 40, y: 40 },
  tr: { x: 80, y: 40 },
  bl: { x: 40, y: 80 },
  br: { x: 80, y: 80 },
};

const vertices2 = {
  tl: {
    x: 598.2890624998763,
    y: 92.49999999987634,
  },
  tr: {
    x: 611.2890625001237,
    y: 92.49999999987634,
  },
  bl: {
    x: 598.2890624998763,
    y: 105.50000000012366,
  },
  br: {
    x: 611.2890625001237,
    y: 105.50000000012366,
  },
};

describe("Point inside Coords", () => {
  test("Outside coords", () => {
    expect(isCoordInsideCoords({ x: 61, y: 25.5 }, vertices1)).toBeFalsy();
    expect(isCoordInsideCoords({ x: 94, y: 58.5 }, vertices1)).toBeFalsy();
    expect(isCoordInsideCoords({ x: 60, y: 84.5 }, vertices1)).toBeFalsy();
    expect(isCoordInsideCoords({ x: 31, y: 56.5 }, vertices1)).toBeFalsy();
  });

  test("Inside coords", () => {
    expect(isCoordInsideCoords({ x: 49, y: 46.5 }, vertices1)).toBeTruthy();
    expect(isCoordInsideCoords({ x: 61, y: 56.5 }, vertices1)).toBeTruthy();
    expect(
      isCoordInsideCoords({ x: 607.7890625, y: 98 }, vertices2),
    ).toBeTruthy();
  });
});
