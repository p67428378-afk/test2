import React, { useState } from "react";
import {
  Droplet,
  Calendar,
  MapPin,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function WateringAlertCard({ plant, onWaterSuccess }) {
  const [isWatering, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const isOverdue =
    plant.status === "overdue" ||
    (plant.next_due_date && new Date(plant.next_due_date) < new Date());

  const handleWater = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    setIsSubmitting(true);
    try {
      await onWaterSuccess(plant.id);
      setSuccessMsg(`Watered ${plant.nickname}!`);
    } catch (err) {
      setErrorMsg(
        err.response?.data?.detail || "Failed to log watering event.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      className={`p-4 rounded-xl border transition-all ${isOverdue ? "bg-red-50/50 border-red-200" : "bg-amber-50/50 border-amber-200"}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 overflow-hidden flex items-center justify-center text-lg">
            {plant.photo_url ? (
              <img
                src={plant.photo_url}
                alt={plant.nickname}
                className="w-full h-full object-cover"
              />
            ) : (
              "🪴"
            )}
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-sm">
              {plant.nickname}
            </h4>
            <p className="text-xs text-gray-500 italic">
              {plant.species?.common_name || plant.species_name || "Houseplant"}
            </p>
          </div>
        </div>
        <span
          className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${isOverdue ? "bg-red-100 text-red-700 border-red-200" : "bg-amber-100 text-amber-800 border-amber-200"}`}
        >
          {isOverdue ? "Overdue" : "Due Today"}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600">
        <div className="flex items-center space-x-1">
          <MapPin className="w-3.5 h-3.5 text-gray-400" />
          <span>{plant.location || "Indoor"}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Calendar className="w-3.5 h-3.5 text-gray-400" />
          <span>Due: {formatDate(plant.next_due_date)}</span>
        </div>
      </div>

      {errorMsg && (
        <div
          role="alert"
          className="mt-2 text-xs text-red-600 flex items-center space-x-1 bg-white p-1.5 rounded border border-red-200"
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="mt-2 text-xs text-green-700 flex items-center space-x-1 bg-white p-1.5 rounded border border-green-200">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="mt-4 flex justify-end">
        <button
          onClick={handleWater}
          disabled={isWatering}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-colors ${
            isOverdue
              ? "bg-red-600 hover:bg-red-700"
              : "bg-amber-600 hover:bg-amber-700"
          } disabled:opacity-50`}
        >
          <Droplet className="w-3.5 h-3.5 fill-current" />
          <span>{isWatering ? "Logging..." : "Water Now"}</span>
        </button>
      </div>
    </div>
  );
}
