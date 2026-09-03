import React from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";

export default function WeeklyCalendarGrid({
  photographerName = "Elena Rostova",
  slots = [],
  onBlockDateClick,
}) {
  // Mock weekly schedule view matching DesignSpec
  const weekDays = [
    {
      day: "Mon",
      status: "Available",
      color: "bg-emerald-100 text-emerald-800 border-emerald-300",
    },
    {
      day: "Tue",
      status: "Session #101",
      color: "bg-amber-100 text-amber-900 border-amber-300",
    },
    {
      day: "Wed",
      status: "Available",
      color: "bg-emerald-100 text-emerald-800 border-emerald-300",
    },
    {
      day: "Thu",
      status: "Available",
      color: "bg-emerald-100 text-emerald-800 border-emerald-300",
    },
    {
      day: "Fri",
      status: "Session #103",
      color: "bg-amber-100 text-amber-900 border-amber-300",
    },
    {
      day: "Sat",
      status: "Session #104",
      color: "bg-amber-200 text-amber-950 border-amber-400 font-bold",
    },
    {
      day: "Sun",
      status: "Blocked",
      color: "bg-stone-200 text-stone-700 border-stone-300",
    },
  ];

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-stone-900">
            Photographer Schedule —{" "}
            <span className="text-[#775A19]">{photographerName}</span>
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Standard Working Hours: Mon-Sat 09:00 AM – 05:00 PM (Sundays
            Blocked)
          </p>
        </div>
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-7 gap-2.5 mb-6">
        {weekDays.map((item, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-xl border text-center transition-all ${item.color}`}
          >
            <p className="text-xs font-bold uppercase tracking-wider mb-1">
              {item.day}
            </p>
            <p className="text-xs font-semibold">{item.status}</p>
          </div>
        ))}
      </div>

      {/* Slots List if loaded */}
      {slots.length > 0 && (
        <div className="mt-4 border-t border-stone-100 pt-4">
          <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-3">
            Available Time Slots
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {slots.map((slot, i) => (
              <div
                key={i}
                className={`p-2.5 rounded-lg border text-xs font-medium flex items-center justify-between ${
                  slot.is_available
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : "bg-stone-100 text-stone-500 border-stone-200 line-through"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    {slot.start_time} - {slot.end_time}
                  </span>
                </div>
                {slot.is_available ? (
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-stone-400" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
