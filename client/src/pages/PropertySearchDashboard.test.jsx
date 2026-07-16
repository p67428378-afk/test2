import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PropertySearchDashboard from "./PropertySearchDashboard";
import * as api from "../services/api";

// Mock the API services
vi.mock("../services/api", () => ({
  getProperties: vi.fn(),
  getPropertyDetails: vi.fn(),
  submitContactForm: vi.fn(),
}));

const mockProperties = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    title: "Modern Suburban Villa",
    location: "Austin, TX",
    price: 450000,
    bedrooms: 3,
    bathrooms: 2,
    description: "Beautiful modern home with open floor plan.",
    image_urls: ["https://example.com/image1.jpg"],
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    title: "Downtown Luxury Loft",
    location: "New York, NY",
    price: 850000,
    bedrooms: 2,
    bathrooms: 2,
    description: "Stunning loft in the heart of the city.",
    image_urls: [],
  },
];

describe("PropertySearchDashboard Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.getProperties.mockResolvedValue(mockProperties);
    api.getPropertyDetails.mockImplementation((id) => {
      const prop = mockProperties.find((p) => p.id === id);
      return Promise.resolve(prop || mockProperties[0]);
    });
  });

  it("renders the dashboard with sidebar, header, and property list", async () => {
    render(<PropertySearchDashboard />);

    // Verify Sidebar elements
    expect(screen.getByText("HavenBroker")).toBeInTheDocument();
    expect(screen.getByText("Broker Portal")).toBeInTheDocument();

    // Wait for properties to load and render
    await waitFor(() => {
      expect(screen.getByText("Modern Suburban Villa")).toBeInTheDocument();
      expect(screen.getByText("Downtown Luxury Loft")).toBeInTheDocument();
    });

    // Verify price formatting
    expect(screen.getByText("$450,000")).toBeInTheDocument();
    expect(screen.getByText("$850,000")).toBeInTheDocument();
  });

  it("allows searching properties by location", async () => {
    render(<PropertySearchDashboard />);

    await waitFor(() => {
      expect(screen.getByText("Modern Suburban Villa")).toBeInTheDocument();
    });

    const searchInputs = screen.getAllByPlaceholderByRole
      ? []
      : document.querySelectorAll(
          'input[placeholder="City, Neighborhood, or Zip"]',
        );
    const filterInput =
      searchInputs[0] ||
      screen.getByPlaceholderText("City, Neighborhood, or Zip");

    fireEvent.change(filterInput, { target: { value: "Austin" } });
    expect(filterInput.value).toBe("Austin");

    const searchButtons = screen.getAllByText("Search");
    fireEvent.click(searchButtons[searchButtons.length - 1]);

    expect(api.getProperties).toHaveBeenCalledWith("Austin");
  });

  it("displays property details when a property card is clicked", async () => {
    render(<PropertySearchDashboard />);

    await waitFor(() => {
      expect(screen.getByText("Modern Suburban Villa")).toBeInTheDocument();
    });

    const secondCard = screen.getByText("Downtown Luxury Loft");
    fireEvent.click(secondCard);

    await waitFor(() => {
      expect(api.getPropertyDetails).toHaveBeenCalledWith(
        "22222222-2222-2222-2222-222222222222",
      );
    });
  });

  it("submits the contact form successfully", async () => {
    api.submitContactForm.mockResolvedValue({
      id: "99999999-9999-9999-9999-999999999999",
      property_id: "11111111-1111-1111-1111-111111111111",
      user_name: "Test User",
      user_email: "test@example.com",
      message: "Hello broker!",
      created_at: new Date().toISOString(),
    });

    render(<PropertySearchDashboard />);

    await waitFor(() => {
      expect(screen.getByText("Modern Suburban Villa")).toBeInTheDocument();
    });

    // Fill out contact form
    const nameInput = screen.getByLabelText("Full Name");
    const emailInput = screen.getByLabelText("Email");
    const messageInput = screen.getByLabelText("Message");

    fireEvent.change(nameInput, { target: { value: "Test User" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(messageInput, { target: { value: "Hello broker!" } });

    const submitButton = screen.getByText("Submit Inquiry");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(api.submitContactForm).toHaveBeenCalledWith({
        property_id: "11111111-1111-1111-1111-111111111111",
        user_name: "Test User",
        user_email: "test@example.com",
        message: "Hello broker!",
      });
      expect(
        screen.getByText("Your inquiry has been submitted successfully!"),
      ).toBeInTheDocument();
    });
  });
});
