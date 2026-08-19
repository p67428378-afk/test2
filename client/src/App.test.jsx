import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
import StatCard from "./components/StatCard";
import { ClipboardList } from "lucide-react";

describe("EB Maintenance Tracker Frontend Suite", () => {
  test("renders Navbar brand logo", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByText("EB Tracker")).toBeInTheDocument();
  });

  test("renders StatCard with title and value", () => {
    render(
      <StatCard
        title="Total Tasks"
        value="12"
        icon={ClipboardList}
        subtext="Active tasks"
      />,
    );
    expect(screen.getByText("Total Tasks")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("Active tasks")).toBeInTheDocument();
  });
});
