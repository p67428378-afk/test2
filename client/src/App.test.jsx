import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import App from "./App";

describe("App Component", () => {
  it("renders navbar branding and top-level links", () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    );

    expect(screen.getByText(/ArchExcav/i)).toBeInTheDocument();
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Sites & GPS Map/i)).toBeInTheDocument();
    expect(screen.getByText(/Artifact Catalog/i)).toBeInTheDocument();
    expect(screen.getByText(/Lab Analysis/i)).toBeInTheDocument();
    expect(screen.getByText(/Publications/i)).toBeInTheDocument();
  });
});
