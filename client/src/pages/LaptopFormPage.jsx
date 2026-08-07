import React, { useState } from "react";
import { productService } from "../services/api";
import LaptopForm from "../components/catalog/LaptopForm";

export default function LaptopFormPage({
  laptopToEdit,
  onSaveSuccess,
  onCancel,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setError("");
    try {
      if (laptopToEdit) {
        await productService.updateProduct(laptopToEdit.id, formData);
      } else {
        await productService.createProduct(formData);
      }
      onSaveSuccess();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to save laptop listing. Please check your inputs.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-xl">
      <div>
        <h2 className="font-headline-lg text-headline-lg text-on-surface">
          {laptopToEdit ? "Edit Laptop Listing" : "Add New Laptop"}
        </h2>
        <p className="text-body-md text-on-surface-variant mt-1">
          {laptopToEdit
            ? "Update the technical specifications and stock levels for this laptop."
            : "Create a new laptop listing in your store catalog."}
        </p>
      </div>

      {error && (
        <div
          className="bg-error-container text-on-error-container p-4 rounded-lg text-sm font-medium"
          role="alert"
        >
          {error}
        </div>
      )}

      <LaptopForm
        initialData={laptopToEdit}
        onSubmit={handleSubmit}
        onCancel={onCancel}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
