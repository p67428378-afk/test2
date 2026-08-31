import React, { useState } from "react";
import {
  ClipboardCheck,
  CheckCircle2,
  AlertCircle,
  FileBarChart,
  UserCheck,
  Percent,
} from "lucide-react";
import { recordCheckIn, getScheduleAttendanceReport } from "../../services/api";

export default function AttendanceCheckInTable({
  schedules,
  attendanceRecords,
  onCheckInSuccess,
}) {
  const [bookingId, setBookingId] = useState("");
  const [scheduleId, setScheduleId] = useState("");
  const [attendedCount, setAttendedCount] = useState(1);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Report state
  const [selectedReportScheduleId, setSelectedReportScheduleId] = useState("");
  const [reportData, setReportData] = useState(null);
  const [isLoadingReport, setIsLoadingReport] = useState(false);
  const [reportError, setReportError] = useState(null);

  const handleCheckIn = async (e) => {
    e.preventDefault();
    setFeedback(null);
    setIsSubmitting(true);

    try {
      const payload = {
        booking_id: bookingId.trim(),
        schedule_id: scheduleId.trim(),
        attended_count: parseInt(attendedCount, 10),
        notes: notes.trim() || null,
      };

      const res = await recordCheckIn(payload);
      setFeedback({
        type: "success",
        message: `Check-in recorded successfully for ${res.data.attended_count} visitor(s)!`,
      });
      setBookingId("");
      setNotes("");
      if (onCheckInSuccess) onCheckInSuccess(res.data);
    } catch (err) {
      const detail = err.response?.data?.detail;
      const msg =
        typeof detail === "string"
          ? detail
          : detail?.[0]?.msg || "Failed to record attendance check-in";
      setFeedback({ type: "error", message: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFetchReport = async (schedId) => {
    if (!schedId) return;
    setSelectedReportScheduleId(schedId);
    setIsLoadingReport(true);
    setReportError(null);

    try {
      const res = await getScheduleAttendanceReport(schedId);
      setReportData(res.data);
    } catch (err) {
      const detail = err.response?.data?.detail;
      const msg =
        typeof detail === "string"
          ? detail
          : detail?.[0]?.msg || "Failed to load attendance report";
      setReportError(msg);
      setReportData(null);
    } finally {
      setIsLoadingReport(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Check-in Desk Form */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-blue-600" />
              Visitor Check-in Desk
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Record attendee arrival against their tour booking reservation.
            </p>
          </div>

          {feedback && (
            <div
              role="alert"
              className={`p-3.5 rounded-xl border flex items-start space-x-2 text-xs ${
                feedback.type === "error"
                  ? "bg-rose-50 border-rose-200 text-rose-800"
                  : "bg-emerald-50 border-emerald-200 text-emerald-800"
              }`}
            >
              {feedback.type === "error" ? (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              )}
              <span className="font-medium">{feedback.message}</span>
            </div>
          )}

          <form onSubmit={handleCheckIn} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Select Tour Schedule *
              </label>
              <select
                required
                value={scheduleId}
                onChange={(e) => setScheduleId(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
              >
                <option value="">-- Choose Schedule Slot --</option>
                {(schedules || []).map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.tour_title} (
                    {new Date(s.start_time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    ) - {s.id.slice(0, 8)}...
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Booking Reservation ID (UUID) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
                value={bookingId}
                onChange={(e) => setBookingId(e.target.value)}
                className="w-full px-3 py-2 text-sm font-mono border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Attended Visitors Count *
              </label>
              <input
                type="number"
                min="1"
                max="50"
                required
                value={attendedCount}
                onChange={(e) =>
                  setAttendedCount(
                    Math.max(1, parseInt(e.target.value, 10) || 1),
                  )
                }
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Notes / Special Requests (Optional)
              </label>
              <textarea
                rows="2"
                placeholder="e.g. Wheelchair access provided, late arrival accommodated"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !bookingId || !scheduleId}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-lg text-sm font-semibold transition shadow-sm flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Recording Attendance...</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  <span>Record Check-in</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Attendance Summary & Report Generator */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileBarChart className="w-5 h-5 text-blue-600" />
              Tour Session Attendance Report
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Generate real-time attendance rate and capacity utilization
              report.
            </p>
          </div>

          <div className="flex gap-2">
            <select
              value={selectedReportScheduleId}
              onChange={(e) => handleFetchReport(e.target.value)}
              className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
            >
              <option value="">-- Choose Schedule to Inspect --</option>
              {(schedules || []).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.tour_title} (
                  {new Date(s.start_time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  )
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => handleFetchReport(selectedReportScheduleId)}
              disabled={!selectedReportScheduleId || isLoadingReport}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white rounded-lg text-sm font-medium transition shadow-sm flex items-center gap-1.5"
            >
              {isLoadingReport ? "Loading..." : "Generate"}
            </button>
          </div>

          {reportError && (
            <div
              role="alert"
              className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{reportError}</span>
            </div>
          )}

          {reportData ? (
            <div className="space-y-4 pt-2 animate-in fade-in duration-200">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">
                      {reportData.tour_title}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {new Date(reportData.start_time).toLocaleString()} -{" "}
                      {new Date(reportData.end_time).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full">
                      Capacity: {reportData.max_capacity}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="block text-xs text-slate-500 font-medium">
                    Total Booked
                  </span>
                  <span className="text-xl font-extrabold text-slate-900">
                    {reportData.total_booked}
                  </span>
                </div>
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <span className="block text-xs text-emerald-700 font-medium">
                    Attended
                  </span>
                  <span className="text-xl font-extrabold text-emerald-800">
                    {reportData.total_attended}
                  </span>
                </div>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <span className="block text-xs text-amber-700 font-medium">
                    No-Shows
                  </span>
                  <span className="text-xl font-extrabold text-amber-800">
                    {reportData.no_shows}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Percent className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-bold text-slate-800">
                    Attendance Rate
                  </span>
                </div>
                <span className="text-2xl font-black text-blue-700">
                  {Number(reportData.attendance_rate_percentage).toFixed(1)}%
                </span>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl text-xs text-slate-400">
              Select a schedule slot above to view real-time check-in metrics.
            </div>
          )}
        </div>
      </div>

      {/* Recent Check-in Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4 text-blue-600" />
            Recent Check-in Records
          </h4>
          <span className="text-xs text-slate-500">
            {attendanceRecords?.length || 0} check-in entries logged
          </span>
        </div>

        {!attendanceRecords || attendanceRecords.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No check-in records recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Record ID</th>
                  <th className="py-3 px-4">Booking ID</th>
                  <th className="py-3 px-4">Schedule ID</th>
                  <th className="py-3 px-4">Attended Count</th>
                  <th className="py-3 px-4">Check-in Time</th>
                  <th className="py-3 px-4">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {attendanceRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                      {rec.id.slice(0, 8)}...
                    </td>
                    <td className="py-3 px-4 font-mono text-blue-600 font-semibold">
                      {rec.booking_id}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {rec.schedule_id.slice(0, 8)}...
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {rec.attended_count}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {new Date(rec.check_in_time).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {rec.notes || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
