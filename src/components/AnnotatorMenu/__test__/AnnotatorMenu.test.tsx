import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import AnnotatorMenu from "../AnnotatorMenu";

describe("AnnotatorMenu component", () => {
  it("AnnotatorMenu should render correctly", () => {
    render(<AnnotatorMenu />);
    const annotatorMenu = screen.getByRole("annotatorMenu");
    expect(annotatorMenu).toBeInTheDocument();
  });
});
