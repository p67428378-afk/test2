import React from "react";

export default function ScheduleTimeline() {
  const hours = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"];

  return (
    <div className="hidden lg:block lg:col-span-1 border-r border-[#334155] pr-4 pt-12 text-right space-y-[100px]">
      {hours.map((hour) => (
        <div key={hour} className="relative h-6">
          <span className="absolute right-2 text-xs font-medium text-[#475569]">
            {hour}
          </span>
        </div>
      ))}
    </div>
  );
}
