import React, { useState } from "react";
import {
  Calendar,
  Clock,
  User,
  Edit3,
  UserPlus,
  FileBarChart,
  Filter,
} from "lucide-react";

export default function ScheduleTable({
  schedules,
  onEditSchedule,
  onAssignGuide,
  onViewReport,
  isLoading,
}) {
  const [filterStatus, setFilterStatus] = useState("ALL");

  const filtered = (schedules || []).filter((s) => {
    if (filterStatus === "ALL") return true;
    return s.status === filterStatus;
  });

  const formatDateTime = (isoString) => {
    if (!isoString) return "TBD";
    try {
      const d = new Date(isoString);
      return d.toLocaleString(undefined, {
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
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-semibold text-slate-700">
            Filter by Status:
          </span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs border border-slate-200 bg-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <span className="text-xs text-slate-500">
          Showing {filtered.length} of {schedules?.length || 0} schedules
        </span>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-slate-500 text-sm">
          <div className="animate-spin inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mb-2"></div>
          <p>Loading schedules...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center text-slate-500 text-sm">
          <Calendar className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="font-medium text-slate-700">
            No schedules match the criteria
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Tour Route</th>
                <th className="py-3.5 px-4">Time Slot</th>
                <th className="py-3.5 px-4">Assigned Guide</th>
                <th className="py-3.5 px-4">Capacity & Bookings</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((s) => {
                const remaining =
                  s.remaining_capacity !== undefined
                    ? s.remaining_capacity
                    : s.max_capacity - (s.booked_tickets || 0);

                return (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      <div>{s.tour_title || "Guided Tour"}</div>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                        {s.id}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="flex items-center gap-1 font-medium text-slate-800">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {formatDateTime(s.start_time)}
                      </div>
                      <div className="text-[11px] text-slate-400 pl-4.5">
                        to {formatDateTime(s.end_time)}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {s.guide_name ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 font-medium">
                          <User className="w-3 h-3 text-blue-600" />
                          {s.guide_name}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">
                          Unassigned
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-slate-900">
                          {s.booked_tickets || 0} / {s.max_capacity}
                        </span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                            remaining <= 0
                              ? "bg-rose-100 text-rose-700"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {remaining} left
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          s.status === "Published"
                            ? "bg-emerald-100 text-emerald-800"
                            : s.status === "Draft"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          type="button"
                          onClick={() => onAssignGuide(s)}
                          title="Assign Guide"
                          className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <UserPlus className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onEditSchedule(s)}
                          title="Edit Schedule"
                          className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onViewReport(s)}
                          title="Attendance Report"
                          className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <FileBarChart className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
