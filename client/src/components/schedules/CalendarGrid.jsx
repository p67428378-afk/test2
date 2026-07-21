import React from "react";

export default function CalendarGrid({ schedules, onSelectSchedule }) {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "underway":
        return "78, 222, 163"; // Emerald
      case "planned":
        return "76, 215, 246"; // Cyan
      case "completed":
        return "188, 201, 205"; // Gray
      default:
        return "255, 180, 171"; // Red/Error
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {schedules.map((schedule) => (
        <div
          key={schedule.id}
          onClick={() => onSelectSchedule && onSelectSchedule(schedule)}
          className="glass-panel rounded-lg p-6 card-top-border-primary flex flex-col justify-between min-h-[200px] cursor-pointer hover:border-primary/50 transition-all duration-200"
        >
          <div>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-on-surface truncate max-w-[180px]">
                {schedule.vessel_name}
              </h3>
              <span
                className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider status-chip"
                style={{ "--status-color": getStatusColor(schedule.status) }}
              >
                {schedule.status}
              </span>
            </div>
            <div className="space-y-2 text-sm text-on-surface-variant">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-primary">
                  route
                </span>
                <span className="truncate">{schedule.route}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-primary">
                  calendar_today
                </span>
                <span>
                  {formatDate(schedule.start_date)} -{" "}
                  {formatDate(schedule.end_date)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-primary">
                  anchor
                </span>
                <span>Port: {schedule.destination_port}</span>
              </div>
            </div>
          </div>
          {schedule.notes && (
            <p className="mt-4 text-xs text-on-surface-variant/70 italic line-clamp-2 border-t border-white/5 pt-2">
              {schedule.notes}
            </p>
          )}
        </div>
      ))}
      {schedules.length === 0 && (
        <div className="col-span-full glass-panel rounded-lg p-12 text-center text-on-surface-variant">
          <span className="material-symbols-outlined text-4xl mb-2">
            calendar_today
          </span>
          <p>No schedules found.</p>
        </div>
      )}
    </div>
  );
}
