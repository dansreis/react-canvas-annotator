import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Menu from "../Menu";

describe("Menu component", () => {
  it("Menu should render correctly", () => {
    render(<Menu />);
    const menu = screen.getByRole("Menu");
    expect(menu).toBeInTheDocument();
  });
});