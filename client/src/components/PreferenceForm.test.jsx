import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PreferenceForm from "./PreferenceForm";
import { api } from "../services/api";

vi.mock("../services/api", () => ({
  api: {
    getPreferences: vi.fn(),
    savePreferences: vi.fn(),
  },
}));

describe("PreferenceForm Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders form elements and loads existing preferences", async () => {
    api.getPreferences.mockResolvedValueOnce({
      id: "pref-1",
      user_id: "user-123",
      category_preferences: ["Electronics"],
      min_price: 10,
      max_price: 300,
      preferred_tags: ["smart"],
    });

    render(<PreferenceForm initialUserId="user-123" />);

    expect(
      screen.getByText("Personalize Recommendation Profile"),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/user identifier/i)).toHaveValue("user-123");

    await waitFor(() => {
      expect(api.getPreferences).toHaveBeenCalledWith("user-123");
    });
  });

  it("handles preference submission and saves successfully", async () => {
    api.getPreferences.mockResolvedValueOnce(null);
    api.savePreferences.mockResolvedValueOnce({
      id: "pref-1",
      user_id: "user-123",
      category_preferences: ["Electronics", "Audio"],
      min_price: 20,
      max_price: 500,
      preferred_tags: ["wireless"],
    });

    const onSaved = vi.fn();
    render(
      <PreferenceForm initialUserId="user-123" onPreferencesSaved={onSaved} />,
    );

    // Wait until fetching existing finishes so button becomes enabled
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /save & sync ai profile/i }),
      ).not.toBeDisabled();
    });

    const submitBtn = screen.getByRole("button", {
      name: /save & sync ai profile/i,
    });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(api.savePreferences).toHaveBeenCalled();
    });

    expect(
      await screen.findByText(/preference profile successfully saved/i),
    ).toBeInTheDocument();
    expect(onSaved).toHaveBeenCalled();
  });
});
