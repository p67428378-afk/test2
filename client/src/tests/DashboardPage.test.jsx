import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import DashboardPage from "../pages/DashboardPage";

// Mock Recharts completely to avoid jsdom rendering issues
vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  LineChart: ({ children }) => <div>{children}</div>,
  Line: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
}));

const mockWeatherData = {
  current: {
    temp: 20,
    humidity: 65,
    wind_speed: 5.5,
    pressure: 1012,
    description: "Partly Cloudy",
    icon: "03d",
  },
  daily_forecasts: [
    {
      date: "2026-08-25",
      day_of_week: "Tuesday",
      temp_max: 22,
      temp_min: 15,
      description: "Partly Cloudy",
      icon: "03d",
    },
  ],
  hourly_forecasts: [
    {
      time: "12:00",
      date: "2026-08-25",
      temp: 20,
      description: "Partly Cloudy",
      icon: "03d",
    },
  ],
};

// Mock the API service directly with implementation
vi.mock("../services/api", () => ({
  getWeatherForecast: vi.fn().mockImplementation(() =>
    Promise.resolve({
      current: {
        temp: 20,
        humidity: 65,
        wind_speed: 5.5,
        pressure: 1012,
        description: "Partly Cloudy",
        icon: "03d",
      },
      daily_forecasts: [
        {
          date: "2026-08-25",
          day_of_week: "Tuesday",
          temp_max: 22,
          temp_min: 15,
          description: "Partly Cloudy",
          icon: "03d",
        },
      ],
      hourly_forecasts: [
        {
          time: "12:00",
          date: "2026-08-25",
          temp: 20,
          description: "Partly Cloudy",
          icon: "03d",
        },
      ],
    }),
  ),
  searchCities: vi.fn(),
}));

describe("DashboardPage Smoke Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the dashboard with default city weather", async () => {
    render(<DashboardPage />);

    // Check that Navbar brand is rendered
    expect(screen.getByText("WeatherCast")).toBeInTheDocument();

    // Wait for weather data to load and render (using partial match)
    await waitFor(() => {
      expect(screen.getByText(/Seattle/)).toBeInTheDocument();
    });

    // Check current weather details (using getAllByText for elements that appear multiple times)
    expect(screen.getAllByText("Partly Cloudy")[0]).toBeInTheDocument();
    expect(screen.getByText("65%")).toBeInTheDocument();
  });

  it("toggles temperature units", async () => {
    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText(/Seattle/)).toBeInTheDocument();
    });

    const toggleButton = screen.getByRole("button", {
      name: /Toggle temperature units/i,
    });
    expect(toggleButton).toHaveTextContent("Switch to °F");

    // Click to toggle to imperial
    fireEvent.click(toggleButton);

    // Check that unit toggle button text updated
    expect(toggleButton).toHaveTextContent("Switch to °C");
  });
});
