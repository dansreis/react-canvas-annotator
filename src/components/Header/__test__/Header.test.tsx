import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Header from "../Header";

describe("Header component", () => {
  it("Header should render correctly", () => {
    render(<Header />);
    const header = screen.getByRole("header");
    expect(header).toBeInTheDocument();
  });
});
