import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import MenuItem from "../MenuItem";

describe("MenuItem component", () => {
  it("MenuItem should render correctly", () => {
    render(<MenuItem iconName={"circle"} />);
    const Item = screen.getByRole("MenuItem");
    expect(Item).toBeInTheDocument();
  });
});
