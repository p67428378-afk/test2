import React from "react";
import EventCard from "./EventCard.jsx";

export default function DayCard({ day, events, onEdit, onDelete }) {
  return (
    <div className="lg:col-span-3 flex flex-col gap-4 relative">
      <h3 className="text-sm font-semibold text-[#F8FAFC] border-b border-[#334155] pb-2 mb-1 sticky top-0 bg-[#0F172A] z-10 lg:static">
        {day}
      </h3>

      <div className="flex flex-col gap-3 min-h-[100px]">
        {events.length > 0 ? (
          events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        ) : (
          <div className="flex items-center justify-center h-24 border border-dashed border-[#334155] rounded-lg bg-[#1E293B]/20">
            <span className="text-xs text-[#475569]">No events scheduled</span>
          </div>
        )}
      </div>
    </div>
  );
}
