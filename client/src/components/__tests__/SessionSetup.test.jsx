import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import SessionSetup from "../SessionSetup.jsx";
import * as api from "../../services/api.js";

vi.mock("../../services/api.js", () => ({
  createSession: vi.fn(),
  addPlayer: vi.fn(),
  deletePlayer: vi.fn(),
}));

describe("SessionSetup", () => {
  it("renders Game Setup header and inputs", () => {
    render(
      <MemoryRouter>
        <SessionSetup />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Game Setup/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Enter player name/i),
    ).toBeInTheDocument();
  });

  it("allows adding a new player", async () => {
    vi.mocked(api.createSession).mockResolvedValue({
      id: "s-123",
      game_name: "Catan",
    });
    vi.mocked(api.addPlayer).mockResolvedValue({
      id: "p-1",
      session_id: "s-123",
      name: "Alice",
    });

    render(
      <MemoryRouter>
        <SessionSetup />
      </MemoryRouter>,
    );

    const input = screen.getByPlaceholderText(/Enter player name/i);
    const addButton = screen.getByRole("button", { name: /Add Player/i });

    fireEvent.change(input, { target: { value: "Alice" } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(api.createSession).toHaveBeenCalled();
      expect(api.addPlayer).toHaveBeenCalledWith("s-123", "Alice");
      expect(screen.getByText("Alice")).toBeInTheDocument();
    });
  });
});
