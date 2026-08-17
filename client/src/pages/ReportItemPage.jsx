import React, { useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import ReportForm from "../components/lost-found/ReportForm";
import { createItem } from "../services/api";

export default function ReportItemPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (itemData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await createItem(itemData);
      setSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to submit report. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout title="Report Item">
      <div className="py-4">
        <ReportForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          error={error}
          success={success}
        />
      </div>
    </AppLayout>
  );
}
