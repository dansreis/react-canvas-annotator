import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Toolbar from "../Toolbar";

describe("Toolbar component", () => {
  it("Toolbar should render correctly", () => {
    render(<Toolbar />);
    const toolbar = screen.getByRole("toolbar");
    expect(toolbar).toBeInTheDocument();
  });
});
