import React, { useState } from "react";
import Badge from "../common/Badge";
import { attendanceAPI } from "../../services/api";
import { User, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";

export default function AttendanceSheet({
  schedule,
  attendanceList = [],
  onRefresh,
}) {
  const [updatingBookingId, setUpdatingBookingId] = useState(null);
  const [error, setError] = useState(null);

  if (!schedule) {
    return (
      <div className="bg-white rounded-xl p-8 text-center border border-slate-200 text-slate-500">
        Please select a schedule to view attendance.
      </div>
    );
  }

  const handleCheckIn = async (bookingId, status) => {
    setUpdatingBookingId(bookingId);
    setError(null);
    try {
      await attendanceAPI.checkInVisitor({
        booking_id: bookingId,
        status: status,
      });
      onRefresh();
    } catch (err) {
      const detail =
        err.response?.data?.detail || "Failed to update attendance status.";
      setError(detail);
    } finally {
      setUpdatingBookingId(null);
    }
  };

  const tourName = schedule.tour?.name || "Guided Tour";
  const formattedDate = new Date(schedule.start_time).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="space-y-4">
      <div className="bg-slate-900 text-white p-6 rounded-xl shadow-md border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
            Attendance Roster
          </span>
          <h2 className="text-xl font-bold mt-0.5">{tourName}</h2>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            {formattedDate}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 font-medium">
            Guide:{" "}
            <strong className="text-white">
              {schedule.guide?.full_name || "Unassigned"}
            </strong>
          </span>
          <span className="text-xs bg-indigo-900/50 text-indigo-300 px-3 py-1.5 rounded-lg border border-indigo-700/50 font-medium">
            Visitors:{" "}
            <strong className="text-white">
              {attendanceList.length} Bookings
            </strong>
          </span>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {attendanceList.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center border border-slate-200 text-slate-500">
          No confirmed visitor bookings for this schedule yet.
        </div>
      ) : (
        <div className="space-y-3">
          {attendanceList.map((att) => {
            const visitorName =
              att.visitor_name || att.booking?.visitor?.full_name || "Visitor";
            const email = att.booking?.visitor?.email || "N/A";
            const ticketCount =
              att.ticket_count || att.booking?.ticket_count || 1;
            const status = att.status || "Unchecked";
            const checkedInAt = att.checked_in_at
              ? new Date(att.checked_in_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : null;

            const isCheckedIn = status === "Checked-in";
            const isNoShow = status === "No-show";

            return (
              <div
                key={att.id}
                className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm border border-slate-200 flex-shrink-0">
                    <User className="w-5 h-5 text-slate-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">
                        {visitorName}
                      </h4>
                      <span className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded">
                        {ticketCount} {ticketCount === 1 ? "ticket" : "tickets"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{email}</p>
                    {checkedInAt && (
                      <p className="text-xs text-emerald-600 font-medium mt-0.5">
                        Checked in at {checkedInAt}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                  <Badge
                    variant={
                      isCheckedIn ? "success" : isNoShow ? "danger" : "default"
                    }
                  >
                    {status}
                  </Badge>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        handleCheckIn(att.booking_id, "Checked-in")
                      }
                      disabled={
                        updatingBookingId === att.booking_id || isCheckedIn
                      }
                      className={`text-xs px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors ${
                        isCheckedIn
                          ? "bg-emerald-100 text-emerald-800 opacity-75"
                          : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                      }`}
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Check In</span>
                    </button>

                    <button
                      onClick={() => handleCheckIn(att.booking_id, "No-show")}
                      disabled={
                        updatingBookingId === att.booking_id || isNoShow
                      }
                      className={`text-xs px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors ${
                        isNoShow
                          ? "bg-rose-100 text-rose-800 opacity-75"
                          : "bg-slate-200 hover:bg-slate-300 text-slate-700"
                      }`}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>No Show</span>
                    </button>
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
