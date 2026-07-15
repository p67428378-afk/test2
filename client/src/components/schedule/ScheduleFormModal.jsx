import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function ScheduleFormModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}) {
  const [title, setTitle] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("Monday");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDayOfWeek(initialData.day_of_week || "Monday");
      // Format time from HH:MM:SS to HH:MM if needed
      const formatTime = (t) => (t ? t.substring(0, 5) : "");
      setStartTime(formatTime(initialData.start_time) || "09:00");
      setEndTime(formatTime(initialData.end_time) || "10:00");
      setNotes(initialData.notes || "");
    } else {
      setTitle("");
      setDayOfWeek("Monday");
      setStartTime("09:00");
      setEndTime("10:00");
      setNotes("");
    }
    setError("");
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Event Title is required.");
      return;
    }

    // Simple business logic validation: End Time must be after Start Time
    if (endTime <= startTime) {
      setError("End Time must be later than Start Time.");
      return;
    }

    // Format times to HH:MM:00 for backend compatibility
    const formattedStart =
      startTime.length === 5 ? `${startTime}:00` : startTime;
    const formattedEnd = endTime.length === 5 ? `${endTime}:00` : endTime;

    onSave({
      title: title.trim(),
      day_of_week: dayOfWeek,
      start_time: formattedStart,
      end_time: formattedEnd,
      notes: notes.trim() || null,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#1E293B] border border-[#334155] rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#334155]">
          <h3 className="text-lg font-semibold text-[#F8FAFC]">
            {initialData ? "Edit Schedule Slot" : "Add New Slot"}
          </h3>
          <button
            onClick={onClose}
            className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div
              className="p-3 text-sm text-red-200 bg-red-900/30 border border-red-500/50 rounded-lg"
              role="alert"
            >
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="event-title"
              className="block text-sm font-medium text-[#94A3B8] mb-1"
            >
              Event Title *
            </label>
            <input
              id="event-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. CS101: Intro to Computer Science"
              className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-[#F8FAFC] focus:outline-none focus:border-[#6366F1] transition-colors"
              required
            />
          </div>

          <div>
            <label
              htmlFor="day-of-week"
              className="block text-sm font-medium text-[#94A3B8] mb-1"
            >
              Day of the Week *
            </label>
            <select
              id="day-of-week"
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(e.target.value)}
              className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-[#F8FAFC] focus:outline-none focus:border-[#6366F1] transition-colors"
            >
              {DAYS_OF_WEEK.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="start-time"
                className="block text-sm font-medium text-[#94A3B8] mb-1"
              >
                Start Time *
              </label>
              <input
                id="start-time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-[#F8FAFC] focus:outline-none focus:border-[#6366F1] transition-colors"
                required
              />
            </div>
            <div>
              <label
                htmlFor="end-time"
                className="block text-sm font-medium text-[#94A3B8] mb-1"
              >
                End Time *
              </label>
              <input
                id="end-time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-[#F8FAFC] focus:outline-none focus:border-[#6366F1] transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-[#94A3B8] mb-1"
            >
              Notes / Location
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Tech Hall Room 402. Bring laptop."
              rows={3}
              className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-[#F8FAFC] focus:outline-none focus:border-[#6366F1] transition-colors resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#334155]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-[#6366F1] hover:bg-[#4F46E5] rounded-lg transition-colors"
            >
              Save Slot
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
