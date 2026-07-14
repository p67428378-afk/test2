import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CalendarGrid({ unavailableDates, onToggleDate }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Get first day of month and total days
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const days = [];
  // Empty slots for previous month days
  for (let i = 0; i < firstDayIndex; i++) {
    days.push(null);
  }
  // Days of current month
  for (let i = 1; i <= totalDays; i++) {
    days.push(i);
  }

  const formatDateString = (day) => {
    if (!day) return "";
    const d = new Date(year, month, day);
    const offset = d.getTimezoneOffset();
    const localDate = new Date(d.getTime() - offset * 60 * 1000);
    return localDate.toISOString().split("T")[0];
  };

  return (
    <div className="bg-surface-container border border-outline-variant rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-headline-sm text-headline-sm text-on-surface">
            {monthNames[month]} {year}
          </h3>
          <p className="text-body-md text-on-surface-variant mt-1">
            Click on dates to toggle your availability. Green is available, Red
            is unavailable.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={prevMonth}
            className="p-2 rounded-lg border border-outline-variant hover:bg-surface-container-high text-on-surface transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 rounded-lg border border-outline-variant hover:bg-surface-container-high text-on-surface transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div
            key={d}
            className="font-label-md text-label-md text-outline py-2 uppercase tracking-wider"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} className="aspect-square" />;
          }

          const dateStr = formatDateString(day);
          const isUnavailable = unavailableDates.includes(dateStr);

          return (
            <button
              key={`day-${day}`}
              onClick={() => onToggleDate(dateStr)}
              className={`aspect-square rounded-lg flex flex-col items-center justify-center border transition-all duration-200 relative group ${
                isUnavailable
                  ? "bg-error/10 border-error text-error hover:bg-error/20"
                  : "bg-primary/5 border-outline-variant text-on-surface hover:border-primary hover:bg-primary/10"
              }`}
            >
              <span className="font-semibold text-lg">{day}</span>
              <span
                className={`w-1.5 h-1.5 rounded-full mt-1 ${isUnavailable ? "bg-error" : "bg-primary"}`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
