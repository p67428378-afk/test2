import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "./App";

describe("App Component", () => {
  it("renders top navbar and main email classification studio", () => {
    render(<App />);

    expect(screen.getByText("EmailClassify")).toBeInTheDocument();
    expect(screen.getByText("Email Classification Studio")).toBeInTheDocument();
    expect(screen.getByText("Recent Stream")).toBeInTheDocument();
  });
});
