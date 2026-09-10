// @vitest-environment jsdom
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App.jsx";

// Mock API services
vi.mock("./services/api.js", () => ({
  authService: {
    login: vi.fn().mockResolvedValue({
      access_token: "fake-jwt-token",
      user: {
        id: "user-123",
        email: "test@example.com",
        full_name: "Test User",
      },
    }),
    register: vi.fn().mockResolvedValue({
      id: "user-123",
      email: "newuser@example.com",
      full_name: "New User",
    }),
    getMe: vi.fn().mockResolvedValue({
      id: "user-123",
      email: "test@example.com",
      full_name: "Test User",
    }),
    logout: vi.fn(),
  },
  resumeService: {
    getTemplates: vi.fn().mockResolvedValue([
      { id: "classic", name: "Classic" },
      { id: "modern", name: "Modern" },
    ]),
    createResume: vi.fn().mockResolvedValue({ id: "res-123" }),
    exportPdf: vi.fn().mockResolvedValue(new Blob()),
  },
}));

describe("App Routing and Authentication Flow", () => {
  it("renders login page by default for unauthenticated users with navbar and login card", async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText(/Quick CV Authentication/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Sign In to Quick CV/i }),
      ).toBeInTheDocument();
      expect(screen.getAllByText(/Quick CV/i).length).toBeGreaterThan(0);
    });
  });

  it("shows registration form when 'Create Account' tab is clicked", async () => {
    render(<App />);
    const createAccountTab = screen.getByRole("tab", {
      name: /Create Account/i,
    });
    fireEvent.click(createAccountTab);

    await waitFor(() => {
      expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Create Account/i }),
      ).toBeInTheDocument();
    });
  });

  it("redirects to builder page after successful login", async () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "testpassword" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: /Sign In to Quick CV/i }),
    );

    await waitFor(() => {
      expect(
        screen.getByText(/Interactive Resume Builder/i),
      ).toBeInTheDocument();
      expect(screen.getByText(/Log Out/i)).toBeInTheDocument();
    });
  });
});
