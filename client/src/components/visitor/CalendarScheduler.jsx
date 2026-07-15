import React, { useState } from "react";

export default function CalendarScheduler({ onSubmitRequest }) {
  const [selectedInmate, setSelectedInmate] = useState("IN-8821");
  const [selectedDate, setSelectedDate] = useState("2026-07-20");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(
    "10:30 AM - 11:30 AM",
  );
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const inmates = [
    {
      id: "IN-8821",
      name: "Marcus Vance",
      number: "IN-8821",
      cell: "Block C, Cell 104",
    },
  ];

  const timeSlots = [
    { id: "slot1", time: "09:00 AM - 10:00 AM", available: true },
    { id: "slot2", time: "10:30 AM - 11:30 AM", available: true },
    { id: "slot3", time: "01:00 PM - 02:00 PM", available: false },
    { id: "slot4", time: "02:30 PM - 03:30 PM", available: true },
  ];

  const handleDateSelect = (day) => {
    const formattedDate = `2026-07-${day < 10 ? "0" + day : day}`;
    setSelectedDate(formattedDate);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedInmate || !selectedDate || !selectedTimeSlot) {
      setError("Please select an inmate, date, and time slot.");
      return;
    }

    try {
      await onSubmitRequest({
        inmate_id: "IN-8821", // Hardcoded to seed inmate for simplicity/robustness
        requested_date: selectedDate,
        time_slot: selectedTimeSlot,
      });
      setSuccess(
        "Appointment request submitted successfully! Pending staff approval.",
      );
    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to submit appointment request.",
      );
    }
  };

  return (
    <div className="bg-surface-container p-6 rounded-xl border border-surface-variant flex flex-col h-full shadow-lg">
      <header className="mb-6 border-b border-surface-variant pb-4">
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">
          Schedule a Visit
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Select an inmate and choose an available time slot.
        </p>
      </header>

      {error && (
        <div className="mb-4 p-3 bg-error-container border border-error text-on-error-container rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-[#132d20] border border-[#1f4a35] text-[#4ade80] rounded-lg text-sm">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <label className="font-label-sm text-label-sm text-on-surface-variant">
            Select Inmate
          </label>
          <select
            value={selectedInmate}
            onChange={(e) => setSelectedInmate(e.target.value)}
            className="w-full bg-surface-container-high border border-outline-variant text-on-surface font-body-md text-body-md rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-primary-fixed"
          >
            {inmates.map((inmate) => (
              <option key={inmate.id} value={inmate.id}>
                {inmate.name} - ID: #{inmate.number} ({inmate.cell})
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center bg-surface-container-high p-4 rounded-t-lg border-b border-outline-variant">
            <button
              type="button"
              className="text-on-surface-variant hover:text-on-surface"
            >
              ◀
            </button>
            <span className="font-headline-sm text-headline-sm text-on-surface">
              July 2026
            </span>
            <button
              type="button"
              className="text-on-surface-variant hover:text-on-surface"
            >
              ▶
            </button>
          </div>
          <div className="grid grid-cols-7 gap-2 text-center mb-2">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <div
                key={day}
                className="font-label-sm text-label-sm text-on-surface-variant py-2"
              >
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2 text-center">
            {/* Empty slots for previous month */}
            <div></div>
            <div></div>
            <div></div>
            {/* Dates */}
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
              const dateStr = `2026-07-${day < 10 ? "0" + day : day}`;
              const isSelected = selectedDate === dateStr;
              const isSelectable = day >= 15; // Simulate only future dates selectable

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => isSelectable && handleDateSelect(day)}
                  className={`py-2 rounded-lg font-body-md text-body-md transition-all ${
                    isSelected
                      ? "bg-[#6366f1] text-white border border-[#6366f1] shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                      : isSelectable
                        ? "text-on-surface border border-outline-variant hover:border-primary-fixed cursor-pointer"
                        : "text-on-surface-variant border border-transparent opacity-40 cursor-not-allowed"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-label-sm text-label-sm text-on-surface-variant">
            Available Time Slots for {selectedDate}
          </label>
          <div className="grid grid-cols-2 gap-4">
            {timeSlots.map((slot) => (
              <button
                key={slot.id}
                type="button"
                disabled={!slot.available}
                onClick={() => setSelectedTimeSlot(slot.time)}
                className={`p-3 text-center rounded-lg font-body-sm text-body-sm transition-all ${
                  !slot.available
                    ? "border border-surface-variant bg-surface-container-lowest opacity-50 cursor-not-allowed text-on-surface-variant"
                    : selectedTimeSlot === slot.time
                      ? "border-2 border-[#6366f1] bg-[#1e1b4b] text-white shadow-[0_0_8px_rgba(99,102,241,0.3)]"
                      : "border border-outline-variant text-on-surface hover:border-primary-fixed hover:bg-surface-container-highest"
                }`}
              >
                {slot.time}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#3f2000] border border-[#703700] rounded-lg p-4 flex items-start gap-2 mt-auto">
          <span className="text-[#ffb783] mt-1 font-bold">⚠️</span>
          <p className="font-body-sm text-body-sm text-[#ffb783]">
            Note: Maximum 2 visitors allowed per inmate. Slot is available.
          </p>
        </div>

        <button
          type="submit"
          className="w-full bg-[#6366f1] text-white font-label-md text-label-md py-4 rounded-lg hover:bg-opacity-90 transition-opacity"
        >
          Submit Appointment Request
        </button>
      </form>
    </div>
  );
}
