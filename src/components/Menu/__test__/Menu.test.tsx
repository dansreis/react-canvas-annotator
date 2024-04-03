import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Menu from "../Menu";
import "@testing-library/jest-dom"; // This needs to be here for now.

describe("Menu component", () => {
  it("Menu should render correctly", () => {
    render(<Menu items={[]} />);
    const menu = screen.getByRole("menu");
    expect(menu).toBeInTheDocument();
  });
});
