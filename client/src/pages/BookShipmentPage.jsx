import React from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import ShipmentForm from "../components/booking/ShipmentForm";
import { shipmentService } from "../services/api";

export default function BookShipmentPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");

  const handleBookShipment = async (payload) => {
    setIsLoading(true);
    setError("");
    setSuccess("");
    try {
      const response = await shipmentService.createShipment(payload);
      setSuccess(
        `Shipment booked successfully! Tracking ID: ${response.tracking_id}`,
      );
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail ||
          "Failed to book shipment. Please check your inputs.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout title="Book Shipment">
      <div className="space-y-6 max-w-4xl">
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-sm font-medium">
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-sm font-medium">
            {success}
          </div>
        )}

        <ShipmentForm onSubmit={handleBookShipment} isLoading={isLoading} />
      </div>
    </AppLayout>
  );
}
