import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout.jsx";
import PlotForm from "../components/plots/PlotForm.jsx";
import { plotService } from "../services/api";

export default function CreatePlotPage() {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      await plotService.createPlot(formData);
      navigate("/plots");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError(
          "Failed to create plot. Please check if a plot with this location already exists.",
        );
      }
    }
  };

  return (
    <AppLayout title="Create Plot">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-on-surface">
            Add New Burial Plot
          </h2>
          <button
            onClick={() => navigate("/plots")}
            className="text-xs font-semibold text-outline uppercase tracking-wider hover:text-on-surface transition-colors"
          >
            Back to List
          </button>
        </div>

        {error && (
          <div className="p-4 bg-error-container text-on-error-container rounded-lg text-sm font-medium">
            {error}
          </div>
        )}

        <PlotForm
          onSubmit={handleSubmit}
          onCancel={() => navigate("/plots")}
          submitLabel="Create Plot"
        />
      </div>
    </AppLayout>
  );
}
