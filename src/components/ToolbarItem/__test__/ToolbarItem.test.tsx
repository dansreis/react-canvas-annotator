import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ToolbarItem from "../ToolbarItem";

describe("MenuItem component", () => {
  it("MenuItem should render correctly", () => {
    render(<ToolbarItem iconName={"circle"} />);
    const Item = screen.getByRole("ToolbarItem");
    expect(Item).toBeInTheDocument();
  });
});
