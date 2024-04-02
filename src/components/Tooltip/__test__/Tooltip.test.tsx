import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Tooltip from "../Tooltip";
import "@testing-library/jest-dom"; // This needs to be here for now.

describe("Tooltip component", () => {
  it("Tooltip should render correctly", () => {
    render(<Tooltip />);
    const tooltip = screen.getByRole("tooltip");
    expect(tooltip).toBeInTheDocument();
  });
});
