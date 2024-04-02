import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Header from "../Header";
import "@testing-library/jest-dom"; // This needs to be here for now.

describe("Header component", () => {
  it("Header should render correctly", () => {
    render(<Header />);
    const header = screen.getByRole("header");
    expect(header).toBeInTheDocument();
  });
});
