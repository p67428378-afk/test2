import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import App from "./App.jsx";
import CatalogGrid from "./components/CatalogGrid.jsx";
import FrameSelector from "./components/FrameSelector.jsx";
import DynamicPriceCalculator from "./components/DynamicPriceCalculator.jsx";
import TrackingStepper from "./components/TrackingStepper.jsx";

// Mock API calls
vi.mock("./services/api.js", () => {
  return {
    authService: {
      getCurrentUser: vi
        .fn()
        .mockResolvedValue({
          id: "user-1",
          email: "test@example.com",
          role: "member",
        }),
      login: vi.fn().mockResolvedValue({ access_token: "mock-token" }),
      logout: vi.fn(),
    },
    paintingService: {
      getPaintings: vi.fn().mockResolvedValue({
        items: [
          {
            id: "p1",
            title: "Abstract Blue Horizon",
            artist_name: "Elena Rostova",
            medium: "Oil on Canvas",
            style: "Abstract",
            base_price: "250.00",
            is_configurable: true,
            is_original_one_of_one: false,
            stock_quantity: 5,
            image_url: "https://example.com/image.jpg",
            status: "ACTIVE",
          },
          {
            id: "p2",
            title: "Golden Autumn Forest",
            artist_name: "Marcus Vance",
            medium: "Acrylic on Canvas",
            style: "Landscape",
            base_price: "450.00",
            is_configurable: false,
            is_original_one_of_one: true,
            stock_quantity: 1,
            image_url: "https://example.com/image2.jpg",
            status: "ACTIVE",
          },
        ],
        total: 2,
        skip: 0,
        limit: 20,
      }),
      getFrameOptions: vi
        .fn()
        .mockResolvedValue([
          {
            id: "f1",
            name: "Natural Wood",
            material: "Solid Oak",
            price_multiplier: "1.10",
            flat_fee: "25.00",
          },
        ]),
    },
    configuratorService: {
      getFrameOptions: vi
        .fn()
        .mockResolvedValue([
          {
            id: "f1",
            name: "Natural Wood",
            material: "Solid Oak",
            price_multiplier: "1.10",
            flat_fee: "25.00",
          },
        ]),
      calculatePrice: vi.fn().mockResolvedValue({
        painting_id: "p1",
        base_price: "250.00",
        custom_width_inches: 36,
        custom_height_inches: 48,
        area_sq_inches: 1728,
        dimension_multiplier: "1.2",
        frame_fee: "25.00",
        calculated_unit_price: "325.00",
        is_valid: true,
        validation_error: null,
      }),
    },
    cartService: {
      getCart: vi.fn().mockResolvedValue({
        cart_id: "CART-123",
        items: [],
        subtotal: "0.00",
        total_items: 0,
      }),
      addItem: vi.fn().mockResolvedValue({
        cart_id: "CART-123",
        items: [],
        subtotal: "250.00",
        total_items: 1,
      }),
    },
    orderService: {
      getOrders: vi.fn().mockResolvedValue([]),
      getOrderDetail: vi.fn().mockResolvedValue({
        id: "ord-1",
        order_number: "ORD-123456",
        customer_email: "test@example.com",
        subtotal: "340.00",
        shipping_fee: "25.00",
        tax_amount: "27.20",
        total_amount: "392.20",
        status: "Order Placed",
        created_at: new Date().toISOString(),
      }),
    },
    adminPaintingService: {
      getAdminOrders: vi.fn().mockResolvedValue([]),
    },
  };
});

describe("E-Commerce Wall Painting Platform Unit Tests", () => {
  it("renders main App brand header and navbar", async () => {
    render(<App />);
    expect(screen.getByText(/Artesan Gallery/i)).toBeInTheDocument();
  });

  it("renders CatalogGrid with painting cards and action buttons", () => {
    const paintings = [
      {
        id: "p1",
        title: "Sunset Reflection",
        artist_name: "Artist A",
        medium: "Oil",
        style: "Modern",
        base_price: "300.00",
        is_configurable: true,
        is_original_one_of_one: false,
        stock_quantity: 2,
      },
    ];

    render(
      <CatalogGrid
        paintings={paintings}
        onSelectPainting={() => {}}
        onConfigure={() => {}}
        onAddToCart={() => {}}
      />,
    );

    expect(screen.getByText("Sunset Reflection")).toBeInTheDocument();
    expect(screen.getByText("$300.00")).toBeInTheDocument();
  });

  it("renders FrameSelector with options", () => {
    const options = [
      {
        id: "f1",
        name: "Matte Black",
        material: "Metal",
        flat_fee: "30.00",
        price_multiplier: "1.0",
      },
    ];

    render(
      <FrameSelector
        frameOptions={options}
        selectedFrameId="f1"
        onSelectFrame={() => {}}
      />,
    );

    expect(screen.getByText("Matte Black")).toBeInTheDocument();
    expect(screen.getByText("+$30.00")).toBeInTheDocument();
  });

  it("renders DynamicPriceCalculator breakdown correctly", () => {
    render(
      <DynamicPriceCalculator
        basePrice={200}
        customWidth={24}
        customHeight={36}
        areaSqInches={864}
        frameFee={20}
        calculatedUnitPrice={260}
        isValid={true}
      />,
    );

    expect(screen.getByText("$260.00")).toBeInTheDocument();
  });

  it("renders TrackingStepper with order status", () => {
    const order = {
      order_number: "ORD-99999",
      customer_email: "buyer@example.com",
      status: "In Production",
      shipping_address: { full_name: "John Doe", city: "NYC" },
      subtotal: "200.00",
      shipping_fee: "25.00",
      tax_amount: "16.00",
      total_amount: "241.00",
    };

    render(<TrackingStepper order={order} onCancelOrder={() => {}} />);

    expect(screen.getByText("Order ORD-99999")).toBeInTheDocument();
    expect(screen.getByText("In Production")).toBeInTheDocument();
  });
});
