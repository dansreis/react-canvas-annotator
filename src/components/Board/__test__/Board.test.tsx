import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Board from "../Board";
import "@testing-library/jest-dom"; // This needs to be here for now.

describe("Board component", () => {
  it("Board should render correctly", () => {
    render(<Board items={[]} image={{ name: "test", src: "test.png" }} />);
    const board = screen.getByRole("board");
    expect(board).toBeInTheDocument();
  });
});
