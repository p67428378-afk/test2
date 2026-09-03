// @vitest-environment jsdom
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AddCategoryModal from "./AddCategoryModal";

describe("AddCategoryModal Component", () => {
  it("renders modal form when open", () => {
    render(
      <AddCategoryModal
        isOpen={true}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
        existingCategories={[]}
      />,
    );

    expect(screen.getByText("Add New Vehicle Category")).toBeInTheDocument();
    expect(screen.getByLabelText(/Category Name/i)).toBeInTheDocument();
  });

  it("submits category name on form submission", async () => {
    const handleSubmit = vi.fn().mockResolvedValue({ id: "1", name: "Truck" });
    const handleClose = vi.fn();

    render(
      <AddCategoryModal
        isOpen={true}
        onClose={handleClose}
        onSubmit={handleSubmit}
        existingCategories={[]}
      />,
    );

    const input = screen.getByLabelText(/Category Name/i);
    fireEvent.change(input, { target: { value: "Truck" } });

    const submitBtn = screen.getByRole("button", { name: /Create Category/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith("Truck");
      expect(handleClose).toHaveBeenCalled();
    });
  });
});
