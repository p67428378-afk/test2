import React, { useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  Plus,
  Filter,
} from "lucide-react";

export default function AppointmentRoster({
  appointments = [],
  petsMap = {},
  onOpenBookingModal,
  onUpdateStatus,
}) {
  const [statusFilter, setStatusFilter] = useState("");

  const filteredAppointments = appointments.filter((app) => {
    if (!statusFilter) return true;
    return app.status === statusFilter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "SCHEDULED":
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="h-3 w-3" />
            <span>Scheduled</span>
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-3 w-3" />
            <span>Completed</span>
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="h-3 w-3" />
            <span>Cancelled</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <span>Appointments Portal</span>
          </h2>
          <p className="text-sm text-slate-500">
            Book and manage veterinary visit schedules
          </p>
        </div>
        <button
          onClick={onOpenBookingModal}
          className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Book Appointment</span>
        </button>
      </div>

      <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center space-x-3">
        <Filter className="h-4 w-4 text-slate-500" />
        <span className="text-xs font-semibold text-slate-600 uppercase">
          Filter Status:
        </span>
        <div className="flex flex-wrap gap-2">
          {["", "SCHEDULED", "COMPLETED", "CANCELLED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                statusFilter === st
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {st === "" ? "ALL" : st}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-600 text-xs font-semibold uppercase tracking-wider">
              <th className="py-3 px-4">Date & Time</th>
              <th className="py-3 px-4">Pet Name</th>
              <th className="py-3 px-4">Reason</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Notes</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm">
            {filteredAppointments.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-8 text-center text-slate-500">
                  No appointments found.
                </td>
              </tr>
            ) : (
              filteredAppointments.map((app) => {
                const pet = petsMap[app.pet_id];
                return (
                  <tr
                    key={app.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="py-3 px-4 font-medium text-slate-900 whitespace-nowrap">
                      {formatDate(app.appointment_date)}
                    </td>
                    <td className="py-3 px-4 font-semibold text-blue-600">
                      {pet ? pet.name : `Pet #${app.pet_id.slice(0, 6)}`}
                    </td>
                    <td className="py-3 px-4 text-slate-700">{app.reason}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-xs truncate max-w-[200px]">
                      {app.notes || "—"}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      {app.status === "SCHEDULED" && onUpdateStatus && (
                        <div className="inline-flex items-center space-x-2">
                          <button
                            onClick={() => onUpdateStatus(app.id, "COMPLETED")}
                            className="text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded transition-colors"
                          >
                            Complete
                          </button>
                          <button
                            onClick={() => onUpdateStatus(app.id, "CANCELLED")}
                            className="text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2.5 py-1 rounded transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
