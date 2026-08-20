import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import JoinQueuePage from "./JoinQueuePage";
import { describe, it, expect, vi } from "vitest";
import * as api from "../services/api";

vi.mock("../services/api");

describe("JoinQueuePage Component", () => {
  it("renders page header and stats", async () => {
    vi.spyOn(api, "getQueueTickets").mockResolvedValueOnce({
      items: [],
      total: 0,
    });

    render(
      <MemoryRouter>
        <JoinQueuePage />
      </MemoryRouter>,
    );

    expect(
      screen.getByText(/Welcome to Customer Service Center/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Active Waiting Line/i)).toBeInTheDocument();
  });
});
