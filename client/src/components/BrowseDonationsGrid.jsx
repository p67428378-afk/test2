import React, { useState } from "react";
import { donationService } from "../services/api";
import Badge from "./Badge";
import Button from "./Button";

export default function BrowseDonationsGrid({ donations, onRequested }) {
  const [requestingId, setRequestingId] = useState(null);
  const [error, setError] = useState("");

  const handleRequest = async (donationId) => {
    setRequestingId(donationId);
    setError("");
    try {
      await donationService.requestDonation(donationId);
      if (onRequested) onRequested();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to request donation. Please try again.",
      );
    } finally {
      setRequestingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div
          className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-sm"
          role="alert"
        >
          {error}
        </div>
      )}

      {donations.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
          <p className="text-slate-500">No available donations found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {donations.map((donation) => (
            <div
              key={donation.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold text-slate-800 text-lg">
                    {donation.description}
                  </h4>
                  <Badge status={donation.status} />
                </div>

                <div className="space-y-2 text-sm text-slate-600 mb-6">
                  <p>
                    <span className="font-semibold">Restaurant:</span>{" "}
                    {donation.restaurant_name}
                  </p>
                  <p>
                    <span className="font-semibold">Quantity:</span>{" "}
                    {donation.quantity}
                  </p>
                  {donation.food_type && (
                    <p>
                      <span className="font-semibold">Type:</span>{" "}
                      {donation.food_type}
                    </p>
                  )}
                  <p>
                    <span className="font-semibold">Best Before:</span>{" "}
                    {new Date(donation.best_before_dt).toLocaleString()}
                  </p>
                  {donation.pickup_location && (
                    <p>
                      <span className="font-semibold">Pickup:</span>{" "}
                      {donation.pickup_location}
                    </p>
                  )}
                </div>
              </div>

              {donation.status === "available" && (
                <Button
                  onClick={() => handleRequest(donation.id)}
                  disabled={requestingId === donation.id}
                  className="w-full"
                >
                  {requestingId === donation.id
                    ? "Requesting..."
                    : "Request Donation"}
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
