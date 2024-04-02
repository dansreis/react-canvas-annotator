import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Toolbar from "../Toolbar";
import "@testing-library/jest-dom"; // This needs to be here for now.

describe("Toolbar component", () => {
  it("Toolbar should render correctly", () => {
    render(<Toolbar items={[]} />);
    const toolbar = screen.getByRole("toolbar");
    expect(toolbar).toBeInTheDocument();
  });
});
