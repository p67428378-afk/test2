import React, { useState, useEffect } from "react";
import Modal from "../common/Modal";
import { schedulesAPI } from "../../services/api";
import { AlertCircle } from "lucide-react";

export default function ScheduleFormModal({
  isOpen,
  onClose,
  schedule = null,
  tours = [],
  guides = [],
  onSuccess,
}) {
  const [tourId, setTourId] = useState("");
  const [guideId, setGuideId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [maxCapacity, setMaxCapacity] = useState(20);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (schedule) {
      setTourId(schedule.tour_id || "");
      setGuideId(schedule.guide_id || "");
      if (schedule.start_time) {
        // Format ISO date string for datetime-local input
        const d = new Date(schedule.start_time);
        const isoStr = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16);
        setStartTime(isoStr);
      } else {
        setStartTime("");
      }
      setMaxCapacity(schedule.max_capacity || 20);
    } else {
      setTourId(tours[0]?.id || "");
      setGuideId("");
      setStartTime("");
      setMaxCapacity(20);
    }
    setError(null);
  }, [schedule, tours, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!tourId) {
      setError("Please select a tour.");
      return;
    }
    if (!startTime) {
      setError("Please select a start date and time.");
      return;
    }

    const payload = {
      tour_id: tourId,
      guide_id: guideId || null,
      start_time: new Date(startTime).toISOString(),
      max_capacity: parseInt(maxCapacity, 10),
    };

    setLoading(true);
    try {
      if (schedule) {
        await schedulesAPI.updateSchedule(schedule.id, payload);
      } else {
        await schedulesAPI.createSchedule(payload);
      }
      onSuccess();
      onClose();
    } catch (err) {
      // Do NOT clear user input!
      const detail =
        err.response?.data?.detail ||
        "Failed to save schedule. Check for overlapping guide assignments.";
      setError(detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={schedule ? "Edit Tour Schedule" : "Create Tour Schedule"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
            Tour Type
          </label>
          <select
            value={tourId}
            onChange={(e) => setTourId(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          >
            <option value="" disabled>
              Select a tour
            </option>
            {tours.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.duration_minutes || 60} mins)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
            Assigned Guide (Optional)
          </label>
          <select
            value={guideId}
            onChange={(e) => setGuideId(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="">No Guide Assigned</option>
            {guides.map((g) => (
              <option key={g.id} value={g.id}>
                {g.full_name} ({g.email})
              </option>
            ))}
          </select>
          <p className="text-xs text-slate-400 mt-1">
            System prevents assigning a guide to overlapping tours.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
            Start Date & Time
          </label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
            Maximum Capacity
          </label>
          <input
            type="number"
            min="1"
            max="500"
            value={maxCapacity}
            onChange={(e) => setMaxCapacity(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg shadow-sm transition-colors"
          >
            {loading
              ? "Saving..."
              : schedule
                ? "Update Schedule"
                : "Create Schedule"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
