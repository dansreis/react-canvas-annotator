import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Menu from "../Menu";

describe("Menu component", () => {
  it("Menu should render correctly", () => {
    render(<Menu items={[]} />);
    const menu = screen.getByRole("menu");
    expect(menu).toBeInTheDocument();
  });
});
