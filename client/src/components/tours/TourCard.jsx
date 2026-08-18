import React from "react";
import { Clock, Users, Calendar, ArrowRight } from "lucide-react";
import Badge from "../common/Badge";

export default function TourCard({ tour, schedules = [], onBook }) {
  const tourSchedules = schedules.filter((s) => s.tour_id === tour.id);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-slate-900 leading-tight">
              {tour.name}
            </h3>
            <span className="flex items-center text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md font-medium">
              <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
              {tour.duration_minutes || 60} mins
            </span>
          </div>

          <p className="text-slate-600 text-sm mb-6 line-clamp-3">
            {tour.description || "No description provided."}
          </p>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Upcoming Schedules ({tourSchedules.length})
          </h4>

          {tourSchedules.length === 0 ? (
            <p className="text-xs text-slate-400 italic mb-4">
              No upcoming schedules available
            </p>
          ) : (
            <div className="space-y-2.5 mb-4 max-h-48 overflow-y-auto pr-1">
              {tourSchedules.map((schedule) => {
                const isFull = schedule.remaining_capacity <= 0;
                const formattedDate = new Date(
                  schedule.start_time,
                ).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                });

                return (
                  <div
                    key={schedule.id}
                    className="flex justify-between items-center p-3 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-100 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                        <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{formattedDate}</span>
                      </div>
                      {schedule.guide?.full_name && (
                        <p className="text-xs text-slate-500 mt-0.5">
                          Guide:{" "}
                          <span className="font-medium text-slate-700">
                            {schedule.guide.full_name}
                          </span>
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          isFull
                            ? "danger"
                            : schedule.remaining_capacity <= 5
                              ? "warning"
                              : "success"
                        }
                      >
                        <Users className="w-3 h-3 mr-1 inline" />
                        {isFull
                          ? "Fully Booked"
                          : `${schedule.remaining_capacity} left`}
                      </Badge>

                      <button
                        onClick={() => onBook(schedule, tour)}
                        disabled={isFull}
                        className={`text-xs px-3 py-1.5 rounded-md font-medium flex items-center gap-1 transition-colors ${
                          isFull
                            ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                            : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                        }`}
                      >
                        <span>Book</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
