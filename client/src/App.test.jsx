// @vitest-environment jsdom
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";

// Mock API services
vi.mock("./services/api.js", () => ({
  authService: {
    login: vi.fn().mockResolvedValue({ access_token: "fake-token" }),
    register: vi.fn().mockResolvedValue({ id: "new-user-id" }),
    getMe: vi.fn().mockResolvedValue({
      id: "user-id",
      email: "test@example.com",
      full_name: "Test User",
    }),
    logout: vi.fn(),
  },
  resumeService: {
    getTemplates: vi.fn().mockResolvedValue([]),
    exportPdf: vi.fn().mockResolvedValue(new Blob()),
  },
}));

describe("App Routing and Authentication", () => {
  it("renders login page by default for unauthenticated users", async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText(/Sign In to Quick CV/i)).toBeInTheDocument();
    });
  });

  it("redirects to builder page after successful login", async () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "password" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Sign In/i }));

    await waitFor(() => {
      expect(screen.getByText(/Form Editor/i)).toBeInTheDocument();
    });
  });

  it("shows registration form when 'Create Account' is clicked", async () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /Create Account/i }));
    await waitFor(() => {
      expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    });
  });
});
