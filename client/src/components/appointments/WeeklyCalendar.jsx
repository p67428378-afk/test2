import React from "react";

export default function WeeklyCalendar({
  selectedDate,
  onSelectSlot,
  availableSlots = [],
  wsConnected = false,
  reschedulingAppointment = null,
}) {
  // Generate 7 days starting from Monday, July 13, 2026 (as in the Stitch HTML)
  const baseDate = new Date("2026-07-13T00:00:00");
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + i);
    return d;
  });

  const formatDayHeader = (date) => {
    const options = { weekday: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const isSameDay = (d1, d2) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  // Standard slots to display for the selected day
  const standardTimes = [
    { label: "09:00 AM", time: "09:00:00" },
    { label: "10:30 AM", time: "10:30:00" },
    { label: "02:00 PM", time: "14:00:00" },
    { label: "03:30 PM", time: "15:30:00" },
  ];

  return (
    <div class="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-unit-lg flex flex-col">
      <div class="flex justify-between items-center mb-6 flex-wrap gap-2">
        <h2 class="font-headline-sm text-headline-sm text-on-surface">
          {reschedulingAppointment
            ? "Select a New Time Slot"
            : "Select a Time Slot"}
        </h2>
        <div
          class={`flex items-center gap-2 px-3 py-1 rounded-full border ${
            wsConnected
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-amber-50 text-amber-700 border-amber-200"
          }`}
        >
          <span
            class={`w-2 h-2 rounded-full ${
              wsConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
            }`}
          ></span>
          <span class="font-label-sm text-label-sm">
            {wsConnected
              ? "Live Availability (WebSocket Connected)"
              : "Live Availability (Polling Mode)"}
          </span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div class="grid grid-cols-7 gap-2 mb-6">
        {/* Headers */}
        {days.map((day, idx) => {
          const isSelected = isSameDay(day, selectedDate);
          return (
            <div
              key={idx}
              class={`text-center font-label-sm text-label-sm pb-2 ${
                isSelected
                  ? "text-primary font-bold border-b-2 border-primary"
                  : "text-on-surface-variant border-b border-outline-variant"
              }`}
            >
              {formatDayHeader(day)}
            </div>
          );
        })}

        {/* Slots Grid */}
        {days.map((day, dayIdx) => {
          const isSelected = isSameDay(day, selectedDate);
          return (
            <div key={dayIdx} class="space-y-2 mt-4">
              {isSelected &&
                standardTimes.map((slot, slotIdx) => {
                  // Construct ISO string for this slot
                  const year = day.getFullYear();
                  const month = String(day.getMonth() + 1).padStart(2, "0");
                  const dateStr = String(day.getDate()).padStart(2, "0");
                  const isoString = `${year}-${month}-${dateStr}T${slot.time}`;

                  // Check if this slot is in the availableSlots list
                  const isAvailable = availableSlots.some((s) =>
                    s.startsWith(isoString.substring(0, 16)),
                  );

                  if (!isAvailable) {
                    return (
                      <button
                        key={slotIdx}
                        disabled
                        class="w-full py-2 text-center rounded-lg border border-outline-variant bg-surface-variant/20 text-on-surface-variant/50 line-through cursor-not-allowed font-label-md text-label-md"
                      >
                        {slot.label}
                      </button>
                    );
                  }

                  return (
                    <button
                      key={slotIdx}
                      onClick={() => onSelectSlot(isoString, slot.label)}
                      class="w-full py-2 text-center rounded-lg border border-primary text-primary font-label-md text-label-md hover:bg-primary/10 transition-colors"
                    >
                      {slot.label}
                    </button>
                  );
                })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
