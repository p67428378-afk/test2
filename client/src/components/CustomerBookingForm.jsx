import React, { useState } from "react";
import { bookingsApi } from "../services/api";
import {
  MapPin,
  Calendar,
  Droplets,
  Send,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export const CustomerBookingForm = ({ onBookingCreated }) => {
  const [address, setAddress] = useState("");
  const [volume, setVolume] = useState("5000");
  const [scheduledTime, setScheduledTime] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const allowedVolumes = [1000, 5000, 10000];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    // Validation
    const selectedVolume = parseInt(volume, 10);
    if (!allowedVolumes.includes(selectedVolume)) {
      setError(
        "Please select a valid tanker volume (1,000L, 5,000L, or 10,000L).",
      );
      return;
    }

    if (!address.trim()) {
      setError("Delivery address is required.");
      return;
    }

    if (!scheduledTime) {
      setError("Delivery date and time window is required.");
      return;
    }

    const scheduledDate = new Date(scheduledTime);
    if (isNaN(scheduledDate.getTime())) {
      setError("Please provide a valid date and time.");
      return;
    }

    const hour = scheduledDate.getHours();
    if (hour < 6 || hour > 22) {
      setError(
        "Delivery time must be within operational hours (6:00 AM - 10:00 PM).",
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        delivery_address: address,
        volume_liters: selectedVolume,
        scheduled_time: scheduledDate.toISOString(),
      };
      const created = await bookingsApi.create(payload);
      setSuccessMsg(
        `Booking #${created.id ? created.id.substring(0, 8) : "NEW"} created successfully with status PENDING_ASSIGNMENT.`,
      );
      setAddress("");
      setScheduledTime("");
      if (onBookingCreated) {
        onBookingCreated(created);
      }
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        "Failed to submit delivery request. Please try again.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-sky-500/10 rounded-lg text-sky-400">
          <Droplets className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-100">
            Request Water Delivery
          </h2>
          <p className="text-sm text-slate-400">
            Specify destination, tanker capacity, and schedule.
          </p>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-4 p-3.5 bg-rose-900/30 border border-rose-700/50 rounded-lg text-rose-300 flex items-start gap-2.5 text-sm"
        >
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div
          role="status"
          className="mb-4 p-3.5 bg-emerald-900/30 border border-emerald-700/50 rounded-lg text-emerald-300 flex items-start gap-2.5 text-sm"
        >
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="delivery_address"
            className="block text-sm font-medium text-slate-300 mb-1.5 flex items-center gap-1.5"
          >
            <MapPin className="w-4 h-4 text-sky-400" />
            <span>Delivery Destination Address / Coordinates</span>
          </label>
          <input
            id="delivery_address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g. 123 Park Avenue, North Zone"
            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition"
            required
          />
        </div>

        <div>
          <label
            htmlFor="volume_liters"
            className="block text-sm font-medium text-slate-300 mb-1.5 flex items-center gap-1.5"
          >
            <Droplets className="w-4 h-4 text-sky-400" />
            <span>Required Tanker Volume (Liters)</span>
          </label>
          <select
            id="volume_liters"
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-sky-500 transition"
          >
            <option value="1000">1,000 Liters (Small Residential)</option>
            <option value="5000">
              5,000 Liters (Standard Household / Commercial)
            </option>
            <option value="10000">
              10,000 Liters (Large Commercial / Bulk)
            </option>
          </select>
        </div>

        <div>
          <label
            htmlFor="scheduled_time"
            className="block text-sm font-medium text-slate-300 mb-1.5 flex items-center gap-1.5"
          >
            <Calendar className="w-4 h-4 text-sky-400" />
            <span>Preferred Delivery Time Window (6:00 AM - 10:00 PM)</span>
          </label>
          <input
            id="scheduled_time"
            type="datetime-local"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-sky-500 transition"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-medium rounded-lg shadow-md flex items-center justify-center gap-2 transition mt-2"
        >
          <Send className="w-4 h-4" />
          <span>
            {isSubmitting ? "Submitting Request..." : "Submit Delivery Request"}
          </span>
        </button>
      </form>
    </div>
  );
};

export default CustomerBookingForm;
