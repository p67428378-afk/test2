import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import WriteReviewModal from "../reviews/WriteReviewModal";

describe("WriteReviewModal Component", () => {
  it("does not render when isOpen is false", () => {
    const { container } = render(
      <WriteReviewModal
        boxId="box-1"
        boxTitle="Gourmet Box"
        isOpen={false}
        onClose={() => {}}
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders review form when isOpen is true", () => {
    render(
      <WriteReviewModal
        boxId="box-1"
        boxTitle="Gourmet Box"
        isOpen={true}
        onClose={() => {}}
      />,
    );

    expect(screen.getByText("Write Subscriber Review")).toBeInTheDocument();
    expect(screen.getByText("Gourmet Box")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Describe your experience/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Post Review/i }),
    ).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const handleClose = vi.fn();
    render(
      <WriteReviewModal
        boxId="box-1"
        boxTitle="Gourmet Box"
        isOpen={true}
        onClose={handleClose}
      />,
    );

    const closeButton = screen.getByRole("button", { name: /Close modal/i });
    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
