import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import DeliveryTable from "./DeliveryTable.jsx";
import * as api from "../services/api";

vi.mock("../services/api", () => ({
  collectDelivery: vi.fn(),
}));

describe("DeliveryTable Component", () => {
  const sampleDeliveries = [
    {
      delivery_id: "d-1",
      unit_number: "Unit 4B",
      courier_name: "FedEx",
      tracking_number: "FX12345",
      package_description: "Box",
      logged_at: "2026-06-01T10:00:00Z",
      status: "PENDING_PICKUP",
      is_overdue: false,
    },
    {
      delivery_id: "d-2",
      unit_number: "Unit 2A",
      courier_name: "UPS",
      tracking_number: "UPS999",
      package_description: "Envelope",
      logged_at: "2026-05-20T10:00:00Z",
      status: "PENDING_PICKUP",
      is_overdue: true,
    },
  ];

  it("renders package rows and overdue badge", () => {
    render(<DeliveryTable deliveries={sampleDeliveries} />);
    expect(screen.getByText("Unit 4B")).toBeInTheDocument();
    expect(screen.getByText("Unit 2A")).toBeInTheDocument();
    expect(screen.getByText("OVERDUE (>48h)")).toBeInTheDocument();
  });

  it("handles mark collected action", async () => {
    vi.spyOn(api, "collectDelivery").mockResolvedValueOnce({
      status: "COLLECTED",
    });

    const onRefresh = vi.fn();
    render(
      <DeliveryTable deliveries={sampleDeliveries} onRefresh={onRefresh} />,
    );

    const collectBtns = screen.getAllByRole("button", {
      name: /Mark Collected/i,
    });
    fireEvent.click(collectBtns[0]);

    await waitFor(() => {
      expect(api.collectDelivery).toHaveBeenCalledWith(
        "d-1",
        expect.any(String),
      );
      expect(onRefresh).toHaveBeenCalled();
    });
  });
});
