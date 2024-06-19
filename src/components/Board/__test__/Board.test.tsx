import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Board from "../Board";

describe("Board component", () => {
  it("Board should render correctly", () => {
    render(
      <Board items={[]} image={{ name: "test", src: "holder-min.jpg" }} />,
    );
    const board = screen.getByTestId("react-annotator-canvas");
    expect(board).toBeInTheDocument();
  });
});
