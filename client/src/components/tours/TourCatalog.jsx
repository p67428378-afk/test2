import React, { useState } from "react";
import { Clock, Users, User, Search, Calendar } from "lucide-react";

export default function TourCatalog({
  schedules,
  selectedSchedule,
  onSelectSchedule,
  isLoading,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);

  const filteredSchedules = (schedules || []).filter((s) => {
    const titleMatch = (s.tour_title || "Guided Museum Tour")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const guideMatch = (s.guide_name || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchSearch = titleMatch || guideMatch;
    if (availableOnly) {
      const remaining =
        s.remaining_capacity !== undefined
          ? s.remaining_capacity
          : s.max_capacity - (s.booked_tickets || 0);
      return matchSearch && remaining > 0 && s.status === "Published";
    }
    return matchSearch;
  });

  const formatDateTime = (isoString) => {
    if (!isoString) return "TBD";
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search tours or guides..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
          />
        </div>
        <label className="flex items-center space-x-2 text-xs font-medium text-slate-600 cursor-pointer self-start sm:self-center">
          <input
            type="checkbox"
            checked={availableOnly}
            onChange={(e) => setAvailableOnly(e.target.checked)}
            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span>Available seats only</span>
        </label>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-slate-500 text-sm">
          <div className="animate-spin inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mb-2"></div>
          <p>Loading tour schedules...</p>
        </div>
      ) : filteredSchedules.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl">
          <Calendar className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-700">
            No tour schedules found
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your search criteria
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSchedules.map((schedule) => {
            const isSelected = selectedSchedule?.id === schedule.id;
            const remaining =
              schedule.remaining_capacity !== undefined
                ? schedule.remaining_capacity
                : schedule.max_capacity - (schedule.booked_tickets || 0);
            const isSoldOut = remaining <= 0;

            return (
              <div
                key={schedule.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelectSchedule(schedule)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelectSchedule(schedule);
                  }
                }}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? "border-blue-600 bg-blue-50/70 shadow-sm ring-1 ring-blue-600"
                    : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-slate-900 text-base">
                        {schedule.tour_title || "Museum Guided Tour"}
                      </h3>
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                          schedule.status === "Published"
                            ? "bg-emerald-100 text-emerald-800"
                            : schedule.status === "Draft"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {schedule.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 mt-1.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {formatDateTime(schedule.start_time)}
                      </span>
                      {schedule.guide_name && (
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          Guide: {schedule.guide_name}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 mt-2 sm:mt-0">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1 ${
                        isSoldOut
                          ? "bg-rose-100 text-rose-700"
                          : remaining <= 5
                            ? "bg-amber-100 text-amber-800"
                            : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      <Users className="w-3 h-3" />
                      {isSoldOut ? "Sold Out" : `${remaining} seats left`}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Capacity: {schedule.max_capacity}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
