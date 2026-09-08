import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ExportItineraryModal from "../components/ExportItineraryModal";
import * as api from "../services/api";

describe("ExportItineraryModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not render when isOpen is false", () => {
    render(
      <ExportItineraryModal
        isOpen={false}
        onClose={vi.fn()}
        recommendationId="rec-123"
      />,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders modal elements when isOpen is true", () => {
    render(
      <ExportItineraryModal
        isOpen={true}
        onClose={vi.fn()}
        recommendationId="rec-123"
        destination="Tokyo"
      />,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/Export & Share Itinerary/i)).toBeInTheDocument();
    expect(screen.getByText(/JSON File/i)).toBeInTheDocument();
    expect(screen.getByText(/PDF Doc/i)).toBeInTheDocument();
    expect(screen.getByText(/Share Link/i)).toBeInTheDocument();
  });

  it("calls exportItinerary API and handles share link", async () => {
    vi.spyOn(api, "exportItinerary").mockResolvedValueOnce({
      export_id: "exp-1",
      recommendation_id: "rec-123",
      file_name: "Tokyo_Trip_ShareLink.txt",
      mime_type: "text/plain",
      content_base64:
        "aHR0cDovL2xvY2FsaG9zdDo1MTczL3Jlc3VsdHM/c2hhcmU9cmVjLTEyMw==",
      share_url: "http://localhost:5173/results?share=rec-123",
    });

    render(
      <ExportItineraryModal
        isOpen={true}
        onClose={vi.fn()}
        recommendationId="rec-123"
        destination="Tokyo"
        defaultFormat="link"
      />,
    );

    const submitBtn = screen.getByRole("button", {
      name: /Generate Share Link/i,
    });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(api.exportItinerary).toHaveBeenCalledWith({
        recommendation_id: "rec-123",
        export_format: "link",
        include_cost_summary: true,
      });
      expect(
        screen.getByDisplayValue("http://localhost:5173/results?share=rec-123"),
      ).toBeInTheDocument();
    });
  });

  it("handles close button click", () => {
    const handleClose = vi.fn();
    render(
      <ExportItineraryModal
        isOpen={true}
        onClose={handleClose}
        recommendationId="rec-123"
      />,
    );

    const closeBtn = screen.getByRole("button", {
      name: /Close export dialog/i,
    });
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
