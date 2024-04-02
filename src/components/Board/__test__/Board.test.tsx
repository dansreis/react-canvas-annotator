import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Board from "../Board";
import "@testing-library/jest-dom"; // This needs to be here for now.

describe("Button component", () => {
  it("Button should render correctly", () => {
    render(<Board />);
    const board = screen.getByRole("board");
    expect(board).toBeInTheDocument();
  });
});
