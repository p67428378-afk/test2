import React, { useState, useEffect } from "react";
import { X, Calendar, Check, AlertCircle } from "lucide-react";
import { createSchedule, updateSchedule } from "../../services/api";

export default function ScheduleModal({
  isOpen,
  onClose,
  schedule,
  tours,
  guides,
  onSaved,
}) {
  const [tourId, setTourId] = useState("");
  const [guideId, setGuideId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [maxCapacity, setMaxCapacity] = useState(25);
  const [status, setStatus] = useState("Published");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (schedule) {
      setTourId(schedule.tour_id || "");
      setGuideId(schedule.guide_id || "");
      setStartTime(
        schedule.start_time
          ? new Date(schedule.start_time).toISOString().slice(0, 16)
          : "",
      );
      setEndTime(
        schedule.end_time
          ? new Date(schedule.end_time).toISOString().slice(0, 16)
          : "",
      );
      setMaxCapacity(schedule.max_capacity || 25);
      setStatus(schedule.status || "Published");
    } else {
      // Default: 2 hours from now for 1 hour duration
      const now = new Date();
      now.setHours(now.getHours() + 2, 0, 0, 0);
      const end = new Date(now);
      end.setHours(end.getHours() + 1);

      setTourId(tours && tours.length > 0 ? tours[0].id : "");
      setGuideId("");
      setStartTime(now.toISOString().slice(0, 16));
      setEndTime(end.toISOString().slice(0, 16));
      setMaxCapacity(25);
      setStatus("Published");
    }
    setErrorMessage(null);
  }, [schedule, tours, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const payload = {
        tour_id: tourId,
        guide_id: guideId || null,
        start_time: new Date(startTime).toISOString(),
        end_time: new Date(endTime).toISOString(),
        max_capacity: parseInt(maxCapacity, 10),
        status,
      };

      if (schedule && schedule.id) {
        await updateSchedule(schedule.id, payload);
      } else {
        await createSchedule(payload);
      }

      if (onSaved) onSaved();
      onClose();
    } catch (err) {
      const detail = err.response?.data?.detail;
      const msg =
        typeof detail === "string"
          ? detail
          : detail?.[0]?.msg || "Failed to save schedule slot";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            {schedule ? "Edit Tour Schedule" : "Create Tour Schedule Slot"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Tour Route *
            </label>
            <select
              required
              value={tourId}
              onChange={(e) => setTourId(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
            >
              <option value="">-- Choose Tour Route --</option>
              {(tours || []).map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title} ({t.duration_minutes} mins)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Assign Guide (Optional)
            </label>
            <select
              value={guideId}
              onChange={(e) => setGuideId(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
            >
              <option value="">-- No Guide Assigned Yet --</option>
              {(guides || []).map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name} - {g.specialization || "General"}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Start Time *
              </label>
              <input
                type="datetime-local"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                End Time *
              </label>
              <input
                type="datetime-local"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Max Capacity (Visitors) *
              </label>
              <input
                type="number"
                min="1"
                max="500"
                required
                value={maxCapacity}
                onChange={(e) => setMaxCapacity(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Status *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
              >
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {errorMessage && (
            <div
              role="alert"
              className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start space-x-2 text-xs text-rose-700"
            >
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-lg text-sm font-semibold transition shadow-sm flex items-center space-x-1.5"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{schedule ? "Update Slot" : "Publish Slot"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
