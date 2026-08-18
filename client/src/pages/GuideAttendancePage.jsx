import React, { useState, useEffect } from "react";
import Header from "../components/common/Header";
import AttendanceSheet from "../components/guide/AttendanceSheet";
import { schedulesAPI, attendanceAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { ClipboardCheck, Calendar, RefreshCw, AlertCircle } from "lucide-react";

export default function GuideAttendancePage() {
  const [schedules, setSchedules] = useState([]);
  const [selectedScheduleId, setSelectedScheduleId] = useState("");
  const [attendanceList, setAttendanceList] = useState([]);
  const [loadingSchedules, setLoadingSchedules] = useState(true);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [error, setError] = useState(null);

  const { user } = useAuth();

  const fetchSchedules = async () => {
    setLoadingSchedules(true);
    setError(null);
    try {
      const data = await schedulesAPI.listSchedules();
      setSchedules(data || []);
      if (data && data.length > 0 && !selectedScheduleId) {
        // Default select first schedule assigned to current user, or just first schedule
        const userAssigned = data.find((s) => s.guide_id === user?.id);
        setSelectedScheduleId(userAssigned ? userAssigned.id : data[0].id);
      }
    } catch (err) {
      setError("Failed to fetch tour schedules.");
    } finally {
      setLoadingSchedules(false);
    }
  };

  const fetchAttendance = async (scheduleId) => {
    if (!scheduleId) return;
    setLoadingAttendance(true);
    setError(null);
    try {
      const data = await attendanceAPI.getAttendanceSheet(scheduleId);
      setAttendanceList(data || []);
    } catch (err) {
      setError("Failed to load attendance sheet for selected schedule.");
    } finally {
      setLoadingAttendance(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  useEffect(() => {
    if (selectedScheduleId) {
      fetchAttendance(selectedScheduleId);
    }
  }, [selectedScheduleId]);

  const selectedSchedule = schedules.find((s) => s.id === selectedScheduleId);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <ClipboardCheck className="w-6 h-6 text-indigo-600" />
              <h1 className="text-2xl font-bold text-slate-900">
                Attendance & Check-in
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Select a schedule to record visitor check-ins or mark no-shows.
            </p>
          </div>

          <button
            onClick={() => {
              fetchSchedules();
              if (selectedScheduleId) fetchAttendance(selectedScheduleId);
            }}
            className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 hover:text-slate-900 px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm hover:bg-slate-50 transition-colors"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${loadingSchedules || loadingAttendance ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Schedule Selector */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <label className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5 whitespace-nowrap">
            <Calendar className="w-4 h-4 text-indigo-600" />
            <span>Select Tour Schedule:</span>
          </label>
          <select
            value={selectedScheduleId}
            onChange={(e) => setSelectedScheduleId(e.target.value)}
            disabled={loadingSchedules}
            className="w-full sm:flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            {schedules.length === 0 ? (
              <option value="">No schedules available</option>
            ) : (
              schedules.map((s) => {
                const tourName = s.tour?.name || "Tour";
                const dateStr = new Date(s.start_time).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                });
                const guideName = s.guide?.full_name
                  ? ` (Guide: ${s.guide.full_name})`
                  : "";

                return (
                  <option key={s.id} value={s.id}>
                    {tourName} — {dateStr} {guideName}
                  </option>
                );
              })
            )}
          </select>
        </div>

        {/* Attendance Roster Component */}
        {loadingAttendance ? (
          <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm animate-pulse space-y-4">
            <div className="h-6 bg-slate-200 rounded w-1/3"></div>
            <div className="h-12 bg-slate-100 rounded w-full"></div>
            <div className="h-12 bg-slate-100 rounded w-full"></div>
          </div>
        ) : (
          <AttendanceSheet
            schedule={selectedSchedule}
            attendanceList={attendanceList}
            onRefresh={() => fetchAttendance(selectedScheduleId)}
          />
        )}
      </main>
    </div>
  );
}
