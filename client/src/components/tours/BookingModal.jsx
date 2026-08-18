import React, { useState } from "react";
import Modal from "../common/Modal";
import { bookingsAPI } from "../../services/api";
import {
  Ticket,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export default function BookingModal({
  isOpen,
  onClose,
  schedule,
  tour,
  onSuccess,
}) {
  const [ticketCount, setTicketCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  if (!schedule || !tour) return null;

  const formattedDate = new Date(schedule.start_time).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (ticketCount <= 0) {
      setError("Please select at least 1 ticket.");
      return;
    }

    if (ticketCount > schedule.remaining_capacity) {
      setError(
        `Cannot book ${ticketCount} tickets. Only ${schedule.remaining_capacity} spots remaining.`,
      );
      return;
    }

    setLoading(true);
    try {
      const res = await bookingsAPI.createBooking({
        schedule_id: schedule.id,
        ticket_count: parseInt(ticketCount, 10),
      });
      // Gate success on actual API response
      if (res && res.id) {
        setSuccessMsg(`Successfully booked ${ticketCount} ticket(s)!`);
        setTimeout(() => {
          setSuccessMsg(null);
          onSuccess();
          onClose();
        }, 1200);
      }
    } catch (err) {
      // Do NOT clear user input on error!
      const detail =
        err.response?.data?.detail ||
        "Failed to complete booking. Please try again.";
      setError(detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Book Tour Tickets">
      <div className="space-y-4">
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <h4 className="font-bold text-slate-900 text-base">{tour.name}</h4>
          <p className="text-xs text-slate-600 mt-1 line-clamp-2">
            {tour.description}
          </p>
          <div className="flex flex-wrap gap-4 text-xs text-slate-500 mt-3 pt-3 border-t border-slate-200">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-indigo-500" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
              {tour.duration_minutes || 60} mins
            </span>
            <span className="flex items-center gap-1 font-semibold text-emerald-600">
              <Ticket className="w-3.5 h-3.5 text-emerald-500" />
              {schedule.remaining_capacity} spots available
            </span>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
              Number of Tickets
            </label>
            <input
              type="number"
              min="1"
              max={schedule.remaining_capacity}
              value={ticketCount}
              onChange={(e) => setTicketCount(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              required
            />
            <p className="text-xs text-slate-400 mt-1">
              Max capacity limit is enforced in real-time.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || schedule.remaining_capacity <= 0}
              className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg shadow-sm transition-colors"
            >
              {loading ? "Confirming..." : "Confirm Booking"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
