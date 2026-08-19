import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import MembersTable from "./MembersTable";

describe("MembersTable Component", () => {
  const sampleUsers = [
    {
      id: "u1",
      full_name: "Alice Smith",
      email: "alice@example.com",
      role: "admin",
    },
  ];

  it("renders household member name and email correctly", () => {
    render(<MembersTable users={sampleUsers} tasks={[]} />);
    expect(screen.getByText("Alice Smith")).toBeInTheDocument();
    expect(screen.getByText("alice@example.com")).toBeInTheDocument();
    expect(screen.getByText("admin")).toBeInTheDocument();
  });
});
