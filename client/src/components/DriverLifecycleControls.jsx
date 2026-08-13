import React, { useState } from "react";
import { deliveriesApi } from "../services/api";
import {
  Truck,
  MapPin,
  Droplets,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

export const DriverLifecycleControls = ({ booking, onStatusUpdated }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");
  const [pendingQueue, setPendingQueue] = useState([]);

  if (!booking) {
    return (
      <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 text-center text-slate-400">
        <Truck className="w-10 h-10 text-slate-600 mx-auto mb-3" />
        <p className="text-sm">No active delivery task assigned.</p>
      </div>
    );
  }

  const steps = [
    { key: "ASSIGNED", label: "Assigned" },
    { key: "EN_ROUTE", label: "En Route" },
    { key: "ARRIVED", label: "Arrived" },
    { key: "DISCHARGING", label: "Discharging" },
    { key: "COMPLETED", label: "Completed" },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === booking.status);

  const getNextStatus = () => {
    switch (booking.status) {
      case "ASSIGNED":
        return "EN_ROUTE";
      case "EN_ROUTE":
        return "ARRIVED";
      case "ARRIVED":
        return "DISCHARGING";
      case "DISCHARGING":
        return "COMPLETED";
      default:
        return null;
    }
  };

  const getActionLabel = (nextStatus) => {
    switch (nextStatus) {
      case "EN_ROUTE":
        return "Start Trip (En Route)";
      case "ARRIVED":
        return "Mark Arrived at Location";
      case "DISCHARGING":
        return "Start Discharging Water";
      case "COMPLETED":
        return "Complete Delivery";
      default:
        return "Update Status";
    }
  };

  const handleUpdateStatus = async (targetStatus) => {
    setError("");
    setIsUpdating(true);

    try {
      const updated = await deliveriesApi.updateStatus(
        booking.id,
        targetStatus,
      );
      if (onStatusUpdated) {
        onStatusUpdated(updated);
      }
    } catch (err) {
      if (
        !navigator.onLine ||
        err.message === "Network Error" ||
        !err.response
      ) {
        // Offline queue fallback
        const queueItem = {
          bookingId: booking.id,
          status: targetStatus,
          timestamp: Date.now(),
        };
        setPendingQueue((prev) => [...prev, queueItem]);
        setError(
          "Network connection offline/unstable. Status change queued locally for synchronization.",
        );
      } else {
        const msg = err.response?.data?.detail || "Failed to update status.";
        setError(msg);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const retryPendingQueue = async () => {
    if (pendingQueue.length === 0) return;
    setError("");
    setIsUpdating(true);
    const item = pendingQueue[0];
    try {
      const updated = await deliveriesApi.updateStatus(
        item.bookingId,
        item.status,
      );
      setPendingQueue((prev) => prev.slice(1));
      if (onStatusUpdated) {
        onStatusUpdated(updated);
      }
    } catch (err) {
      setError("Sync failed. Will retry when connection stabilizes.");
    } finally {
      setIsUpdating(false);
    }
  };

  const nextStatus = getNextStatus();

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl space-y-6">
      {/* Header Info */}
      <div className="flex items-start justify-between gap-4 border-b border-slate-700 pb-4">
        <div>
          <span className="font-mono text-xs text-sky-400 font-bold">
            Task #{booking.id.substring(0, 8)}
          </span>
          <h3 className="text-xl font-bold text-slate-100 mt-1">
            {booking.delivery_address}
          </h3>
          <p className="text-sm text-slate-400 mt-0.5">
            Volume:{" "}
            <span className="font-semibold text-slate-200">
              {booking.volume_liters.toLocaleString()} Liters
            </span>
          </p>
        </div>
        <span className="px-3 py-1 bg-amber-900/40 text-amber-300 border border-amber-700/60 rounded-full text-xs font-semibold">
          {booking.status}
        </span>
      </div>

      {error && (
        <div
          role="alert"
          className="p-3.5 bg-rose-900/30 border border-rose-700/50 rounded-lg text-rose-300 flex items-start gap-2.5 text-sm"
        >
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
          <div className="flex-1">
            <span>{error}</span>
            {pendingQueue.length > 0 && (
              <button
                type="button"
                onClick={retryPendingQueue}
                className="mt-2 text-xs text-sky-300 underline flex items-center gap-1 hover:text-sky-200"
              >
                <RefreshCw className="w-3 h-3" /> Retry Sync (
                {pendingQueue.length} queued)
              </button>
            )}
          </div>
        </div>
      )}

      {/* Progress Stepper */}
      <div className="py-2">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span>Lifecycle Progress</span>
          <span className="font-medium text-sky-400">
            {currentStepIndex >= 0
              ? `${Math.round(((currentStepIndex + 1) / steps.length) * 100)}%`
              : "0%"}
          </span>
        </div>
        <div className="grid grid-cols-5 gap-1.5">
          {steps.map((step, idx) => {
            const isDone = idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div
                key={step.key}
                className={`h-2.5 rounded-full transition-all ${
                  isCurrent
                    ? "bg-sky-400 ring-2 ring-sky-400/40"
                    : isDone
                      ? "bg-sky-600"
                      : "bg-slate-700"
                }`}
                title={step.label}
              />
            );
          })}
        </div>
        <div className="flex justify-between text-[11px] text-slate-500 mt-2 font-mono">
          {steps.map((s) => (
            <span
              key={s.key}
              className={
                s.key === booking.status ? "text-sky-300 font-bold" : ""
              }
            >
              {s.label}
            </span>
          ))}
        </div>
      </div>

      {/* Action Controls */}
      <div className="space-y-3 pt-2">
        {nextStatus && (
          <button
            type="button"
            disabled={isUpdating}
            onClick={() => handleUpdateStatus(nextStatus)}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 text-base transition"
          >
            <CheckCircle className="w-5 h-5" />
            <span>
              {isUpdating ? "Updating Status..." : getActionLabel(nextStatus)}
            </span>
          </button>
        )}

        {booking.status !== "COMPLETED" && booking.status !== "CANCELLED" && (
          <button
            type="button"
            disabled={isUpdating}
            onClick={() => handleUpdateStatus("CANCELLED")}
            className="w-full py-2.5 bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 font-medium rounded-lg text-sm flex items-center justify-center gap-2 transition"
          >
            <XCircle className="w-4 h-4" />
            <span>Cancel Delivery</span>
          </button>
        )}

        {booking.status === "COMPLETED" && (
          <div
            role="status"
            className="p-4 bg-emerald-950/50 border border-emerald-800 rounded-lg text-emerald-300 text-center text-sm font-semibold flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <span>Delivery Completed Successfully</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverLifecycleControls;
