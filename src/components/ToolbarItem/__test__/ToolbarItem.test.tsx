import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ToolbarItem from "../ToolbarItem";

describe("ToolbarItem component", () => {
  it("ToolbarItem should render correctly", () => {
    render(<ToolbarItem iconName={"circle"} />);
    const item = screen.getByRole("toolbar-item");
    expect(item).toBeInTheDocument();
  });
});
