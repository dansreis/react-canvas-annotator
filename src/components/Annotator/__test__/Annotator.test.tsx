import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Annotator from "../Annotator";
import "@testing-library/jest-dom"; // This needs to be here for now.

describe("Annotator component", () => {
  it("Annotator should render correctly", () => {
    render(<Annotator />);
    const annotator = screen.getByRole("annotator");
    expect(annotator).toBeInTheDocument();
  });
});
