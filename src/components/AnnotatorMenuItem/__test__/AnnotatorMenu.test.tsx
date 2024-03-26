import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import AnnotatorMenuItem from "../AnnotatorMenuItem";

describe("AnnotatorMenuItem component", () => {
  it("AnnotatorMenuItem should render correctly", () => {
    render(<AnnotatorMenuItem />);
    const annotatorMenuItem = screen.getByRole("annotatorMenuItem");
    expect(annotatorMenuItem).toBeInTheDocument();
  });
});
