import React, { useState } from "react";
import Badge from "../common/Badge";
import { schedulesAPI } from "../../services/api";
import {
  Calendar,
  Users,
  Edit3,
  Trash2,
  Plus,
  User,
  AlertCircle,
} from "lucide-react";

export default function ScheduleManager({
  schedules = [],
  tours = [],
  guides = [],
  onRefresh,
  onOpenCreate,
  onOpenEdit,
}) {
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);

  const handleDelete = async (scheduleId) => {
    if (!window.confirm("Are you sure you want to delete this tour schedule?"))
      return;

    setDeletingId(scheduleId);
    setError(null);
    try {
      await schedulesAPI.deleteSchedule(scheduleId);
      onRefresh();
    } catch (err) {
      const detail = err.response?.data?.detail || "Failed to delete schedule.";
      setError(detail);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Tour Schedules</h2>
          <p className="text-xs text-slate-500">
            Manage dates, capacities, and guide assignments.
          </p>
        </div>
        <button
          onClick={onOpenCreate}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Schedule</span>
        </button>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="p-4">Tour</th>
                <th className="p-4">Start Time</th>
                <th className="p-4">Assigned Guide</th>
                <th className="p-4 text-center">Capacity</th>
                <th className="p-4 text-center">Booked</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {schedules.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400">
                    No schedules created yet. Click "New Schedule" to create
                    one.
                  </td>
                </tr>
              ) : (
                schedules.map((schedule) => {
                  const tour = schedule.tour;
                  const guide = schedule.guide;
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
                    <tr
                      key={schedule.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="p-4 font-semibold text-slate-900">
                        {tour?.name || "Tour Schedule"}
                      </td>
                      <td className="p-4 text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                          <span>{formattedDate}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        {guide?.full_name ? (
                          <span className="flex items-center gap-1 text-slate-800 font-medium">
                            <User className="w-3.5 h-3.5 text-indigo-600" />
                            {guide.full_name}
                          </span>
                        ) : (
                          <Badge variant="warning">Unassigned</Badge>
                        )}
                      </td>
                      <td className="p-4 text-center font-medium text-slate-700">
                        {schedule.max_capacity}
                      </td>
                      <td className="p-4 text-center">
                        <Badge
                          variant={
                            schedule.remaining_capacity === 0
                              ? "danger"
                              : schedule.booked_tickets > 0
                                ? "info"
                                : "default"
                          }
                        >
                          <Users className="w-3 h-3 mr-1 inline" />
                          {schedule.booked_tickets} / {schedule.max_capacity}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end items-center gap-2">
                          <button
                            onClick={() => onOpenEdit(schedule)}
                            className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-md transition-colors"
                            title="Edit Schedule"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(schedule.id)}
                            disabled={deletingId === schedule.id}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors disabled:opacity-50"
                            title="Delete Schedule"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
